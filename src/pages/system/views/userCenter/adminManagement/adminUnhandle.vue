<template>
  <div>

<!--    tab begin-->
    <a-tabs type="card">

      <a-tab-pane key="1" tab="发布端信息">
        <a-row>
          <a-col>
            <p>
              产业类信息：
            </p>
            <a-table
              :columns="columns"
              :data-source="industryResources"
              :row-key="record => record.ID"
              :pagination="false"
              :loading="industryLoading"
            >
              <template slot="isDraft" slot-scope="text, record">
                {{ text.isDraft ? '草稿' : '发布' }}
              </template>
              <template slot="auditStatus" slot-scope="text, record">
                {{ text.auditStatus | filterAuditStatus }}
              </template>
              <template slot="action" slot-scope="text, record">
                <a @click="showHandleModal('industryResource' ,record)">处理</a>
              </template>
            </a-table>
            <a-row class="mt-20">
              <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="industryPageIndex" :total="industryCount" />
            </a-row>
          </a-col>

          <a-col class="mt-20">
            <p>
              土地类信息：
            </p>
            <a-table
              :columns="columns"
              :data-source="landResources"
              :row-key="record => record.ID"
              :pagination="false"
              :loading="landLoading"
            >
              <template slot="isDraft" slot-scope="text, record">
                {{ text.isDraft ? '草稿' : '发布' }}
              </template>
              <template slot="auditStatus" slot-scope="text, record">
                {{ text.auditStatus | filterAuditStatus }}
              </template>
              <template slot="action" slot-scope="text, record">
                <a @click="showHandleModal('landResource' ,record)">处理</a>
              </template>
            </a-table>
            <a-row class="mt-20">
              <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="landPageIndex" :total="landCount" />
            </a-row>
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane key="2" tab="客户端信息">
        Content of Tab Pane 2
      </a-tab-pane>

    </a-tabs>
