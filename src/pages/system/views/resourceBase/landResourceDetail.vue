<template>
  <a-row class="mt-40" :gutter="40">
    <a-col style="border: 1px solid transparent" :span="2"></a-col>
    <a-col :span="20">
<!--      head-->
      <a-row class="mt-20 sub-gray-line" :gutter="20" style="height: 200px;">
        <a-col :span="6" style="height: 100%; max-width: 100%; display: flex; justify-content: center">
          <img v-if="itemBaseInfo.coverPicUuid" style="max-width: 100%; max-height: 100%" :src="picBaseURL + itemBaseInfo.coverPicUuid"/>
          <img v-else style="width: 100%; height: 100%" src="static/imgs/default-img.jpeg"/>
        </a-col>
        <a-col :span="18" style="height: 100%;">
          <a-col>
            <a-col :span="16">
              <h2>
                {{ itemBaseInfo.title }}
              </h2>
            </a-col>
            <a-col class="info-desc-content" style="text-align: right" :span="8">
              <p style="margin-bottom: 0">
                更新时间：{{ itemBaseInfo.updatedAt }}
              </p>
              <p style="margin-bottom: 0">
                发布人身份：{{ form.identity }}
              </p>
              <p>
                300k
              </p>
            </a-col>
          </a-col>
          <a-row class="can-not-select" :gutter="20" style="width: 100%; position: absolute; bottom: 0">
            <a-col style="font-size: 18px; line-height: 1.8">
              <a-col>
                推荐指数:
                <img v-for="i in (Math.floor(itemBaseInfo.recommendation / 2))" :key="'full_star' + i" src="../../../../../static/imgs/fullstar.png"/>
                <img v-if="itemBaseInfo.recommendation % 2" src="../../../../../static/imgs/halfstar.png"/>
                <img v-for="i in (Math.floor((10 - itemBaseInfo.recommendation) / 2))" :key="'un_star' + i" src="../../../../../static/imgs/unstar.png"/>
                <div style="float: right">
                  <a-button type="primary"><a-icon type="heart" />我感兴趣</a-button>
                  <a-button type="primary">更多咨询</a-button>
                </div>
              </a-col>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row>
        <a-col class="right-gray-line" :span="18">
          <a-col class="mt-10" style="text-align: center">
            <span :class="'clickable-txt ' + (selectedTag === 'basic' ? 'selected' : '')" @click="selectedTag = 'basic'">基础信息</span>
            <span :class="'clickable-txt ' + (selectedTag === 'review' ? 'selected' : '')" @click="selectedTag = 'review'">审核意见</span>
            <span :class="'clickable-txt ' + (selectedTag === 'more' ? 'selected' : '')" @click="selectedTag = 'more'">更多资讯</span>
          </a-col>

          <div v-show="selectedTag === 'basic'">
            <a-col>
            <h2 style="font-weight: bolder">项目位置：</h2>
            <baidu-map
              v-if="mapVisible"
              :ak="ak"
              :dragging="false"
              style="width: 600px; height: 400px"
              mapType="BMAP_SATELLITE_MAP"
              :center="form.itemMap.center"
              :double-click-zoom="false"
              :scroll-wheel-zoom="false"
              :zoom="form.itemMap.zoom"
            >
              <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>
              <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>
              <BaiduPolygon :clicking="true" :path="form.itemMap.polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"/>
              <BaiduCircle v-if="form.itemMap.threeCirclePath" :center="form.itemMap.threeCirclePath.center" :radius="form.itemMap.threeCirclePath.radius" stroke-color="blue" :fillColor="''" :stroke-opacity="0.5" :stroke-weight="2"></BaiduCircle>
              <BaiduCircle v-if="form.itemMap.fiveCirclePath" :center="form.itemMap.fiveCirclePath.center" :radius="form.itemMap.fiveCirclePath.radius" stroke-color="blue" :fillColor="''" :stroke-opacity="0.5" :stroke-weight="2"></BaiduCircle>
            </baidu-map>
          </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">项目指标信息：</h2>

              <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
              <tr>
                <th :rowspan="form.itemBaseInfoForm.itemBaseMode === 'occupy' ? 7 : 6">地上指标</th>
                <th>{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '地上建筑面积（m²）' : '经营占地面积（m²）'}}</th>
                <td style="background-color: #fafafa; cursor:auto">
                  <span>
                    {{ spaceComputed | filterUndefined }}
                  </span>
                </td>
                <th>综合容积率</th>
                <td>
                  <span>
                    {{ form.itemBaseInfoForm.comprehensiveFAR | filterUndefined }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '其中——住宅建筑面积（m²）' : '其中——住宅占地面积（m²）'}}</th>
                <td>
                  <span>
                    {{ form.itemBaseInfoForm.apartmentSpace | filterUndefined }}
                  </span>
                </td>
                <th>住宅容积率</th>
                <td>
                  <span>
                    {{ form.itemBaseInfoForm.apartmentFAR | filterUndefined }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '其中——商业建筑面积（m²）' : '其中——商业占地面积（m²）'}}</th>
                <td>
                  <span>
                    {{ form.itemBaseInfoForm.businessSpace | filterUndefined }}
                  </span>
                </td>
                <th>商业容积率</th>
                <td>
                  <span>
                    {{ form.itemBaseInfoForm.businessFAR | filterUndefined }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '其中——办公建筑面积（m²）' : '其中——办公占地面积（m²）'}}</th>
                <td>
                  <span>
                    {{ form.itemBaseInfoForm.officeSpace | filterUndefined }}
                  </span>
                </td>
                <th>办公容积率</th>
                <td>
                  <span>
                    {{ form.itemBaseInfoForm.officeFAR | filterUndefined }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '其中——其他建筑面积（m²）' : '其中——其他占地面积（m²）'}}</th>
                <td>
                  <span>
                    {{ form.itemBaseInfoForm.otherSpace | filterUndefined }}
                  </span>
                </td>
                <th>其他容积率</th>
                <td>
                  <span>
                    {{ form.itemBaseInfoForm.otherFAR | filterUndefined }}
                  </span>
                </td>
              </tr>
              <tr v-if="form.itemBaseInfoForm.itemBaseMode === 'use'">
                <th>地上建筑面积合计（m²）</th>
                <td style="background-color: #fafafa; cursor:auto" colspan="3">
                  <span>
                    {{ (spaceComputed * form.itemBaseInfoForm.comprehensiveFAR ) | filterUndefined }}
                  </span>
                </td>
              </tr>
              <tr v-if="form.itemBaseInfoForm.itemBaseMode === 'occupy'">
                <th>经营占地面积（m²）</th>
                <td style="background-color: #fafafa; cursor:auto" colspan="3">
                  <span>
                    {{ (spaceComputed / form.itemBaseInfoForm.comprehensiveFAR ) | filterUndefined }}
                  </span>
                </td>
              </tr>
              <tr v-if="form.itemBaseInfoForm.itemBaseMode === 'occupy'">
                <th>经营占地面积（亩）</th>
                <td style="background-color: #fafafa; cursor:auto" colspan="3">
                  <span>
                    {{ (spaceComputed / form.itemBaseInfoForm.comprehensiveFAR * 0.0015 ) | filterUndefined }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>地下指标</th>
                <th>地下建筑面积合计（m²）</th>
                <td colspan="3">
                  <span>
                    {{ form.itemBaseInfoForm.underGroundSpace | filterUndefined }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>总指标</th>
                <th>总建筑面积（m²）</th>
                <td style="background-color: #fafafa; cursor:auto" colspan="3">
                  <span v-if="form.itemBaseInfoForm.itemBaseMode === 'use'">
                    {{ (form.itemBaseInfoForm.underGroundSpace - '' + spaceComputed * form.itemBaseInfoForm.comprehensiveFAR) | filterUndefined }}
                  </span>
                  <span v-else>
                    {{ (form.itemBaseInfoForm.underGroundSpace - '' + spaceComputed) | filterUndefined }}
                  </span>
                </td>
              </tr>
            </table>

          </a-col>

            <a-col class="mt-20">
              <a-col>
                <h2 style="font-weight: bolder">项目现状及四至信息：</h2>

<!--                <baidu-map-->
<!--                  v-if="mapVisible"-->
<!--                  :ak="ak"-->
<!--                  :dragging="false"-->
<!--                  style="width: 600px; height: 400px; display: inline-block"-->
<!--                  :center="form.streetMap.center"-->
<!--                  :scroll-wheel-zoom="false"-->
<!--                  :zoom="form.streetMap.zoom"-->
<!--                >-->
<!--                  <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>-->
<!--                  <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>-->
<!--                  <BaiduPolygon :clicking="true" :path="form.streetMap.polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true"/>-->
<!--                </baidu-map>-->

                <div class="mt-20" style="display: inline-block; padding-left: 20px; vertical-align: top">
                  <a-col style="height: 200px" :span="12">
                    <p style="margin-left: 10px">
                      地块现状照片
                    </p>
                    <div class="pic-block" v-for="(pic, index) of form.landStatusPicList" :key="'streetPicList' + index" @click="handlePreview(pic)">
                      <div class="upload-add" style="display: flex; justify-content: center">
                        <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                      </div>
                      <a-popover>
                        <template slot="content">
                          <p>{{ pic.description }}</p>
                        </template>
                        <p class="pic-desc">
                          {{ pic.description }}
                        </p>
                      </a-popover>
                    </div>
                  </a-col>

                  <a-col style="height: 200px" :span="12">
                    <p style="margin-left: 10px">
                      四至街道现状
                    </p>
                    <div class="pic-block" v-for="(pic, index) of form.streetPicList" :key="'streetPicList' + index" @click="handlePreview(pic)">
                      <div class="upload-add" style="display: flex; justify-content: center">
                        <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                      </div>
                      <a-popover>
                        <template slot="content">
                          <p>{{ pic.description }}</p>
                        </template>
                        <p class="pic-desc">
                          {{ pic.description }}
                        </p>
                      </a-popover>
                    </div>
                  </a-col>

                  <a-col style="height: 200px" :span="12">
                    <p style="margin-left: 10px">
                      规划及方案效果图
                    </p>
                    <div class="pic-block" v-for="(pic, index) of form.effectPicList" :key="'streetPicList' + index" @click="handlePreview(pic)">
                      <div class="upload-add" style="display: flex; justify-content: center">
                        <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                      </div>
                      <a-popover>
                        <template slot="content">
                          <p>{{ pic.description }}</p>
                        </template>
                        <p class="pic-desc">
                          {{ pic.description }}
                        </p>
                      </a-popover>
                    </div>
                  </a-col>

                  <a-col style="height: 200px" :span="12">
                    <p style="margin-left: 10px">
                      周边配套设施
                    </p>
                    <div class="pic-block" v-for="(pic, index) of form.facilityPicList" :key="'streetPicList' + index" @click="handlePreview(pic)">
                      <div class="upload-add" style="display: flex; justify-content: center">
                        <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                      </div>
                      <a-popover>
                        <template slot="content">
                          <p>{{ pic.description }}</p>
                        </template>
                        <p class="pic-desc">
                          {{ pic.description }}
                        </p>
                      </a-popover>
                    </div>
                  </a-col>

                  <a-modal width="80%" :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                    <img style="width: 100%" :src="previewImage" />
                  </a-modal>
                </div>
              </a-col>
            </a-col>

            <a-row class="mt-20">
            <h2 style="font-weight: bolder">项目进度:</h2>
            <a-tabs type="card">
              <a-tab-pane key="1" tab="一级开发节点">
                <div style="margin-bottom: 10px" v-for="progress of progressFirstSelected" :key="progress.name">
                  <a-icon type="check-circle" style="color: #0aa679; font-size: 16px"/> {{ progress.name }}
                </div>
                <div v-if="progressFirstSelected.length === 0">
                  一级开发节点暂无进度
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="二级开发节点">
                <div v-for="progress of progressSecondSelected" :key="progress.name">
                  <a-icon type="check-circle" style="color: #0aa679; font-size: 16px"/> {{ progress.name }}
                </div>
                <div v-if="progressSecondSelected.length === 0">
                  二级开发节点暂无进度
                </div>
              </a-tab-pane>
              <a-tab-pane key="3" tab="其他类项目节点">
                <div v-for="progress of progressOthersSelected" :key="progress.name">
                  <a-icon type="check-circle" style="color: #0aa679; font-size: 16px"/> {{ progress.name }}
                </div>
                <div v-if="progressOthersSelected.length === 0">
                  其他类项目节点暂无进度
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-row>

            <a-row class="mt-20">
              <h2 style="font-weight: bolder">项目股东信息:</h2>
              <a-col style="font-size: 14px" v-for="(shareHolder, index) of form.itemBaseInfoForm.shareHolders" :key="'股东' + (index + 1) + '名称'" :span="8">
                {{ shareHolder.name }}
              </a-col>
              <a-col style="font-size: 14px" v-if="form.itemBaseInfoForm.shareHolders.length === 0">
                暂无股东信息
              </a-col>
            </a-row>

            <a-row class="mt-20">
              <h4 style="font-weight: bolder; display: inline-block">交易中对价金额: {{ form.totalTransactionAmount }} 万元</h4>
              <h4 style="font-weight: bolder; display: inline-block; margin-left: 100px">已投入有票成本费: {{ form.investAmount }} 万元</h4>
              <h4 style="font-weight: bolder; display: inline-block; margin-left: 100px">其中，土地成本合计: {{ form.landAmount }} 万元</h4>
              <h4 style="font-weight: bolder">土地成本合计: <span class="blue-number">{{ computedTotalFee }}</span> 万元</h4>
            </a-row>

            <a-row class="mt-20">
              <h2 style="font-weight: bolder">项目优势自荐:</h2>
              <span>{{ form.projectAdvantages ? form.projectAdvantages : '无' }}</span>
            </a-row>

            <a-row class="mt-20" style="text-align: center">
              <a-button type="primary">委托第三方测算</a-button>
              <a-button type="primary" style="margin-left: 20px">专业支持辅助</a-button>
            </a-row>
            <a-row class="mt-20" style="text-align: center">
              <span style="color: #a1a1a1">——————————  本月剩余5条免费土地信息，购买<span style="color: #40a9ff; cursor: pointer">更多信息</span>查看权限  ——————————</span>
            </a-row>
          </div>
        </a-col>
        <a-col :span="6"></a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import api from '@system/api/landResource'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BaiduScale from 'vue-baidu-map/components/controls/Scale'
import BaiduMapType from 'vue-baidu-map/components/controls/MapType'
import BaiduPolygon from 'vue-baidu-map/components/overlays/Polygon'
import BaiduCircle from 'vue-baidu-map/components/overlays/Circle'

export default {
  name: 'landResourceDetail',
  components: {
    BaiduMap,
    BaiduScale,
    BaiduMapType,
    BaiduPolygon,
    BaiduCircle
  },
  computed: {
    'progressFirstSelected': function () {
      let temp = []
      for (let key in this.form.progressForm.first) {
        if (this.form.progressForm.first[key].status) temp.push(this.form.progressForm.first[key])
      }
      return temp
    },
    'progressSecondSelected': function () {
      let temp = []
      for (let key in this.form.progressForm.second) {
        if (this.form.progressForm.second[key].status) temp.push(this.form.progressForm.second[key])
      }
      return temp
    },
    'progressOthersSelected': function () {
      let temp = []
      for (let key in this.form.progressForm.others) {
        if (this.form.progressForm.others[key].status) temp.push(this.form.progressForm.others[key])
      }
      return temp
    },
    spaceComputed: {
      get: function () {
        let res = 0
        if (this.form.itemBaseInfoForm.apartmentSpace) {
          res += this.form.itemBaseInfoForm.apartmentSpace - ''
        }
        if (this.form.itemBaseInfoForm.businessSpace) {
          res += this.form.itemBaseInfoForm.businessSpace - ''
        }
        if (this.form.itemBaseInfoForm.officeSpace) {
          res += this.form.itemBaseInfoForm.officeSpace - ''
        }
        if (this.form.itemBaseInfoForm.otherSpace) {
          res += this.form.itemBaseInfoForm.otherSpace - ''
        }
        return res
      }
    },
    computedTotalFee: {
      get: function () {
        let result = 0
        if (this.form.landCostForm.municipalSupportingFeeTotal) result += (this.form.landCostForm.municipalSupportingFeeTotal - '')
        if (this.form.landCostForm.deedTaxTotal) result += (this.form.landCostForm.deedTaxTotal - '')
        if (this.form.landCostForm.compensationTotal) result += (this.form.landCostForm.compensationTotal - '')
        if (this.form.landCostForm.landTransferFeeTotal) result += (this.form.landCostForm.landTransferFeeTotal - '')
        return result
      }
    }
  },
  data () {
    return {
      mapVisible: false,
      form: {
        totalTransactionAmount: 0,
        investAmount: 0,
        place: [],
        spaceType: 'aboveGround',
        space: 0,
        itemType: '',
        itemFormation: '',
        exchangeType: '',
        itemMap: {
          center: {
            lng: 116.404,
            lat: 39.915
          },
          zoom: 15,
          polygonPath: [],
          keyword: ''
        },
        streetMap: {
          center: {
            lng: 116.404,
            lat: 39.915
          },
          zoom: 15,
          polygonPath: [],
          keyword: ''
        },
        itemBaseInfoForm: {
          aboveGround: [],
          underGround: [],
          assetMortgage: false,
          stockMortgage: false,
          shareHolders: []
        },
        landCostForm: {},
        landStatusPicList: [],
        facilityPicList: [],
        effectPicList: [],
        streetPicList: [],
        progressForm: {
          '': {
            '': {
              picList: []
            }
          },
          'second': {},
          'first': {},
          'others': {}
        }
      },
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo',
      selectedTag: 'basic',
      previewVisible: false,
      previewImage: '',
      createdAt: '',
      preview: '',
      itemBaseInfo: {
        title: '',
        recommendation: 0,
        itemType: '',
        updatedAt: ''
      }
    }
  },
  filters: {
    filterUndefined (data) {
      if (data === undefined) {
        return '\\'
      }
      return data
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.picBaseURL = process.env.API_ROOT + '/system/pics/temp/'
      api.getLandResource(this.$route.params.id).then((res) => {
        this.mapVisible = false
        this.form = JSON.parse(res.data.data.stringify)
        this.itemBaseInfo.updatedAt = res.data.data.landResource.updatedAt
        this.itemBaseInfo.title = res.data.data.landResource.title
        this.itemBaseInfo.recommendation = res.data.data.landResource.recommendation
        this.itemBaseInfo.itemType = res.data.data.landResource.itemType
        this.itemBaseInfo.coverPicUuid = res.data.data.landResource.coverPicUuid
        if (!this.form.landStatusPicList.length) {
          this.form.landStatusPicList = [{
            uid: 'landStatusPicList',
            name: '未上传图片',
            status: 'removed'
          }]
        }

        if (!this.form.streetPicList.length) {
          this.form.streetPicList = [{
            uid: 'streetPicList',
            name: '未上传图片',
            status: 'removed'
          }]
        }

        if (!this.form.effectPicList.length) {
          this.form.effectPicList = [{
            uid: 'effectPicList',
            name: '未上传图片',
            status: 'removed'
          }]
        }

        if (!this.form.facilityPicList.length) {
          this.form.facilityPicList = [{
            uid: 'facilityPicList',
            name: '未上传图片',
            status: 'removed'
          }]
        }

        this.mapVisible = true
      })
    },
    async handlePreview (file) {
      this.previewImage = (process.env.API_ROOT + '/system/pics/temp/' + file.uuid + '/') || file.preview
      this.previewVisible = true
    }
  }
}
</script>

<style scoped>
.clickable-txt {
  margin-left: 30px;
  font-size: 16px;
}

.pic-desc {
  width: 104px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 10px;
}

.pic-block {
  display: inline-block;
  width: 115px;
}

.selected {
  color: #40a9ff;
}

th {
  padding: 10px;
  background-color: #fafafa;
}

td {
  padding: 10px;
}

</style>
