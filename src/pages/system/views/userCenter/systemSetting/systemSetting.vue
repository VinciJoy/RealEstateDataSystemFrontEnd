<template>
  <div>
    系统公告:
    <a-textarea v-model="form.notice" class="mt-10"></a-textarea>
    <a-row class="mt-20" :gutter="20">
      <a-col :span="8">一月会员：<a-input v-model="oneMonthPrice" type="number" suffix="元" class="mt-10"></a-input></a-col>
      <a-col :span="8">季度会员：<a-input v-model="oneSeasonPrice" type="number" suffix="元" class="mt-10"></a-input></a-col>
      <a-col :span="8">年度会员：<a-input v-model="oneYearPrice" type="number" suffix="元" class="mt-10"></a-input></a-col>
    </a-row>
    <a-row class="mt-20">
      <a-button @click="createSystemSetting" type="primary">保 存</a-button>
    </a-row>
  </div>
</template>

<script>
import api from '@system/api/systemSetting'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'systemSetting',
  data () {
    return {
      form: {
        notice: ''
      },
      oneMonthPrice: 0,
      oneSeasonPrice: 0,
      oneYearPrice: 0
    }
  },
  mounted () {
    this.form.notice = this.systemSetting.notice
    this.oneMonthPrice = this.systemSetting.membershipPrice[0][1]
    this.oneSeasonPrice = this.systemSetting.membershipPrice[1][1]
    this.oneYearPrice = this.systemSetting.membershipPrice[2][1]
  },
  computed: {
    ...mapGetters(['systemSetting'])
  },
  methods: {
    ...mapActions(['getSystemSetting']),
    createSystemSetting () {
      let temp = [
        ['1', this.oneMonthPrice],
        ['3', this.oneSeasonPrice],
        ['12', this.oneYearPrice]
      ]
      this.form.membershipPrice = JSON.stringify(temp)
      api.settingSystem(this.form).then(res => {
        this.$success('系统设置修改成功！')
        this.getSystemSetting()
      })
    }
  }
}
</script>

<style scoped>

</style>
