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
            <a-input size="small" style="width: 600px" v-model="form.name"></a-input>
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
            <h2 style="font-weight: bolder">请选择产业项目的详细功能或形式分类</h2>
            <a-col>
              文<span style="margin-left: 28px">化</span>：
              <span v-for="item of cultureOptions" style="cursor: pointer" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

             <a-col class="mt-10">
               旅<span style="margin-left: 28px">游</span>：
              <span v-for="item of travelOptions" style="cursor: pointer" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

             <a-col class="mt-10">
               教<span style="margin-left: 28px">育</span>：
              <span v-for="item of educationOptions" style="cursor: pointer" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              医<span style="margin-left: 28px">养</span>：
              <span v-for="item of hospitalOptions" style="cursor: pointer" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              体<span style="margin-left: 28px">育</span>：
              <span v-for="item of physicalOptions" style="cursor: pointer" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              商<span style="margin-left: 28px">业</span>：
              <span v-for="item of businessOptions" style="cursor: pointer" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              总部经济：
              <span v-for="item of headquarterOptions" style="cursor: pointer" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>

            <a-col class="mt-10">
              产业园区：
              <span v-for="item of industrialParkOptions" style="cursor: pointer" @click="switchFunctionOrClass(item)" :class="(form.functionOrClassList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
                {{ item }}
              </span>
            </a-col>
          </a-row>

          <a-row class="mt-10">
            <h2 style="font-weight: bolder">项目封面图片：</h2>
            <a-col :span="12">
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.coverPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  class="file-uploader"
                  list-type="picture-card"
                  @change="handleChange($event, ['form'],'coverPicList')"
                >
                  <div v-if="form.coverPicList.length < 1">
                    <a-icon style="font-size: 14px; color: #2c3e50" :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
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
                  @change="handleChange($event, ['form'],'brandLogoList')"
                >
                  <div v-if="form.brandLogoList.length < 1">
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
              </a-col>
            </a-col>
            <a-col :span="24">
              公司及资源项目操作经验介绍：
              <a-textarea v-model="form.operationExperienceIntroduction" class="mt-10"></a-textarea>
            </a-col>
            <a-col class="mt-20 mb-20" :span="24">
              电子版介绍上传：
              <a-upload-dragger
                name="file"
                :file-list="form.introductionFileList"
                :multiple="true"
                :withCredentials="true"
                :action="uploadFileURL"
                @change="handleChange($event, ['form'],'introductionFileList', 'file')"
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

