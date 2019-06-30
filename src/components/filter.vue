<template>
    <div class="filter-box">
        <div class="filter flex-row">
            <p v-for="(v, k) in data" :key="k" :class="filterIndex==k? 'active':''" @click="itemClicked(k)">{{v.name}}</p>
        </div>
        <div class="filter-overlay" :class="filterShow? 'active':''" @click="filterShow=false; filterIndex='-1'">
            <div v-if="filterShow" class="filter-column">
                <div v-for="(v, k) in data" :key="k">
                    <div v-if="k==filterIndex">
                        <p v-for="(vv, kk) in v['options']" :key="kk" :class="filterSelect[v.key] == vv.key ?'active':''" @click.stop="selectItem(v.key ,vv.key)">
                            <span>{{vv.name}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {

                data: [],

                // 当前点击选中的筛选类目
                filterIndex: "-1",

                // 是否展开筛选项
                filterShow: false,

                //已选中的项
                filterSelect: {
                }
            }
        },
        // filterData:所有的数据(必填参数)   currenSelect:已选在数据(可选参数)
        props: ['filterData', 'currenSelect'],
        mounted() {
            let total = this.filterData;
            if (total) {
                this.data = this.filterData;
                // 初始化默认选中的选项
                total.forEach(element => {
                    let key = element['key'];
                    console.log(key);
                    let value = element['options'] ? element['options'][0]["key"]: "";
                    this.filterSelect[key] = value;
                });
            }
        },
        methods: {
            // 筛选条目被点击
            itemClicked(k) {
                this.filterIndex = k;
                if (!this.filterShow) {
                    this.filterShow = true;
                }
            },

            // 选中了某一个选项
            selectItem(k, kk) {
                this.filterSelect[k] = kk;
                this.$emit("select", this.filterSelect);
                this.filterShow = false;
                this.filterIndex = "-1";
            }

        }
    }
</script>

<style scoped>
    .filter-box .filter {
        height: 35PX;
        line-height: 35PX;
        z-index: 101;
        background-color: #fff;
        display: flex;
        border-bottom: 1px #eee solid;
    }
    .filter-box .filter p {
        text-align: center;
        flex: 1;
        text-indent: -5PX;
    }
    .filter-box .filter p::after {
        content: "";
        display: inline-block;
        width: 4PX;
        height: 4PX;
        border-left: solid 1PX #797979;
        border-top: solid 1PX #797979;
        transform: rotate(-135deg);
        position: relative;
        top: -3PX;
        left: 5PX;
        transition: all .3s ease 0s;
    }
    .filter-box .filter p.active::after {
        transform: rotate(45deg);
        top: 0;
    }
    .filter-box .filter-overlay {
        position: fixed;
        width: 100%;
        height: 0;
        top: 79PX;
        left: 0;
        background-color: transparent;
        transition: background-color 0.5s ease;
        z-index: 100;
    }
    .filter-box .filter-overlay.active {
        background-color: rgba(0, 0, 0, 0.6);
        height: 100%;
    }
    .filter-box .filter-column {
        z-index: 101;
        background-color: #fff;
    }
    .filter-box .filter-column p {
        height: 40PX;
        line-height: 40PX;
        padding-left: 20PX;
    }
    .filter-box .filter-column p span {
        font-size: 16PX;
        color: #aaa;
    }

    .filter-box .filter-column p.active{
        background: #f8f8fa;
        color: #4b4b4b;
    }
</style>
