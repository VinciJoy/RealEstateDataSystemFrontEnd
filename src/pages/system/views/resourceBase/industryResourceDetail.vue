<template>
  <a-row class="mt-40" :gutter="40">
    <a-col style="border: 1px solid transparent" :span="2"></a-col>
    <a-col :span="20">
<!--      head-->
      <a-row class="mt-20 sub-gray-line" :gutter="20" style="height: 200px;">
        <a-col :span="6" style="height: 100%; max-width: 100%; display: flex; justify-content: center">
          <img v-if="itemBaseInfo.coverPicUuid" style="max-width: 100%; max-height: 100%" :src="picBaseURL + itemBaseInfo.coverPicUuid"/>
          <img v-else style="width: 100%; height: 100%" src="../../../../../static/imgs/default-img.jpeg"/>
        </a-col>
        <a-col :span="18" style="height: 100%;">
          <a-col>
            <a-col :span="16">
              <h2>
                {{ itemBaseInfo.title }}
              </h2>
            </a-col>
            <a-col class="info-desc-content" style="text-align: right" :span="8">
              <p style="margin-bottom: 0">
                更新时间：{{ itemBaseInfo.updatedAt }}
              </p>
              <p>
                300k
              </p>
            </a-col>
          </a-col>
          <a-row class="can-not-select" :gutter="20" style="width: 100%; position: absolute; bottom: 0">
            <a-col style="font-size: 18px; line-height: 1.8">
              <a-col>
                推荐指数:
                <img v-for="i in (Math.floor(itemBaseInfo.recommendation / 2))" :key="'full_star' + i" src="../../../../../static/imgs/fullstar.png"/>
                <img v-if="itemBaseInfo.recommendation % 2" src="../../../../../static/imgs/halfstar.png"/>
                <img v-for="i in (Math.floor((10 - itemBaseInfo.recommendation) / 2))" :key="'un_star' + i" src="../../../../../static/imgs/unstar.png"/>
                <div style="float: right">
                  <a-button type="primary" :loading="loading" v-show="!itemBaseInfo.liked" @click="likeResource"><a-icon type="folder"/>收藏本信息</a-button>
                  <a-button :loading="loading" v-show="itemBaseInfo.liked" @click="likeResource"><a-icon type="folder"/>取消收藏</a-button>
                  <a-button @click="showConsultModal" :loading="loading" type="primary">更多咨询</a-button>
                </div>
              </a-col>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <a-row>
        <a-col class="right-gray-line" :span="18">
          <a-col class="mt-10" style="text-align: center">
            <span :class="'clickable-txt ' + (selectedTag === 'basic' ? 'selected' : '')" @click="selectedTag = 'basic'">基础信息</span>
            <span :class="'clickable-txt ' + (selectedTag === 'review' ? 'selected' : '')" @click="selectedTag = 'review'">审核意见</span>
            <span :class="'clickable-txt ' + (selectedTag === 'more' ? 'selected' : '')" @click="selectedTag = 'more'">更多资讯</span>
          </a-col>

          <div v-show="selectedTag === 'basic'">

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">项目类型：</h2>
              <span>{{ (form.itemTypeList && form.itemTypeList.length) ? form.itemTypeList.join("/") : '暂无' }}</span>
            </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">合作形式：</h2>
              <span>{{ cooperationFormListComputed }}</span>
            </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">产业项目的详细功能或形式分类：</h2>
              <span>{{ (form.functionOrClassList && form.functionOrClassList.length) ? form.functionOrClassList.join("/") : '暂无' }}</span>
            </a-col>

            <a-row class="mt-20">
              <h2 style="font-weight: bolder">资源方情况介绍：</h2>
              <a-col :span="12">
                <a-col>
                  产业资源品牌：<span>{{ form.brand ? form.brand : '暂无' }}</span>
                </a-col>
              </a-col>
              <a-col :span="1">
                logo：
              </a-col>
              <a-col :span="8">
                <div v-if="(form.brandLogoList && form.brandLogoList.length)" @click="handlePreview({uuid: form.brandLogoList[0].response.data.uuid})" class="upload-add" style="display: flex; justify-content: center">
                  <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="picBaseURL + form.brandLogoList[0].response.data.uuid" />
                </div>
                <div v-else>
                  暂无
                </div>
              </a-col>
            </a-row>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">公司及资源项目操作经验介绍：</h2>
              {{ form.operationExperienceIntroduction ? form.operationExperienceIntroduction : '暂无' }}
            </a-col>

            <a-col v-if="form.operationCase && form.operationCase.status" class="mt-20">
              <h2 style="font-weight: bolder">已落地项目介绍：</h2>
              <div v-if="form.operationCase && form.operationCase.status">
              <div class="gray-board" style="padding: 10px 20px; border-bottom-left-radius: 0; border-bottom-right-radius: 0">
                <span v-if="(!form.operationCase.cases || form.operationCase.cases.length === 0)" class="gray-font" style="font-size: 15px; font-weight: normal">暂无案例</span>
                <span v-for="(_case, index) of form.operationCase.cases" :key="'operationCase' + index" style="font-size: 15px; margin-right: 20px">
                  <span @click="showCase(index)" :class="showCaseIndex === index ? 'blue' : 'clickable-txt'">{{ _case.title ? _case.title : '案例' + (index + 1) }} </span>
                </span>
              </div>

                <div v-if="showCaseIndex !== null" style="border: solid 1px #e8e8e8; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; padding: 10px 20px">

              <a-row class="mt-10">
                <a-col :span="12">
                  <img v-if="(form.operationCase.cases[showCaseIndex].coverPicList && form.operationCase.cases[showCaseIndex].coverPicList.length)" style="width: 80px; height: 80px" :src="picBaseURL + form.operationCase.cases[showCaseIndex].coverPicList[0].response.data.uuid"/>
                </a-col>
              </a-row>

              <a-row class="mt-10">
                <span class="input-tag">项目名称: </span>
                {{ form.operationCase.cases[showCaseIndex].title ? form.operationCase.cases[showCaseIndex].title : '暂无' }}
              </a-row>

              <a-row class="mt-10">
                <span class="input-tag">位置: </span>
                {{ (form.operationCase.cases[showCaseIndex].location && form.operationCase.cases[showCaseIndex].location.length) ? form.operationCase.cases[showCaseIndex].location.join("/") : '暂无' }}
              </a-row>

              <a-row class="mt-10">
                <span class="input-tag">面积: </span>
                <span v-if="!form.operationCase.cases[showCaseIndex].space">
                  暂无
                </span>
                <span v-else>
                  {{ form.operationCase.cases[showCaseIndex].spaceType === 'aboveGround' ? '地上 ' : '占地 ' }}
                  {{ form.operationCase.cases[showCaseIndex].space }}
                  <span v-if="form.operationCase.cases[showCaseIndex].spaceType === 'aboveGround'"> 万 m² </span><span v-else> 万 m² </span>
                </span>
              </a-row>

              <a-row class="mt-10">
                <span class="input-tag">项目类型: </span>
                {{ (form.operationCase.cases[showCaseIndex].itemTypeList && form.operationCase.cases[showCaseIndex].itemTypeList.length) ? form.operationCase.cases[showCaseIndex].itemTypeList.join("/") : '暂无' }}
              </a-row>

              <a-row class="mt-10">
                <h2 style="font-weight: bolder">项目简介</h2>
                {{ form.operationCase.cases[showCaseIndex].introduction ? form.operationCase.cases[showCaseIndex].introduction : '暂无' }}
              </a-row>

              <a-row class="mt-10">
                <h2 style="font-weight: bolder">照片/资料</h2>
                <a-col :span="12">
                  <div v-if="form.operationCase.cases[showCaseIndex].otherPicList && form.operationCase.cases[showCaseIndex].otherPicList.length">
                    <div style="display: inline-block" v-for="(pic, index) of form.operationCase.cases[showCaseIndex].otherPicList" :key="'otherPicList' + index">
                      <div @click="handlePreview(pic)" class="upload-add" style="display: flex; justify-content: center">
                        <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                      </div>
                      <div>
                        {{ pic.description ? pic.description : '暂无' }}
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    暂无
                  </div>
                </a-col>
              </a-row>
            </div>

              </div>
              <div v-else>
                暂无
              </div>
            </a-col>

            <a-col v-if="form.plan && form.plan.status" class="mt-20">
              <h2 style="font-weight: bolder">本项目有规划方案：</h2>
                <div v-if="form.plan && form.plan.status" style="border: solid 1px #e8e8e8; border-radius: 5px; padding: 10px 20px">

                <a-row class="mt-10">
                  <h2 style="font-weight: bolder">项目规划方案简介</h2>
                  {{ form.plan.description ? form.plan.description : '暂无' }}
              </a-row>

              <a-row class="mt-10">
                <h2 style="font-weight: bolder">封面图片</h2>
                <div v-if="(form.plan.coverPicList && form.plan.coverPicList.length)" @click="handlePreview({uuid: form.plan.coverPicList[0].response.data.uuid})" class="upload-add" style="display: flex; justify-content: center">
                  <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="picBaseURL + form.plan.coverPicList[0].response.data.uuid" />
                </div>
                <div v-else>
                  暂无
                </div>
              </a-row>

              <a-row class="mt-10">
                <h2 style="font-weight: bolder">照片/资料</h2>
                <a-col :span="12">
                  <div style="display: inline-block" v-for="(pic, index) of form.plan.otherPicList" :key="'otherPicList' + index">
                    <div @click="handlePreview(pic)" class="upload-add" style="display: flex; justify-content: center">
                      <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                    </div>
                    <div>
                      {{ pic.description ? pic.description : '暂无' }}
                    </div>
                  </div>
                </a-col>
              </a-row>
              </div>
              <div v-else>
                暂无
              </div>
            </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">匹配项目建设要求：</h2>
              <div class="mt-10">
                按<span style="margin-left: 22px">地</span><span style="margin-left: 22px">域</span>：
                {{ matchRequirementArea }}
              </div>
              <div class="mt-10">
                按 城 市 能 级：
                {{ matchRequirementCityClass }}
              </div>
              <div class="mt-10">
                按城市功能区：
                {{ matchRequirementCityFunction }}
              </div>

              <div class="mt-10">
                项目选址的其他特殊要求：
                {{ (form.matchRequirement && form.matchRequirement.specialRequirement) ? form.matchRequirement.specialRequirement : '暂无' }}
              </div>
            </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">占地面积：</h2>
              <div>
                本项目预计占地面积 {{ form.smallSpace ? form.smallSpace : '暂无' }} 平方米 —— {{ form.largeSpace ? form.largeSpace : '暂无' }} 平方米
              </div>
            </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">投资金额：</h2>
              <div>
                本项目预计投资金额 {{ form.lessInvestment ? form.lessInvestment : '暂无' }} 万元 —— {{ form.largeInvestment ? form.largeInvestment : '暂无' }} 万元
              </div>
            </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">项目优势自荐：</h2>
              <div>
                {{ form.advantage ? form.advantage : '暂无' }}
              </div>
            </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">合作模式要求：</h2>
              <div>
                合作投资需求：{{ form.cooperationRequirement ? form.cooperationRequirement : '暂无' }}
              </div>
              <div>
                产业方收益需求：{{ form.benefitRequirement ? form.benefitRequirement : '暂无' }}
              </div>
              <div>
                其他合作要求：：{{ form.otherCooperationRequirement ? form.otherCooperationRequirement : '暂无' }}
              </div>
            </a-col>

            <a-row class="mt-20" style="text-align: center">
              <span style="color: #a1a1a1">——————————  本月剩余5条免费土地信息，购买<span style="color: #40a9ff; cursor: pointer">更多信息</span>查看权限  ——————————</span>
            </a-row>
          </div>
        </a-col>
        <a-col :span="6"></a-col>
      </a-row>

    </a-col>

