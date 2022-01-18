<template>
  <div>
<!--    banner begin-->
    <a-row>
      <img class="banner" src="../../../../../static/imgs/home-banner.png"/>
      <div class="banner-content can-not-select">
        <span style="font-weight: bolder; font-size: 40px">
          MORE分析
        </span>
        <br>
        <p style="font-size: 30px">
          投 资 测 算 分 析 系 统
        </p>
        <a-button type="primary">动态详细测算通道</a-button>
        <a-button type="primary">智能辅助测算通道</a-button>
      </div>
    </a-row>
<!--    banner end-->

<!--    tag begin-->
    <a-row class="mt-40" :gutter="40">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="5">
        <a-row class="tag-card">
          <a-col style="height: 100%" :span="9">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/home-icon.png"/>
          </a-col>
          <a-col class="mt-20" :span="15">
            <span class="tag-title can-not-select">土地 / 资产信息</span>
            <br>
            <span class="tag-desc can-not-select">LAND / ASSETS</span>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="5">
        <a-row class="tag-card">
          <a-col style="height: 100%" :span="9">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/money-icon.png"/>
          </a-col>
          <a-col class="mt-20" :span="15">
            <span class="tag-title can-not-select">泛式匹配资金</span>
            <br>
            <span class="tag-desc can-not-select">CAPITAL</span>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="5">
        <a-row class="tag-card">
          <a-col style="height: 100%" :span="10">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/contract-icon.png"/>
          </a-col>
          <a-col class="mt-20" :span="14">
            <span class="tag-title can-not-select">匹配产业导入</span>
            <br>
            <span class="tag-desc can-not-select">INDUSTRY</span>
          </a-col>
        </a-row>
      </a-col>

      <a-col :span="5">
        <a-row class="tag-card">
          <a-col style="height: 100%" :span="9">
            <img class="tag-icon can-not-select" src="../../../../../static/imgs/message-icon.png"/>
          </a-col>
          <a-col class="mt-20" :span="15">
            <span class="tag-title can-not-select">资源匹配推送</span>
            <br>
            <span class="tag-desc can-not-select">FORUM</span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
<!--    tag end-->

<!--    system info begin-->
    <a-row class="mt-40" :gutter="16">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="10">
        <img class="banner" src="../../../../../static/imgs/system-info.png"/>
      </a-col>

      <a-col :span="10">
        <div class="left-blue part-title can-not-select" style="width: 100%">
          <h1 style="display: inline">系统公告</h1>
          <span style="float: right; cursor: pointer" class="tag-desc">MORE +</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">摩贝云产业资源系统使用方法</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">第25期摩贝线上投资培训开讲通知</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">摩贝云与XX集团签署战略合作协议</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">摩贝云与XX公司达成战略合作伙伴</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>

        <div class="can-not-select mt-20" style="width: 100%">
          <div class="point" style="background-color: #40a9ff;margin-bottom: 5px"/>
          <h2 style="display: inline">摩贝云系统管理员招募通知</h2>
          <span style="float: right; cursor: pointer" class="tag-desc">2021/11/25</span>
        </div>
      </a-col>
    </a-row>
<!--  system info end-->