<!--          operation case begin-->

          <div>

            <a-radio @click.prevent="changeStatus('operationCase')" v-model="form.operationCase.status">本项目已有已投入运营的案例</a-radio>

            <div v-show="form.operationCase.status" class="gray-board" style="padding: 10px 20px; border-bottom-left-radius: 0; border-bottom-right-radius: 0">
              <span v-if="form.operationCase.cases.length === 0" class="gray-font" style="font-size: 15px; font-weight: normal">暂无案例</span>
              <span v-for="(_, index) of form.operationCase.cases" :key="'operationCase' + index" style="font-size: 15px; margin-right: 20px">
                <span @click="showCase(index)" :class="showCaseIndex === index ? 'blue' : 'clickable-txt'">案例{{ index + 1 }} </span>
                <span @click="deleteCase(index)" class="clickable-txt">[删除]</span>
              </span>
              <span class="clickable-txt" @click="addOperationCase" style="font-size: 15px; float: right"><a-icon type="plus"/>增加更多案例</span>
            </div>

            <div v-show="form.operationCase.status" v-if="showCaseIndex !== null" style="border: solid 1px #e8e8e8; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; padding: 10px 20px">
              <h2 style="font-weight: bolder">产业落地案例项目介绍</h2>

              <a-row>
                <span class="input-tag">地区: </span>
                <a-cascader style="width: 30%" v-model="form.operationCase.cases[showCaseIndex].location" :options="locationOptions" placeholder="请选择所在地区"/>
              </a-row>

              <a-row class="mt-20">
                <span class="input-tag">面积: </span>
                <a-radio v-model="form.operationCase.cases[showCaseIndex].spaceType === 'aboveGround'" @click="form.operationCase.cases[showCaseIndex].spaceType = 'aboveGround'">地上 </a-radio>
                <a-radio v-model="form.operationCase.cases[showCaseIndex].spaceType === 'underGround'" @click="form.operationCase.cases[showCaseIndex].spaceType = 'underGround'">占地 </a-radio>
                <a-input v-model="form.operationCase.cases[showCaseIndex].space" type="number" style="width: 200px"></a-input>
                <span v-if="form.operationCase.cases[showCaseIndex].spaceType === 'aboveGround'"> 万 m² </span><span v-else> 亩 </span>
              </a-row>

              <a-row class="mt-20">
                <span class="input-tag">项目类型: </span>
                <a-checkbox-group v-model="form.operationCase.cases[showCaseIndex].itemTypeList" :options="itemTypeOptions" />
                <a-input v-show="form.operationCase.cases[showCaseIndex].itemTypeList.includes('自定义')" v-model="form.operationCase.cases[showCaseIndex].customItemType" style="width: 200px" size="small"></a-input>
              </a-row>

              <a-row class="mt-10">
                <h2 style="font-weight: bolder">项目简介</h2>
                <a-textarea v-model="form.operationCase.cases[showCaseIndex].introduction"></a-textarea>
                <span class="gray-font" style="font-weight: normal; font-size: 14px">
                  提示：介绍项目包含的具体内容、运营情况，及开业时间、客流量、带来就业人口、税收、取得社会效益等。
                </span>
              </a-row>

              <a-row class="mt-10">
                <h2 style="font-weight: bolder">封面图片</h2>
                <a-col :span="12">
                  <a-upload
                    :action="uploadPicURL"
                    name="file"
                    :file-list="form.operationCase.cases[showCaseIndex].coverPicList"
                    :withCredentials="true"
                    @preview="handlePreview"
                    class="file-uploader"
                    list-type="picture-card"
                    @change="handleChange($event, ['form', 'operationCase', 'cases', showCaseIndex],'coverPicList')"
                  >
                    <div v-if="form.operationCase.cases[showCaseIndex].coverPicList.length < 1">
                      <a-icon :type="loading ? 'loading' : 'plus'" />
                    </div>
                  </a-upload>
                </a-col>
              </a-row>

              <a-row class="mt-10">
                <h2 style="font-weight: bolder">照片/资料</h2>
                <a-col :span="12">
                  <div style="display: inline-block" v-for="(pic, index) of form.operationCase.cases[showCaseIndex].otherPicList" :key="'otherPicList' + index">
                    <div @click="handlePreview(pic)" class="upload-add" style="display: flex; justify-content: center">
                      <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                    </div>
                    <div>
                      <a-input v-model="pic.description" placeholder="描述" style="width: 104px; margin-top: 10px"></a-input>
                    </div>
                  </div>
                  <a-upload
                    :action="uploadPicURL"
                    name="file"
                    :file-list="form.operationCase.cases[showCaseIndex].otherPicList"
                    :withCredentials="true"
                    @preview="handlePreview"
                    style="vertical-align: top"
                    class="file-uploader"
                    list-type="text"
                    @change="handleChange($event, ['form', 'operationCase', 'cases', showCaseIndex],'otherPicList')"
                  >
                    <div class="upload-add" v-if="form.operationCase.cases[showCaseIndex].otherPicList.length < 4">
                      <a-icon  class="upload-add-icon" :type="loading ? 'loading' : 'plus'" />
                    </div>
                  </a-upload>
                </a-col>
              </a-row>
            </div>

          </div>
<!--          operation case end-->

<!--          规划方案 begin-->
          <div class="mt-10">
            <a-radio @click.prevent="changeStatus('plan')" v-model="form.plan.status">本项目有规划方案</a-radio>

            <div v-show="form.plan.status">
              <a-row class="mt-10">
                <h2 style="font-weight: bolder">项目规划方案简介</h2>
                <a-textarea v-model="form.plan.description"></a-textarea>
                <span class="gray-font" style="font-size: 14px; font-weight: normal">
                  提示：介绍项目规划中包含的具体内容、预期取得社会效益等。
                </span>
              </a-row>

              <a-row class="mt-10">
                <h2 style="font-weight: bolder">封面图片</h2>
                <a-col :span="12">
                  <a-upload
                    :action="uploadPicURL"
                    name="file"
                    :file-list="form.plan.coverPicList"
                    :withCredentials="true"
                    @preview="handlePreview"
                    class="file-uploader"
                    list-type="picture-card"
                    @change="handleChange($event, ['form', 'plan'],'coverPicList')"
                  >
                    <div v-if="form.plan.coverPicList.length < 1">
                      <a-icon :type="loading ? 'loading' : 'plus'" />
                    </div>
                  </a-upload>
                </a-col>
              </a-row>

              <a-row class="mt-10">
                <h2 style="font-weight: bolder">照片/资料</h2>
                <a-col :span="12">
                  <div style="display: inline-block" v-for="(pic, index) of form.plan.otherPicList" :key="'otherPicList' + index">
                    <div @click="handlePreview(pic)" class="upload-add" style="display: flex; justify-content: center">
                      <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                    </div>
                    <div>
                      <a-input v-model="pic.description" placeholder="描述" style="width: 104px; margin-top: 10px"></a-input>
                    </div>
                  </div>
                  <a-upload
                    :action="uploadPicURL"
                    name="file"
                    :file-list="form.plan.otherPicList"
                    :withCredentials="true"
                    @preview="handlePreview"
                    style="vertical-align: top"
                    class="file-uploader"
                    list-type="text"
                    @change="handleChange($event, ['form', 'plan'],'otherPicList')"
                  >
                    <div class="upload-add" v-if="form.plan.otherPicList.length < 4">
                      <a-icon  class="upload-add-icon" :type="loading ? 'loading' : 'plus'" />
                    </div>
                  </a-upload>
                </a-col>
              </a-row>
            </div>
          </div>

