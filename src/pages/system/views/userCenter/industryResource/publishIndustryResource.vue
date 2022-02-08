<template>
    <a-row class="mt-40" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>
      <a-col :span="20">
        <a-row class="left-blue part-title can-not-select" style="width: 100%">
          <h1 style="display: inline">发布产业资源</h1>
          <div style="float: right">
            <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID === 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />点击完成实名认证</a>
            <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID !== 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />等待管理员认证</a>
            <a v-if="userInfo.certificationVerified" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: forestgreen;" theme="filled" type="down-circle" />已完成实名认证</a>
          </div>
          <userVerify @changed="certificateChange" :editable="(userInfo.certificate.ID === 0) && (!userInfo.certificationVerified)" :passedInCertificateForm="certificateForm" :certificateModalVisible="certificateModalVisible" @closeUserVerifyModal="certificateModalVisible = false"></userVerify>
        </a-row>

        <div class="mt-20 sub-gray-line">
          <a-row>
            <h2 style="font-weight: bolder">项目类型</h2>
            <a-checkbox-group v-model="form.itemTypeList" :options="itemTypeOptions" />
            <a-input v-show="form.itemTypeList.includes('自定义')" v-model="form.customItemType" style="width: 200px" size="small"></a-input>
          </a-row>

          <a-row class="mt-10">
            <h2 style="font-weight: bolder">名称</h2>
            <a-input size="small" style="width: 600px" v-model="form.title"></a-input>
          </a-row>

          <a-row class="mt-10">
            <h2 style="font-weight: bolder">合作形式</h2>
            <a-checkbox-group v-model="form.cooperationFormList" :options="cooperationFormOptions" />
          </a-row>

          <a-row class="mt-10">
            <h2 style="font-weight: bolder">项目名称</h2>
            <span class="blue">
              {{ itemTitle }}
            </span>
          </a-row>

          <a-row class="mt-10">
            <h2 style="font-weight: bolder">请选择产业项目的详细功能或形式分类：</h2>
            <a-col>
              文<span style="margin-left: 28px">化</span>：
              <span v-for="item of cultureOptions" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

             <a-col class="mt-10">
               旅<span style="margin-left: 28px">游</span>：
              <span v-for="item of travelOptions" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

             <a-col class="mt-10">
               教<span style="margin-left: 28px">育</span>：
              <span v-for="item of educationOptions" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              医<span style="margin-left: 28px">养</span>：
              <span v-for="item of hospitalOptions" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              体<span style="margin-left: 28px">育</span>：
              <span v-for="item of physicalOptions" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              商<span style="margin-left: 28px">业</span>：
              <span v-for="item of businessOptions" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              总部经济：
              <span v-for="item of headquarterOptions" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              产业园区：
              <span v-for="item of industrialParkOptions" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>
          </a-row>

          <a-row class="mt-10">
            <h2 style="font-weight: bolder">资源方情况介绍</h2>
            <a-col :span="12">
              <a-col>
                产业资源品牌：<a-input size="small" style="width: 50%" v-model="form.brand"></a-input>
              </a-col>
              <a-col class="mt-20">
                产业资源方全称：<a-input size="small" style="width: 50%" v-model="form.fullName"></a-input>
              </a-col>
            </a-col>
            <a-col :span="12">
              <a-col :span="3">
                logo：
              </a-col>
              <a-col :span="6">
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.brandLogoList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  class="file-uploader"
                  list-type="picture-card"
                  @change="handleChange($event, 'form','brandLogoList')"
                >
                  <div v-if="form.brandLogoList.length < 1">
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
              </a-col>
            </a-col>
            <a-col>
              公司及资源项目操作经验介绍：
              <a-textarea v-model="form.operationExperienceIntroduction" class="mt-10"></a-textarea>
            </a-col>
            <a-col class="mt-20 mb-20">
              电子版介绍上传：
              <a-upload-dragger
                name="file"
                :file-list="form.introductionFileList"
                :multiple="true"
                :withCredentials="true"
                :action="uploadFileURL"
                @change="handleChange($event, 'form','introductionFileList', 'file')"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">
                  上传电子版介绍
                </p>
              </a-upload-dragger>
            </a-col>
          </a-row>
        </div>

        <div class="mt-20 sub-gray-line">
          <a-radio @click.prevent="changeStatus('operationCase')" v-model="form.operationCase.status">本项目已有已投入运营的案例</a-radio>
          <div class="gray-board" style="padding: 10px 20px; border-bottom-left-radius: 0; border-bottom-right-radius: 0">
            <span v-if="form.operationCase.cases.length === 0" class="gray-font" style="font-size: 20px; font-weight: normal">暂无案例</span>
            <span v-for="(_, index) of form.operationCase.cases" :key="'operationCase' + index" class="clickable-txt" style="font-size: 20px">案例{{ index + 1 }} </span>
            <span class="clickable-txt" @click="addOperationCase" style="font-size: 20px; float: right"><a-icon type="plus"/>增加更多案例</span>
          </div>
          <div style="border: solid 1px #e8e8e8; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; padding: 10px 20px">
            <h2 style="font-weight: bolder">产业落地案例项目介绍</h2>
          </div>
        </div>
      </a-col>

      <!--      modal begin-->
      <a-modal width="80%" :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
        <img style="width: 100%" :src="previewImage" />
      </a-modal>
      <!--      modal end-->
    </a-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import userVerify from '../../components/userVerify'
import utils from '@/utils/utils'
import { HTTP } from '@/utils/constants'

const industrialParkOptions = [
  '新能源',
  '人工智能',
  '智能制造',
  '物流园区',
  '孵化基地',
  '其他产业'
]

