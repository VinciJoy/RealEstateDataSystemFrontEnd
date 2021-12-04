<template>
  <div>
    <a-menu v-model="current" mode="horizontal" theme="dark">
      <a-menu-item class="logo can-not-select"><img src="../../../../../static/imgs/logo.png" style="vertical-align: middle;height: 20px"/></a-menu-item>
      <a-menu-item key="home">
        首页
      </a-menu-item>
      <a-sub-menu>
        <span slot="title">
          More分析<a-icon type="caret-down" />
        </span>
        <a-menu-item key="analyse:1">
          analyse 1
        </a-menu-item>
        <a-menu-item key="analyse:2">
          analyse 2
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu>
        <span slot="title">
          资源Base<a-icon type="caret-down" />
        </span>
        <a-menu-item key="analyse:1">
          analyse 1
        </a-menu-item>
        <a-menu-item key="analyse:2">
          analyse 2
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="mobei-study">
        摩贝学堂
      </a-menu-item>
      <a-menu-item key="mobei-bbs">
        摩贝论坛
      </a-menu-item>
    </a-menu>
    <div class="navigation-user">
      <span>
        消息(1)
      </span>
      <span @click="showLoginModal">
        登录
      </span>
      <span @click="showRegisterModal">
        注册
      </span>
    </div>

<!--    login & register modal begin-->
    <a-modal
      :visible="LRModalvisible"
      :model="loginForm"
      :title="LRModalStatus === 'login'? '欢迎登录摩贝云': '欢迎注册摩贝云'"
      @cancel="LRModalvisible = false"
      :maskClosable="false"
    >
      <a-form-model
        ref="loginForm"
        :model="loginForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="loginRules"
      >
        <a-form-model-item
          label="用户名"
          prop="username"
          ref="username"
        >
          <a-input
            v-model="loginForm.username"
            @blur="
              () => {
                $refs.username.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input
            v-model="loginForm.password"
          />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button style="width: 100%" type="primary" @click="login">
          登 录
        </a-button>
        <div class="mt-10">
          <a style="color: #1890ff!important;">忘记密码</a>
        </div>
      </template>
    </a-modal>
<!--    login & register modal end-->
  </div>
</template>

<script>
export default {
  name: 'navigation',
  data () {
    return {
      loginRules: {
        username: [
          {required: true, message: '请输入用户名!', trigger: 'blur'},
          {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'}
        ]
      },
      current: null,
      LRModalvisible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      loginForm: {
        username: null,
        password: null
      },
      LRModalStatus: 'login'
    }
  },
  methods: {
    login () {
      console.log(this.loginForm)
    },
    showLoginModal () {
      this.LRModalvisible = true
      this.LRModalStatus = 'login'
    },
    showRegisterModal () {
      this.LRModalvisible = true
      this.LRModalStatus = 'register'
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
  color: white!important;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
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
