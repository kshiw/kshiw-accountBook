<template>
    <div class="home">

        <scroll ref="scroller" :data="list">
            <div class="item-ob" v-for="(item,index) in list" :key="index" :class="{'expire': item.status == '-1'}">
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
                    <div class="status">{{statusList[item.status]}}</div>
                    <div class="name">{{item.name}}</div>
                    <div style="display: flex; justify-content: space-between">
                        <div class="type"><i class="iconfont icon-leixing"></i>{{item.type}}</div>
                        <div class="sum"><i class="iconfont icon-xiaoshouzonge"></i>{{(item.price * (1 + item.rate * 1)).toFixed(2)}}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between">
                        <div class="price"><i class="iconfont icon-jinqian"></i>{{item.price}}</div>
                        <div class="profit"><i class="iconfont icon-shouyi1"></i>{{(item.price * (item.rate / item.day)).toFixed(2)}} / {{ (item.price * item.rate).toFixed(2)}}</div>
                    </div>
                    <div class="btn-list">
                        <x-button class="btn-item" @click.native="deleteItem(index)">删除</x-button>
                    </div>
                </div>
            </div>
        </scroll>
        {{sum}}
        <div>
            <confirm v-model="deleteFlag" title="确定要删除咩？" @on-confirm="deleteExecution" />
        </div>
    </div>
</template>

<script>
    import Scroll from '@/components/scroll'
    export default {
        components: {
            Scroll
        },
        name: 'home',
        data() {
            return {
                initList: localStorage.getItem('accountListLog') ? JSON.parse(localStorage.getItem('accountListLog')) : [],
                list: [],
                deleteFlag:false,
                deleteIndex: null,
                statusList: {
                    '-1': '已过期',
                    '1': '收益中'
                }
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
                    profit: 0
                })
                console.log(_sum)
                return _sum
            }
        },
        methods:{
            weekRt(date) {
                const weekKey = ['SUN', 'MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT']
                return weekKey[new Date(date).getDay()]
            },
            deleteItem(index) {
                this.deleteFlag = true
                this.deleteIndex = index
            },
            deleteExecution() {
                this.list.splice(this.deleteIndex, 1)
                window.localStorage.setItem('accountListLog', JSON.stringify(this.list))
            }
        },
        mounted() {
            let list = []
            const totalSeconds = 24 * 60 * 60 * 1000
            const now = new Date()
            for (let i = 0, len = this.initList.length; i < len; i++) {
                const item = this.initList[i]
                const startTemp = (new Date(item.createTime)).getTime()
                let calc = new Date(startTemp + totalSeconds * item.day)
                item.endTime = `${calc.getFullYear()}-${calc.getMonth()+1 < 10 ? '0' + (calc.getMonth()+1) : calc.getMonth()+1}-${calc.getDate() < 10 ? '0' + calc.getDate() : calc.getDate()} ${calc.getHours()}:${calc.getMinutes()}:${calc.getSeconds()}`
                item.status = calc.getTime() < now.getTime() ? '-1' : '1'
                list[i] = {...item}
            }
            this.list = list
        }
    }
</script>

<style scoped lang="less">
    .item-ob {
        display: flex; margin: 20px; border-radius: 5PX; overflow: hidden; box-shadow: 0px 5px 10px 1px rgba(125,185,232,0.3);
        background: rgb(125,185,232);
        background: -moz-linear-gradient(-45deg,  rgba(125,185,232,1) 21%, rgba(125,185,232,1) 21%, rgba(148,94,246,1) 100%);
        background: -webkit-linear-gradient(-45deg,  rgba(125,185,232,1) 21%,rgba(125,185,232,1) 21%,rgba(148,94,246,1) 100%);
        background: linear-gradient(135deg,  rgba(125,185,232,1) 21%,rgba(125,185,232,1) 21%,rgba(148,94,246,1) 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#7db9e8', endColorstr='#945ef6',GradientType=1 );

        &.expire {
            background: rgb(254,187,187);
            background: -moz-linear-gradient(45deg,  rgba(254,187,187,1) 0%, rgba(254,144,144,1) 45%, rgba(255,92,92,1) 100%);
            background: -webkit-linear-gradient(45deg,  rgba(254,187,187,1) 0%,rgba(254,144,144,1) 45%,rgba(255,92,92,1) 100%);
            background: linear-gradient(45deg,  rgba(254,187,187,1) 0%,rgba(254,144,144,1) 45%,rgba(255,92,92,1) 100%);
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#febbbb', endColorstr='#ff5c5c',GradientType=1 );
            box-shadow: 0px 5px 10px 1px rgba(243,197,189,0.3);
        }

        .day-tip {
            flex: 0 0 160px; padding: 20px 0; color: #4B4B6A; display: flex; flex-wrap: wrap;  background: #fff; align-items:center; align-content: center;
            .time {
                width: 100%;line-height: 1.3;
                span {
                    display: block; font-size: 32px; font-weight: bold;
                }
                b{font-size: 24px;}
            }
            .line{width: 2px; height: 30px; background: #E98D7B; margin: 10px auto;}
        }
        .content {
            flex: 1; text-align: left; color: #fff; padding: 15px; position: relative; font-size: 26px;
            .name{ font-size: 30px; height: 45px}
            i.iconfont{margin-right: 4PX}
            .status {position: absolute; top: 10px; right: 10px; font-size: 26px}
            .btn-list{
                text-align: right; margin-top: 20px;
                .btn-item{
                    display: inline-block; vertical-align: top; width: auto; font-size: 24px; background: #fff; color: #666;
                }
            }
        }
    }
</style>
