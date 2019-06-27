<template>
    <div class="home">
        <x-table>
            <thead>
            <tr>
                <th width="26%">名称</th>
                <th width="26%">金额</th>
                <th>收益(日/总)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in list">
                <td>{{item.name}}</td>
                <td>{{item.price}}</td>
                <td>
                    {{(item.price * (item.rate / item.day)).toFixed(2)}} / {{ (item.price * item.rate).toFixed(2)}}
                    <x-icon @click="deleteItem(index)" style="position: absolute; right: 3px; transform: translate(0, -50%); top: 50%;" type="ios-close" size="15"></x-icon>
                </td>
            </tr>
            <tr>
                <td>总计</td>
                <td>{{sum.price}}</td>
                <td>{{sum.dayProfit}} / {{sum.profit}}</td>
            </tr>
            </tbody>
        </x-table>

        <div v-transfer-dom>
            <confirm v-model="deleteFlag" title="确定要删除咩？" @on-confirm="deleteExecution" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                list: localStorage.getItem('accountListLog') ? JSON.parse(localStorage.getItem('accountListLog')) : [],
                deleteFlag:false,
                deleteIndex: null
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
                return _sum
            }
        },
        methods:{
            deleteItem(index) {
                this.deleteFlag = true
                this.deleteIndex = index
            },
            deleteExecution() {
                this.list.splice(this.deleteIndex, 1)
                window.localStorage.setItem('accountListLog', JSON.stringify(this.list))
            }
        }
    }
</script>