<!--    tab end-->

    <!--    modal begin-->
    <a-modal width="80%" v-model="modalVisible" :footer="null">
      <div v-show="loading" style="text-align: center">
        <a-spin tip="加载中..."></a-spin>
      </div>
      <publishIndustryResource v-if="handleType === 'industryResource'" :history="true" :historyStringify="industryStringify"></publishIndustryResource>
      <publishLandResource v-if="handleType === 'landResource'" :history="true" :historyStringify="landStringify"></publishLandResource>
      <a-row class="mt-20">
        <a-col style="border: 1px solid transparent" :span="2"></a-col>
        <a-col :span="20">
          <h3 style="font-weight: bolder; display: inline-block">审核状态：</h3>
          <a-select placeholder="请选择审核状态" v-model="form.auditStatus" style="width: 120px">
            <a-select-option :disabled="index < 2" v-for="(auditStatus, index) of AUDIT_STATUS_2_CN" :key="auditStatus" :value="index">
              {{ auditStatus }}
            </a-select-option>
          </a-select>

          <a-tabs class="mt-10" type="card">
            <a-tab-pane key="常规审核" tab="常规审核">
              <div>
                <h3 style="font-weight: bolder;">常规审核意见：</h3>
                <a-textarea></a-textarea>
              </div>
              <div class="mt-10">
                <h3 style="font-weight: bolder;">平台协议记录：</h3>
                <div>
                  <p>
                    是否和平台签署合作协议：
                    <a-radio-group v-model="form.signedCooperation">
                      <a-radio :value="true">
                        是
                      </a-radio>
                      <a-radio :value="false">
                        否
                      </a-radio>
                    </a-radio-group>
                  </p>
                  说明：<a-input v-model="form.cooperationDesc" style="width: 400px"></a-input>
                </div>
                <div class="mt-10">
                  <p>
                    是否已提交电子版平台协议：
                    <a-radio-group v-model="form.uploadedAgreement">
                      <a-radio :value="true">
                        是
                      </a-radio>
                      <a-radio :value="false">
                        否
                      </a-radio>
                    </a-radio-group>
                  </p>
                  <a-upload
                    name="file"
                    :multiple="true"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  >
                    <a-button> <a-icon type="upload" /> 上传电子版协议 </a-button>
                  </a-upload>
                </div>
                <div class="mt-10">
                  <p>
                    是否已收到纸质版平台协议：
                    <a-radio-group v-model="form.acceptedPaper">
                      <a-radio :value="true">
                        是
                      </a-radio>
                      <a-radio :value="false">
                        否
                      </a-radio>
                    </a-radio-group>
                  </p>
                  说明：<a-input v-model="form.paperDesc" style="width: 400px"></a-input>
                </div>
                <div class="mt-20" style="text-align: center">
                  <a-button type="primary" @click="submitAudit">完成审核</a-button>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="专业审核" tab="专业审核">
              <div>
                <h3 style="font-weight: bolder;">项目关键点提炼：</h3>
                <table style="width: 100%" bordercolor="#e8e8e8" border="2">
                  <tr>
                    <th colspan="4" style="text-align: center">关键点1：项目指标清单</th>
                  </tr>
                  <tr>
                    <th style="width: 25%">项目占地面积（m²）</th>
                    <td style="width: 25%">123</td>
                    <th style="width: 25%">项目综合容积率</th>
                    <td style="width: 25%">123</td>
                  </tr>
                  <tr>
                    <th>项目总建筑面积（m²）</th>
                    <td>123</td>
                    <th>项目地上建筑面积（m²）</th>
                    <td>123</td>
                  </tr>
                  <tr>
                    <th>项目地下建筑面积（m²）</th>
                    <td>123</td>
                    <th>项目地上可售建面（m²）</th>
                    <td>123</td>
                  </tr>
                  <tr>
                    <th>项目地上自持建面（m²）</th>
                    <td>123</td>
                    <th>项目可售比</th>
                    <td>123</td>
                  </tr>
                </table>

                <table style="width: 100%" bordercolor="#e8e8e8" class="mt-20" border="2">
                  <tr>
                    <th colspan="4" style="text-align: center">关键点2：项目现状评估</th>
                  </tr>
                  <tr>
                    <th style="width: 25%">项目类型</th>
                    <td style="width: 25%">123</td>
                    <th style="width: 25%">项目取证进度</th>
                    <td style="width: 25%">123</td>
                  </tr>
                  <tr>
                    <th>项目土地出让时间</th>
                    <td>123</td>
                    <th>项目现状评估</th>
                    <td>123</td>
                  </tr>
                  <tr>
                    <th>项目周边及四至评估</th>
                    <td>123</td>
                    <th>项目交易方式</th>
                    <td>123</td>
                  </tr>
                </table>

                <table style="width: 100%" class="mt-20" bordercolor="#e8e8e8" border="2">
                  <tr>
                    <th colspan="4" style="text-align: center">关键点3：项目报价 单位：万元</th>
                  </tr>
                  <tr>
                    <th style="width: 25%">项目报价</th>
                    <td style="width: 25%">123</td>
                    <th style="width: 25%">项目土地出让金</th>
                    <td style="width: 25%">123</td>
                  </tr>
                  <tr>
                    <th>除土地出让金外有票成本</th>
                    <td>123</td>
                    <th>项目无票溢价</th>
                    <td>123</td>
                  </tr>
                  <tr>
                    <th>项目计容楼面价</th>
                    <td>123</td>
                    <th>项目可售楼面价</th>
                    <td>123</td>
                  </tr>
                </table>
              </div>

              <div class="mt-20">
                <h3 style="font-weight: bolder;">项目专业审查提炼：</h3>
                <table style="width: 100%" bordercolor="#e8e8e8" border="2">
                  <tr>
                    <th style="width: 25%">项目本身审查项类型</th>
                    <td style="width: 25%">123</td>
                    <th style="width: 25%">项目周边审查项类型</th>
                    <td style="width: 25%">123</td>
                  </tr>
                  <tr>
                    <th>资产抵押</th>
                    <td>123</td>
                    <th>周边是否存在影响施工的不利因素</th>
                    <td>123</td>
                  </tr>
                  <tr>
                    <th>股权抵押</th>
                    <td>123</td>
                    <th>周边是否存在引起客户反感的设施并计算实际距离</th>
                    <td>123</td>
                  </tr>
                  <tr>
                    <th>地块过往是否有引起客户方案的用途</th>
                    <td>123</td>
                    <th>周边是否存在辐射影响的设施并计算实际距离</th>
                    <td>123</td>
                  </tr>
                   <tr>
                    <th>地块是否存在地质风险</th>
                    <td>123</td>
                    <th>周边是否存在空气污染的设施并计算实际距离</th>
                    <td>123</td>
                  </tr>
                   <tr>
                    <th>地块内是否存在需拆迁的建筑物</th>
                    <td>123</td>
                    <th>周边是否存在噪音污染的设施并计算实际距离</th>
                    <td>123</td>
                  </tr>
                  <tr>
                    <th>地块内是否存在受保护的历史文物</th>
                    <td>123</td>
                    <th>周边是否存在安全隐患设施并计算实际距离</th>
                    <td>123</td>
                  </tr>
                  <tr>
                    <th>地块内的市政设施是否存在影响后期居住的缺陷</th>
                    <td>123</td>
                    <th>未来3年-4年规划中，地块周边是否出现上述不利因素</th>
                    <td>123</td>
                  </tr>
                </table>
              </div>

              <div class="mt-20">
                <h3 style="font-weight: bolder;">项目投资建议：</h3>
                <a-textarea></a-textarea>
              </div>

              <div class="mt-20" style="text-align: center">
                  <a-button type="primary" @click="submitAudit">完成审核</a-button>
                </div>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-modal>