<!--    modal begin-->
    <a-modal width="80%" :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>

    <a-modal
      v-model="consultModalVisible"
      :maskClosable="false"
      :closable="false"
      okText="确认并提交"
      :confirm-loading="loading"
      @ok="createConsult"
    >
      <a-row>
        <a-col :span="24">
          请您填写如下信息，以便后续工作人员和您取得联系：
        </a-col>
        <a-col :span="12" class="mt-10">
          姓名：<a-input v-model="consultInfo.name" style="width: 70%"></a-input>
        </a-col>
        <a-col :span="12" class="mt-10">
          电话：<a-input v-model="consultInfo.phone" style="width: 70%"></a-input>
        </a-col>
        <a-col :span="12" class="mt-10">
          公司：<a-input v-model="consultInfo.company" style="width: 70%"></a-input>
        </a-col>
        <a-col :span="12" class="mt-10">
          职务：<a-input v-model="consultInfo.position" style="width: 70%"></a-input>
        </a-col>
        <a-col :span="24" class="mt-10">
          <div>
            对本资源的诉求或疑问：
          </div>
          <a-textarea v-model="consultInfo.desc"></a-textarea>
        </a-col>
        <a-col :span="24" class="mt-10">
          提示：点击“确认并提交”后，摩贝云工作人员会与您联系。摩贝云将不会对您及您所在公司收取任何费用，请您确认通过摩贝云平台了解并有意向推进本项目，点击“确认并提交”按钮。
        </a-col>
      </a-row>
    </a-modal>
