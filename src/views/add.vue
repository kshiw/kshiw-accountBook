<template>
    <div>
        <x-header :left-options="{showBack: true}">add Item</x-header>
        <div style="position: fixed; width: 100%; top: 46PX; bottom: 0">
            <scroll ref="scroller" :data="typeList">
                <group label-width="100px" label-align="left">
                    <x-input v-model.number="addForm.price" title="价格(￥)" ref="price" placeholder="10000.00" :debounce="500" @on-change="priceCalc" required></x-input>
                </group>
                <group label-width="100px" label-align="left">
                    <cell title="标签" class="label-we-box">
                        <div class="checkbox-wrap">
                            <checker
                                class="checkbox-content"
                                v-model="addForm.label"
                                type="checkbox"
                                default-item-class="checkbox-item"
                                selected-item-class="checkbox-item-selected"
                            >
                                <checker-item v-for="(i, index) in labelList" :key="i" :value="i">{{i}} <i class="iconfont icon-close" @click.stop="deleteLabel(index)"></i></checker-item>
                            </checker>
                            <i class="iconfont icon-Plus" @click.stop="labelSetFlag = true"></i>
                        </div>
                    </cell>
                </group>
                <group label-width="100px" label-align="left">
                    <x-input v-model="addForm.name" title="名称/备注" placeholder="非必填"></x-input>
                </group>
                <group label-width="100px" label-align="left">
                    <popup-picker title="种类" :data="typeList" show-name v-model="addForm.type" value-text-align="left"
                                  placeholder="输入价格自动补充"></popup-picker>
                </group>
                <group label-width="100px" label-align="left">
                    <datetime v-model="addForm.createTime" format="YYYY-MM-DD" title="领养日期"></datetime>
                </group>
                <group label-width="100px" label-align="left">
                    <datetime v-model="addForm.adoptTime" format="HH:mm" title="领养时间"></datetime>
                </group>
                <group label-width="100px" label-align="left">
                    <x-input v-model="addForm.rate" title="利率" placeholder="示例：0.20" required></x-input>
                </group>
                <group label-width="100px" label-align="left">
                    <x-number fillable ref="dayPri" @touchstart.native="dayTouchStart" @touchmove.native="dayTouchMove"
                              @touchend.native="dayTouchEnd" title="收益天数" align="left" v-model="addForm.day"
                              button-style="round" :min="0" :max="100"></x-number>
                </group>
                <br>
                <br>
                <x-button class="submit-btn" @click.native="addItem(false)" action-type="submit" :disabled="disabled">
                    完成
                </x-button>
                <x-button class="submit-btn" action-type="submit" @click.native="continueAdd" :disabled="disabled">
                    继续新增
                </x-button>
                <br>
            </scroll>
        </div>
        <toast v-model="toastFlag" type="text" :time="1200" width="8.5em" is-show-mask position="top"
               :text="showPositionValue"/>

        <div v-transfer-dom>
            <confirm class="plan-a" v-model="labelSetFlag" show-input ref="confirm5" title="新增标签" @on-confirm="onConfirm5" />
        </div>

        <div v-transfer-dom>
            <confirm
                v-model="deleteLabelFlag"
                title="确定删除该标签？"
                @on-confirm="deleteLabelSuccess">
                <p style="text-align:center;">删除后将无法恢复</p>
            </confirm>
        </div>
    </div>
</template>

