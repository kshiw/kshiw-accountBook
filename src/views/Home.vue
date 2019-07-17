<template>
    <div class="home">
        <div style="display: flex; top: 0; height: 44PX; border-bottom: 1px #D7D6DC solid;">
            <search v-model="search" position="absolute" auto-scroll-to-top ref="search" @on-submit="searchKey"
                    placeholder="筛选关键字之间加空格"></search>
            <div @click.stop="addItem"
                 style="flex: 0 0 60px; background: #EFEFF4; color: #4B4B6A; font-size: 14px; line-height: 44PX">新增
            </div>
        </div>
        <filters v-if="filterData" :filterData="filterData" :currenSelect="currentSelect"
                 @select="selectItem"></filters>
        <div style="position: fixed; left: 0; right: 0; top: 80PX; bottom: 50PX">
            <div class="tips" v-if="!list.length && !search">
                温馨提示：该工具仅支持android6.0 或 IOS9 以上系统 <br>不支持微信自带浏览器<br>
            </div>
            <div class="tips" v-if="!list.length && search">找不到相关记录</div>
            <scroll ref="scroller" :data="list">
                <div class="item-ob" v-for="(item,index) in list" :key="index" :class="{'expire': item.status == '-1'}">
                    <div class="num" style="position: absolute; top: 4px; left: 4px; color: #aaa">{{index+1}}</div>
                    <div class="day-tip">
                        <span class="time">
                            <span>{{weekRt(item.createTime)}}</span>
                            <b>{{item.createTime.substring(5, 10)}}</b>
                        </span>
                        <div class="line"></div>
                        <span class="time">
                            <span>{{weekRt(item.endTime)}}</span>
                            <b>{{item.endTime && item.endTime.substring(5, 10)}}</b>
                        </span>
                    </div>
                    <div class="content">
                        <div class="status">{{item.status_m ? `还有${item.status_m}小时到期` : statusList[item.status]}}</div>
                        <div class="name">
                            <div class="label-list"><span v-for="(label,labelIndex) in item.label" :key="labelIndex">{{label}}</span>
                            </div>
                            {{item.name}}
                        </div>
                        <div style="display: flex; justify-content: space-between">
                            <div class="type"><i class="iconfont icon-leixing"></i>{{item.type}}</div>
                            <div class="sum"><i class="iconfont icon-xiaoshouzonge"></i>{{(item.price * (1 + item.rate *
                                1)).toFixed(2)}}
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between">
                            <div class="price"><i class="iconfont icon-jinqian"></i>{{item.price}}</div>
                            <div class="profit"><i class="iconfont icon-shouyi1"></i>{{(item.price * (item.rate /
                                item.day)).toFixed(2)}} / {{ (item.price * item.rate).toFixed(2)}}
                            </div>
                        </div>
                        <div class="btn-list">
                            <!--<x-button class="btn-item" @click.native="ew(index)">id</x-button>-->
                            <x-button class="btn-item" @click.native="deleteItem(index)">删除</x-button>
                        </div>
                    </div>
                </div>
            </scroll>
        </div>
        <card style="position: fixed; bottom: 0; width: 100%" v-if="sum.sumPrice">
            <div slot="content" class="card-demo-flex">
                <div class="vux-1px-r">
                    <span>总资产</span>
                    <br/>
                    <countup :end-val="sum.sumPrice" :start-val="0" :duration="3" :decimals="2" class="demo1"></countup>
                </div>
                <div class="vux-1px-r">
                    <span>投入资产</span>
                    <br/>
                    <countup :end-val="sum.price" :start-val="0" :duration="3" :decimals="2" class="demo1"></countup>
                </div>
                <div class="vux-1px-r">
                    <span>总收益</span>
                    <br/>
                    <countup :end-val="sum.profit" :start-val="0" :duration="3" :decimals="2" class="demo1"></countup>
                </div>
                <div>
                    <span>日收益</span>
                    <br/>
                    <countup :end-val="sum.dayProfit" :start-val="0" :duration="3" :decimals="2" class="demo1"></countup>
                </div>
            </div>
        </card>
        <div>
            <confirm v-model="deleteFlag" title="确定要删除咩？" @on-confirm="deleteExecution"/>
        </div>
    </div>
</template>