<!--          规划方案 end-->

<!--          暂无案例及规划方案 begin-->
          <div class="mt-10">
            <a-radio v-model="noPlanNoOperationCase">本项目暂无案例及规划方案</a-radio>
          </div>
<!--          暂无案例及规划方案 end-->

        </div>

        <div class="mt-20 sub-gray-line">
          <h2 style="font-weight: bolder">匹配项目建设要求</h2>
          按选址区域：
          <div class="mt-10">
            按<span style="margin-left: 22px">地</span><span style="margin-left: 22px">域</span>：
            <span v-for="item of areaOptions" style="cursor: pointer" @click="switchAreaRequirement(item)" :class="(form.matchRequirement.areaList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
              {{ item }}
            </span>
          </div>
          <div class="mt-10">
            按 城 市 能 级：
            <span v-for="item of cityClassOptions" style="cursor: pointer" @click="switchAreaRequirement(item)" :class="(form.matchRequirement.areaList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
              {{ item }}
            </span>
          </div>
          <div class="mt-10">
            按城市功能区：
            <span v-for="item of cityFunctionOptions" style="cursor: pointer" @click="switchAreaRequirement(item)" :class="(form.matchRequirement.areaList.includes(item) ? 'blue' : 'clickable-txt') + ' ml-10'" :key="item">
              {{ item }}
            </span>
          </div>

          <div class="mt-10">
            项目选址的其他特殊要求：
            <a-textarea class="mt-10" v-model="form.matchRequirement.specialRequirement"></a-textarea>
          </div>

          <h2 style="font-weight: bolder" class="mt-20">占地面积</h2>
          <div>
            本项目预计占地面积 <a-input type="number" style="width: 80px" size="small" v-model="form.smallSpace"></a-input> 平方米 —— <a-input style="width: 80px" type="number" size="small" v-model="form.largeSpace"></a-input> 平方米
          </div>

          <h2 style="font-weight: bolder" class="mt-20">投资金额</h2>
          <div>
            本项目预计投资金额 <a-input type="number" style="width: 80px" size="small" v-model="form.lessInvestment"></a-input> 万元 —— <a-input style="width: 80px" type="number" size="small" v-model="form.largeInvestment"></a-input> 万元
          </div>

          <h2 style="font-weight: bolder" class="mt-20">项目优势自荐</h2>
          <a-textarea v-model="form.advantage"></a-textarea>
          <span class="gray-font" style="font-size: 14px; font-weight: normal">
            提示：可介绍包括项目能给区域带来的人流、对区域配套设施的完善、提高地产项目售价、提升去化速度等各种利好，带动就业人口、亩均纳税，以及项目的稀缺性、项目运营特色等各方面优势。
          </span>

          <h2 style="font-weight: bolder" class="mt-20">合作模式要求</h2>
          <div>
            <div>
              合作投资需求：
              <a-radio-group class="mt-10" v-model="form.cooperationRequirement">
                <a-radio v-for="item of cooperationRequirementOptions" :key="item" :value="item">
                  {{ item }}
                </a-radio>
              </a-radio-group>
            </div>
            <div class="mt-10">
              产业方收益需求：
              <a-radio-group class="mt-10" v-model="form.benefitRequirement">
                <a-radio v-for="item of benefitRequirementOptions" :key="item" :value="item">
                  {{ item }}
                </a-radio>
              </a-radio-group>
            </div>
            <div class="mt-10">
              其他合作要求：
              <a-textarea class="mt-10" v-model="form.otherCooperationRequirement"></a-textarea>
              <span class="gray-font" style="font-size: 14px; font-weight: normal">
                提示：可详细介绍本方对产业项目投资和收益的具体要求。
              </span>
            </div>
          </div>

          <a-button class="mt-20" type="primary" @click="showSubmitModal">提 交 资 方 信 息</a-button>
        </div>
      </a-col>

      <!--      modal begin-->
      <a-modal width="80%" :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
        <img style="width: 100%" :src="previewImage" />
      </a-modal>

      <a-modal v-model="submitModalVisible" width="50%" :footer="null" @close="submitModalVisible = false">
        <div slot="title" style="text-align: center">
          信息真实承诺及发布须知
        </div>
        <a-row>
          1、本人承诺所录入信息及上传资料均属真实可靠，允许提交后由摩贝云系统项目工作人员进行真实性审查并与发布者进行相关核实工作。
        </a-row>
        <a-row class="mt-10">
          2、本人已知晓项目通过平台推送后，发布人所属项目方与平台所推荐意向购买人达成合作并签署合作协议的，
          平台将会向该项目方收取相应服务费(本项目未达成合作则不收取任何费用)。本人同意由摩贝云系统工作人员与本人联系，告知并签署相应协议。
        </a-row>
        <a-row style="text-align: center" class="mt-10">
          <a-button :disabled="true" v-if="countDown > 0" style="margin-left:40px;width: 130px">{{ '还需阅读' + countDown + '秒' }}</a-button>
          <a-button type="primary" v-else style="margin-left:40px;width: 20%" @click="submit">提 交</a-button>
        </a-row>
      </a-modal>
      <!--      modal end-->
    </a-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import userVerify from '../../components/userVerify'
