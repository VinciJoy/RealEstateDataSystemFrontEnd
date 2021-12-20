<template>
  <div>
    <a-row class="mt-40" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>
      <a-col :span="20">
        <a-row class="left-blue part-title can-not-select" style="width: 100%">
          <h1 style="display: inline">发布土地信息</h1>
          <a style="float: right;" class="tag-desc"><a-icon style="color: gray; margin-right: 5px" theme="filled" type="down-circle" />点击完成实名认证</a>
        </a-row>

<!--        item desc begin -->
        <div class="mt-20 sub-gray-line">
          <a-row>
            <h2 style="font-weight: bolder">项目名称</h2>
          </a-row>
          <a-row>
            <span class="input-tag">地区: </span>
            <a-cascader style="width: 30%" :options="options" placeholder="请选择所在地区"/>
          </a-row>
          <a-row class="mt-20">
            <a-col :span="12">
              <span class="input-tag">类型: </span><a-radio>地上 </a-radio> <a-input type="number" style="width: 50%"></a-input> 万 m²
            </a-col>
            <a-col :span="12">
              <a-radio>占地 </a-radio> <a-input type="number" style="width: 50%"></a-input> 亩
            </a-col>
          </a-row>
          <a-row class="mt-20">
            <a-col :span="12">
              <span class="input-tag">形态: </span><a-input type="number" style="width: 50%"></a-input>
            </a-col>
            <a-col :span="12">
              <span class="input-tag">形式: </span><a-input type="number" style="width: 50%"></a-input>
            </a-col>
          </a-row>
        </div>
<!--        item desc end-->

<!--        item position begin-->
        <div class="mt-20 sub-gray-line" style="height: 600px">
          <a-row>
            <h2 style="font-weight: bolder">项目位置</h2>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <baidu-map
                :ak="ak"
                style="width: 100%; height: 400px"
                :center="center"
                :scroll-wheel-zoom="true"
                :zoom="zoom"
                @moving="syncCenterAndZoom"
                @moveend="syncCenterAndZoom"
                @zoomend="syncCenterAndZoom"
              >
                <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>
                <BaiduNavigation anchor="BMAP_ANCHOR_TOP_RIGHT"></BaiduNavigation>
                <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>
                <BaiduGeolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :autoLocation="true"></BaiduGeolocation>
                <BaiduPolygon :clicking="true" :path="polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath"/>
                <BaiduSearch :page-capacity="2" :keyword="keyword" :auto-viewport="true" :location="location"></BaiduSearch>
              </baidu-map>
            </a-col>

            <a-col :span="12">
                <span class="input-tag">关键词: </span><a-input v-model="keyword" style="width: 30%"></a-input>
                <span class="input-tag" style="margin-left: 10px">地区: </span><a-input v-model="location" style="width: 30%"></a-input>
              <a-row class="mt-20">
                <a-button @click="addPolygonPoint" :disabled="polygonPath.length > 0" type="primary">添 加 标 记</a-button>
              </a-row>
              <a-row class="mt-20">
                <a-button @click="removePolygonPoint" :disabled="polygonPath.length === 0" type="primary">清 除 标 记</a-button>
              </a-row>
            </a-col>
          </a-row>
        </div>
<!--        item position end-->

