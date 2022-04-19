<template>
  <a-row class="mt-40" :gutter="40">
    <a-col style="border: 1px solid transparent" :span="2"></a-col>
    <a-col :span="18">
<!--      引入业态库 begin-->
      <a-col id="引入业态库" :span="24">
        <div>
          <h3 class="blue" style="display: inline-block">引入业态库</h3>
          <span @click="addFormat" class="clickable-txt" style="float: right">[添加]</span>
        </div>
        <div v-for="(format, index) in form.formatList" :key="'format' + index" class="gray-board" style="padding: 10px 20px;">
          <span style="font-weight: bolder">业态{{index + 1}}</span>
          <span @click="form.formatList.remove(format)" style="float: right" class="clickable-txt">[删除]</span>
          <a-row class="mt-10">
            <a-col :span="8">
              业态:
              <a-select @change="() => {format.firstClassProductType = []; format.secondClassProductType = []}" v-model="format.format" placeholder="请选择业态" style="width: 80%">
                <a-select-option v-for="option in FormatOptions" :key="option" :value="option">{{ option }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              一级产品类型:
              <a-select @change="() => {format.secondClassProductType = []}" v-model="format.firstClassProductType" placeholder="请选择一级产品类型" style="width: 60%">
                <a-select-option v-for="option in FirstClassProductType[format.format]" :key="option" :value="option">{{ option }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              二级产品类型:
              <a-select v-model="format.secondClassProductType" placeholder="请选择二级产品类型" style="width: 60%">
                <a-select-option v-for="option in SecondClassProductType[format.firstClassProductType]" :key="option" :value="option">{{ option }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="24" class="mt-10">
              备注:
              <a-input placeholder="请填写备注" v-model="format.desc" style="width: 80%"></a-input>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <!--      引入业态库 end-->

<!--      投资参数及基础信息 begin-->
      <a-col id="投资参数及基础信息" :span="24" class="mt-20">
        <div>
          <h3 class="blue" style="display: inline-block">投资参数及基础信息</h3>
        </div>

        <div>
          <p style="font-weight: bolder">项目时间</p>
          <div>
            <div>
              项目测算时间:
              <a-date-picker v-model="form.investParams.computedDate" />
              <div style="display: inline-block; margin-left: 100px">
                测算年数:
                <a-input v-model="form.investParams.computedYears" @blur="validComputedYears" type="number" style="width: 150px" addon-after="年"></a-input>
              </div>
            </div>

            <div class="mt-10">
              项目自持经营具体时间:
              <a-input v-model="form.investParams.manageMonth" @blur="validInt(form.investParams, 'manageMonth', '项目自持经营具体时间')" type="number" style="width: 150px" addon-after="月"></a-input>
            </div>

            <div class="mt-10">
              项目获取至自持经营开业时间:
              <a-input v-model="form.investParams.beforeManageMonth" @blur="validInt(form.investParams, 'beforeManageMonth', '项目获取至自持经营开业时间')" type="number" style="width: 150px" addon-after="月"></a-input>
            </div>

            <div class="mt-10">
              销售物业管理费率:
              <a-input v-model="form.investParams.manageFeeRate" type="number" addon-after="%" style="width: 150px"></a-input>
            </div>

            <div class="mt-10">
              销售物业营销费率:
              <a-input v-model="form.investParams.marketFeeRate" type="number" addon-after="%" style="width: 150px"></a-input>
            </div>

            <div class="mt-10">
              全项目土地出让金合计:
              <a-input v-model="form.investParams.totalLandFee" type="number" addon-after="万元" style="width: 150px"></a-input>
            </div>

            <div class="mt-10">
              土地使用税收费用地面积单价:
              <a-input v-model="form.investParams.landPrice" type="number" addon-after="元/m²" style="width: 150px"></a-input>
            </div>

            <div class="mt-10">
              Cap Rate:
              <a-input v-model="form.investParams.capRate" type="number" addon-after="%" style="width: 150px"></a-input>
            </div>

            <div class="mt-10">
              全项目拆迁补偿款:
              <a-input v-model="form.investParams.compensation" type="number" addon-after="万元" style="width: 150px"></a-input>
            </div>

            <div class="mt-10">
              市政配套费的(地上)计容单方:
              <a-input v-model="form.investParams.municipalSupportingFee" type="number" addon-after="元/m²" style="width: 150px"></a-input>
            </div>

          </div>
        </div>

        <div class="mt-10">
          <p style="font-weight: bolder">项目财务税务</p>
          <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
              <tr>
                <th rowspan="2">综合回款率</th>
                <th>第一个月</th>
                <th>第二个月</th>
                <th>第三个月</th>
                <th>第四个月</th>
                <th>第五个月</th>
              </tr>
              <tr>
                <td v-for="i in 5" :key="i">
                  <a-input v-model="form.investParams.taxForm.returnedRate[i - 1]" addon-after="%" />
                </td>
              </tr>
              <tr>
                <th rowspan="3">
                  税费预征率/计税毛利率
                </th>
                <th>
                  增值税
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.profitRate.valueAddedTax" addon-after="%" />
                </td>
                <th rowspan="3">
                  税种税率
                </th>
                <th>
                  房产税（从价）
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.taxRate.buildingTaxPrice" addon-after="%" />
                </td>
              </tr>
              <tr>
                <th>
                  土地增值税
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.profitRate.landValueAddedTax" addon-after="%" />
                </td>
                <th>
                  房产税（从租）
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.taxRate.buildingTaxRent" addon-after="%" />
                </td>
              </tr>
              <tr>
                <th>
                  企业所得税
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.profitRate.corporateIncomeTax" addon-after="%" />
                </td>
                <th>
                  契税及印花税
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.taxRate.stampTax" addon-after="%" />
                </td>
              </tr>
              <tr>
                <th rowspan="6">
                  进项税率
                </th>
                <th>
                  一期管理费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.incomeTaxRate.manageFee[0]" addon-after="%" />
                </td>
                <th rowspan="6">
                  取票率
                </th>
                <th>
                  一期管理费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.ticketCollectionRate.manageFee[0]" addon-after="%" />
                </td>
              </tr>
              <tr>
                <th>
                  二期管理费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.incomeTaxRate.manageFee[1]" addon-after="%" />
                </td>
                <th>
                  二期管理费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.ticketCollectionRate.manageFee[1]" addon-after="%" />
                </td>
              </tr>
              <tr>
                <th>
                  三期管理费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.incomeTaxRate.manageFee[2]" addon-after="%" />
                </td>
                <th>
                  三期管理费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.ticketCollectionRate.manageFee[2]" addon-after="%" />
                </td>
              </tr>
              <tr>
                <th>
                  一期营销费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.incomeTaxRate.marketFee[0]" addon-after="%" />
                </td>
                <th>
                  一期营销费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.ticketCollectionRate.marketFee[0]" addon-after="%" />
                </td>
              </tr>
              <tr>
                <th>
                  二期营销费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.incomeTaxRate.marketFee[1]" addon-after="%" />
                </td>
                <th>
                  二期营销费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.ticketCollectionRate.marketFee[1]" addon-after="%" />
                </td>
              </tr>
              <tr>
                <th>
                  三期营销费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.incomeTaxRate.marketFee[2]" addon-after="%" />
                </td>
                <th>
                  三期营销费
                </th>
                <td>
                  <a-input v-model="form.investParams.taxForm.ticketCollectionRate.marketFee[2]" addon-after="%" />
                </td>
              </tr>
            </table>

        </div>

        <div class="mt-10">
          <p style="font-weight: bolder">项目运营节点</p>
          <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
            <tr>
              <th>拿地</th>
              <th>交地</th>
              <td>
                <a-input v-model="form.investParams.projectOperationNode[0]" />
              </td>
              <th>填写从拿地到实际交地之间所需月数，譬如：3</th>
            </tr>
            <tr>
              <th>交地</th>
              <th>开工</th>
              <td>
                <a-input v-model="form.investParams.projectOperationNode[1]" />
              </td>
              <th>填写从交地到实际开工之间所需月数，譬如：4</th>
            </tr>
            <tr>
              <th>开工</th>
              <th>正负零</th>
              <td>
                <a-input v-model="form.investParams.projectOperationNode[2]" />
              </td>
              <th>填写从开工到正负零之间所需月数，譬如：5</th>
            </tr>
            <tr>
              <th>正负零</th>
              <th>二分之一结构</th>
              <td>
                <a-input v-model="form.investParams.projectOperationNode[3]" />
              </td>
              <th>填写从正负零施工到1/2之间所需月数，譬如：6</th>
            </tr>
            <tr>
              <th>二分之一结构</th>
              <th>封顶</th>
              <td>
                <a-input v-model="form.investParams.projectOperationNode[4]" />
              </td>
              <th>填写从1/2到全部封顶之间所需月数，譬如：7</th>
            </tr>
            <tr>
              <th>封顶</th>
              <th>竣工</th>
              <td>
                <a-input v-model="form.investParams.projectOperationNode[5]" />
              </td>
              <th>填写从封顶到全部竣工之间所需月数，譬如：8</th>
            </tr>
            <tr>
              <th>竣工</th>
              <th>交付</th>
              <td>
                <a-input v-model="form.investParams.projectOperationNode[6]" />
              </td>
              <th>填写从竣工到90%交付之间所需月数，譬如：9</th>
            </tr>
          </table>
        </div>

        <div class="mt-10">
          <p style="font-weight: bolder">项目付款比例配置</p>
          <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
            <tr>
              <th>工程节点</th>
              <th>前期费用</th>
              <th>基础设施费</th>
              <th>主体建筑工程费</th>
              <th>主体安装工程费</th>
              <th>公共配套设施费</th>
              <th>开发间接费</th>
              <th>不可预见费</th>
            </tr>
            <tr>
              <th>拿地</th>
              <td><a-input v-model="form.investParams.paymentRate.takeLand[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.takeLand[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.takeLand[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.takeLand[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.takeLand[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.takeLand[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.takeLand[6]" addon-after="%" /></td>
            </tr>
            <tr>
              <th>交地</th>
              <td><a-input v-model="form.investParams.paymentRate.deliverLand[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliverLand[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliverLand[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliverLand[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliverLand[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliverLand[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliverLand[6]" addon-after="%" /></td>
            </tr>
            <tr>
              <th>开工</th>
              <td><a-input v-model="form.investParams.paymentRate.startOperation[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.startOperation[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.startOperation[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.startOperation[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.startOperation[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.startOperation[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.startOperation[6]" addon-after="%" /></td>
            </tr>
             <tr>
              <th>正负零</th>
              <td><a-input v-model="form.investParams.paymentRate.plusMinusZero[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.plusMinusZero[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.plusMinusZero[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.plusMinusZero[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.plusMinusZero[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.plusMinusZero[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.plusMinusZero[6]" addon-after="%" /></td>
            </tr>
            <tr>
              <th>二分之一结构</th>
              <td><a-input v-model="form.investParams.paymentRate.halfStructure[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.halfStructure[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.halfStructure[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.halfStructure[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.halfStructure[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.halfStructure[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.halfStructure[6]" addon-after="%" /></td>
            </tr>
            <tr>
              <th>封顶</th>
              <td><a-input v-model="form.investParams.paymentRate.sealRoof[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.sealRoof[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.sealRoof[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.sealRoof[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.sealRoof[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.sealRoof[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.sealRoof[6]" addon-after="%" /></td>
            </tr>
            <tr>
              <th>竣工</th>
              <td><a-input v-model="form.investParams.paymentRate.completed[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.completed[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.completed[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.completed[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.completed[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.completed[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.completed[6]" addon-after="%" /></td>
            </tr>
            <tr>
              <th>交付</th>
              <td><a-input v-model="form.investParams.paymentRate.deliver[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliver[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliver[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliver[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliver[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliver[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.deliver[6]" addon-after="%" /></td>
            </tr>
            <tr>
              <th>交付后一年</th>
              <td><a-input v-model="form.investParams.paymentRate.after1year[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after1year[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after1year[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after1year[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after1year[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after1year[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after1year[6]" addon-after="%" /></td>
            </tr>
            <tr>
              <th>交付后三年</th>
              <td><a-input v-model="form.investParams.paymentRate.after3year[0]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after3year[1]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after3year[2]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after3year[3]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after3year[4]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after3year[5]" addon-after="%" /></td>
              <td><a-input v-model="form.investParams.paymentRate.after3year[6]" addon-after="%" /></td>
            </tr>

          </table>
        </div>
      </a-col>
<!--      投资参数及基础信息 end-->

<!--设计指标分期填写 begin-->
      <a-col id="设计指标分期填写" :span="24" class="mt-20">
        <div>
          <h3 class="blue" style="display: inline-block">设计指标分期填写</h3>
          <div v-for="i in 3" :key="'design' + i" class="sub-gray-line mt-10">
            <p>
            <span style="font-weight: bolder">{{ i === 1 ? '一' : i === 2 ? '二' : '三' }}期产品</span>
            <span @click="showAddDesignProductModal(i - 1)" class="clickable-txt" style="float: right">[添加]</span>
          </p>
            <a-row v-for="(format, index) in form.formatList" v-if="format.designProduction[i - 1]" :key="index" class="gray-board">
              <a-col :span="24">
                <span @click="deleteFormatDesignProduct(format, i)" style="float: right" class="clickable-txt">[删除]</span>
              </a-col>
            <a-col :span="12">
              <p>
                指标类型：{{ format.designProduction[i - 1].indexType }}
              </p>
              <p>
                业态属性：{{ format.designProduction[i - 1].indexProperty }}
              </p>
              <p>
                总用地指标：{{ format.designProduction[i - 1].landSpace }}
              </p>
            </a-col>
            <a-col :span="12">
              <p>
                指标名称：{{ format.designProduction[i - 1].indexName }}
              </p>
              <p>
                总建面指标：{{ format.designProduction[i - 1].buildingSpace }}
              </p>
              <p>
                总基底指标：{{ format.designProduction[i - 1].baseSpace }}
              </p>
            </a-col>
          </a-row>
          </div>
        </div>
      </a-col>

<!--      modal begin-->
      <a-modal
        :visible="addDesignProductModalVisible"
        @ok="performAddDesignProduct"
        @cancel="addDesignProductModalVisible = false"
      >
        <a-row>
          <a-col class="mt-10" :span="12">
            <p>
              指标类型：
              <a-select placeholder="请选择指标类型" v-model="tempAddDesignProductForm.indexType" style="width: 80%">
                <a-select-option v-for="option in IndexTypeOptions" :key="option" :value="option">{{ option }}</a-select-option>
              </a-select>
            </p>
            <p>
              业态属性：
              <a-select placeholder="请选择业态属性" v-model="tempAddDesignProductForm.indexProperty" style="width: 80%">
                <a-select-option v-for="option in IndexPropertyOptions" :key="option" :value="option">{{ option }}</a-select-option>
              </a-select>
            </p>
            <p>
              总用地指标：
              <a-input v-model="tempAddDesignProductForm.landSpace" style="width: 77%" addon-after="m²"></a-input>
            </p>
          </a-col>
          <a-col class="mt-10" :span="12">
            <p>
              指标名称：
              <a-select placeholder="请选择指标名称" v-model="tempAddDesignProductForm.indexName" style="width: 80%">
                <a-select-option @click="changeDesignProductionObj(item.obj)" v-for="item in IndexNameOptions(tempAddDesignProductForm)" :key="item.name" :value="item.name">{{ item.name }}</a-select-option>
                }
              </a-select>
            </p>
            <p>
              总建面指标：
              <a-input v-model="tempAddDesignProductForm.buildingSpace" style="width: 77%" addon-after="m²"></a-input>
            </p>
            <p>
              总基底指标：
              <a-input v-model="tempAddDesignProductForm.baseSpace" style="width: 77%" addon-after="m²"></a-input>
            </p>
          </a-col>
        </a-row>
      </a-modal>
<!--      modal end-->
<!--设计指标分期填写 end-->

<!--      设计指标整体汇总 begin-->
      <a-col id="设计指标整体汇总" :span="24" class="mt-20">
        <div>
          <h3 class="blue" style="display: inline-block">设计指标整体汇总</h3>
        </div>

        <a-row>
          <a-col :span="12">
              <p>
                待征用地面积：
                <a-input v-model="form.designTotal.unrequisitionLandSpace" style="width: 75%" addon-after="m²"></a-input>
              </p>
              <p>
                建筑限高：
                <a-input v-model="form.designTotal.buildingHeightLimit" style="width: 79%" addon-after="m"></a-input>
              </p>
            <p>
                用地性质：
                <a-select placeholder="请选择用地性质" v-model="form.designTotal.landType" style="width: 80%">
                  <a-select-option v-for="option in LandTypeOptions" :key="option" :value="option">{{ option }}</a-select-option>
                </a-select>
              </p>
            </a-col>
          <a-col :span="12">
              <p>
                建筑密度：
                <a-input v-model="form.designTotal.buildingDensity" style="width: 79%" addon-after="%"></a-input>
              </p>
              <p>
                绿化率：
                <a-input v-model="form.designTotal.greeningRate" style="width: 79%" addon-after="%"></a-input>
              </p>
            </a-col>
        </a-row>
      </a-col>
<!--      设计指标整体汇总 end-->

<!--      目标开发成本 begin-->
      <a-col id="目标开发成本" :span="24" class="mt-20">
        <div>
          <h3 class="blue" style="display: inline-block">目标开发成本</h3>
        </div>
        <div>
          <p style="font-weight: bolder">
            非建安类工程成本
          </p>
          <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
            <tr>
              <th >成本科目（二级+三级）</th>
              <th>进项税率</th>
              <th>取票率</th>
              <th colspan="3">含税建面单方（元/m²）<span style="float: right">（按建筑面积平摊）</span></th>
            </tr>
            <tr>
              <th>前期费用</th>
              <th>——</th>
              <th>——</th>
              <th>一期分摊</th>
              <th>二期分摊</th>
              <th>三期分摊</th>
            </tr>
            <tr>
              <th>勘察测绘及检测费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.testingFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.testingFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.testingFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.testingFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.testingFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>规划设计费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.designFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.designFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.designFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.designFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.designFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>可行性研究费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.feasibilityFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.feasibilityFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.feasibilityFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.feasibilityFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.feasibilityFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>报批报建费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.approvalFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.approvalFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.approvalFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.approvalFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.approvalFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>市政工程费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>七通一平费用</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.connectionsFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.connectionsFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.connectionsFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.connectionsFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.connectionsFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>临时设备费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.temporaryEquipmentFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.temporaryEquipmentFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.temporaryEquipmentFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.temporaryEquipmentFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.temporaryEquipmentFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>经营类管理费用</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.operationFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.operationFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.operationFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.operationFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.operationFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>其他前期费用</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherProphaseFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherProphaseFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherProphaseFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherProphaseFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherProphaseFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>基础设备费</th>
              <th>——</th>
              <th>——</th>
              <th>385.00</th>
              <th>385.00</th>
              <th>385.00</th>
            </tr>
            <tr>
              <th>室外供水系统</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.waterworks.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.waterworks.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.waterworks.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.waterworks.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.waterworks.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>室外电气及高低压供电</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.electric.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.electric.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.electric.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.electric.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.electric.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>室外燃气系统</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.gasSystem.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.gasSystem.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.gasSystem.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.gasSystem.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.gasSystem.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>电视工程费用</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.TVFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.TVFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.TVFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.TVFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.TVFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>电话宽带工程费用</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.telephoneFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.telephoneFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.telephoneFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.telephoneFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.telephoneFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>室外智能化工程费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.intelligentFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.intelligentFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.intelligentFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.intelligentFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.intelligentFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>室外采暖系统</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.heatingFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.heatingFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.heatingFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.heatingFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.heatingFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>中水系统工程费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.reclaimedWaterFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.reclaimedWaterFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.reclaimedWaterFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.reclaimedWaterFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.reclaimedWaterFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>室外雨污工程</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.rainwaterFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.rainwaterFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.rainwaterFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.rainwaterFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.rainwaterFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>景观环境工程费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.landscapeFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.landscapeFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.landscapeFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.landscapeFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.landscapeFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>其他基础设施费用</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherEquipmentFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherEquipmentFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherEquipmentFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherEquipmentFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherEquipmentFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>公共配套设施费</th>
              <th>——</th>
              <th>——</th>
              <th>385.00</th>
              <th>385.00</th>
              <th>385.00</th>
            </tr>
            <tr>
              <th>不可售学校、幼儿园类</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.school.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.school.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.school.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.school.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.school.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>社区、市政用房</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalHouse.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalHouse.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalHouse.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalHouse.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.municipalHouse.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>物业管理用房</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.propertyManagementRoom.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.propertyManagementRoom.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.propertyManagementRoom.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.propertyManagementRoom.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.propertyManagementRoom.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>运动场地</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.sportsGround.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.sportsGround.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.sportsGround.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.sportsGround.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.sportsGround.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>设备用房</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.equipmentRoom.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.equipmentRoom.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.equipmentRoom.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.equipmentRoom.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.equipmentRoom.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>不计容架空层</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.overheadFloor.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.overheadFloor.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.overheadFloor.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.overheadFloor.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.overheadFloor.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>其他配套</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherSupporting.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherSupporting.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherSupporting.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherSupporting.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.otherSupporting.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>开发间接费</th>
              <th>——</th>
              <th>——</th>
              <th>385.00</th>
              <th>385.00</th>
              <th>385.00</th>
            </tr>
            <tr>
              <th>工程管理费/物业完善费/营销设施费等</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.projectManagementFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.projectManagementFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.projectManagementFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.projectManagementFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.projectManagementFee.buildingSpace[2]"></a-input></td>
            </tr>
            <tr>
              <th>不可预见费</th>
              <th>——</th>
              <th>——</th>
              <th>385.00</th>
              <th>385.00</th>
              <th>385.00</th>
            </tr>
            <tr>
              <th>基础预备费</th>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.BasicReserveFee.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.BasicReserveFee.ticketCollectionRate" addon-after="%"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.BasicReserveFee.buildingSpace[0]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.BasicReserveFee.buildingSpace[1]"></a-input></td>
              <td><a-input v-model="form.targetDevelopmentCost.nonConstructionCost.BasicReserveFee.buildingSpace[2]"></a-input></td>
            </tr>
          </table>

          <p class="mt-10" style="font-weight: bolder">
            主体建筑工程成本
          </p>

          <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
            <tr>
              <th colspan="2" rowspan="2">产品业态</th>
              <th style="text-align: center" colspan="9">含税建面单方（元/m²）</th>
            </tr>
            <tr>
              <th>主体建筑工程费合计</th>
              <th>基础工程费</th>
              <th>结构及粗装修</th>
              <th>门窗、栏杆工程</th>
              <th>外立面装饰</th>
              <th>装修成本</th>
              <th>其他主体建筑工程费</th>
              <th>进项税率</th>
              <th>取票率</th>
            </tr>
            <tr v-if="residentClass.length">
              <th :rowspan="residentClass.length">住宅类</th>
              <th>{{ residentClass[0].secondClassProductType.length ? residentClass[0].secondClassProductType : '/' }}</th>
              <th>{{
                  (residentClass[0].basicEngineeringCost - '') +
                  (residentClass[0].structureCost - '') +
                  (residentClass[0].windowCost - '') +
                  (residentClass[0].facadeDecoration - '') +
                  (residentClass[0].decorationCost - '') +
                  (residentClass[0].otherMainConstructionCost - '')
                }}</th>
              <td><a-input type="number" v-model="residentClass[0].basicEngineeringCost"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].structureCost"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].windowCost"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].facadeDecoration"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].decorationCost"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].otherMainConstructionCost"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>
            <tr v-for="(item, index) in residentClass" v-if="index !== 0" :key="'residentClass' + index">
              <th>{{ item.secondClassProductType.length ? item.secondClassProductType : '/' }}</th>
              <th>{{
                  (item.basicEngineeringCost - '') +
                  (item.structureCost - '') +
                  (item.windowCost - '') +
                  (item.facadeDecoration - '') +
                  (item.decorationCost - '') +
                  (item.otherMainConstructionCost - '')
                }}</th>
              <td><a-input type="number" v-model="item.basicEngineeringCost"></a-input></td>
              <td><a-input type="number" v-model="item.structureCost"></a-input></td>
              <td><a-input type="number" v-model="item.windowCost"></a-input></td>
              <td><a-input type="number" v-model="item.facadeDecoration"></a-input></td>
              <td><a-input type="number" v-model="item.decorationCost"></a-input></td>
              <td><a-input type="number" v-model="item.otherMainConstructionCost"></a-input></td>
              <td><a-input type="number" v-model="item.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="item.ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>

            <tr v-if="commercialOfficeClass.length">
              <th :rowspan="commercialOfficeClass.length">商办类</th>
              <th>{{ commercialOfficeClass[0].secondClassProductType.length ? commercialOfficeClass[0].secondClassProductType : '/' }}</th>
              <th>{{
                  (commercialOfficeClass[0].basicEngineeringCost - '') +
                  (commercialOfficeClass[0].structureCost - '') +
                  (commercialOfficeClass[0].windowCost - '') +
                  (commercialOfficeClass[0].facadeDecoration - '') +
                  (commercialOfficeClass[0].decorationCost - '') +
                  (commercialOfficeClass[0].otherMainConstructionCost - '')
                }}</th>
              <td><a-input type="number" v-model="commercialOfficeClass[0].basicEngineeringCost"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].structureCost"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].windowCost"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].facadeDecoration"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].decorationCost"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].otherMainConstructionCost"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>
            <tr v-for="(item, index) in commercialOfficeClass" v-if="index !== 0" :key="'commercialOfficeClass' + index">
              <th>{{ item.secondClassProductType.length ? item.secondClassProductType : '/' }}</th>
              <th>{{
                  (item.basicEngineeringCost - '') +
                  (item.structureCost - '') +
                  (item.windowCost - '') +
                  (item.facadeDecoration - '') +
                  (item.decorationCost - '') +
                  (item.otherMainConstructionCost - '')
                }}</th>
              <td><a-input type="number" v-model="item.basicEngineeringCost"></a-input></td>
              <td><a-input type="number" v-model="item.structureCost"></a-input></td>
              <td><a-input type="number" v-model="item.windowCost"></a-input></td>
              <td><a-input type="number" v-model="item.facadeDecoration"></a-input></td>
              <td><a-input type="number" v-model="item.decorationCost"></a-input></td>
              <td><a-input type="number" v-model="item.otherMainConstructionCost"></a-input></td>
              <td><a-input type="number" v-model="item.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="item.ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>

            <tr v-if="supportingClass.length">
              <th :rowspan="supportingClass.length">配套类/移交类</th>
              <th>{{ supportingClass[0].secondClassProductType.length ? supportingClass[0].secondClassProductType : '/' }}</th>
              <th>{{
                  (supportingClass[0].basicEngineeringCost - '') +
                  (supportingClass[0].structureCost - '') +
                  (supportingClass[0].windowCost - '') +
                  (supportingClass[0].facadeDecoration - '') +
                  (supportingClass[0].decorationCost - '') +
                  (supportingClass[0].otherMainConstructionCost - '')
                }}</th>
              <td><a-input type="number" v-model="supportingClass[0].basicEngineeringCost"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].structureCost"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].windowCost"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].facadeDecoration"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].decorationCost"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].otherMainConstructionCost"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>
            <tr v-for="(item, index) in supportingClass" v-if="index !== 0" :key="'supportingClass' + index">
              <th>{{ item.secondClassProductType.length ? item.secondClassProductType : '/' }}</th>
              <th>{{
                  (item.basicEngineeringCost - '') +
                  (item.structureCost - '') +
                  (item.windowCost - '') +
                  (item.facadeDecoration - '') +
                  (item.decorationCost - '') +
                  (item.otherMainConstructionCost - '')
                }}</th>
              <td><a-input type="number" v-model="item.basicEngineeringCost"></a-input></td>
              <td><a-input type="number" v-model="item.structureCost"></a-input></td>
              <td><a-input type="number" v-model="item.windowCost"></a-input></td>
              <td><a-input type="number" v-model="item.facadeDecoration"></a-input></td>
              <td><a-input type="number" v-model="item.decorationCost"></a-input></td>
              <td><a-input type="number" v-model="item.otherMainConstructionCost"></a-input></td>
              <td><a-input type="number" v-model="item.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="item.ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>

            <tr v-if="underGroundClass.length">
              <th :rowspan="underGroundClass.length">地下产品业态</th>
              <th>{{ underGroundClass[0].secondClassProductType.length ? underGroundClass[0].secondClassProductType : '/' }}</th>
              <th>{{
                  (underGroundClass[0].basicEngineeringCost - '') +
                  (underGroundClass[0].structureCost - '') +
                  (underGroundClass[0].windowCost - '') +
                  (underGroundClass[0].facadeDecoration - '') +
                  (underGroundClass[0].decorationCost - '') +
                  (underGroundClass[0].otherMainConstructionCost - '')
                }}</th>
              <td><a-input type="number" v-model="underGroundClass[0].basicEngineeringCost"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].structureCost"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].windowCost"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].facadeDecoration"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].decorationCost"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].otherMainConstructionCost"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>
            <tr v-for="(item, index) in underGroundClass" v-if="index !== 0" :key="'underGroundClass' + index">
              <th>{{ item.secondClassProductType.length ? item.secondClassProductType : '/' }}</th>
              <th>{{
                  (item.basicEngineeringCost - '') +
                  (item.structureCost - '') +
                  (item.windowCost - '') +
                  (item.facadeDecoration - '') +
                  (item.decorationCost - '') +
                  (item.otherMainConstructionCost - '')
                }}</th>
              <td><a-input type="number" v-model="item.basicEngineeringCost"></a-input></td>
              <td><a-input type="number" v-model="item.structureCost"></a-input></td>
              <td><a-input type="number" v-model="item.windowCost"></a-input></td>
              <td><a-input type="number" v-model="item.facadeDecoration"></a-input></td>
              <td><a-input type="number" v-model="item.decorationCost"></a-input></td>
              <td><a-input type="number" v-model="item.otherMainConstructionCost"></a-input></td>
              <td><a-input type="number" v-model="item.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="item.ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>

          </table>

          <p class="mt-10" style="font-weight: bolder">
            主体安装工程成本
          </p>

          <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
            <tr>
              <th colspan="2" rowspan="2">产品业态</th>
              <th style="text-align: center" colspan="9">含税建面单方（元/m²）</th>
            </tr>
            <tr>
              <th>主体安装工程费合计</th>
              <th>室内水暖气电</th>
              <th>消防系统</th>
              <th>通风空调工程</th>
              <th>电梯供货及安装</th>
              <th>其他主体安装工程费</th>
              <th>进项税率</th>
              <th>取票率</th>
            </tr>

            <tr v-if="residentClass.length">
              <th :rowspan="residentClass.length">住宅类</th>
              <th>{{ residentClass[0].secondClassProductType.length ? residentClass[0].secondClassProductType : '/' }}</th>
              <th>{{
                  (residentClass[0].waterElectricity - '') +
                  (residentClass[0].fireFighting - '') +
                  (residentClass[0].airConditional - '') +
                  (residentClass[0].elevator - '') +
                  (residentClass[0].otherMainBodyCost - '')
                }}</th>
              <td><a-input type="number" v-model="residentClass[0].waterElectricity"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].fireFighting"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].airConditional"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].elevator"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].otherMainBodyCost"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].bodyIncomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="residentClass[0].bodyTicketCollectionRate" addon-after="%"></a-input></td>
            </tr>
            <tr v-for="(item, index) in residentClass" v-if="index !== 0" :key="'bodyResidentClass' + index">
              <th>{{ item.secondClassProductType.length ? item.secondClassProductType : '/' }}</th>
              <th>{{
                  (item.waterElectricity - '') +
                  (item.fireFighting - '') +
                  (item.airConditional - '') +
                  (item.elevator - '') +
                  (item.otherMainBodyCost - '')
                }}</th>
              <td><a-input type="number" v-model="item.waterElectricity"></a-input></td>
              <td><a-input type="number" v-model="item.fireFighting"></a-input></td>
              <td><a-input type="number" v-model="item.airConditional"></a-input></td>
              <td><a-input type="number" v-model="item.elevator"></a-input></td>
              <td><a-input type="number" v-model="item.otherMainBodyCost"></a-input></td>
              <td><a-input type="number" v-model="item.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="item.ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>

            <tr v-if="commercialOfficeClass.length">
              <th :rowspan="commercialOfficeClass.length">商办类</th>
              <th>{{ commercialOfficeClass[0].secondClassProductType.length ? commercialOfficeClass[0].secondClassProductType : '/' }}</th>
              <th>{{
                  (commercialOfficeClass[0].waterElectricity - '') +
                  (commercialOfficeClass[0].fireFighting - '') +
                  (commercialOfficeClass[0].airConditional - '') +
                  (commercialOfficeClass[0].elevator - '') +
                  (commercialOfficeClass[0].otherMainBodyCost - '')
                }}</th>
              <td><a-input type="number" v-model="commercialOfficeClass[0].waterElectricity"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].fireFighting"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].airConditional"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].elevator"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].otherMainBodyCost"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].bodyIncomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="commercialOfficeClass[0].bodyTicketCollectionRate" addon-after="%"></a-input></td>
            </tr>
            <tr v-for="(item, index) in commercialOfficeClass" v-if="index !== 0" :key="'bodyCommercialOfficeClass' + index">
              <th>{{ item.secondClassProductType.length ? item.secondClassProductType : '/' }}</th>
              <th>{{
                  (item.waterElectricity - '') +
                  (item.fireFighting - '') +
                  (item.airConditional - '') +
                  (item.elevator - '') +
                  (item.otherMainBodyCost - '')
                }}</th>
              <td><a-input type="number" v-model="item.waterElectricity"></a-input></td>
              <td><a-input type="number" v-model="item.fireFighting"></a-input></td>
              <td><a-input type="number" v-model="item.airConditional"></a-input></td>
              <td><a-input type="number" v-model="item.elevator"></a-input></td>
              <td><a-input type="number" v-model="item.otherMainBodyCost"></a-input></td>
              <td><a-input type="number" v-model="item.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="item.ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>

            <tr v-if="supportingClass.length">
              <th :rowspan="supportingClass.length">配套类/移交类</th>
              <th>{{ supportingClass[0].secondClassProductType.length ? supportingClass[0].secondClassProductType : '/' }}</th>
              <th>{{
                  (supportingClass[0].waterElectricity - '') +
                  (supportingClass[0].fireFighting - '') +
                  (supportingClass[0].airConditional - '') +
                  (supportingClass[0].elevator - '') +
                  (supportingClass[0].otherMainBodyCost - '')
                }}</th>
              <td><a-input type="number" v-model="supportingClass[0].waterElectricity"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].fireFighting"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].airConditional"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].elevator"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].otherMainBodyCost"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].bodyIncomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="supportingClass[0].bodyTicketCollectionRate" addon-after="%"></a-input></td>
            </tr>
            <tr v-for="(item, index) in supportingClass" v-if="index !== 0" :key="'bodySupportingClass' + index">
              <th>{{ item.secondClassProductType.length ? item.secondClassProductType : '/' }}</th>
              <th>{{
                  (item.waterElectricity - '') +
                  (item.fireFighting - '') +
                  (item.airConditional - '') +
                  (item.elevator - '') +
                  (item.otherMainBodyCost - '')
                }}</th>
              <td><a-input type="number" v-model="item.waterElectricity"></a-input></td>
              <td><a-input type="number" v-model="item.fireFighting"></a-input></td>
              <td><a-input type="number" v-model="item.airConditional"></a-input></td>
              <td><a-input type="number" v-model="item.elevator"></a-input></td>
              <td><a-input type="number" v-model="item.otherMainBodyCost"></a-input></td>
              <td><a-input type="number" v-model="item.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="item.ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>

            <tr v-if="underGroundClass.length">
              <th :rowspan="underGroundClass.length">地下产品业态</th>
              <th>{{ underGroundClass[0].secondClassProductType.length ? underGroundClass[0].secondClassProductType : '/' }}</th>
              <th>{{
                  (underGroundClass[0].waterElectricity - '') +
                  (underGroundClass[0].fireFighting - '') +
                  (underGroundClass[0].airConditional - '') +
                  (underGroundClass[0].elevator - '') +
                  (underGroundClass[0].otherMainBodyCost - '')
                }}</th>
              <td><a-input type="number" v-model="underGroundClass[0].waterElectricity"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].fireFighting"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].airConditional"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].elevator"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].otherMainBodyCost"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].bodyIncomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="underGroundClass[0].bodyTicketCollectionRate" addon-after="%"></a-input></td>
            </tr>
            <tr v-for="(item, index) in underGroundClass" v-if="index !== 0" :key="'bodyUnderGroundClass' + index">
              <th>{{ item.secondClassProductType.length ? item.secondClassProductType : '/' }}</th>
              <th>{{
                  (item.waterElectricity - '') +
                  (item.fireFighting - '') +
                  (item.airConditional - '') +
                  (item.elevator - '') +
                  (item.otherMainBodyCost - '')
                }}</th>
              <td><a-input type="number" v-model="item.waterElectricity"></a-input></td>
              <td><a-input type="number" v-model="item.fireFighting"></a-input></td>
              <td><a-input type="number" v-model="item.airConditional"></a-input></td>
              <td><a-input type="number" v-model="item.elevator"></a-input></td>
              <td><a-input type="number" v-model="item.otherMainBodyCost"></a-input></td>
              <td><a-input type="number" v-model="item.incomeTaxRate" addon-after="%"></a-input></td>
              <td><a-input type="number" v-model="item.ticketCollectionRate" addon-after="%"></a-input></td>
            </tr>

          </table>
        </div>
      </a-col>
