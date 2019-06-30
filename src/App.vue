<template>
    <div id="app">
        <router-view class="routerView"/>
        <tabbar>
            <tabbar-item>
                <span slot="label" @click="tabCk('/')">home</span>
            </tabbar-item>
            <tabbar-item badge="2">
                <span slot="label" @click="tabCk('add')">add</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>

<script>
    import { Tabbar, TabbarItem } from 'vux'

    export default {
        components: {
            Tabbar,
            TabbarItem
        },
        methods: {
            tabCk(to) {
                this.$router.push(to)
            }
        }
    }
</script>

<style lang="less">
    @import '~vux/src/styles/reset.less';
    @import "//at.alicdn.com/t/font_1268002_9inddc65nvf.css";
    html{ font-size:10vw; }
    .iconfont{
        font-family:"iconfont" !important;
        font-size:26px;font-style:normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        background: #efeff4;
        font-size: 26px;
        overflow: hidden;
    }
    .routerView {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 50PX;
        top: 0;
    }
    .vux-cell-value {
        color: #2c3e50 !important;
    }
</style>
