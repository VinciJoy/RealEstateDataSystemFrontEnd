<template>
  <div>
    <a-menu v-model="activeKeys" mode="horizontal" theme="dark">
      <a-menu-item key="logo" class="logo can-not-select">
        <img src="/static/imgs/logo.png" style="vertical-align: middle;height: 20px"/>
      </a-menu-item>
      <a-menu-item key="home" @click="handleRoute('/')">
        首页
      </a-menu-item>
      <a-menu-item key="moreAnalyse" @click="$router.push({name: 'moreAnalyse'})">
          More分析
      </a-menu-item>
      <a-sub-menu key="resourceBase">
        <span slot="title">
          资源Base<a-icon type="caret-down"/>
        </span>
        <a-menu-item key="landResource">
          <router-link :to="{ name: 'landResource'}">
            <span>土地资源</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="industryResource">
          <router-link :to="{ name: 'industryResource'}">
            <span>产业资源</span>
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="mobeiStudy">
        摩贝学堂
      </a-menu-item>
      <a-menu-item key="mobeiBBS">
        摩贝论坛
      </a-menu-item>
    </a-menu>

    <div class="navigation-user" v-if="!userInfo.ID">
      <span @click="showLoginModal">
        登录
      </span>
      <span @click="showRegisterModal">
        注册
      </span>
    </div>

    <div class="navigation-user" v-else>
      <a-dropdown>
        <span>
          消息({{ noticeCount }})
        </span>
        <a-menu slot="overlay">
          <a-menu-item @click="$router.push('/user_center/super_admin_unhandle')" style="color: rgba(0, 0, 0, 0.85)!important" v-if="userInfo.superAdminUnhandleLandCount || userInfo.superAdminUnhandleIndustryCount">
            MVP控制台发布端有未处理的信息
          </a-menu-item>
          <a-menu-item @click="$router.push('/user_center/admin_unhandle')" style="color: rgba(0, 0, 0, 0.85)!important" v-if="userInfo.adminUnhandleLandCount || userInfo.adminUnhandleIndustryCount">
            NPC审核端发布端有未审核的信息
          </a-menu-item>
          <a-menu-item @click="$router.push('/user_center/super_admin_unhandle?tab=2')" style="color: rgba(0, 0, 0, 0.85)!important" v-if="userInfo.superAdminUnhandleConsultCount">
            MVP控制台客户端有未处理的信息
          </a-menu-item>
          <a-menu-item @click="$router.push('/user_center/admin_unhandle?tab=2')" style="color: rgba(0, 0, 0, 0.85)!important" v-if="userInfo.adminUnhandleConsultCount">
            NPC审核端客户端有未审核的信息
          </a-menu-item>
          <a-menu-item v-for="(resource, index) in userInfo.reject_resources" :key="'reject_resource' + index" style="text-align: center">
            <a v-if="resource.resource_type === 'IndustryResource'" href="javascript:;" style="color: rgba(0, 0, 0, 0.85)!important" @click="handleRoute('/user_center/publish_industry_resource/' + resource.ID)">
              {{ resource.title }} 被驳回，请重新修改
            </a>
            <a v-else href="javascript:;" style="color: rgba(0, 0, 0, 0.85)!important" @click="handleRoute('/user_center/publish_land_resource/' + resource.ID)">
              {{ resource.title }} 被驳回，请重新修改
            </a>
          </a-menu-item>
          <a-menu-item v-if="!noticeCount">
            <a-empty style="color: rgba(0,0,0,.25)"/>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-dropdown>
        <span>
          {{ userInfo.user_name }} <a-icon type="down" />
        </span>
        <a-menu slot="overlay">
          <a-menu-item style="text-align: center">
            <a href="javascript:;" style="color: rgba(0, 0, 0, 0.85)!important" @click="handleRoute('/user_center/user_info')">个人中心</a>
          </a-menu-item>
          <a-menu-item style="text-align: center">
            <a href="javascript:;" style="color: rgba(0, 0, 0, 0.85)!important" @click="logout">登 出</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <!--    login & register modal begin-->
    <a-modal
      :visible="modalVisible"
      :model="loginForm"
      :title="modalMode === 'login'? '欢迎登录摩贝云': '欢迎注册摩贝云'"
      @cancel="modalVisible = false"
      :maskClosable="false"
    >