<script>
    import {XInput, Datetime, PopupPicker, XNumber, Checker, CheckerItem, TransferDomDirective as TransferDom } from 'vux'
    import {typeOptions} from '@/common/config'
    import Scroll from '@/components/scroll'

    const NOW = new Date()
    export default {
        directives: {
            TransferDom
        },
        components: {
            XInput,
            Datetime,
            PopupPicker,
            Scroll,
            XNumber,
            Checker,
            CheckerItem
        },
        data() {
            return {
                labelSetFlag: false,
                deleteLabelIndex: null,
                deleteLabelFlag: false,
                log: localStorage.getItem('accountListLog') ? JSON.parse(localStorage.getItem('accountListLog')) : [],
                labelList: localStorage.getItem('accountLabelLog') ? JSON.parse(localStorage.getItem('accountLabelLog')) : [],
                addForm: {
                    createTime: NOW.Format('yyyy-MM-dd'),
                    label: []
                },
                toastFlag: false,
                showPositionValue: null,
                typeList: [],
                options: typeOptions,
                touchObj: {}
            }
        },
        computed: {
            disabled() {
                if (!this.addForm.price || !this.addForm.rate || !this.addForm.day || !this.addForm.createTime) return true
                return false
            }
        },
        methods: {
            // 收益天数touch事件
            dayTouchStart(e) {
                for (let i of e.path) {
                    if (i.className == 'vux-number-selector vux-number-selector-plus') {
                        this.touchObj.flag = 'plus'
                        e.preventDefault()
                        break
                    }
                    if (i.className == 'vux-number-selector vux-number-selector-sub') {
                        this.touchObj.flag = 'sub'
                        e.preventDefault()
                        break
                    }
                }
                this.dayTouchMove(e)
                // e.preventDefault()
            },
            dayTouchMove() {
                clearInterval(this.touchObj.time)
                this.touchObj.speed = this.touchObj.speed ? (this.touchObj.speed > 30 ? 30 : ++this.touchObj.speed) : 1
                if (this.touchObj.flag == 'plus') {
                    this.touchObj.time = setInterval(() => {
                        this.$refs['dayPri'].add()
                        this.dayTouchMove()
                    }, 150 - (this.touchObj.speed * 4))
                }
                if (this.touchObj.flag == 'sub') {
                    this.touchObj.time = setInterval(() => {
                        this.$refs['dayPri'].sub()
                        this.dayTouchMove()
                    }, 150 - (this.touchObj.speed * 4))
                }
                // return this.dayTouchMove()
            },
            dayTouchEnd() {
                clearInterval(this.touchObj.time)
                this.touchObj = {}
            },

            priceCalc(val) {
                if (!isNaN(val)) {
                    let list = []
                    this.options.forEach((i, k) => {
                        if (val >= i.minPrice && val < i.maxPrice) {
                            list.push({
                                name: i.type,
                                value: '' + k
                            })
                        }
                    })
                    if (list.length == 0) return
                    this.typeList = [list]
                    this.$nextTick(() => {
                        this.$set(this.addForm, 'type', [list[0]['value']])
                    })
                }
            },
            // submit
            addItem(flag = false) {
                const reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
                if (!reg.test(this.addForm.price)) {
                    this.toastFlag = true
                    this.showPositionValue = '价格格式错误呀'
                    return
                }
                const rateReg = /^(1|0(\.\d{1,2})?)$/
                if (!rateReg.test(this.addForm.rate)) {
                    this.toastFlag = true
                    this.showPositionValue = '利率格式错误呀'
                    return
                }
                let params = {...this.addForm}
                params.createTime += ' ' + params.adoptTime
                if (params.type) {
                    params.type = this.options[params.type].type
                }
                params.id = +new Date() / 1000
                delete params.adoptTime
                this.log.push(params)
                console.log(params)
                // return
                window.localStorage.setItem('accountListLog', JSON.stringify(this.log))
                if (!flag) {
                    this.$router.go(-1)
                }
            },
            // 继续新增 *清空
            continueAdd() {
                this.addItem(true)
                let res = {...this.addForm}
                this.addForm = {
                    createTime: res.createTime,
                    name: res.name,
                    label: res.label
                }
                this.log = JSON.parse(localStorage.getItem('accountListLog'))
            },
            onConfirm5 (value) {
                console.log(value, this.labelList)
                if (value) {
                    this.labelList.push(value + '')
                    localStorage.setItem('accountLabelLog', JSON.stringify(this.labelList))
                }

                this.$refs.confirm5.setInputValue('')
            },
            deleteLabel(index) {
                this.deleteLabelFlag = true
                this.deleteLabelIndex = index
            },
            deleteLabelSuccess() {
                this.labelList.splice(this.deleteLabelIndex, 1)
                localStorage.setItem('accountLabelLog', JSON.stringify(this.labelList))
            }
        },
        watch: {
            'addForm.type'(val) {
                console.log(val)
                if (!val || val.length == 0) return
                let cur = this.options[val]
                Object.assign(this.addForm, {
                    rate: cur.rate,
                    adoptTime: cur.adoptTime,
                    day: cur.day,
                })
            }
        }
    }
</script>

<style lang="less">
    .weui-cell__ft {
        text-align: left;
    }
    .vux-cell-bd.vux-cell-primary {flex: 0 0 100px}

    .label-we-box {
        .weui-cell__ft {
            flex: 1;
        }
    }
</style>

<style scoped lang="less">
    .submit-btn {
        width: 90% !important;
    }
    .checkbox-wrap {
        display: flex; width: 100%;
        justify-content: space-between;
        .checkbox-content{flex: 1}
        .iconfont {font-size: 50px; color: #55acee}
    }
    .checkbox-item {
        display: inline-block;
        padding: 0 10px;
        width: auto;
        line-height: 50px;
        height: 50px;
        text-align: center;
        border-radius: 3PX;
        border: 1px solid #ccc;
        background-color: #fff;
        margin: 8px;
        .iconfont {
            font-size: 30px; color: #febbbb;
        }
    }
    .checkbox-item-selected {
        background: #ffffff url(../assets/active1.png) no-repeat left bottom;
        border-color: #ff4a00;
    }
</style>