<script>
    import {Search, Card, Countup} from 'vux'
    import Scroll from '@/components/scroll'
    import Filters from '@/components/filter'

    const totalSeconds = 24 * 60 * 60 * 1000
    const now = new Date()

    export default {
        components: {
            Scroll, Search, Filters, Card, Countup
        },
        name: 'home',
        data() {
            const statusList = {}
            for (let i = 0, len = 24; i < len; i++) {
                statusList[i] = `约${i}小时后到期`
            }
            return {
                filterData: null,
                initList: localStorage.getItem('accountListLog') ? JSON.parse(localStorage.getItem('accountListLog')) : [],
                list: [],
                deleteFlag: false,
                deleteIndex: null,
                statusList: {
                    '-1': '已过期',
                    '00': '收益中',
                    ...statusList
                },
                search: '',
                currentSelect: {},
                selectCur: null
            }
        },
        computed: {
            sum() {
                let _sum = this.list.reduce((sum, cur) => {
                    sum.price += Number(cur.price)
                    sum.dayProfit += Number((cur.price * (cur.rate / cur.day)).toFixed(2))
                    sum.profit += Number((cur.price * cur.rate).toFixed(2))
                    return sum
                }, {
                    price: 0,
                    dayProfit: 0,
                    profit: 0,
                    sumPrice: 0
                })
                _sum.sumPrice = (_sum.price + _sum.profit)
                return _sum
            }
        },
        methods: {
            searchKey(key) {
                let search = (key || this.search).split(' ')
                let list = []
                let cfList = []
                for (let i = 0, len = search.length; i < len; i++) {
                    this.initList.forEach(item => {
                        let _filter = []
                        if (item.label instanceof Array) {
                            _filter = item.label.filter(find => find.indexOf(search[i]) !== -1)
                        }
                        if (item.name && item.name.indexOf(search[i]) !== -1 || item.type && item.type.indexOf(search[i]) !== -1 || _filter.length !== 0) {
                            // 判断是否重复
                            if (!cfList.includes(item.id)) {
                                cfList.push(item.id)
                                list.push(item)
                            }
                        }
                    })
                }
                this.list = list
            },
            // 返回星期X
            weekRt(date) {
                const weekKey = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT']
                return weekKey[new Date(date).getDay()]
            },
            deleteItem(index) {
                this.deleteFlag = true
                this.deleteIndex = index
            },
            deleteExecution() {
                let id = this.list[this.deleteIndex].id
                let index = this.initList.findIndex(item => item.id == id)
                this.initList.splice(index, 1)
                this.listUpdate(this.initList)
            },
            selectItem(val) {
                this.selectCur = val
                let list = []
                let status = val.status
                let time = ''
                let _now = +new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`)
                if (val.time == 1) {
                    time = _now
                }
                if (val.time == 2) {
                    time = +new Date(_now - totalSeconds * 7)
                }
                if (val.time == 3) {
                    time = +new Date(_now - totalSeconds * 30)
                }
                if (status == '24') {

                }
                this.initList.forEach(item => {
                    if ((status ? (status == '24' ? item.status_m : item.status == status) : item.status) && (val.time ? +new Date(item.createTime) > time : item.createTime)) {
                        list.push(item)
                    }
                })
                this.list = list
            },
            setFilterData() {
                let data = [
                    {
                        name: '状态',
                        key: 'status',
                        options: [
                            {"key": "", "name": "不限"},
                            {"key": "00", "name": "收益中"},
                            {"key": "-1", "name": "已过期"},
                            {"key": "24", "name": "24小时内"},
                        ]
                    },
                    {
                        name: '时间',
                        key: 'time',
                        options: [
                            {"key": "", "name": "不限"},
                            // {"key": "1", "name": "今天"},
                            {"key": "2", "name": "一星期内"},
                            {"key": "3", "name": "一个月内"}
                        ]
                    },
                ];
                this.filterData = data;
            },
            addItem() {
                this.$router.push('add')
            },
            init() {
                let list = []
                for (let i = 0, len = this.initList.length; i < len; i++) {
                    const item = this.assembly(this.initList[i])
                    list[i] = {...item}
                }
                this.initList = list
                this.list = list
            },
            // 拼装数据
            assembly(item) {
                const startTemp = (new Date(item.createTime)).getTime()
                let end = new Date(startTemp + totalSeconds * item.day)
                item.endTime = `${end.getFullYear()}-${end.getMonth() + 1 < 10 ? '0' + (end.getMonth() + 1) : end.getMonth() + 1}-${end.getDate() < 10 ? '0' + end.getDate() : end.getDate()} ${end.getHours()}:${end.getMinutes()}`
                let pic = end.getTime() - now.getTime()
                if (pic < 0) {
                    item.status = '-1'
                } else {
                    let sy = Math.ceil(pic / (60 * 60 * 1000))
                    if (sy < 24) {
                        item.status_m = sy
                    }
                    item.status = '00'
                }
                return item
            },
            listUpdate(list) {
                console.log('listUpdate', list)
                if (this.search) {
                    this.searchKey(this.search)
                }
                if (this.selectCur) {
                    this.selectItem(this.selectCur)
                }
                window.localStorage.setItem('accountListLog', JSON.stringify(list))
            }
        },
        mounted() {
            this.init()
            this.setFilterData()
        }
    }
</script>

<style scoped lang="less">
    .tips {
        padding-top: 30PX;
        line-height: 2;
        color: #4B4B6A;
    }

    .item-ob {
        display: flex;
        position: relative;
        margin: 20px;
        border-radius: 5PX;
        overflow: hidden;
        box-shadow: 0px 5px 10px 1px rgba(125, 185, 232, 0.3);
        background: rgb(125, 185, 232);
        background: -moz-linear-gradient(-45deg, rgba(125, 185, 232, 1) 21%, rgba(125, 185, 232, 1) 21%, rgba(148, 94, 246, 1) 100%);
        background: -webkit-linear-gradient(-45deg, rgba(125, 185, 232, 1) 21%, rgba(125, 185, 232, 1) 21%, rgba(148, 94, 246, 1) 100%);
        background: linear-gradient(135deg, rgba(125, 185, 232, 1) 21%, rgba(125, 185, 232, 1) 21%, rgba(148, 94, 246, 1) 100%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#7db9e8', endColorstr='#945ef6', GradientType=1);

        &.expire {
            background: rgb(254, 187, 187);
            background: -moz-linear-gradient(45deg, rgba(254, 187, 187, 1) 0%, rgba(254, 144, 144, 1) 45%, rgba(255, 92, 92, 1) 100%);
            background: -webkit-linear-gradient(45deg, rgba(254, 187, 187, 1) 0%, rgba(254, 144, 144, 1) 45%, rgba(255, 92, 92, 1) 100%);
            background: linear-gradient(45deg, rgba(254, 187, 187, 1) 0%, rgba(254, 144, 144, 1) 45%, rgba(255, 92, 92, 1) 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#febbbb', endColorstr='#ff5c5c', GradientType=1);
            box-shadow: 0px 5px 10px 1px rgba(243, 197, 189, 0.3);
        }

        .day-tip {
            flex: 0 0 160px;
            padding: 30px 0;
            color: #4B4B6A;
            display: flex;
            flex-wrap: wrap;
            background: #fff;
            align-items: center;
            align-content: center;

            .time {
                width: 100%;
                line-height: 1.3;

                span {
                    display: block;
                    font-size: 32px;
                    font-weight: bold;
                }

                b {
                    font-size: 24px;
                }
            }

            .line {
                width: 2px;
                height: 30px;
                background: #E98D7B;
                margin: 10px auto;
            }
        }

        .content {
            flex: 1;
            text-align: left;
            color: #fff;
            padding: 15px;
            position: relative;
            font-size: 26px;

            .name {
                font-size: 30px;
                min-height: 45px;
                width: 400px;
                word-break: break-all;
                line-height: 42px;
                margin-bottom: 10px;

                .label-list {
                    display: inline-block;
                    vertical-align: top;

                    span {
                        margin-right: 10px;
                    }
                }
            }

            i.iconfont {
                margin-right: 4PX
            }

            .status {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 26px
            }

            .btn-list {
                text-align: right;
                margin-top: 20px;

                .btn-item {
                    display: inline-block;
                    vertical-align: top;
                    width: auto;
                    font-size: 24px;
                    background: #fff;
                    color: #666;
                }
            }
        }
    }

    .card-demo-flex {
        display: flex;
    }

    .card-demo-flex > div {
        flex: 1;
        text-align: center;
        font-size: 14PX;
        padding: 6PX 0;
    }

    .card-demo-flex span {
        color: #4B4B6A;
    }
</style>
