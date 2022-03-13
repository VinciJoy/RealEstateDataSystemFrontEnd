<template>
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
        <template slot="title" slot-scope="text, record">
          <a @click="goToDetail('industry', text.ID)" v-if="text.visible && text.auditStatus === AUDIT_STATUS.PASSED">
            {{ text.title }}
          </a>
          <span v-else>
            {{ text.title }}
          </span>
        </template>
        <template slot="status" slot-scope="text, record">
          {{ text.visible && text.auditStatus === AUDIT_STATUS.PASSED ? '有 效' : '失 效' }}
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
              <template slot="title" slot-scope="text, record">
                <a @click="goToDetail('land', text.ID)" v-if="text.visible && text.auditStatus === AUDIT_STATUS.PASSED">
                  {{ text.title }}
                </a>
                <span v-else>
                  {{ text.title }}
                </span>
              </template>
              <template slot="status" slot-scope="text, record">
                {{ text.visible && text.auditStatus === AUDIT_STATUS.PASSED ? '有 效' : '失 效' }}
              </template>
            </a-table>
            <a-row class="mt-20">
              <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="landPageIndex" :total="landCount" />
            </a-row>
          </a-col>
        </a-row>
</template>

<script>
import industryApi from '@system/api/industryResource'
import landApi from '@system/api/landResource'
import { AUDIT_STATUS } from '../../../../../utils/constants'

const columns = [
  {
    title: '标 题',
    ellipsis: true,
    key: 'title',
    scopedSlots: { customRender: 'title' }
  },
  {
    title: '状 态',
    key: 'status',
    width: 200,
    scopedSlots: { customRender: 'status' }
  }
]

export default {
  name: 'likedResource',
  data () {
    return {
      columns,
      AUDIT_STATUS,
      industryResources: [],
      landResources: [],
      pageSize: 10,
      landLoading: false,
      landPageIndex: 1,
      industryCount: 0,
      landCount: 0,
      industryLoading: false,
      industryPageIndex: 1
    }
  },
  watch: {
    'landPageIndex' () {
      this.getLands()
    },
     'industryPageIndex' () {
      this.getIndustries()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getIndustries()
      this.getLands()
    },
    goToDetail (type, id) {
      if (type === 'industry') {
        this.$router.push({name: 'industryResourceDetail', params: { id }})
      }
      if (type === 'land') {
        this.$router.push({name: 'landResourceDetail', params: { id }})
      }
    },
    getIndustries () {
      industryApi.getIndustryResources({
        pageSize: this.pageSize,
        pageIndex: this.industryPageIndex,
        owner: false,
        isDraft: false,
        likedList: true
      }).then(res => {
        this.industryCount = res.data.data.count
        this.industryResources = res.data.data.industryResources
        this.industryLoading = false
      })
    },
    getLands () {
      landApi.getLandResources({
        pageSize: this.pageSize,
        pageIndex: this.landPageIndex,
        owner: false,
        isDraft: false,
        likedList: true
      }).then(res => {
        this.landCount = res.data.data.count
        this.landResources = res.data.data.landResources
        this.landLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
