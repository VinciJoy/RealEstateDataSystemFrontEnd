<template>
  <a-modal width="60%" :visible="progressModalVisible" :footer="null" @cancel="closeModal">
      <table class="mt-10" style="width: 100%" bordercolor="#e8e8e8" border="2">
        <tr>
          <th>里程碑节点</th>
          <th>客户</th>
          <th>完成时间</th>
          <th>详细说明</th>
          <th>记录人</th>
          <th>上传区</th>
        </tr>
        <tr>
          <th @dragover.prevent @drop="changeMilestone(0)" :rowspan="interestedList ? interestedList.length + 1 : 1">有客户感兴趣</th>
          <th @dragover.prevent @drop="changeMilestone(0)">-</th>
          <th @dragover.prevent @drop="changeMilestone(0)">-</th>
          <th @dragover.prevent @drop="changeMilestone(0)">-</th>
          <th @dragover.prevent @drop="changeMilestone(0)">-</th>
          <th @dragover.prevent @drop="changeMilestone(0)">-</th>
        </tr>
        <tr @dragover.prevent @drop="changeMilestone(0)" @dragstart="dragConsult = interested" draggable="true" v-if="interestedList" v-for="(interested, index) in interestedList" :key="'interested' + index">
          <td>{{ interested.userName }}<a @click="deleteInterested(interested.ID)"> [删除]</a></td>
          <td>{{ interested.updatedAt }}</td>
          <td><a-input v-model="interested.detail" @blur="changeDetail(interested)"></a-input></td>
          <td>{{ interested.adminName }}</td>
          <td>
            <a-upload
              name="file"
              :action="uploadFileURL"
              :default-file-list="interested.fileList"
              :multiple="true"
              :withCredentials="true"
              @change="handleChange($event, interested)"
            >
              <a-button type="primary">上传</a-button>
            </a-upload>
          </td>
        </tr>
        <tr>
          <th @dragover.prevent @drop="changeMilestone(1)" :rowspan="needContactList ? needContactList.length + 1 : 1">意向客户需与土地方见面</th>
          <th @dragover.prevent @drop="changeMilestone(1)">-</th>
          <th @dragover.prevent @drop="changeMilestone(1)">-</th>
          <th @dragover.prevent @drop="changeMilestone(1)">-</th>
          <th @dragover.prevent @drop="changeMilestone(1)">-</th>
          <th @dragover.prevent @drop="changeMilestone(1)">-</th>
        </tr>
        <tr @dragover.prevent @drop="changeMilestone(1)" @dragstart="dragConsult = item" draggable="true" v-if="needContactList" v-for="(item, index) in needContactList" :key="'needContactList' + index">
          <td>{{ item.userName }}<a @click="deleteInterested(item.ID)"> [删除]</a></td>
          <td>{{ item.updatedAt }}</td>
          <td><a-input v-model="item.detail" @blur="changeDetail(item)"></a-input></td>
          <td>{{ item.adminName }}</td>
          <td><a-button type="primary">上传</a-button></td>
        </tr>
        <tr>
          <th @dragover.prevent @drop="changeMilestone(2)" :rowspan="alreadyContactList ? alreadyContactList.length + 1 : 1">意向客户已与土地方见面</th>
          <th @dragover.prevent @drop="changeMilestone(2)">-</th>
          <th @dragover.prevent @drop="changeMilestone(2)">-</th>
          <th @dragover.prevent @drop="changeMilestone(2)">-</th>
          <th @dragover.prevent @drop="changeMilestone(2)">-</th>
          <th @dragover.prevent @drop="changeMilestone(2)">-</th>
        </tr>
        <tr @dragover.prevent @drop="changeMilestone(2)" @dragstart="dragConsult = item" draggable="true" v-if="alreadyContactList" v-for="(item, index) in alreadyContactList" :key="'alreadyContactList' + index">
          <td>{{ item.userName }}<a @click="deleteInterested(item.ID)"> [删除]</a></td>
          <td>{{ item.updatedAt }}</td>
          <td><a-input v-model="item.detail" @blur="changeDetail(item)"></a-input></td>
          <td>{{ item.adminName }}</td>
          <td><a-button type="primary">上传</a-button></td>
        </tr>
        <tr>
          <th @dragover.prevent @drop="changeMilestone(3)" :rowspan="alreadySignedList ? alreadySignedList.length + 1 : 1">会面凭证已签署</th>
          <th @dragover.prevent @drop="changeMilestone(3)">-</th>
          <th @dragover.prevent @drop="changeMilestone(3)">-</th>
          <th @dragover.prevent @drop="changeMilestone(3)">-</th>
          <th @dragover.prevent @drop="changeMilestone(3)">-</th>
          <th @dragover.prevent @drop="changeMilestone(3)">-</th>
        </tr>
        <tr @dragover.prevent @drop="changeMilestone(3)" @dragstart="dragConsult = item" draggable="true" v-if="alreadySignedList" v-for="(item, index) in alreadySignedList" :key="'alreadySignedList' + index">
          <td>{{ item.userName }}<a @click="deleteInterested(item.ID)"> [删除]</a></td>
          <td>{{ item.updatedAt }}</td>
          <td><a-input v-model="item.detail" @blur="changeDetail(item)"></a-input></td>
          <td>{{ item.adminName }}</td>
          <td><a-button type="primary">上传</a-button></td>
        </tr>
        <tr>
          <th @dragover.prevent @drop="changeMilestone(4)" :rowspan="negotiationList ? negotiationList.length + 1 : 1">双方已进入谈判阶段</th>
          <th @dragover.prevent @drop="changeMilestone(4)">-</th>
          <th @dragover.prevent @drop="changeMilestone(4)">-</th>
          <th @dragover.prevent @drop="changeMilestone(4)">-</th>
          <th @dragover.prevent @drop="changeMilestone(4)">-</th>
          <th @dragover.prevent @drop="changeMilestone(4)">-</th>
        </tr>
        <tr @dragover.prevent @drop="changeMilestone(4)" @dragstart="dragConsult = item" draggable="true" v-if="negotiationList" v-for="(item, index) in negotiationList" :key="'negotiationList' + index">
          <td>{{ item.userName }}<a @click="deleteInterested(item.ID)"> [删除]</a></td>
          <td>{{ item.updatedAt }}</td>
          <td><a-input v-model="item.detail" @blur="changeDetail(item)"></a-input></td>
          <td>{{ item.adminName }}</td>
          <td><a-button type="primary">上传</a-button></td>
        </tr>
        <tr>
          <th @dragover.prevent @drop="changeMilestone(5)" :rowspan="frameworkList ? frameworkList.length + 1 : 1">双方签署框架性协议</th>
          <th @dragover.prevent @drop="changeMilestone(5)">-</th>
          <th @dragover.prevent @drop="changeMilestone(5)">-</th>
          <th @dragover.prevent @drop="changeMilestone(5)">-</th>
          <th @dragover.prevent @drop="changeMilestone(5)">-</th>
          <th @dragover.prevent @drop="changeMilestone(5)">-</th>
        </tr>
        <tr @dragover.prevent @drop="changeMilestone(5)" @dragstart="dragConsult = item" draggable="true" v-if="frameworkList" v-for="(item, index) in frameworkList" :key="'frameworkList' + index">
          <td>{{ item.userName }}<a @click="deleteInterested(item.ID)"> [删除]</a></td>
          <td>{{ item.updatedAt }}</td>
          <td><a-input v-model="item.detail" @blur="changeDetail(item)"></a-input></td>
          <td>{{ item.adminName }}</td>
          <td><a-button type="primary">上传</a-button></td>
        </tr>
        <tr>
          <th @dragover.prevent @drop="changeMilestone(6)" :rowspan="formalList ? formalList.length + 1 : 1">双方签署正式协议</th>
          <th @dragover.prevent @drop="changeMilestone(6)">-</th>
          <th @dragover.prevent @drop="changeMilestone(6)">-</th>
          <th @dragover.prevent @drop="changeMilestone(6)">-</th>
          <th @dragover.prevent @drop="changeMilestone(6)">-</th>
          <th @dragover.prevent @drop="changeMilestone(6)">-</th>
        </tr>
        <tr @dragover.prevent @drop="changeMilestone(6)" @dragstart="dragConsult = item" draggable="true" v-if="formalList" v-for="(item, index) in formalList" :key="'formalList' + index">
          <td>{{ item.userName }}<a @click="deleteInterested(item.ID)"> [删除]</a></td>
          <td>{{ item.updatedAt }}</td>
          <td><a-input v-model="item.detail" @blur="changeDetail(item)"></a-input></td>
          <td>{{ item.adminName }}</td>
          <td>
            <a-upload
              name="file"
              :action="uploadFileURL"
              :file-list="item.fileList"
              :multiple="true"
              :withCredentials="true"
            >
              <a-button type="primary">上传</a-button>
            </a-upload>
          </td>
        </tr>

      </table>
    </a-modal>
