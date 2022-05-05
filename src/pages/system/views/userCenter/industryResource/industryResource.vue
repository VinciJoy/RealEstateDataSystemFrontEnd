<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="industryResources"
      :row-key="record => record.ID"
      :pagination="false"
      :loading="loading"
    >
      <template slot="recommendation" slot-scope="text, record">
<!--        <a-select :disabled="!utils.IsAdmin(userInfo.role) || text.isDraft" style="width: 70px" v-model="record.recommendation" @change="changeRecommendation(record)">-->
<!--          <a-select-option v-for="i of 11" :value="i - 1" :key="i - 1">-->
<!--            {{ i - 1 }}-->
<!--          </a-select-option>-->
<!--        </a-select>-->
        <a-switch :disabled="!utils.IsAdmin(userInfo.role) || text.isDraft" :checked="record.recommendation !== 0" @change="changeRecommendation($event, record)"></a-switch>
      </template>
      <template slot="isDraft" slot-scope="text, record">
        {{ text.isDraft ? '草稿' : '发布' }}
      </template>
      <template slot="visible" slot-scope="text, record">
        <a-switch :disabled="!utils.IsAdmin(userInfo.role) || text.isDraft" v-model="record.visible" @click="changeVisible(record)" />
      </template>
      <template slot="action" slot-scope="text, record">
        <a @click="showHistoryModal(record)">项目详情</a>
        <a-divider type="vertical" />
        <a @click="goToEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="deleteIndustryResource(record.ID)">删除</a>
      </template>
    </a-table>
    <a-row class="mt-20">
      <a-button style="display: inline-block" type="primary" @click="goToAdd()"><a-icon type="plus" />新建</a-button>
      <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="pageIndex" :total="count" />
    </a-row>

<!--    modal begin-->
    <a-modal v-model="historyModalVisible" :footer="null">
      <div v-show="loading" style="text-align: center">
        <a-spin tip="加载中..."></a-spin>
      </div>
      <a-empty v-show="!histories || !histories.length" />
      <div style="margin-top: 10px" v-for="(history, index) of histories" :key="'history' + index">
        <div v-if="history.Type !== 'audit'">
          <div>
            <span>修改人: {{ history.UserName }}</span><span class="ml-10">修改时间：{{ history.DisplayTime }}</span>
          </div>
          <div>修改说明: {{ history.EditReason }}</div>
        </div>
        <div v-else>
          <div>
            <span>审核结果：{{ AUDIT_STATUS_2_CN[history.AuditStatus] }}</span>
            <span class="ml-10">审核管理员：{{ history.UserName }}</span>
            <span class="ml-10">审核时间：{{ history.DisplayTime }}</span>
          </div>
          <div>
            常规审核意见：{{ history.NormalAudit }}
          </div>
          <div>
            专业审核意见：{{ history.ProAudit }}
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal width="80%" v-model="historyDetailModalVisible" :footer="null">
      <div v-show="loading" style="text-align: center">
        <a-spin tip="加载中..."></a-spin>
      </div>
      <publishIndustryResource :history="true" :historyStringify="historyStringify"></publishIndustryResource>
    </a-modal>
<!--    modal end-->
  </div>
</template>

<script>
import utils from '@/utils/utils'
import api from '@system/api/industryResource'
import historyApi from '@system/api/history'
import {mapGetters} from 'vuex'
import publishIndustryResource from './publishIndustryResource'
import { AUDIT_STATUS_2_CN } from '../../../../../utils/constants'

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
    title: '可 见',
    key: 'visible',
    ellipsis: true,
    width: 100,
    scopedSlots: { customRender: 'visible' }
  },
  {
    title: '状 态',
    key: 'isDraft',
    width: 100,
    scopedSlots: { customRender: 'isDraft' }
  },
  {
    title: '特别推荐',
    key: 'recommendation',
    ellipsis: true,
    width: 150,
    scopedSlots: { customRender: 'recommendation' }
  },
  {
    title: '操 作',
    key: 'action',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'industryResource',
  components: {
    publishIndustryResource: publishIndustryResource
  },
  data () {
    return {
      histories: [],
      columns: columns,
      AUDIT_STATUS_2_CN: AUDIT_STATUS_2_CN,
      historyModalVisible: false,
      historyStringify: '',
      historyDetailModalVisible: false,
      utils: utils,
      industryResources: [],
      pageSize: 10,
      pageIndex: 1,
      count: 0,
      loading: false
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    'pageIndex' () {
      this.init()
    },
    'count' () {
      if ((this.pageIndex - 1) * this.pageSize === this.count) this.pageIndex -= 1
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    init () {
      this.loading = true
      if (utils.IsAdmin(this.userInfo.role)) {
        api.getIndustryResources({
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          owner: false
        }).then(res => {
          this.count = res.data.data.count
          this.industryResources = res.data.data.industryResources
          this.loading = false
        })
        return
      }
      api.getIndustryResources({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        owner: true
      }).then(res => {
        this.count = res.data.data.count
        this.industryResources = res.data.data.industryResources
        this.loading = false
      })
    },
    showHistoryDetailModal (id) {
      this.historyDetailModalVisible = true
      this.loading = true
      historyApi.getHistory(id, {
        'resourceType': 'industryResource'
      }).then(res => {
        this.historyStringify = res.data.data.resourceHistory.stringify
        this.loading = false
      })
    },
    showHistoryModal (record) {
      this.historyModalVisible = true
      this.loading = true
      historyApi.getHistories({
        'resourceType': 'industryResource',
        'resourceID': record.ID
      }).then(res => {
        this.histories = res.data.data.resourceHistories
        this.loading = false
      })
    },
    changeVisible (record) {
      api.editIndustryResource(record.ID, {visible: record.visible}).then(res => {
        this.$success('产业资源修改成功!')
      })
    },
    goToEdit (record) {
      this.$router.push('publish_industry_resource/' + record.ID)
    },
    changeRecommendation (check, record) {
      if (check) {
        record.recommendation = 1
      } else {
        record.recommendation = 0
      }
      api.editIndustryResource(record.ID, {recommendation: record.recommendation}).then(res => {
        this.$success('特别推荐修改成功!')
      })
    },
    goToAdd () {
      this.$router.push('publish_industry_resource/')
    },
    deleteIndustryResource (id) {
      api.deleteIndustryResource(id).then(res => {
        this.$success('产业资源删除成功!')
        this.init()
      })
    }
  }
}
</script>

<style scoped>

</style>