<!--      目标开发成本 end-->

<!--      租售指标分解 begin-->
      <a-col id="租售指标分解" :span="24" class="mt-20">
        <div>
          <h3 class="blue" style="display: inline-block">租售指标分解</h3>
          <a-row class="mt-10" v-for="(format, index) in form.formatList" v-if="(!excludeRentalSaleList.includes(format.secondClassProductType))&&(format.designProduction[0] || format.designProduction[1] || format.designProduction[2])" :key="'rentOrBuy' + index">
            <a-col style="font-weight: bolder" :span="6">
              {{ format.secondClassProductType }}可售销售率
            </a-col>
            <a-col v-if="format.designProduction[0]" :span="6">
              一期 <a-input v-model="format.designProduction[0].rentalSaleIndex" style="width: 70%" addon-after="%"></a-input>
            </a-col>
            <a-col v-if="format.designProduction[1]" :span="6">
              二期 <a-input v-model="format.designProduction[1].rentalSaleIndex" style="width: 70%" addon-after="%"></a-input>
            </a-col>
            <a-col v-if="format.designProduction[2]" :span="6">
              三期 <a-input v-model="format.designProduction[2].rentalSaleIndex" style="width: 70%" addon-after="%"></a-input>
            </a-col>
          </a-row>
        </div>
      </a-col>
