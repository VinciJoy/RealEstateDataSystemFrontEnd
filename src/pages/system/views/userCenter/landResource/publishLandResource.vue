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
            <span class="input-tag">发布人身份: </span>
              <a-select v-model="form.identity" style="width: 20%" placeholder="请选择发布人身份">
                <a-select-option v-for="identity in identities" :value="identity" :key="identity">
                  {{ identity }}
                </a-select-option>
              </a-select>
            </a-row>
          <a-row class="mt-20">
            <a-col :span="8">
              <a-col :span="form.itemType.includes('自定义') ? 11 : 24">
                <span class="input-tag">类型: </span>
                <a-select placeholder="请选择项目类型" v-model="form.itemType" style="width: 60%">
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
              <a-select placeholder="请选择项目形态" v-model="form.itemFormation" style="width: 60%">
                <a-select-option v-for="itemFormation in itemFormations" :value="itemFormation" :key="itemFormation">
                    {{ itemFormation }}
                  </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              <a-col :span="form.exchangeType.includes('自定义') ? 13 : 24">
                <span class="input-tag">交易形式: </span>
                <a-select placeholder="请选择项目交易形式" v-model="form.exchangeType" style="width: 45%">
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
              <baidu-map
                v-if="mapVisible"
                :ak="ak"
                style="width: 600px; height: 400px; display: inline-block"
                :center="form.itemMap.center"
                :scroll-wheel-zoom="true"
                :zoom="form.itemMap.zoom"
                mapType="BMAP_SATELLITE_MAP"
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
                <BaiduCircle :center="form.itemMap.threeCirclePath.center" :radius="form.itemMap.threeCirclePath.radius" stroke-color="blue" :fillColor="''" :stroke-opacity="0.5" :stroke-weight="2"></BaiduCircle>
                <BaiduCircle :center="form.itemMap.fiveCirclePath.center" :radius="form.itemMap.fiveCirclePath.radius" stroke-color="blue" :fillColor="''" :stroke-opacity="0.5" :stroke-weight="2"></BaiduCircle>
              </baidu-map>

            <div style="display: inline-block; padding-left: 20px; vertical-align: top">
                <span class="input-tag">关键词: </span><a-input v-model="form.itemMap.keyword" style="width: 50%"></a-input>
              <a-row class="mt-20">
                (移动地图，拖动白色方框可勾画项目四至范围)
              </a-row>
              <a-row class="mt-20">
                <a-button @click="addPolygonPoint('itemMap')" :disabled="form.itemMap.polygonPath.length > 0" type="primary">添 加 标 记</a-button>
              </a-row>
              <a-row class="mt-20">
                <a-button @click="removePolygonPoint('itemMap')" :disabled="form.itemMap.polygonPath.length === 0" type="primary">清 除 标 记</a-button>
              </a-row>
<!--              <a-row class="mt-20">-->
<!--                <a-button @click="addThreeCircle('itemMap')" :disabled="form.itemMap.polygonPath.length === 0" type="primary">周 边 三 公 里</a-button>-->
<!--              </a-row>-->
<!--              <a-row class="mt-20">-->
<!--                <a-button @click="addFiveCircle('itemMap')" :disabled="form.itemMap.polygonPath.length === 0" type="primary">周 边 五 公 里</a-button>-->
<!--              </a-row>-->
            </div>
          </a-row>
        </div>
<!--        item position end-->

