<template>
  <a-row>
    <a-col>
      <p>
        定制规则：
      </p>
      <a-table
        :columns="columns"
        :data-source="subscribes"
        :row-key="record => record.ID"
        :pagination="false"
        :loading="loading"
      >
        <template slot="resourceType" slot-scope="text, record">
          {{ text.resourceType === 'landResource' ? '土地' : '产业' }}
        </template>
        <template slot="alertSystem" slot-scope="text, record">
          {{ text.alertSystem ? '是' : '否' }}
        </template>
        <template slot="alertPhone" slot-scope="text, record">
          {{ text.alertPhone ? '是' : '否' }}
        </template>
        <span slot="action" slot-scope="text, record">
        <a @click="goToEdit(record.ID)">编辑</a>
        <a-divider type="vertical" />
        <a @click="deleteSubscribe(record.ID)">删除</a>
      </span>
      </a-table>
      <a-row class="mt-20">
        <a-button style="display: inline-block" type="primary" @click="goToAdd()"><a-icon type="plus" />新建</a-button>
        <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="pageIndex" :total="count" />
      </a-row>
    </a-col>

  </a-row>
</template>

<script>
import api from '@system/api/subscribe'

const columns = [
  {
    title: '标 题',
    ellipsis: true,
    key: 'title',
    dataIndex: 'title'
  },
  {
    title: '系统提醒',
    key: 'alertSystem',
    scopedSlots: { customRender: 'alertSystem' }
  },
  {
    title: '短信提醒',
    key: 'alertPhone',
    scopedSlots: { customRender: 'alertPhone' }
  },
  {
    title: '类 型',
    key: 'resourceType',
    width: 200,
    scopedSlots: { customRender: 'resourceType' }
  },
  {
    title: '操 作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'subscribe',
  data () {
    return {
      columns,
      pageSize: 20,
      count: 0,
      pageIndex: 1,
      loading: false,
      subscribes: []
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
  methods: {
    goToAdd () {
      this.$router.push('publish_subscribe/')
    },
    init () {
      this.getSub()
    },
    getSub () {
      api.getSubscribes({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        owner: true
      }).then(res => {
        this.count = res.data.data.count
        this.subscribes = res.data.data.subscribes
        this.loading = false
      })
    },
    goToEdit (id) {
      this.$router.push('publish_subscribe/' + id)
    },
    deleteSubscribe (id) {
      api.deleteSubscribe(id).then(res => {
        this.$success('定制信息删除成功!')
        this.init()
      })
    }
  }
}
</script>

<style scoped>

</style>
