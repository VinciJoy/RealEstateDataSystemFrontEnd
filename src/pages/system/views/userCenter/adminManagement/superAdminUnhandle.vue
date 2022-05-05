<template>
  <div>

<!--    tab begin-->
    <a-tabs v-model="activeTab" type="card">

      <a-tab-pane key="1" tab="发布端信息">
        <a-row>
          <a-col>
            <p>
              产业类信息：<a-button :disabled="!selectedIndustryRowKeys.length" @click="showAllocateTaskModal(true, 'industryResource')" type="primary">批量委托</a-button>
            </p>
            <a-table
              :columns="columns"
              :row-selection="{ selectedRowKeys: selectedIndustryRowKeys, onChange: (rowKeys) => {selectedIndustryRowKeys = rowKeys} }"
              :data-source="industryResources"
              :row-key="record => record.ID"
              :pagination="false"
              @change="changeIndustrySort"
              :loading="industryLoading"
            >
              <template slot="isDraft" slot-scope="text, record">
                {{ text.isDraft ? '草稿' : '发布' }}
              </template>
              <template slot="action" slot-scope="text, record">
                <a @click="showHandleModal('industryResource' ,record.ID)">处理</a>
              </template>
            </a-table>
            <a-row class="mt-20">
              <div style="display: inline-block">
                每页显示
                <a-select style="width: 70px" v-model="industryPageSize">
                  <a-select-option :value="5">5</a-select-option>
                  <a-select-option :value="10">10</a-select-option>
                  <a-select-option :value="20">20</a-select-option>
                  <a-select-option :value="50">50</a-select-option>
                  <a-select-option :value="100">100</a-select-option>
                </a-select>
                条
              </div>
              <a-pagination style="display: inline-block; float: right;" :page-size="industryPageSize" v-model="industryPageIndex" :total="industryCount" />
            </a-row>
          </a-col>

          <a-col class="mt-20">
            <p>
              土地类信息：<a-button :disabled="!selectedLandRowKeys.length" @click="showAllocateTaskModal(true, 'landResource')" type="primary">批量委托</a-button>
            </p>
            <a-table
              :columns="columns"
              :data-source="landResources"
              :row-selection="{ selectedRowKeys: selectedLandRowKeys, onChange: (rowKeys) => {selectedLandRowKeys = rowKeys} }"
              :row-key="record => record.ID"
              @change="changeLandSort"
              :pagination="false"
              :loading="landLoading"
            >
              <template slot="isDraft" slot-scope="text, record">
                {{ text.isDraft ? '草稿' : '发布' }}
              </template>
              <template slot="action" slot-scope="text, record">
                <a @click="showHandleModal('landResource' ,record.ID)">处理</a>
              </template>
            </a-table>
            <a-row class="mt-20">
              <div style="display: inline-block">
                每页显示
                <a-select style="width: 70px" v-model="landPageSize">
                  <a-select-option :value="5">5</a-select-option>
                  <a-select-option :value="10">10</a-select-option>
                  <a-select-option :value="20">20</a-select-option>
                  <a-select-option :value="50">50</a-select-option>
                  <a-select-option :value="100">100</a-select-option>
                </a-select>
                条
              </div>
              <a-pagination style="display: inline-block; float: right;" :page-size="landPageSize" v-model="landPageIndex" :total="landCount" />
            </a-row>
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane key="2" tab="客户端信息">
        <p>
          咨询信息：<a-button :disabled="!selectConsultRowKeys.length" @click="showAllocateTaskModal(true, 'consult')" type="primary">批量委托</a-button>
        </p>
        <a-table
          :columns="consultColumns"
          :data-source="consultList"
          :row-selection="{ selectedRowKeys: selectConsultRowKeys, onChange: (rowKeys) => {selectConsultRowKeys = rowKeys} }"
          :row-key="record => record.ID"
          :pagination="false"
          @change="changeConsultSort"
          :loading="consultLoading"
        >
          <template slot="resourceType" slot-scope="text, record">
            {{ text.resourceType === 'landResource' ? '土地' : '产业' }}
          </template>
          <template slot="action" slot-scope="text, record">
            <a @click="showHandleModal(text.resourceType, text.resourceID, record)">处理</a>
          </template>
        </a-table>
        <a-row class="mt-20">
          <div style="display: inline-block">
            每页显示
            <a-select style="width: 70px" v-model="consultPageSize">
              <a-select-option :value="5">5</a-select-option>
              <a-select-option :value="10">10</a-select-option>
              <a-select-option :value="20">20</a-select-option>
              <a-select-option :value="50">50</a-select-option>
              <a-select-option :value="100">100</a-select-option>
            </a-select>
            条
          </div>
          <a-pagination style="display: inline-block; float: right;" :page-size="consultPageSize" v-model="consultPageIndex" :total="consultCount" />
        </a-row>
      </a-tab-pane>

    </a-tabs>