<!--      租售指标分解 end-->

<!--      销售量价方案 begin-->
      <a-col id="销售量价方案" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">销售量价方案</h3>
        <div class="sub-gray-line mt-10" v-for="(format, index) in form.formatList" v-if="(!excludeRentalSaleList.includes(format.secondClassProductType))&&(format.designProduction[0] || format.designProduction[1] || format.designProduction[2])" :key="'soldPrice' + index">
          <p style="font-weight: bolder">
            {{ format.secondClassProductType }}
          </p>
          <template v-if="format.designProduction[0]">
            <p style="font-weight: bolder" class="gray">
            一期销售定价
          </p>
            <a-row>
            <a-col :span="12">
              <p>
                现时点毛坯价格
                <a-input v-model="format.designProduction[0].blankPrice" style="width: 70%" addon-after="（元/m²）/（元/个）"></a-input>
              </p>
              <p>
                年均涨幅
                <a-input v-model="format.designProduction[0].averageAnnualGrowth" style="width: 73%"></a-input>
              </p>
            </a-col>
            <a-col :span="12">
              精装加价
              <a-input v-model="format.designProduction[0].markup" style="width: 70%" addon-after="元/m²"></a-input>
            </a-col>
          </a-row>
          </template>
          <template v-if="format.designProduction[1]">
            <p style="font-weight: bolder" class="gray">
            二期销售定价
          </p>
            <a-row>
            <a-col :span="12">
              <p>
                现时点毛坯价格
                <a-input v-model="format.designProduction[1].blankPrice" style="width: 70%" addon-after="（元/m²）/（元/个）"></a-input>
              </p>
              <p>
                年均涨幅
                <a-input v-model="format.designProduction[1].averageAnnualGrowth" style="width: 73%"></a-input>
              </p>
            </a-col>
            <a-col :span="12">
              精装加价
              <a-input v-model="format.designProduction[1].markup" style="width: 70%" addon-after="元/m²"></a-input>
            </a-col>
          </a-row>
          </template>
          <template v-if="format.designProduction[2]">
            <p style="font-weight: bolder" class="gray">
            三期销售定价
          </p>
            <a-row>
            <a-col :span="12">
              <p>
                现时点毛坯价格
                <a-input v-model="format.designProduction[2].blankPrice" style="width: 70%" addon-after="（元/m²）/（元/个）"></a-input>
              </p>
              <p>
                年均涨幅
                <a-input v-model="format.designProduction[2].averageAnnualGrowth" style="width: 73%"></a-input>
              </p>
            </a-col>
            <a-col :span="12">
              精装加价
              <a-input v-model="format.designProduction[2].markup" style="width: 70%" addon-after="元/m²"></a-input>
            </a-col>
          </a-row>
          </template>
        </div>
      </a-col>
