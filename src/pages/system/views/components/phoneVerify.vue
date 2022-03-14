<template>
    <a-modal :visible="phoneModalVisible" width="40%" :footer="null" title="手机验证" @cancel="closeModal">
      手机号：<a-input style="width: 40%" v-model="form.phone"></a-input>
      <div class="mt-10">
        验证码：<a-input style="width: 20%" v-model="form.code"></a-input>
        <a-button @click="getCode" :disabled="countDown > 0" class="ml-10">
          {{ countDown > 0 ? countDown : '获取验证码' }}
        </a-button>
      </div>
      <a-row style="text-align: center" class="mt-10">
        <a-button style="width: 20%" @click="closeModal">取 消</a-button>
        <a-button @click="verify" type="primary" style="margin-left:40px;width: 20%">验 证</a-button>
      </a-row>
    </a-modal>
</template>

<script>
import api from '@system/api/user'
import utils from '@/utils/utils'

export default {
  name: 'phoneVerify',
  props: {
    phoneModalVisible: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      countDown: 0,
      form: {
        phone: '',
        code: ''
      }
    }
  },
  mounted () {
    this.form.phone = this.phone
  },
  methods: {
    closeModal () {
      this.$emit('closePhoneVerifyModal')
    },
    verify () {
      if (!this.form.code) {
        this.$error('请输入正确的验证码!')
        return
      }
      api.verifyPhone({'code': this.form.code}).then(res => {
        this.$success('手机验证成功！')
        this.$emit('changed')
        this.closeModal()
      })
    },
    getCode () {
      if (!utils.MobileValid(null, this.form.phone)) {
        this.$error('请输入正确的手机号！')
        return
      }
      api.getPhoneCode(this.form.phone).then(res => {
        this.$success('验证码发送成功，请等待！')
        this.countDown = 120
        let interval = setInterval(() => {
          if (this.countDown === 0) {
            clearInterval(interval)
            return
          }
          this.countDown -= 1
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>

</style>
