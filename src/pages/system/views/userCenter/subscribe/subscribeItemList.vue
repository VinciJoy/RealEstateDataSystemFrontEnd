<template>
  <a-row>
    <a-col>
      <p>
        定制的项目：
      </p>
      <a-table
        :columns="columns"
        :data-source="resources"
        :row-key="record => record.ID"
        :pagination="false"
        :loading="loading"
      >
        <template slot="title" slot-scope="text, record">
          <a @click="goToDetail(text.resourceType, text.resourceID)">
            {{ text.title }}
          </a>
        </template>
        <template slot="itemStatus" slot-scope="text, record">
          {{ text.visible && text.auditStatus === AUDIT_STATUS.PASSED ? '有 效' : '失 效' }}
        </template>
        <template slot="resourceType" slot-scope="text, record">
          {{ text.resourceType === 'landResource' ? '土 地' : '产 业' }}
        </template>
        <template slot="status" slot-scope="text, record">
          {{ text.status === 0 ? '未 读' : '已 读' }}
        </template>
      </a-table>
      <a-row class="mt-20">
        <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="pageIndex" :total="count" />
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import { AUDIT_STATUS } from '../../../../../utils/constants'
import api from '@system/api/subscribe'

const columns = [
  {
    title: '标 题',
    ellipsis: true,
    key: 'title',
    scopedSlots: { customRender: 'title' }
  },
  {
    title: '资源状态',
    key: 'itemStatus',
    width: 200,
    scopedSlots: { customRender: 'itemStatus' }
  },
  {
    title: '资源类型',
    key: 'resourceType',
    width: 200,
    scopedSlots: { customRender: 'resourceType' }
  },
  {
    title: '状 态',
    key: 'status',
    width: 200,
    scopedSlots: { customRender: 'status' }
  }
]

export default {
  name: 'subscribeList',
  data () {
    return {
      columns,
      AUDIT_STATUS,
      pageSize: 20,
      pageIndex: 1,
      count: 0,
      resources: [],
      loading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    goToDetail (type, id) {
      if (type === 'industryResource') {
        this.$router.push({name: 'industryResourceDetail', params: { id }})
      }
      if (type === 'landResource') {
        this.$router.push({name: 'landResourceDetail', params: { id }})
      }
    },
    init () {
      this.getSubscribeItems()
    },
    getSubscribeItems () {
      api.getSubscribeItems({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }).then(res => {
        this.resources = res.data.data.subscribes
      })
    }
  }
}
</script>

<style scoped>

</style>