<!--      销售量价方案 end-->

<!--项目进度 begin-->
      <a-col v-if="processVisible" id="项目进度" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">项目进度</h3>
        <div class="sub-gray-line mt-10" v-for="(format, index) in form.formatList" v-if="(!excludeRentalSaleList.includes(format.secondClassProductType))&&(format.designProduction[0] || format.designProduction[1] || format.designProduction[2])" :key="'process' + index">
          <p style="font-weight: bolder">{{ format.secondClassProductType }}销售进度</p>
          <div :key="'processDuration' + k" v-for="k in 3" v-if="format.designProduction[k - 1]" class="gray-board">
            <p class="gray" style="font-weight: bolder">
              {{ k === 1 ? '一' : k === 2 ? '二' : '三' }}期销售进度
              <span style="float: right">开始时间：
                <a-month-picker @change="() => {processVisible=false; processVisible=true}" v-model="format.designProduction[k - 1].beginTime" />
                <span @click="() => {processVisible=false; format.designProduction[k - 1].soldProcess.push(0); processVisible=true}" class="clickable-txt" style="margin-left: 10px">添加月份</span>
                <span @click="() => {processVisible=false; format.designProduction[k - 1].soldProcess.pop(); processVisible=true}" class="clickable-txt" style="margin-left: 10px">删除月份</span>
              </span>
            </p>
            <a-row v-for="i in processYears(format, k - 1)" :key="'soldProcess' + i" v-if="format.designProduction[k - 1].beginTime">
              <a-col style="margin-top: 10px" :span="3">{{ format.designProduction[k - 1].beginTime.format('YYYY') - '' + i - 1 }}年</a-col>
              <a-col v-if="i - 1 === 0" :span="21">
                <a-col :key="'soldProcess' + i + 'month' + j" v-if="(j - 1) < format.designProduction[k - 1].soldProcess.length" v-for="j in (12 - format.designProduction[k - 1].beginTime.toObject().months)" style="margin-top: 10px" :span="4">
                {{ format.designProduction[k - 1].beginTime.toObject().months + j }}月
                <a-input @change="() => {processVisible=false; processVisible=true}" v-model="format.designProduction[k - 1].soldProcess[j - 1]" style="width: 70%" addon-after="%"></a-input>
              </a-col>
              </a-col>
              <a-col v-else :span="21">
                <a-col :key="'soldProcess' + i + 'month' + j" v-if="((12 - format.designProduction[k - 1].beginTime.toObject().months) + 12 * (i - 2) + j - 1) < format.designProduction[k - 1].soldProcess.length" v-for="j in 12" style="margin-top: 10px" :span="4">
                  {{ j }}月
                  <a-input @change="() => {processVisible=false; processVisible=true}" v-model="format.designProduction[k - 1].soldProcess[ (12 - format.designProduction[k - 1].beginTime.toObject().months) + 12 * (i - 2) + j - 1]" style="width: 70%" addon-after="%"></a-input>
                </a-col>
              </a-col>
            </a-row>
          </div>

        </div>
      </a-col>
