<template>
    <div id="app">
        <router-view class="routerView"/>
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang="less">
    @import '~vux/src/styles/reset.less';
    @import "//at.alicdn.com/t/font_1268002_dvdqws0dn9j.css";
    html{ font-size:10vw; }
    .weui-search-bar:after {border-bottom: none !important}
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
        bottom: 0PX;
        top: 0;
    }
    .vux-cell-value {
        color: #2c3e50 !important;
    }
    .vux-confirm {
        font-size: 0;
        .weui-dialog__hd {
            padding: 10px 30px;
        }
        &.plan-a {
            .weui-dialog__hd {
                border-bottom: 1px #eee solid; margin-bottom: 20px; text-align: left; box-sizing: border-box;
            }
        }
        .vux-prompt-msgbox {font-size: 18PX}
        .vux-prompt {
            padding-bottom: 30px !important;
        }
    }
</style>