<!--    modal end-->

    <!--    预加载地图相关组件，防止显示历史信息时莫名其妙的bug-->
    <BaiduMap
      :ak="ak"
      :center="{lng: 0,lat: 0}"
      v-show="false"
    >
      <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>
      <BaiduNavigation anchor="BMAP_ANCHOR_TOP_RIGHT"></BaiduNavigation>
      <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>
      <BaiduGeolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :autoLocation="true"></BaiduGeolocation>
      <BaiduPolygon :clicking="true" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true"/>
      <BaiduSearch :page-capacity="2" :auto-viewport="true"></BaiduSearch>
      <BaiduCircle :center="{lng: 0,lat: 0}" stroke-color="blue" :fillColor="''" :stroke-opacity="0.5" :stroke-weight="2"></BaiduCircle>
    </BaiduMap>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BaiduScale from 'vue-baidu-map/components/controls/Scale'
import BaiduNavigation from 'vue-baidu-map/components/controls/Navigation'
import BaiduMapType from 'vue-baidu-map/components/controls/MapType'
import BaiduGeolocation from 'vue-baidu-map/components/controls/Geolocation'
import BaiduPolygon from 'vue-baidu-map/components/overlays/Polygon'
import BaiduSearch from 'vue-baidu-map/components/search/LocalSearch'
import BaiduCircle from 'vue-baidu-map/components/overlays/Circle'
import industryApi from '@system/api/industryResource'
import landApi from '@system/api/landResource'
import publishIndustryResource from '../industryResource/publishIndustryResource'
import publishLandResource from '../landResource/publishLandResource'
import userApi from '@system/api/user'
import {mapGetters} from 'vuex'
import {AUDIT_STATUS, AUDIT_STATUS_2_CN} from '../../../../../utils/constants'