<!--项目进度 end-->

<!--      自持物业主营业务收入 begin-->
      <a-col id="自持物业主营业务收入" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">自持物业主营业务收入</h3>
        <p style="font-weight: bolder">自持物业主营业务经营方案</p>

        <div v-for="(format, index) in form.formatList" class="sub-gray-line mt-10" :key="'mainIncome' + index">
          <p style="font-weight: bolder" class="gray">{{ format.secondClassProductType }}</p>
          <a-row>
            <a-col :span="12">
              <p>
                实际经营率
                <a-input v-model="format.actualOperatingRate" style="width: 70%" addon-after="%"></a-input>
              </p>
              <p>
                市场单价三年涨幅率
                <a-input v-model="format.threeYearIncreaseRate" style="width: 61%" addon-after="%"></a-input>
              </p>
              <p>
                每年入住涨幅率
                <a-input v-model="format.eachYearIncreaseRate" style="width: 65%" addon-after="%"></a-input>
              </p>
            </a-col>
            <a-col :span="12">
              <p>
                现时点市场含税经营单价
                <a-input v-model="format.marketPrice" style="width: 63%" addon-after="（元/m²/天）/（元/个/天）"></a-input>
              </p>
              <p>
                开业起始入住率
                <a-input v-model="format.occupancyRate" style="width: 71%" addon-after="%"></a-input>
              </p>
              <p>
                最高出入住率
                <a-input v-model="format.maxOccupancyRate" style="width: 73%" addon-after="%"></a-input>
              </p>
            </a-col>
          </a-row>
        </div>

        <div class="mt-10">
          <p>
            <span style="font-weight: bolder">各业态主营业务额</span>
            <span class="gray">（点击查看涨幅具体信息）</span>
          </p>
          <div>
            <p style="font-weight: bolder" class="gray">
              独栋别墅（三层）
            </p>
            <p>
              经营单价
              <a-radio-group class="ml-10" :default-value="1">
                <a-radio :value="1">
                  规律涨幅
                </a-radio>
                <a-radio :value="2">
                  自定义涨幅
                </a-radio>
              </a-radio-group>
            </p>
            <p>
              经营入住率
              <a-radio-group class="ml-10" :default-value="1">
                <a-radio :value="1">
                  规律涨幅
                </a-radio>
                <a-radio :value="2">
                  自定义涨幅
                </a-radio>
              </a-radio-group>
            </p>
          </div>
        </div>
      </a-col>
<!--      自持物业主营业务收入 end-->

<!--      自持物业非主营业务收入 begin-->
      <a-col id="自持物业非主营业务收入" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">自持物业非主营业务收入</h3>
        <p>
          <span style="font-weight: bolder">
            物业服务含税收入
          </span>
          <span class="ml-10 clickable-txt">
            增值服务含税收入
          </span>
          <span class="ml-10 clickable-txt">
            场地租赁含税收入
          </span>
          <span class="ml-10 clickable-txt">
            拓展广告含税收入
          </span>
           <span class="ml-10 clickable-txt">
            其他业务收入
          </span>
        </p>
        <div class="gray-board">
          <p>
            <a-radio-group :default-value="1">
              <a-radio :value="1">
                详细计算
              </a-radio>
              <a-radio :value="2">
                简化估算
              </a-radio>
            </a-radio-group>
            <span class="clickable-txt" style="float: right">内容说明</span>
          </p>
          <a-row>
            <a-col :span="12">
              <p>
                已入住的租赁建面
                <a-input style="width: 70%"></a-input>
              </p>
              <p>
                主营租赁收入
                <a-input style="width: 76%"></a-input>
              </p>
            </a-col>
            <a-col :span="12">
              <p>
                现时点市场含税经营单价
                <a-input style="width: 60%" addon-after="(元/m²/天)/(元/个/天)"></a-input>
              </p>
              <p>
                单价计算率
                <a-input style="width: 80%" addon-after="%"></a-input>
              </p>
            </a-col>
          </a-row>
        </div>
      </a-col>
