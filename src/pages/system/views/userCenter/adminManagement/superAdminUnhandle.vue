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
              <template slot="action" slot-scope="text, record">
                <a @click="showHandleModal('industryResource' ,record.ID)">处理</a>
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
              <template slot="action" slot-scope="text, record">
                <a @click="showHandleModal('landResource' ,record.ID)">处理</a>
              </template>
            </a-table>
            <a-row class="mt-20">
              <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="landPageIndex" :total="landCount" />
            </a-row>
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane key="2" tab="客户端信息">
        <p>
          咨询信息：
        </p>
        <a-table
          :columns="consultColumns"
          :data-source="consultList"
          :row-key="record => record.ID"
          :pagination="false"
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
          <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="consultPageIndex" :total="consultCount" />
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
        <a-button type="primary" @click="showAllocateTaskModal">管理员委托</a-button>
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
        <a-button type="primary" @click="showAllocateTaskModal">管理员委托</a-button>
      </div>
    </a-modal>

    <a-modal
      v-model="adminModalVisible"
      @ok="allocateTask(null)"
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
    scopedSlots: { customRender: 'resourceType' }
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
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data () {
    return {
      columns,
      consultColumns,
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
      pageSize: 10,
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
      userApi.getUsers({pageSize: this.pageSize, pageIndex: 0, admin: true}).then(res => {
        this.admins = res.data.data.users
        this.loading = false
      })
      this.getIndustries()
      this.getLands()
      this.getConsults()
    },
    getConsults () {
      consultApi.getConsults({
        pageSize: this.pageSize,
        pageIndex: this.consultPageIndex,
        adminID: 'null'
      }).then(res => {
        this.consultCount = res.data.data.count
        this.consultList = res.data.data.consults
        this.consultLoading = false
      })
    },
    getLands () {
      landApi.getLandResources({
        pageSize: this.pageSize,
        pageIndex: this.landPageIndex,
        owner: false,
        adminID: 'null',
        isDraft: false
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
        adminID: 'null',
        isDraft: false
      }).then(res => {
        this.industryCount = res.data.data.count
        this.industryResources = res.data.data.industryResources
        this.industryLoading = false
      })
    },
    allocateTask (id) {
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
        if (this.handleType === 'landResource') {
          landApi.editLandResource(this.handleID, {
            admin: adminID
          }).then(res => {
            this.$success('任务委托成功！')
            this.getLands()
            this.adminModalVisible = false
            this.landModalVisible = false
          })
          return
        }
        if (this.handleType === 'industryResource') {
          industryApi.editIndustryResource(this.handleID, {
            admin: adminID
          }).then(res => {
            this.$success('任务委托成功！')
            this.getIndustries()
            this.adminModalVisible = false
            this.industryModalVisible = false
          })
        }
      }
    },
    showAllocateTaskModal () {
      this.selectedAdmin = []
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
