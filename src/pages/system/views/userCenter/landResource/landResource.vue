<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="landResources"
      :row-key="record => record.ID"
      :pagination="false"
    >
      <span slot="recommendation" slot-scope="text, record">
        <a-select style="width: 70px" v-model="record.recommendation" @change="changeRecommendation(record)">
          <a-select-option v-for="i of 11" :value="i - 1" :key="i - 1">
            {{ i - 1 }}
          </a-select-option>
        </a-select>
      </span>
      <span slot="visible" slot-scope="text, record">
        <a-switch :disabled="!utils.IsAdmin(userInfo.role)" v-model="record.visible" @click="changeVisible(record)" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="goToEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="deleteLandResource(record.ID)">删除</a>
      </span>
    </a-table>
    <a-row class="mt-20">
      <a-button style="display: inline-block" type="primary" @click="goToAdd()"><a-icon type="plus" />新建</a-button>
      <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="pageIndex" :total="count" />
    </a-row>
  </div>
</template>

<script>
import api from '@system/api/landResource'
import {mapGetters} from 'vuex'
import utils from '@/utils/utils'

const columns = [
  {
    title: '标 题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '创建者',
    dataIndex: 'creator.user_name',
    key: 'creator'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt'
  },
  {
    title: '可 见',
    key: 'visible',
    scopedSlots: { customRender: 'visible' }
  },
  {
    title: '推荐指数',
    key: 'recommendation',
    scopedSlots: { customRender: 'recommendation' }
  },
  {
    title: '操 作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'landResource',
  data () {
    return {
      utils: utils,
      columns: columns,
      landResources: [],
      pageIndex: 1,
      pageSize: 10,
      count: 0
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
    changeVisible (record) {
      api.editLandResource(record.ID, {visible: record.visible}).then(res => {
        this.$success('土地资源修改成功!')
      })
    },
    init () {
      if (utils.IsAdmin(this.userInfo.role)) {
        api.getLandResources({
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          owner: false
        }).then(res => {
          this.count = res.data.data.count
          this.landResources = res.data.data.landResources
        })
        return
      }
      api.getLandResources({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        owner: true
      }).then(res => {
        this.count = res.data.data.count
        this.landResources = res.data.data.landResources
      })
    },
    changeRecommendation (record) {
      api.editLandResource(record.ID, {recommendation: record.recommendation}).then(res => {
        this.$success('推荐指数修改成功!')
      })
    },
    goToEdit (record) {
      this.$router.push('publish_land_resource/' + record.ID)
    },
    goToAdd () {
      this.$router.push('publish_land_resource/')
    },
    deleteLandResource (id) {
      api.deleteLandResource(id).then(res => {
        this.$success('土地资源删除成功!')
        this.init()
      })
    }
  }
}
</script>

<style scoped>

</style>
