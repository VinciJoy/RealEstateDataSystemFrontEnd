<template>
  <a-modal
    :visible="membershipVisible"
    @cancel="closeMembership"
    width="60%"
  >
    <template slot="title">
      <div style="text-align: center">
        成为会员
      </div>
    </template>
    <a-row>
      <a-col class="membership-type-container" :span="8">
        <div @click="becomeMembership(1)" class="membership-type">
          <h2>一个月会员</h2>
          <p class="blue">1000元</p>
          <p class="date">至{{ monthLater(1) }}</p>
        </div>
      </a-col>
      <a-col class="membership-type-container" :span="8">
        <div @click="becomeMembership(3)" class="membership-type">
          <h2>季度会员</h2>
          <p class="blue">2000元</p>
          <p class="date">至{{ monthLater(3) }}</p>
        </div>
      </a-col>
      <a-col class="membership-type-container" :span="8">
        <div @click="becomeMembership(12)" class="membership-type">
          <h2>年度会员</h2>
          <p class="blue">5000元</p>
          <p class="date">至{{ monthLater(12) }}</p>
        </div>
      </a-col>
    </a-row>
    <div style="padding: 10px" slot="footer">
      <a-radio :checked="accepted" @click="accepted = !accepted"  style="text-align: left">我已阅读并同意摩贝会员相关条款</a-radio>
      <span class="clickable-txt" style="margin-right: 10px">会员权益</span>
      <span class="clickable-txt">会员条款</span>
    </div>
  </a-modal>
</template>

<script>
import api from '@system/api/alipay'

export default {
  name: 'membership',
  props: {
    membershipVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      accepted: false
    }
  },
  methods: {
    monthLater (month) {
      let d = new Date()
      d.setMonth(d.getMonth() + month)
      return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
    },
    becomeMembership (month) {
      api.becomeMembership({month: month}).then(res => {
        window.open(res.data.data.payURL)
      })
    },
    closeMembership () {
      this.$emit('closeMembershipModal')
    }
  }
}
</script>

<style scoped>
.membership-type {
  background-color: #eaeaea;
  height: 200px;
  cursor: pointer;
  width: 200px;
  margin: auto;
  padding: 20px;
  text-align: center;
  border-radius: 20px;
}

.blue {
  font-weight: bolder;
  font-size: 25px;
}

.date {
  color: #aaaaaa;
}

.membership-type-container {}
</style>
