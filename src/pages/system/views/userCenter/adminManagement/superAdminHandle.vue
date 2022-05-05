<template>
  <div>

<!--    tab begin-->
    <a-tabs type="card">

      <a-tab-pane key="1" tab="发布端信息">
        <a-row>
          <a-col>
            <div>
              产业类信息：
            </div>
            <a-table
              :columns="columns"
              :data-source="industryResources"
              :row-key="record => record.ID"
              :pagination="false"
              :loading="industryLoading"
              @change="changeIndustrySort"
            >
              <template slot="isDraft" slot-scope="text, record">
                {{ text.isDraft ? '草稿' : '发布' }}
              </template>
              <template slot="auditStatus" slot-scope="text, record">
                {{ text.auditStatus | filterAuditStatus }}
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
              土地类信息：
            </p>
            <a-table
              :columns="columns"
              :data-source="landResources"
              :row-key="record => record.ID"
              :pagination="false"
              :loading="landLoading"
              @change="changeLandSort"
            >
              <template slot="isDraft" slot-scope="text, record">
                {{ text.isDraft ? '草稿' : '发布' }}
              </template>
              <template slot="auditStatus" slot-scope="text, record">
                {{ text.auditStatus | filterAuditStatus }}
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
          咨询信息：
        </p>
        <a-table
          :columns="consultColumns"
          :data-source="consultList"
          @change="changeConsultSort"
          :row-key="record => record.ID"
          :pagination="false"
          :loading="consultLoading"
        >
          <template slot="resourceType" slot-scope="text, record">
            {{ text.resourceType === 'landResource' ? '土地' : '产业' }}
          </template>
          <template slot="consultStatus" slot-scope="text, record">
            {{ text.consultStatus | filterConsultStatus }}
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
  </div>
</template>

<script>
import industryApi from '@system/api/industryResource'
import landApi from '@system/api/landResource'
import publishIndustryResource from '../industryResource/publishIndustryResource'
import publishLandResource from '../landResource/publishLandResource'
import { AUDIT_STATUS_2_CN, CONSULT_STATUS_2_CN } from '../../../../../utils/constants'
import consultApi from '@system/api/consult'
import utils from '@/utils/utils'

const consultColumns = [
  {
    title: '标 题',
    dataIndex: 'resourceTitle',
    ellipsis: true,
    key: 'title'
  },
  {
    title: '咨询人',
    dataIndex: 'userName',
    key: 'userName',
    sorter: true
  },
  {
    title: '单位',
    dataIndex: 'userCompany',
    key: 'userCompany',
    sorter: true
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
    title: '状 态',
    key: 'consultStatus',
    width: 100,
    scopedSlots: { customRender: 'consultStatus' },
    sorter: true
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
    title: '审核状态',
    key: 'auditStatus',
    width: 100,
    scopedSlots: { customRender: 'auditStatus' },
    sorter: true
  }
]

export default {
  name: 'superAdminHandle',
  components: {
    publishIndustryResource,
    publishLandResource
  },
  filters: {
    'filterAuditStatus': (value) => {
      if (!value) {
        value = 0
      }
      return AUDIT_STATUS_2_CN[value - '']
    },
    'filterConsultStatus': (value) => {
      if (!value) {
        value = 0
      }
      return CONSULT_STATUS_2_CN[value - '']
    }
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
    'industryPageSize' () {
      this.getIndustries()
    },
    'consultPageSize' () {
      this.getConsults()
    },
    'landPageSize' () {
      this.getLands()
    }
  },
  data () {
    return {
      columns,
      consultColumns,
      landStringify: '',
      industryStringify: '',
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
        consultStatus: null,
        resourceType: null,
        creator: null,
        createdAt: null,
        userCompany: null
      },
      handleType: '',
      handleID: '',
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo',
      industryResources: [],
      landResources: [],
      consultList: [],
      admins: [],
      selectedAdmin: [],
      consultPageSize: 5,
      industryPageSize: 5,
      landPageSize: 5,
      industryCount: 0,
      consultCount: 0,
      consultPageIndex: 0,
      landCount: 0,
      consultLoading: false,
      loading: false,
      adminModalVisible: false,
      industryLoading: false,
      landLoading: false,
      landModalVisible: false,
      industryModalVisible: false,
      landPageIndex: 1,
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
      this.loading = true
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
        orderByConsultStatus: utils.convertOrder(this.consultOrder.consultStatus),
        orderByResourceType: utils.convertOrder(this.consultOrder.resourceType),
        orderByCreator: utils.convertOrder(this.consultOrder.creator),
        orderByCreatedAt: utils.convertOrder(this.consultOrder.createdAt),
        adminID: 'notNull'
      }).then(res => {
        this.consultCount = res.data.data.count
        this.consultList = res.data.data.consults
        this.consultLoading = false
      })
    },
    changeConsultSort  (p, f, s) {
      this.consultOrder = {}
      this.consultOrder[s.columnKey] = s.order
      this.getConsults()
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
    getLands () {
      landApi.getLandResources({
        pageSize: this.landPageSize,
        pageIndex: this.landPageIndex,
        orderByCreatedAt: utils.convertOrder(this.landOrder.createdAt),
        orderByCreator: utils.convertOrder(this.landOrder.creator),
        orderByUpdatedAt: utils.convertOrder(this.landOrder.updatedAt),
        orderByAuditStatus: utils.convertOrder(this.landOrder.auditStatus),
        owner: false,
        adminID: 'notNull',
        isDraft: false
      }).then(res => {
        this.landCount = res.data.data.count
        this.landResources = res.data.data.landResources
        this.landLoading = false
      })
    },
    getIndustries () {
      industryApi.getIndustryResources({
        pageSize: this.industryPageSize,
        pageIndex: this.industryPageIndex,
        orderByCreatedAt: utils.convertOrder(this.industryOrder.createdAt),
        orderByCreator: utils.convertOrder(this.industryOrder.creator),
        orderByUpdatedAt: utils.convertOrder(this.industryOrder.updatedAt),
        orderByAuditStatus: utils.convertOrder(this.industryOrder.auditStatus),
        owner: false,
        adminID: 'notNull',
        isDraft: false
      }).then(res => {
        this.industryCount = res.data.data.count
        this.industryResources = res.data.data.industryResources
        this.industryLoading = false
      })
    },
    allocateTask () {
      if (this.selectedAdmin.length === 0) {
        this.$error('请先选择委托的管理员！')
      } else {
        if (this.handleType === 'landResource') {
          landApi.editLandResource(this.handleID, {
            admin: this.selectedAdmin
          }).then(res => {
            this.getLands()
            this.adminModalVisible = false
            this.landModalVisible = false
          })
        }
        if (this.handleType === 'industryResource') {
          industryApi.editIndustryResource(this.handleID, {
            admin: this.selectedAdmin
          }).then(res => {
            this.getIndustries()
            this.adminModalVisible = false
            this.industryModalVisible = false
          })
        }
      }
    },
    showAllocateTaskModal () {
      this.adminModalVisible = true
    }
  }
}
</script>

<style scoped>

</style>