<!--    tab end-->

    <!--    modal begin-->
    <a-modal :zIndex="1" width="80%" v-model="industryModalVisible" :footer="null">
      <div v-show="loading" style="text-align: center">
        <a-spin tip="加载中..."></a-spin>
      </div>
      <publishIndustryResource :history="true" :historyStringify="industryStringify"></publishIndustryResource>
      <a-row v-if="consultID" class="mt-10">
        <a-col style="border: 1px solid transparent" :span="2"></a-col>
          <a-col :span="20">
          <a-col :span="12">
            <span style="font-weight: bolder">姓名：</span>{{ consult.userName ? consult.userName : '暂无' }}
          </a-col>
          <a-col :span="12">
            <span style="font-weight: bolder">电话：</span>{{ consult.userPhone ? consult.userPhone : '暂无' }}
          </a-col>
          <a-col :span="12">
            <span style="font-weight: bolder">公司：</span>{{ consult.userCompany ? consult.userCompany : '暂无' }}
          </a-col>
          <a-col :span="12">
            <span style="font-weight: bolder">职务：</span>{{ consult.userPosition ? consult.userPosition : '暂无' }}
          </a-col>
            <a-col :span="24">
              <span style="font-weight: bolder">诉求或疑问：</span>{{ consult.desc ? consult.desc : '暂无' }}
            </a-col>
        </a-col>
      </a-row>
      <div style="text-align: center" class="mt-10">
        <a-button type="primary" @click="allocateTask(userInfo.ID)">超级管理员自审</a-button>
        <a-button type="primary" @click="showAllocateTaskModal(false)">管理员委托</a-button>
      </div>
    </a-modal>

    <a-modal :zIndex="1" width="80%" v-model="landModalVisible" :footer="null">
      <div v-show="loading" style="text-align: center">
        <a-spin tip="加载中..."></a-spin>
      </div>
      <publishLandResource :history="true" :historyStringify="landStringify"></publishLandResource>
      <a-row v-if="consultID" class="mt-10">
        <a-col style="border: 1px solid transparent" :span="2"></a-col>
          <a-col :span="20">
          <a-col :span="12">
            <span style="font-weight: bolder">姓名：</span>{{ consult.userName ? consult.userName : '暂无' }}
          </a-col>
          <a-col :span="12">
            <span style="font-weight: bolder">电话：</span>{{ consult.userPhone ? consult.userPhone : '暂无' }}
          </a-col>
          <a-col :span="12">
            <span style="font-weight: bolder">公司：</span>{{ consult.userCompany ? consult.userCompany : '暂无' }}
          </a-col>
          <a-col :span="12">
            <span style="font-weight: bolder">职务：</span>{{ consult.userPosition ? consult.userPosition : '暂无' }}
          </a-col>
            <a-col :span="24">
              <span style="font-weight: bolder">诉求或疑问：</span>{{ consult.desc ? consult.desc : '暂无' }}
            </a-col>
        </a-col>
      </a-row>
      <div style="text-align: center" class="mt-10">
        <a-button type="primary" @click="allocateTask(userInfo.ID)">超级管理员自审</a-button>
        <a-button type="primary" @click="showAllocateTaskModal(false)">管理员委托</a-button>
      </div>
    </a-modal>

    <a-modal
      v-model="adminModalVisible"
      @ok="allocateTask(null)"
      :confirm-loading="loading"
      :zIndex="2"
    >
      <p>
        选择委托的管理员：
      </p>
      <a-select v-model="selectedAdmin" placeholder="请选择管理员" style="width: 200px">
        <a-select-option v-for="admin of admins" :value="admin.ID" :key="admin.ID">
          {{ admin.user_name }}
        </a-select-option>
      </a-select>
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
import consultApi from '@system/api/consult'
import publishIndustryResource from '../industryResource/publishIndustryResource'
import publishLandResource from '../landResource/publishLandResource'
import userApi from '@system/api/user'
import {mapGetters} from 'vuex'
import utils from '@/utils/utils'

