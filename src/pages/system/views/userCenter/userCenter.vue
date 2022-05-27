<template>
  <a-row style="min-height: calc(100% - 180px)">
    <a-col v-show="!publishPage" :span="3">
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
        <a-sub-menu v-if="utils.IsSuperAdmin(userInfo.role)" key="superAdminManagement">
          <span slot="title"><a-icon type="dashboard" /><span>MVP控制台</span></span>
          <a-menu-item key="superAdminUnhandle">
            <router-link :to="{ name: 'superAdminUnhandle'}">
              <a-icon type="dashboard" />
              <span>未处理信息</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="superAdminHandle">
            <router-link :to="{ name: 'superAdminHandle'}">
              <a-icon type="dashboard" />
              <span>已处理信息</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu v-if="utils.IsAdmin(userInfo.role)" key="adminManagement">
          <span slot="title"><a-icon type="dashboard" /><span>NPC审核端</span></span>
          <a-menu-item key="adminUnhandle">
            <router-link :to="{ name: 'adminUnhandle'}">
              <a-icon type="dashboard" />
              <span>未处理信息</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="adminHandle">
            <router-link :to="{ name: 'adminHandle'}">
              <a-icon type="dashboard" />
              <span>已处理信息</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-if="utils.IsAdmin(userInfo.role)" key="mobeiStudyManage">
          <router-link :to="{ name: 'mobeiStudyManage'}">
            <a-icon type="layout" />
            <span>摩贝学堂</span>
          </router-link>
        </a-menu-item>
        <a-menu-item v-if="utils.IsAdmin(userInfo.role)" key="videoManage">
          <router-link :to="{ name: 'videoManage'}">
            <a-icon type="layout" />
            <span>视频管理</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu key="resource Base">
          <span slot="title"><a-icon type="pie-chart" /><span>资源 Base</span></span>
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
        </a-sub-menu>
        <a-menu-item key="likedResource">
          <router-link :to="{ name: 'likedResource'}">
            <a-icon type="folder" />
            <span>收藏的项目</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="userCenterSubscribeItemList">
          <router-link :to="{ name: 'userCenterSubscribeItemList'}">
            <a-icon type="bulb" />
            <span>定制的项目</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="userCenterSubscribe">
          <router-link :to="{ name: 'userCenterSubscribe'}">
            <a-icon type="monitor" />
            <span>定制规则</span>
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

    <a-col :span="publishPage ? 24 : 21">
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
  superAdminUnhandle: [
    'superAdminUnhandle'
  ],
  videoManage: [
    'videoManage'
  ],
  mobeiStudyManage: [
    'mobeiStudyManage'
  ],
  likedResource: [
    'likedResource'
  ],
  userCenterSubscribeItemList: [
    'userCenterSubscribeItemList'
  ],
  userCenterSubscribe: [
    'userCenterSubscribe'
  ],
  superAdminHandle: [
    'superAdminHandle'
  ],
  adminUnhandle: [
    'adminUnhandle'
  ],
  adminHandle: [
    'adminHandle'
  ],
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
      publishPage: false,
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
      this.init()
    }
  },
  methods: {
    init () {
      this.publishPage = this.$route.path.includes('publish')
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
