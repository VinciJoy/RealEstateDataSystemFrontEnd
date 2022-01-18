<template>
  <div>
    <a-row class="mt-40" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>
      <a-col :span="20">
        <a-row class="left-blue part-title can-not-select" style="width: 100%">
          <h1 style="display: inline">发布土地信息</h1>
          <div style="float: right">
            <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID === 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />点击完成实名认证</a>
            <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID !== 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />等待管理员认证</a>
            <a v-if="userInfo.certificationVerified" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: forestgreen;" theme="filled" type="down-circle" />已完成实名认证</a>
          </div>
          <userVerify @changed="certificateChange" :editable="(userInfo.certificate.ID === 0) && (!userInfo.certificationVerified)" :passedInCertificateForm="certificateForm" :certificateModalVisible="certificateModalVisible" @closeUserVerifyModal="certificateModalVisible = false"></userVerify>
        </a-row>

<!--        item desc begin -->
        <div class="mt-20 sub-gray-line">
          <a-row>
            <h2 style="font-weight: bolder">项目名称</h2>
          </a-row>
          <a-row>
            <span class="input-tag">地区: </span>
            <a-cascader style="width: 30%" v-model="form.place" :options="options" placeholder="请选择所在地区"/>
          </a-row>
          <a-row class="mt-20">
            <a-col :span="12">
              <span class="input-tag">类型: </span>
              <a-radio v-model="form.spaceType === 'aboveGround'" @click="changeSpaceType('aboveGround')">地上 </a-radio>
              <a-radio v-model="form.spaceType === 'underGround'" @click="changeSpaceType('underGround')">占地 </a-radio>
              <a-input @blur="spaceValid" v-model="form.space" type="number" style="width: 50%"></a-input>
              <span v-if="form.spaceType === 'aboveGround'"> 万 m² </span><span v-else> 亩 </span>
            </a-col>
          </a-row>
          <a-row class="mt-20">
            <a-col :span="8">
              <a-col :span="form.itemType.includes('自定义') ? 11 : 24">
                <span class="input-tag">类型: </span>
                <a-select v-model="form.itemType" style="width: 60%">
                  <a-select-option @blur="itemTypeValid" v-for="itemType in ITEM_TYPES" :value="itemType" :key="itemType">
                    {{ itemType }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="10">
                <a-input @blur="itemTypeValid" v-model="userDefinedItemType" v-if="form.itemType.includes('自定义')"></a-input>
              </a-col>
            </a-col>
            <a-col :span="8">
              <span class="input-tag">形态: </span>
              <a-select v-model="form.itemFormation" style="width: 60%">
                <a-select-option v-for="itemFormation in itemFormations" :value="itemFormation" :key="itemFormation">
                    {{ itemFormation }}
                  </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              <a-col :span="form.exchangeType.includes('自定义') ? 13 : 24">
                <span class="input-tag">交易形式: </span>
                <a-select v-model="form.exchangeType" style="width: 45%">
                  <a-select-option @blur="exchangeTypeValid" v-for="exchangeType in EXCHANGE_TYPES" :value="exchangeType" :key="exchangeType">
                      {{ exchangeType }}
                    </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="8">
                <a-input @blur="exchangeTypeValid" v-model="userDefinedExchangeType" v-if="form.exchangeType.includes('自定义')"></a-input>
              </a-col>
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
                v-if="mapVisible"
                :ak="ak"
                style="width: 100%; height: 400px"
                :center="form.itemMap.center"
                :scroll-wheel-zoom="true"
                :zoom="form.itemMap.zoom"
                @moving="syncCenterAndZoom($event, 'itemMap')"
                @moveend="syncCenterAndZoom($event, 'itemMap')"
                @zoomend="syncCenterAndZoom($event, 'itemMap')"
              >
                <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>
                <BaiduNavigation anchor="BMAP_ANCHOR_TOP_RIGHT"></BaiduNavigation>
                <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>
                <BaiduGeolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :autoLocation="true"></BaiduGeolocation>
                <BaiduPolygon :clicking="true" :path="form.itemMap.polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath($event, 'itemMap')"/>
                <BaiduSearch :page-capacity="2" :keyword="form.itemMap.keyword" :auto-viewport="true"></BaiduSearch>
              </baidu-map>
            </a-col>

            <a-col :span="12">
                <span class="input-tag">关键词: </span><a-input v-model="form.itemMap.keyword" style="width: 50%"></a-input>
              <a-row class="mt-20">
                <a-button @click="addPolygonPoint('itemMap')" :disabled="form.itemMap.polygonPath.length > 0" type="primary">添 加 标 记</a-button>
              </a-row>
              <a-row class="mt-20">
                <a-button @click="removePolygonPoint('itemMap')" :disabled="form.itemMap.polygonPath.length === 0" type="primary">清 除 标 记</a-button>
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
            <a-col :span="6" class="cell">{{ form.itemBaseInfoForm.space | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">综合容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ form.itemBaseInfoForm.comprehensiveFAR | filterUndefined }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="6" class="cell">其中——住宅占地面积(m²)</a-col>
            <a-col :span="6" class="cell">{{ form.itemBaseInfoForm.apartmentSpace | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">住宅容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ form.itemBaseInfoForm.apartmentFAR | filterUndefined }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="6" class="cell">其中——商业占地面积(m²)</a-col>
            <a-col :span="6" class="cell">{{ form.itemBaseInfoForm.businessSpace | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">商业容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ form.itemBaseInfoForm.businessFAR | filterUndefined }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="6" class="cell">其中——办公占地面积(m²)</a-col>
            <a-col :span="6" class="cell">{{ form.itemBaseInfoForm.officeSpace | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">办公容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ form.itemBaseInfoForm.officeFAR | filterUndefined }}</a-col>
          </a-row>
          <a-row type="flex">
            <a-col :span="6" class="cell">其中——其他类占地面积(m²)，内容细项可继续增加，增加细项名称自定义，但合计等于其他类。</a-col>
            <a-col :span="6" class="cell">{{ form.itemBaseInfoForm.otherSpace | filterUndefined }}</a-col>
            <a-col :span="6" class="cell">其中容积率</a-col>
            <a-col :span="6" class="cell border-right">{{ form.itemBaseInfoForm.otherFAR | filterUndefined }}</a-col>
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
          <a-row v-for="(item, index) of form.itemBaseInfoForm.aboveGround" :key="'aboveGround' + index">
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
            <div v-for="(item, index) of form.itemBaseInfoForm.underGround" :key="'underGround' + index">
              <a-col :span="6" class="cell">{{ item.type }}</a-col>
              <a-col :span="6" class="cell">{{ item.product }}</a-col>
              <a-col :span="6" class="cell">{{ item.space }}</a-col>
              <a-col :span="6" class="cell border-right">{{ item.percent }}</a-col>
            </div>
          </a-row>

          <a-row class="mt-20">
            <p class="input-tag">项目现状: </p>
            <a-textarea v-model="form.projectStatus" :maxLength="300"></a-textarea>
          </a-row>

          <a-row class="mt-20" style="height: 650px">
            <p class="input-tag">四至信息描述: </p>
            <a-row :gutter="16">
              <a-col :span="12">
                <baidu-map
                  v-if="mapVisible"
                  :ak="ak"
                  style="width: 100%; height: 400px"
                  :center="form.streetMap.center"
                  :scroll-wheel-zoom="true"
                  :zoom="form.streetMap.zoom"
                  @moving="syncCenterAndZoom($event, 'streetMap')"
                  @moveend="syncCenterAndZoom($event, 'streetMap')"
                  @zoomend="syncCenterAndZoom($event, 'streetMap')"
                >
                  <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>
                  <BaiduNavigation anchor="BMAP_ANCHOR_TOP_RIGHT"></BaiduNavigation>
                  <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>
                  <BaiduGeolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :autoLocation="true"></BaiduGeolocation>
                  <BaiduPolygon :clicking="true" :path="form.streetMap.polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath($event, 'streetMap')"/>
                  <BaiduSearch :page-capacity="2" :keyword="form.streetMap.keyword" :auto-viewport="true"></BaiduSearch>
                </baidu-map>
              </a-col>

              <a-col :span="12">
                  <span class="input-tag">关键词: </span><a-input v-model="form.streetMap.keyword" style="width: 50%"></a-input>
                <a-row class="mt-20">
                  <a-button @click="addPolygonPoint('streetMap')" :disabled="form.streetMap.polygonPath.length > 0" type="primary">添 加 标 记</a-button>
                </a-row>
                <a-row class="mt-20">
                  <a-button @click="removePolygonPoint('streetMap')" :disabled="form.streetMap.polygonPath.length === 0" type="primary">清 除 标 记</a-button>
                </a-row>
              </a-col>
            </a-row>
          </a-row>

          <a-row>
            <p class="input-tag">上传项目现状照片及四至道路、配套照片(选填)</p>
              <a-col :span="12">
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.landStatusPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  class="file-uploader"
                  list-type="picture-card"
                  @change="handleChange($event, 'form','landStatusPicList')"
                >
                  <div v-if="form.landStatusPicList.length < 1">
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
                <p style="margin-left: 10px">
                  地块现状照片
                </p>
            </a-col>

            <a-col :span="12">
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.streetPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  class="file-uploader"
                  list-type="picture-card"
                  @change="handleChange($event, 'form','streetPicList')"
                >
                  <div v-if="form.streetPicList.length < 1">
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
                <p style="margin-left: 10px">
                  四至街道现状
                </p>
            </a-col>

            <a-col :span="12">
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.effectPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  class="file-uploader"
                  list-type="picture-card"
                  @change="handleChange($event, 'form','effectPicList')"
                >
                  <div v-if="form.effectPicList.length < 1">
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
                <p style="margin-left: 10px">
                  规划及方案效果图
                </p>
            </a-col>

            <a-col :span="12">
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.facilityPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  class="file-uploader"
                  list-type="picture-card"
                  @change="handleChange($event, 'form','facilityPicList')"
                >
                  <div v-if="form.facilityPicList.length < 1">
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
                <p style="margin-left: 10px">
                  周边配套设施
                </p>
            </a-col>

            <a-modal width="80%" :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                <img style="width: 100%" :src="previewImage" />
            </a-modal>
          </a-row>

          <a-row>
            <p class="input-tag">项目关键审查信息录入(选填)</p>
            <a-row>
              <a-col :span="8" class="cell table-title">项目关键审查信息类型</a-col>
              <a-col :span="8" class="cell table-title">具体内容举例</a-col>
              <a-col :span="8" class="cell table-title border-right">本项目情况</a-col>
            </a-row>
            <a-row>
              <a-col :span="8" class="cell">资产抵押</a-col>
              <a-col :span="8" class="cell">本地块目前是抵押状态</a-col>
              <a-col :span="8" class="cell border-right">
                <a-radio-group v-model="form.itemBaseInfoForm.assetMortgage">
                  <a-radio :value="true">
                    是
                  </a-radio>
                  <a-radio :value="false">
                    否
                  </a-radio>
                </a-radio-group>
              </a-col>
            </a-row>
            <a-row class="border-bottom">
              <a-col :span="8" class="cell">股权质押</a-col>
              <a-col :span="8" class="cell">地块所属项目公司股权被质押</a-col>
              <a-col :span="8" class="cell border-right">
                <a-radio-group v-model="form.itemBaseInfoForm.stockMortgage">
                  <a-radio :value="true">
                    是
                  </a-radio>
                  <a-radio :value="false">
                    否
                  </a-radio>
                </a-radio-group>
              </a-col>
            </a-row>
          </a-row>

          <a-row class="mt-20">
            <p class="input-tag">项目当前进度信息录入:</p>
            <a-tabs type="card">
              <a-tab-pane v-if="nodeVisible" key="1" tab="一级开发节点">
                <div class="mt-20" v-for="node in firstNode" :key="node.index">
                  <a-radio @click.prevent="changeStatus('first', node.index)" v-model="form.progressForm.first[node.index].status">{{ node.name }}</a-radio>
                  <a-button v-if="form.progressForm.first[node.index].status" @click="showUploadModal('first', node.index)" type="primary" style="float: right; width: 100px" size="small">上传证照</a-button>
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="二级开发节点">
                <a-radio-group v-model="secondNodeStatus">
                  <a-radio class="mt-20" style="display: block" :value="1">未出让</a-radio>
                  <a-radio class="mt-20" style="display: block" :value="2">已出让</a-radio>
                </a-radio-group>
                <div class="mt-20" v-if="secondNodeStatus === 2" v-for="node in secondNode" :key="node.index">
                  <a-radio @click.prevent="changeStatus('second', node.index)" v-model="form.progressForm.second[node.index].status">{{ node.name }}</a-radio>
                  <a-button v-if="form.progressForm.second[node.index].status" @click="showUploadModal('second', node.index)" type="primary" style="float: right; width: 100px" size="small">上传证照</a-button>
                </div>
              </a-tab-pane>
              <a-tab-pane key="3" tab="其他类项目节点">
                <a-form-model
                  ref="form.progressForm.others"
                  :model="form.progressForm.others"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 15 }"
                  v-if="otherNodesVisible"
                >
                  <div v-for="(item, key, index) in form.progressForm.others" :key="'others' + index">
                    <a-form-model-item
                      style="width: 40%; display: inline-block"
                      :label="'节点' + (index + 1) + '名称'"
                      :prop="key + '.name'"
                      :rules="{
                        required: true,
                        message: '节点名称不能为空！',
                        trigger: 'blur',
                      }"
                    >
                      <a-input
                        v-model="form.progressForm.others[key].name"
                      />
                    </a-form-model-item>
                    <a-button type="primary" @click="showUploadModal('others', key)" style="float: right; width: 100px" size="small">上传证照</a-button>
                    <a-icon
                      class="dynamic-delete-button"
                      type="minus-circle-o"
                      @click="removeOtherNode(key)"
                    />
                  </div>
                  <a-form-model-item style="margin-left: 20%">
                    <a-button type="dashed" style="width: 100%" @click="addOtherNode">
                      <a-icon type="plus" /> 增 加 节 点
                    </a-button>
                  </a-form-model-item>
                </a-form-model>
              </a-tab-pane>
            </a-tabs>

            <a-modal width="80%" :visible="uploadVisible" :footer="null" @cancel="uploadVisible = false">
              <a-upload
                :action="uploadPicURL"
                name="file"
                :file-list="form.progressForm[currentNode][currentIndex].picList"
                :withCredentials="true"
                @preview="handlePreview"
                class="file-uploader"
                list-type="picture-card"
                @change="handleNodeChange($event, currentNode, currentIndex)"
              >
                <div>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                </div>
              </a-upload>
            </a-modal>
          </a-row>

          <a-row class="mt-20">
            <p class="input-tag">项目股东信息录入:</p>
            <a-form-model
              ref="form.itemBaseInfoForm"
              :model="form.itemBaseInfoForm"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <div v-for="(shareHolder, index) in form.itemBaseInfoForm.shareHolders" :key="shareHolder.key">
                <a-form-model-item
                  style="width: 40%; display: inline-block"
                  :label="'股东' + (index + 1) + '名称'"
                  :prop="'shareHolders.' + index + '.name'"
                  :rules="{
                    required: true,
                    message: '股东名称不能为空！',
                    trigger: 'blur',
                  }"
                >
                  <a-input
                    v-model="shareHolder.name"
                  />
                </a-form-model-item>

                <a-form-model-item
                  style="width: 40%; display: inline-block"
                  :label="'股东' + (index + 1) + '股权占比'"
                  :prop="'shareHolders.' + index + '.percent'"
                  :rules="{
                    required: true,
                    message: '股东股权占比不能为空！',
                    trigger: 'blur',
                  }"
                >
                  <a-input
                    v-model="shareHolder.percent"
                  />
                </a-form-model-item>
                <a-icon
                  v-if="form.itemBaseInfoForm.shareHolders.length > 0"
                    class="dynamic-delete-button"
                  type="minus-circle-o"
                  @click="removeShareHolder(shareHolder)"
                />
              </div>
              <a-form-model-item style="margin-left: 20%">
                <a-button type="dashed" style="width: 100%" @click="addShareHolder">
                  <a-icon type="plus" /> 增 加 股 东
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-row>

          <a-row>
            <p class="input-tag">项目交易价格:</p>
            <a-col>
              交易总对价金额
              <a-input style="width: 200px; margin-left: 20px;margin-right: 20px" type="number" v-model="form.totalTransactionAmount"></a-input>
              万元
            </a-col>
            <a-col class="mt-10">
              <h3>土地成本合计</h3>
              <a-col :span="18">
                <a-col :span="8" class="cell table-title">土地成本细项</a-col>
                <a-col :span="8" class="cell table-title">总金额(万元)</a-col>
                <a-col :span="8" class="cell table-title border-right">已支付金额(万元)</a-col>
                <a-col :span="8" class="cell">土地出让金</a-col>
                <a-col :span="8" class="cell">{{ form.landCostForm.landTransferFeeTotal | filterUndefined }}</a-col>
                <a-col :span="8" class="cell border-right">{{ form.landCostForm.landTransferFeePaid | filterUndefined }}</a-col>
                <a-col :span="8" class="cell">拆迁补偿款(前期成本)</a-col>
                <a-col :span="8" class="cell">{{ form.landCostForm.compensationTotal | filterUndefined }}</a-col>
                <a-col :span="8" class="cell border-right">{{ form.landCostForm.compensationPaid | filterUndefined }}</a-col>
                <a-col :span="8" class="cell">契税、印花税</a-col>
                <a-col :span="8" class="cell">{{ form.landCostForm.deedTaxTotal | filterUndefined }}</a-col>
                <a-col :span="8" class="cell border-right">{{ form.landCostForm.deedTaxPaid | filterUndefined }}</a-col>
                <a-col :span="8" class="cell border-bottom">市政配套费</a-col>
                <a-col :span="8" class="cell border-bottom">{{ form.landCostForm.municipalSupportingFeeTotal | filterUndefined }}</a-col>
                <a-col :span="8" class="cell border-bottom border-right">{{ form.landCostForm.municipalSupportingFeePaid | filterUndefined }}</a-col>
              </a-col>
              <a-col :span="6"><span class="table-edit" style="float: none; padding-left: 5px" @click="showLandCostModal">编辑</span><div style="float: right">合计： <span class="blue-number">
                {{ computedTotalFee }}
              </span> 万元</div></a-col>
            </a-col>
            <a-col :span="24" class="mt-20">
              已投入有票成本费
              <a-input style="width: 200px; margin-left: 20px;margin-right: 20px" type="number" v-model="form.investAmount"></a-input>
              万元
            </a-col>
          </a-row>

          <a-modal
            width="80%"
            :visible="landCostModalVisible"
            :closable="false"
            :maskClosable="false"
            @cancel="landCostModalVisible=false"
            @ok="saveLandCostInfo"
          >
            <a-form-model
              ref="tempLandCostForm"
              :model="tempLandCostForm"
              :label-col="{ span: 9 }"
              :wrapper-col="{ span: 15 }"
            >
              <div class="modal-form-item-50-percent">
                <a-form-model-item ref="space" label="土地出让金总金额(万元)" prop="landTransferFeeTotal">
                  <a-input
                    v-model="tempLandCostForm.landTransferFeeTotal"
                    type="number"
                  />
                </a-form-model-item>
              </div>
              <div class="modal-form-item-50-percent">
                <a-form-model-item ref="space" label="土地出让金已支付金额(万元)" prop="landTransferFeePaid">
                  <a-input
                    v-model="tempLandCostForm.landTransferFeePaid"
                    type="number"
                  />
                </a-form-model-item>
              </div>

              <div class="modal-form-item-50-percent">
                <a-form-model-item ref="space" label="拆迁补偿款(前期成本)总金额(万元)" prop="compensationTotal">
                  <a-input
                    v-model="tempLandCostForm.compensationTotal"
                    type="number"
                  />
                </a-form-model-item>
              </div>
              <div class="modal-form-item-50-percent">
                <a-form-model-item ref="space" label="拆迁补偿款(前期成本)已支付金额(万元)" prop="compensationPaid">
                  <a-input
                    v-model="tempLandCostForm.compensationPaid"
                    type="number"
                  />
                </a-form-model-item>
              </div>

              <div class="modal-form-item-50-percent">
                <a-form-model-item ref="space" label="契税、印花税总金额(万元)" prop="deedTaxTotal">
                  <a-input
                    v-model="tempLandCostForm.deedTaxTotal"
                    type="number"
                  />
                </a-form-model-item>
              </div>
              <div class="modal-form-item-50-percent">
                <a-form-model-item ref="space" label="契税、印花税已支付金额(万元)" prop="deedTaxPaid">
                  <a-input
                    v-model="tempLandCostForm.deedTaxPaid"
                    type="number"
                  />
                </a-form-model-item>
              </div>

              <div class="modal-form-item-50-percent">
                <a-form-model-item ref="space" label="市政配套费总金额(万元)" prop="municipalSupportingFeeTotal">
                  <a-input
                    v-model="tempLandCostForm.municipalSupportingFeeTotal"
                    type="number"
                  />
                </a-form-model-item>
              </div>
              <div class="modal-form-item-50-percent">
                <a-form-model-item ref="space" label="市政配套费已支付金额(万元)" prop="municipalSupportingFeePaid">
                  <a-input
                    v-model="tempLandCostForm.municipalSupportingFeePaid"
                    type="number"
                  />
                </a-form-model-item>
              </div>
            </a-form-model>
          </a-modal>

          <a-row>
            <p class="input-tag mt-20">项目优势自荐(选填):</p>
            <a-textarea v-model="form.projectAdvantages" :maxLength="300"></a-textarea>
          </a-row>

          <a-row class="mt-20">
            <a-button v-if="mode === 'create'" @click="showSubmitModal" type="primary">提 交 项 目 信 息</a-button>
            <a-button v-if="mode === 'edit'" @click="showSubmitModal" type="primary">修 改 项 目 信 息</a-button>

            <a-modal v-model="submitModalVisible" width="30%" :footer="null" @close="submitModalVisible = false">
              <div slot="title" style="text-align: center">
                信息真实承诺及发布须知
              </div>
              <a-row>
                1、本人承诺所录入信息及上传资料均属真实可靠，允许提交后由摩贝云系统项目工作人员进行真实性审查并与发布者进行相关核实工作。
              </a-row>
              <a-row class="mt-10">
                2、本人已知晓项目通过平台推送后，发布人所属项目方与平台所推荐意向购买人达成合作并签署合作协议的，
                平台将会向该项目方收取相应服务费(本项目未达成合作则不收取任何费用)。本人同意由摩贝云系统工作人员与本人联系，告知并签署相应协议。
              </a-row>
              <a-row style="text-align: center" class="mt-10">
                <a-button :disabled="true" v-if="countDown > 0" style="margin-left:40px;width: 20%">{{ '还需阅读' + countDown + '秒' }}</a-button>
                <a-button type="primary" v-else style="margin-left:40px;width: 20%" @click="submit">提 交</a-button>
              </a-row>
            </a-modal>

            <div style="margin-left: 20px; display: inline-block">
              需要资金匹配：
              <a-radio-group v-model="form.itemBaseInfoForm.assetMortgage">
                <a-radio :value="true">
                  是
                </a-radio>
                <a-radio :value="false">
                  否
                </a-radio>
              </a-radio-group>
            </div>
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
            <a-select
              v-model="tempAboveGroundForm.type"
            >
              <a-select-option @blur="itemTypeValid" v-for="aboveGroundType in aboveGroundTypes" :value="aboveGroundType" :key="aboveGroundType">
                {{ aboveGroundType }}
              </a-select-option>
            </a-select>
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
            <a-select
              v-model="tempUnderGroundForm.type"
            >
              <a-select-option @blur="itemTypeValid" v-for="underGroundType in underGroundTypes" :value="underGroundType" :key="underGroundType">
                {{ underGroundType }}
              </a-select-option>
            </a-select>
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
import api from '@system/api/landResource'
import utils from '@/utils/utils'
import { ITEM_TYPES, EXCHANGE_TYPES } from '@/utils/constants'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BaiduScale from 'vue-baidu-map/components/controls/Scale'
import BaiduNavigation from 'vue-baidu-map/components/controls/Navigation'
import BaiduMapType from 'vue-baidu-map/components/controls/MapType'
import BaiduGeolocation from 'vue-baidu-map/components/controls/Geolocation'
import BaiduPolygon from 'vue-baidu-map/components/overlays/Polygon'
import BaiduSearch from 'vue-baidu-map/components/search/LocalSearch'
import {mapActions, mapGetters} from 'vuex'
import userVerify from '../../components/userVerify'

const underGroundTypes = [
  '地下计容',
  '地下不计容'
]

const identities = [
  '项目土地方',
  '项目权属单位管理人员',
  '项目居间方',
  '项目介绍方'
]

const aboveGroundTypes = [
  '地上计容—别墅类',
  '地上计容—洋房',
  '地上计容—小高层',
  '地上计容-高层',
  '地上计容-回迁住宅',
  '地上计容—公寓类',
  '地上计容—商业类',
  '地上计容—办公楼',
  '地上计容—酒店',
  '地上计容—其他',
  '地上不计容'
]

const firstNode = [
  {
    'name': '与乡镇政府签署开发协议',
    'index': 'signAgreement'
  },
  {
    'name': '取得政府改造批复',
    'index': 'approvalTransformation'
  },
  {
    'name': '取得立项批复',
    'index': 'projectApproval'
  },
  {
    'name': '符合国土空间规划',
    'index': 'ConformPlanning'
  },
  {
    'name': '完成详规方案报批',
    'index': 'CompleteDetailed'
  },
  {
    'name': '取得补偿安置方案批复',
    'index': 'approvalResettlementScheme'
  },
  {
    'name': '村民代表大会决议',
    'index': 'villagersCongress'
  },
  {
    'name': '完成拆迁补偿',
    'index': 'CompleteDemolitionCompensation'
  },
  {
    'name': '完成征地补偿',
    'index': 'CompleteLandCompensation'
  },
  {
    'name': '拆迁/征地结案',
    'index': 'compensationClosed'
  },
  {
    'name': '完成土地组卷报批',
    'index': 'approvalLandVolume'
  },
  {
    'name': '土地收储',
    'index': 'landCollection'
  },
  {
    'name': '完成地价评估',
    'index': 'landPriceEvaluation'
  },
  {
    'name': '取得规划设计要点',
    'index': 'keyPointsDesign'
  }
]

const secondNode = [
  {
    'name': '成交确认书',
    'index': 'transactionConfirmation'
  },
  {
    'name': '土地出让合同',
    'index': 'landTransferContract'
  },
  {
    'name': '国有建设用地使用权证',
    'index': 'useRightCertificate'
  },
  {
    'name': '建设用地规划许可证',
    'index': 'landPlanningPermit'
  },
  {
    'name': '规划意见书',
    'index': 'planningOpinion'
  },
  {
    'name': '建设工程规划许可证',
    'index': 'projectPlanningPermit'
  },
  {
    'name': '施工许可证',
    'index': 'constructionPermit'
  },
  {
    'name': '预售许可证',
    'index': 'preSalePermit'
  },
  {
    'name': '竣工验收备案表',
    'index': 'completionAcceptanceRecordForm'
  },
  {
    'name': '房屋所有权证',
    'index': 'houseOwnershipCertificate'
  }
]

const itemFormations = [
  '土地使用权',
  '在建工程',
  '现房',
  '一二级联动'
]

export default {
  name: 'publishLandResource',
  components: {
    userVerify,
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
  watch: {
    'form.place': function () {
      if (this.mode === 'create') {
        this.form.itemMap.keyword = ''
        this.form.streetMap.keyword = ''
        for (let w of this.form.place) {
          this.form.itemMap.keyword += w
          this.form.streetMap.keyword += w
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    userDefinedItemType: {
      get: function () {
        if (!this.form.itemType.split('自定义/')[1]) return ''
        return this.form.itemType.split('自定义/')[1].trim()
      },
      set: function (val) {
        if (!val) {
          this.form.itemType = '自定义/'
        }
        this.form.itemType = '自定义/' + val.trim()
      }
    },
    userDefinedExchangeType: {
      get: function () {
        if (!this.form.exchangeType.split('自定义/')[1]) return ''
        return this.form.exchangeType.split('自定义/')[1].trim()
      },
      set: function (val) {
        if (!val) {
          this.form.exchangeType = '自定义/'
        }
        this.form.exchangeType = '自定义/' + val.trim()
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
      certificateForm: {
        certificatePicList: []
      },
      currentNode: '',
      currentIndex: '',
      mapVisible: false,
      uploadVisible: false,
      mode: 'create',
      otherNodesVisible: true,
      secondNodeStatus: '',
      nodeVisible: true,
      certificateModalVisible: false,
      itemFormations: itemFormations,
      identities: identities,
      EXCHANGE_TYPES: EXCHANGE_TYPES,
      firstNode: firstNode,
      secondNode: secondNode,
      aboveGroundTypes: aboveGroundTypes,
      underGroundTypes: underGroundTypes,
      ITEM_TYPES: ITEM_TYPES,
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
      uploadPicURL: '',
      loading: false,
      previewVisible: false,
      previewImage: '',
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
      tempItemBaseInfoForm: {
      },
      tempLandCostForm: {},
      options: options,
      aboveGroundModalVisible: false,
      itemBaseInfoModalVisible: false,
      underGroundModalVisible: false,
      landCostModalVisible: false,
      submitModalVisible: false,
      countDown: 5,
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo'
    }
  },
  created () {
    this.init()
    this.uploadPicURL = process.env.API_ROOT + '/system/pics/'
  },
  methods: {
    ...mapActions(['getUserInfo']),
    init () {
      this.certificateForm = this.userInfo.certificate
      for (let node of this.firstNode) {
        this.form.progressForm.first[node.index] = {
          'name': node.name,
          'status': false,
          'picList': []
        }
      }
      for (let node of this.secondNode) {
        this.form.progressForm.second[node.index] = {
          'name': node.name,
          'status': false,
          'picList': []
        }
      }

      // 如果有 id 说明是编辑模式
      if (this.$route.params.id) {
        this.mode = 'edit'
        api.getLandResource(this.$route.params.id).then((res) => {
          this.mapVisible = false
          let temp = JSON.parse(res.data.data.landResource.stringify)
          temp.itemMap.keyword = ''
          temp.streetMap.keyword = ''
          this.form = temp
          this.mapVisible = true
        })
      } else {
        this.mapVisible = true
      }
    },
    async certificateChange () {
      await this.getUserInfo()
      this.certificateForm = this.userInfo.certificate
    },
    showUploadModal (node, index) {
      this.uploadVisible = true
      this.currentIndex = index
      this.currentNode = node
    },
    showSubmitModal () {
      // todo: 数据合法性鉴定
      this.submitModalVisible = true
      this.countDown = 5
      let interval = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown -= 1
        } else {
          clearInterval(interval)
        }
      }, 1000)
    },
    submit () {
      if (this.mode === 'create') {
        this.performSubmit()
      } else {
        this.edit()
      }
    },
    performSubmit () {
      api.publishLandResource(this.form).then(() => {
        this.$success('发布成功!')
        this.$router.push({name: 'landResource'})
      })
    },
    edit () {
      api.editLandResource(this.$route.params.id, this.form).then(() => {
        this.$success('修改成功!')
        this.$router.push({name: 'landResource'})
      })
    },
    changeStatus (tag, index) {
      this.nodeVisible = false
      this.form.progressForm[tag][index].status = !this.form.progressForm[tag][index].status
      this.nodeVisible = true
    },
    spaceValid () {
      if ((!this.form.space && this.form.space !== 0) || this.form.space < 0) {
        this.form.space = 0
        this.$error('面积不能小于0！')
        return false
      }
      this.form.space -= ''
      this.form.space += ''
      return true
    },
    itemTypeValid () {
      if (!this.form.itemType) {
        this.$error('请选择项目类型！')
        return false
      }
      if (this.form.itemType.includes('自定义') && !this.userDefinedItemType) {
        this.$error('自定义项目类型不能为空！')
        return false
      }
      return true
    },
    exchangeTypeValid () {
      if (!this.form.exchangeType) {
        this.$error('请选择项目类型！')
        return false
      }
      if (this.form.exchangeType.includes('自定义') && !this.userDefinedExchangeType) {
        this.$error('自定义项目类型不能为空！')
        return false
      }
      return true
    },
    changeSpaceType (type) {
      this.form.spaceType = type
    },
    removeShareHolder (item) {
      let index = this.form.itemBaseInfoForm.shareHolders.indexOf(item)
      if (index !== -1) {
        this.form.itemBaseInfoForm.shareHolders.splice(index, 1)
      }
    },
    removeOtherNode (key) {
      this.otherNodesVisible = false
      delete this.form.progressForm.others[key]
      this.otherNodesVisible = true
    },
    addShareHolder () {
      this.form.itemBaseInfoForm.shareHolders.push({
        key: Date.now(),
        name: '',
        percent: null
      })
    },
    addOtherNode () {
      this.otherNodesVisible = false
      let now = Date.now()
      this.$set(this.form.progressForm.others, now, {
        'name': '',
        'status': true
      })
      this.otherNodesVisible = true
    },
    handleNodeChange (info, node, index) {
      if (info.fileList.length === 0) {
        this.form.progressForm[node][index].picList = []
        return
      }

      if (!info.file.response) {
        info.fileList[info.fileList.length - 1].status = 'uploading'
        this.loading = true
      } else if (info.file.response.code !== HTTP.SUCCESS) {
        info.fileList[info.fileList.length - 1].status = 'error'
        this.loading = false
      } else {
        // Get this url from response in real world.
        this.loading = false
        info.fileList[info.fileList.length - 1].uuid = info.file.response.data.uuid
        info.fileList[info.fileList.length - 1].status = 'done'
      }

      this.form.progressForm[node][index].picList = info.fileList
    },
    async handleChange (info, form, list) {
      if (info.fileList.length === 0) {
        this[form][list] = []
        return
      }

      if (!info.file.response) {
        info.fileList[info.fileList.length - 1].status = 'uploading'
        this.loading = true
      } else if (info.file.response.code !== HTTP.SUCCESS) {
        info.fileList[info.fileList.length - 1].status = 'error'
        this.loading = false
      } else {
        // Get this url from response in real world.
        this.loading = false
        info.fileList[info.fileList.length - 1].status = 'done'
        info.fileList[info.fileList.length - 1].uuid = info.file.response.data.uuid
      }

      this[form][list] = info.fileList
    },
    async handlePreview (file) {
      if (!file.uuid && !file.preview && file.response.data.status === 'temp') {
        file.preview = await utils.getBase64(file.originFileObj)
      }
      this.previewImage = (process.env.API_ROOT + '/system/pics/temp/' + file.uuid + '/') || file.preview
      this.previewVisible = true
    },
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
          this.form.itemBaseInfoForm.aboveGround.push(utils.Copy(this.tempAboveGroundForm))
          this.aboveGroundModalVisible = false
        }
      })
    },
    addUnderGround () {
      this.$refs.tempUnderGroundForm.validate(valid => {
        if (valid) {
          this.form.itemBaseInfoForm.underGround.push(utils.Copy(this.tempUnderGroundForm))
          this.underGroundModalVisible = false
        }
      })
    },
    saveItemBaseInfo () {
      this.$refs.tempItemBaseInfoForm.validate(valid => {
        if (valid) {
          this.form.itemBaseInfoForm = utils.Copy(this.tempItemBaseInfoForm)
          this.itemBaseInfoModalVisible = false
        }
      })
    },
    saveLandCostInfo () {
      this.form.landCostForm = utils.Copy(this.tempLandCostForm)
      this.landCostModalVisible = false
    },
    showItemBaseInfoModal () {
      // 先把数据复制到modal的表单里，防止编辑取消，原数据被修改
      this.tempItemBaseInfoForm = utils.Copy(this.form.itemBaseInfoForm)
      this.itemBaseInfoModalVisible = true
    },
    showLandCostModal () {
      // 先把数据复制到modal的表单里，防止编辑取消，原数据被修改
      this.tempLandCostForm = utils.Copy(this.form.landCostForm)
      this.landCostModalVisible = true
    },
    updatePolygonPath (e, map) {
      this.form[map].polygonPath = e.target.getPath()
    },
    removePolygonPoint (map) {
      this.form[map].polygonPath = []
    },
    addPolygonPoint (map) {
      this.form[map].polygonPath.push(this.form[map].center)
      this.form[map].polygonPath.push(this.form[map].center)
    },
    syncCenterAndZoom (e, map) {
      const {lng, lat} = e.target.getCenter()
      this.form[map].center.lng = lng
      this.form[map].center.lat = lat
      this.form[map].zoom = e.target.getZoom()
    }
  }
}
</script>

<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #40a9ff;
}

.file-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.input-tag {
  color: #9c9c9c;
  font-weight: bolder;
  font-size: 18px;
  margin-right: 10px;
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
