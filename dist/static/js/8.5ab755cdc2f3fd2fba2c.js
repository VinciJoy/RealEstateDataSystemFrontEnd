webpackJsonp([8],{KDd5:function(t,a,s){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=s("PJh5"),e=s.n(i),n={data:function(){return{itemsList:[[["方案设计单位招标（有战略）","方案设计单位招标（无战略）"],["标准化方案总图及指标移交","新设计方案总图及指标移交","综合商业地块"]],[["取得初步意见","取得规划方案批复","工程规划许可证"],["基坑施工许可证","精装施工许可证","工程施工许可证"]]],confirmationTime:null,selectedItems:[],itemsDay:{}}},computed:{part1EndTime:function(){return this.confirmationTime?e()(this.confirmationTime).add(this.partDays(0,0)+this.partDays(0,1),"days").format("YYYY/MM/DD"):"YYYY/MM/DD"},part2EndTime:function(){return this.confirmationTime?e()(this.confirmationTime).add(this.partDays(0,0)+this.partDays(0,1)+this.partDays(1,0)+this.partDays(1,1),"days").format("YYYY/MM/DD"):"YYYY/MM/DD"}},mounted:function(){},filters:{},methods:{partDays:function(t,a){var s=this,i=0;return this.itemsList[t][a].forEach(function(t){if(s.selectedItems.includes(t)){var a=0;void 0!==s.itemsDay[t]&&(a=parseInt(s.itemsDay[t])),i+=a}}),i}}},l={render:function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"board"},[s("a-row",[s("a-col",{staticClass:"gray-font",attrs:{span:16}},[s("span",[t._v("确权-开盘 ")]),s("span",{staticClass:"blue-number"},[t._v(t._s(t.partDays(0,0)+t.partDays(0,1)+t.partDays(1,0)+t.partDays(1,1)))]),t._v(" "),s("span",[t._v("天")])]),t._v(" "),s("div",{staticClass:"gray-font",staticStyle:{float:"right"}},[s("span",[t._v("确权-交付总工期 ")]),s("span",{staticClass:"blue-number"},[t._v(t._s(t.partDays(0,0)+t.partDays(0,1)+t.partDays(1,0)+t.partDays(1,1)))]),t._v(" "),s("span",[t._v("天")]),s("span",{staticStyle:{"margin-left":"40px"}},[t._v(t._s(((t.partDays(0,0)+t.partDays(0,1)+t.partDays(1,0)+t.partDays(1,1))/30).toFixed(1))+" 个月")])])],1),t._v(" "),s("a-checkbox-group",{staticStyle:{width:"100%"},model:{value:t.selectedItems,callback:function(a){t.selectedItems=a},expression:"selectedItems"}},[s("a-row",{staticClass:"gray-board",attrs:{gutter:20}},[s("a-col",{staticClass:"gray-font",attrs:{span:1}},[s("span",{staticStyle:{"font-size":"45px"}},[t._v("\n        1"),s("br")]),t._v(" "),s("span",{staticClass:"blue-number",staticStyle:{"font-size":"20px"}},[t._v("\n        设"),s("br"),t._v("\n        计"),s("br"),t._v("\n        阶"),s("br"),t._v("\n        段\n      ")])]),t._v(" "),s("a-col",{attrs:{span:23}},[s("div",{staticClass:"title-underline normal-font",staticStyle:{bottom:"10px",width:"100%"}},[s("div",[s("span",[t._v("确权时间")]),t._v(" "),s("a-date-picker",{attrs:{format:"YYYY/MM/DD",placeholder:"请选择日期"},model:{value:t.confirmationTime,callback:function(a){t.confirmationTime=a},expression:"confirmationTime"}}),t._v(" "),s("div",{staticStyle:{float:"right","margin-right":"15px"}},[s("span",[t._v("完成时间")]),t._v(" "),s("span",[t._v(t._s(t.part1EndTime))])])],1)]),t._v(" "),s("div",{staticStyle:{display:"table",width:"100%","margin-top":"20px"}},[s("a-col",{staticClass:"white-board",staticStyle:{width:"47%",display:"table-cell"}},[s("div",{staticClass:"title-underline normal-font",staticStyle:{"text-align":"center"}},[s("span",{staticClass:"blue"},[t._v("方案设计单位招标")]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("span",{staticClass:"gray-number"},[t._v(t._s(t.partDays(0,0)))]),t._v(" "),s("span",[t._v("天")])])]),t._v(" "),t._l(t.itemsList[0][0],function(a){return s("div",{key:a,staticClass:"board-info normal-font"},[s("a-checkbox",{attrs:{value:a}},[s("span",{staticClass:"board-info normal-font"},[t._v(t._s(a))])]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("a-input",{staticStyle:{width:"100px"},attrs:{type:"number"},model:{value:t.itemsDay[a],callback:function(s){t.$set(t.itemsDay,a,s)},expression:"itemsDay[item]"}}),t._v(" 天\n            ")],1)],1)})],2),t._v(" "),s("div",{staticClass:"gray-font",staticStyle:{width:"5%",display:"table-cell","vertical-align":"middle","font-size":"50px","text-align":"center"}},[s("a-icon",{attrs:{type:"arrow-right"}})],1),t._v(" "),s("a-col",{staticClass:"white-board",staticStyle:{width:"47%",display:"table-cell"}},[s("div",{staticClass:"title-underline normal-font",staticStyle:{"text-align":"center"}},[s("span",{staticClass:"blue"},[t._v("提交方案文本")]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("span",{staticClass:"gray-number"},[t._v(t._s(t.partDays(0,1)))]),t._v(" "),s("span",[t._v("天")])])]),t._v(" "),t._l(t.itemsList[0][1],function(a){return s("div",{key:a,staticClass:"board-info normal-font"},[s("a-checkbox",{attrs:{value:a}},[s("span",{staticClass:"board-info normal-font"},[t._v(t._s(a))])]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("a-input",{staticStyle:{width:"100px"},attrs:{type:"number"},model:{value:t.itemsDay[a],callback:function(s){t.$set(t.itemsDay,a,s)},expression:"itemsDay[item]"}}),t._v(" 天\n            ")],1)],1)})],2)],1)])],1),t._v(" "),s("a-row",{staticClass:"gray-board",attrs:{gutter:20}},[s("a-col",{staticClass:"gray-font",attrs:{span:1}},[s("span",{staticStyle:{"font-size":"45px"}},[t._v("\n        2"),s("br")]),t._v(" "),s("span",{staticClass:"blue-number",staticStyle:{"font-size":"20px"}},[t._v("\n        报"),s("br"),t._v("\n        规"),s("br"),t._v("\n        报"),s("br"),t._v("\n        建"),s("br"),t._v("\n        阶"),s("br"),t._v("\n        段\n      ")])]),t._v(" "),s("a-col",{attrs:{span:23}},[s("div",{staticClass:"title-underline normal-font",staticStyle:{bottom:"10px",width:"100%"}},[s("div",[s("span",[t._v("开始时间")]),t._v(" "),s("span",[t._v(t._s(t.part1EndTime))]),t._v(" "),s("div",{staticStyle:{float:"right","margin-right":"15px"}},[s("span",[t._v("完成时间")]),t._v(" "),s("span",[t._v(t._s(t.part2EndTime))])])])]),t._v(" "),s("div",{staticStyle:{display:"table",width:"100%","margin-top":"20px"}},[s("a-col",{staticClass:"white-board",staticStyle:{width:"47%",display:"table-cell"}},[s("div",{staticClass:"title-underline normal-font",staticStyle:{"text-align":"center"}},[s("span",{staticClass:"blue"},[t._v("方案审查通过")]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("span",{staticClass:"gray-number"},[t._v(t._s(t.partDays(1,0)))]),t._v(" "),s("span",[t._v("天")])])]),t._v(" "),t._l(t.itemsList[1][0],function(a){return s("div",{key:a,staticClass:"board-info normal-font"},[s("a-checkbox",{attrs:{value:a}},[s("span",{staticClass:"board-info normal-font"},[t._v(t._s(a))])]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("a-input",{staticStyle:{width:"100px"},attrs:{type:"number"},model:{value:t.itemsDay[a],callback:function(s){t.$set(t.itemsDay,a,s)},expression:"itemsDay[item]"}}),t._v(" 天\n            ")],1)],1)})],2),t._v(" "),s("div",{staticClass:"gray-font",staticStyle:{width:"5%",display:"table-cell","vertical-align":"middle","font-size":"50px","text-align":"center"}},[s("a-icon",{attrs:{type:"arrow-right"}})],1),t._v(" "),s("a-col",{staticClass:"white-board",staticStyle:{width:"47%",display:"table-cell"}},[s("div",{staticClass:"title-underline normal-font",staticStyle:{"text-align":"center"}},[s("span",{staticClass:"blue"},[t._v("施工许可证办理")]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("span",{staticClass:"gray-number"},[t._v(t._s(t.partDays(1,1)))]),t._v(" "),s("span",[t._v("天")])])]),t._v(" "),t._l(t.itemsList[1][1],function(a){return s("div",{key:a,staticClass:"board-info normal-font"},[s("a-checkbox",{attrs:{value:a}},[s("span",{staticClass:"board-info normal-font"},[t._v(t._s(a))])]),t._v(" "),s("div",{staticStyle:{float:"right"}},[s("a-input",{staticStyle:{width:"100px"},attrs:{type:"number"},model:{value:t.itemsDay[a],callback:function(s){t.$set(t.itemsDay,a,s)},expression:"itemsDay[item]"}}),t._v(" 天\n            ")],1)],1)})],2)],1)])],1)],1)],1)},staticRenderFns:[]};var r=s("VU/8")(n,l,!1,function(t){s("NJxk")},"data-v-f374e552",null);a.default=r.exports},NJxk:function(t,a){}});
//# sourceMappingURL=8.5ab755cdc2f3fd2fba2c.js.map