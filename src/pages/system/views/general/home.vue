<template>
  <div>
<!--    banner begin-->
    <a-row>
      <img class="banner" src="../../../../../static/imgs/home-banner.png"/>
      <div class="banner-content can-not-select">
        <span style="font-weight: bolder; font-size: 40px">
          MORE分析
        </span>
        <br>
        <p style="font-size: 30px">
          投 资 测 算 分 析 系 统
        </p>
        <a-button type="primary">动态详细测算通道</a-button>
        <a-button type="primary">智能辅助测算通道</a-button>
      </div>
    </a-row>
<!--    banner end-->

<!--    tag begin-->
    <a-row class="mt-40" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="5">
        <a-row class="tag-card">
          <a-col style="height: 100%" :span="9">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/home-icon.png"/>
          </a-col>
          <a-col class="mt-20" :span="15">
            <span class="tag-title can-not-select">土地 / 资产信息</span>
            <br>
            <span class="tag-desc can-not-select">LAND / ASSETS</span>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="5">
        <a-row class="tag-card">
          <a-col style="height: 100%" :span="9">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/money-icon.png"/>
          </a-col>
          <a-col class="mt-20" :span="15">
            <span class="tag-title can-not-select">泛式匹配资金</span>
            <br>
            <span class="tag-desc can-not-select">CAPITAL</span>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="5">
        <a-row class="tag-card">
          <a-col style="height: 100%" :span="10">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/contract-icon.png"/>
          </a-col>
          <a-col class="mt-20" :span="14">
            <span class="tag-title can-not-select">匹配产业导入</span>
            <br>
            <span class="tag-desc can-not-select">INDUSTRY</span>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="5">
        <a-row class="tag-card">
          <a-col style="height: 100%" :span="9">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/message-icon.png"/>
          </a-col>
          <a-col class="mt-20" :span="15">
            <span class="tag-title can-not-select">资源匹配推送</span>
            <br>
            <span class="tag-desc can-not-select">FORUM</span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
<!--    tag end-->

<!--    system info begin-->
    <a-row class="mt-40" :gutter="16">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="10">
        <img class="banner" src="../../../../../static/imgs/system-info.png"/>
      </a-col>

      <a-col :span="10">
        <div class="left-blue part-title can-not-select" style="width: 100%">
          <h1 style="display: inline">系统公告</h1>
          <span style="float: right; cursor: pointer" class="clickable-txt">MORE +</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">摩贝云产业资源系统使用方法</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">第25期摩贝线上投资培训开讲通知</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">摩贝云与XX集团签署战略合作协议</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">摩贝云与XX公司达成战略合作伙伴</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">摩贝云系统管理员招募通知</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>
      </a-col>
    </a-row>
<!--  system info end-->

<!--    my info begin-->
    <a-row class="mt-40" :gutter="16">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="20">
        <a-row>
          <div class="left-blue part-title can-not-select" style="width: 100%">
            <h1>我的项目</h1>
          </div>
        </a-row>
        <a-row type="flex">
          <a-col :span="6">
            <a-row>
              <a-col :span="6">
                <img  width="80%" src="../../../../../static/imgs/user-icon.png"/>
              </a-col>
              <a-col :span="18">
                <a-col>平台用户001</a-col>
                <a-col class="tag-desc" style="font-size: 10px">
                  <img  width="13px" src="../../../../../static/imgs/verified.png"/> 已实名认证
                </a-col>
              </a-col>
            </a-row>
            <a-row>
              <img style="padding-top: 10px; height: 90%; width: 90%" src="../../../../../static/imgs/envelope.png"/>
              <div style="color: white; position: absolute; text-align: center; font-size: 20px; font-weight: bolder;left:0; right:30px; top: 40px; bottom:0;">
                <div v-show="userInfo.subscribeUnreadCount > 0" class="can-not-select">
                  <p>请查收您的定制项目</p>
                  <p>您有{{ userInfo.subscribeUnreadCount }}条新消息</p>
                  <a-button @click="$router.push({name: 'userCenterSubscribeItemList'})">点击查看</a-button>
                </div>
                <div v-show="userInfo.subscribeUnreadCount === 0" style="margin-top: 30px">
                  <p>
                    定制我的项目、产业需求
                  </p>
                  <a-button @click="$router.push({name: 'userCenterSubscribe'})">去定制</a-button>
                </div>
              </div>
            </a-row>
          </a-col>

          <a-col :span="9">
            <a-col class="board-head" style="border-top-left-radius: 10px;">
              <span class="blue" style="font-weight: normal; font-size: 1.5em">土地/资产</span>
              <span style="float: right; cursor: pointer; font-size: 1.0em" @click="$router.push({name: 'landResource'})" class="clickable-txt">MORE+</span>
            </a-col>
            <a-col class="board-body" style="border-bottom-left-radius: 10px; border-right: 2px solid #e9e9e9;">
              <h3 @click="goToLand(land.ID)" v-for="(land, index) of landList" class="not-allow-txt-overflow clickable-txt" :key="'land' + index">
                {{ land.title }}
              </h3>
              <div style="text-align: center">
                <a-button type="primary" @click="$router.push({name: 'publishLandResource'})">发布土地/资产信息</a-button>
              </div>
            </a-col>
          </a-col>

          <a-col :span="9">
            <a-col class="board-head" style="border-top-right-radius: 10px">
              <span class="blue" style="font-weight: normal; font-size: 1.5em">产业</span>
              <span style="float: right; cursor: pointer; font-size: 1.0em" @click="$router.push({name: 'industryResource'})" class="clickable-txt">MORE+</span>
            </a-col>
            <a-col class="board-body" style="border-bottom-right-radius: 10px;">
              <h3 @click="goToIndustry(industry.ID)" v-for="(industry, index) of industryList" class="not-allow-txt-overflow clickable-txt" :key="'industry' + index">
                {{ industry.title }}
              </h3>
              <div style="text-align: center">
                <a-button type="primary" @click="$router.push({name: 'publishIndustryResource'})">发布产业信息</a-button>
              </div>
            </a-col>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
