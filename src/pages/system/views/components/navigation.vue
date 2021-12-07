<template>
  <div>
    <a-menu v-model="current" mode="horizontal" theme="dark">
      <a-menu-item class="logo can-not-select"><img src="../../../../../static/imgs/logo.png"
                                                    style="vertical-align: middle;height: 20px"/></a-menu-item>
      <a-menu-item key="home">
        首页
      </a-menu-item>
      <a-sub-menu>
        <span slot="title">
          More分析<a-icon type="caret-down"/>
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
          资源Base<a-icon type="caret-down"/>
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
      @change="loginFormChangWatch"
      :maskClosable="false"
    >
      <a-form-model
        ref="loginForm"
        :model="loginForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="loginRules"
      >
        <a-form-model-item label="用户名" prop="username" ref="username">
          <a-input v-model="loginForm.username"
                   tabindex="1"
                   @blur="
              () => {
                $refs.username.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input
            tabindex="2"
            v-model="loginForm.password"
          />

        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="repassword" v-if="LRModalStatus !== 'login'">
          <a-input
            v-model="loginForm.repassword"
          />
        </a-form-model-item>

        <a-form-model-item label="验证码" prop="verifycode">
          <a-input
            style="width: 50%"
            tabindex="3"
            v-model="loginForm.verifycode"
          />
          <img @click="getcaptchaCode" class="verifycode" :src="verifycodeBas64">
          <a-input hidden v-model="loginForm.uuid"
          />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button style="width: 100%" type="primary"
                  @click="login" v-if="LRModalStatus === 'login'">
          登 录
        </a-button>
        <a-button v-else style="width: 100%" type="primary"
                  @click="registerUser">注册
        </a-button>
        <div class="mt-10" v-if="LRModalStatus === 'login'">
          <a style="color: #1890ff!important;">忘记密码</a>
        </div>
      </template>
    </a-modal>
    <!--    login & register modal end-->
  </div>
</template>

<script>
import {adminLogin, adminUserRegirest, getLoginVerifycode} from '../../../../api/user'

export default {
  name: 'navigation',
  data () {
    return {
      verifycodeUuid: '',
      verifycodeBas64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYQAAACCCAMAAABxTU9IAAAAeFBMVEX///8AAADFxcUjIyMbGxvi4uIeHh56enqPj48XFxcNDQ3q6uoGBgaEhIS8vLwiIiLw8PCjo6NJSUmamppmZmYUFBTPz88pKSlwcHCMjIxqamrX19c2Njaenp43NzfU1NRCQkKsrKwvLy9PT0+3t7deXl5YWFhGRkaC7+tNAAAIXElEQVR4nO2da1ujPBCGpfBSoVhYLT1Zq7Ye/v8/fGUmtZMlMQegZOs8H9iLBR4m3IRgmKQ32+WENbJupjes0cUQAhBDCEAMIQAxhADEEAIQQwhADCEAMYQAxBACEEMIQAwhADGEAMQQAhBDCEAMIQAxhADEEAKQG4T/3FXZOVce1l09Z05lt7sQXp5OEKrIXbd21rce1ia+G8Pxa5eyy9J6ej1ZfCCksCwL+CfBJa7EZKXA3R7srB/QM6KeEfWMiGdpB+GW7py24+zwKNZ63vm4dYagCKQnCKnW0wlCzBAYgoUYgpfGh5C0L5h4fuP/ZTTEzm1CSVaKhDi7tQkKz84QFG3XBSDkZRzH5R6XMQhXdqv4vGVHtuRPdtZPOfHcERvJc7U7BxDrIVTTu0bv6Y9xpkfY627TLKYTuzjf4JDbmnqSONMPD88ha0IyWk2Y4fba4InbI3yaWN4sG3qkoiaILag/dp7X2SbMaJz6NgFPkycuF2zj4vlq58kQGMJZDMFWqjZBUk5XChcIt+3jVZ4ZKbwRQk6PL9qeuCw8IJSK0Grq7OTpCKFIy7JMd7A83Lb10FrZWL4hTDat4xWeD8ekOfUeAvgJQrNDPW3HJHlO66+9yhiKY7xrqzmMJYBjMICyvtN5rg5Wnif514TI5ci+tHapCSb+zy414T9684uaoOgyXQ5fEyJ6DVyO7Etreg1MEOYGM6cLpmpnFJ3pkufwDTNDYAgM4fdCSFwgDNQm5I1iWI4EoTl11heExqyG4lhAIGVfGSBECXgOVBPqLMvqAyxHgvB16uihmjXS7zYzbEc9N2ZZsmqKc4Lwfn88Hj8V32RntOyZPgDYUC2Kr93yz2OjF2Op/slXVMvONpNUjw68xxVXZeZU9oXThfon24QBIRwMECzLvqBtlzEQhsAQXMUQrrNNKGoKAdsERUaST5tge7c6ft7Er3qwTFyO7CzMpputk+aTqe37t1aYLTfH4iwavYv32SmsKCjPaNlL0wkgTrFzYQznX6kJ4v277qcmSP3axnRKUDg1Ybw2QfR4pv1AWNEL+mh1SGhtAkNgCAzht0NwahMGglA0KpvFhSE8wqnFR13L79Z6HcCtdoPgUvZts3cUwzG9Q0gaHXAZtWU5IsRJIqkKzmn5JiOEH+ULRZxQgsIpZXFGy75DG30vakx2HvKPNVVm2xAQDu6PDqFec1Glx1FpgJBLmYJG737zjoaAsKMn8IDQU1a2z5e14RtmhsAQLHTVEPRtgouZrbBNcHqTEeq1TRB5R1KmtynvaKA2If1SsktgWTYrKa4cYCWaE731VC1esi/n7AMT3JxGqD4UTWj7tBVnum9W6sXEIc4K0+ze67Nn8Tpv6ak5Zxofku8LlV66Jkivg88u1nppe/iNMtWEvGvtkkTLPurbEc2g7gvCriMEUwa1GwSnrOxxGmaGwBD+0lVDSCgE7fiyUNoEEU1NlnKcHhASeiEUMw/I4yiMpv5zW6gGdEBqVLZKmqVbP49eL3lj5gPhz8v9lz7uQUe6FHFmEOcSMrks3+We0DPPzgZYXJEWtj+eT4D/lfUMQWS2YfpZVbVWKrhgp6igvC+2qYBtVftzebqMOVZoRyAkeDe5dY9HGgjRBrevi+EgmLQnVbLAKunf7VzRR0e/cdLvCY7Juyjt40j0zA74jdkoAcFj4KBCFS1ckBD00yoM+FHHKIbAEKx11RBE3j4NsTMELGKHWboUopMfuA2hFYraKujNMmabAD1i8z95029VQvfVD28dj9Alpi88dheKTsHlAHHSzjZHCG/trjuU+ONoWw/WgWepR7ua8AbbX7TbK8v7yFtOQ2jdNGZNQCEEY5swh+332u2DQ/AaX2anMdsEFENgCNZiCCcIn9rtF4JwtW1Ck/OUQurTD29H2DDv9T6RXeqUt57hBCXG2S+EdQ7Wo0KAlMUYcgB9/k54x+BzuyRCby0xTsxsVEGIDHVZoQkeU4PnIOOYLWX5ONJrC0cOPhbF2CZgAE79q8NPq2CpniCImb96D+9bDOEnMYTuYggBQBDJak7zokq6UJsgbhYTBKcSXGCWl3cYYKrvTIMBqIsFTOC7ggGktc+r3xQHoMJsvj4Q5Dg/YEXK3VvjsNkUZx1ulrnqrlX8DMcrWC+0p15GBk+VfD70v2l3wPSUfOyaIE+1gytS2gGdIdhnNkh9UBebA08PoaePOl3bBCME/486ThDGqQkMgSGcxBB6SHkZvE2QIEgTjJhkCcHJ02f6tegVE77aqj6b5K8ac6JqnHvMLfkLbbaYOgUGP3Tw6V0wzjfMSItInp2IcwdxHiDODOPU31mSbiMy/ZriCsxxu5On10SEqgRI1Ao2l7iTU46nENrgNH76Lw0mzaQ4FTGv6ISKjsNyyUSEChXo6fZza339xBdu6ZyVHRG3F4/jUarhrhfNynbMww0sNb5XCHZT9zOEv8UQjGII4UCQpq/XD8jzydfqFYJlnE4Q7iIiRXvo4+nYiwpJZpM7yLA7DaFNyQoMLRVDU+c+Q2ijs2d29DheinNaf8d0ivNA49x6xPmI+YAR5hi2Pdc+Zffpyn4y3GGdf921a00Qus4fuxMSP0KkbRPCgnBtP/soxBAYgrV+AQTpRxPFnAL4f1ufQFDU06fXSNKmHWdE4+wMQfLM/D19DppMv3/j8/SPtOI/YPNmSmw6z3Q3b4c2RJySp22fnezmHwirLzGEAMQQAhBDCEAMIQAxhADEEAIQQwhADCEAMYQAxBACEEMIQJ0hVHY/Nsr6QZ0h4LDpuI9Yfq06Q1j30/f/q8UQAhBDCEAMIQD11DCnfcTya8V/JwQghhCAGEIAYggBiCEEIIYQgBbLCWtk/Q8tEMkyA+BkyAAAAABJRU5ErkJggg==',
      loginRules: {
        username: [
          {required: true, message: '请输入用户名!', trigger: 'blur'},
          {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'}
        ],
        repassword: [
          {required: true, message: '请输入密码!', trigger: 'blur'},
          {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'}
        ],
        verifycode: [
          {required: true, message: '请输入验证码!', trigger: 'blur'},
          {min: 4, max: 4, message: 'Length should be 3 to 5', trigger: 'blur'}
        ]
      },
      current: null,
      LRModalvisible: false,
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      loginForm: {
        repassword: '',
        username: null,
        password: null,
        uuid: '',
        captcha: '',

      },
      LRModalStatus: 'login'
    }
  },
  methods: {
    getcaptchaCode () {
      getLoginVerifycode().then((resp) => {
        // 赋值
        this.verifycodeBas64 = resp.data.img
        this.loginForm.uuid = resp.data.uuid
      })
    },
    login () {
      console.log(this.loginForm)
      let param = {
        'user_name': this.loginForm.username,
        'password': this.loginForm.password,
        'captcha_uuid': this.loginForm.uuid,
        'captcha_value': this.loginForm.captcha
      }
      adminLogin(param).then((resp) => {
        console.log(resp)
      })
    },
    registerUser () {
      let param = {
        'user_name': this.loginForm.username,
        'password': this.loginForm.password,
        'captcha_uuid': this.loginForm.uuid,
        'captcha_value': this.loginForm.captcha
      }
      adminUserRegirest(param).then((resp) => {
        this.$message.info(resp)
        console.log(resp)
      })
    },
    showLoginModal () {
      this.getcaptchaCode()
      this.LRModalvisible = true
      this.LRModalStatus = 'login'
    },
    showRegisterModal () {
      this.getcaptchaCode()
      this.LRModalvisible = true
      this.LRModalStatus = 'register'
    },
    loginFormChangWatch (state) {

      console.log("state",state)
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
.verifycode{
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
