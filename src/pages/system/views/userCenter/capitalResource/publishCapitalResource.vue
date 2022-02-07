<template>
  <div>
    <a-row class="mt-40" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>
      <a-col :span="20">
        <a-row class="left-blue part-title can-not-select" style="width: 100%">
          <h1 style="display: inline">发布资方信息</h1>
          <div style="float: right">
            <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID === 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />点击完成实名认证</a>
            <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID !== 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />等待管理员认证</a>
            <a v-if="userInfo.certificationVerified" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: forestgreen;" theme="filled" type="down-circle" />已完成实名认证</a>
          </div>
          <userVerify @changed="certificateChange" :editable="(userInfo.certificate.ID === 0) && (!userInfo.certificationVerified)" :passedInCertificateForm="certificateForm" :certificateModalVisible="certificateModalVisible" @closeUserVerifyModal="certificateModalVisible = false"></userVerify>
        </a-row>

        <!--        资金用途 begin-->
        <div class="mt-20 sub-gray-line">
          <a-row>
            <h2 style="font-weight: bolder">资金用途</h2>

            <div>
              <a-radio @click.prevent="changeStatus('depositAllocation')" v-model="form.capitalUsage.depositAllocation.status">招拍挂保证金配资</a-radio>
            </div>
            <div class="mt-10" v-show="form.capitalUsage.depositAllocation.status">
              <span style="padding-left: 23px">
                资金规模_____亿元，资金准备时间_______个自然日(距保证金截止时间)， 使用时间_______个自然日，日利率 _____%-_______%.
              </span>
            </div>

            <div class="mt-10">
              <a-radio @click.prevent="changeStatus('landAllocation')" v-model="form.capitalUsage.landAllocation.status">土地款配资(招拍挂)</a-radio>
            </div>
            <div class="mt-10" v-show="form.capitalUsage.landAllocation.status">
              <span style="padding-left: 23px">
                资金规模___亿元，资金来源为_____(募集资金/自有资金)，准备时间/ 募集时间____天，使用时间__-__个月，年化利率___%-___%;
              </span>
            </div>

            <div class="mt-10">
              <a-radio @click.prevent="changeStatus('landHookAllocation')" v-model="form.capitalUsage.landHookAllocation.status">土地款配资(勾地)</a-radio>
            </div>
            <div class="mt-10" v-show="form.capitalUsage.landHookAllocation.status">
              <span style="padding-left: 23px">
                资金规模___亿元，资金来源为_____(募集资金/自有资金)，准备时间/募 集时间____天，使用时间__-__个月，年化利率___%-___%;
              </span>
            </div>

            <div class="mt-10">
              <a-radio @click.prevent="changeStatus('expanseCapital')" v-model="form.capitalUsage.expanseCapital.status">投拓资金池</a-radio>
            </div>
            <div class="mt-10" v-show="form.capitalUsage.expanseCapital.status">
              <span style="padding-left: 23px">
                资金规模___亿元，使用时间__-__个月，年化利率___%-___%;
              </span>
            </div>

            <div class="mt-10">
              <a-radio @click.prevent="changeStatus('projectAcquisition')" v-model="form.capitalUsage.projectAcquisition.status">项目收并购</a-radio>
            </div>
            <div class="mt-10" v-show="form.capitalUsage.projectAcquisition.status">
              <span style="padding-left: 23px">
                资金规模___亿元，募集时间____天，使用时间__-__个月，年化利率___%-___%;
              </span>
            </div>

            <div class="mt-10">
              <a-radio @click.prevent="changeStatus('bridgeLoan')" v-model="form.capitalUsage.bridgeLoan.status">过桥贷</a-radio>
            </div>
            <div class="mt-10" v-show="form.capitalUsage.bridgeLoan.status">
              <span style="padding-left: 23px">
                资金规模___亿元，募集时间____天，使用时间__-__天，年化利率___%-___%;
              </span>
            </div>

            <div class="mt-10">
              <a-radio @click.prevent="changeStatus('mortgageLoan')" v-model="form.capitalUsage.mortgageLoan.status">抵押贷</a-radio>
            </div>
            <div class="mt-10" v-show="form.capitalUsage.mortgageLoan.status">
              <span style="padding-left: 23px">
                资金规模为抵押物估值的_______%;取得批复时间_______天，使用时间_______个月，年化利率______%-_______%.
              </span>
            </div>

          </a-row>
        </div>
        <!--        资金用途 end-->

      </a-col>
    </a-row>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import userVerify from '../../components/userVerify'

export default {
  name: 'publishCapitalResource',
  components: {
    userVerify
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data () {
    return {
      certificateForm: {
        certificatePicList: []
      },
      form: {
        capitalUsage: {
          depositAllocation: {
            status: false,
            detail: {}
          },
          landAllocation: {
            status: false,
            detail: {}
          },
          landHookAllocation: {
            status: false,
            detail: {}
          },
          expanseCapital: {
            status: false,
            detail: {}
          },
          projectAcquisition: {
            status: false,
            detail: {}
          },
          bridgeLoan: {
            status: false,
            detail: {}
          },
          mortgageLoan: {
            status: false,
            detail: {}
          }
        }
      },
      certificateModalVisible: false
    }
  },
  methods: {
    ...mapActions(['getUserInfo']),
    changeStatus (tag) {
      this.form.capitalUsage[tag].status = !this.form.capitalUsage[tag].status
    },
    async certificateChange () {
      await this.getUserInfo()
      this.certificateForm = this.userInfo.certificate
    }
  }
}
</script>

<style scoped>

</style>
