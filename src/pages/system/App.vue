<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <navigation></navigation>
      <router-view/>
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
  data () {
    return {
      zh_CN
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
</style>