<!--    modal end-->
  </a-row>
</template>

<script>
import api from '@system/api/industryResource'
import consultApi from '@system/api/consult'
import utils from '@/utils/utils'
import { mapGetters } from 'vuex'

const cityClassOptions = [
  '一线城市',
  '二线城市',
  '三/四线城市',
  '旅游城市',
  '工业城市',
  '县城'
]

const cityFunctionOptions = [
  '城市核心区',
  '城市建成区',
  '城市发展新区',
  '城市近远郊区',
  '特殊自然资源区域'
]

const areaOptions = [
  '全国',
  '华北区域',
  '华东区域',
  '华中区域',
  '东北区域',
  '西北区域',
  '华南区域',
  '西南区域',
  '港澳台及海外'
]

export default {
  name: 'industryResourceDetail',
  data () {
    return {
      loading: false,
      picBaseURL: '',
      consultModalVisible: false,
      form: {
        itemTypeList: [],
        functionOrClassList: [],
        cooperationFormList: []
      },
      consultInfo: {
        resourceType: 'industryResource',
        resourceID: '',
        name: '',
        company: '',
        desc: '',
        phone: '',
        position: ''
      },
      previewImage: '',
      areaOptions: areaOptions,
      cityClassOptions: cityClassOptions,
      cityFunctionOptions: cityFunctionOptions,
      previewVisible: false,
      selectedTag: 'basic',
      showCaseIndex: null,
      itemBaseInfo: {
        updatedAt: '',
        title: '',
        liked: false,
        recommendation: 0,
        coverPicUuid: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    'matchRequirementArea' () {
      let res = []
      if (!this.form.matchRequirement || !this.form.matchRequirement.areaList) return '暂无'
      for (let item of this.form.matchRequirement.areaList) {
        if (this.areaOptions.includes(item)) {
          res.push(item)
        }
      }
      if (!res.length) return '暂无'
      return res.join('/')
    },
    'matchRequirementCityClass' () {
      let res = []
      if (!this.form.matchRequirement || !this.form.matchRequirement.areaList) return '暂无'
      for (let item of this.form.matchRequirement.areaList) {
        if (this.cityClassOptions.includes(item)) {
          res.push(item)
        }
      }
      if (!res.length) return '暂无'
      return res.join('/')
    },
    'matchRequirementCityFunction' () {
      if (!this.form.matchRequirement || !this.form.matchRequirement.areaList) return '暂无'
      let res = []
      for (let item of this.form.matchRequirement.areaList) {
        if (this.cityFunctionOptions.includes(item)) {
          res.push(item)
        }
      }
      if (!res.length) return '暂无'
      return res.join('/')
    },
    'cooperationFormListComputed' () {
      let res = ''
      if (this.form.cooperationFormList && this.form.cooperationFormList.length) {
        for (let cooperationForm of this.form.cooperationFormList) {
          if (res && res[res.length - 1] !== ' ' && !cooperationForm.includes('+')) {
            res += '/'
          }
          res += cooperationForm
        }
      }

      if (!res) res = '暂无'
      return res
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.picBaseURL = process.env.API_ROOT + '/system/pics/temp/'
      this.consultInfo.resourceID = this.$route.params.id - ''
      api.getIndustryResource(this.$route.params.id).then((res) => {
        this.form = JSON.parse(res.data.data.stringify)
        this.itemBaseInfo.updatedAt = res.data.data.industryResource.updatedAt
        this.itemBaseInfo.title = res.data.data.industryResource.title
        this.itemBaseInfo.recommendation = res.data.data.industryResource.recommendation
        this.itemBaseInfo.coverPicUuid = res.data.data.industryResource.coverPicUuid
        this.itemBaseInfo.liked = res.data.data.industryResource.liked
        if (this.form.operationCase.cases && this.form.operationCase.cases.length !== 0) {
          this.showCaseIndex = 0
        }
      }).catch(res => {
        this.$router.go(-1)
      })
      if (this.userInfo && this.userInfo.certificate) {
        if (this.userInfo.certificate.name) {
          this.consultInfo.name = this.userInfo.certificate.name
        }
        if (this.userInfo.certificate.company) {
          this.consultInfo.company = this.userInfo.certificate.company
        }
        if (this.userInfo.certificate.position) {
          this.consultInfo.position = this.userInfo.certificate.position
        }
      }
    },
    createConsult () {
      this.loading = true
      consultApi.createConsult(this.consultInfo).then(res => {
        this.$success('提交咨询成功！')
        this.consultModalVisible = false
        this.loading = false
      })
    },
    showConsultModal () {
      this.consultModalVisible = true
    },
    likeResource () {
      this.loading = true
      api.likeIndustryResource(this.$route.params.id).then(res => {
        if (this.itemBaseInfo.liked) {
          this.$success('取消收藏成功！')
          this.loading = false
        } else {
          this.$success('收藏成功！')
          this.loading = false
        }
        this.itemBaseInfo.liked = !this.itemBaseInfo.liked
      })
    },
    async handlePreview (file) {
      if (!file.uuid && !file.preview && file.response.data.status === 'temp') {
        file.preview = await utils.getBase64(file.originFileObj)
      }
      this.previewImage = (process.env.API_ROOT + '/system/pics/temp/' + file.uuid + '/') || file.preview
      this.previewVisible = true
    },
    showCase (index) {
      this.showCaseIndex = index
    }
  }
}
</script>

<style scoped>

</style>
