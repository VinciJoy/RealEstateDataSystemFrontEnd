<template>
  <a-row style="height: 800px">
    <a-col :span="3">
      <a-menu
        style="width: 100%; height: 800px"
        :default-selected-keys="['1']"
        :open-keys.sync="openKeys"
        mode="inline"
      >
        <a-menu-item key="1">
          <router-link to="user_info">
          <a-icon type="pie-chart" />
          <span>个人信息</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="land_resource">
            <a-icon type="pie-chart" />
            <span>土地资源</span>
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
export default {
  name: 'userCenter',
  data () {
    return {
      current: ['mail'],
      openKeys: ['sub1']
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
