<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="landResources"
      :row-key="record => record.ID"
      :pagination="false"
      :loading="loading"
    >
      <span slot="title" slot-scope="text, record">
        {{ text.title }}
      </span>
      <span slot="visible" slot-scope="text, record">
        <a-switch :disabled="!utils.IsAdmin(userInfo.role) || text.isDraft" v-model="record.visible" @click="changeVisible(record)" />
      </span>
      <span slot="isDraft" slot-scope="text, record">
        {{ text.isDraft ? '草稿' : '发布' }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="utils.IsAdmin(userInfo.role)" @click="showHistoryModal(record)">项目详情</a>
        <a-divider v-if="utils.IsAdmin(userInfo.role)" type="vertical" />
        <a v-if="utils.IsAdmin(userInfo.role)" @click="showProgressModal(record)">进度跟进</a>
        <a-divider v-if="utils.IsAdmin(userInfo.role)" type="vertical" />
        <a @click="goToEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="deleteLandResource(record.ID)">删除</a>
      </span>
    </a-table>
    <a-row class="mt-20">
      <a-button style="display: inline-block" type="primary" @click="goToAdd()"><a-icon type="plus" />新建</a-button>
      <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="pageIndex" :total="count" />
    </a-row>

    <!--    modal begin-->
    <a-modal width="60%" v-model="historyModalVisible" :footer="null">
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
      <publishLandResource :history="true" :historyStringify="historyStringify"></publishLandResource>
    </a-modal>

    <progressModal :resourceType="'landResource'" @closeProgressModal="progressModalVisible = false" :progressResourceID="progressResourceID" :progressModalVisible="progressModalVisible"></progressModal>
<!--    预加载地图相关组件，防止显示历史信息时莫名其妙的bug-->
    <baidu-map
      :ak="ak"
      :center="{lng: 0,lat: 0}"
      v-show="false"
    >
      <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>
      <BaiduNavigation anchor="BMAP_ANCHOR_TOP_RIGHT"></BaiduNavigation>
      <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>
      <BaiduGeolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :autoLocation="true"></BaiduGeolocation>
      <BaiduPolygon :clicking="true" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true"/>
      <BaiduSearch :page-capacity="2" :auto-viewport="true"></BaiduSearch>
      <BaiduCircle :center="{lng: 0,lat: 0}" stroke-color="blue" :fillColor="''" :stroke-opacity="0.5" :stroke-weight="2"></BaiduCircle>
    </baidu-map>
<!--    modal end-->
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BaiduScale from 'vue-baidu-map/components/controls/Scale'
import BaiduNavigation from 'vue-baidu-map/components/controls/Navigation'
import BaiduMapType from 'vue-baidu-map/components/controls/MapType'
import BaiduGeolocation from 'vue-baidu-map/components/controls/Geolocation'
import BaiduPolygon from 'vue-baidu-map/components/overlays/Polygon'
import BaiduSearch from 'vue-baidu-map/components/search/LocalSearch'
import BaiduCircle from 'vue-baidu-map/components/overlays/Circle'
import api from '@system/api/landResource'
import {mapGetters} from 'vuex'
import utils from '@/utils/utils'
import historyApi from '@system/api/history'
import publishLandResource from './publishLandResource'
import { AUDIT_STATUS_2_CN } from '../../../../../utils/constants'
import progressModal from '../../components/progressModal'

const columns = [
  {
    title: '标 题',
    key: 'title',
    scopedSlots: { customRender: 'title' }
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
    title: '状 态',
    key: 'isDraft',
    width: 100,
    scopedSlots: { customRender: 'isDraft' }
  },
  {
    title: '可 见',
    key: 'visible',
    scopedSlots: { customRender: 'visible' }
  },
  {
    title: '操 作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'landResource',
  components: {
    publishLandResource: publishLandResource,
    BaiduMap: BaiduMap,
    BaiduScale: BaiduScale,
    BaiduNavigation: BaiduNavigation,
    BaiduMapType: BaiduMapType,
    BaiduGeolocation: BaiduGeolocation,
    BaiduPolygon: BaiduPolygon,
    BaiduSearch: BaiduSearch,
    BaiduCircle: BaiduCircle,
    progressModal: progressModal
  },
  data () {
    return {
      loading: false,
      progressResourceID: null,
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo',
      historyDetailModalVisible: false,
      historyModalVisible: false,
      progressModalVisible: false,
      histories: [],
      utils: utils,
      columns: columns,
      AUDIT_STATUS_2_CN: AUDIT_STATUS_2_CN,
      historyStringify: '',
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
    showHistoryDetailModal (id) {
      this.historyDetailModalVisible = true
      this.loading = true
      historyApi.getHistory(id, {
        'resourceType': 'landResource'
      }).then(res => {
        this.historyStringify = res.data.data.resourceHistory.stringify
        this.loading = false
      })
    },
    showHistoryModal (record) {
      this.historyModalVisible = true
      this.loading = true
      historyApi.getHistories({
        'resourceType': 'landResource',
        'resourceID': record.ID
      }).then(res => {
        this.histories = res.data.data.resourceHistories
        this.loading = false
      })
    },
    showProgressModal (record) {
      this.progressResourceID = record.ID
      this.progressModalVisible = true
    },
    init () {
      this.loading = true
      if (utils.IsAdmin(this.userInfo.role)) {
        api.getLandResources({
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          owner: false
        }).then(res => {
          this.count = res.data.data.count
          this.landResources = res.data.data.landResources
          this.loading = false
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
        this.loading = false
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