</template>

<script>
import consultApi from '@system/api/consult'

export default {
  name: 'progressModal',
  props: {
    progressModalVisible: {
      type: Boolean,
      default: false
    },
    resourceType: {
      type: String,
      default: 'landResource'
    },
    progressResourceID: {
      type: Number
    }
  },
  data () {
    return {
      consultList: [],
      uploadFileURL: '',
      dragConsult: null
    }
  },
  watch: {
    'progressModalVisible' () {
      if (this.progressModalVisible) {
        this.init()
      }
    }
  },
  computed: {
    'interestedList' () {
      let ret = []
      if (!this.consultList) {
        return ret
      }
      for (let consult of this.consultList) {
        if (consult.milestone === 0) {
          ret.push(consult)
        }
      }
      return ret
    },
    'needContactList' () {
      let ret = []
      if (!this.consultList) {
        return ret
      }
      for (let consult of this.consultList) {
        if (consult.milestone === 1) {
          ret.push(consult)
        }
      }
      return ret
    },
    'alreadyContactList' () {
      let ret = []
      if (!this.consultList) {
        return ret
      }
      for (let consult of this.consultList) {
        if (consult.milestone === 2) {
          ret.push(consult)
        }
      }
      return ret
    },
    'alreadySignedList' () {
      let ret = []
      if (!this.consultList) {
        return ret
      }
      for (let consult of this.consultList) {
        if (consult.milestone === 3) {
          ret.push(consult)
        }
      }
      return ret
    },
    'negotiationList' () {
      let ret = []
      if (!this.consultList) {
        return ret
      }
      for (let consult of this.consultList) {
        if (consult.milestone === 4) {
          ret.push(consult)
        }
      }
      return ret
    },
    'frameworkList' () {
      let ret = []
      if (!this.consultList) {
        return ret
      }
      for (let consult of this.consultList) {
        if (consult.milestone === 5) {
          ret.push(consult)
        }
      }
      return ret
    },
    'formalList' () {
      let ret = []
      if (!this.consultList) {
        return ret
      }
      for (let consult of this.consultList) {
        if (consult.milestone === 6) {
          ret.push(consult)
        }
      }
      return ret
    }
  },
  methods: {
    async init () {
      this.uploadFileURL = process.env.API_ROOT + '/system/files/'
      this.getConsults()
    },
    deleteInterested (id) {
      consultApi.deleteConsult(id).then(res => {
        this.$success('删除成功！')
        this.getConsults()
      })
    },
    handleChange (info, item) {
      let fileList = [...info.fileList]

      fileList = fileList.map(file => {
        if (file.response) {
          delete file['originFileObj']
          file.url = this.uploadFileURL + 'temp/' + file.response.data.uuid
        }
        return file
      })
      if (info.file.status === 'done' || info.file.status === 'removed') {
        let f = JSON.stringify(info.fileList)
        consultApi.editConsult(item.ID, {
          fileList: f
        }).then(res => {
          this.$success('修改文件列表成功！')
          this.getConsults()
          this.loading = false
        })
      }
      item.fileList = fileList
    },
    closeModal () {
      this.$emit('closeProgressModal')
    },
    changeDetail (item) {
      this.loading = true
      consultApi.editConsult(item.ID, {
        detail: item.detail
      }).then(res => {
        this.$success('修改详细说明成功！')
        this.getConsults()
        this.loading = false
      })
    },
    getConsults () {
      consultApi.getConsults({
        pageSize: 100,
        resourceType: this.resourceType,
        resourceID: this.progressResourceID
      }).then(res => {
        if (res.data.data.consults) {
          for (let consult of res.data.data.consults) {
            if (consult.fileList) {
              consult.fileList = JSON.parse(consult.fileList)
            } else {
              consult.fileList = []
            }
          }
        }
        this.consultList = res.data.data.consults
      })
    },
    changeMilestone (milestone) {
      if (milestone === this.dragConsult.milestone) {
        return
      }
      this.loading = true
      consultApi.editConsult(this.dragConsult.ID, {
        milestone: milestone
      }).then(res => {
        this.$success('修改里程碑成功！')
        this.getConsults()
        this.loading = false
      })
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
