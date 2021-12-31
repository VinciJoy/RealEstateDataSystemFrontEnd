<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="landResources"
      :row-key="record => record.ID"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="goToEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a>删除</a>
      </span>
    </a-table>
  </div>
</template>

<script>
import api from '@system/api/landResource'

const columns = [
  {
    title: 'title',
    dataIndex: 'Title',
    key: 'title'
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'landResource',
  data () {
    return {
      columns: columns,
      landResources: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      api.getLandResources().then(res => {
        this.landResources = res.data.data.landResources
      })
    },
    goToEdit (record) {
      this.$router.push('publish_land_resource/' + record.ID)
    }
  }
}
</script>

<style scoped>

</style>