const columns = [
  {
    title: '标 题',
    dataIndex: 'title',
    ellipsis: true,
    key: 'title'
  },
  {
    title: '创建者',
    dataIndex: 'creator.user_name',
    ellipsis: true,
    width: 100,
    key: 'creator'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    ellipsis: true,
    width: 150,
    key: 'createdAt'
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    ellipsis: true,
    width: 150,
    key: 'updatedAt'
  },
  {
    title: '状 态',
    key: 'isDraft',
    width: 100,
    scopedSlots: { customRender: 'isDraft' }
  },
  {
    title: '审核状态',
    key: 'auditStatus',
    width: 100,
    scopedSlots: { customRender: 'auditStatus' }
  },
  {
    title: '操 作',
    key: 'action',
    ellipsis: true,
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'adminUnhandle',
  components: {
    publishIndustryResource,
    BaiduMap,
    BaiduMapType,
    BaiduPolygon,
    BaiduGeolocation,
    BaiduCircle,
    BaiduSearch,
    BaiduScale,
    BaiduNavigation,
    publishLandResource
  },
  filters: {
    'filterAuditStatus': (value) => {
      if (!value) {
        value = 0
      }
      return AUDIT_STATUS_2_CN[value - '']
    }
  },
  data () {
    return {
      form: {
        auditStatus: null,
        signedCooperation: false,
        cooperationDesc: '',
        paperDesc: '',
        acceptedPaper: false,
        uploadedAgreement: false
      },
      columns,
      AUDIT_STATUS_2_CN,
      landStringify: '',
      industryStringify: '',
      handleType: '',
      handleID: '',
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo',
      industryResources: [],
      landResources: [],
      pageSize: 10,
      industryCount: 0,
      landCount: 0,
      loading: false,
      industryLoading: false,
      landLoading: false,
      modalVisible: false,
      landPageIndex: 1,
      industryPageIndex: 1
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    init () {
      this.industryLoading = true
      this.landLoading = true
      this.loading = true
      this.getIndustries()
      this.getLands()
    },
    getLands () {
      landApi.getLandResources({
        pageSize: this.pageSize,
        pageIndex: this.landPageIndex,
        owner: false,
        adminID: this.userInfo.ID,
        isDraft: false,
        auditStatus: 'null or underAudit'
      }).then(res => {
        this.landCount = res.data.data.count
        this.landResources = res.data.data.landResources
        this.landLoading = false
      })
    },
    getIndustries () {
      industryApi.getIndustryResources({
        pageSize: this.pageSize,
        pageIndex: this.industryPageIndex,
        owner: false,
        adminID: this.userInfo.ID,
        isDraft: false,
        auditStatus: 'null or underAudit'
      }).then(res => {
        this.industryCount = res.data.data.count
        this.industryResources = res.data.data.industryResources
        this.industryLoading = false
      })
    },
    submitAudit () {
      if (!this.form.auditStatus) {
        this.$error('请选择审核状态!')
        return
      }
      if (this.handleType === 'landResource') {
        landApi.editLandResource(this.handleID, {
          auditStatus: this.form.auditStatus,
          audit: this.form
        }).then(res => {
          this.getLands()
          this.modalVisible = false
        })
      }
      if (this.handleType === 'industryResource') {
        industryApi.editIndustryResource(this.handleID, {
          auditStatus: this.form.auditStatus,
          audit: this.form
        }).then(res => {
          this.getIndustries()
          this.modalVisible = false
        })
      }
    },
    showHandleModal (resourceType, record) {
      this.loading = true
      this.modalVisible = true
      this.handleID = record.ID
      if (resourceType === 'landResource') {
        this.handleType = 'landResource'
        landApi.getLandResource(record.ID, {
          auditStatus: AUDIT_STATUS.UnderAudit
        }).then(res => {
          this.landStringify = res.data.data.stringify
          this.loading = false
        })
      }
      if (resourceType === 'industryResource') {
        this.handleType = 'industryResource'
        industryApi.getIndustryResource(record.ID, {
          auditStatus: AUDIT_STATUS.UnderAudit
        }).then(res => {
          this.industryStringify = res.data.data.stringify
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>
th {
  padding: 10px;
  background-color: #fafafa;
}

td {
  padding: 10px;
}
</style>