<!--      login form begin-->
      <a-form-model
        v-show="modalMode === 'login'"
        ref="loginForm"
        :model="loginForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="loginRules"
      >
        <a-form-model-item label="昵称" prop="user_name" ref="user_name">
          <a-input v-model="loginForm.user_name"
                   tabindex="1"
                   @blur="
              () => {
                $refs.user_name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input
            tabindex="2"
            type="password"
            v-model="loginForm.password"
          />

        </a-form-model-item>

        <a-form-model-item label="验证码" prop="captcha_value">
          <a-input
            style="width: 50%"
            tabindex="3"
            v-model="loginForm.captcha_value"
          />
          <img @click="getCaptcha" class="captchaImg" :src="captchaImgBas64">
        </a-form-model-item>
      </a-form-model>
<!--      login form end-->

<!--      register form begin-->
      <a-form-model
        v-show="modalMode === 'register'"
        ref="registerForm"
        :model="registerForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="registerRules"
      >
        <a-form-model-item label="用户名" prop="register_user_name" ref="register_user_name">
          <a-input v-model="registerForm.register_user_name"
                   tabindex="1"
                   @blur="
              () => {
                $refs.register_user_name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email" ref="email">
          <a-input
            v-model="registerForm.email"
            tabindex="2"
          />
        </a-form-model-item>
        <a-form-model-item label="手机" prop="phone" ref="phone">
          <a-input
            v-model="registerForm.phone"
            tabindex="3"
          />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input
            tabindex="4"
            type="password"
            v-model="registerForm.password"
          />

        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="repassword" v-if="modalMode === 'register'">
          <a-input
            tabindex="5"
            type="password"
            v-model="registerForm.repassword"
          />
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="captcha_value">
          <a-input
            style="width: 50%"
            tabindex="6"
            v-model="registerForm.captcha_value"
          />
          <img @click="getCaptcha" class="captchaImg" :src="captchaImgBas64">
        </a-form-model-item>
      </a-form-model>
<!--      register form end-->

      <template slot="footer">
        <a-button style="width: 100%" type="primary"
                  @click="login" v-if="modalMode === 'login'">
          登 录
        </a-button>
        <a-button v-else style="width: 100%" type="primary"
                  @click="register">注 册
        </a-button>
        <div class="mt-10" v-if="modalMode === 'login'">
          <div style="display: inline; float:left;">
            <a style="color: #1890ff!important;" @click="showRegisterModal">注册</a>
          </div>
          <div style="display: inline">
            <a style="color: #1890ff!important;">忘记密码</a>
          </div>
        </div>
        <div class="mt-10" v-show="modalMode === 'register'">
            <a style="color: #1890ff!important;" @click="showLoginModal">登录</a>
        </div>
      </template>
    </a-modal>
    <!--    login & register modal end-->
  </div>
</template>

<script>
import api from '@system/api/user'
import utils from '@/utils/utils'
import { mapActions, mapGetters } from 'vuex'
import { defaultUserInfo } from '@/utils/constants'

export default {
  name: 'navigation',
  inject: [
    'reload'
  ],
  data () {
    let validUserName = (rule, value, callback) => {
      if (!/^[\d\w]+$/.test(value)) {
        callback(new Error('用户名只能包含数字和字母!'))
      }
      callback()
    }
    let checkRepassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      }
      callback()
    }
    return {
      captchaImgBas64: null,
      loginRules: {
        user_name: [
          {required: true, message: '请输入用户名!', trigger: 'blur'},
          {min: 5, max: 20, message: '用户名长度为5-128字符!', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          {min: 5, max: 256, message: '密码长度为5-256字符!', trigger: 'blur'}
        ],
        captcha_value: [
          {required: true, message: '请输入验证码!', trigger: 'blur'}
        ]
      },
      registerRules: {
        register_user_name: [
          {required: true, message: '请输入用户名!', trigger: 'blur'},
          {min: 5, max: 20, message: '用户名长度为5-20字符!', trigger: 'blur'},
          {validator: validUserName, trigger: 'blur'},
          {validator: utils.CheckUserNameExist, trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          {min: 5, max: 256, message: '密码长度为5-256字符!', trigger: 'blur'}
        ],
        repassword: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          {validator: checkRepassword, trigger: 'blur'}
        ],
        email: [
          {required: true, type: 'email', trigger: 'blur', message: '请输入正确的电子邮箱!'},
          {validator: utils.CheckEmailExist, trigger: 'blur'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '请输入手机号码!'},
          {validator: utils.MobileValid, message: '请输入正确的电话号码!', trigger: 'blur'},
          {validator: utils.CheckMobileExist, trigger: 'blur'}
        ],
        captcha_value: [
          {required: true, message: '请输入验证码!', trigger: 'blur'}
        ]
      },
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      loginForm: {
        user_name: null,
        password: null,
        captcha_uuid: '',
        captcha_value: ''
      },
      registerForm: {
        register_user_name: null,
        email: null,
        phone: null,
        password: null,
        repassword: null,
        captcha_uuid: '',
        captcha_value: ''
      },
      activeKeys: []
    }
  },
  created () {
    this.init()
  },
  watch: {
    '$route.name' (to, from) {
      this.activeKeys = [this.$route.name]
    },
    'modalMode' () {
      this.getCaptcha()
      this.$nextTick(() => {
        this.$refs.loginForm.resetFields()
      })
      this.$nextTick(() => {
        this.$refs.registerForm.resetFields()
      })
    },
    'modalVisible' () {
      this.getCaptcha()
      this.$nextTick(() => {
        this.$refs.loginForm.resetFields()
      })
      this.$nextTick(() => {
        this.$refs.registerForm.resetFields()
      })
    }
  },
  computed: {
    ...mapGetters(['modalStatus', 'userInfo']),
    noticeCount () {
      let ret = 0
      if (this.userInfo.adminUnhandleLandCount || this.userInfo.adminUnhandleIndustryCount) {
        ret += 1
      }
      if (this.userInfo.superAdminUnhandleLandCount || this.userInfo.superAdminUnhandleIndustryCount) {
        ret += 1
      }
      if (this.userInfo.superAdminUnhandleConsultCount) {
        ret += 1
      }
      if (this.userInfo.adminUnhandleConsultCount) {
        ret += 1
      }
      if (this.userInfo.reject_resources) {
        ret += this.userInfo.reject_resources.length
      }
      return ret
    },
    modalVisible: {
      get () {
        return this.modalStatus.visible
      },
      set (value) {
        this.changeModalStatus({visible: value})
      }
    },
    modalMode: {
      get () {
        return this.modalStatus.mode
      },
      set (value) {
        this.changeModalStatus({mode: value})
      }
    }
  },
  methods: {
    ...mapActions(['getUserInfo', 'changeModalStatus']),
    init () {
      this.getUserInfo()
    },
    handleRoute (route) {
      this.activeKeys = []
      if (route && route.indexOf('admin') < 0) {
        this.$router.push(route)
      } else {
        window.open('/admin/')
      }
    },
    logout () {
      api.logout().then(() => {
        this.$store.commit('SET_userInfo', defaultUserInfo)
        this.$success('退出登录成功!')
        this.getUserInfo()
        this.reload()
      })
    },
    getCaptcha () {
      api.getCaptcha().then((res) => {
        // 赋值
        this.captchaImgBas64 = res.data.data.img
        this.loginForm.captcha_uuid = res.data.data.uuid
        this.registerForm.captcha_uuid = res.data.data.uuid
      })
    },
    login () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          api.login(this.loginForm).then((res) => {
            this.$success('欢迎回来!')
            this.getUserInfo()
            this.reload()
            this.modalVisible = false
          }).catch((res) => {
            this.getCaptcha()
          })
        }
      })
    },
    register () {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.registerForm['user_name'] = this.registerForm['register_user_name']
          api.register(this.registerForm).then((res) => {
            this.$success('注册成功!')
            this.showLoginModal()
          }).catch(() => {
            this.getCaptcha()
          })
        }
      })
    },
    showLoginModal () {
      this.modalVisible = true
      this.modalMode = 'login'
      // modal show 的时候 form 才会渲染出来，所以需要 nextTick
      this.$nextTick(() => {
        this.$refs.loginForm.resetFields()
      })
    },
    showRegisterModal () {
      this.modalVisible = true
      this.modalMode = 'register'
      this.$nextTick(() => {
        this.$refs.loginForm.resetFields()
      })
    }
  }
}
</script>

<style scoped>
.ant-menu-horizontal {
  background-color: #172355;
}

.logo {
  cursor: default;
  margin-left: 100px;
  pointer-events: none;
}

a, i, span, li {
  color: white !important;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.captchaImg {
  margin-left: 10%;
  height: 50px;
  width: 40%;
  display: inline-block;
}

.navigation-user {
  right: 40px;
  top: 10px;
  position: absolute;
  color: white;
}

.navigation-user > span {
  margin-right: 5px;
  cursor: pointer;
}
</style>
