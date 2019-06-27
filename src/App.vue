<template>
    <div id="app">
        <router-view/>
        <tabbar>
            <tabbar-item>
                <span slot="label">home</span>
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

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
