<template>
  <a-modal
    :visible="buyItemVisible"
    @cancel="closeBuyItem"
    width="40%"
  >
    <template slot="title">
      <div style="text-align: center">
        {{ title }}
      </div>
    </template>
    <a-row>
      <a-col style="border: 1px solid transparent" :span="8"></a-col>
      <a-col class="membership-type-container" :span="8">
        <div @click="BuyItem" class="membership-type">
          <h2>{{ content }}</h2>
          <p class="blue">{{ price }} 元</p>
        </div>
      </a-col>
    </a-row>
    <div style="padding: 10px" slot="footer">
      <a-radio :checked="accepted" @click="accepted = !accepted"  style="text-align: left">我已阅读并同意摩贝会员相关条款</a-radio>
      <span class="clickable-txt" style="margin-right: 10px">会员权益</span>
      <span class="clickable-txt">会员条款</span>
    </div>
  </a-modal>
</template>

<script>
import alipayApi from '@system/api/alipay'

export default {
  name: 'buyItem',
  props: {
    buyItemVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    },
    content: {
      type: String,
      default: ''
    },
    itemType: {
      type: String,
      default: 'video'
    },
    price: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      accepted: false
    }
  },
  methods: {
    BuyItem () {
      alipayApi.buyItem({
        itemType: 'video',
        id: this.id
      }).then(res => {
        window.open(res.data.data.payURL)
      })
    },
    closeBuyItem () {
      this.$emit('closeBuyItem')
    }
  }
}
</script>

<style scoped>
.membership-type {
  background-color: #eaeaea;
  height: 200px;
  cursor: pointer;
  width: 200px;
  margin: auto;
  padding: 20px;
  text-align: center;
  border-radius: 20px;
}

.blue {
  font-weight: bolder;
  font-size: 25px;
}

.date {
  color: #aaaaaa;
}

.membership-type-container {}
</style>