<!--        item desc begin-->
        <div class="mt-20 sub-gray-line">
          <a-row>
            <h2 style="font-weight: bolder">项目身份证信息录入</h2>
          </a-row>
          <a-row class="cell border-right">
            <span class="table-title">项目基本面录入(必填)</span>
            <span class="table-edit" @click="showItemBaseInfoModal">编辑</span>
          </a-row>
          <a-row>
            <a-col :span="6" class="cell">经营占地面积(m²)</a-col>
            <a-col :span="6" class="cell">{{ itemBaseInfoForm.space | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">综合容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ itemBaseInfoForm.comprehensiveFAR | filterUndefined }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="6" class="cell">其中——住宅占地面积(m²)</a-col>
            <a-col :span="6" class="cell">{{ itemBaseInfoForm.apartmentSpace | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">住宅容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ itemBaseInfoForm.apartmentFAR | filterUndefined }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="6" class="cell">其中——商业占地面积(m²)</a-col>
            <a-col :span="6" class="cell">{{ itemBaseInfoForm.businessSpace | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">商业容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ itemBaseInfoForm.businessFAR | filterUndefined }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="6" class="cell">其中——办公占地面积(m²)</a-col>
            <a-col :span="6" class="cell">{{ itemBaseInfoForm.officeSpace | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">办公容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ itemBaseInfoForm.officeFAR | filterUndefined }}</a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="6" class="cell">其中——其他类占地面积(m²)，内容细项可继续增加，增加细项名称自定义，但合计等于其他类。</a-col>
            <a-col :span="6" class="cell">{{ itemBaseInfoForm.otherSpace | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">其中容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ itemBaseInfoForm.otherFAR | filterUndefined }}</a-col>
          </a-row>
          <a-row class="cell border-right">
            <span class="table-title">地上各业态录入(选填)</span>
            <span class="table-edit" @click="showAboveGroundModal">添加</span>
          </a-row>
          <a-row>
            <a-col :span="6" class="cell">业态选择类型</a-col>
            <a-col :span="6" class="cell">具体产品</a-col>
            <a-col :span="6" class="cell">建筑面积(m²)</a-col>
            <a-col :span="6" class="cell border-right">可售率</a-col>
          </a-row>
          <a-row v-for="(item, index) of itemBaseInfoForm.aboveGround" :key="'aboveGround' + index">
            <a-col :span="6" class="cell">{{ item.type }}</a-col>
            <a-col :span="6" class="cell">{{ item.product }}</a-col>
            <a-col :span="6" class="cell">{{ item.space }}</a-col>
            <a-col :span="6" class="cell border-right">{{ item.percent }}</a-col>
          </a-row>
          <a-row class="cell border-right">
            <span class="table-title">地下各业态录入(选填)</span>
            <span class="table-edit" @click="showUnderGroundModal">添加</span>
          </a-row>
          <a-row>
            <a-col :span="6" class="cell">业态选择类型</a-col>
            <a-col :span="6" class="cell">具体产品</a-col>
            <a-col :span="6" class="cell">建筑面积(m²)</a-col>
            <a-col :span="6" class="cell border-right">可售率</a-col>
          </a-row>
          <a-row class="border-bottom">
            <div v-for="(item, index) of itemBaseInfoForm.underGround" :key="'underGround' + index">
              <a-col :span="6" class="cell">{{ item.type }}</a-col>
              <a-col :span="6" class="cell">{{ item.product }}</a-col>
              <a-col :span="6" class="cell">{{ item.space }}</a-col>
              <a-col :span="6" class="cell border-right">{{ item.percent }}</a-col>
            </div>
          </a-row>

          <a-row class="mt-20">
            <p class="input-tag">项目现状: </p>
            <a-input></a-input>
          </a-row>

          <a-row class="mt-20" style="height: 600px">
            <p class="input-tag">四至信息描述: </p>
            <a-row :gutter="16">
              <a-col :span="12">
                <baidu-map
                  :ak="ak"
                  style="width: 100%; height: 400px"
                  :center="center"
                  :scroll-wheel-zoom="true"
                  :zoom="zoom"
                  @moving="syncCenterAndZoom"
                  @moveend="syncCenterAndZoom"
                  @zoomend="syncCenterAndZoom"
                >
                  <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>
                  <BaiduNavigation anchor="BMAP_ANCHOR_TOP_RIGHT"></BaiduNavigation>
                  <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>
                  <BaiduGeolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :autoLocation="true"></BaiduGeolocation>
                  <BaiduPolygon :clicking="true" :path="polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath"/>
                  <BaiduSearch :page-capacity="2" :keyword="keyword" :auto-viewport="true" :location="location"></BaiduSearch>
                </baidu-map>
              </a-col>

              <a-col :span="12">
                  <span class="input-tag">关键词: </span><a-input v-model="keyword" style="width: 30%"></a-input>
                  <span class="input-tag" style="margin-left: 10px">地区: </span><a-input v-model="location" style="width: 30%"></a-input>
                <a-row class="mt-20">
                  <a-button @click="addPolygonPoint" :disabled="polygonPath.length > 0" type="primary">添 加 标 记</a-button>
                </a-row>
                <a-row class="mt-20">
                  <a-button @click="removePolygonPoint" :disabled="polygonPath.length === 0" type="primary">清 除 标 记</a-button>
                </a-row>
              </a-col>
            </a-row>
          </a-row>

          <a-row>
            <p class="input-tag">上传项目现状照片及四至道路、配套照片(选填)</p>
          </a-row>
        </div>
<!--        item desc end-->
      </a-col>
    </a-row>

<!--    modal begin-->
    <a-modal
      width="80%"
      :visible="itemBaseInfoModalVisible"
      :closable="false"
      :maskClosable="false"
      @cancel="itemBaseInfoModalVisible=false"
      @ok="saveItemBaseInfo"
    >
      <a-form-model
        ref="tempItemBaseInfoForm"
        :model="tempItemBaseInfoForm"
        :label-col="{ span: 9 }"
        :wrapper-col="{ span: 15 }"
        :rules="itemBaseInfoRules"
      >
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="space" label="经营占地面积(m²)" prop="space">
            <a-input
              v-model="tempItemBaseInfoForm.space"
              type="number"
            />
          </a-form-model-item>
        </div>
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="comprehensiveFAR" label="综合容积率" prop="comprehensiveFAR">
            <a-input
              v-model="tempItemBaseInfoForm.comprehensiveFAR"
              type="number"
            />
          </a-form-model-item>
        </div>

        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="apartmentSpace" label="其中——住宅占地面积(m²)" prop="apartmentSpace">
            <a-input
              v-model="tempItemBaseInfoForm.apartmentSpace"
              type="number"
            />
          </a-form-model-item>
        </div>
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="apartmentFAR" label="住宅容积率" prop="apartmentFAR">
            <a-input
              v-model="tempItemBaseInfoForm.apartmentFAR"
              type="number"
            />
          </a-form-model-item>
        </div>

        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="businessSpace" label="其中——商业占地面积(m²)" prop="businessSpace">
            <a-input
              v-model="tempItemBaseInfoForm.businessSpace"
              type="number"
            />
          </a-form-model-item>
        </div>
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="businessFAR" label="商业容积率" prop="businessFAR">
            <a-input
              v-model="tempItemBaseInfoForm.businessFAR"
              type="number"
            />
          </a-form-model-item>
        </div>

        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="officeSpace" label="其中——办公占地面积(m²)" prop="officeSpace">
            <a-input
              v-model="tempItemBaseInfoForm.officeSpace"
              type="number"
            />
          </a-form-model-item>
        </div>
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="officeFAR" label="办公容积率" prop="officeFAR">
            <a-input
              v-model="tempItemBaseInfoForm.officeFAR"
              type="number"
            />
          </a-form-model-item>
        </div>

        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="otherSpace" label="其中——其他类占地面积(m²)" prop="otherSpace">
            <a-input
              v-model="tempItemBaseInfoForm.otherSpace"
              type="number"
            />
          </a-form-model-item>
        </div>
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="otherFAR" label="其他类容积率" prop="otherFAR">
            <a-input
              v-model="tempItemBaseInfoForm.otherFAR"
              type="number"
            />
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-modal>

    <a-modal
      width="80%"
      :visible="aboveGroundModalVisible"
      :closable="false"
      :maskClosable="false"
      @cancel="aboveGroundModalVisible=false"
      @ok="addAboveGround"
    >
      <a-form-model
        ref="tempAboveGroundForm"
        :model="tempAboveGroundForm"
        :label-col="{ span: 9 }"
        :wrapper-col="{ span: 15 }"
        :rules="aboveGroundRules"
      >
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="type" label="业态选择类型" prop="type">
            <a-input
              v-model="tempAboveGroundForm.type"
              type="number"
            />
          </a-form-model-item>
        </div>
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="product" label="具体产品" prop="product">
            <a-input
              v-model="tempAboveGroundForm.product"
              type="number"
            />
          </a-form-model-item>
        </div>

        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="space" label="建筑面积(m²)" prop="space">
            <a-input
              v-model="tempAboveGroundForm.space"
              type="number"
            />
          </a-form-model-item>
        </div>
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="percent" label="可售率" prop="percent">
            <a-input
              v-model="tempAboveGroundForm.percent"
              type="number"
            />
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-modal>

    <a-modal
      width="80%"
      :visible="underGroundModalVisible"
      :closable="false"
      :maskClosable="false"
      @cancel="underGroundModalVisible=false"
      @ok="addUnderGround"
    >
      <a-form-model
        ref="tempUnderGroundForm"
        :model="tempUnderGroundForm"
        :label-col="{ span: 9 }"
        :wrapper-col="{ span: 15 }"
        :rules="underGroundRules"
      >
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="type" label="业态选择类型" prop="type">
            <a-input
              v-model="tempUnderGroundForm.type"
              type="number"
            />
          </a-form-model-item>
        </div>
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="product" label="具体产品" prop="product">
            <a-input
              v-model="tempUnderGroundForm.product"
              type="number"
            />
          </a-form-model-item>
        </div>

        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="space" label="建筑面积(m²)" prop="space">
            <a-input
              v-model="tempUnderGroundForm.space"
              type="number"
            />
          </a-form-model-item>
        </div>
        <div class="modal-form-item-50-percent">
          <a-form-model-item ref="percent" label="可售率" prop="percent">
            <a-input
              v-model="tempUnderGroundForm.percent"
              type="number"
            />
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-modal>
<!--    modal end-->
  </div>
</template>

<script>
import options from '@/utils/cities'
import utils from '@/utils/utils'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BaiduScale from 'vue-baidu-map/components/controls/Scale'
import BaiduNavigation from 'vue-baidu-map/components/controls/Navigation'
import BaiduMapType from 'vue-baidu-map/components/controls/MapType'
import BaiduGeolocation from 'vue-baidu-map/components/controls/Geolocation'
import BaiduPolygon from 'vue-baidu-map/components/overlays/Polygon'
import BaiduSearch from 'vue-baidu-map/components/search/LocalSearch'

export default {
  name: 'publishLandResource',
  components: {
    BaiduMap,
    BaiduScale,
    BaiduNavigation,
    BaiduMapType,
    BaiduGeolocation,
    BaiduSearch,
    BaiduPolygon
  },
  filters: {
    filterUndefined (data) {
      if (data === undefined) {
        return '\\'
      }
      return data
    }
  },
  data () {
    return {
      itemBaseInfoRules: {
        space: [
          {required: true, message: '请输入经营占地面积!', trigger: 'blur'}
        ],
        comprehensiveFAR: [
          {required: true, message: '请输入综合容积率!', trigger: 'blur'}
        ],
        apartmentSpace: [
          {required: true, message: '请输入住宅占地面积!', trigger: 'blur'}
        ],
        apartmentFAR: [
          {required: true, message: '请输入住宅容积率!', trigger: 'blur'}
        ],
        businessSpace: [
          {required: true, message: '请输入商业占地面积!', trigger: 'blur'}
        ],
        businessFAR: [
          {required: true, message: '请输入商业容积率!', trigger: 'blur'}
        ],
        officeSpace: [
          {required: true, message: '请输入办公占地面积!', trigger: 'blur'}
        ],
        officeFAR: [
          {required: true, message: '请输入办公容积率!', trigger: 'blur'}
        ],
        otherSpace: [
          {required: true, message: '请输入其他类占地面积!', trigger: 'blur'}
        ],
        otherFAR: [
          {required: true, message: '请输入其中容积率!', trigger: 'blur'}
        ]
      },
      underGroundRules: {
        type: [
          {required: true, message: '请选择业态选择类型!', trigger: 'blur'}
        ],
        product: [
          {required: true, message: '请输入具体产品', trigger: 'blur'}
        ],
        space: [
          {required: true, message: '请输入建筑面积!', trigger: 'blur'}
        ],
        percent: [
          {required: true, message: '请输入可售率!', trigger: 'blur'}
        ]
      },
      aboveGroundRules: {
        type: [
          {required: true, message: '请选择业态选择类型!', trigger: 'blur'}
        ],
        product: [
          {required: true, message: '请输入具体产品', trigger: 'blur'}
        ],
        space: [
          {required: true, message: '请输入建筑面积!', trigger: 'blur'}
        ],
        percent: [
          {required: true, message: '请输入可售率!', trigger: 'blur'}
        ]
      },
      tempAboveGroundForm: {},
      tempUnderGroundForm: {},
      itemBaseInfoForm: {
        aboveGround: [],
        underGround: []
      },
      tempItemBaseInfoForm: {
      },
      options: options,
      aboveGroundModalVisible: false,
      itemBaseInfoModalVisible: false,
      underGroundModalVisible: false,
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo',
      center: {lng: 116.404, lat: 39.915},
      zoom: 15,
      location: '北京',
      keyword: '百度',
      polygonPath: [
      ]
    }
  },
  methods: {
    showAboveGroundModal () {
      this.tempAboveGroundForm = {}
      this.aboveGroundModalVisible = true
    },
    showUnderGroundModal () {
      this.tempUnderGroundForm = {}
      this.underGroundModalVisible = true
    },
    addAboveGround () {
      this.$refs.tempAboveGroundForm.validate(valid => {
        if (valid) {
          this.itemBaseInfoForm.aboveGround.push(utils.Copy(this.tempAboveGroundForm))
          this.aboveGroundModalVisible = false
        }
      })
    },
    addUnderGround () {
      this.$refs.tempUnderGroundForm.validate(valid => {
        if (valid) {
          this.itemBaseInfoForm.underGround.push(utils.Copy(this.tempUnderGroundForm))
          this.underGroundModalVisible = false
        }
      })
    },
    saveItemBaseInfo () {
      this.$refs.tempItemBaseInfoForm.validate(valid => {
        if (valid) {
          this.itemBaseInfoForm = utils.Copy(this.tempItemBaseInfoForm)
          this.itemBaseInfoModalVisible = false
        }
      })
    },
    showItemBaseInfoModal () {
      // 先把数据复制到modal的表单里，防止编辑取消，原数据被修改
      this.tempItemBaseInfoForm = utils.Copy(this.itemBaseInfoForm)
      this.itemBaseInfoModalVisible = true
    },
    updatePolygonPath (e) {
      this.polygonPath = e.target.getPath()
    },
    removePolygonPoint () {
      this.polygonPath = []
    },
    addPolygonPoint () {
      this.polygonPath.push(this.center)
      this.polygonPath.push(this.center)
    },
    syncCenterAndZoom (e) {
      const {lng, lat} = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    }
  }
}
</script>

<style scoped>
.input-tag {
  color: #9c9c9c;
  font-weight: bolder;
  font-size: 18px;
  margin-right: 10px;
}

.sub-gray-line {
  padding-bottom: 40px;
  border-bottom: #e0e0e0 solid 1px;
}

.cell {
  border: 1px solid black;
  padding: 5px;
  border-bottom: 0px;
  text-align: center;
  border-right: 0px;
}

.table-edit {
  color: #9c9c9c;
  float: right;
  cursor: pointer;
}

.table-title {
  font-weight: bolder;
  font-size: 15px;
}

.modal-form-item-50-percent {
  width: 49%;
  display: inline-block;
}

.border-right {
  border-right: 1px solid black;
}

.border-bottom {
  border-bottom: 1px solid black;
}
</style>
