webpackJsonp([6],{"3Aam":function(t,e,i){"use strict";var a=i("vLgD");e.a={createVideo:function(t){return Object(a.a)("/videos/","post",{data:t})},getVideos:function(t){return Object(a.a)("/videos/","get",{params:t})},getVideo:function(t,e){return Object(a.a)("/videos/"+t+"/","get",{params:e})},editVideo:function(t,e){return Object(a.a)("/videos/"+t+"/","patch",{data:e})},deleteVideo:function(t){return Object(a.a)("/videos/"+t+"/","delete")}}},"5dhH":function(t,e,i){"use strict";var a=i("QmJ2"),s={name:"membership",props:{membershipVisible:{type:Boolean,default:!1}},data:function(){return{accepted:!1}},methods:{monthLater:function(t){var e=new Date;return e.setMonth(e.getMonth()+t),e.getFullYear()+"/"+(e.getMonth()+1)+"/"+e.getDate()},becomeMembership:function(t){a.a.becomeMembership({month:t}).then(function(t){window.open(t.data.data.payURL)})},closeMembership:function(){this.$emit("closeMembershipModal")}}},o={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("a-modal",{attrs:{visible:t.membershipVisible,width:"60%"},on:{cancel:t.closeMembership}},[i("template",{slot:"title"},[i("div",{staticStyle:{"text-align":"center"}},[t._v("\n      成为会员\n    ")])]),t._v(" "),i("a-row",[i("a-col",{staticClass:"membership-type-container",attrs:{span:8}},[i("div",{staticClass:"membership-type",on:{click:function(e){return t.becomeMembership(1)}}},[i("h2",[t._v("一个月会员")]),t._v(" "),i("p",{staticClass:"blue"},[t._v("1000元")]),t._v(" "),i("p",{staticClass:"date"},[t._v("至"+t._s(t.monthLater(1)))])])]),t._v(" "),i("a-col",{staticClass:"membership-type-container",attrs:{span:8}},[i("div",{staticClass:"membership-type",on:{click:function(e){return t.becomeMembership(3)}}},[i("h2",[t._v("季度会员")]),t._v(" "),i("p",{staticClass:"blue"},[t._v("2000元")]),t._v(" "),i("p",{staticClass:"date"},[t._v("至"+t._s(t.monthLater(3)))])])]),t._v(" "),i("a-col",{staticClass:"membership-type-container",attrs:{span:8}},[i("div",{staticClass:"membership-type",on:{click:function(e){return t.becomeMembership(12)}}},[i("h2",[t._v("年度会员")]),t._v(" "),i("p",{staticClass:"blue"},[t._v("5000元")]),t._v(" "),i("p",{staticClass:"date"},[t._v("至"+t._s(t.monthLater(12)))])])])],1),t._v(" "),i("div",{staticStyle:{padding:"10px"},attrs:{slot:"footer"},slot:"footer"},[i("a-radio",{staticStyle:{"text-align":"left"},attrs:{checked:t.accepted},on:{click:function(e){t.accepted=!t.accepted}}},[t._v("我已阅读并同意摩贝会员相关条款")]),t._v(" "),i("span",{staticClass:"clickable-txt",staticStyle:{"margin-right":"10px"}},[t._v("会员权益")]),t._v(" "),i("span",{staticClass:"clickable-txt"},[t._v("会员条款")])],1)],2)},staticRenderFns:[]};var n=i("VU/8")(s,o,!1,function(t){i("SQ+6")},"data-v-06e60b69",null);e.a=n.exports},"99xg":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("Dd8w"),s=i.n(a),o=i("3Aam"),n=i("NYxO"),r={name:"videoDetail",data:function(){return{video:{},buyVideoList:[]}},mounted:function(){this.init()},computed:s()({},Object(n.c)(["userInfo"])),watch:{"$route.params":function(){this.init()}},methods:{goToVideo:function(t){1!==t.type||this.userInfo.isMembership?2!==t.type||this.buyVideoList.includes(t.ID+"")?this.$router.push({name:"video",params:{id:t.ID}}):this.$error("请先购买视频!"):this.$error("请先开通会员!")},init:function(){var t=this;this.userInfo.buyVideo&&(this.buyVideoList=this.userInfo.buyVideo.split(",")),o.a.getVideo(this.$route.params.id,{watch:!0}).then(function(e){t.video=e.data.data.video,t.video.fileList&&(t.video.fileList=JSON.parse(t.video.fileList))})},getCover:function(t){return JSON.parse(t.cover)[0].thumbUrl}}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-row",{staticClass:"mt-20",attrs:{gutter:40}},[a("a-col",{staticStyle:{border:"1px solid transparent"},attrs:{span:2}}),t._v(" "),a("a-col",{attrs:{span:20}},[a("a-col",{attrs:{span:16}},[a("video",{staticStyle:{width:"100%",height:"auto"},attrs:{poster:i("q1Xm"),src:t.video.url,controls:"controls"}}),t._v(" "),a("a-col",{attrs:{span:24}},[a("h1",[t._v("\n          "+t._s(t.video.title)+"\n        ")]),t._v(" "),a("h3",[t._v("\n          "+t._s(t.video.desc)+"\n        ")]),t._v(" "),t.video.fileList&&t.video.fileList.length?a("p",[t._v("\n          附件下载：\n          "),t._l(t.video.fileList,function(e,i){return a("a",{key:"file"+i,staticStyle:{"margin-left":"10px"},attrs:{download:e.name,href:e.url}},[t._v("\n          "+t._s(e.name)+"\n        ")])})],2):t._e()])],1),t._v(" "),a("a-col",{staticStyle:{"background-color":"#fafafa",padding:"10px 20px"},attrs:{span:8}},[a("h2",[t._v("\n        "+t._s(t.video.tag)+"\n      ")]),t._v(" "),t._l(t.video.relatedVideo,function(e,i){return[1!==e.type||t.userInfo.isMembership?t._e():a("div",{key:"video_cover"+i,staticStyle:{width:"360px",height:"270px","background-color":"rgba(0,0,0,0.5)",position:"absolute"}},[a("p",{staticStyle:{color:"white",padding:"10px","font-weight":"bolder","font-size":"20px"}},[t._v("会员专享")])]),t._v(" "),2!==e.type||t.buyVideoList.includes(e.ID+"")?t._e():a("div",{key:"video2_cover"+i,staticStyle:{width:"360px",height:"270px","background-color":"rgba(0, 0, 0, 0.5)",position:"absolute"}},[a("p",{staticStyle:{color:"white",padding:"10px","font-weight":"bolder","font-size":"20px"}},[t._v("未购买")])]),t._v(" "),a("div",{key:"video"+i,on:{click:function(i){return t.goToVideo(e)}}},[a("img",{staticStyle:{width:"360px",height:"270px"},attrs:{src:t.getCover(e)}}),t._v(" "),a("h3",[t._v("\n            "+t._s(e.title)+"\n          ")])])]})],2)],1)],1)},staticRenderFns:[]};var l=i("VU/8")(r,c,!1,function(t){i("FxuF")},"data-v-8c00cce2",null);e.default=l.exports},CY9J:function(t,e){},FxuF:function(t,e){},FyWD:function(t,e){},HW98:function(t,e){},QmJ2:function(t,e,i){"use strict";var a=i("vLgD");e.a={becomeMembership:function(t){return Object(a.a)("/alipay/","get",{params:t})},buyItem:function(t){return Object(a.a)("/alipay/buyItem/","get",{params:t})}}},RSkn:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("Dd8w"),s=i.n(a),o=i("umDa"),n=i("g6TA"),r=i("NYxO"),c={name:"mobeiStudy",components:{videoBlock:n.a},computed:s()({},Object(r.c)(["userInfo"])),data:function(){return{selectedTab:"freeBlock",form:{bannerList:[]},buyVideoList:[],showCount:{freeBlock:[],vipBlock:[],proBlock:[]}}},mounted:function(){this.init()},methods:{init:function(){this.userInfo.buyVideo&&(this.buyVideoList=this.userInfo.buyVideo.split(",")),this.getMobeiStudy()},changeTab:function(t){this.selectedTab=t},changeShowCount:function(t,e){this.$set(this.showCount[this.selectedTab],t,e)},getMobeiStudy:function(){var t=this;o.a.getMobeiStudy().then(function(e){t.form=JSON.parse(e.data.data.stringify)})}}},l={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("a-row",[i("a-carousel",{attrs:{autoplay:""}},[t._l(t.form.bannerList,function(t,e){return[i("img",{key:"banner"+e,attrs:{src:t.url}})]})],2)],1),t._v(" "),i("a-row",{staticClass:"mt-20",attrs:{gutter:40}},[i("a-col",{staticStyle:{border:"1px solid transparent"},attrs:{span:2}}),t._v(" "),i("a-col",{attrs:{span:20}},[i("a-row",{staticStyle:{background:"#f5f5f5",padding:"10px 0 0 20px"}},[i("a-col",{class:"tab "+("freeBlock"===t.selectedTab?"blue selected":"clickable-txt"),attrs:{span:3},on:{click:function(e){return t.changeTab("freeBlock")}}},[t._v("免费课程")]),t._v(" "),i("a-col",{class:"tab "+("vipBlock"===t.selectedTab?"blue selected":"clickable-txt"),attrs:{span:3},on:{click:function(e){return t.changeTab("vipBlock")}}},[t._v("会员专享")]),t._v(" "),i("a-col",{class:"tab "+("proBlock"===t.selectedTab?"blue selected":"clickable-txt"),attrs:{span:3},on:{click:function(e){return t.changeTab("proBlock")}}},[t._v("私房高阶")])],1),t._v(" "),t._l(t.form[t.selectedTab],function(e,a){return i("a-row",{key:"block"+a,staticStyle:{"border-bottom":"#e0e0e0 solid 1px","padding-bottom":"40px"}},[i("a-col",{staticStyle:{margin:"20px 0px"},attrs:{span:24}},[i("span",{staticClass:"block-title"},[t._v(t._s(e.title))]),t._v(" "),i("span",{staticClass:"block-subtitle"},[t._v(t._s(e.subTitle))])]),t._v(" "),t._l(e.videoList,function(e,s){return i("a-col",{key:"block"+a+"video"+s,staticStyle:{"margin-top":"10px"},attrs:{span:6}},[s<(t.showCount[t.selectedTab][a]?t.showCount[t.selectedTab][a]:8)?i("videoBlock",{attrs:{getVideoFromID:e,currentBlock:t.selectedTab,isNotBuy:"proBlock"===t.selectedTab&&!t.buyVideoList.includes(e+""),isNotMembership:"vipBlock"===t.selectedTab&&!t.userInfo.isMembership}}):t._e()],1)}),t._v(" "),e.videoList.length>8?i("a-col",{staticClass:"mt-10",staticStyle:{"text-align":"center"},attrs:{span:24}},[e.videoList.length>(t.showCount[t.selectedTab][a]?t.showCount[t.selectedTab][a]:8)?i("p",{staticClass:"clickable-txt",on:{click:function(e){return t.changeShowCount(a,999)}}},[i("a-icon",{attrs:{type:"down"}}),t._v("显示全部视频")],1):i("p",{staticClass:"clickable-txt",on:{click:function(e){return t.changeShowCount(a,8)}}},[i("a-icon",{attrs:{type:"up"}}),t._v("收起全部视频")],1)]):t._e()],2)})],2)],1)],1)},staticRenderFns:[]};var d=i("VU/8")(c,l,!1,function(t){i("FyWD")},"data-v-1b262f2b",null);e.default=d.exports},"SQ+6":function(t,e){},g6TA:function(t,e,i){"use strict";var a=i("oAV5"),s=i("5dhH"),o=i("QmJ2"),n={name:"buyItem",props:{buyItemVisible:{type:Boolean,default:!1},title:{type:String,default:""},id:{type:Number,default:0},content:{type:String,default:""},itemType:{type:String,default:"video"},price:{type:Number,default:0}},data:function(){return{accepted:!1}},methods:{BuyItem:function(){o.a.buyItem({itemType:"video",id:this.id}).then(function(t){window.open(t.data.data.payURL)})},closeBuyItem:function(){this.$emit("closeBuyItem")}}},r={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("a-modal",{attrs:{visible:t.buyItemVisible,width:"40%"},on:{cancel:t.closeBuyItem}},[i("template",{slot:"title"},[i("div",{staticStyle:{"text-align":"center"}},[t._v("\n      "+t._s(t.title)+"\n    ")])]),t._v(" "),i("a-row",[i("a-col",{staticStyle:{border:"1px solid transparent"},attrs:{span:8}}),t._v(" "),i("a-col",{staticClass:"membership-type-container",attrs:{span:8}},[i("div",{staticClass:"membership-type",on:{click:t.BuyItem}},[i("h2",[t._v(t._s(t.content))]),t._v(" "),i("p",{staticClass:"blue"},[t._v(t._s(t.price)+" 元")])])])],1),t._v(" "),i("div",{staticStyle:{padding:"10px"},attrs:{slot:"footer"},slot:"footer"},[i("a-radio",{staticStyle:{"text-align":"left"},attrs:{checked:t.accepted},on:{click:function(e){t.accepted=!t.accepted}}},[t._v("我已阅读并同意摩贝会员相关条款")]),t._v(" "),i("span",{staticClass:"clickable-txt",staticStyle:{"margin-right":"10px"}},[t._v("会员权益")]),t._v(" "),i("span",{staticClass:"clickable-txt"},[t._v("会员条款")])],1)],2)},staticRenderFns:[]};var c=i("VU/8")(n,r,!1,function(t){i("CY9J")},"data-v-029f16af",null).exports,l=i("3Aam"),d={name:"videoBlock",components:{membership:s.a,buyItem:c},props:{disabled:{type:Boolean,default:!1},thumbUrl:{type:String},getVideoFromID:{type:Number,default:0},currentBlock:{type:String},isNotMembership:{type:Boolean,default:!1},id:{type:Number,default:0},price:{type:Number,default:0},isNotBuy:{type:Boolean,default:!1},title:{type:String},desc:{type:String,default:""},watchedCount:{type:Number,default:0}},watch:{getVideoFromID:function(){this.init()}},data:function(){return{form:{thumbUrl:"",desc:"",id:0,title:""},membershipVisible:!1,buyItemVisible:!1}},mounted:function(){this.init()},methods:{init:function(){var t=this;this.getVideoFromID?l.a.getVideo(this.getVideoFromID).then(function(e){t.form.thumbUrl=JSON.parse(e.data.data.video.cover)[0].thumbUrl,t.form.title=e.data.data.video.title,t.form.desc=e.data.data.video.desc,t.form.id=e.data.data.video.ID,t.form.watchedCount=e.data.data.video.watchedCount}):(this.form.thumbUrl=this.thumbUrl,this.form.title=this.title,this.form.desc=this.desc,this.form.id=this.id,this.form.watchedCount=this.watchedCount)},goToVideo:function(){this.disabled||(this.isNotBuy?this.buyItemVisible=!0:this.isNotMembership?this.membershipVisible=!0:this.$router.push("video/"+this.form.id))},formatNum:function(t){return a.a.nFormatter(t,3)}}},u={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticStyle:{width:"362px",cursor:"pointer",margin:"auto",border:"1px solid #e8e8e8"},on:{click:t.goToVideo}},[t.isNotMembership?i("div",{staticStyle:{width:"360px",height:"270px","background-color":"rgba(0,0,0,0.5)",position:"absolute"}},[i("p",{staticStyle:{color:"white",padding:"10px","font-weight":"bolder","font-size":"20px"}},[t._v("会员专享")])]):t._e(),t._v(" "),t.isNotBuy?i("div",{staticStyle:{width:"360px",height:"270px","background-color":"rgba(0, 0, 0, 0.5)",position:"absolute"}},[i("p",{staticStyle:{color:"white",padding:"10px","font-weight":"bolder","font-size":"20px"}},[t._v("未购买")])]):t._e(),t._v(" "),i("img",{staticStyle:{width:"360px",height:"270px"},attrs:{src:t.form.thumbUrl}}),t._v(" "),i("div",{staticStyle:{padding:"10px 20px",background:"white"}},[i("p",[i("span",{staticStyle:{"font-size":"20px"}},[t._v(t._s(t.form.title))]),t._v(" "),"proBlock"===t.currentBlock?i("span",{staticStyle:{float:"right","font-size":"20px","font-weight":"bolder"}},[t._v(t._s(t.price?"价格："+t.price+" 元":""))]):t._e()]),t._v(" "),i("p",{staticStyle:{"font-size":"15px"}},[i("span",[t._v(t._s(t.form.desc?t.form.desc:"暂无描述"))]),t._v(" "),i("span",{staticStyle:{float:"right"}},[i("a-icon",{attrs:{type:"user"}}),t._v(t._s(t.formatNum(t.form.watchedCount)))],1)])])]),t._v(" "),i("membership",{attrs:{membershipVisible:t.membershipVisible},on:{closeMembershipModal:function(e){t.membershipVisible=!1}}}),t._v(" "),i("buyItem",{attrs:{id:t.id,title:"购买视频",price:t.price,content:"点击购买："+t.title,buyItemVisible:t.buyItemVisible},on:{closeBuyItem:function(e){t.buyItemVisible=!1}}})],1)},staticRenderFns:[]};var p=i("VU/8")(d,u,!1,function(t){i("HW98")},"data-v-b4b4f0d4",null);e.a=p.exports},q1Xm:function(t,e,i){t.exports=i.p+"static/img/loading.c877c57.gif"},umDa:function(t,e,i){"use strict";var a=i("vLgD");e.a={createMobeiStudy:function(t){return Object(a.a)("/mobeistudy/","post",{data:t})},getMobeiStudy:function(){return Object(a.a)("/mobeistudy/","get")}}}});
//# sourceMappingURL=6.26d446270c9b4a2a2dd8.js.map