<!--      自持物业非主营业务收入 end-->

<!--      自持物业运营成本 begin-->
      <a-col id="自持物业运营成本" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">自持物业运营成本</h3>
        <p>
          <span class="blue">
            运营开办费用
          </span>
          <span class="clickable-txt ml-10">
            宣传推广费用
          </span>
        </p>
        <p>
          <span>
            营运相关费用：
          </span>
          <span class="pl-10 clickable-txt">人工费用</span>
          <span class="pl-10 clickable-txt">工程维保费</span>
          <span class="pl-10 clickable-txt">能耗费</span>
          <span class="pl-10 clickable-txt">行政办</span>
          <span class="pl-10 clickable-txt">公费</span>
          <span class="pl-10 clickable-txt">绿化管理费</span>
          <span class="pl-10 clickable-txt">清洁卫生费</span>
          <span class="pl-10 clickable-txt">安保费用</span>
          <span class="pl-10 clickable-txt">物业管理/代理佣金</span>
          <span class="pl-10 clickable-txt">IT、信息化服务费</span>
          <span class="pl-10 clickable-txt">物管企业服务费</span>
          <span class="pl-10 clickable-txt">保险费</span>
          <span class="pl-10 clickable-txt">不可预见费</span>
        </p>
        <div class="gray-board">
          <p>
            <a-radio-group :default-value="1">
              <a-radio :value="1">
                详细计算
              </a-radio>
              <a-radio :value="2">
                简化估算
              </a-radio>
            </a-radio-group>
            <span style="float: right" class="clickable-txt">内容说明</span>
          </p>
          <a-row>
            <a-col :span="12">
              可租赁建面
              <a-input style="width: 70%"></a-input>
            </a-col>
            <a-col :span="12">
              含税收费单价
              <a-input style="width: 70%" addon-after="元/m²"></a-input>
            </a-col>
          </a-row>
          <a-row class="mt-10">
            <a-col :span="8">
              运营期费用进项税率
              <a-input style="width: 50%" addon-after="%"></a-input>
            </a-col>
            <a-col :span="8">
              费用取票率
              <a-input style="width: 50%" addon-after="%"></a-input>
            </a-col>
            <a-col :span="8">
              单价计算率
              <a-input style="width: 50%" addon-after="%"></a-input>
            </a-col>
          </a-row>
        </div>

        <p class="mt-10" style="font-weight: bolder">
          自持物业翻修期成本费用
        </p>

        <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
          <tr>
            <th>物业类型</th>
            <th>翻修间隔年限(年)</th>
            <th>翻修比例</th>
            <th>翻修含税建面单方(元/m²)</th>
            <th>进项税率</th>
            <th>翻修取票率</th>
          </tr>
          <tr>
            <th>别墅产品类</th>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
          </tr>
          <tr>
            <th>多层洋房类</th>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
          </tr>
          <tr>
            <th>高层产品类</th>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
          </tr>
          <tr>
            <th>公寓产品类</th>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
          </tr>
          <tr>
            <th>商业产品类</th>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
          </tr>
          <tr>
            <th>酒店产品类</th>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
          </tr>
          <tr>
            <th>写字楼产品类</th>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
          </tr>
          <tr>
            <th>其他产品类</th>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
            <td><a-input addon-after="%"></a-input></td>
          </tr>
        </table>
        <p class="mt-10" style="font-weight: bolder">
          自持物业成本费用折旧摊销参数
        </p>
        <a-row>
          <a-col :span="6">
            土地成本：
          </a-col>
          <a-col :span="6">
            折旧净残值率
            <a-input style="width: 50%" addon-after="%"></a-input>
          </a-col>
          <a-col :span="6">
            折旧年限
            <a-input style="width: 50%" addon-after="年"></a-input>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="6">
            建设工程成本：
          </a-col>
          <a-col :span="6">
            折旧净残值率
            <a-input style="width: 50%" addon-after="%"></a-input>
          </a-col>
          <a-col :span="6">
            折旧年限
            <a-input style="width: 50%" addon-after="年"></a-input>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="6">
            翻修成本：
          </a-col>
          <a-col :span="6">
            折旧净残值率
            <a-input style="width: 50%" addon-after="%"></a-input>
          </a-col>
          <a-col :span="6">
            折旧年限
            <a-input style="width: 50%" addon-after="年"></a-input>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="6">
            其他摊销费用：
          </a-col>
          <a-col :span="6">
            含税成本金额
            <a-input style="width: 50%" addon-after="万元"></a-input>
          </a-col>
          <a-col :span="6">
            折旧净残值率
            <a-input style="width: 50%" addon-after="%"></a-input>
          </a-col>
          <a-col :span="6">
            折旧年限
            <a-input style="width: 50%" addon-after="年"></a-input>
          </a-col>
        </a-row>
      </a-col>
<!--      自持物业运营成本 end-->

<!--      开发关键节点计划 begin-->
      <a-col id="开发关键节点计划" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">开发关键节点计划</h3>
        <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
          <tr>
            <th style="width: 80px" rowspan="2">一期</th>
            <th rowspan="2">各批次最早日期</th>
            <th rowspan="2">各批次最晚日期</th>
            <th colspan="3">非自持业态</th>
            <th colspan="3">自持业态</th>
          </tr>
          <tr>
            <th>第一批次</th>
            <th>第二批次</th>
            <th>第三批次</th>
            <th>第一批次</th>
            <th>第二批次</th>
            <th>第三批次</th>
          </tr>
          <tr>
            <th>各批次面积合计</th>
            <th style="text-align: center" colspan="2">100%</th>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
          </tr>
          <tr>
            <th>拿地</th>
            <th>2022/1/5</th>
            <th>2022/3/7</th>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
          </tr>
        </table>

        <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
          <tr>
            <th style="width: 80px" rowspan="2">二期</th>
            <th rowspan="2">各批次最早日期</th>
            <th rowspan="2">各批次最晚日期</th>
            <th colspan="3">非自持业态</th>
            <th colspan="3">自持业态</th>
          </tr>
          <tr>
            <th>第一批次</th>
            <th>第二批次</th>
            <th>第三批次</th>
            <th>第一批次</th>
            <th>第二批次</th>
            <th>第三批次</th>
          </tr>
          <tr>
            <th>各批次面积合计</th>
            <th style="text-align: center" colspan="2">100%</th>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
          </tr>
          <tr>
            <th>拿地</th>
            <th>2022/1/5</th>
            <th>2022/3/7</th>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
          </tr>
        </table>

        <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
          <tr>
            <th style="width: 80px" rowspan="2">三期</th>
            <th rowspan="2">各批次最早日期</th>
            <th rowspan="2">各批次最晚日期</th>
            <th colspan="3">非自持业态</th>
            <th colspan="3">自持业态</th>
          </tr>
          <tr>
            <th>第一批次</th>
            <th>第二批次</th>
            <th>第三批次</th>
            <th>第一批次</th>
            <th>第二批次</th>
            <th>第三批次</th>
          </tr>
          <tr>
            <th>各批次面积合计</th>
            <th style="text-align: center" colspan="2">100%</th>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
            <td><a-input addon-after="%" /></td>
          </tr>
          <tr>
            <th>拿地</th>
            <th>2022/1/5</th>
            <th>2022/3/7</th>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
            <td><a-input /></td>
          </tr>
        </table>

        <p class="mt-10" style="font-weight: bolder">
          土地成本付款进度（销售 + 自持）
        </p>
        <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
          <tr>
            <th colspan="2">分期</th>
            <th>土地付款批次</th>
            <th>进度</th>
          </tr>
          <tr>
            <th rowspan="6">一期</th>
            <th rowspan="3">非自持业态</th>
            <th>第一批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第二批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第三批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th rowspan="3">自持业态</th>
            <th>第一批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第二批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第三批次</th>
            <td>填写进度</td>
          </tr>
        </table>
        <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
          <tr>
            <th colspan="2">分期</th>
            <th>土地付款批次</th>
            <th>进度</th>
          </tr>
          <tr>
            <th rowspan="6">二期</th>
            <th rowspan="3">非自持业态</th>
            <th>第一批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第二批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第三批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th rowspan="3">自持业态</th>
            <th>第一批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第二批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第三批次</th>
            <td>填写进度</td>
          </tr>
        </table>
        <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
          <tr>
            <th colspan="2">分期</th>
            <th>土地付款批次</th>
            <th>进度</th>
          </tr>
          <tr>
            <th rowspan="6">三期</th>
            <th rowspan="3">非自持业态</th>
            <th>第一批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第二批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第三批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th rowspan="3">自持业态</th>
            <th>第一批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第二批次</th>
            <td>填写进度</td>
          </tr>
          <tr>
            <th>第三批次</th>
            <td>填写进度</td>
          </tr>
        </table>
      </a-col>
<!--      开发关键节点计划 end-->

