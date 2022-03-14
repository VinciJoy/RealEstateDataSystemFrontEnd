<template>
  <a-row>
    <a-col :span="8" class="card">
      <a-col :span="8">
        <img src="/static/imgs/default.jpeg" style="width: 100%"/>
      </a-col>
      <a-col :span="16" style="padding-left: 10px">
        <div class="username">
          {{ userInfo.user_name }}
        </div>
        <div>
          <div v-if="!userInfo.certificationVerified && userInfo.certificate.ID === 0" @click="certificateModalVisible = true" class="tag-desc clickable-txt">点击完成实名认证<a-icon style="color: gray;" class="ml-5" theme="filled" type="down-circle" /></div>
          <div v-if="!userInfo.certificationVerified && userInfo.certificate.ID !== 0" @click="certificateModalVisible = true" class="tag-desc clickable-txt">等待管理员认证<a-icon style="color: gray;" class="ml-5" theme="filled" type="down-circle" /></div>
          <div v-if="userInfo.certificationVerified" @click="certificateModalVisible = true" class="tag-desc clickable-txt">已完成实名认证<a-icon style="color: forestgreen;" theme="filled" type="down-circle" class="ml-5"/></div>

          <div v-if="!userInfo.phoneVerified" @click="phoneModalVisible = true" class="tag-desc clickable-txt">点击完成手机验证<a-icon style="color: gray;" class="ml-5" theme="filled" type="down-circle" /></div>
          <div v-if="userInfo.phoneVerified" @click="phoneModalVisible = true" class="tag-desc clickable-txt">已完成手机验证<a-icon style="color: forestgreen;" theme="filled" type="down-circle" class="ml-5"/></div>
          <userVerify @changed="certificateChange" :editable="(userInfo.certificate.ID === 0) && (!userInfo.certificationVerified)" :passedInCertificateForm="certificateForm" :certificateModalVisible="certificateModalVisible" @closeUserVerifyModal="certificateModalVisible = false"></userVerify>
          <phoneVerify @changed="certificateChange" :phone="userInfo.phone" :phoneModalVisible="phoneModalVisible" @closePhoneVerifyModal="phoneModalVisible = false"></phoneVerify>
        </div>
        <div>
          <a @click="changePasswordVisible = true" class="tag-desc">修改密码</a>
        </div>
      </a-col>
    </a-col>

<!--    modal begin-->
    <a-modal
      v-model="changePasswordVisible"
      width="30%"
      @ok="changePassword"
    >
      <a-form-model
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item ref="oldPassword" label="旧密码" prop="oldPassword">
          <a-input
            type="password"
            v-model="passwordForm.oldPassword"
            @blur="
             () => {
                $refs.oldPassword.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
         <a-form-model-item ref="newPassword" label="新密码" prop="newPassword">
          <a-input
            type="password"
            v-model="passwordForm.newPassword"
            @blur="
             () => {
                $refs.newPassword.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
         <a-form-model-item ref="newPassword2" label="确认新密码" prop="newPassword2">
          <a-input
            type="password"
            v-model="passwordForm.newPassword2"
            @blur="
             () => {
                $refs.newPassword2.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
<!--    modal end-->

  </a-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import userVerify from '../../components/userVerify'
import phoneVerify from '../../components/phoneVerify'
import api from '@system/api/user'

export default {
  name: 'userInfo',
  components: {
    userVerify,
    phoneVerify
  },
  data () {
    let checkRepassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      }
      callback()
    }
    return {
      passwordRules: {
        oldPassword: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          {min: 5, max: 256, message: '密码长度为5-256字符!', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          {min: 5, max: 256, message: '密码长度为5-256字符!', trigger: 'blur'}
        ],
        newPassword2: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          {validator: checkRepassword, trigger: 'blur'}
        ]
      },
      certificateModalVisible: false,
      phoneModalVisible: false,
      changePasswordVisible: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      certificateForm: {
        certificatePicList: []
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions(['getUserInfo']),
    init () {
      this.certificateForm = this.userInfo.certificate
    },
    async certificateChange () {
      await this.getUserInfo()
      this.init()
    },
    changePassword () {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          api.changePassword(this.passwordForm).then((res) => {
            this.$success('密码修改成功!')
            this.changePasswordVisible = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border: 1px solid #ebeef5;
  transition: .3s;
  border-radius: 4px;
  padding: 10px;
}

.username{
  font-size: 24px;
  font-weight: 700;
  color: #409eff;
}
</style>
