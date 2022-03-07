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
    <handleModal @getLands="getLands" @getIndustries="getIndustries" :handleType="handleType" @closeHandleModal="modalVisible=false" :modalVisible="modalVisible" :handleID="handleID"></handleModal>
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
  data () {
    return {
      columns,
      handleType: '',
      handleID: 0,
      industryResources: [],
      landResources: [],
      admins: [],
      selectedAdmin: [],
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
      userApi.getUsers({pageSize: this.pageSize, pageIndex: 0, admin: true}).then(res => {
        this.admins = res.data.data.users
        this.loading = false
      })
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
        auditStatus: 'passedOrNotPassed'
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
        auditStatus: 'passedOrNotPassed'
      }).then(res => {
        this.industryCount = res.data.data.count
        this.industryResources = res.data.data.industryResources
        this.industryLoading = false
      })
    },
    showHandleModal (resourceType, record) {
      this.loading = true
      this.modalVisible = true
      this.handleID = record.ID
      if (resourceType === 'landResource') {
        this.handleType = 'landResource'
        // landApi.getLandResource(record.ID).then(res => {
        //   this.landStringify = res.data.data.stringify
        //   this.dataForm = JSON.parse(this.landStringify)
        //   this.loading = false
        // })
      }
      if (resourceType === 'industryResource') {
        this.handleType = 'industryResource'
        // industryApi.getIndustryResource(record.ID).then(res => {
        //   this.industryStringify = res.data.data.stringify
        //   this.dataForm = JSON.parse(this.industryStringify)
        //   this.loading = false
        // })
      }
    }
  }
}
</script>

<style scoped>
</style>