<!--        item desc begin-->
        <div class="mt-20 sub-gray-line">
          <a-row>
            <h2 style="font-weight: bolder">项目技术指标录入</h2>
          </a-row>

          <a-row>
            <p class="input-tag">项目基本面录入(必填)</p>
            <a-radio-group name="radioGroup" v-model="form.itemBaseInfoForm.itemBaseMode">
              <a-radio value="use">
                用地面积输入
              </a-radio>
              <a-radio value="occupy">
                占地面积输入
              </a-radio>
            </a-radio-group>

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
                <td @click="editBase('baseComprehensiveFAR')">
                  <span v-if="itemBaseEdit !== 'baseComprehensiveFAR'">
                    {{ form.itemBaseInfoForm.comprehensiveFAR | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseComprehensiveFAR" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.comprehensiveFAR"></a-input>
                </td>
              </tr>
              <tr>
                <th>{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '其中——住宅建筑面积（m²）' : '其中——住宅占地面积（m²）'}}</th>
                <td @click="editBase('baseApartmentSpace')">
                  <span v-if="itemBaseEdit !== 'baseApartmentSpace'">
                    {{ form.itemBaseInfoForm.apartmentSpace | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseApartmentSpace" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.apartmentSpace"></a-input>
                </td>
                <th>住宅容积率</th>
                <td @click="editBase('baseApartmentFAR')">
                  <span v-if="itemBaseEdit !== 'baseApartmentFAR'">
                    {{ form.itemBaseInfoForm.apartmentFAR | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseApartmentFAR" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.apartmentFAR"></a-input>
                </td>
              </tr>
              <tr>
                <th>{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '其中——商业建筑面积（m²）' : '其中——商业占地面积（m²）'}}</th>
                <td @click="editBase('baseBusinessSpace')">
                  <span v-if="itemBaseEdit !== 'baseBusinessSpace'">
                    {{ form.itemBaseInfoForm.businessSpace | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseBusinessSpace" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.businessSpace"></a-input>
                </td>
                <th>商业容积率</th>
                <td @click="editBase('baseBusinessFAR')">
                  <span v-if="itemBaseEdit !== 'baseBusinessFAR'">
                    {{ form.itemBaseInfoForm.businessFAR | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseBusinessFAR" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.businessFAR"></a-input>
                </td>
              </tr>
              <tr>
                <th>{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '其中——办公建筑面积（m²）' : '其中——办公占地面积（m²）'}}</th>
                <td @click="editBase('baseOfficeSpace')">
                  <span v-if="itemBaseEdit !== 'baseOfficeSpace'">
                    {{ form.itemBaseInfoForm.officeSpace | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseOfficeSpace" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.officeSpace"></a-input>
                </td>
                <th>办公容积率</th>
                <td @click="editBase('baseOfficeFAR')">
                  <span v-if="itemBaseEdit !== 'baseOfficeFAR'">
                    {{ form.itemBaseInfoForm.officeFAR | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseOfficeFAR" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.officeFAR"></a-input>
                </td>
              </tr>
              <tr>
                <th>{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '其中——其他建筑面积（m²）' : '其中——其他占地面积（m²）'}}</th>
                <td @click="editBase('baseOtherSpace')">
                  <span v-if="itemBaseEdit !== 'baseOtherSpace'">
                    {{ form.itemBaseInfoForm.otherSpace | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseOtherSpace" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.otherSpace"></a-input>
                </td>
                <th>其他容积率</th>
                <td @click="editBase('baseOtherFAR')">
                  <span v-if="itemBaseEdit !== 'baseOtherFAR'">
                    {{ form.itemBaseInfoForm.otherFAR | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseOtherFAR" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.otherFAR"></a-input>
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
                <td colspan="3" @click="editBase('baseUnderGroundSpace')">
                  <span v-if="itemBaseEdit !== 'baseUnderGroundSpace'">
                    {{ form.itemBaseInfoForm.underGroundSpace | filterUndefined }}
                  </span>
                  <a-input type="number" ref="baseUnderGroundSpace" @blur="itemBaseEdit = 0" v-else v-model="form.itemBaseInfoForm.underGroundSpace"></a-input>
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
          </a-row>

          <a-row class="mt-20">
            <p class="input-tag">地上业态产品详细指标填写(选填)</p>

            <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
              <tr>
                <th>指标分类</th>
                <th>业态选择</th>
                <th>具体产品</th>
                <th>建筑面积（m²）</th>
              </tr>
              <tr>
                <th rowspan="100">
                  地上业态
                </th>
              </tr>

              <template v-for="(item, index) of form.itemBaseInfoForm.aboveGround">
                  <tr>
                    <th :rowspan="item.products.length  > 1 ? (item.products.length + 2) : 2">
                      <span class="clickable-txt" @click="editAboveGroundType(index)" v-if="editAboveGroundTypeIndex !== index">
                        {{ item.type ? item.type : '请点击选择业态' }}
                      </span>
                      <span v-else>
                        <a-select :ref="'editAboveGroundTypeIndex' + index" :default-open="true" @blur="editAboveGroundTypeIndex = ''" default-value="请点击选择业态" v-model="item.type" style="width: 200px">
                          <a-select-option v-for="op in aboveGroundTypes" :key="op" :value="op">
                            {{ op }}
                          </a-select-option>
                        </a-select>
                      </span>
                      <span @click="removeAboveGroundItem(index)" class="clickable-txt">
                        <a-icon type="minus" /> 删除
                      </span>
                    </th>

                    <template v-if="item.products.length === 1">
                      <th>
                        <span class="clickable-txt" @click="editAboveGroundProduct('aboveGround' + index + 'product' + 0)" v-if="editAboveGroundProductIndex !== 'aboveGround' + index + 'product' + 0">
                          {{ item.products[0].name ? item.products[0].name : '请点击选择具体产品' }}
                        </span>
                        <span v-else>
                          <a-select :ref="'aboveGround' + index + 'product' + 0" :default-open="true" @blur="editAboveGroundProductIndex = ''" default-value="请点击选择具体产品" v-model="item.products[0].name" style="width: 200px">
                            <a-select-option v-for="op in aboveGroundProducts[item.type]" :key="op" :value="op">
                              {{ op }}
                            </a-select-option>
                          </a-select>
                        </span>
                        <span @click="removeAboveGroundProduct(index, 0)" class="clickable-txt">
                          <a-icon type="minus" /> 删除
                        </span>
                      </th>
                      <td>
                        <div @click="editAboveGroundProductSpace('aboveGround' + index + 'product' + 0)" v-if="editAboveGroundProductSpaceIndex !== 'aboveGround' + index + 'product' + 0">
                          {{ item.products[0].space }}
                        </div>
                        <a-input :ref="'aboveGround' + index + 'product' + 0" v-else @blur="editAboveGroundProductSpaceIndex = ''" type="number" v-model="item.products[0].space"></a-input>
                      </td>
                    </template>

                      <tr v-if="item.products.length > 1" v-for="(product, i) of item.products" :key="'aboveGround' + index + 'product' + i">
                        <th>
                          <span class="clickable-txt" @click="editAboveGroundProduct('aboveGround' + index + 'product' + i)" v-if="editAboveGroundProductIndex !== 'aboveGround' + index + 'product' + i">
                            {{ item.products[i].name ? item.products[i].name : '请点击选择具体产品' }}
                          </span>
                          <span v-else>
                            <a-select :ref="'aboveGround' + index + 'product' + i" :default-open="true" @blur="editAboveGroundProductIndex = ''" default-value="请点击选择具体产品" v-model="item.products[i].name" style="width: 200px">
                              <a-select-option v-for="op in aboveGroundProducts[item.type]" :key="op" :value="op">
                                {{ op }}
                              </a-select-option>
                            </a-select>
                          </span>
                          <span @click="removeAboveGroundProduct(index, i)" class="clickable-txt">
                            <a-icon type="minus" /> 删除
                          </span>
                        </th>
                        <td>
                        <div @click="editAboveGroundProductSpace('aboveGround' + index + 'product' + i)" v-if="editAboveGroundProductSpaceIndex !== 'aboveGround' + index + 'product' + i">
                          {{ product.space }}
                        </div>
                        <a-input :ref="'aboveGround' + index + 'product' + i" v-else @blur="editAboveGroundProductSpaceIndex = ''" type="number" v-model="product.space"></a-input>
                      </td>
                      </tr>

                <template>
                      <th @click="item.products.push({
                        name: null,
                        space: 0
                        })" class="clickable-txt"
                          style="text-align: center"
                          colspan="2"><a-icon type="plus" /> 添加产品</th>
                    </template>
                  </tr>
                </template>

              <template>
                <tr>
                  <th @click="form.itemBaseInfoForm.aboveGround.push({
                  type: null,
                  products: []
                  })" class="clickable-txt" style="text-align: center" colspan="3">
                    <a-icon type="plus" /> 添加地上业态
                  </th>
                </tr>
              </template>

              <tr>
                <th colspan="2">地上业态指标面积合计（m²）</th>
                <th> {{ computedAboveSpace }} </th>
              </tr>
            </table>
          </a-row>

          <a-row class="mt-20">
            <p class="input-tag">地下业态产品详细指标填写(选填)</p>

            <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
              <tr>
                <th>指标分类</th>
                <th>具体产品</th>
                <th>建筑面积（m²）</th>
              </tr>
              <tr>
                <th rowspan="100">
                  地下业态
                </th>
              </tr>


              <template v-for="(item, index) of form.itemBaseInfoForm.underGround[0].products">
                <tr>
                  <th>
                    <span class="clickable-txt" @click="editUnderGroundType(index)" v-if="editUnderGroundTypeIndex !== index">
                      {{ item.name ? item.name : '请点击选择具体产品' }}
                    </span>
                    <span v-else>
                      <a-select :ref="'editUnderGroundTypeIndex' + index" :default-open="true" @blur="editUnderGroundTypeIndex = ''" default-value="请点击选择业态" v-model="item.name" style="width: 200px">
                        <a-select-option v-for="op in underGroundTypes" :key="op" :value="op">
                          {{ op }}
                        </a-select-option>
                      </a-select>
                    </span>
                    <span @click="removeUnderGroundItem(index)" class="clickable-txt">
                      <a-icon type="minus" /> 删除
                    </span>
                  </th>
                  <td>
                    <div @click="editUnderGroundProductSpace('underGround' + 0 + 'product' + index)" v-if="editUnderGroundProductSpaceIndex !== 'underGround' + 0 + 'product' + index">
                      {{ item.space }}
                    </div>
                    <a-input :ref="'underGround' + 0 + 'product' + index" v-else @blur="editUnderGroundProductSpaceIndex = ''" type="number" v-model="item.space"></a-input>
                  </td>
                </tr>
              </template>

              <template>
                <tr>
                  <th @click="form.itemBaseInfoForm.underGround[0].products.push({
                    name: null,
                    space: 0
                  })" class="clickable-txt" style="text-align: center" colspan="2">
                    <a-icon type="plus" /> 添加地下业态
                  </th>
                </tr>
              </template>

              <tr>
                <th>地下业态指标面积合计（m²）</th>
                <th> {{ computedUnderSpace }} </th>
              </tr>
            </table>
          </a-row>

          <a-row class="mt-20">
            <p class="input-tag">项目现状: </p>
            <a-textarea v-model="form.projectStatus" :maxLength="300"></a-textarea>
          </a-row>

<!--          <a-row class="mt-20" style="height: 650px">-->
<!--            <p class="input-tag">四至信息描述: </p>-->
<!--            <a-row :gutter="16">-->
<!--              <baidu-map-->
<!--                v-if="mapVisible"-->
<!--                :ak="ak"-->
<!--                style="width: 600px; height: 400px; display: inline-block"-->
<!--                :center="form.streetMap.center"-->
<!--                :scroll-wheel-zoom="true"-->
<!--                :zoom="form.streetMap.zoom"-->
<!--                @moving="syncCenterAndZoom($event, 'streetMap')"-->
<!--                @moveend="syncCenterAndZoom($event, 'streetMap')"-->
<!--                @zoomend="syncCenterAndZoom($event, 'streetMap')"-->
<!--              >-->
<!--                <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>-->
<!--                <BaiduNavigation anchor="BMAP_ANCHOR_TOP_RIGHT"></BaiduNavigation>-->
<!--                <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>-->
<!--                <BaiduGeolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :autoLocation="true"></BaiduGeolocation>-->
<!--                <BaiduPolygon :clicking="true" :path="form.streetMap.polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath($event, 'streetMap')"/>-->
<!--                <BaiduSearch :page-capacity="2" :keyword="form.streetMap.keyword" :auto-viewport="true"></BaiduSearch>-->
<!--              </baidu-map>-->

<!--              <div style="display: inline-block; padding-left: 20px; vertical-align: top">-->
<!--                  <span class="input-tag">关键词: </span><a-input v-model="form.streetMap.keyword" style="width: 50%"></a-input>-->
<!--                <a-row class="mt-20">-->
<!--                  <a-button @click="addPolygonPoint('streetMap')" :disabled="form.streetMap.polygonPath.length > 0" type="primary">添 加 标 记</a-button>-->
<!--                </a-row>-->
<!--                <a-row class="mt-20">-->
<!--                  <a-button @click="removePolygonPoint('streetMap')" :disabled="form.streetMap.polygonPath.length === 0" type="primary">清 除 标 记</a-button>-->
<!--                </a-row>-->
<!--              </div>-->
<!--            </a-row>-->
<!--          </a-row>-->

          <a-row class="mt-20">
            <p class="input-tag">项目封面图片：</p>
            <a-col :span="12">
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.coverPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  class="file-uploader"
                  list-type="picture-card"
                  @change="handleChange($event, 'form','coverPicList')"
                >
                  <div v-if="form.coverPicList.length < 1">
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
            </a-col>
          </a-row>

          <p class="input-tag">上传项目现状照片及四至道路、配套照片(选填)：</p>
          <a-row type="flex">
              <a-col :span="12">
                <div style="display: inline-block" v-for="(pic, index) of form.landStatusPicList" :key="'streetPicList' + index">
                  <div @click="handlePreview(pic)" class="upload-add" style="display: flex; justify-content: center">
                    <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                  </div>
                  <div>
                    <a-input v-model="pic.description" placeholder="描述" style="width: 104px; margin-top: 10px"></a-input>
                  </div>
                </div>
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.landStatusPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  style="vertical-align: top"
                  class="file-uploader"
                  list-type="text"
                  @change="handleChange($event, 'form','landStatusPicList')"
                >
                  <div class="upload-add" v-if="form.landStatusPicList.length < 4">
                    <a-icon  class="upload-add-icon" :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
                <p style="margin-left: 10px">
                  地块现状照片
                </p>
            </a-col>

            <a-col :span="12">
              <div style="display: inline-block" v-for="(pic, index) of form.streetPicList" :key="'streetPicList' + index">
                <div @click="handlePreview(pic)" class="upload-add" style="display: flex; justify-content: center">
                  <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                </div>
                <div>
                  <a-input v-model="pic.description" placeholder="描述" style="width: 104px; margin-top: 10px"></a-input>
                </div>
              </div>
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.streetPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  style="vertical-align: top"
                  class="file-uploader"
                  list-type="text"
                  @change="handleChange($event, 'form','streetPicList')"
                >
                  <div class="upload-add" v-if="form.streetPicList.length < 4">
                    <a-icon  class="upload-add-icon" :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
                <p style="margin-left: 10px">
                  四至街道现状
                </p>
            </a-col>

            <a-col :span="12">
              <div style="display: inline-block" v-for="(pic, index) of form.effectPicList" :key="'effectPicList' + index">
                <div @click="handlePreview(pic)" class="upload-add" style="display: flex; justify-content: center">
                  <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                </div>
                <div>
                  <a-input v-model="pic.description" placeholder="描述" style="width: 104px; margin-top: 10px"></a-input>
                </div>
              </div>
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.effectPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  style="vertical-align: top"
                  class="file-uploader"
                  list-type="text"
                  @change="handleChange($event, 'form','effectPicList')"
                >
                  <div class="upload-add" v-if="form.effectPicList.length < 4">
                    <a-icon  class="upload-add-icon" :type="loading ? 'loading' : 'plus'" />
                  </div>
                </a-upload>
                <p style="margin-left: 10px">
                  规划及方案效果图
                </p>
            </a-col>

            <a-col :span="12">
              <div style="display: inline-block" v-for="(pic, index) of form.facilityPicList" :key="'facilityPicList' + index">
                <div @click="handlePreview(pic)" class="upload-add" style="display: flex; justify-content: center">
                  <img style="max-width: 100px; max-height: 100px; padding: 8px" :src="pic.thumbUrl" />
                </div>
                <div>
                  <a-input v-model="pic.description" placeholder="描述" style="width: 104px; margin-top: 10px"></a-input>
                </div>
              </div>
                <a-upload
                  :action="uploadPicURL"
                  name="file"
                  :file-list="form.facilityPicList"
                  :withCredentials="true"
                  @preview="handlePreview"
                  style="vertical-align: top"
                  class="file-uploader"
                  list-type="text"
                  @change="handleChange($event, 'form','facilityPicList')"
                >
                  <div class="upload-add" v-if="form.facilityPicList.length < 4">
                    <a-icon  class="upload-add-icon" :type="loading ? 'loading' : 'plus'" />
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

          <a-row class="mt-20">
            <p class="input-tag">项目进度:</p>
            <a-radio-group v-model="form.showNodeIndex">
              <a-radio class="mt-20" style="display: block" :value="1">按一级开发节点</a-radio>
              <a-radio class="mt-20" style="display: block" :value="2">按二级开发节点</a-radio>
              <a-radio class="mt-20" style="display: block" :value="3">其他类项目节点</a-radio>
            </a-radio-group>
              <div v-if="nodeVisible && (form.showNodeIndex === 1)">
                <div class="mt-20" v-for="node in firstNode" :key="node.index">
                  <a-radio @click.prevent="changeStatus('first', node.index)" v-model="form.progressForm.first[node.index].status">{{ node.name }}</a-radio>
                  <a-button v-if="form.progressForm.first[node.index].status" @click="showUploadModal('first', node.index)" type="primary" style="float: right; width: 100px" size="small">上传证照</a-button>
                </div>
              </div>
              <div v-if="nodeVisible && (form.showNodeIndex === 2)">
                <a-radio-group v-model="secondNodeStatus">
                  <a-radio class="mt-20" style="display: block" :value="1">未出让</a-radio>
                  <a-radio class="mt-20" style="display: block" :value="2">已出让</a-radio>
                </a-radio-group>
                <div class="mt-20" v-if="secondNodeStatus === 2" v-for="node in secondNode" :key="node.index">
                  <a-radio @click.prevent="changeStatus('second', node.index)" v-model="form.progressForm.second[node.index].status">{{ node.name }}</a-radio>
                  <a-button v-if="form.progressForm.second[node.index].status" @click="showUploadModal('second', node.index)" type="primary" style="float: right; width: 100px" size="small">上传证照</a-button>
                </div>
              </div>
              <div v-if="nodeVisible && (form.showNodeIndex === 3)">
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
              </div>

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
            <p class="input-tag">项目交易价格:</p>
            <a-col>
              交易总对价金额
              <a-input style="width: 200px; margin-left: 20px;margin-right: 20px" type="number" v-model="form.totalTransactionAmount"></a-input>
              万元
            </a-col>
            <a-col>
              <div class="mt-20">
                已投入有票成本费
                <a-input style="width: 200px; margin-left: 20px;margin-right: 20px" type="number" v-model="form.investAmount"></a-input>
                万元
              </div>
            </a-col>
            <a-col>
              <div class="mt-20">
                其中，土地成本合计
                <a-input style="width: 200px; margin-left: 20px;margin-right: 20px" type="number" v-model="form.landAmount"></a-input>
                万元
              </div>
            </a-col>
            <a-col class="mt-10">
              <h3>土地成本合计</h3>

              <a-col :span="18">
                <table style="width: 100%" bordercolor="#e8e8e8" border="2">
                <tr>
                  <th>土地成本细项</th>
                  <th>总金额(万元)</th>
                  <th>已支付金额(万元)</th>
                </tr>
                  <tr>
                    <th>土地出让金</th>
                    <td>
                      <div @click="editLandCostForm('landTransferFeeTotal')" v-if="editLandCostFormIndex !== 'landTransferFeeTotal'">
                        {{ form.landCostForm.landTransferFeeTotal | filterUndefined }}
                      </div>
                      <a-input ref="landTransferFeeTotal" v-else @blur="editLandCostFormIndex = ''" type="number" v-model="form.landCostForm.landTransferFeeTotal"></a-input>
                    </td>
                    <td>
                      <div @click="editLandCostForm('landTransferFeePaid')" v-if="editLandCostFormIndex !== 'landTransferFeePaid'">
                        {{ form.landCostForm.landTransferFeePaid | filterUndefined }}
                      </div>
                      <a-input ref="landTransferFeePaid" v-else @blur="editLandCostFormIndex = ''" type="number" v-model="form.landCostForm.landTransferFeePaid"></a-input>
                    </td>
                  </tr>
                  <tr>
                    <th>拆迁补偿款(前期成本)</th>
                    <td>
                      <div @click="editLandCostForm('compensationTotal')" v-if="editLandCostFormIndex !== 'compensationTotal'">
                        {{ form.landCostForm.compensationTotal | filterUndefined }}
                      </div>
                      <a-input ref="compensationTotal" v-else @blur="editLandCostFormIndex = ''" type="number" v-model="form.landCostForm.compensationTotal"></a-input>
                    </td>
                    <td>
                      <div @click="editLandCostForm('compensationPaid')" v-if="editLandCostFormIndex !== 'compensationPaid'">
                        {{ form.landCostForm.compensationPaid | filterUndefined }}
                      </div>
                      <a-input ref="compensationPaid" v-else @blur="editLandCostFormIndex = ''" type="number" v-model="form.landCostForm.compensationPaid"></a-input>
                    </td>
                  </tr>
                  <tr>
                    <th>契税、印花税</th>
                    <td>
                      <div @click="editLandCostForm('deedTaxTotal')" v-if="editLandCostFormIndex !== 'deedTaxTotal'">
                        {{ form.landCostForm.deedTaxTotal | filterUndefined }}
                      </div>
                      <a-input ref="deedTaxTotal" v-else @blur="editLandCostFormIndex = ''" type="number" v-model="form.landCostForm.deedTaxTotal"></a-input>
                    </td>
                    <td>
                      <div @click="editLandCostForm('deedTaxPaid')" v-if="editLandCostFormIndex !== 'deedTaxPaid'">
                        {{ form.landCostForm.deedTaxPaid | filterUndefined }}
                      </div>
                      <a-input ref="deedTaxPaid" v-else @blur="editLandCostFormIndex = ''" type="number" v-model="form.landCostForm.deedTaxPaid"></a-input>
                    </td>
                  </tr>
                  <tr>
                    <th>市政配套费</th>
                    <td>
                      <div @click="editLandCostForm('municipalSupportingFeeTotal')" v-if="editLandCostFormIndex !== 'municipalSupportingFeeTotal'">
                        {{ form.landCostForm.municipalSupportingFeeTotal | filterUndefined }}
                      </div>
                      <a-input ref="municipalSupportingFeeTotal" v-else @blur="editLandCostFormIndex = ''" type="number" v-model="form.landCostForm.municipalSupportingFeeTotal"></a-input>
                    </td>
                    <td>
                      <div @click="editLandCostForm('municipalSupportingFeePaid')" v-if="editLandCostFormIndex !== 'municipalSupportingFeePaid'">
                        {{ form.landCostForm.municipalSupportingFeePaid | filterUndefined }}
                      </div>
                      <a-input ref="municipalSupportingFeePaid" v-else @blur="editLandCostFormIndex = ''" type="number" v-model="form.landCostForm.municipalSupportingFeePaid"></a-input>
                    </td>
                  </tr>
              </table>
              </a-col>

              <a-col :span="6"><div style="float: right">合计： <span class="blue-number">
                {{ computedTotalFee }}
              </span> 万元</div></a-col>
            </a-col>
          </a-row>

          <a-row>
            <p class="input-tag mt-20">项目优势自荐(选填):</p>
            <a-textarea v-model="form.projectAdvantages" :maxLength="300"></a-textarea>
          </a-row>

          <a-row class="mt-20">
            <a-upload-dragger
              name="file"
              :file-list="form.fileList"
              :multiple="true"
              :withCredentials="true"
              :action="uploadFileURL"
              @change="handleChange($event, 'form','fileList', 'file')"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">
                上传项目相关说明及文档
              </p>
            </a-upload-dragger>
          </a-row>

          <a-row class="mt-20">
            <p class="input-tag">项目公司名称:</p>
            <a-form-model
              ref="form.itemBaseInfoForm"
              :model="form.itemBaseInfoForm"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
            >
              <div v-for="(shareHolder, index) in form.itemBaseInfoForm.shareHolders" :key="shareHolder.key">
                <a-form-model-item
                  style="width: 40%; display: inline-block"
                  :label="'项目公司' + (index + 1) + '名称'"
                  :prop="'shareHolders.' + index + '.name'"
                  :rules="{
                    required: true,
                    message: '项目公司名称不能为空！',
                    trigger: 'blur',
                  }"
                >
                  <a-input
                    v-model="shareHolder.name"
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
                  <a-icon type="plus" /> 增 加 项 目 公 司
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </a-row>

          <a-row class="mt-20">
            <p class="input-tag">项目抵押情况(选填)</p>
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
                  <a-radio :value="null">
                    未选择
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
                  <a-radio :value="null">
                    未选择
                  </a-radio>
                </a-radio-group>
              </a-col>
            </a-row>
          </a-row>

          <a-row class="mt-20">
            <a-button v-if="mode === 'create'" :disabled="!userInfo.ID" @click="showSubmitModal" type="primary">提 交 项 目 信 息</a-button>
            <a-button v-if="mode === 'edit'" :disabled="!userInfo.ID" @click="showSubmitModal" type="primary">修 改 项 目 信 息</a-button>

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
                <a-button :disabled="true" v-if="countDown > 0" style="margin-left:40px;width: 130px">{{ '还需阅读' + countDown + '秒' }}</a-button>
                <a-button type="primary" v-else style="margin-left:40px;width: 20%" @click="submit">提 交</a-button>
              </a-row>
            </a-modal>

            <div style="margin-left: 20px; display: inline-block">
              资金匹配需求：(若本项目为开放股权、代建类项目，是否有资金匹配需求？)
              <a-radio-group v-model="form.itemBaseInfoForm.financialMatch">
                <a-radio :value="true">
                  是
                </a-radio>
                <a-radio :value="false">
                  否
                </a-radio>
                <a-radio :value="null">
                  未选择
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
<!--    modal end-->
  </div>
</template>

<script>
import options from '@/utils/cities'
import api from '@system/api/landResource'
import utils from '@/utils/utils'
import { ITEM_TYPES, EXCHANGE_TYPES, HTTP } from '@/utils/constants'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BaiduScale from 'vue-baidu-map/components/controls/Scale'
import BaiduNavigation from 'vue-baidu-map/components/controls/Navigation'
import BaiduMapType from 'vue-baidu-map/components/controls/MapType'
import BaiduGeolocation from 'vue-baidu-map/components/controls/Geolocation'
import BaiduPolygon from 'vue-baidu-map/components/overlays/Polygon'
import BaiduSearch from 'vue-baidu-map/components/search/LocalSearch'
import BaiduCircle from 'vue-baidu-map/components/overlays/Circle'
import {mapActions, mapGetters} from 'vuex'
import userVerify from '../../components/userVerify'

const underGroundTypes = [
  '非人防车位',
  '人防车位',
  '地下储藏室',
  '地下设备用房',
  '地下商业'
]

const identities = [
  '项目土地方',
  '项目权属单位管理人员',
  '项目居间方',
  '项目介绍方'
]

const aboveGroundProducts = {
  '住宅-别墅类产品': [
    '独栋别墅',
    '双拼别墅',
    '联排别墅',
    '叠拼别墅',
    '合院别墅'
  ],
  '住宅-多层类产品': [
    '花园洋房（6-7F）',
    '普通多层'
  ],
  '住宅-高层类产品': [
    '小高层（7-11F）',
    '中高层（12-18F）',
    '高层（19-33F）',
    '超高层（>34F）'
  ],
  '类住宅类产品': [
    '酒店式公寓',
    'LOFT 公寓'
  ],
  '商业类产品': [
    '裙房类商业/展厅',
    '商业街',
    'MALL',
    '商业独栋'
  ],
  '酒店类产品': [
    '五星级酒店及以上',
    '四星级酒店',
    '其他酒店'
  ],
  '办公类产品': [
    '办公会所/商务独栋',
    '写字楼',
    '公寓式办公/SOHO'
  ],
  '自持类产品': [
    '自持住宅',
    '自持商业',
    '自持办公',
    '自持酒店',
    '其他自持'
  ],
  '配套配建类产品': [
    '社区用房',
    '物业用房',
    '教育配建',
    '市政共用',
    '其他配建'
  ]
}

const aboveGroundTypes = [
  '住宅-别墅类产品',
  '住宅-多层类产品',
  '住宅-高层类产品',
  '类住宅类产品',
  '商业类产品',
  '酒店类产品',
  '办公类产品',
  '自持类产品',
  '配套配建类产品'
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
    BaiduPolygon,
    BaiduCircle
  },
  filters: {
    filterUndefined (data) {
      if (data === undefined) {
        return '请输入数据'
      }
      if (data + '' === 'NaN') {
        return '请输入数据'
      }
      return (data - '').toFixed(2)
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
    computedAboveSpace: {
      get: function () {
        let res = 0
        for (let item of this.form.itemBaseInfoForm.aboveGround) {
          for (let product of item.products) {
            res += product.space - ''
          }
        }
        return res
      }
    },
    computedUnderSpace: {
      get: function () {
        let res = 0
        for (let item of this.form.itemBaseInfoForm.underGround[0].products) {
          res += item.space - ''
        }
        return res
      }
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
      editLandCostFormIndex: '',
      aboveGroundProducts: aboveGroundProducts,
      editAboveGroundTypeIndex: '',
      editUnderGroundTypeIndex: '',
      editAboveGroundProductIndex: '',
      editAboveGroundProductSpaceIndex: '',
      editUnderGroundProductSpaceIndex: '',
      certificateForm: {
        certificatePicList: []
      },
      itemBaseEdit: 0,
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
        showNodeIndex: 0,
        totalTransactionAmount: '0',
        investAmount: 0,
        landAmount: 0,
        place: [],
        spaceType: 'aboveGround',
        space: 0,
        itemType: [],
        itemFormation: [],
        exchangeType: [],
        itemMap: {
          center: {
            lng: 116.404,
            lat: 39.915
          },
          threeCirclePath: {
            center: {
              lng: 116.404,
              lat: 39.915
            },
            radius: 0
          },
          fiveCirclePath: {
            center: {
              lng: 116.404,
              lat: 39.915
            },
            radius: 0
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
          itemBaseMode: 'use',
          aboveGround: [],
          underGround: [
            {
              type: null,
              products: []
            }
          ],
          assetMortgage: null,
          financialMatch: null,
          stockMortgage: null,
          shareHolders: []
        },
        landCostForm: {},
        landStatusPicList: [],
        fileList: [],
        facilityPicList: [],
        coverPicList: [],
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
      uploadFileURL: '',
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
      tempAboveGroundForm: {},
      tempUnderGroundForm: {},
      tempItemBaseInfoForm: {
      },
      tempLandCostForm: {},
      options: options,
      itemBaseInfoModalVisible: false,
      landCostModalVisible: false,
      submitModalVisible: false,
      countDown: 5,
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo'
    }
  },
  created () {
    this.init()
    this.uploadPicURL = process.env.API_ROOT + '/system/pics/'
    this.uploadFileURL = process.env.API_ROOT + '/system/files/'
  },
  methods: {
    ...mapActions(['getUserInfo']),
    editLandCostForm (index) {
      this.editLandCostFormIndex = index
      this.$nextTick(() => this.$refs[index].focus())
    },
    editUnderGroundProductSpace (index) {
      this.editUnderGroundProductSpaceIndex = index
      this.$nextTick(() => this.$refs[index][0].focus())
    },
    editAboveGroundProduct (index) {
      this.editAboveGroundProductIndex = index
      this.$nextTick(() => this.$refs[index][0].focus())
    },
    editAboveGroundType (index) {
      this.editAboveGroundTypeIndex = index
      this.$nextTick(() => this.$refs['editAboveGroundTypeIndex' + index][0].focus())
    },
    editAboveGroundProductSpace (index) {
      this.editAboveGroundProductSpaceIndex = index
      this.$nextTick(() => this.$refs[index][0].focus())
    },
    removeAboveGroundProduct (itemIndex, productIndex) {
      this.form.itemBaseInfoForm.aboveGround[itemIndex].products.splice(productIndex, 1)
    },
    removeAboveGroundItem (itemIndex) {
      this.form.itemBaseInfoForm.aboveGround.splice(itemIndex, 1)
    },
    removeUnderGroundItem (itemIndex) {
      this.form.itemBaseInfoForm.underGround[0].products.splice(itemIndex, 1)
    },
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
          let temp = JSON.parse(res.data.data.stringify)
          temp.itemMap.keyword = ''
          if (!temp.itemMap.threeCirclePath) {
            temp.itemMap.threeCirclePath = {
              center: {
                lat: 0,
                lng: 0
              },
              radius: 0
            }
          }
          if (!temp.itemMap.fiveCirclePath) {
            temp.itemMap.fiveCirclePath = {
              center: {
                lat: 0,
                lng: 0
              },
              radius: 0
            }
          }
          if (!temp.itemBaseInfoForm.itemBaseMode) {
            temp.itemBaseInfoForm.itemBaseMode = 'use'
          }
          if (!temp.itemBaseInfoForm.underGround || !temp.itemBaseInfoForm.underGround.length) {
            temp.itemBaseInfoForm.underGround = [
              {
                type: null,
                products: []
              }
            ]
          }
          temp.streetMap.keyword = ''
          if (!temp.coverPicList) {
            temp.coverPicList = []
          }
          this.form = temp
          this.mapVisible = true
        })
      } else {
        this.mapVisible = true
      }
    },
    editBase (index) {
      this.itemBaseEdit = index
      this.$nextTick(() => this.$refs[index].focus())
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
      // 数据合法性鉴定
      if (!this.form.place || !this.form.place.length) {
        this.$error('请选择项目所在地区！')
        return
      }

      if (!this.form.space || this.form.place.space <= 0) {
        this.$error('请输入正确的项目面积！')
        return
      }

      if (!this.form.identity || !this.form.identity.length) {
        this.$error('请选择发布人身份！')
        return
      }

      if (!this.itemTypeValid()) {
        return
      }

      if (!this.form.itemFormation || !this.form.itemFormation.length) {
        this.$error('请选择项目形态！')
        return
      }

      if (!this.exchangeTypeValid()) {
        return
      }

      if (!this.form.itemBaseInfoForm.comprehensiveFAR || this.form.itemBaseInfoForm.comprehensiveFAR <= 0) {
        this.$error('请输入正确的综合容积率！')
        return
      }

      if (!this.form.itemBaseInfoForm.apartmentSpace || this.form.itemBaseInfoForm.apartmentSpace <= 0) {
        if (this.form.itemBaseInfoForm.itemBaseMode !== 'occupy') {
          this.$error('请输入正确的住宅占地面积！')
        } else {
          this.$error('请输入正确的住宅建筑面积！')
        }
        return
      }

      if (!this.form.itemBaseInfoForm.apartmentFAR || this.form.itemBaseInfoForm.apartmentFAR <= 0) {
        this.$error('请输入正确的住宅容积率！')
        return
      }

      if (!this.form.itemBaseInfoForm.businessSpace || this.form.itemBaseInfoForm.businessSpace <= 0) {
        if (this.form.itemBaseInfoForm.itemBaseMode !== 'occupy') {
          this.$error('请输入正确的商业占地面积！')
        } else {
          this.$error('请输入正确的商业建筑面积！')
        }
        return
      }

      if (!this.form.itemBaseInfoForm.businessFAR || this.form.itemBaseInfoForm.businessFAR <= 0) {
        this.$error('请输入正确的商业容积率！')
        return
      }

      if (!this.form.itemBaseInfoForm.officeSpace || this.form.itemBaseInfoForm.officeSpace <= 0) {
        if (this.form.itemBaseInfoForm.itemBaseMode !== 'occupy') {
          this.$error('请输入正确的办公占地面积！')
        } else {
          this.$error('请输入正确的办公建筑面积！')
        }
        return
      }

      if (!this.form.itemBaseInfoForm.officeFAR || this.form.itemBaseInfoForm.officeFAR <= 0) {
        this.$error('请输入正确的办公容积率！')
        return
      }

      if (!this.form.itemBaseInfoForm.otherSpace || this.form.itemBaseInfoForm.otherSpace <= 0) {
        if (this.form.itemBaseInfoForm.itemBaseMode !== 'occupy') {
          this.$error('请输入正确的其他占地面积！')
        } else {
          this.$error('请输入正确的其他建筑面积！')
        }
        return
      }

      if (!this.form.itemBaseInfoForm.otherFAR || this.form.itemBaseInfoForm.otherFAR <= 0) {
        this.$error('请输入正确的其他容积率！')
        return
      }

      if (!this.form.itemBaseInfoForm.underGroundSpace || this.form.itemBaseInfoForm.underGroundSpace <= 0) {
        this.$error('请输入正确的地下建筑面积！')
        return
      }

      // 身份认证检测
      if (!this.userInfo.certificationVerified && this.userInfo.certificate.ID === 0) {
        this.$error('请先完成实名认证！')
        this.certificateModalVisible = true
        return
      }

      if (!this.userInfo.certificationVerified && this.userInfo.certificate.ID !== 0) {
        this.$error('请等待管理员确认实名认证！')
        return
      }

      this.submitModalVisible = true

      // 获取封面的uuid
      let pic = ''
      if (this.form.coverPicList.length) {
        pic = this.form.coverPicList[0].uuid
      } else if (this.form.landStatusPicList.length) {
        pic = this.form.landStatusPicList[0].uuid
      } else if (this.form.streetPicList.length) {
        pic = this.form.streetPicList[0].uuid
      } else if (this.form.effectPicList.length) {
        pic = this.form.effectPicList[0].uuid
      } else if (this.form.facilityPicList.length) {
        pic = this.form.facilityPicList[0].uuid
      }

      this.form.coverPicUuid = pic

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
      if (!this.form.itemType || !this.form.itemType.length) {
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
      if (!this.form.exchangeType || !this.form.exchangeType.length) {
        this.$error('请选择项目类型！')
        return false
      }
      if (this.form.exchangeType.includes('自定义') && !this.userDefinedExchangeType) {
        this.$error('自定义项目类型不能为空！')
        return false
      }
      return true
    },
    editUnderGroundType (index) {
      this.editUnderGroundTypeIndex = index
      this.$nextTick(() => this.$refs['editUnderGroundTypeIndex' + index][0].focus())
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
    async handleChange (info, form, list, type = 'pic') {
      if (info.fileList.length === 0) {
        this[form][list] = []
        return
      }

      if (type === 'pic' && !info.fileList[info.fileList.length - 1].thumbUrl) {
        info.fileList[info.fileList.length - 1].thumbUrl = await utils.getBase64(info.file.originFileObj)
      }

      this.loading = true

      if (!info.file.response) {
        info.fileList[info.fileList.length - 1].status = 'uploading'
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
      this.form[map].threeCirclePath.radius = 0
      this.form[map].fiveCirclePath.radius = 0
    },
    addThreeCircle (map) {
      let lng = 0
      let lat = 0
      for (let point of this.form[map].polygonPath) {
        lng += point.lng
        lat += point.lat
      }
      this.form[map].threeCirclePath.center = {
        lng: lng / this.form[map].polygonPath.length,
        lat: lat / this.form[map].polygonPath.length
      }
      this.form[map].threeCirclePath.radius = 3000
    },
    addFiveCircle (map) {
      let lng = 0
      let lat = 0
      for (let point of this.form[map].polygonPath) {
        lng += point.lng
        lat += point.lat
      }
      this.form[map].fiveCirclePath.center = {
        lng: lng / this.form[map].polygonPath.length,
        lat: lat / this.form[map].polygonPath.length
      }
      this.form[map].fiveCirclePath.radius = 5000
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

.table-edit {
  color: #9c9c9c;
  float: right;
  cursor: pointer;
}

.modal-form-item-50-percent {
  width: 49%;
  display: inline-block;
}

.upload-pictures {
  width: 104px;
  height: 104px;
  display: block;
}

.upload-pictures > img {
  width: 100%;
  margin: 10px;
}

.upload-add-icon {
  font-size: 32px;
  color: #999;
  padding: 34px;
}

th {
  padding: 10px;
  background-color: #fafafa;
}

td {
  padding: 10px;
  cursor: pointer;
}

</style>
