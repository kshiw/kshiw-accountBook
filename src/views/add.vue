<template>
    <div>
        <x-header :left-options="{showBack: true}">add Item</x-header>
        <group label-width="100px" label-align="left">
            <x-input v-model="addForm.name"  title="项目名称" placeholder="" required></x-input>
        </group>
        <group label-width="100px" label-align="left">
            <x-input v-model="addForm.price" title="价格(￥)" ref="price" placeholder="10000.00" required></x-input>
        </group>
        <group label-width="100px" label-align="left">
            <x-input v-model="addForm.rate" title="利率"  placeholder="0.20" required></x-input>
        </group>
        <group label-width="100px" label-align="left">
            <x-input v-model="addForm.day" title="收益天数"  placeholder="" required></x-input>
        </group>
        <br>
        <br>
        <x-button @click.native="addItem(false)" action-type="submit" :disabled="disabled">完成</x-button>
        <x-button action-type="submit" @click.native="continueAdd" :disabled="disabled">继续新增</x-button>
        <toast v-model="toastFlag" type="text" :time="1200" width="8.5em" is-show-mask position="top" :text="showPositionValue" />
    </div>
</template>

<script>
    import { XInput } from 'vux'

    export default {
        components: {
            XInput
        },
        data() {
            return {
                log: localStorage.getItem('accountListLog') ? JSON.parse(localStorage.getItem('accountListLog')) : [],
                addForm: {},
                toastFlag: false,
                showPositionValue: null
            }
        },
        computed:{
            disabled () {
                if (!this.addForm.name || !this.addForm.price || !this.addForm.rate || !this.addForm.day) return true
                return false
            }
        },
        methods: {
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
                this.log.push(params)
                window.localStorage.setItem('accountListLog', JSON.stringify(this.log))
                if (!flag) {
                    this.$router.go(-1)
                }
            },
            continueAdd() {
                this.addItem(true)
                this.addForm = {}
            }
        }
    }
</script>

<style scoped>

</style>
