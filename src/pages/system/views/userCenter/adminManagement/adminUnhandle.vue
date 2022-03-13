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
              <template slot="auditStatus" slot-scope="text, record">
                {{ text.auditStatus | filterAuditStatus }}
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
            <a @click="showHandleModal(text.resourceType, text.resourceID, true, record)">处理</a>
          </template>
        </a-table>
        <a-row class="mt-20">
          <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="consultPageIndex" :total="consultCount" />
        </a-row>
      </a-tab-pane>

    </a-tabs>
<!--    tab end-->

    <!--    modal begin-->
    <handleModal @getConsults="getConsults" :isConsult="isConsult" :consult="consult" @getLands="getLands" @getIndustries="getIndustries" :handleType="handleType" @closeHandleModal="modalVisible=false" :modalVisible="modalVisible" :handleID="handleID"></handleModal>
<!--    modal end-->
  </div>
</template>

<script>
import industryApi from '@system/api/industryResource'
import landApi from '@system/api/landResource'
import {mapGetters} from 'vuex'
import { AUDIT_STATUS_2_CN } from '../../../../../utils/constants'
import handleModal from './handleModal'
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
    handleModal
  },
  filters: {
    'filterAuditStatus': (value) => {
      if (!value) {
        value = 0
      }
      return AUDIT_STATUS_2_CN[value - '']
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
      AUDIT_STATUS_2_CN,
      handleType: '',
      handleID: 0,
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo',
      industryResources: [],
      landResources: [],
      consult: {},
      consultList: [],
      pageSize: 10,
      industryCount: 0,
      landCount: 0,
      consultCount: 0,
      loading: false,
      isConsult: false,
      industryLoading: false,
      landLoading: false,
      consultLoading: false,
      modalVisible: false,
      landPageIndex: 1,
      consultPageIndex: 1,
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
      this.getConsults()
    },
    getConsults () {
      consultApi.getConsults({
        pageSize: this.pageSize,
        pageIndex: this.consultPageIndex,
        adminID: this.userInfo.ID,
        consultStatus: 'nullOrUnderway'
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
        adminID: this.userInfo.ID,
        isDraft: false,
        auditStatus: 'nullOrUnderAudit'
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
        auditStatus: 'nullOrUnderAudit'
      }).then(res => {
        this.industryCount = res.data.data.count
        this.industryResources = res.data.data.industryResources
        this.industryLoading = false
      })
    },
    showHandleModal (resourceType, recordID, isConsult = false, consult) {
      this.isConsult = isConsult
      this.consult = consult
      this.loading = true
      this.modalVisible = true
      this.handleType = resourceType
      this.handleID = recordID
    }
  }
}
</script>

<style scoped>
</style>
