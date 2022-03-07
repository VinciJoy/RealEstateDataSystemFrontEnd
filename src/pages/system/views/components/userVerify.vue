<template>
  <div>
    <a-modal :visible="certificateModalVisible" width="80%" :footer="null" title="身份认证" @cancel="closeModal">
      <a-row :gutter="20">
        <a-col :span="12" style="border-right: 2px solid #e0e0e0">
          <a-form-model
            :model="certificateForm"
            ref="certificateForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 17 }"
            :rules="certificateRules"
          >
            <a-form-model-item label="姓名" prop="name">
              <a-input :disabled="!editable" v-model="certificateForm.name" />
            </a-form-model-item>
<!--            <a-form-model-item label="发布人身份" prop="identity">-->
<!--              <a-select :disabled="!editable" v-model="certificateForm.identity" style="width: 60%">-->
<!--                <a-select-option v-for="identity in identities" :value="identity" :key="identity">-->
<!--                  {{ identity }}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
<!--            </a-form-model-item>-->
            <a-form-model-item label="所属公司" prop="company">
              <a-input :disabled="!editable" v-model="certificateForm.company" />
            </a-form-model-item>
            <a-form-model-item label="职位" prop="position">
              <a-input :disabled="!editable" v-model="certificateForm.position" />
            </a-form-model-item>
          </a-form-model>
        </a-col>
        <a-col :span="12">
          <p>证明材料</p>
          <a-upload
            :action="uploadPicURL"
            name="file"
            :file-list="certificateForm.certificatePicList"
            :withCredentials="true"
            @preview="handlePreview"
            class="file-uploader"
            :disabled="!editable"
            list-type="picture-card"
            @change="handleChange($event, 'certificateForm','certificatePicList')"
          >
            <div v-if="certificateForm.certificatePicList.length < 1">
              <a-icon :type="loading ? 'loading' : 'plus'" />
            </div>
          </a-upload>
          <p style="color: #9c9c9c">
            选填，可为名片、OA通讯录/流程截图等
          </p>
          <p style="color: #9c9c9c">
            录入后可显示实名认证标志
          </p>
        </a-col>
      </a-row>
      <a-row style="text-align: center" class="mt-10">
        <a-button style="width: 20%" @click="closeModal">取 消</a-button>
        <a-button :disabled="!editable" type="primary" style="margin-left:40px;width: 20%" @click="submitCertificateForm">提 交</a-button>
      </a-row>
    </a-modal>

    <a-modal width="80%" :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import api from '@system/api/user'
import { HTTP } from '@/utils/constants'
import utils from '@/utils/utils'
import {mapActions} from 'vuex'

const identities = [
  '项目土地方',
  '项目权属单位管理人员',
  '项目居间方',
  '项目介绍方'
]

export default {
  name: 'userVerify',
  props: {
    certificateModalVisible: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    uploadPicURL: {
      type: String,
      default: process.env.API_ROOT + '/system/pics/'
    },
    passedInCertificateForm: {
      type: Object,
      default: function () {
        return {
          certificatePicList: []
        }
      }
    }
  },
  watch: {
    'certificateModalVisible': function () {
      this.initForm()
    }
  },
  data () {
    return {
      certificateForm: {
        certificatePicList: []
      },
      certificateRules: {
        name: [
          {required: true, message: '姓名不能为空!', trigger: 'blur'}
        ],
        position: [
          {required: true, message: '职位不能为空!', trigger: 'blur'}
        ],
        company: [
          {required: true, message: '所属公司不能为空!', trigger: 'blur'}
        ]
        // identity: [
        //   {required: true, message: '请选择发布人身份!', trigger: 'blur'}
        // ],
      },
      identities: identities,
      previewImage: '',
      previewVisible: false,
      loading: false
    }
  },
  methods: {
    ...mapActions(['getUserInfo']),
    closeModal () {
      this.$emit('closeUserVerifyModal')
    },
    initForm () {
      this.certificateForm = utils.Copy(this.passedInCertificateForm)
      let tempList = []
      if (this.certificateForm && this.certificateForm.pictures) {
        for (let pic of this.certificateForm.pictures) {
          tempList.push({
            uuid: pic.uuid,
            uid: pic.uuid,
            name: pic.uuid,
            status: 'done',
            thumbUrl: (process.env.API_ROOT + '/system/pics/' + pic.uuid + '/'),
            response: {
              code: HTTP.SUCCESS,
              data: {
                uuid: pic.uuid
              }
            }
          })
        }
      }
      this.$set(this.certificateForm, 'certificatePicList', tempList)
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
      this.previewImage = (process.env.API_ROOT + '/system/pics/' + file.uuid + '/') || file.preview
      this.previewVisible = true
    },
    submitCertificateForm () {
      let data = {}
      Object.assign(data, this.certificateForm)
      data.certificatePicList = []
      for (let i = 0; i < this.certificateForm.certificatePicList.length; i++) {
        if (this.certificateForm.certificatePicList[i].response.code === HTTP.SUCCESS) {
          data.certificatePicList.push(this.certificateForm.certificatePicList[i].response.data.uuid)
        }
      }
      this.$refs.certificateForm.validate(valid => {
        if (valid) {
          if (this.certificateForm.ID) {
            api.editCertificateForm(data).then(() => {
              this.$success('身份认证修改成功!')
              this.getUserInfo()
              this.closeModal()
              this.$emit('changed')
            })
            return
          }
          api.submitCertificateForm(data).then(() => {
            this.$success('身份认证成功!')
            this.getUserInfo()
            this.closeModal()
            this.$emit('changed')
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