import utils from '@/utils/utils'
import {HTTP} from '@/utils/constants'
import options from '@/utils/cities'
import api from '@system/api/industryResource'

const cooperationRequirementOptions = [
  '产业投资由产业方负责',
  '要求合作方承担部分产业投资',
  '要求合作方承担全部产业投资',
  '要求合作方承担全部产业投资并支付额外费用'
]

const benefitRequirementOptions = [
  '产业方获取产业资源运营权',
  '产业方获取产业资源所有权及运营权',
  '产业方获取产业资源所有权、运营权并需分享其他收益'
]

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

const cityFunctionOptions = [
  '城市核心区',
  '城市建成区',
  '城市发展新区',
  '城市近远郊区',
  '特殊自然资源区域'
]

const cityClassOptions = [
  '一线城市',
  '二线城市',
  '三/四线城市',
  '旅游城市',
  '工业城市',
  '县城'
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
    noPlanNoOperationCase: {
      get: function () {
        return !this.form.plan.status && !this.form.operationCase.status
      },
      set: function (val) {
        if (val) {
          this.form.plan.status = false
          this.form.operationCase.status = false
        }
      }
    },
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

      if (this.form.name) {
        res += this.form.name + ' '
      }

      if (this.form.cooperationFormList.length) {
        for (let cooperationForm of this.form.cooperationFormList) {
          if (res && res[res.length - 1] !== ' ' && !cooperationForm.includes('+')) {
            res += '/'
          }
          res += cooperationForm
        }
      }

      if (!res) res = '暂无'

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.form.title = res

      return res
    }
  },
  data () {
    return {
      mode: 'create',
      form: {
        areaList: [],
        coverPicList: [],
        title: '',
        coverPicUuid: '',
        smallSpace: 0,
        largeSpace: 0,
        advantage: '',
        industryClasses: [],
        cooperationRequirement: [],
        benefitRequirement: [],
        otherCooperationRequirement: '',
        lessInvestment: 0,
        largeInvestment: 0,
        operationCase: {
          status: false,
          cases: []
        },
        plan: {
          status: false,
          introduction: '',
          coverPicList: [],
          otherPicList: []
        },
        matchRequirement: {
          areaList: [],
          specialRequirement: ''
        },
        itemTypeList: [],
        cooperationFormList: [],
        brandLogoList: [],
        introductionFileList: [],
        functionOrClassList: [],
        customItemType: '',
        fullName: '',
        name: '',
        operationExperienceIntroduction: '',
        brand: ''
      },
      previewVisible: false,
      loading: false,
      uploadPicURL: '',
      uploadFileURL: '',
      previewImage: '',
      locationOptions: options,
      cityFunctionOptions: cityFunctionOptions,
      cooperationRequirementOptions: cooperationRequirementOptions,
      benefitRequirementOptions: benefitRequirementOptions,
      industrialParkOptions: industrialParkOptions,
      cityClassOptions: cityClassOptions,
      areaOptions: areaOptions,
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
      certificateModalVisible: false,
      submitModalVisible: false,
      countDown: 5,
      showCaseIndex: null
    }
  },
  mounted () {
    this.uploadPicURL = process.env.API_ROOT + '/system/pics/'
    this.uploadFileURL = process.env.API_ROOT + '/system/files/'
    this.init()
  },
  methods: {
    ...mapActions(['getUserInfo']),
    init () {
      // 如果有 id 说明是编辑模式
      if (this.$route.params.id) {
        this.mode = 'edit'
        api.getIndustryResource(this.$route.params.id).then((res) => {
          this.form = JSON.parse(res.data.data.stringify)
        })
      }
    },
    showSubmitModal () {
      // todo: 数据合法性鉴定

      // 身份认证检测
      if (!this.userInfo.certificationVerified && this.userInfo.certificate.ID === 0) {
        this.$error('请先完成实名认证！')
        this.certificateModalVisible = true
        return
      }

      if (!this.userInfo.certificationVerified && this.userInfo.certificate.ID !== 0) {
        this.$error('请等待管理员确认实名认证！')
        return
      }

      this.submitModalVisible = true

      this.form.areaList = this.form.matchRequirement.areaList
      this.form.caseNum = this.form.operationCase.cases.length
      this.form.planNum = 0
      if (this.form.plan.status) {
        this.form.planNum = 1
      }

      if (this.form.coverPicList.length) {
        this.form.coverPicUuid = this.form.coverPicList[0].uuid
      }

      this.countDown = 5
      let interval = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown -= 1
        } else {
          clearInterval(interval)
        }
      }, 1000)
    },
    submit () {
      if (this.mode === 'create') {
        this.performSubmit()
      } else {
        this.edit()
      }
    },
    performSubmit () {
      api.publishIndustryResource(this.form).then(() => {
        this.$success('发布成功!')
        this.$router.push({name: 'userCenterIndustryResource'})
      })
    },
    edit () {
      api.editIndustryResource(this.$route.params.id, this.form).then(() => {
        this.$success('修改成功!')
        this.$router.push({name: 'userCenterIndustryResource'})
      })
    },
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
    deleteCase (index) {
      this.form.operationCase.cases.splice(index, 1)

      if (index <= this.showCaseIndex) {
        this.showCaseIndex -= 1
      }

      if (this.showCaseIndex < 0) {
        if (this.form.operationCase.cases.length) {
          this.showCaseIndex = 0
        } else {
          this.showCaseIndex = null
        }
      }
    },
    showCase (index) {
      this.showCaseIndex = index
    },
    addOperationCase () {
      if (this.form.operationCase.cases.length > 9) {
        this.$info('运营案例不能大于十个！')
        return
      }

      // mark1
      this.form.operationCase.cases.push({
        location: [],
        spaceType: 'aboveGround',
        space: 0,
        itemTypeList: [],
        coverPicList: [],
        otherPicList: [],
        customItemType: '',
        introduction: ''
      })

      this.showCaseIndex = this.form.operationCase.cases.length - 1
    },
    changeStatus (index) {
      this.form[index].status = !this.form[index].status
    },
    async handleChange (info, forms, list, type = 'pic') {
      let form = this

      for (let temp of forms) {
        form = form[temp]
      }

      if (info.fileList.length === 0) {
        form[list] = []
        return
      }

      this.loading = true

      if (!info.file.response) {
        info.fileList[info.fileList.length - 1].status = 'uploading'
      } else if (info.file.response.code !== HTTP.SUCCESS) {
        if (type === 'pic' && !info.fileList[info.fileList.length - 1].thumbUrl) {
          info.fileList[info.fileList.length - 1].thumbUrl = await utils.getBase64(info.file.originFileObj)
        }
        info.fileList[info.fileList.length - 1].status = 'error'
        delete info.fileList[info.fileList.length - 1].originFileObj
        this.loading = false
      } else {
        // Get this url from response in real world.
        if (type === 'pic' && !info.fileList[info.fileList.length - 1].thumbUrl) {
          info.fileList[info.fileList.length - 1].thumbUrl = await utils.getBase64(info.file.originFileObj)
        }
        info.fileList[info.fileList.length - 1].status = 'done'
        info.fileList[info.fileList.length - 1].uuid = info.file.response.data.uuid
        delete info.fileList[info.fileList.length - 1].originFileObj
        this.loading = false
      }

      form[list] = info.fileList
    },
    switchAreaRequirement (item) {
      if (this.form.matchRequirement.areaList.includes(item)) {
        this.form.matchRequirement.areaList.remove(item)
        return
      }
      this.form.matchRequirement.areaList.push(item)
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