<!--      销售物业增值税费计算 begin-->
      <a-col id="销售物业增值税费计算" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">销售物业增值税费计算</h3>
        <a-row>
          <a-col :span="12">
            土地成本在地上业态中的分摊方式
          </a-col>
          <a-col :span="6">
            <a-radio :value="1">
              建筑面积
            </a-radio>
          </a-col>
          <a-col :span="6">
            <a-radio :value="2">
              占地面积
            </a-radio>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="12">
            人防车库成本是否可以计入土增税抵扣成本
          </a-col>
          <a-col :span="6">
            <a-radio :value="1">
              是
            </a-radio>
          </a-col>
          <a-col :span="6">
              <a-radio :value="2">
                否
              </a-radio>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="12">
            非人防车库成本是否可以计入土增税抵扣成本
          </a-col>
          <a-col :span="6">
            <a-radio :value="1">
              是
            </a-radio>
          </a-col>
          <a-col :span="6">
            <a-radio :value="2">
              否
            </a-radio>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="12">
            楼座地下室成本是否可以计入土增税抵扣成本
          </a-col>
          <a-col :span="6">
            <a-radio :value="1">
              是
            </a-radio>
          </a-col>
          <a-col :span="6">
            <a-radio :value="2">
              否
            </a-radio>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="12">
            非人防车库面积是否可以视为可售
          </a-col>
          <a-col :span="6">
            <a-radio :value="1">
              是
            </a-radio>
          </a-col>
          <a-col :span="6">
            <a-radio :value="2">
              否
            </a-radio>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="12">
            楼座地下室面积是否可以视为可售
          </a-col>
          <a-col :span="6">
            <a-radio :value="1">
              是
            </a-radio>
          </a-col>
          <a-col :span="6">
            <a-radio :value="2">
              否
            </a-radio>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="12">
            是否可以实现退税
          </a-col>
          <a-col :span="6">
            <a-radio :value="1">
              是
            </a-radio>
          </a-col>
          <a-col :span="6">
            <a-radio :value="2">
              否
            </a-radio>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="12">
            业态采用的分类方式
          </a-col>
          <a-col :span="6">
            <a-radio :value="1">
              三分法
            </a-radio>
          </a-col>
          <a-col :span="6">
            <a-radio :value="2">
              二分法
            </a-radio>
          </a-col>
        </a-row>
      </a-col>
<!--      销售物业增值税费计算 end-->

<!--      持有转售专项计算 begin-->
      <a-col id="持有转售专项计算" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">持有转售专项计算</h3>
        <a-row>
          <a-col :span="6">
            独栋别墅（三层）
          </a-col>
          <a-col :span="6">
            转售率
            <a-input style="width: 60%" addon-after="%"></a-input>
          </a-col>
        </a-row>
        <a-row class="mt-10">
          <a-col :span="6">
            类独别墅
          </a-col>
          <a-col :span="6">
            转售率
            <a-input style="width: 60%" addon-after="%"></a-input>
          </a-col>
        </a-row>
        <p style="font-weight: bolder">项目销售进度</p>
        <p>
          独栋别墅（三层）
          <span style="float: right" class="clickable-txt">
            编辑进度表
          </span>
        </p>
        <p>
          类独别墅
          <span style="float: right" class="clickable-txt">
            编辑进度表
          </span>
        </p>
        <a-row>
          <a-col :span="12">土增税计算分类方式选择</a-col>
          <a-col :span="4">
            <a-radio>
              三分法
            </a-radio>
          </a-col>
          <a-col :span="4">
            <a-radio>
              二分法
            </a-radio>
          </a-col>
        </a-row>
      </a-col>
<!--      持有转售专项计算 end-->

<!--      销售物业融资计划 begin-->
      <a-col id="销售物业融资计划" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">销售物业融资计划</h3>
        <p style="font-weight: bolder">销售物业融资参数</p>
        <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
          <tr>
            <th rowspan="3">内部融资</th>
            <th>融资通道1：计息股东借款</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道2：内部基金融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道3：总包贴息融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th rowspan="4">外部融资</th>
            <th>融资通道1：开发贷款</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道2：前端融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道3：外部信托资金融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道4：其他外部融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
        </table>

        <p class="mt-10" style="font-weight: bolder">
          销售物业内部融资计划
        </p>

        <p>
          无息注册资本金
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道1：计息股东借款
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道2：内部基金融资
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道3：总包贴息融资
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p class="mt-10" style="font-weight: bolder">
          销售物业外部融资计划
        </p>

        <p>
          融资通道1：开发贷款
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道2：前端融资
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道3：外部信托资金融资
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道4：其他外部融资
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

      </a-col>
<!--      销售物业融资计划 end-->

<!--      自持物业融资计划 begin-->
      <a-col id="自持物业融资计划" :span="24" class="mt-20">
        <h3 class="blue" style="display: inline-block">自持物业融资计划</h3>
        <p style="font-weight: bolder">自持物业融资参数</p>
        <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
          <tr>
            <th rowspan="3">内部融资</th>
            <th>融资通道1：计息股东借款</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道2：内部基金融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道3：总包贴息融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th rowspan="4">外部融资</th>
            <th>融资通道1：开发贷款</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道2：前端融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道3：外部信托资金融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
          <tr>
            <th>融资通道4：其他外部融资</th>
            <td>
              <a-input addon-after="%"></a-input>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
            <td>
              <a-select style="width: 100%">
                <a-select-option value="123">123</a-select-option>
              </a-select>
            </td>
          </tr>
        </table>
        <p class="mt-10" style="font-weight: bolder">自持物业内部融资计划</p>

        <p>
          无息注册资本金
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道1：计息股东借款
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道2：内部基金融资
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道3：总包贴息融资
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p class="mt-10" style="font-weight: bolder">
          销售物业外部融资计划
        </p>

        <p>
          融资通道1：开发贷款
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道2：前端融资
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道3：外部信托资金融资
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>

        <p>
          融资通道4：经营性物业贷
          <span style="float: right" class="clickable-txt">编辑计划表</span>
        </p>
      </a-col>
<!--      自持物业融资计划 end-->

<!--      敏感性分析 begin-->
      <a-col id="敏感性分析" :span="24" class="mt-20 sub-gray-line">
        <h3 class="blue" style="display: inline-block">敏感性分析</h3>
        <p>
          <span style="font-weight: bolder">土地出让金增幅</span>
          <span style="float: right" class="clickable-txt">添加</span>
        </p>
        <p>
          <span style="font-weight: bolder">别墅类售价增幅</span>
          <span style="float: right" class="clickable-txt">添加</span>
        </p>
        <p>
          <span style="font-weight: bolder">多层类售价增幅</span>
          <span style="float: right" class="clickable-txt">添加</span>
        </p>
        <p>
          <span style="font-weight: bolder">高层类售价增幅</span>
          <span style="float: right" class="clickable-txt">添加</span>
        </p>
        <p>
          <span style="font-weight: bolder">公寓类租金</span>
          <span style="float: right" class="clickable-txt">添加</span>
        </p>
        <p>
          <span style="font-weight: bolder">商业类租金</span>
          <span style="float: right" class="clickable-txt">添加</span>
        </p>
      </a-col>

      <div style="text-align: center">
        <a-button class="mt-10" type="primary">提交测算内容</a-button>
      </div>
<!--      敏感性分析 end-->
    </a-col>
    <a-col :span="4">
      <a-anchor>
        <a-anchor-link href="#引入业态库" title="引入业态库" />
        <a-anchor-link href="#投资参数及基础信息" title="投资参数及基础信息" />
        <a-anchor-link href="#设计指标分期填写" title="设计指标分期填写" />
        <a-anchor-link href="#设计指标整体汇总" title="设计指标整体汇总" />
        <a-anchor-link href="#目标开发成本" title="目标开发成本" />
        <a-anchor-link href="#租售指标分解" title="租售指标分解" />
        <a-anchor-link href="#销售量价方案" title="销售量价方案" />
        <a-anchor-link href="#项目进度" title="项目进度" />
        <a-anchor-link href="#自持物业主营业务收入" title="自持物业主营业务收入" />
        <a-anchor-link href="#自持物业非主营业务收入" title="自持物业非主营业务收入" />
        <a-anchor-link href="#自持物业运营成本" title="自持物业运营成本" />
        <a-anchor-link href="#开发关键节点计划" title="开发关键节点计划" />
        <a-anchor-link href="#销售物业增值税费计算" title="销售物业增值税费计算" />
        <a-anchor-link href="#持有转售专项计算" title="持有转售专项计算" />
        <a-anchor-link href="#销售物业融资计划" title="销售物业融资计划" />
        <a-anchor-link href="#自持物业融资计划" title="自持物业融资计划" />
        <a-anchor-link href="#敏感性分析" title="敏感性分析" />
      </a-anchor>
    </a-col>
  </a-row>
</template>

<script>
import utils from '../../../../utils/utils'

const excludeRentalSaleList = [
  '保障房',
  '安置房',
  '人才房',
  '社区用房',
  '物业用房',
  '托儿所',
  '幼儿园',
  '小学',
  '中学',
  '市政公用',
  '停车楼',
  '不计容架空层',
  '设备用房',
  '半地下非人防车库',
  '地下非人防车库',
  '地下人防车库'
]

const FormatOptions = [
  '住宅',
  '商办',
  '配套',
  '地下车库',
  '辅助用房'
]

const LandTypeOptions = [
  '纯住宅',
  '商住',
  '商业/商办',
  '综合体',
  '其他'
]

const IndexPropertyOptions = [
  '可售',
  '自持',
  '代建配建',
  '无偿移交'
]

const FirstClassProductType = {
  '住宅': [
    '别墅住宅',
    '多层住宅',
    '高层住宅'
  ],
  '商办': [
    '类住宅',
    '商业',
    '酒店',
    '办公'
  ],
  '配套': [
    '特殊用房',
    '社区用房',
    '物业用房',
    '教育用房',
    '市政公用',
    '停车楼',
    '不计容类'
  ],
  '地下车库': [
    '半地下非人防车库',
    '地下非人防车库',
    '地下人防车库'
  ],
  '辅助用房': [
    '储藏间',
    '设备用房'
  ]
}

