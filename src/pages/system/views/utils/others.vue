<template>
  <div>
    <div id="ss" class="sample-spreadsheets" style="width: 100%; height: 300px"></div>
    <input type="file" id="upload_excel" />
    <a-button @click="uploadExcel">123</a-button>
  </div>
</template>

<script>
export default {
  name: 'others',
  data () {
    return {
      spread: {},
      excelIO: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // eslint-disable-next-line no-undef
      this.spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 3 })
      // eslint-disable-next-line no-undef
      this.excelIO = new GC.Spread.Excel.IO()
    },
    uploadExcel () {
      let excelFile = document.getElementById('upload_excel').files[0]
      this.excelIO.open(excelFile, (json) => {
        this.spread.fromJSON(json)
      }, function (e) {
        alert('文件读取失败，仅支持xlsx类型')
      })
    }
  }
}
</script>

<style scoped>

</style>
