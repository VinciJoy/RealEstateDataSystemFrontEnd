<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <navigation></navigation>
      <router-view v-if="isRouterAlive"></router-view>
      <systemFooter></systemFooter>
    </div>
  </a-config-provider>
</template>

<script>
// eslint-disable-next-line camelcase
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import navigation from './views/components/navigation'
import systemFooter from './views/components/systemFooter'

moment.locale('zh-cn')

export default {
  name: 'App',
  components: {
    navigation: navigation,
    systemFooter: systemFooter
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      zh_CN,
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html,body,#app{

 height: 100%;

}
</style>
