<template>
  <a-row>
    <a-col :span="8" class="card">
      <a-col :span="8">
        <img src="/static/imgs/default.jpeg" style="width: 100%"/>
      </a-col>
      <a-col :span="16" style="padding-left: 10px">
        <div class="username">
          {{ userInfo.user_name }}
        </div>
        <div>
          <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID === 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />点击完成实名认证</a>
          <a v-if="!userInfo.certificationVerified && userInfo.certificate.ID !== 0" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: gray;" theme="filled" type="down-circle" />等待管理员认证</a>
          <a v-if="userInfo.certificationVerified" @click="certificateModalVisible = true" class="tag-desc"><a-icon style="color: forestgreen;" theme="filled" type="down-circle" />已完成实名认证</a>
          <userVerify @changed="certificateChange" :editable="(userInfo.certificate.ID === 0) && (!userInfo.certificationVerified)" :passedInCertificateForm="certificateForm" :certificateModalVisible="certificateModalVisible" @closeUserVerifyModal="certificateModalVisible = false"></userVerify>
        </div>
      </a-col>
    </a-col>
  </a-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import userVerify from '../../components/userVerify'

export default {
  name: 'userInfo',
  components: {
    userVerify
  },
  data () {
    return {
      certificateModalVisible: false,
      certificateForm: {
        certificatePicList: []
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions(['getUserInfo']),
    init () {
      this.certificateForm = this.userInfo.certificate
    },
    async certificateChange () {
      await this.getUserInfo()
      this.init()
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border: 1px solid #ebeef5;
  transition: .3s;
  border-radius: 4px;
  padding: 10px;
}

.username{
  font-size: 24px;
  font-weight: 700;
  color: #409eff;
}
</style>
