<template>
  <div>
    <a-modal
      :visible="editModalVisible"
      :title="editTitle"
      @cancel="editModalVisible = false"
      :maskClosable="false"
      @ok="performEdit"
    >
      <a-form-model
        ref="editForm"
        :model="editForm"
        :label-col="{span: 4}"
        :wrapper-col="{span: 20}"
      >
        <a-form-model-item label="用户名" prop="user_name" ref="user_name">
          <a-input
            v-model="editForm.user_name"
            tabindex="1"
            @blur="
               () => {
                 $refs.user_name.onFieldBlur()
               }"
          />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input
            tabindex="2"
            type="password"
            v-model="editForm.password"
            placeholder="该字段不为空则修改密码"
          />
        </a-form-model-item>
        <a-form-model-item label="角色" prop="role">
          <a-select v-model="editForm.role" style="width: 120px">
            <a-select-option :value="0">
              普通用户
            </a-select-option>
            <a-select-option :value="1">
              管理员
            </a-select-option>
            <a-select-option :disabled="true" :value="2">
              超级管理员
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="认证" prop="certificationVerified">
          <a-switch v-model="editForm.certificationVerified">
          </a-switch>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <div style="text-align: right">
      <a-input v-model="keywords" style="width: 200px" placeholder="搜索姓名、单位、电话" size="small"></a-input>
    </div>

    <a-table
      class="mt-10"
      :columns="columns"
      :data-source="users"
      :row-key="record => record.ID"
      :pagination="false"
      :loading="loading"
    >
      <span slot="role" slot-scope="text, record">
        {{ record | role2CN }}
      </span>
      <span slot="verify" @click="showCertificateModal(record)" slot-scope="text, record">
        <a>{{ text.certificationVerified | verified2CN }}</a>
      </span>
      <span slot="phone" slot-scope="text, record">
        <span>{{ text.certificate.phone ? text.certificate.phone : '/' }}</span>
      </span>
      <span slot="name" slot-scope="text, record">
        <span>{{ text.certificate.name ? text.certificate.name : '/' }}</span>
      </span>
      <span slot="company" slot-scope="text, record">
        <span>{{ text.certificate.company ? text.certificate.company : '/' }}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="goToEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="showDeleteModal(record)">删除</a>
      </span>
    </a-table>
    <a-row class="mt-20">
<!--      <a-button style="display: inline-block" type="primary" @click="goToAdd()"><a-icon type="plus" />新建</a-button>-->
      <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="pageIndex" :total="count" />
    </a-row>

    <userVerify @changed="init" :passedInCertificateForm="currentCertificateForm" :certificateModalVisible="certificateModalVisible" @closeUserVerifyModal="certificateModalVisible = false"></userVerify>

  </div>
</template>

<script>
import api from '@system/api/user'
import { ROLE } from '@/utils/constants'
import utils from '@/utils/utils'
import userVerify from '../../components/userVerify'

const columns = [
  {
    title: '用户名',
    dataIndex: 'user_name',
    key: 'user_name'
  },
  {
    title: '姓名',
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '电话',
    scopedSlots: {customRender: 'phone'}
  },
  {
    title: '单位',
    scopedSlots: {customRender: 'company'}
  },
  {
    title: '角色',
    scopedSlots: {customRender: 'role'}
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
    title: '认 证',
    key: 'verify',
    scopedSlots: { customRender: 'verify' }
  },
  {
    title: '操 作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'users',
  components: {
    userVerify
  },
  data () {
    return {
      loading: false,
      keywords: '',
      currentCertificateForm: {
        certificatePicList: []
      },
      editForm: {},
      editTitle: '',
      editModalVisible: false,
      columns: columns,
      users: [],
      pageSize: 20,
      pageIndex: 1,
      count: 0,
      certificateModalVisible: false
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    'pageIndex' () {
      this.init()
    },
    'count' () {
      if ((this.pageIndex - 1) * this.pageSize === this.count) this.pageIndex -= 1
    },
    'keywords' () {
      this.init()
    }
  },
  filters: {
    'role2CN': (text) => {
      if (text.role === ROLE.ADMIN) {
        return '管理员'
      }
      if (text.role === ROLE.SUPER_ADMIN) {
        return '超级管理员'
      }
      if (text.role === ROLE.NORMAL) {
        return '普通用户'
      }
    },
    'verified2CN': (text) => {
      if (text) {
        return '已认证'
      } else {
        return '未认证'
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      api.getUsers(this.pageSize, this.pageIndex, this.keywords).then(res => {
        this.count = res.data.data.count
        this.users = res.data.data.users
        this.loading = false
      })
    },
    showCertificateModal (record) {
      this.currentCertificateForm = record.certificate
      this.certificateModalVisible = true
    },
    performEdit () {
      api.editUser(this.editForm.ID, this.editForm).then(res => {
        this.$success('修改用户成功!')
        this.editModalVisible = false
        this.init()
      })
    },
    goToEdit (record) {
      this.editForm = utils.Copy(record)
      this.editTitle = record.user_name
      this.editModalVisible = true
    },
    performDelete (record) {
      api.deleteUser(record.ID).then(res => {
        this.$success('成功删除用户: ' + record.user_name)
        this.init()
      })
    },
    showDeleteModal (record) {
      this.$confirm({
        title: '删除',
        content: '是否确认删除 ' + record.user_name,
        onOk: () => {
          this.performDelete(record)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