const headquarterOptions = [
  '企业总部',
  '数字经济',
  '金融保险',
  '游戏软件',
  '互联网+',
  '创客中心',
  '其他领域'
]

const cooperationFormOptions = [
  '投资',
  '品牌导入',
  'IP 资源导入',
  '客户资源导入',
  ' + 运营'
]

const businessOptions = [
  '购物中心',
  '商业街区',
  '奥特莱斯',
  '百货超市',
  '专业市场',
  '特色餐饮'
]

const physicalOptions = [
  '赛事引入',
  '赛事运营',
  '训练基地',
  '体育场馆',
  '体育小镇',
  '休闲游乐',
  '电子竞技'
]

const travelOptions = [
  '农业旅游',
  '工业改造',
  '室内游乐',
  '室外游乐',
  '儿童娱乐',
  '民俗特色',
  '民宿',
  '酒店'
]

const hospitalOptions = [
  '综合医院',
  '中医医院',
  '专科医院',
  '农业康养',
  '文旅康养',
  '养老院',
  '大健康'
]

const educationOptions = [
  '幼儿园',
  'K9 名校',
  'K12 名校',
  '高等院校',
  '中专技校',
  '专业培训',
  '科学研发'
]

const cultureOptions = [
  '广播影视',
  '文艺表演',
  '文化艺术',
  '文娱休闲',
  '博物展览',
  '历史文化'
]

const itemTypeOptions = [
  '文化类',
  '旅游类',
  '教育类',
  '体育类',
  '医养类',
  '商业类',
  '总部经济',
  '产业园区',
  '自定义'
]

export default {
  name: 'publishIndustryResource',
  components: {
    userVerify
  },
  computed: {
    ...mapGetters(['userInfo']),
    'itemTitle' () {
      let res = ''
      if (this.form.itemTypeList.length) {
        res += '【'
        for (let itemType of this.form.itemTypeList) {
          if (res !== '【') {
            res += '/'
          }
          if (itemType !== '自定义') res += itemType
        }
        if (this.form.itemTypeList.includes('自定义')) res += this.form.customItemType
        res += '】 '
      }

      if (this.form.title) {
        res += this.form.title + ' '
      }

      if (this.form.cooperationFormList.length) {
        for (let cooperationForm of this.form.cooperationFormList) {
          if (res && res[res.length - 1] !== ' ' && !cooperationForm.includes('+')) {
            res += '/'
          }
          res += cooperationForm
        }
      }

      if (!res) return '暂无'
      return res
    }
  },
  data () {
    return {
      form: {
        operationCase: {
          status: false,
          cases: []
        },
        itemTypeList: [],
        cooperationFormList: [],
        brandLogoList: [],
        introductionFileList: [],
        functionOrClassList: [],
        customItemType: '',
        fullName: '',
        title: '',
        operationExperienceIntroduction: '',
        brand: ''
      },
      previewVisible: false,
      loading: false,
      uploadPicURL: '',
      uploadFileURL: '',
      previewImage: '',
      industrialParkOptions: industrialParkOptions,
      headquarterOptions: headquarterOptions,
      itemTypeOptions: itemTypeOptions,
      businessOptions: businessOptions,
      physicalOptions: physicalOptions,
      educationOptions: educationOptions,
      cultureOptions: cultureOptions,
      hospitalOptions: hospitalOptions,
      travelOptions: travelOptions,
      cooperationFormOptions: cooperationFormOptions,
      certificateForm: {},
      certificateModalVisible: false
    }
  },
  mounted () {
    this.uploadPicURL = process.env.API_ROOT + '/system/pics/'
    this.uploadFileURL = process.env.API_ROOT + '/system/files/'
  },
  methods: {
    ...mapActions(['getUserInfo']),
    async certificateChange () {
      await this.getUserInfo()
      this.certificateForm = this.userInfo.certificate
    },
    async handlePreview (file) {
      if (!file.uuid && !file.preview && file.response.data.status === 'temp') {
        file.preview = await utils.getBase64(file.originFileObj)
      }
      this.previewImage = (process.env.API_ROOT + '/system/pics/temp/' + file.uuid + '/') || file.preview
      this.previewVisible = true
    },
    addOperationCase () {
      if (this.form.operationCase.cases.length > 9) {
        this.$info('运营案例不能大于十个！')
        return
      }
      this.form.operationCase.cases.push({})
    },
    changeStatus (index) {
      this.form[index].status = !this.form[index].status
    },
    async handleChange (info, form, list, type = 'pic') {
      if (info.fileList.length === 0) {
        this[form][list] = []
        return
      }

      if (type === 'pic' && !info.fileList[info.fileList.length - 1].thumbUrl) {
        info.fileList[info.fileList.length - 1].thumbUrl = await utils.getBase64(info.file.originFileObj)
      }

      this.loading = true

      if (!info.file.response) {
        info.fileList[info.fileList.length - 1].status = 'uploading'
      } else if (info.file.response.code !== HTTP.SUCCESS) {
        info.fileList[info.fileList.length - 1].status = 'error'
        this.loading = false
      } else {
        // Get this url from response in real world.
        this.loading = false
        info.fileList[info.fileList.length - 1].status = 'done'
        info.fileList[info.fileList.length - 1].uuid = info.file.response.data.uuid
      }

      this[form][list] = info.fileList
    },
    switchFunctionOrClass (item) {
      if (this.form.functionOrClassList.includes(item)) {
        this.form.functionOrClassList.remove(item)
        return
      }
      this.form.functionOrClassList.push(item)
    }
  }
}
</script>

<style scoped>

</style>
