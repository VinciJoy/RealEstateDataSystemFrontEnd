<template>
  <a-row class="mt-40" :gutter="40">
    <a-col style="border: 1px solid transparent" :span="2"></a-col>
    <a-col :span="20">
      <a-row class="left-blue part-title can-not-select" style="width: 100%">
        <h1 style="display: inline">定制我的需求</h1>
        <div style="float: right" v-if="!history">
          <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID === 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />点击完成实名认证</a>
          <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID !== 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />等待管理员认证</a>
          <a v-if="userInfo.certificationVerified" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: forestgreen;" theme="filled" type="down-circle" />已完成实名认证</a>
        </div>
        <userVerify @changed="certificateChange" :editable="(userInfo.certificate.ID === 0) && (!userInfo.certificationVerified)" :passedInCertificateForm="certificateForm" :certificateModalVisible="certificateModalVisible" @closeUserVerifyModal="certificateModalVisible = false"></userVerify>
      </a-row>
      <a-col class="mt-20" :span="24">
        <a-select v-model="form.resourceType" style="width: 300px">
          <a-select-option value="landResource" key="landResource">
            土地资源
          </a-select-option>
          <a-select-option value="industryResource" key="industryResource">
            产业资源
          </a-select-option>
        </a-select>
      </a-col>
      <a-col class="mt-20" :span="24" v-show="form.resourceType === 'landResource'">
        <h2 style="font-weight: bolder">关注区域</h2>
        <span @click="switchList(['landResource', 'areaList'], option)" :class="'ml-10 ' + (form.landResource.areaList.includes(option) ? 'blue' : 'clickable-txt')" v-for="option of areaOptions" :key="'area' + option">
          {{ option }}
        </span>

        <h2 class="mt-20" style="font-weight: bolder">用地性质</h2>
        <span @click="switchList(['landResource', 'typeList'], option)" :class="'ml-10 ' + (form.landResource.typeList.includes(option) ? 'blue' : 'clickable-txt')" v-for="option of ITEM_TYPES" :key="'type' + option">
          {{ option }}
        </span>
        <a-input style="display: inline-block; width: 20%;" class="ml-10" placeholder="请输入自定义内容" v-model="form.landResource.customType" v-if="form.landResource.typeList.includes('自定义')"></a-input>

        <h2 class="mt-20" style="font-weight: bolder">开发状态</h2>
        <span @click="switchList(['landResource', 'formationList'], option)" :class="'ml-10 ' + (form.landResource.formationList.includes(option) ? 'blue' : 'clickable-txt')" v-for="option of itemFormations" :key="'formation' + option">
          {{ option }}
        </span>

        <h2 class="mt-20" style="font-weight: bolder">交易形式</h2>
        <span @click="switchList(['landResource', 'exchangeList'], option)" :class="'ml-10 ' + (form.landResource.exchangeList.includes(option) ? 'blue' : 'clickable-txt')" v-for="option of EXCHANGE_TYPES" :key="'exchange' + option">
          {{ option }}
        </span>
        <a-input style="display: inline-block; width: 20%;" class="ml-10" placeholder="请输入自定义内容" v-model="form.landResource.customExchange" v-if="form.landResource.exchangeList.includes('自定义')"></a-input>
      </a-col>
      <a-col class="mt-20" :span="24" v-show="form.resourceType === 'industryResource'">
        <h2 style="font-weight: bolder">关注区域</h2>
        <span @click="switchList(['industryResource', 'areaList'], option)" :class="'ml-10 ' + (form.industryResource.areaList.includes(option) ? 'blue' : 'clickable-txt')" v-for="option of areaOptions" :key="'industryResource.area' + option">
          {{ option }}
        </span>

        <h2 style="font-weight: bolder" class="mt-20">拟引入的产业类别</h2>
        <span @click="switchList(['industryResource', 'typeList'], option)" :class="'ml-10 ' + (form.industryResource.typeList.includes(option) ? 'blue' : 'clickable-txt')" v-for="option of itemTypeOptions" :key="'industryResource.type' + option">
          {{ option }}
        </span>
        <a-input style="display: inline-block; width: 20%;" class="ml-10" placeholder="请输入自定义内容" v-model="form.industryResource.customType" v-if="form.industryResource.typeList.includes('自定义')"></a-input>

        <h2 style="font-weight: bolder" class="mt-20">合作形式</h2>
        <span @click="switchList(['industryResource', 'cooperationList'], option)" :class="'ml-10 ' + (form.industryResource.cooperationList.includes(option) ? 'blue' : 'clickable-txt')" v-for="option of cooperationFormOptions" :key="'industryResource.cooperation' + option">
          {{ option }}
        </span>

      </a-col>

      <a-col :span="24" class="mt-20">
        <h3 style="font-weight: bolder;">如有新土地/项目符合上述条件，请按以下方式推送给我</h3>
        <a-radio :checked="form.alertSystem" @click="form.alertSystem = !form.alertSystem">在摩贝云系统中提醒</a-radio>
        <a-radio :checked="form.alertPhone" @click="form.alertPhone = !form.alertPhone">短信提示</a-radio>
      </a-col>
      <a-col class="mt-20" :span="24">
        <a-button @click="submitSubscribe" type="primary">
          提 交 需 求
        </a-button>
      </a-col>
    </a-col>
  </a-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import userVerify from '../../components/userVerify'
import {areaOptions, ITEM_TYPES, itemFormations, EXCHANGE_TYPES, itemTypeOptions, cooperationFormOptions} from '@/utils/constants'
import api from '@system/api/subscribe'

export default {
  name: 'publishSubscribe',
  components: {
    userVerify
  },
  props: {
    historyStringify: {
      type: String
    },
    history: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data () {
    return {
      certificateModalVisible: false,
      ITEM_TYPES,
      areaOptions,
      itemFormations,
      cooperationFormOptions,
      itemTypeOptions,
      EXCHANGE_TYPES,
      certificateForm: {},
      mode: 'edit',
      form: {
        ID: null,
        resourceType: 'landResource',
        landResource: {
          typeList: [],
          exchangeList: [],
          formationList: [],
          areaList: [],
          customType: '',
          customExchange: ''
        },
        industryResource: {
          typeList: [],
          areaList: [],
          cooperationList: [],
          customType: ''
        },
        alertSystem: false,
        alertPhone: false
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions(['getUserInfo']),
    init () {
      this.certificateForm = this.userInfo.certificate

      // 如果有 id 说明是编辑模式
      if (this.$route.params.id) {
        this.mode = 'edit'
        api.getSubscribe(this.$route.params.id).then((res) => {
          this.form = JSON.parse(res.data.data.stringify)
          this.form.ID = this.$route.params.id
        })
      } else {
        this.mode = 'create'
      }
    },
    submitSubscribe () {
      api.createSubscribe(this.form).then(res => {
        this.$success('定制需求成功！')
        this.$router.push({name: 'userCenterSubscribe'})
      })
    },
    async certificateChange () {
      await this.getUserInfo()
      this.certificateForm = this.userInfo.certificate
    },
    switchList (list, area) {
      let temp = this.form
      for (let l of list) {
        temp = temp[l]
      }
      if (temp.includes(area)) {
        temp.remove(area)
      } else {
        temp.push(area)
      }
    }
  }
}
</script>

<style scoped>

</style>
