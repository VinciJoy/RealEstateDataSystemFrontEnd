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
          <template slot="auditStatus" slot-scope="text, record">
            {{ text.consultStatus | filterConsultStatus }}
          </template>
        </a-table>
        <a-row class="mt-20">
          <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="consultPageIndex" :total="consultCount" />
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
    title: '状 态',
    key: 'auditStatus',
    width: 100,
    scopedSlots: { customRender: 'auditStatus' }
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
    title: '审核状态',
    key: 'auditStatus',
    width: 100,
    scopedSlots: { customRender: 'auditStatus' }
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
    }
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
      landResources: [],
      consultList: [],
      admins: [],
      selectedAdmin: [],
      pageSize: 10,
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
        pageSize: this.pageSize,
        pageIndex: this.consultPageIndex,
        adminID: 'notNull'
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
        pageSize: this.pageSize,
        pageIndex: this.industryPageIndex,
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