<!--    my info begin-->
    <a-row class="mt-40" :gutter="16">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="20">
        <a-row>
          <div class="left-blue part-title can-not-select" style="width: 100%">
            <h1>我的项目</h1>
          </div>
        </a-row>
        <a-row type="flex">
          <a-col :span="6">
            <a-row>
              <a-col :span="6">
                <img  width="80%" src="../../../../../static/imgs/user-icon.png"/>
              </a-col>
              <a-col :span="18">
                <a-col>平台用户001</a-col>
                <a-col class="tag-desc" style="font-size: 10px">
                  <img  width="13px" src="../../../../../static/imgs/verified.png"/> 已实名认证
                </a-col>
              </a-col>
            </a-row>
            <a-row>
              <img style="padding-top: 10px; height: 90%; width: 90%" src="../../../../../static/imgs/envelope.png"/>
              <div style="color: white; position: absolute; text-align: center; font-size: 20px; font-weight: bolder;left:0; right:30px; top: 40px; bottom:0;">
                <div class="can-not-select">
                  请查收您的定制项目
                </div>
                <div style="margin-top: 30px">
                  <a-button>去定制</a-button>
                </div>
              </div>
            </a-row>
          </a-col>

          <a-col :span="6">
            <a-col class="board-head" style="border-top-left-radius: 10px;">
              <span class="blue" style="font-weight: normal; font-size: 1.5em">土地/资产</span>
              <span style="float: right; cursor: pointer; font-size: 1.0em" class="tag-desc">MORE+</span>
            </a-col>
            <a-col class="board-body" style="border-bottom-left-radius: 10px; border-right: 2px solid #e9e9e9;">
              <h2 class="not-allow-txt-overflow">
                上海市奉贤区占地 150亩
              </h2>
              <h2 class="not-allow-txt-overflow">
                浙江省杭州市拱墅区地上占地面积浙江省杭州市拱墅区地上占地面积
              </h2>
              <h2 class="not-allow-txt-overflow">
                上海市奉贤区占地 150亩
              </h2>
              <div style="text-align: center">
                <a-button type="primary" size="small">发布土地/资产信息</a-button>
              </div>
            </a-col>
          </a-col>

          <a-col :span="6">
            <a-col class="board-head">
              <span class="blue" style="font-weight: normal; font-size: 1.5em">资金</span>
              <span style="float: right; cursor: pointer; font-size: 1.0em" class="tag-desc">MORE+</span>
            </a-col>
            <a-col class="board-body" style="border-right: 2px solid #e9e9e9">
              <h2 class="not-allow-txt-overflow">
                上海市奉贤区占地 150亩
              </h2>
              <h2 class="not-allow-txt-overflow">
                浙江省杭州市拱墅区地上占地面积浙江省杭州市拱墅区地上占地面积
              </h2>
              <h2 class="not-allow-txt-overflow">
                上海市奉贤区占地 150亩
              </h2>
              <div style="text-align: center">
                <a-button type="primary" size="small">发布资金信息</a-button>
              </div>
            </a-col>
          </a-col>

          <a-col :span="6">
            <a-col class="board-head" style="border-top-right-radius: 10px">
              <span class="blue" style="font-weight: normal; font-size: 1.5em">产业</span>
              <span style="float: right; cursor: pointer; font-size: 1.0em" class="tag-desc">MORE+</span>
            </a-col>
            <a-col class="board-body" style="border-bottom-right-radius: 10px;">
              <h2 class="not-allow-txt-overflow">
                上海市奉贤区占地 150亩
              </h2>
              <h2 class="not-allow-txt-overflow">
                浙江省杭州市拱墅区地上占地面积浙江省杭州市拱墅区地上占地面积
              </h2>
              <h2 class="not-allow-txt-overflow">
                上海市奉贤区占地 150亩
              </h2>
              <div style="text-align: center">
                <a-button type="primary" size="small">发布产业信息</a-button>
              </div>
            </a-col>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
<!--    my info end-->

<!--    estate info begin-->
    <a-row class="mt-40" :gutter="16">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="20">
        <a-row>
          <div class="left-blue part-title can-not-select" style="width: 100%">
            <h1 style="display:inline;">土地/资产转让信息</h1>
            <span style="float: right; cursor: pointer; font-size: 1.5em" class="tag-desc">MORE+</span>
          </div>
        </a-row>

        <a-row :gutter="24" class="mt-20">
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
<!--    estate info end-->

<!--    money info begin-->
    <a-row class="mt-40" :gutter="16">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="20">
        <a-row>
          <div class="left-blue part-title can-not-select" style="width: 100%">
            <h1 style="display:inline;">资金信息</h1>
            <span style="float: right; cursor: pointer; font-size: 1.5em" class="tag-desc">MORE+</span>
          </div>
        </a-row>

        <a-row :gutter="24" class="mt-20">
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
<!--    money info end-->

<!--    industry info begin-->
    <a-row class="mt-40" :gutter="16">
      <a-col style="border: 1px solid transparent" :span="2"></a-col>

      <a-col :span="20">
        <a-row>
          <div class="left-blue part-title can-not-select" style="width: 100%">
            <h1 style="display:inline;">产业资源信息</h1>
            <span style="float: right; cursor: pointer; font-size: 1.5em" class="tag-desc">MORE+</span>
          </div>
        </a-row>

        <a-row :gutter="24" class="mt-20">
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="info-pic-container">123</div>
            <div class="info-desc-container">
              <span class="info-desc-title">上海市奉贤区占地 150 亩</span>
              <br>
              <div>
                <span class="info-desc-content">发布时间：2021/11/25</span>
                <span class="info-desc-content" style="float: right"><a-icon type="eye" />300</span>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
<!--    industry info end-->
  </div>
</template>

<script>

export default {
  data () {
    return {}
  },
  created () {
    this.init()
  },
  methods: {
    init () {}
  }
}
</script>

<style scoped>
.info-desc-title {
  font-size: 20px;
}

.info-desc-content {
  color: #a1a1a1;
}

.info-desc-container {
  margin-top: 10px;
}

.info-pic-container {
  border-radius: 5px;
  background-color: #f2f4f5;
  height: 200px;
}

.board-body {
  padding: 10px;
  background-color: #f2f4f5;
  height: 83%;
}

.board-head{
  padding: 5px 10px;
  background-color: #ebecf0;
  height: 17%;
}

.banner {
  width: 100%;
  height: auto;
}

.banner-content {
  position: absolute;
  top: 30%;
  left: 200px;
  color: white;
}

.tag-card {
  box-shadow: 0 0 8px #a1a1a1;
  border-radius: 20px;
  height: 90px;
  cursor: pointer;
}
</style>
