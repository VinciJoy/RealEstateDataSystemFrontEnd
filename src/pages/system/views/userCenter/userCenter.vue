<template>
  <a-row style="min-height: calc(100% - 180px)">
    <a-col :span="3">
      <a-menu
        style="width: 100%;"
        :selected-keys="selectedKey"
        mode="inline"
      >
        <a-menu-item key="userInfo">
          <router-link :to="{ name: 'userInfo'}">
          <a-icon type="solution" />
          <span>个人信息</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="userCenterLandResource">
          <router-link :to="{ name: 'userCenterLandResource'}">
            <a-icon type="pie-chart" />
            <span>土地资源</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="userCenterIndustryResource">
          <router-link :to="{ name: 'userCenterIndustryResource'}">
            <a-icon type="pie-chart" />
            <span>产业资源</span>
          </router-link>
        </a-menu-item>
        <a-menu-item v-if="utils.IsAdmin(userInfo.role)" key="userManage">
          <router-link :to="{ name: 'userManage'}">
            <a-icon type="team" />
            <span>用户管理</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-col>

    <a-col :span="21">
      <div class="content-app">
        <transition name="fadeInUp" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import utils from '@/utils/utils'
import {mapGetters} from 'vuex'

const MenuList = {
  userCenterLandResource: [
    'userCenterLandResource',
    'editLandResource',
    'publishLandResource'
  ],
  userCenterIndustryResource: [
    'userCenterIndustryResource',
    'editIndustryResource',
    'publishIndustryResource'
  ],
  userInfo: [
    'userInfo'
  ],
  userManage: [
    'userManage'
  ]
}

export default {
  name: 'userCenter',
  data () {
    return {
      MenuList: MenuList,
      utils: utils,
      selectedKey: []
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    $route (to, from) {
      this.selectMenu()
    }
  },
  methods: {
    init () {
      this.selectMenu()
    },
    selectMenu () {
      for (let key in this.MenuList) {
        if (this.MenuList[key].includes(this.$route.name)) {
          this.selectedKey = [key]
        }
      }
    }
  }
}
</script>

<style scoped>
  .content-app {
    padding-top: 20px;
    padding-right: 20px;
    padding-left:20px;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate(0, 30px);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }
</style>
