<template>
  <div>
    <a-row>
      视频列表：
      <a-table
      :columns="columns"
      :data-source="videoList"
      :row-key="record => record.ID"
      :pagination="false"
      :loading="loading"
    >
      <span slot="title" slot-scope="text, record">
        {{ text.title }}
      </span>
      <span slot="visible" slot-scope="text, record">
        <a-switch v-model="record.visible" @click="editVideo(record.ID, {visible: record.visible})" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="goToEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="deleteVideo(record.ID)">删除</a>
      </span>
    </a-table>
      <a-row class="mt-20">
        <a-button style="display: inline-block" type="primary" @click="goToAdd()"><a-icon type="plus" />新建</a-button>
        <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="pageIndex" :total="count" />
      </a-row>

    </a-row>

<!--    modal begin-->
    <a-modal
      width="60%"
      @cancel="videoModalVisible = false"
      :visible="videoModalVisible"
      title="添加视频"
      @ok="saveVideo"
    >
      <p>
        视频标题：
        <a-input v-model.trim="videoForm.title" style="width: 60%"></a-input>
      </p>
      <p>
        URL地址：
        <a-input v-model.trim="videoForm.url" style="width: 60%"></a-input>
      </p>
      <p>
        视频描述：
        <a-input v-model.trim="videoForm.desc" style="width: 60%"></a-input>
      </p>
      <p>
        标签\系列:
        <a-select v-model.trim="videoForm.tags" mode="tags" style="width: 60%" placeholder="请选择标签">
        </a-select>
      </p>
      <p>
        视频分类：
        <a-select v-model="videoForm.type" style="width: 120px">
          <a-select-option :value="0">
            免费课程
          </a-select-option>
          <a-select-option :value="1">
            会员专享
          </a-select-option>
          <a-select-option :value="2">
            私房高阶
          </a-select-option>
        </a-select>
      </p>
      <p v-if="videoForm.type === 2">
        视频价格：<a-input v-model="videoForm.price" type="number" style="width: 120px"></a-input>
      </p>
      视频封面：
      <a-col v-for="(item, index) in videoForm.coverList" :key="'bannerList' + index">
        <img width="50%" :src="item.thumbUrl" />
      </a-col>
      <a-col class="mt-10">
        <a-upload
          name="file"
          :withCredentials="true"
          :before-upload="transformCoverPic"
          @change="handleChange"
          :showUploadList="false"
        >
          <a-button v-if="videoForm.coverList.length < 1"><a-icon type="upload" /> 上传 </a-button>
          <a-button @click.stop="videoForm.coverList = []" v-else><a-icon type="delete" /> 删除 </a-button>
        </a-upload>
      </a-col>
    </a-modal>

    <a-modal :footer="null" v-model="cropperModalVisible" width="600px">
      <div style="height: 550px; width: 550px">
        <VueCropper
          ref="cropper"
          :img="cropperImg"
          :autoCrop="true"
          :centerBox="true"
          :canScale="true"
          :fixed="true"
          :fixedNumber="[4,3]"
        ></VueCropper>
      </div>
      <a-row style="text-align: center" class="mt-10">
        <a-button type="primary" style="margin-left:40px;width: 20%" @click="saveCoverPic">保 存</a-button>
      </a-row>
    </a-modal>
<!--    modal end-->
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import picApi from '@system/api/pic'
import videoApi from '@system/api/video'

const columns = [
  {
    title: '标 题',
    key: 'title',
    scopedSlots: { customRender: 'title' }
  },
  {
    title: '创建者',
    dataIndex: 'creator',
    key: 'creator'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt'
  },
  {
    title: '可 见',
    key: 'visible',
    scopedSlots: { customRender: 'visible' }
  },
  {
    title: '操 作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'videoManage',
  components: {
    VueCropper
  },
  data () {
    return {
      videoList: [],
      videoForm: {
        coverList: [],
        type: 0,
        desc: '',
        price: 0,
        tags: []
      },
      columns: columns,
      cropperImg: '',
      pageSize: 10,
      pageIndex: 0,
      count: 0,
      videoModalVisible: false,
      cropperModalVisible: false,
      loading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getVideos()
    },
    getVideos () {
      videoApi.getVideos({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }).then(res => {
        this.videoList = res.data.data.videos
      })
    },
    goToAdd () {
      this.videoForm = {
        coverList: []
      }
      this.videoModalVisible = true
    },
    goToEdit (record) {
      this.videoForm.ID = record.ID
      this.videoForm.url = record.url
      this.videoForm.title = record.title
      this.videoForm.type = record.type
      this.videoForm.price = record.price
      this.videoForm.tags = record.tags.split(',')
      this.videoForm.desc = record.desc
      this.videoForm.coverList = JSON.parse(record.cover)
      this.videoModalVisible = true
      this.videoForm.tags.remove('')
    },
    saveVideo () {
      let form = {}
      if (!this.videoForm.title) {
        this.$error('视频标题不能为空！')
        return
      }
      if (!this.videoForm.url) {
        this.$error('URL地址不能为空！')
        return
      }
      if (!this.videoForm.coverList || !this.videoForm.coverList.length) {
        this.$error('视频封面不能为空！')
        return
      }

      form.cover = JSON.stringify(this.videoForm.coverList)
      form.title = this.videoForm.title
      form.url = this.videoForm.url
      form.type = this.videoForm.type
      form.desc = this.videoForm.desc
      form.tags = this.videoForm.tags.join(',')
      form.price = this.videoForm.price - ''

      if (this.videoForm.ID) {
        // edit mode
        videoApi.editVideo(this.videoForm.ID, form).then(res => {
          this.$success('修改视频成功！')
          this.getVideos()
          this.videoModalVisible = false
        })
      } else {
        videoApi.createVideo(form).then(res => {
          this.$success('创建视频成功！')
          this.getVideos()
          this.videoModalVisible = false
        })
      }
    },
    async saveCoverPic () {
      let thumb = null
      await this.$refs.cropper.getCropData(data => {
        thumb = data
      })
      this.$refs.cropper.getCropBlob(data => {
        picApi.uploadPic(data).then((res) => {
          this.videoForm.coverList = [{
            response: res.data,
            uuid: res.data.data.uuid,
            uid: '-1',
            name: 'cover.jpg',
            status: 'done',
            thumbUrl: thumb
          }]
          this.cropperModalVisible = false
        })
      })
    },
    handleChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.map(file => {
        if (file.response) {
          delete file['originFileObj']
          file.url = process.env.API_ROOT + '/system/pics/temp/' + file.response.data.uuid + '/'
          this.videoForm.coverList = fileList
        }
        return file
      })
    },
    editVideo (id, form) {
      videoApi.editVideo(id, form).then(res => {
        this.$success('修改视频成功！')
        this.getVideos()
        this.videoModalVisible = false
      })
    },
    deleteVideo (id) {
      videoApi.deleteVideo(id).then(res => {
        this.$success('删除视频成功！')
        this.getVideos()
      })
    },
    transformCoverPic (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.cropperImg = reader.result
        this.cropperModalVisible = true
      }
      return false
    }
  }
}
</script>

<style scoped>

</style>
