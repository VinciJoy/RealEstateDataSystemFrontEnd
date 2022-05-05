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
              @change="changeIndustrySort"
            >
              <template slot="auditStatus" slot-scope="text, record">
                {{ text.auditStatus | filterAuditStatus }}
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
              <template slot="auditStatus" slot-scope="text, record">
                {{ text.auditStatus | filterAuditStatus }}
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
          咨询信息：
        </p>
        <a-table
          :columns="consultColumns"
          :data-source="consultList"
          :row-key="record => record.ID"
          @change="changeConsultSort"
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
    <handleModal :consult="consult" :isConsult="isConsult" @getConsults="getConsults" @getLands="getLands" @getIndustries="getIndustries" :handleType="handleType" @closeHandleModal="modalVisible=false" :modalVisible="modalVisible" :handleID="handleID"></handleModal>
<!--    modal end-->
  </div>
</template>

<script>
import industryApi from '@system/api/industryResource'
import landApi from '@system/api/landResource'
import userApi from '@system/api/user'
import {mapGetters} from 'vuex'
import handleModal from './handleModal'
import {AUDIT_STATUS_2_CN} from '../../../../../utils/constants'
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
    title: '审核状态',
    key: 'auditStatus',
    width: 100,
    scopedSlots: { customRender: 'auditStatus' },
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
  name: 'adminHandle',
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
    'industryPageSize' () {
      this.getIndustries()
    },
    'landPageSize' () {
      this.getLands()
    },
    'consultPageSize' () {
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
      handleType: '',
      handleID: 0,
      industryResources: [],
      landResources: [],
      consultList: [],
      admins: [],
      selectedAdmin: [],
      industryPageSize: 5,
      consultPageSize: 5,
      landPageSize: 5,
      industryCount: 0,
      consult: {},
      landCount: 0,
      consultCount: 0,
      loading: false,
      consultLoading: false,
      isConsult: false,
      industryLoading: false,
      landLoading: false,
      modalVisible: false,
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
      userApi.getUsers({
        pageSize: 100,
        pageIndex: 0,
        admin: true
      }).then(res => {
        this.admins = res.data.data.users
        this.loading = false
      })
      this.getIndustries()
      this.getLands()
      this.getConsults()
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
    getConsults () {
      consultApi.getConsults({
        pageSize: this.consultPageSize,
        orderByUserName: utils.convertOrder(this.consultOrder.userName),
        orderByUserCompany: utils.convertOrder(this.consultOrder.userCompany),
        orderByResourceType: utils.convertOrder(this.consultOrder.resourceType),
        orderByCreator: utils.convertOrder(this.consultOrder.creator),
        orderByCreatedAt: utils.convertOrder(this.consultOrder.createdAt),
        pageIndex: this.consultPageIndex,
        adminID: this.userInfo.ID,
        consultStatus: 'passedOrNotPassed'
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
        adminID: this.userInfo.ID,
        isDraft: false,
        auditStatus: 'passedOrNotPassed'
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
        adminID: this.userInfo.ID,
        isDraft: false,
        auditStatus: 'passedOrNotPassed'
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
