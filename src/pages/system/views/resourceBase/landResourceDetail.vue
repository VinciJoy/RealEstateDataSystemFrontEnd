<template>
  <a-row class="mt-40" :gutter="40">
    <a-col style="border: 1px solid transparent" :span="2"></a-col>
    <a-col :span="20">
<!--      head-->
      <a-row class="mt-20 sub-gray-line" :gutter="20" style="height: 200px;">
        <a-col :span="6" style="height: 100%; max-width: 100%; display: flex; justify-content: center">
          <img v-if="itemBaseInfo.coverPicUuid" style="max-width: 100%; max-height: 100%" :src="picBaseURL + itemBaseInfo.coverPicUuid"/>
          <img v-else style="width: 100%; height: 100%" src="../../../../../static/imgs/default-img.jpeg"/>
        </a-col>
        <a-col :span="18" style="height: 100%;">
          <a-col>
            <a-col :span="16">
              <h2>
                {{ itemBaseInfo.title }}
              </h2>
              <p>
                {{ form.subTitle }}
              </p>
            </a-col>
            <a-col class="info-desc-content" style="text-align: right" :span="8">
              <p style="margin-bottom: 0">
                更新时间：{{ itemBaseInfo.updatedAt }}
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
                <img v-for="i in 2" :key="'full_star' + i" src="../../../../../static/imgs/fullstar.png"/>
                <template v-if="finalScore(itemBaseInfo) <= 60">
                  <img src="../../../../../static/imgs/unstar.png"/>
                  <img src="../../../../../static/imgs/unstar.png"/>
                  <img src="../../../../../static/imgs/unstar.png"/>
                </template>
                <template v-if="finalScore(itemBaseInfo) > 60 && finalScore(itemBaseInfo) < 66">
                  <img src="../../../../../static/imgs/halfstar.png"/>
                  <img src="../../../../../static/imgs/unstar.png"/>
                  <img src="../../../../../static/imgs/unstar.png"/>
                </template>
                <template v-else-if="finalScore(itemBaseInfo) >= 66 && finalScore(itemBaseInfo) < 76">
                  <img src="../../../../../static/imgs/fullstar.png"/>
                  <img src="../../../../../static/imgs/unstar.png"/>
                  <img src="../../../../../static/imgs/unstar.png"/>
                </template>
                <template v-else-if="finalScore(itemBaseInfo) >= 76 && finalScore(itemBaseInfo) < 86">
                  <img src="../../../../../static/imgs/fullstar.png"/>
                  <img src="../../../../../static/imgs/halfstar.png"/>
                  <img src="../../../../../static/imgs/unstar.png"/>
                </template>

                <template v-else-if="finalScore(itemBaseInfo) >= 86 && finalScore(itemBaseInfo) < 96">
                  <img src="../../../../../static/imgs/fullstar.png"/>
                  <img src="../../../../../static/imgs/fullstar.png"/>
                  <img src="../../../../../static/imgs/unstar.png"/>
                </template>

                <template v-else-if="finalScore(itemBaseInfo) >= 96 && finalScore(itemBaseInfo) < 101">
                  <img src="../../../../../static/imgs/fullstar.png"/>
                  <img src="../../../../../static/imgs/fullstar.png"/>
                  <img src="../../../../../static/imgs/halfstar.png"/>
                </template>

                <template v-else-if="finalScore(itemBaseInfo) >= 101">
                  <img src="../../../../../static/imgs/fullstar.png"/>
                  <img src="../../../../../static/imgs/fullstar.png"/>
                  <img src="../../../../../static/imgs/fullstar.png"/>
                </template>

                <div style="float: right">
                  <a-button type="primary" v-show="!itemBaseInfo.liked" @click="likeResource"><a-icon type="folder"/>收藏本信息</a-button>
                  <a-button v-show="itemBaseInfo.liked" @click="likeResource"><a-icon type="folder"/>取消收藏</a-button>
                  <a-button @click="showConsultModal" type="primary">我感兴趣</a-button>
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

          <div v-if="selectedTag === 'basic'">
            <a-col>
            <h2 style="font-weight: bolder">项目位置：</h2>
            <baidu-map
              v-if="mapVisible"
              :ak="ak"
              style="width: 600px; height: 400px; display: inline-block"
              mapType="BMAP_HYBRID_MAP"
              :scroll-wheel-zoom="true"
              :center="form.itemMap.center"
              :zoom="form.itemMap.zoom"
            >
              <BaiduNavigation anchor="BMAP_ANCHOR_TOP_RIGHT"></BaiduNavigation>
              <BaiduScale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></BaiduScale>
              <BaiduMapType :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></BaiduMapType>
              <BaiduPolygon :clicking="true" :path="form.itemMap.polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"/>
              <BaiduCircle v-if="form.itemMap.threeCirclePath" :center="form.itemMap.threeCirclePath.center" :radius="form.itemMap.threeCirclePath.radius" stroke-color="blue" :fillColor="''" :stroke-opacity="0.5" :stroke-weight="2"></BaiduCircle>
              <BaiduCircle v-if="form.itemMap.fiveCirclePath" :center="form.itemMap.fiveCirclePath.center" :radius="form.itemMap.fiveCirclePath.radius" stroke-color="blue" :fillColor="''" :stroke-opacity="0.5" :stroke-weight="2"></BaiduCircle>
            </baidu-map>

            <div style="display: inline-block; padding-left: 20px; vertical-align: top">
              <a-row class="mt-20">
                <a-button @click="addThreeCircle('itemMap')" :disabled="form.itemMap.polygonPath.length === 0" type="primary">查看项目周边三公里范围</a-button>
              </a-row>
              <a-row class="mt-20">
                <a-button @click="addFiveCircle('itemMap')" :disabled="form.itemMap.polygonPath.length === 0" type="primary">查看项目周边五公里范围</a-button>
              </a-row>
            </div>
          </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">项目指标信息：</h2>

              <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
              <tr>
                <th :rowspan="(form.itemBaseInfoForm.otherSpace ? form.itemBaseInfoForm.otherSpace.length : 0) + (form.itemBaseInfoForm.itemBaseMode === 'occupy' ? 7 : 6)">地上指标</th>
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
                  <th colspan="4" style="text-align: center">{{ form.itemBaseInfoForm.itemBaseMode === 'occupy' ? '其中——其他建筑面积（m²）' : '其中——其他占地面积（m²）'}}</th>
                </tr>
              <tr :key="'otherSpace' + index" v-for="(item, index) of form.itemBaseInfoForm.otherSpace">
                <th>
                  {{ item[0] }}占地面积（m²）
                </th>
                <td>
                  <span>
                    {{ item[1] | filterUndefined }}
                  </span>
                </td>
                <th>其他容积率</th>
                <td>
                  <span>
                    {{ item[2] | filterUndefined }}
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
                    {{ (form.itemBaseInfoForm.underGroundSpace ? (form.itemBaseInfoForm.underGroundSpace - '' + spaceComputed * form.itemBaseInfoForm.comprehensiveFAR) : '-') | filterUndefined }}
                  </span>
                  <span v-else>
                    {{ (form.itemBaseInfoForm.underGroundSpace - '' + spaceComputed) | filterUndefined }}
                  </span>
                </td>
              </tr>
            </table>

          </a-col>

            <a-col class="mt-20">
              <h2 style="font-weight: bolder">项目现状：</h2>
              <p>{{ form.projectStatus ? form.projectStatus : '暂无项目现状' }}</p>
            </a-col>

            <a-col
              v-if="
              !((!form.landStatusPicList || form.landStatusPicList.length === 0)
              && (!form.streetPicList || form.streetPicList.length === 0)
              && (!form.effectPicList || form.effectPicList.length === 0)
              && (!form.facilityPicList || form.facilityPicList.length === 0)
              && (!form.otherPicList || form.otherPicList.length === 0))" class="mt-20">
              <a-col>
                <h2 style="font-weight: bolder">项目图片资料：</h2>

                <a-row>
                  <a-col class="pic-list-block" v-if="form.landStatusPicList && form.landStatusPicList.length !== 0">
                    <h3 style="font-weight: bolder">
                      地块/项目现状照片
                    </h3>
                    <div class="pic-desc-block" v-for="(pic, index) of form.landStatusPicList" :key="'streetPicList' + index">
                      <div @click="handlePreview(pic)" class="upload-add pic-block">
                        <img class="pic-img" :src="pic.thumbUrl" />
                      </div>
                      <p class="pic-desc">
                        {{ pic.description }}
                      </p>
                    </div>
                  </a-col>

                  <a-col class="pic-list-block" v-if="form.streetPicList && form.streetPicList.length !== 0">
                    <h3 class="pic-title">
                      项目四至现状
                    </h3>
                    <div class="pic-desc-block" v-for="(pic, index) of form.streetPicList" :key="'streetPicList' + index">
                      <div @click="handlePreview(pic)" class="upload-add pic-block">
                        <img class="pic-img" :src="pic.thumbUrl" />
                      </div>
                      <p class="pic-desc">
                        {{ pic.description }}
                      </p>
                    </div>
                  </a-col>

                  <a-col class="pic-list-block" v-if="form.effectPicList && form.effectPicList.length !== 0">
                    <h3 class="pic-title">
                      规划方案及效果图
                    </h3>
                    <div class="pic-desc-block" v-for="(pic, index) of form.effectPicList" :key="'streetPicList' + index">
                      <div @click="handlePreview(pic)" class="upload-add pic-block">
                        <img class="pic-img" :src="pic.thumbUrl" />
                      </div>
                      <p class="pic-desc">
                        {{ pic.description }}
                      </p>
                    </div>
                  </a-col>

                  <a-col class="pic-list-block" v-if="form.facilityPicList && form.facilityPicList.length !== 0">
                    <h3 class="pic-title">
                      周边配套设施
                    </h3>
                    <div class="pic-desc-block" v-for="(pic, index) of form.facilityPicList" :key="'streetPicList' + index">
                      <div @click="handlePreview(pic)" class="upload-add pic-block">
                        <img class="pic-img" :src="pic.thumbUrl" />
                      </div>
                      <p class="pic-desc">
                        {{ pic.description }}
                      </p>
                    </div>
                  </a-col>

                  <a-col class="pic-list-block" v-if="form.otherPicList && form.otherPicList.length !== 0">
                    <h3 class="pic-title">
                      {{ form.otherPicListName ? form.otherPicListName : '其他' }}
                    </h3>
                    <div class="pic-desc-block" v-for="(pic, index) of form.otherPicList" :key="'otherPicList' + index">
                      <div @click="handlePreview(pic)" class="upload-add pic-block">
                        <img class="pic-img" :src="pic.thumbUrl" />
                      </div>
                      <p class="pic-desc">
                        {{ pic.description }}
                      </p>
                    </div>
                  </a-col>

                  <a-modal width="80%" :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                    <img style="width: 100%;-webkit-user-drag: none;" :src="previewImage" />
                  </a-modal>
                </a-row>
              </a-col>
            </a-col>

            <a-row class="mt-20">
            <h2 style="font-weight: bolder">项目进度:</h2>
            <a-tabs type="card">
              <a-tab-pane v-if="!form.showNodeIndex || form.showNodeIndex === 1" key="1" tab="一级开发节点">
                <div style="margin-bottom: 10px" v-for="progress of progressFirstSelected" :key="progress.name">
                  <a-icon type="check-circle" style="color: #0aa679; font-size: 16px"/> {{ progress.name }}
                </div>
                <div v-if="progressFirstSelected.length === 0">
                  一级开发节点暂无进度
                </div>
              </a-tab-pane>
              <a-tab-pane v-if="form.showNodeIndex === 2" key="2" tab="二级开发节点">
                <div v-for="progress of progressSecondSelected" :key="progress.name">
                  <a-icon type="check-circle" style="color: #0aa679; font-size: 16px"/> {{ progress.name }}
                </div>
                <div v-if="progressSecondSelected.length === 0">
                  二级开发节点暂无进度
                </div>
              </a-tab-pane>
              <a-tab-pane v-if="form.showNodeIndex === 3" key="3" tab="其他类项目节点">
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

            <a-row style="color: #a1a1a1" class="mt-20">
              感兴趣的人：
            </a-row>
            <a-row>
              <div style="color: #a1a1a1" v-if="!itemBaseInfo.interestedUserList || !itemBaseInfo.interestedUserList.length">
                暂无
              </div>
              <template v-for="(interest, index) in itemBaseInfo.interestedUserList">
                <img :key="'interest' + index" class="mt-10" :src="interest.Icon ? picBaseURL + interest.Icon : '/static/imgs/default.jpeg'" style="margin-right: 10px;width: 40px;height: 40px;border-radius: 20px"/>
              </template>
            </a-row>
          </div>

          <div v-if="selectedTag === 'review'">
            <div class="mt-20" v-if="!reviewForm || (!reviewForm.keyPoint && !reviewForm.abstract && !reviewForm.advice)">
              <a-empty />
            </div>

            <div v-if="reviewForm.keyPoint">
                <h3 style="font-weight: bolder;">项目关键点提炼：</h3>
                <table style="width: 100%" bordercolor="#e8e8e8" border="2">
                  <tr>
                    <th colspan="4" style="text-align: center">关键点1：项目指标清单</th>
                  </tr>
                  <tr>
                    <th style="width: 25%">项目占地面积（m²）</th>
                    <td style="width: 25%">
                      <span>
                        {{ reviewForm.keyPoint.landSpace | filterUndefined }}
                      </span>
                    </td>
                    <th style="width: 25%">项目综合容积率</th>
                    <td style="width: 25%">
                      <span>
                        {{ reviewForm.keyPoint.comprehensiveFAR | filterUndefined }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>项目总建筑面积（m²）</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.totalSpace | filterUndefined }}
                      </span>
                    </td>
                    <th>项目地上建筑面积（m²）</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.aboveSpace | filterUndefined }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>项目地下建筑面积（m²）</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.underSpace | filterUndefined }}
                      </span>
                    </td>
                    <th>项目地上可售建面（m²）</th>
                    <td>
                      <span>{{ reviewForm.keyPoint.marketableSpace | filterUndefined }}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>项目地上自持建面（m²）</th>
                    <td>
                      <span>{{ reviewForm.keyPoint.controlledSpace | filterUndefined }}</span>
                    </td>
                    <th>项目可售比</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.saleablePercent | filterUndefined }}
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
                    <td style="width: 25%">{{ reviewForm.keyPoint.itemType }}</td>
                    <th style="width: 25%">项目取证进度</th>
                    <td style="width: 25%">123</td>
                  </tr>
                  <tr>
                    <th>项目土地出让时间</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.remiseDate | filterDate }}
                      </span>
                    </td>
                    <th>项目现状评估</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.projectStatus}}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>项目周边及四至评估</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.aroundStatus.join('/') }}
                      </span>
                    </td>
                    <th>项目交易方式</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.exchangeType }}
                      </span>
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
                      {{ reviewForm.keyPoint.totalTransactionAmount | filterUndefined }}
                    </td>
                    <th style="width: 25%">项目土地出让金</th>
                    <td style="width: 25%">
                      <span>
                        {{ reviewForm.keyPoint.landTransferFeeTotal | filterUndefined }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>除土地出让金外有票成本</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.costWithoutLand | filterUndefined }}
                      </span>
                    </td>
                    <th>项目无票溢价</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.benefitWithoutTicket | filterUndefined }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>项目计容楼面价</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.floorPrice | filterUndefined }}
                      </span>
                    </td>
                    <th>项目可售楼面价（单位：元）</th>
                    <td>
                      <span>
                        {{ reviewForm.keyPoint.saleablePrice | filterUndefined }}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

            <div v-if="reviewForm.abstract" class="mt-20">
                <h3 style="font-weight: bolder;">项目专业审查提炼：</h3>
                <table style="width: 100%" bordercolor="#e8e8e8" border="2">
                  <tr>
                    <th style="width: 25%">项目本身审查项类型</th>
                    <td style="width: 25%">
                      <span>
                        {{ reviewForm.abstract.ownAudit }}
                      </span>
                    </td>
                    <th style="width: 25%">项目周边审查项类型</th>
                    <td style="width: 25%">
                      <span>
                        {{ reviewForm.abstract.aroundAudit }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>资产抵押</th>
                    <td>
                      {{ reviewForm.abstract.assetMortgage | filterSelected }}
                    </td>
                    <th>周边是否存在影响施工的不利因素</th>
                    <td>
                      {{ reviewForm.abstract.disadvantageBuilding | filterSelected }}
                    </td>
                  </tr>
                  <tr>
                    <th>股权抵押</th>
                    <td>
                      {{ reviewForm.abstract.sharedMortgage | filterSelected }}
                    </td>
                    <th>周边是否存在引起客户反感的设施并计算实际距离</th>
                    <td>
                      {{ reviewForm.abstract.customerDislike | filterSelected }}
                    </td>
                  </tr>
                  <tr>
                    <th>地块过往是否有引起客户反感的用途</th>
                    <td>
                      {{ reviewForm.abstract.usedCustomerDislike | filterSelected }}
                    </td>
                    <th>周边是否存在辐射影响的设施并计算实际距离</th>
                    <td>
                      {{ reviewForm.abstract.radiationEffect | filterSelected }}
                    </td>
                  </tr>
                   <tr>
                    <th>地块是否存在地质风险</th>
                    <td>
                      {{ reviewForm.abstract.geologicRisk | filterSelected }}
                    </td>
                    <th>周边是否存在空气污染的设施并计算实际距离</th>
                    <td>
                      {{ reviewForm.abstract.airPollution | filterSelected }}
                    </td>
                  </tr>
                   <tr>
                    <th>地块内是否存在需拆迁的建筑物</th>
                    <td>
                      {{ reviewForm.abstract.removal | filterSelected }}
                    </td>
                    <th>周边是否存在噪音污染的设施并计算实际距离</th>
                    <td>
                      {{ reviewForm.abstract.noisePollution | filterSelected }}
                    </td>
                  </tr>
                  <tr>
                    <th>地块内是否存在受保护的历史文物</th>
                    <td>
                      {{ reviewForm.abstract.culturalRelic | filterSelected }}
                    </td>
                    <th>周边是否存在安全隐患设施并计算实际距离</th>
                    <td>
                      {{ reviewForm.abstract.potentialDanger | filterSelected }}
                    </td>
                  </tr>
                  <tr>
                    <th>地块内的市政设施是否存在影响后期居住的缺陷</th>
                    <td>
                      {{ reviewForm.abstract.facilityDisadvantage | filterSelected }}
                    </td>
                    <th>未来3年-4年规划中，地块周边是否出现上述不利因素</th>
                    <td>
                      {{ reviewForm.abstract.disadvantageIn3To4years | filterSelected }}
                    </td>
                  </tr>
                </table>
              </div>

            <div v-if="reviewForm.advice" class="mt-20">
              <h3 style="font-weight: bolder;">项目投资建议：</h3>
              <span style="word-break: break-all">{{ reviewForm.advice }}</span>
            </div>
          </div>
        </a-col>
        <a-col :span="6"></a-col>
      </a-row>
    </a-col>

<!--    modal begin-->
    <a-modal
      v-model="consultModalVisible"
      :maskClosable="false"
      :closable="false"
      okText="确认并提交"
      :confirm-loading="loading"
      @ok="createConsult"
    >
      <a-row>
        <a-col :span="24">
          请您填写如下信息，以便后续工作人员和您取得联系：
        </a-col>
        <a-col :span="12" class="mt-10">
          姓名：<a-input :disabled="true" v-model="consultInfo.name" style="width: 70%"></a-input>
        </a-col>
        <a-col :span="12" class="mt-10">
          电话：<a-input :disabled="true" v-model="consultInfo.phone" style="width: 70%"></a-input>
        </a-col>
        <a-col :span="12" class="mt-10">
          公司：<a-input :disabled="true" v-model="consultInfo.company" style="width: 70%"></a-input>
        </a-col>
        <a-col :span="12" class="mt-10">
          职务：<a-input :disabled="true" v-model="consultInfo.position" style="width: 70%"></a-input>
        </a-col>
        <a-col :span="24" class="mt-10">
          <div>
            对本资源的诉求或疑问：
          </div>
          <a-textarea v-model="consultInfo.desc"></a-textarea>
        </a-col>
        <a-col :span="24" class="mt-10">
          提示：点击“确认并提交”后，摩贝云工作人员会与您联系。摩贝云将不会对您及您所在公司收取任何费用，请您确认通过摩贝云平台了解并有意向推进本项目，点击“确认并提交”按钮。
        </a-col>
      </a-row>
    </a-modal>
<!--    modal end-->
  </a-row>
</template>

<script>
import api from '@system/api/landResource'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BaiduScale from 'vue-baidu-map/components/controls/Scale'
import BaiduMapType from 'vue-baidu-map/components/controls/MapType'
import BaiduPolygon from 'vue-baidu-map/components/overlays/Polygon'
import BaiduCircle from 'vue-baidu-map/components/overlays/Circle'
import BaiduNavigation from 'vue-baidu-map/components/controls/Navigation'
import consultApi from '@system/api/consult'
import {mapGetters} from 'vuex'

export default {
  name: 'landResourceDetail',
  components: {
    BaiduMap,
    BaiduScale,
    BaiduMapType,
    BaiduPolygon,
    BaiduCircle,
    BaiduNavigation
  },
  computed: {
    ...mapGetters(['userInfo']),
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
        if (this.form.itemBaseInfoForm.otherSpace && Array.isArray(this.form.itemBaseInfoForm.otherSpace) && this.form.itemBaseInfoForm.otherSpace.length) {
          for (let item of this.form.itemBaseInfoForm.otherSpace) {
            res += item[1] - ''
          }
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
      picBaseURL: '',
      loading: false,
      reviewForm: {},
      consultModalVisible: false,
      consultInfo: {
        resourceType: 'landResource',
        resourceID: '',
        name: '',
        company: '',
        desc: '',
        phone: '',
        position: ''
      },
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
        score: 0,
        itemType: '',
        updatedAt: '',
        liked: false,
        interestedUserList: []
      }
    }
  },
  filters: {
    filterSelected (data) {
      if (data === undefined || data === null) {
        return '未选择'
      }
      if (data) {
        return '是'
      }
      return '否'
    },
    filterDate (date) {
      let d = new Date(date)
      return d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate()
    },
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
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.picBaseURL = process.env.API_ROOT + '/system/pics/temp/'
      this.consultInfo.resourceID = this.$route.params.id - ''
      api.getLandResource(this.$route.params.id).then((res) => {
        this.mapVisible = false
        this.form = JSON.parse(res.data.data.stringify)
        if (!Array.isArray(this.form.itemBaseInfoForm.otherSpace)) {
          this.form.itemBaseInfoForm.otherSpace = []
        }
        this.reviewForm = JSON.parse(res.data.data.landResource.auditStringify)
        this.itemBaseInfo.updatedAt = res.data.data.landResource.updatedAt
        this.itemBaseInfo.title = res.data.data.landResource.title
        this.itemBaseInfo.recommendation = res.data.data.landResource.recommendation
        this.itemBaseInfo.itemType = res.data.data.landResource.itemType
        this.itemBaseInfo.coverPicUuid = res.data.data.landResource.coverPicUuid
        this.itemBaseInfo.liked = res.data.data.landResource.liked
        this.itemBaseInfo.score = res.data.data.landResource.score
        this.itemBaseInfo.interestedUserList = res.data.data.landResource.interestedUserList

        this.mapVisible = true
      }).catch(res => {
        this.$router.go(-1)
      })
      if (this.userInfo && this.userInfo.certificate) {
        if (this.userInfo.certificate.name) {
          this.consultInfo.name = this.userInfo.certificate.name
        }
        if (this.userInfo.certificate.company) {
          this.consultInfo.company = this.userInfo.certificate.company
        }
        if (this.userInfo.certificate.position) {
          this.consultInfo.position = this.userInfo.certificate.position
        }
      }
    },
    finalScore (item) {
      return (item.score - '') + (item.recommendation - '')
    },
    createConsult () {
      this.loading = true
      consultApi.createConsult(this.consultInfo).then(res => {
        this.$success('提交咨询成功！')
        this.consultModalVisible = false
        this.loading = false
      })
    },
    showConsultModal () {
      this.consultModalVisible = true
    },
    likeResource () {
      api.likeLandResource(this.$route.params.id).then(res => {
        if (this.itemBaseInfo.liked) {
          this.$success('取消收藏成功！')
        } else {
          this.$success('收藏成功！')
        }
        this.itemBaseInfo.liked = !this.itemBaseInfo.liked
      })
    },
    addThreeCircle (map) {
      if (this.form[map].threeCirclePath.radius) {
        this.form[map].threeCirclePath.radius = 0
        return
      }

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
      if (this.form[map].fiveCirclePath.radius) {
        this.form[map].fiveCirclePath.radius = 0
        return
      }

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

.pic-block {
  height: 400px;
  width: 400px;
  justify-content: center;
  cursor: pointer;
  float: none;
}

.pic-desc {
  word-wrap:break-word;
  word-break:break-all;
  overflow: hidden;
}

.pic-desc-block {
  width: 400px;
  text-align: center;
}

.selected {
  color: #40a9ff;
}

th {
  padding: 10px;
  background-color: #fafafa;
}

.pic-img {
  width: 400px;
  height: 400px;
  -webkit-user-drag: none;
  padding: 8px;
}

td {
  padding: 10px;
}

.pic-title {
  font-weight: bolder;
  margin-top: 20px;
}

.pic-list-block {
  width: 400px;
  text-align: center;
  margin: auto;
}
</style>
