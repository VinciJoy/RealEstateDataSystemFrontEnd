<template>
  <div>
    <a-affix :offset-top="400">
      <a-button type="primary" style="float: right; width: 100px" @click="save">保 存</a-button>
    </a-affix>

    <a-row>
      <p class="input-tag">横幅图片：</p>
      <a-col v-for="(item, index) in form.bannerList" :key="'bannerList' + index">
        <img width="100%" :src="item.url" />
      </a-col>
      <a-col class="mt-10">
        <a-upload
          :action="uploadPicURL"
          name="file"
          :file-list="form.bannerList"
          :withCredentials="true"
          @change="handleChange($event, 'bannerList')"
        >
          <a-button><a-icon type="upload" /> 上传 </a-button>
        </a-upload>
      </a-col>
    </a-row>
    <a-row class="mt-20">
      <a-radio-group :value="currentBlock" class="mb-20" @change="switchBlock">
        <a-radio-button value="freeBlock">
          免费课程
        </a-radio-button>
        <a-radio-button value="vipBlock">
          会员专享
        </a-radio-button>
        <a-radio-button value="proBlock">
          私房高阶
        </a-radio-button>
      </a-radio-group>
      <a-row v-if="blockVisible">
        <a-col :span="24" style="background-color: #f2f4f5;margin-bottom: 10px; padding: 10px;border-radius: 5px" v-for="(item, index1) in form[currentBlock]" :key="currentBlock + index1">
          <a-col :span="24">
            模块标题：<a-input v-model.trim="item.title" style="width: 400px"></a-input><a @click="form[currentBlock].remove(item)" style="float: right">[删除]</a>
          </a-col>
          <a-col class="mt-10" :span="24">
            <a-col class="mb-20" :span="6" v-for="(video, index2) in item.videoList" :key="currentBlock + index1 + 'video' + index2">
              <videoBlock :desc="video.desc" :title="video.title" :thumbUrl="video.cover[0].thumbUrl"></videoBlock>
              <div @click="item.videoList.remove(video)" style="text-align: center; margin-top: 10px" class="clickable-txt">[删除]</div>
            </a-col>
            <a-col class="mb-20" :span="24">
              <a-button @click="addVideo(currentBlock, index1)" type="dashed" block>
                <a-icon type="plus" /> 添加视频
              </a-button>
            </a-col>
          </a-col>
        </a-col>
      </a-row>
      <a-button @click="form[currentBlock].push({videoList: []})" type="dashed" block>
        <a-icon type="plus" /> 添加模块
      </a-button>
    </a-row>

<!--    modal begin-->
    <a-modal :footer="null" width="80%" v-model="addVideoModalVisible">
      <a-row>
        <a-col v-if="item.type === typeToNumber[currentBlock]" @dblclick="performAddVideo(item)" class="mt-20" :span="8" v-for="(item, index) in videoList" :key="'video' + index">
          <videoBlock :desc="item.desc" :title="item.title" :thumbUrl="item.cover[0].thumbUrl"></videoBlock>
        </a-col>
      </a-row>
    </a-modal>
<!--    modal end-->
  </div>
</template>

<script>
import videoApi from '@system/api/video'
import videoBlock from '../../components/videoBlock'
import mobeiApi from '@system/api/mobeiStudy'

const typeToNumber = {
  'freeBlock': 0,
  'vipBlock': 1,
  'proBlock': 2
}

export default {
  name: 'mobeiStudy',
  components: {
    videoBlock
  },
  data () {
    return {
      typeToNumber,
      uploadPicURL: '',
      loading: false,
      currentBlock: 'freeBlock',
      addVideoModalVisible: false,
      videoList: [],
      currentPartIndex: 0,
      blockVisible: true,
      form: {
        bannerList: [],
        freeBlock: [],
        vipBlock: [],
        proBlock: []
      }
    }
  },
  mounted () {
    this.uploadPicURL = process.env.API_ROOT + '/system/pics/'
    this.getVideos()
    this.getMobeiStudy()
  },
  methods: {
    getMobeiStudy () {
      mobeiApi.getMobeiStudy().then(res => {
        this.form = JSON.parse(res.data.data.stringify)
      })
    },
    switchBlock (e) {
      this.currentBlock = e.target.value
    },
    getVideos () {
      videoApi.getVideos({
        pageSize: 10000
      }).then(res => {
        this.videoList = res.data.data.videos
        this.videoList = this.videoList.map(video => {
          video.cover = JSON.parse(video.cover)
          return video
        })
      })
    },
    save () {
      mobeiApi.createMobeiStudy(this.form).then(res => {
        this.$success('摩贝学堂修改成功！')
      })
    },
    addVideo (block, partIndex) {
      this.addVideoModalVisible = true
      this.currentBlock = block
      this.currentPartIndex = partIndex
    },
    performAddVideo (item) {
      this.form[this.currentBlock][this.currentPartIndex].videoList.push(item)
      this.addVideoModalVisible = false
    },
    handleChange (info, listName) {
      let fileList = [...info.fileList]
      fileList = fileList.map(file => {
        if (file.response) {
          delete file['originFileObj']
          file.url = process.env.API_ROOT + '/system/pics/temp/' + file.response.data.uuid + '/'
        }
        return file
      })
      this.form[listName] = fileList
    }
  }
}
</script>

<style scoped>

</style>