const SecondClassProductType = {
  '别墅住宅': [
    '独栋别墅',
    '类独别墅',
    '双拼别墅',
    '合院别墅',
    '联排别墅',
    '叠拼别墅'
  ],
  '多层住宅': [
    '花园洋房',
    '普通多层'
  ],
  '高层住宅': [
    '小高层',
    '中高层',
    '高层',
    '超高层'
  ],
  '类住宅': [
    '酒店式公寓',
    '公寓式办公/SOHO',
    'LOFT'
  ],
  '商业': [
    '经营性会所',
    '裙房商业',
    '商业街',
    'MALL',
    '地下商业（计容）'
  ],
  '酒店': [
    '五星级及以上酒店',
    '四星级酒店',
    '其他酒店'
  ],
  '办公': [
    '展厅性办公楼',
    '行政性办公楼',
    '市场化办公楼'
  ],
  '特殊用房': [
    '保障房',
    '安置房',
    '人才房'
  ],
  '社区用房': [
    '社区用房'
  ],
  '物业用房': [
    '物业用房'
  ],
  '教育用房': [
    '托儿所',
    '幼儿园',
    '小学',
    '中学'
  ],
  '市政公用': [
    '市政公用'
  ],
  '停车楼': [
    '停车楼'
  ],
  '不计容类': [
    '不计容架空层'
  ],
  '半地下非人防车库': [
    '半地下非人防车库'
  ],
  '地下非人防车库': [
    '地下非人防车库'
  ],
  '地下人防车库': [
    '地下人防车库'
  ],
  '储藏间': [
    '储藏间'
  ],
  '设备用房': [
    '设备用房'
  ]
}

function IsInt (obj) {
  return obj % 1 === 0
}

export default {
  name: 'moreAnalyse',
  computed: {
    'residentClass' () {
      let ret = []
      for (let format of this.form.formatList) {
        if (format.format === '住宅') {
          ret.push(format)
        }
      }
      return ret
    },
    'commercialOfficeClass' () {
      let ret = []
      for (let format of this.form.formatList) {
        if (format.format === '商办') {
          ret.push(format)
        }
      }
      return ret
    },
    'supportingClass' () {
      let ret = []
      for (let format of this.form.formatList) {
        if (format.format === '配套') {
          ret.push(format)
        }
      }
      return ret
    },
    'underGroundClass' () {
      let ret = []
      for (let format of this.form.formatList) {
        if (format.format === '地下车库' || format.format === '辅助用房') {
          ret.push(format)
        }
      }
      return ret
    },
    'IndexTypeOptions' () {
      let ret = ['住宅类', '商办类', '配套类/移交类', '地下产品业态']
      let temp = ['住宅类', '商办类', '配套类/移交类', '地下产品业态']
      for (let format of this.form.formatList) {
        if (format.format === '住宅') {
          temp.remove('住宅类')
        }
        if (format.format === '商办') {
          temp.remove('商办类')
        }
        if (format.format === '配套') {
          temp.remove('配套类/移交类')
        }
        if (format.format === '地下车库' || format.format === '辅助用房') {
          temp.remove('地下产品业态')
        }
      }
      for (let opt of temp) {
        ret.remove(opt)
      }
      return ret
    }
  },
  data () {
    return {
      processVisible: true,
      FormatOptions,
      SecondClassProductType,
      LandTypeOptions,
      IndexPropertyOptions,
      excludeRentalSaleList,
      FirstClassProductType,
      addDesignProductModalVisible: false,
      tempAddDesignProductForm: {
        obj: {}
      },
      form: {
        formatList: [],
        investParams: {
          computedDate: null,
          computedYears: 0,
          marketFeeRate: 0,
          municipalSupportingFee: 0,
          compensation: 0,
          totalLandFee: 0,
          landPrice: 0,
          capRate: 0,
          manageFeeRate: 0,
          beforeManageMonth: 0,
          manageMonth: 0,
          taxForm: {
            returnedRate: [0, 0, 0, 0, 0],
            profitRate: {
              valueAddedTax: 0,
              landValueAddedTax: 0,
              corporateIncomeTax: 0
            },
            taxRate: {
              buildingTaxPrice: 0,
              buildingTaxRent: 0,
              stampTax: 0
            },
            incomeTaxRate: {
              manageFee: [0, 0, 0],
              marketFee: [0, 0, 0]
            },
            ticketCollectionRate: {
              manageFee: [0, 0, 0],
              marketFee: [0, 0, 0]
            }
          },
          projectOperationNode: [0, 0, 0, 0, 0, 0, 0],
          paymentRate: {
            takeLand: [0, 0, 0, 0, 0, 0, 0],
            deliverLand: [0, 0, 0, 0, 0, 0, 0],
            startOperation: [0, 0, 0, 0, 0, 0, 0],
            plusMinusZero: [0, 0, 0, 0, 0, 0, 0],
            halfStructure: [0, 0, 0, 0, 0, 0, 0],
            sealRoof: [0, 0, 0, 0, 0, 0, 0],
            completed: [0, 0, 0, 0, 0, 0, 0],
            deliver: [0, 0, 0, 0, 0, 0, 0],
            after1year: [0, 0, 0, 0, 0, 0, 0],
            after3year: [0, 0, 0, 0, 0, 0, 0]
          }
        },
        designTotal: {
          unrequisitionLandSpace: 0,
          buildingDensity: 0,
          buildingHeightLimit: 0,
          greeningRate: 0,
          landType: []
        },
        targetDevelopmentCost: {
          nonConstructionCost: {
            testingFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            designFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            feasibilityFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            approvalFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            municipalFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            connectionsFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            temporaryEquipmentFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            operationFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            otherProphaseFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            waterworks: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            electric: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            gasSystem: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            TVFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            telephoneFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            intelligentFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            heatingFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            reclaimedWaterFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            rainwaterFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            landscapeFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            otherEquipmentFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            school: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            municipalHouse: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            propertyManagementRoom: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            sportsGround: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            equipmentRoom: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            overheadFloor: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            otherSupporting: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            projectManagementFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            },
            BasicReserveFee: {
              incomeTaxRate: 0,
              ticketCollectionRate: 0,
              buildingSpace: [0, 0, 0]
            }
          },
          mainConstructionCost: {

          }
        }
      }
    }
  },
  methods: {
    processYears (format, index) {
      if (!format.designProduction[index].beginTime) return 0
      return Math.ceil((format.designProduction[index].beginTime.toObject().months + format.designProduction[index].soldProcess.length) / 12)
    },
    deleteFormatDesignProduct (format, i) {
      this.$set(format.designProduction, i - 1, null)
    },
    changeDesignProductionObj (obj) {
      this.tempAddDesignProductForm.obj = obj
      if (obj.designProduction[this.tempAddDesignProductForm.stage]) {
        this.tempAddDesignProductForm.landSpace = obj.designProduction[this.tempAddDesignProductForm.stage].landSpace
        this.tempAddDesignProductForm.buildingSpace = obj.designProduction[this.tempAddDesignProductForm.stage].buildingSpace
        this.tempAddDesignProductForm.baseSpace = obj.designProduction[this.tempAddDesignProductForm.stage].baseSpace
      }
    },
    performAddDesignProduct () {
      let i = this.tempAddDesignProductForm.stage
      let temp = utils.Copy(this.tempAddDesignProductForm)
      delete temp['stage']
      delete temp['obj']
      this.tempAddDesignProductForm.obj.designProduction[i] = temp
      this.addDesignProductModalVisible = false
    },
    IndexNameOptions (p) {
      let ret = []
      for (let format of this.form.formatList) {
        if (p.indexType !== '住宅类' && format.format === '住宅') {
          continue
        }
        if (p.indexType !== '商办类' && format.format === '商办') {
          continue
        }
        if (p.indexType !== '配套类/移交类' && format.format === '配套') {
          continue
        }
        if (p.indexType !== '地下产品业态' && (format.format === '地下车库' || format.format === '辅助用房')) {
          continue
        }
        if (format.secondClassProductType && format.secondClassProductType.length) {
          if (format.desc) {
            ret.push({name: format.secondClassProductType + '(' + format.desc + ')', obj: format})
          } else {
            ret.push({name: format.secondClassProductType, obj: format})
          }
        }
      }
      return ret
    },
    addFormat () {
      this.form.formatList.push({
        format: [],
        firstClassProductType: [],
        secondClassProductType: [],
        designProduction: [null, null, null],
        basicEngineeringCost: 0,
        structureCost: 0,
        waterElectricity: 0,
        fireFighting: 0,
        airConditional: 0,
        windowCost: 0,
        elevator: 0,
        otherMainBodyCost: 0,
        bodyIncomeTaxRate: 0,
        bodyTicketCollectionRate: 0,
        decorationCost: 0,
        otherMainConstructionCost: 0,
        ticketCollectionRate: 0,
        incomeTaxRate: 0,
        actualOperatingRate: 0,
        threeYearIncreaseRate: 0,
        eachYearIncreaseRate: 0,
        marketPrice: 0,
        occupancyRate: 0,
        maxOccupancyRate: 0,
        facadeDecoration: 0,
        desc: ''
      })
    },
    showAddDesignProductModal (stage) {
      this.tempAddDesignProductForm = {
        stage: stage,
        indexType: [],
        indexName: [],
        indexProperty: [],
        buildingSpace: 0,
        rentalSaleIndex: 0,
        blankPrice: 0,
        averageAnnualGrowth: 0,
        markup: 0,
        beginTime: null,
        soldProcess: [],
        landSpace: 0,
        obj: {},
        baseSpace: 0
      }
      this.addDesignProductModalVisible = true
    },
    validInt (obj, pro, name) {
      if (!IsInt(obj[pro])) {
        this.$error(name + '必须为整数！')
        obj[pro] = Math.floor(obj[pro])
      }
    },
    validComputedYears () {
      this.validInt(this.form.investParams, 'computedYears', '测算年数')
      if (this.form.investParams.computedYears < 0) {
        this.$error('测算年数不能小于0！')
        this.form.investParams.computedYears = 0
      }
      if (this.form.investParams.computedYears > 60) {
        this.$error('测算年数不能大于60！')
        this.form.investParams.computedYears = 60
      }
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
