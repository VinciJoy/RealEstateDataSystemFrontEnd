<template>
  <div>
    <a-modal @cancel="closeModal" width="80%" :visible="modalVisible" :footer="null">
      <div v-show="loading" style="text-align: center">
        <a-spin tip="加载中..."></a-spin>
      </div>
      <publishIndustryResource v-show="handleType === 'industryResource'" :history="true" :historyStringify="industryStringify"></publishIndustryResource>
      <publishLandResource v-show="handleType === 'landResource'" :history="true" :historyStringify="landStringify"></publishLandResource>
      <a-row v-if="isConsult" class="mt-20">
        <a-col style="border: 1px solid transparent" :span="2"></a-col>
          <a-col :span="20">
          <a-col :span="12">
            <span style="font-weight: bolder">姓名：</span>{{ consult.userName ? consult.userName : '暂无' }}
          </a-col>
          <a-col :span="12">
            <span style="font-weight: bolder">电话：</span>{{ consult.userPhone ? consult.userPhone : '暂无' }}
          </a-col>
          <a-col :span="12">
            <span style="font-weight: bolder">公司：</span>{{ consult.userCompany ? consult.userCompany : '暂无' }}
          </a-col>
          <a-col :span="12">
            <span style="font-weight: bolder">职务：</span>{{ consult.userPosition ? consult.userPosition : '暂无' }}
          </a-col>
            <a-col :span="24">
              <span style="font-weight: bolder">诉求或疑问：</span>{{ consult.desc ? consult.desc : '暂无' }}
            </a-col>
            <a-col class="mt-10" :span="24">
              <h3 style="font-weight: bolder;">咨询状态：</h3>
              <a-select placeholder="请选择审核状态" v-model="consultForm.consultStatus" style="width: 200px">
                <a-select-option :disabled="index < 1" v-for="(consultStatus, index) of CONSULT_STATUS_2_CN" :key="consultStatus" :value="index">
                  {{ consultStatus }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col class="mt-10" :span="24">
              <h3 style="font-weight: bolder;">处理记录：</h3>
              <a-input v-model="consultForm.record"></a-input>
            </a-col>
            <a-col :span="24" class="mt-20" style="text-align: center">
              <a-button type="primary" @click="submitConsult">完成咨询</a-button>
            </a-col>
        </a-col>
      </a-row>
      <a-row v-if="!isConsult" class="mt-20">
        <a-col style="border: 1px solid transparent" :span="2"></a-col>
        <a-col :span="20">
          <h3 style="font-weight: bolder; display: inline-block">审核状态：</h3>
          <a-select placeholder="请选择审核状态" v-model="form.auditStatus" style="width: 120px">
            <a-select-option :disabled="index < 2" v-for="(auditStatus, index) of AUDIT_STATUS_2_CN" :key="auditStatus" :value="index">
              {{ auditStatus }}
            </a-select-option>
          </a-select>

          <a-tabs class="mt-10" type="card">
            <a-tab-pane key="常规审核" tab="常规审核">
              <div>
                <h3 style="font-weight: bolder;">常规审核意见：</h3>
                <a-textarea v-model="form.normalAudit.advice"></a-textarea>
              </div>
              <div class="mt-10">
                <h3 style="font-weight: bolder;">平台协议记录：</h3>
                <div>
                  <p>
                    是否和平台签署合作协议：
                    <a-radio-group v-model="form.normalAudit.signedCooperation">
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
                  </p>
                  说明：<a-input v-model="form.normalAudit.cooperationDesc" style="width: 400px"></a-input>
                </div>
                <div class="mt-10">
                  <p>
                    是否已提交电子版平台协议：
                    <a-radio-group v-model="form.normalAudit.uploadedAgreement">
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
                  </p>
                  <a-upload
                    name="file"
                    :multiple="true"
                    :file-list="form.normalAudit.agreementFileList"
                    :withCredentials="true"
                    :action="uploadFileURL"
                    @change="handleChange"
                  >
                    <a-button> <a-icon type="upload" /> 上传电子版协议 </a-button>
                  </a-upload>
                </div>
                <div class="mt-10">
                  <p>
                    是否已收到纸质版平台协议：
                    <a-radio-group v-model="form.normalAudit.acceptedPaper">
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
                  </p>
                  说明：<a-input v-model="form.normalAudit.paperDesc" style="width: 400px"></a-input>
                </div>
                <div class="mt-20" style="text-align: center">
                  <a-button type="primary" @click="submitAudit">完成审核</a-button>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="专业审核" tab="专业审核">
              <div>
                <h3 style="font-weight: bolder;">项目关键点提炼：</h3>
                <table style="width: 100%" bordercolor="#e8e8e8" border="2">
                  <tr>
                    <th colspan="4" style="text-align: center">关键点1：项目指标清单</th>
                  </tr>
                  <tr>
                    <th style="width: 25%">项目占地面积（m²）</th>
                    <td style="width: 25%">
                      <span v-if="handleType === 'landResource'">
                        {{ (dataForm.itemBaseInfoForm.itemBaseMode === 'occupy' ? spaceComputed / dataForm.itemBaseInfoForm.comprehensiveFAR : spaceComputed) | filterUndefined }}
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                    <th style="width: 25%">项目综合容积率</th>
                    <td style="width: 25%">
                      <span v-if="handleType === 'landResource'">
                        {{ dataForm.itemBaseInfoForm.comprehensiveFAR | filterUndefined }}
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>项目总建筑面积（m²）</th>
                    <td>
                      <span v-if="handleType === 'landResource'">
                        <span v-if="dataForm.itemBaseInfoForm.itemBaseMode === 'use'">
                          {{ (dataForm.itemBaseInfoForm.underGroundSpace ? (dataForm.itemBaseInfoForm.underGroundSpace - '' + spaceComputed * dataForm.itemBaseInfoForm.comprehensiveFAR) : '-') | filterUndefined }}
                        </span>
                        <span v-else>
                          {{ (dataForm.itemBaseInfoForm.underGroundSpace - '' + spaceComputed) | filterUndefined }}
                        </span>
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                    <th>项目地上建筑面积（m²）</th>
                    <td>
                      <span v-if="handleType === 'landResource'">
                        {{ (dataForm.itemBaseInfoForm.itemBaseMode === 'occupy' ? spaceComputed : spaceComputed * dataForm.itemBaseInfoForm.comprehensiveFAR) | filterUndefined }}
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>项目地下建筑面积（m²）</th>
                    <td>
                      <span v-if="handleType === 'landResource'">
                        {{ dataForm.itemBaseInfoForm.underGroundSpace | filterUndefined }}
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                    <th>项目地上可售建面（m²）</th>
                    <td>
                      <a-input type="number" v-model="form.marketableSpace"></a-input>
                    </td>
                  </tr>
                  <tr>
                    <th>项目地上自持建面（m²）</th>
                    <td>
                      <a-input type="number" v-model="form.controlledSpace"></a-input>
                    </td>
                    <th>项目可售比</th>
                    <td>
                      <span v-if="handleType === 'landResource'">
                        <span v-if="dataForm.itemBaseInfoForm.itemBaseMode === 'use'">
                          {{ (dataForm.itemBaseInfoForm.underGroundSpace ? (dataForm.itemBaseInfoForm.underGroundSpace - '' + spaceComputed * dataForm.itemBaseInfoForm.comprehensiveFAR) /  form.marketableSpace : '-') | filterUndefined }}
                        </span>
                        <span v-else>
                          {{ (dataForm.itemBaseInfoForm.underGroundSpace - '' + spaceComputed) / form.marketableSpace | filterUndefined }}
                        </span>
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                  </tr>
                </table>

                <table style="width: 100%" bordercolor="#e8e8e8" class="mt-20" border="2">
                  <tr>
                    <th colspan="4" style="text-align: center">关键点2：项目现状评估</th>
                  </tr>
                  <tr>
                    <th style="width: 25%">项目类型</th>
                    <td style="width: 25%">{{ dataForm.itemType }}</td>
                    <th style="width: 25%">项目取证进度</th>
                    <td style="width: 25%">123</td>
                  </tr>
                  <tr>
                    <th>项目土地出让时间</th>
                    <td>
                      <a-date-picker v-model="form.remiseDate" />
                    </td>
                    <th>项目现状评估</th>
                    <td>
                      <a-select placeholder="请选择项目现状评估" style="width: 200px" v-model="form.projectStatus" :options="[
                        {value: '七通一平净地', label: '七通一平净地'},
                        {value: '五通一平净地', label: '五通一平净地'},
                        {value: '三通一平净地', label: '三通一平净地'},
                        {value: '未场平净地', label: '未场平净地'},
                        {value: '地上附带待平推建筑物', label: '地上附带待平推建筑物'},
                        {value: '地上附带待拆迁物业', label: '地上附带待拆迁物业'},
                        {value: '自定义', label: '自定义'}
                      ]"></a-select>
                      <a-input style="width: 200px" class="mt-10" placeholder="请输入自定义内容" v-model="userDefinedProjectStatus" v-if="form.projectStatus.includes('自定义')" ></a-input>
                    </td>
                  </tr>
                  <tr>
                    <th>项目周边及四至评估</th>
                    <td>
                      <a-select
                        mode="multiple"
                        style="width: 200px"
                        placeholder="请选择项目周边及四至评估"
                        v-model="form.aroundStatus"
                        :options="[
                          {value: '四至道路通达', label: '四至道路通达'},
                          {value: '部分道路通达', label: '部分道路通达'},
                          {value: '道路均未通', label: '道路均未通'},
                          {value: '周边配套优越', label: '周边配套优越'},
                          {value: '周边配套齐全', label: '周边配套齐全'},
                          {value: '周边配套一般', label: '周边配套一般'},
                          {value: '周边配套匮乏', label: '周边配套匮乏'},
                          {value: '自定义', label: '自定义'}
                        ]"
                      >
                      </a-select>
                      <a-input style="width: 200px" class="mt-10" placeholder="请输入自定义内容" @blur="addUserDefinedAroundStatus" v-model="userDefinedAroundStatus" v-if="form.aroundStatus.includes('自定义')" ></a-input>
                    </td>
                    <th>项目交易方式</th>
                    <td>
                      <a-select
                        style="width: 200px"
                        placeholder="请选择项目交易方式"
                        v-model="form.exchangeType" :options="[
                        {value: '股权转让', label: '股权转让'},
                        {value: '增资扩股', label: '增资扩股'},
                        {value: '资产在建工程转让', label: '资产在建工程转让'},
                        {value: '资产旧房转让', label: '资产旧房转让'},
                        {value: '融资代建', label: '融资代建'},
                        {value: '开放股权', label: '开放股权'},
                        {value: '代建', label: '代建'},
                        {value: '委托运营', label: '委托运营'},
                        {value: '自定义', label: '自定义'}
                      ]"></a-select>
                      <a-input style="width: 200px" class="mt-10" placeholder="请输入自定义内容" v-model="userDefinedExchangeType" v-if="form.exchangeType.includes('自定义')" ></a-input>
                    </td>
                  </tr>
                </table>

                <table style="width: 100%" class="mt-20" bordercolor="#e8e8e8" border="2">
                  <tr>
                    <th colspan="4" style="text-align: center">关键点3：项目报价 单位：万元</th>
                  </tr>
                  <tr>
                    <th style="width: 25%">项目报价</th>
                    <td style="width: 25%">
                      {{ dataForm.totalTransactionAmount | filterUndefined }}
                    </td>
                    <th style="width: 25%">项目土地出让金</th>
                    <td style="width: 25%">
                      <span v-if="handleType === 'landResource'">
                        {{ dataForm.landCostForm.landTransferFeeTotal | filterUndefined }}
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>除土地出让金外有票成本</th>
                    <td>
                      <span v-if="handleType === 'landResource'">
                        {{ (dataForm.investAmount - dataForm.landCostForm.landTransferFeeTotal ) | filterUndefined }}
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                    <th>项目无票溢价</th>
                    <td>
                      <span v-if="handleType === 'landResource'">
                        {{ (dataForm.totalTransactionAmount - dataForm.investAmount) | filterUndefined }}
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>项目计容楼面价</th>
                    <td>
                      <span v-if="handleType === 'landResource'">
                        {{ (dataForm.totalTransactionAmount / (dataForm.itemBaseInfoForm.itemBaseMode === 'occupy' ? spaceComputed : spaceComputed * dataForm.itemBaseInfoForm.comprehensiveFAR)) | filterUndefined }}
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                    <th>项目可售楼面价（单位：元）</th>
                    <td>
                      <span v-if="handleType === 'landResource'">
                        {{ (dataForm.totalTransactionAmount * 10000 / form.marketableSpace)  | filterUndefined }}
                      </span>
                      <span v-if="handleType === 'industryResource'">
                        123
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <div class="mt-20">
                <h3 style="font-weight: bolder;">项目专业审查提炼：</h3>
                <table style="width: 100%" bordercolor="#e8e8e8" border="2">
                  <tr>
                    <th style="width: 25%">项目本身审查项类型</th>
                    <td style="width: 25%">
                      <a-input v-model="form.abstract.ownAudit"></a-input>
                    </td>
                    <th style="width: 25%">项目周边审查项类型</th>
                    <td style="width: 25%">
                      <a-input v-model="form.abstract.aroundAudit"></a-input>
                    </td>
                  </tr>
                  <tr>
                    <th>资产抵押</th>
                    <td>
                      <a-radio-group v-model="form.abstract.assetMortgage">
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
                    </td>
                    <th>周边是否存在影响施工的不利因素</th>
                    <td>
                      <a-radio-group v-model="form.abstract.disadvantageBuilding">
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
                    </td>
                  </tr>
                  <tr>
                    <th>股权抵押</th>
                    <td>
                      <a-radio-group v-model="form.abstract.sharedMortgage">
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
                    </td>
                    <th>周边是否存在引起客户反感的设施并计算实际距离</th>
                    <td>
                      <a-radio-group v-model="form.abstract.customerDislike">
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
                    </td>
                  </tr>
                  <tr>
                    <th>地块过往是否有引起客户反感的用途</th>
                    <td>
                      <a-radio-group v-model="form.abstract.usedCustomerDislike">
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
                    </td>
                    <th>周边是否存在辐射影响的设施并计算实际距离</th>
                    <td>
                      <a-radio-group v-model="form.abstract.radiationEffect">
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
                    </td>
                  </tr>
                   <tr>
                    <th>地块是否存在地质风险</th>
                    <td>
                      <a-radio-group v-model="form.abstract.geologicRisk">
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
                    </td>
                    <th>周边是否存在空气污染的设施并计算实际距离</th>
                    <td>
                      <a-radio-group v-model="form.abstract.airPollution">
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
                    </td>
                  </tr>
                   <tr>
                    <th>地块内是否存在需拆迁的建筑物</th>
                    <td>
                      <a-radio-group v-model="form.abstract.removal">
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
                    </td>
                    <th>周边是否存在噪音污染的设施并计算实际距离</th>
                    <td>
                      <a-radio-group v-model="form.abstract.noisePollution">
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
                    </td>
                  </tr>
                  <tr>
                    <th>地块内是否存在受保护的历史文物</th>
                    <td>
                      <a-radio-group v-model="form.abstract.culturalRelic">
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
                    </td>
                    <th>周边是否存在安全隐患设施并计算实际距离</th>
                    <td>
                      <a-radio-group v-model="form.abstract.potentialDanger">
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
                    </td>
                  </tr>
                  <tr>
                    <th>地块内的市政设施是否存在影响后期居住的缺陷</th>
                    <td>
                      <a-radio-group v-model="form.abstract.facilityDisadvantage">
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
                    </td>
                    <th>未来3年-4年规划中，地块周边是否出现上述不利因素</th>
                    <td>
                      <a-radio-group v-model="form.abstract.disadvantageIn3To4years">
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
                    </td>
                  </tr>
                </table>
              </div>

              <div class="mt-20">
                <h3 style="font-weight: bolder;">项目投资建议：</h3>
                <a-textarea v-model="form.advice"></a-textarea>
              </div>

              <div class="mt-20" style="text-align: center">
                  <a-button type="primary" @click="submitAudit">完成审核</a-button>
                </div>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </a-modal>

    <!--    预加载地图相关组件，防止显示历史信息时莫名其妙的bug-->
    <BaiduMap
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
    </BaiduMap>
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
import publishIndustryResource from '../industryResource/publishIndustryResource'
import publishLandResource from '../landResource/publishLandResource'
import {AUDIT_STATUS_2_CN, CONSULT_STATUS_2_CN} from '../../../../../utils/constants'
import landApi from '@system/api/landResource'
import AuditApi from '@system/api/audit'
import industryApi from '@system/api/industryResource'
import {HTTP} from '@/utils/constants'
import consultApi from '@system/api/consult'

