<template>
  <div>
<!--    <a-table-->
<!--      :columns="columns"-->
<!--      :data-source="landResources"-->
<!--      :row-key="record => record.ID"-->
<!--      :pagination="false"-->
<!--      :loading="loading"-->
<!--    >-->
<!--      <span slot="recommendation" slot-scope="text, record">-->
<!--        <a-select style="width: 70px" v-model="record.recommendation" @change="changeRecommendation(record)">-->
<!--          <a-select-option v-for="i of 11" :value="i - 1" :key="i - 1">-->
<!--            {{ i - 1 }}-->
<!--          </a-select-option>-->
<!--        </a-select>-->
<!--      </span>-->
<!--      <span slot="visible" slot-scope="text, record">-->
<!--        <a-switch :disabled="!utils.IsAdmin(userInfo.role)" v-model="record.visible" @click="changeVisible(record)" />-->
<!--      </span>-->
<!--      <span slot="action" slot-scope="text, record">-->
<!--        <a @click="goToEdit(record)">编辑</a>-->
<!--        <a-divider type="vertical" />-->
<!--        <a @click="deleteLandResource(record.ID)">删除</a>-->
<!--      </span>-->
<!--    </a-table>-->
    <a-row class="mt-20">
      <a-button style="display: inline-block" type="primary" @click="goToAdd()"><a-icon type="plus" />新建</a-button>
      <a-pagination style="display: inline-block; float: right;" :page-size="pageSize" v-model="pageIndex" :total="count" />
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'industryResource',
  data () {
    return {
      pageSize: 0,
      pageIndex: 1,
      count: 0
    }
  },
  methods: {
    goToAdd () {
      this.$router.push('publish_industry_resource/')
    }
  }
}
</script>

<style scoped>

</style>