const consultColumns = [
  {
    title: '标 题',
    dataIndex: 'resourceTitle',
    ellipsis: true,
    key: 'title'
  },
  {
    title: '类 型',
    key: 'resourceType',
    scopedSlots: { customRender: 'resourceType' },
    sorter: true
  },
  {
    title: '创建者',
    dataIndex: 'creator.user_name',
    ellipsis: true,
    width: 100,
    key: 'creator',
    sorter: true
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    ellipsis: true,
    width: 150,
    key: 'createdAt',
    sorter: true
  },
  {
    title: '操 作',
    key: 'action',
    ellipsis: true,
    width: 100,
    scopedSlots: { customRender: 'action' }
  }
]

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
    key: 'creator',
    sorter: true
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    ellipsis: true,
    width: 150,
    key: 'createdAt',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    ellipsis: true,
    width: 150,
    key: 'updatedAt',
    sorter: true
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
  name: 'superAdminUnhandle',
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
  watch: {
    'landPageIndex' () {
      this.getLands()
    },
    'consultPageIndex' () {
      this.getConsults()
    },
    'industryPageIndex' () {
      this.getIndustries()
    },
    'consultPageSize' () {
      this.getConsults()
    },
    'landPageSize' () {
      this.getLands()
    },
    'industryPageSize' () {
      this.getIndustries()
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data () {
    return {
      columns,
      activeTab: '1',
      selectedIndustryRowKeys: [],
      selectConsultRowKeys: [],
      selectedLandRowKeys: [],
      consultColumns,
      industryOrder: {
        createdAt: null,
        updatedAt: null,
        auditStatus: null,
        creator: null
      },
      landOrder: {
        createdAt: null,
        updatedAt: null,
        auditStatus: null,
        creator: null
      },
      consultOrder: {
        userName: null,
        resourceType: null,
        creator: null,
        createdAt: null,
        userCompany: null
      },
      landStringify: '',
      industryStringify: '',
      handleType: '',
      handleID: '',
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo',
      industryResources: [],
      consult: {
        userName: '',
        userPosition: '',
        userCompany: '',
        userPhone: '',
        desc: ''
      },
      landResources: [],
      consultList: [],
      admins: [],
      selectedAdmin: [],
      consultPageSize: 5,
      landPageSize: 5,
      industryPageSize: 5,
      industryCount: 0,
      landCount: 0,
      consultCount: 0,
      loading: false,
      consultID: 0,
      consultLoading: false,
      adminModalVisible: false,
      industryLoading: false,
      landLoading: false,
      landModalVisible: false,
      industryModalVisible: false,
      landPageIndex: 1,
      consultPageIndex: 1,
      industryPageIndex: 1
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.industryLoading = true
      this.landLoading = true
      this.consultLoading = true
      this.loading = true
      if (this.$route.query['tab']) {
        this.activeTab = this.$route.query['tab']
      }
      userApi.getUsers({pageSize: 100, pageIndex: 0, admin: true}).then(res => {
        this.admins = res.data.data.users
        this.loading = false
      })
      this.getIndustries()
      this.getLands()
      this.getConsults()
    },
    getConsults () {
      consultApi.getConsults({
        pageSize: this.consultPageSize,
        pageIndex: this.consultPageIndex,
        orderByUserName: utils.convertOrder(this.consultOrder.userName),
        orderByUserCompany: utils.convertOrder(this.consultOrder.userCompany),
        orderByResourceType: utils.convertOrder(this.consultOrder.resourceType),
        orderByCreator: utils.convertOrder(this.consultOrder.creator),
        orderByCreatedAt: utils.convertOrder(this.consultOrder.createdAt),
        adminID: 'null'
      }).then(res => {
        this.consultCount = res.data.data.count
        this.consultList = res.data.data.consults
        this.consultLoading = false
      })
    },
    getLands () {
      landApi.getLandResources({
        pageSize: this.landPageSize,
        pageIndex: this.landPageIndex,
        orderByCreatedAt: utils.convertOrder(this.landOrder.createdAt),
        orderByCreator: utils.convertOrder(this.landOrder.creator),
        orderByUpdatedAt: utils.convertOrder(this.landOrder.updatedAt),
        orderByAuditStatus: utils.convertOrder(this.landOrder.auditStatus),
        owner: false,
        adminID: 'null',
        isDraft: false
      }).then(res => {
        this.landCount = res.data.data.count
        this.landResources = res.data.data.landResources
        this.landLoading = false
      })
    },
    changeIndustrySort  (p, f, s) {
      this.industryOrder = {}
      this.industryOrder[s.columnKey] = s.order
      this.getIndustries()
    },
    changeLandSort  (p, f, s) {
      this.landOrder = {}
      this.landOrder[s.columnKey] = s.order
      this.getLands()
    },
    changeConsultSort  (p, f, s) {
      this.consultOrder = {}
      this.consultOrder[s.columnKey] = s.order
      this.getConsults()
    },
    getIndustries () {
      industryApi.getIndustryResources({
        pageSize: this.industryPageSize,
        pageIndex: this.industryPageIndex,
        owner: false,
        orderByCreatedAt: utils.convertOrder(this.industryOrder.createdAt),
        orderByCreator: utils.convertOrder(this.industryOrder.creator),
        orderByUpdatedAt: utils.convertOrder(this.industryOrder.updatedAt),
        orderByAuditStatus: utils.convertOrder(this.industryOrder.auditStatus),
        adminID: 'null',
        isDraft: false
      }).then(res => {
        this.industryCount = res.data.data.count
        this.industryResources = res.data.data.industryResources
        this.industryLoading = false
      })
    },
    async allocateTask (id) {
      if (!id && this.selectedAdmin.length === 0) {
        this.$error('请先选择委托的管理员！')
      } else {
        let adminID = id || this.selectedAdmin
        if (this.consultID) {
          consultApi.editConsult(this.consultID, {
            admin: adminID
          }).then(res => {
            this.$success('任务委托成功！')
            this.getConsults()
            this.adminModalVisible = false
            this.industryModalVisible = false
            this.landModalVisible = false
          })
          return
        }

        if (this.handleType === 'consult') {
          this.loading = true
          if (this.batchAllocate) {
            for (let id of this.selectConsultRowKeys) {
              await consultApi.editConsult(id, {
                admin: adminID
              })
            }
            this.selectConsultRowKeys = []
            this.loading = false
            this.$success('任务委托成功！')
            this.getConsults()
            this.adminModalVisible = false
            this.landModalVisible = false
            this.industryModalVisible = false
            return
          }
        }

        if (this.handleType === 'landResource') {
          this.loading = true
          if (this.batchAllocate) {
            for (let id of this.selectedLandRowKeys) {
              await landApi.editLandResource(id, {
                admin: adminID
              })
            }
            this.selectedLandRowKeys = []
            this.loading = false
            this.$success('任务委托成功！')
            this.getLands()
            this.adminModalVisible = false
            this.landModalVisible = false
            return
          } else {
            landApi.editLandResource(this.handleID, {
              admin: adminID
            }).then(res => {
              this.$success('任务委托成功！')
              this.getLands()
              this.loading = false
              this.adminModalVisible = false
              this.landModalVisible = false
            })
            return
          }
        }
        if (this.handleType === 'industryResource') {
          this.loading = true
          if (this.batchAllocate) {
            for (let id of this.selectedIndustryRowKeys) {
              await industryApi.editIndustryResource(id, {
                admin: adminID
              })
            }
            this.selectedIndustryRowKeys = []
            this.loading = false
            this.$success('任务委托成功！')
            this.getIndustries()
            this.adminModalVisible = false
            this.industryModalVisible = false
          } else {
            industryApi.editIndustryResource(this.handleID, {
              admin: adminID
            }).then(res => {
              this.loading = false
              this.$success('任务委托成功！')
              this.getIndustries()
              this.adminModalVisible = false
              this.industryModalVisible = false
            })
          }
        }
      }
    },
    showAllocateTaskModal (batchAllocate = false, handleType = null) {
      this.selectedAdmin = []
      this.batchAllocate = batchAllocate
      if (handleType) {
        this.handleType = handleType
      }
      this.adminModalVisible = true
    },
    showHandleModal (resourceType, resourceID = 0, consult = null) {
      this.consultID = 0
      if (consult) {
        this.consultID = consult.ID
      }
      this.consult = consult
      this.loading = true
      if (resourceType === 'landResource') {
        this.landModalVisible = true
        this.handleType = 'landResource'
        this.handleID = resourceID
        landApi.getLandResource(resourceID).then(res => {
          this.landStringify = res.data.data.stringify
          this.loading = false
        })
      }
      if (resourceType === 'industryResource') {
        this.industryModalVisible = true
        this.handleType = 'industryResource'
        this.handleID = resourceID
        industryApi.getIndustryResource(resourceID).then(res => {
          this.industryStringify = res.data.data.stringify
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