<!--    my info end-->

<!--    estate info begin-->
    <a-row class="mt-40" :gutter="16">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="20">
        <a-row>
          <div class="left-blue part-title can-not-select" style="width: 100%">
            <h1 style="display:inline;">土地/资产转让信息</h1>
            <span style="float: right; cursor: pointer; font-size: 1.5em" class="clickable-txt" @click="$router.push({name: 'landResource'})">MORE+</span>
          </div>
        </a-row>

        <a-row :gutter="24" class="mt-20">
          <a-col style="cursor:pointer;" @click="goToLand(land.ID)" v-for="(land, index) of landList" :span="6" :key="'desc_land' + index">
            <div class="info-pic-container">
              <img v-if="land.coverPicUuid" style="width: 100%; height: 100%" :src="picBaseURL + land.coverPicUuid"/>
              <img v-else style="width: 100%; height: 100%" src="static/imgs/default-img.jpeg"/>
            </div>
            <div class="info-desc-container">
              <div class="info-desc-title not-allow-txt-overflow" >{{land.title}}</div>
              <br>
              <div>
                <span class="info-desc-content">发布时间：{{ land.updatedAt }}</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
<!--    estate info end-->

<!--    industry info begin-->
    <a-row class="mt-40" :gutter="16">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="20">
        <a-row>
          <div class="left-blue part-title can-not-select" style="width: 100%">
            <h1 style="display:inline;">产业资源信息</h1>
            <span style="float: right; cursor: pointer; font-size: 1.5em" class="clickable-txt" @click="$router.push({name: 'industryResource'})">MORE+</span>
          </div>
        </a-row>

        <a-row :gutter="24" class="mt-20">
          <a-col style="cursor: pointer" @click="goToIndustry(industry.ID)" v-for="(industry, index) of industryList" :span="6" :key="'desc_industry' + index">
            <div class="info-pic-container">
              <img v-if="industry.coverPicUuid" style="width: 100%; height: 100%" :src="picBaseURL + industry.coverPicUuid"/>
              <img v-else style="width: 100%; height: 100%" src="static/imgs/default-img.jpeg"/>
            </div>
            <div class="info-desc-container">
              <div class="info-desc-title not-allow-txt-overflow">{{ industry.title }}</div>
              <br>
              <div>
                <span class="info-desc-content">更新时间：{{ industry.updatedAt }}</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
<!--    industry info end-->
  </div>
</template>

<script>
import industryApi from '@system/api/industryResource'
import landApi from '@system/api/landResource'

import {mapGetters} from 'vuex'
import {AUDIT_STATUS} from '../../../../utils/constants'

export default {
  data () {
    return {
      loading: false,
      picBaseURL: '',
      landList: [],
      industryList: []
    }
  },
  mounted () {
    this.picBaseURL = process.env.API_ROOT + '/system/pics/temp/'
    this.init()
  },
  computed: {
    ...mapGetters(['userInfo'])

  },
  methods: {
    init () {
      this.getIndustryResources()
      this.getLandResources()
    },
    goToIndustry (id) {
      this.$router.push({name: 'industryResourceDetail', params: { id }})
    },
    goToLand (id) {
      this.$router.push({name: 'landResourceDetail', params: { id }})
    },
    getLandResources () {
      this.loading = true
      landApi.getLandResources({
        pageSize: 4,
        pageIndex: 1,
        orderByUpdatedTime: 'DESC',
        owner: false,
        visible: true,
        auditStatus: AUDIT_STATUS.PASSED
      }).then(res => {
        this.landList = res.data.data.landResources
        this.loading = false
      })
    },
    getIndustryResources () {
      this.loading = true
      industryApi.getIndustryResources({
        pageSize: 4,
        pageIndex: 1,
        orderByUpdatedTime: 'DESC',
        owner: false,
        visible: true,
        auditStatus: AUDIT_STATUS.PASSED
      }).then(res => {
        this.industryList = res.data.data.industryResources
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.info-desc-title {
  font-size: 20px;
}

.info-desc-content {
  color: #a1a1a1;
}

.info-desc-container {
  margin-top: 10px;
}

.info-pic-container {
  border-radius: 5px;
  background-color: #f2f4f5;
  height: 200px;
}

.board-body {
  padding: 10px;
  background-color: #f2f4f5;
  height: 83%;
}

.board-head{
  padding: 5px 10px;
  background-color: #ebecf0;
  height: 17%;
}

.banner {
  width: 100%;
  height: auto;
}

.banner-content {
  position: absolute;
  top: 30%;
  left: 200px;
  color: white;
}

.tag-card {
  box-shadow: 0 0 8px #a1a1a1;
  border-radius: 20px;
  height: 90px;
  cursor: pointer;
}
</style>