export default {
  name: 'handleModal',
  components: {
    BaiduMap,
    BaiduScale,
    BaiduNavigation,
    BaiduMapType,
    BaiduGeolocation,
    BaiduPolygon,
    BaiduSearch,
    publishIndustryResource,
    publishLandResource,
    BaiduCircle
  },
  props: {
    handleType: {
      type: String
    },
    consult: {
      type: Object
    },
    isConsult: {
      type: Boolean,
      default: false
    },
    handleID: {
      type: Number,
      default: 0
    },
    modalVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      AUDIT_STATUS_2_CN,
      CONSULT_STATUS_2_CN,
      userDefinedAroundStatus: '',
      uploadFileURL: '',
      loading: false,
      landStringify: '',
      industryStringify: '',
      ak: 'a79kmTteEBy6rw3dpBZYMq86S2PGEmKo',
      dataForm: {
        itemBaseInfoForm: {},
        landCostForm: {}
      },
      consultForm: {
        consultStatus: [],
        desc: '',
        record: ''
      },
      form: {
        resourceType: '',
        resourceID: '',
        normalAudit: {
          advice: '',
          signedCooperation: null,
          cooperationDesc: '',
          uploadedAgreement: null,
          acceptedPaper: null,
          paperDesc: '',
          agreementFileList: []
        },
        abstract: {
          ownAudit: '',
          assetMortgage: null,
          sharedMortgage: null,
          customerDislike: null,
          radiationEffect: null,
          geologicRisk: null,
          noisePollution: null,
          culturalRelic: null,
          removal: null,
          disadvantageIn3To4years: null,
          facilityDisadvantage: null,
          potentialDanger: null,
          airPollution: null,
          usedCustomerDislike: null,
          disadvantageBuilding: null,
          aroundAudit: ''
        },
        advice: '',
        projectStatus: [],
        aroundStatus: [],
        exchangeType: [],
        auditStatus: [],
        remiseDate: null,
        controlledSpace: 0,
        marketableSpace: 0
      }
    }
  },
  filters: {
    filterUndefined (data) {
      if (data === '-') return data
      if (data === undefined) {
        return '暂无数据'
      }
      if (data === Infinity) {
        return '暂无数据'
      }
      if (data + '' === 'NaN') {
        return '暂无数据'
      }
      return (data - '').toFixed(2)
    }
  },
  computed: {
    userDefinedProjectStatus: {
      get: function () {
        if (!this.form.projectStatus.split('自定义/')[1]) return ''
        return this.form.projectStatus.split('自定义/')[1].trim()
      },
      set: function (val) {
        if (!val) {
          this.form.projectStatus = '自定义/'
        }
        this.form.projectStatus = '自定义/' + val.trim()
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
    spaceComputed: {
      get: function () {
        let res = 0
        if (!this.dataForm.itemBaseInfoForm) return res
        if (this.handleType === 'landResource') {
          if (this.dataForm.itemBaseInfoForm.apartmentSpace) {
            res += this.dataForm.itemBaseInfoForm.apartmentSpace - ''
          }
          if (this.dataForm.itemBaseInfoForm.businessSpace) {
            res += this.dataForm.itemBaseInfoForm.businessSpace - ''
          }
          if (this.dataForm.itemBaseInfoForm.officeSpace) {
            res += this.dataForm.itemBaseInfoForm.officeSpace - ''
          }
          if (this.dataForm.itemBaseInfoForm.otherSpace) {
            res += this.dataForm.itemBaseInfoForm.otherSpace - ''
          }
        }
        return res
      }
    }
  },
  watch: {
    'modalVisible' (val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    initForm () {
      this.dataForm = {
        itemBaseInfoForm: {},
        landCostForm: {}
      }
      this.form = {
        resourceType: '',
        resourceID: '',
        normalAudit: {
          advice: '',
          signedCooperation: null,
          cooperationDesc: '',
          uploadedAgreement: null,
          acceptedPaper: null,
          paperDesc: ''
        },
        abstract: {
          ownAudit: '',
          assetMortgage: null,
          sharedMortgage: null,
          customerDislike: null,
          radiationEffect: null,
          geologicRisk: null,
          noisePollution: null,
          culturalRelic: null,
          removal: null,
          disadvantageIn3To4years: null,
          facilityDisadvantage: null,
          potentialDanger: null,
          airPollution: null,
          usedCustomerDislike: null,
          disadvantageBuilding: null,
          aroundAudit: ''
        },
        advice: '',
        projectStatus: [],
        aroundStatus: [],
        exchangeType: [],
        auditStatus: [],
        remiseDate: null,
        controlledSpace: 0,
        marketableSpace: 0
      }
    },
    addUserDefinedAroundStatus () {
      this.form.aroundStatus.remove('自定义')
      if (!this.userDefinedAroundStatus) return
      this.form.aroundStatus.push('自定义/' + this.userDefinedAroundStatus)
    },
    init () {
      this.loading = true
      this.form.resourceType = this.handleType
      this.form.resourceID = this.handleID
      this.uploadFileURL = process.env.API_ROOT + '/system/files/'
      this.getAudit()
      if (this.isConsult) {
        let temp = JSON.parse(this.consult.stringify)
        this.consultForm.consultStatus = this.consult.consultStatus
        this.consultForm.record = temp.consult.record
      }
      if (this.handleType === 'landResource') {
        landApi.getLandResource(this.handleID).then(res => {
          this.landStringify = res.data.data.stringify
          this.dataForm = JSON.parse(this.landStringify)
          this.loading = false
        })
      }
      if (this.handleType === 'industryResource') {
        industryApi.getIndustryResource(this.handleID).then(res => {
          this.industryStringify = res.data.data.stringify
          this.dataForm = JSON.parse(this.industryStringify)
          this.loading = false
        })
      }
    },
    getAudit () {
      AuditApi.getAudit({
        resourceType: this.handleType,
        resourceID: this.handleID
      }).then(res => {
        if (res.data.data.stringify) {
          this.form = JSON.parse(res.data.data.stringify)['audit']
          if (this.form.normalAudit.agreementFileList) {
            for (let i = 0; i < this.form.normalAudit.agreementFileList.length; i++) {
              this.form.normalAudit.agreementFileList[i].url = this.uploadFileURL + 'temp/' + this.form.normalAudit.agreementFileList[i].uuid + '/'
            }
          }
        }
      })
    },
    async handleChange (info) {
      if (info.fileList.length === 0) {
        this.form.normalAudit.agreementFileList = []
        return
      }

      this.loading = true

      if (!info.file.response) {
        info.fileList[info.fileList.length - 1].status = 'uploading'
      } else if (info.file.response.code !== HTTP.SUCCESS) {
        info.fileList[info.fileList.length - 1].status = 'error'
        delete info.fileList[info.fileList.length - 1].originFileObj
        this.loading = false
      } else {
        // Get this url from response in real world.
        info.fileList[info.fileList.length - 1].status = 'done'
        info.fileList[info.fileList.length - 1].uuid = info.file.response.data.uuid
        delete info.fileList[info.fileList.length - 1].originFileObj
        this.loading = false
      }

      this.form.normalAudit.agreementFileList = info.fileList
    },
    closeModal () {
      this.initForm()
      this.$emit('closeHandleModal')
    },
    submitAudit () {
      if (!this.form.auditStatus || (Array.isArray(this.form.auditStatus) && this.form.auditStatus.length === 0)) {
        this.$error('请选择审核状态!')
        return
      }
      if (this.handleType === 'landResource') {
        landApi.editLandResource(this.handleID, {
          auditStatus: this.form.auditStatus,
          audit: this.form
        }).then(res => {
          this.$success('审核成功！')
          this.$emit('getLands')
          this.closeModal()
        })
      }
      if (this.handleType === 'industryResource') {
        industryApi.editIndustryResource(this.handleID, {
          auditStatus: this.form.auditStatus,
          audit: this.form
        }).then(res => {
          this.$success('审核成功！')
          this.$emit('getIndustries')
          this.closeModal()
        })
      }
    },
    submitConsult () {
      if (!this.consultForm.consultStatus || (Array.isArray(this.consultForm.consultStatus) && this.consultForm.consultStatus.length === 0)) {
        this.$error('请选择咨询状态!')
        return
      }
      consultApi.editConsult(this.consult.ID, {
        consultStatus: this.consultForm.consultStatus,
        consult: this.consultForm
      }).then(res => {
        this.$success('处理成功！')
        this.$emit('getConsults')
        this.closeModal()
      })
    }
  }
}
</script>

<style scoped>
th {
  padding: 10px;
  background-color: #fafafa;
}

td {
  padding: 10px;
}
</style>
