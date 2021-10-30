<template>
  <div class="board">
    <p style="font-weight: bolder">税前利润</p>
    <a-row :gutter="20">
      <a-col :span="4" v-for="i of inputList" :key="i.cell">
        {{ i.title }}: <a-input type="number" :id="i.cell" v-model="i.value"/>
      </a-col>
    </a-row>

    <a-row style="margin-top: 20px">
      <a-button @click="refresh()" type="primary" style="float:right;">计 算</a-button>
    </a-row>

    <a-row :gutter="20" class="result-board">
      <a-col class="result-title">
        {{ (history && history.length > 0 ? history[history.length - 1].title : '0') + '年' }}
        <a-button style="float: right;" @click="showHistory">历史追溯</a-button>
      </a-col>
      <a-row class="total">
        <a-col :span="12">
          <a-col :span="10" class="result-info">
            {{ (history && history.length > 0 ? history[history.length - 1].title : '0') + '年亏损弥补总额' }}
          </a-col>
          <a-col :span="10" class="result-info">
            {{ history && history.length > 0 ? history[history.length - 1].data[5] : '-' }} 元
          </a-col>
        </a-col>
        <a-col :span="12">
          <a-col :span="10" class="result-info">
            {{ (history && history.length > 0 ? history[history.length - 1].title : '0') + '年应税利润' }}
          </a-col>
          <a-col :span="10" class="result-info">
            {{ history && history.length > 0 ? history[history.length - 1].data[6] : '-' }} 元
          </a-col>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12" v-for="index of 5" :key="'result' + index">
          <a-col :span="10" class="result-info">
            利用{{ history && history.length > 0 ? parseInt(history[history.length - 1].title) - index : 0 | filterNaN }}年亏损弥补
          </a-col>
          <a-col :span="10" class="result-info">
            {{ history && history.length > 0 ? history[history.length - 1].data[index - 1] : '-' }} 元
          </a-col>
        </a-col>
      </a-row>
    </a-row>

    <a-modal
      title="历史追溯"
      :visible="historyModalVisible"
      :footer="null"
      @cancel="historyModalVisible = false"
      :width="1000"
    >
      <div>
        <a-row :gutter="20" class="result-board" v-for="(h, index) of history" :key="'history' + index">
          <a-col class="result-title">
            {{ h.title + '年' }}
          </a-col>
          <a-row class="total">
            <a-col :span="12">
              <a-col :span="10" class="result-info">
                {{ h.title + '年亏损弥补总额' }}
              </a-col>
              <a-col :span="10" class="result-info">
                {{ history[index].data[5]}} 元
              </a-col>
            </a-col>
            <a-col :span="12">
              <a-col :span="10" class="result-info">
                {{ history[index].title + '年应税利润' }}
              </a-col>
              <a-col :span="10" class="result-info">
                {{ history[index].data[6] }} 元
              </a-col>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" v-for="index of 5" :key="'result' + index">
              <a-col :span="10" class="result-info">
                利用{{ parseInt(h.title) - index | filterNaN }}年亏损弥补
              </a-col>
              <a-col :span="10" class="result-info">
                {{ h.data[index - 1] }} 元
              </a-col>
            </a-col>
          </a-row>
        </a-row>
      </div>
    </a-modal>

    <div id="ss" class="sample-spreadsheets" hidden="hidden"></div>
  </div>
</template>

<script>
const BASE_YEAR = 2021

export default {
  data () {
    return {
      transCol: {
        'A': 1,
        'B': 2,
        'C': 3,
        'D': 4,
        'E': 5,
        'F': 6,
        'G': 7,
        'H': 8,
        'I': 9,
        'J': 10,
        'K': 11,
        'L': 12,
        'M': 13,
        'N': 14,
        'O': 15,
        'P': 16,
        'Q': 17,
        'R': 18,
        'S': 19,
        'T': 20,
        'U': 21,
        'V': 22,
        'W': 23,
        'X': 24,
        'Y': 25,
        'Z': 26
      },
      inputList: [
        {
          title: BASE_YEAR,
          cell: 'C3',
          value: 0
        },
        {
          title: BASE_YEAR + 1,
          cell: 'D3',
          value: 0
        },
        {
          title: BASE_YEAR + 2,
          cell: 'E3',
          value: 0
        },
        {
          title: BASE_YEAR + 3,
          cell: 'F3',
          value: 0
        },
        {
          title: BASE_YEAR + 4,
          cell: 'G3',
          value: 0
        },
        {
          title: BASE_YEAR + 5,
          cell: 'H3',
          value: 0
        },
        {
          title: BASE_YEAR + 6,
          cell: 'I3',
          value: 0
        },
        {
          title: BASE_YEAR + 7,
          cell: 'J3',
          value: 0
        },
        {
          title: BASE_YEAR + 8,
          cell: 'K3',
          value: 0
        },
        {
          title: BASE_YEAR + 9,
          cell: 'L3',
          value: 0
        },
        {
          title: BASE_YEAR + 10,
          cell: 'M3',
          value: 0
        },
        {
          title: BASE_YEAR + 11,
          cell: 'N3',
          value: 0
        },
        {
          title: BASE_YEAR + 12,
          cell: 'O3',
          value: 0
        },
        {
          title: BASE_YEAR + 13,
          cell: 'P3',
          value: 0
        },
        {
          title: BASE_YEAR + 14,
          cell: 'Q3',
          value: 0
        }
      ],
      currentYearIndex: 0,
      currentYearResult: null,
      historyModalVisible: false,
      currentYearCell: null,
      currentYearTitle: null,
      history: [],
      fileName: '',
      excelIo: {},
      spread: {},
      spreadStyle: {
        width: '100%',
        height: '430px'
      }
    }
  },
  // watch: {
  //   'inputValues' () {
  //     this.refresh()
  //   }
  // },
  // computed: {
  //   inputValues () {
  //     let ret = ''
  //     for (let i of this.inputList) {
  //       ret += i.value
  //     }
  //     return ret
  //   },
  //   currentYearCell () {
  //     let cell = null
  //     for (let i of this.inputList) {
  //       if (i.value !== 0) {
  //         cell = i.cell
  //       }
  //     }
  //     return cell
  //   }
  // },
  mounted () {
    this.init()
  },
  filters: {
    filterNaN (num) {
      if (isNaN(num)) return 0
      return num
    }
  },
  methods: {
    init () {
      // eslint-disable-next-line no-undef
      let spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), { sheetCount: 1 })
      // eslint-disable-next-line no-undef
      this.initSpread(spread)
      this.getCurrentYearInfo()
      this.getCurrentYearResult(spread)
    },
    showHistory () {
      this.historyModalVisible = true
    },
    getCurrentYearInfo () {
      let current = null
      let cell = null
      let index = 0
      for (let i in this.inputList) {
        if (parseInt(this.inputList[i].value) !== 0) {
          current = this.inputList[i].title
          cell = this.inputList[i].cell
          index = i
        }
      }
      this.currentYearIndex = index
      this.currentYearCell = cell
      this.currentYearTitle = current
    },
    refresh () {
      // eslint-disable-next-line no-undef
      let spread = GC.Spread.Sheets.findControl(document.getElementById('ss'))
      this.initSpread(spread)
      this.getCurrentYearInfo()
      this.getCurrentYearResult(spread)
    },
    getCurrentYearResult (spread) {
      let cell = this.currentYearCell
      if (cell === null) {
        return
      }
      // let col = parseInt(cell.match(/\d+/))
      let row = cell.match(/[A-Z]+/)[0]
      // eslint-disable-next-line no-undef
      let sheet = spread.getActiveSheet()
      this.history = []
      for (let i = 2; i < this.transCol[row]; i++) {
        let temp = [
          sheet.getValue(3, i),
          sheet.getValue(4, i),
          sheet.getValue(5, i),
          sheet.getValue(6, i),
          sheet.getValue(7, i),
          sheet.getValue(8, i),
          sheet.getValue(9, i),
          i - 2 > 5 ? 5 : i - 2
        ]

        for (let i = 0; i < temp.length; i++) {
          if (temp[i] === null) {
            temp[i] = '-'
          }
          if (temp[i] === false) {
            temp[i] = 0
          }
        }

        let validIndex = temp[7] - 1
        let begin = 0
        // 对有效亏损弥补年份进行一下反转，是下标和年份对上
        while (begin < validIndex) {
          let tempValue = temp[begin]
          temp[begin] = temp[validIndex]
          temp[validIndex] = tempValue
          begin += 1
          validIndex -= 1
        }

        // data = [一年前亏损弥补(今年 - 1), 二年前亏损弥补(今年 - 2), 三年前亏损弥补, 四年前亏损弥补, 五年前亏损弥补, 亏损弥补总额, 应税利润, 有效弥补年份]
        this.history.push({
          title: BASE_YEAR + i - 2,
          data: temp
        })
      }
    },
    initSpread (spread) {
      let sheet = spread.getActiveSheet()
      let value = {
        C3: parseFloat(document.getElementById('C3').value),
        D3: parseFloat(document.getElementById('D3').value),
        E3: parseFloat(document.getElementById('E3').value),
        F3: parseFloat(document.getElementById('F3').value),
        G3: parseFloat(document.getElementById('G3').value),
        H3: parseFloat(document.getElementById('H3').value),
        I3: parseFloat(document.getElementById('I3').value),
        J3: parseFloat(document.getElementById('J3').value),
        K3: parseFloat(document.getElementById('K3').value),
        L3: parseFloat(document.getElementById('L3').value),
        M3: parseFloat(document.getElementById('M3').value),
        N3: parseFloat(document.getElementById('N3').value),
        O3: parseFloat(document.getElementById('O3').value),
        P3: parseFloat(document.getElementById('P3').value),
        Q3: parseFloat(document.getElementById('Q3').value)
      }
      // eslint-disable-next-line no-undef
      let source = new GC.Spread.Sheets.Bindings.CellBindingSource(value)

      sheet.setBindingPath(2, 2, 'C3')
      sheet.setBindingPath(2, 3, 'D3')
      sheet.setBindingPath(2, 4, 'E3')
      sheet.setBindingPath(2, 5, 'F3')
      sheet.setBindingPath(2, 6, 'G3')
      sheet.setBindingPath(2, 7, 'H3')
      sheet.setBindingPath(2, 8, 'I3')
      sheet.setBindingPath(2, 9, 'J3')
      sheet.setBindingPath(2, 10, 'K3')
      sheet.setBindingPath(2, 11, 'L3')
      sheet.setBindingPath(2, 12, 'M3')
      sheet.setBindingPath(2, 13, 'N3')
      sheet.setBindingPath(2, 14, 'O3')
      sheet.setBindingPath(2, 15, 'P3')
      sheet.setBindingPath(2, 16, 'Q3')
      sheet.setDataSource(source)

      sheet.setFormula(9, 2, '=IF(C3<0,0,C3-C9)')

      sheet.setFormula(3, 3, '=IF(D3<0,0,IF(AND(C3+D3<0,C3+D3<0),D3,IF(C3>0,0,ABS(C3))))')
      sheet.setFormula(8, 3, '=SUM(D4:D8)')
      sheet.setFormula(9, 3, '=IF(D3<0,0,D3-D9)')

      sheet.setFormula(3, 4, '=IF(E3<0,0,IF(AND(C3+D4+E3<0,C3+D4+D3+E3<0),E3,IF(C3>0,0,IF(ABS(C3)>E3,MIN(E3,ABS(C3)-D4),ABS(C3)-D4))))')
      sheet.setFormula(4, 4, '=IF(E3<0,0,IF(AND(C3+D4+D3+E3<0,C3+D4+D3+E3<0),E3-E4,IF(D3>0,0,IF(ABS(D3)>E3-E4,MIN(E3-E4,ABS(D3),ABS(D3))))))')
      sheet.setFormula(8, 4, '=SUM(E4:E8)')
      sheet.setFormula(9, 4, '=IF(E3<0,0,E3-E9)')

      sheet.setFormula(3, 5, '=IF(F3<0,0,IF(AND((C3+D4+E4)+F3<0,(C3+D4+E4)+(D3+E5)+E3+F3<0),F3,IF(C3>0,0,IF(ABS(C3)>F3,MIN(F3,ABS(C3)-D4-E4),ABS(C3)-D4-E4))))')
      sheet.setFormula(4, 5, '=IF(F3<0,0,IF(AND(C3+D4+E4+D3+E5+F3<0,C3+D4+E4+D3+E5+E3+F3<0),F3-F4,IF(D3>0,0,IF(ABS(D3)>F3-F4,MIN(F3-F4,ABS(D3)-E5),ABS(D3)-E5))))')
      sheet.setFormula(5, 5, '=IF(F3<0,0,IF(AND((C3+D4+E4)+(D3+E5)+E3+F3<0,(C3+D4+E4)+(D3+E5)+E3+F3<0),F3-F4-F5,IF(E3>0,0,IF(ABS(E3)>F3-F4-F5,MIN(F3-F4-F5,ABS(E3)),ABS(E3)))))')
      sheet.setFormula(8, 5, '=SUM(F4:F8)')
      sheet.setFormula(9, 5, '=IF(F3<0,0,F3-F9)')

      sheet.setFormula(3, 6, '=IF(G3<0,0,IF(AND((C3+D4+E4+F4)+G3<0,(C3+D4+E4+F4)+(D3+E5+F5)+(E3+F6)+F3+G3<0),G3,IF(C3>0,0,IF(ABS(C3)>G3,MIN(G3,ABS(C3)-D4-E4-F4),ABS(C3)-D4-E4-F4))))')
      sheet.setFormula(4, 6, '=IF(G3<0,0,IF(AND((C3+D4+E4+F4)+(D3+E5+F5)+G3<0,(C3+D4+E4+F4)+(D3+E5+F5)+(E3+F6)+F3+G3<0),G3-G4,IF(D3>0,0,IF(ABS(D3)>G3-G4,MIN(G3-G4,ABS(D3)-E5-F5),ABS(D3)-E5-F5))))')
      sheet.setFormula(5, 6, '=IF(G3<0,0,IF(AND((C3+D4+E4+F4)+(D3+E5+F5)+(E3+F6)+G3<0,(C3+D4+E4+F4)+(D3+E5+F5)+(E3+F6)+F3+G3<0),G3-G4-G5,IF(E3>0,0,IF(ABS(E3)>G3-G4-G5,MIN(G3-G4-G5,ABS(E3)-F6),ABS(E3)-F6))))')
      sheet.setFormula(6, 6, '=IF(G3<0,0,IF(AND((C3+D4+E4+F4)+(D3+E5+F5)+(E3+F6)+F3+G3<0,(C3+D4+E4+F4)+(D3+E5+F5)+(E3+F6)+F3+G3<0),G3-G4-G5-G6,IF(F3>0,0,IF(ABS(F3)>G3-G4-G5-G6,MIN(G3-G4-G5-G6,ABS(F3)),ABS(F3)))))')
      sheet.setFormula(8, 6, '=SUM(G4:G8)')
      sheet.setFormula(9, 6, '=IF(G3<0,0,G3-G9)')

      sheet.setFormula(3, 7, '=IF(H3<0,0,IF(AND((C3+D4+E4+F4+G4)+H3<0,(C3+D4+E4+F4+G4)+(D3+E5+F5+G5)+(E3+F6+G6)+(F3+G7)+G3+H3<0),H3,IF(C3>0,0,IF(ABS(C3)>H3,MIN(H3,ABS(C3)-D4-E4-F4-G4),ABS(C3)-D4-E4-F4-G4))))')
      sheet.setFormula(4, 7, '=IF(H3<0,0,IF(AND((C3+D4+E4+F4+G4)+(D3+E5+F5+G5)+H3<0,(C3+D4+E4+F4+G4)+(D3+E5+F5+G5)+(E3+F6+G6)+(F3+G7)+G3+H3<0),H3-H4,IF(D3>0,0,IF(ABS(D3)>H3-H4,MIN(H3-H4,ABS(D3)-E5-F5-G5),ABS(D3)-E5-F5-G5))))')
      sheet.setFormula(5, 7, '=IF(H3<0,0,IF(AND((C3+D4+E4+F4+G4)+(D3+E5+F5+G5)+(E3+F6+G6)+H3<0,(C3+D4+E4+F4+G4)+(D3+E5+F5+G5)+(E3+F6+G6)+(F3+G7)+G3+H3<0),H3-H4-H5,IF(E3>0,0,IF(ABS(E3)>H3-H4-H5,MIN(H3-H4-H5,ABS(E3)-F6-G6),ABS(E3)-F6-G6))))')
      sheet.setFormula(6, 7, '=IF(H3<0,0,IF(AND((C3+D4+E4+F4+G4)+(D3+E5+F5+G5)+(E3+F6+G6)+(F3+G7)+H3<0,(C3+D4+E4+F4+G4)+(D3+E5+F5+G5)+(E3+F6+G6)+(F3+G7)+G3+H3<0),H3-H4-H5-H6,IF(F3>0,0,IF(ABS(F3)>H3-H4-H5-H6,MIN(H3-H4-H5-H6,ABS(F3)-G7),ABS(F3)-G7))))')
      sheet.setFormula(7, 7, '=IF(H3<0,0,IF(AND((C3+D4+E4+F4+G4)+(D3+E5+F5+G5)+(E3+F6+G6)+(F3+G7)+G3+H3<0,(C3+D4+E4+F4+G4)+(D3+E5+F5+G5)+(E3+F6+G6)+(F3+G7)+G3+H3<0),H3-H4-H5-H6-H7,IF(G3>0,0,IF(ABS(G3)>H3-H4-H5-H6-H7,MIN(H3-H4-H5-H6-H7,ABS(G3)),ABS(G3)))))')
      sheet.setFormula(8, 7, '=SUM(H4:H8)')
      sheet.setFormula(9, 7, '=IF(H3<0,0,H3-H9)')

      sheet.setFormula(3, 8, '=IF(I3<0,0,IF(AND((D3+E5+F5+G5+H5)+I3<0,(D3+E5+F5+G5+H5)+(E3+F6+G6+H6)+(F3+G7+H7)+(G3+H8)+H3+I3<0),I3,IF(D3>0,0,IF(ABS(D3)>I3,MIN(I3,ABS(D3)-E5-F5-G5-H5),ABS(D3)-E5-F5-G5-H5))))')
      sheet.setFormula(4, 8, '=IF(I3<0,0,IF(AND((D3+E5+F5+G5+H5)+(E3+F6+G6+H6)+I3<0,(D3+E5+F5+G5+H5)+(E3+F6+G6+H6)+(F3+G7+H7)+(G3+H8)+H3+I3<0),I3-I4,IF(E3>0,0,IF(ABS(E3)>I3-I4,MIN(I3-I4,ABS(E3)-F6-G6-H6),ABS(E3)-F6-G6-H6))))')
      sheet.setFormula(5, 8, '=IF(I3<0,0,IF(AND((D3+E5+F5+G5+H5)+(E3+F6+G6+H6)+(F3+G7+H7)+I3<0,(D3+E5+F5+G5+H5)+(E3+F6+G6+H6)+(F3+G7+H7)+(G3+H8)+H3+I3<0),I3-I4-I5,IF(F3>0,0,IF(ABS(F3)>I3-I4-I5,MIN(I3-I4-I5,ABS(F3)-G7-H7),ABS(F3)-G7-H7))))')
      sheet.setFormula(6, 8, '=IF(I3<0,0,IF(AND((D3+E5+F5+G5+H5)+(E3+F6+G6+H6)+(F3+G7+H7)+(G3+H8)+I3<0,(D3+E5+F5+G5+H5)+(E3+F6+G6+H6)+(F3+G7+H7)+(G3+H8)+H3+I3<0),I3-I4-I5-I6,IF(G3>0,0,IF(ABS(G3)>I3-I4-I5-I6,MIN(I3-I4-I5-I6,ABS(G3)-H8),ABS(G3)-H8))))')
      sheet.setFormula(7, 8, '=IF(I3<0,0,IF(AND((D3+E5+F5+G5+H5)+(E3+F6+G6+H6)+(F3+G7+H7)+(G3+H8)+H3+I3<0,(D3+E5+F5+G5+H5)+(E3+F6+G6+H6)+(F3+G7+H7)+(G3+H8)+H3+I3<0),I3-I4-I5-I6-I7,IF(H3>0,0,IF(ABS(H3)>I3-I4-I5-I6-I7,MIN(I3-I4-I5-I6-I7,ABS(H3)),ABS(H3)))))')
      sheet.setFormula(8, 8, '=SUM(I4:I8)')
      sheet.setFormula(9, 8, '=IF(I3<0,0,I3-I9)')

      sheet.setFormula(3, 9, '=IF(J3<0,0,IF(AND((E3+F6+G6+H6+I5)+J3<0,(E3+F6+G6+H6+I5)+(F3+G7+H7+I6)+(G3+H8+I7)+(H3+I8)+I3+J3<0),J3,IF(E3>0,0,IF(ABS(E3)>J3,MIN(J3,ABS(E3)-F6-G6-H6-I5),ABS(E3)-F6-G6-H6-I5))))')
      sheet.setFormula(4, 9, '=IF(J3<0,0,IF(AND((E3+F6+G6+H6+I5)+(F3+G7+H7+I6)+J3<0,(E3+F6+G6+H6+I5)+(F3+G7+H7+I6)+(G3+H8+I7)+(H3+I8)+I3+J3<0),J3-J4,IF(F3>0,0,IF(ABS(F3)>J3-J4,MIN(J3-J4,ABS(F3)-G7-H7-I6),ABS(F3)-G7-H7-I6))))')
      sheet.setFormula(5, 9, '=IF(J3<0,0,IF(AND((E3+F6+G6+H6+I5)+(F3+G7+H7+I6)+(G3+H8+I7)+J3<0,(E3+F6+G6+H6+I5)+(F3+G7+H7+I6)+(G3+H8+I7)+(H3+I8)+I3+J3<0),J3-J4-J5,IF(G3>0,0,IF(ABS(G3)>J3-J4-J5,MIN(J3-J4-J5,ABS(G3)-H8-I7),ABS(F3)-H8-I7))))')
      sheet.setFormula(6, 9, '=IF(J3<0,0,IF(AND((E3+F6+G6+H6+I5)+(F3+G7+H7+I6)+(G3+H8+I7)+(H3+I8)+J3<0,(E3+F6+G6+H6+I5)+(F3+G7+H7+I6)+(G3+H8+I7)+(H3+I8)+I3+J3<0),J3-J4-J5-J6,IF(H3>0,0,IF(ABS(H3)>J3-J4-J5-J6,MIN(J3-J4-J5-J6,ABS(H3)-I8),ABS(H3)-I8))))')
      sheet.setFormula(7, 9, '=IF(J3<0,0,IF(AND((E3+F6+G6+H6+I5)+(F3+G7+H7+I6)+(G3+H8+I7)+(H3+I8)+I3+J3<0,(E3+F6+G6+H6+I5)+(F3+G7+H7+I6)+(G3+H8+I7)+(H3+I8)+I3+J3<0),J3-J4-J5-J6-J7,IF(I3>0,0,IF(ABS(I3)>J3-J4-J5-J6-J7,MIN(J3-J4-J5-J6-J7,ABS(H3)-I8),ABS(H3)-I8))))')
      sheet.setFormula(8, 9, '=SUM(J4:J8)')
      sheet.setFormula(9, 9, '=IF(J3<0,0,J3-J9)')

      sheet.setFormula(3, 10, '=IF(K3<0,0,IF(AND((F3+G7+H7+I6+J5)+K3<0,(F3+G7+H7+I6+J5)+(G3+H8+I7+J6)+(H3+I8+J7)+(I3+J8)+J3+K3<0),K3,IF(F3>0,0,IF(ABS(F3)>K3,MIN(K3,ABS(F3)-G7-H7-I6-J5),ABS(F3)-G7-H7-I6-J5))))')
      sheet.setFormula(4, 10, '=IF(K3<0,0,IF(AND((F3+G7+H7+I6+J5)+(G3+H8+I7+J6)+K3<0,(F3+G7+H7+I6+J5)+(G3+H8+I7+J6)+(H3+I8+J7)+(I3+J8)+J3+K3<0),K3-K4,IF(G3>0,0,IF(ABS(G3)>K3-K4,MIN(K3-K4,ABS(G3)-H8-I7-J6),ABS(G3)-H8-I7-J6))))')
      sheet.setFormula(5, 10, '=IF(K3<0,0,IF(AND((F3+G7+H7+I6+J5)+(G3+H8+I7+J6)+(H3+I8+J7)+K3<0,(F3+G7+H7+I6+J5)+(G3+H8+I7+J6)+(H3+I8+J7)+(I3+J8)+J3+K3<0),K3-K4-K5,IF(H3>0,0,IF(ABS(H3)>K3-K4-K5,MIN(K3-K4-K5,ABS(H3)-I8-J7),ABS(H3)-I8-J7))))')
      sheet.setFormula(6, 10, '=IF(K3<0,0,IF(AND((F3+G7+H7+I6+J5)+(G3+H8+I7+J6)+(H3+I8+J7)+(I3+J8)+K3<0,(F3+G7+H7+I6+J5)+(G3+H8+I7+J6)+(H3+I8+J7)+(I3+J8)+J3+K3<0),K3-K4-K5-K6,IF(I3>0,0,IF(ABS(I3)>K3-K4-K5-K6,MIN(K3-K4-K5-K6,ABS(I3)-J8),ABS(I3)-J8))))')
      sheet.setFormula(7, 10, '=IF(K3<0,0,IF(AND((F3+G7+H7+I6+J5)+(G3+H8+I7+J6)+(H3+I8+J7)+(I3+J8)+J3+K3<0,(F3+G7+H7+I6+J5)+(G3+H8+I7+J6)+(H3+I8+J7)+(I3+J8)+J3+K3<0),K3-K4-K5-K6-K7,IF(J3>0,0,IF(ABS(J3)>K3-K4-K5-K6-K7,MIN(K3-K4-K5-K6-K7,ABS(J3)),ABS(J3)))))')
      sheet.setFormula(8, 10, '=SUM(K4:K8)')
      sheet.setFormula(9, 10, '=IF(K3<0,0,K3-K9)')

      sheet.setFormula(3, 11, '=IF(L3<0,0,IF(AND((G3+H8+I7+J6+K5)+L3<0,(G3+H8+I7+J6+K5)+(H3+I8+J7+K6)+(I3+J8+K7)+(J3+K8)+K3+L3<0),L3,IF(G3>0,0,IF(ABS(G3)>L3,MIN(L3,ABS(G3)-H8-I7-J6-K5),ABS(G3)-H8-I7-J6-K5))))')
      sheet.setFormula(4, 11, '=IF(L3<0,0,IF(AND((G3+H8+I7+J6+K5)+(H3+I8+J7+K6)+L3<0,(G3+H8+I7+J6+K5)+(H3+I8+J7+K6)+(I3+J8+K7)+(J3+K8)+K3+L3<0),L3-L4,IF(H3>0,0,IF(ABS(H3)>L3-L4,MIN(L3-L4,ABS(H3)-I8-J7-K6),ABS(H3)-I8-J7-K6))))')
      sheet.setFormula(5, 11, '=IF(L3<0,0,IF(AND((G3+H8+I7+J6+K5)+(H3+I8+J7+K6)+(I3+J8+K7)+L3<0,(G3+H8+I7+J6+K5)+(H3+I8+J7+K6)+(I3+J8+K7)+(J3+K8)+K3+L3<0),L3-L4-L5,IF(I3>0,0,IF(ABS(I3)>L3-L4-L5,MIN(L3-L4-L5,ABS(I3)-J8-K7),ABS(I3)-J8-K7))))')
      sheet.setFormula(6, 11, '=IF(L3<0,0,IF(AND((G3+H8+I7+J6+K5)+(H3+I8+J7+K6)+(I3+J8+K7)+(J3+K8)+L3<0,(G3+H8+I7+J6+K5)+(H3+I8+J7+K6)+(I3+J8+K7)+(J3+K8)+K3+L3<0),L3-L4-L5-L6,IF(J3>0,0,IF(ABS(J3)>L3-L4-L5-L6,MIN(L3-L4-L5-L6,ABS(J3)-K8),ABS(J3)-K8))))')
      sheet.setFormula(7, 11, '=IF(L3<0,0,IF(AND((G3+H8+I7+J6+K5)+(H3+I8+J7+K6)+(I3+J8+K7)+(J3+K8)+K3+L3<0,(G3+H8+I7+J6+K5)+(H3+I8+J7+K6)+(I3+J8+K7)+(J3+K8)+K3+L3<0),L3-L4-L5-L6-L7,IF(K3>0,0,IF(ABS(K3)>L3-L4-L5-L6-L7,MIN(L3-L4-L5-L6-L7,ABS(K3)),ABS(K3)))))')
      sheet.setFormula(8, 11, '=SUM(L4:L8)')
      sheet.setFormula(9, 11, '=IF(L3<0,0,L3-L9)')

      sheet.setFormula(3, 12, '=IF(M3<0,0,IF(AND((H3+I8+J7+K6+L5)+M3<0,(H3+I8+J7+K6+L5)+(I3+J8+K7+L6)+(J3+K8+L7)+(K3+L8)+L3+M3<0),M3,IF(H3>0,0,IF(ABS(H3)>M3,MIN(M3,ABS(H3)-I8-J7-K6-L5),ABS(H3)-I8-J7-K6-L5))))')
      sheet.setFormula(4, 12, '=IF(M3<0,0,IF(AND((H3+I8+J7+K6+L5)+(I3+J8+K7+L6)+M3<0,(H3+I8+J7+K6+L5)+(I3+J8+K7+L6)+(J3+K8+L7)+(K3+L8)+L3+M3<0),M3-M4,IF(I3>0,0,IF(ABS(I3)>M3-M4,MIN(M3-M4,ABS(I3)-J8-K7-L6),ABS(I3)-J8-K7-L6))))')
      sheet.setFormula(5, 12, '=IF(M3<0,0,IF(AND((H3+I8+J7+K6+L5)+(I3+J8+K7+L6)+(J3+K8+L7)+M3<0,(H3+I8+J7+K6+L5)+(I3+J8+K7+L6)+(J3+K8+L7)+(K3+L8)+L3+M3<0),M3-M4-M5,IF(J3>0,0,IF(ABS(J3)>M3-M4-M5,MIN(M3-M4-M5,ABS(J3)-K8-L7),ABS(J3)-K8-L7))))')
      sheet.setFormula(6, 12, '=IF(M3<0,0,IF(AND((H3+I8+J7+K6+L5)+(I3+J8+K7+L6)+(J3+K8+L7)+(K3+L8)+M3<0,(H3+I8+J7+K6+L5)+(I3+J8+K7+L6)+(J3+K8+L7)+(K3+L8)+L3+M3<0),M3-M4-M5-M6,IF(K3>0,0,IF(ABS(K3)>M3-M4-M5-M6,MIN(M3-M4-M5-M6,ABS(K3)-L8),ABS(K3)-L8))))')
      sheet.setFormula(7, 12, '=IF(M3<0,0,IF(AND((H3+I8+J7+K6+L5)+(I3+J8+K7+L6)+(J3+K8+L7)+(K3+L8)+L3+M3<0,(H3+I8+J7+K6+L5)+(I3+J8+K7+L6)+(J3+K8+L7)+(K3+L8)+L3+M3<0),M3-M4-M5-M6-M7,IF(L3>0,0,IF(ABS(L3)>M3-M4-M5-M6-M7,MIN(M3-M4-M5-M6-M7,ABS(L3)),ABS(L3)))))')
      sheet.setFormula(8, 12, '=SUM(M4:M8)')
      sheet.setFormula(9, 12, '=IF(M3<0,0,M3-M9)')

      sheet.setFormula(3, 13, '=IF(N3<0,0,IF(AND((I3+J8+K7+L6+M5)+N3<0,(I3+J8+K7+L6+M5)+(J3+K8+L7+M6)+(K3+L8+M7)+(L3+M8)+M3+N3<0),N3,IF(I3>0,0,IF(ABS(I3)>N3,MIN(N3,ABS(I3)-J8-K7-L6-M5),ABS(I3)-J8-K7-L6-M5))))')
      sheet.setFormula(4, 13, '=IF(N3<0,0,IF(AND((I3+J8+K7+L6+M5)+(J3+K8+L7+M6)+N3<0,(I3+J8+K7+L6+M5)+(J3+K8+L7+M6)+(K3+L8+M7)+(L3+M8)+M3+N3<0),N3-N4,IF(J3>0,0,IF(ABS(J3)>N3-N4,MIN(N3-N4,ABS(J3)-K8-L7-M6),ABS(J3)-K8-L7-M6))))')
      sheet.setFormula(5, 13, '=IF(N3<0,0,IF(AND((I3+J8+K7+L6+M5)+(J3+K8+L7+M6)+(K3+L8+M7)+N3<0,(I3+J8+K7+L6+M5)+(J3+K8+L7+M6)+(K3+L8+M7)+(L3+M8)+M3+N3<0),N3-N4-N5,IF(K3>0,0,IF(ABS(K3)>N3-N4-N5,MIN(N3-N4-N5,ABS(K3)-L8-M7),ABS(K3)-L8-M7))))')
      sheet.setFormula(6, 13, '=IF(N3<0,0,IF(AND((I3+J8+K7+L6+M5)+(J3+K8+L7+M6)+(K3+L8+M7)+(L3+M8)+N3<0,(I3+J8+K7+L6+M5)+(J3+K8+L7+M6)+(K3+L8+M7)+(L3+M8)+M3+N3<0),N3-N4-N5-N6,IF(L3>0,0,IF(ABS(L3)>N3-N4-N5-N6,MIN(N3-N4-N5-N6,ABS(L3)-M8),ABS(L3)-M8))))')
      sheet.setFormula(7, 13, '=IF(N3<0,0,IF(AND((I3+J8+K7+L6+M5)+(J3+K8+L7+M6)+(K3+L8+M7)+(L3+M8)+M3+N3<0,(I3+J8+K7+L6+M5)+(J3+K8+L7+M6)+(K3+L8+M7)+(L3+M8)+M3+N3<0),N3-N4-N5-N6-N7,IF(M3>0,0,IF(ABS(M3)>N3-N4-N5-N6-N7,MIN(N3-N4-N5-N6-N7,ABS(M3)),ABS(M3)))))')
      sheet.setFormula(8, 13, '=SUM(N4:N8)')
      sheet.setFormula(9, 13, '=IF(N3<0,0,N3-N9)')

      sheet.setFormula(3, 14, '=IF(O3<0,0,IF(AND((J3+K8+L7+M6+N5)+O3<0,(J3+K8+L7+M6+N5)+(K3+L8+M7+N6)+(L3+M8+N7)+(M3+N8)+N3+O3<0),O3,IF(J3>0,0,IF(ABS(J3)>O3,MIN(O3,ABS(J3)-K8-L7-M6-N5),ABS(J3)-K8-L7-M6-N5))))')
      sheet.setFormula(4, 14, '=IF(O3<0,0,IF(AND((J3+K8+L7+M6+N5)+(K3+L8+M7+N6)+O3<0,(J3+K8+L7+M6+N5)+(K3+L8+M7+N6)+(L3+M8+N7)+(M3+N8)+N3+O3<0),O3-O4,IF(K3>0,0,IF(ABS(K3)>O3-O4,MIN(O3-O4,ABS(K3)-L8-M7-N6),ABS(K3)-L8-M7-N6))))')
      sheet.setFormula(5, 14, '=IF(O3<0,0,IF(AND((J3+K8+L7+M6+N5)+(K3+L8+M7+N6)+(L3+M8+N7)+O3<0,(J3+K8+L7+M6+N5)+(K3+L8+M7+N6)+(L3+M8+N7)+(M3+N8)+N3+O3<0),O3-O4-O5,IF(L3>0,0,IF(ABS(L3)>O3-O4-O5,MIN(O3-O4-O5,ABS(L3)-M8-N7),ABS(L3)-M8-N7))))')
      sheet.setFormula(6, 14, '=IF(O3<0,0,IF(AND((J3+K8+L7+M6+N5)+(K3+L8+M7+N6)+(L3+M8+N7)+(M3+N8)+O3<0,(J3+K8+L7+M6+N5)+(K3+L8+M7+N6)+(L3+M8+N7)+(M3+N8)+N3+O3<0),O3-O4-O5-O6,IF(M3>0,0,IF(ABS(M3)>O3-O4-O5-O6,MIN(O3-O4-O5-O6,ABS(M3)-N8),ABS(M3)-N8))))')
      sheet.setFormula(7, 14, '=IF(O3<0,0,IF(AND((J3+K8+L7+M6+N5)+(K3+L8+M7+N6)+(L3+M8+N7)+(M3+N8)+N3+O3<0,(J3+K8+L7+M6+N5)+(K3+L8+M7+N6)+(L3+M8+N7)+(M3+N8)+N3+O3<0),O3-O4-O5-O6-O7,IF(N3>0,0,IF(ABS(N3)>O3-O4-O5-O6-O7,MIN(O3-O4-O5-O6-O7,ABS(N3)),ABS(N3)))))')
      sheet.setFormula(8, 14, '=SUM(O4:O8)')
      sheet.setFormula(9, 14, '=IF(O3<0,0,O3-O9)')

      sheet.setFormula(3, 15, '=IF(P3<0,0,IF(AND((K3+L8+M7+N6+O5)+P3<0,(K3+L8+M7+N6+O5)+(L3+M8+N7+O6)+(M3+N8+O7)+(N3+O8)+O3+P3<0),P3,IF(K3>0,0,IF(ABS(K3)>P3,MIN(P3,ABS(K3)-L8-M7-N6-O5),ABS(K3)-L8-M7-N6-O5))))')
      sheet.setFormula(4, 15, '=IF(P3<0,0,IF(AND((K3+L8+M7+N6+O5)+(L3+M8+N7+O6)+P3<0,(K3+L8+M7+N6+O5)+(L3+M8+N7+O6)+(M3+N8+O7)+(N3+O8)+O3+P3<0),P3-P4,IF(L3>0,0,IF(ABS(L3)>P3-P4,MIN(P3-P4,ABS(L3)-M8-N7-O6),ABS(L3)-M8-N7-O6))))')
      sheet.setFormula(5, 15, '=IF(P3<0,0,IF(AND((K3+L8+M7+N6+O5)+(L3+M8+N7+O6)+(M3+N8+O7)+P3<0,(K3+L8+M7+N6+O5)+(L3+M8+N7+O6)+(M3+N8+O7)+(N3+O8)+O3+P3<0),P3-P4-P5,IF(M3>0,0,IF(ABS(M3)>P3-P4-P5,MIN(P3-P4-P5,ABS(M3)-N8-O7),ABS(M3)-N8-O7))))')
      sheet.setFormula(6, 15, '=IF(P3<0,0,IF(AND((K3+L8+M7+N6+O5)+(L3+M8+N7+O6)+(M3+N8+O7)+(N3+O8)+P3<0,(K3+L8+M7+N6+O5)+(L3+M8+N7+O6)+(M3+N8+O7)+(N3+O8)+O3+P3<0),P3-P4-P5-P6,IF(N3>0,0,IF(ABS(N3)>P3-P4-P5-P6,MIN(P3-P4-P5-P6,ABS(N3)-O8),ABS(N3)-O8))))')
      sheet.setFormula(7, 15, '=IF(P3<0,0,IF(AND((K3+L8+M7+N6+O5)+(L3+M8+N7+O6)+(M3+N8+O7)+(N3+O8)+O3+P3<0,(K3+L8+M7+N6+O5)+(L3+M8+N7+O6)+(M3+N8+O7)+(N3+O8)+O3+P3<0),P3-P4-P5-P6-P7,IF(O3>0,0,IF(ABS(O3)>P3-P4-P5-P6-P7,MIN(P3-P4-P5-P6-P7,ABS(O3)),ABS(O3)))))')
      sheet.setFormula(8, 15, '=SUM(P4:P8)')
      sheet.setFormula(9, 15, '=IF(P3<0,0,P3-P9)')

      sheet.setFormula(3, 16, '=IF(Q3<0,0,IF(AND((L3+M8+N7+O6+P5)+Q3<0,(L3+M8+N7+O6+P5)+(M3+N8+O7+P6)+(N3+O8+P7)+(O3+P8)+P3+Q3<0),Q3,IF(L3>0,0,IF(ABS(L3)>Q3,MIN(Q3,ABS(L3)-M8-N7-O6-P5),ABS(L3)-M8-N7-O6-P5))))')
      sheet.setFormula(4, 16, '=IF(Q3<0,0,IF(AND((L3+M8+N7+O6+P5)+(M3+N8+O7+P6)+Q3<0,(L3+M8+N7+O6+P5)+(M3+N8+O7+P6)+(N3+O8+P7)+(O3+P8)+P3+Q3<0),Q3-Q4,IF(M3>0,0,IF(ABS(M3)>Q3-Q4,MIN(Q3-Q4,ABS(M3)-N8-O7-P6),ABS(M3)-N8-O7-P6))))')
      sheet.setFormula(5, 16, '=IF(Q3<0,0,IF(AND((L3+M8+N7+O6+P5)+(M3+N8+O7+P6)+(N3+O8+P7)+Q3<0,(L3+M8+N7+O6+P5)+(M3+N8+O7+P6)+(N3+O8+P7)+(O3+P8)+P3+Q3<0),Q3-Q4-Q5,IF(N3>0,0,IF(ABS(N3)>Q3-Q4-Q5,MIN(Q3-Q4-Q5,ABS(N3)-O8-P7),ABS(N3)-O8-P7))))')
      sheet.setFormula(6, 16, '=IF(Q3<0,0,IF(AND((L3+M8+N7+O6+P5)+(M3+N8+O7+P6)+(N3+O8+P7)+(O3+P8)+Q3<0,(L3+M8+N7+O6+P5)+(M3+N8+O7+P6)+(N3+O8+P7)+(O3+P8)+P3+Q3<0),Q3-Q4-Q5-Q6,IF(O3>0,0,IF(ABS(O3)>Q3-Q4-Q5-Q6,MIN(Q3-Q4-Q5-Q6,ABS(O3)-P8),ABS(O3)-P8))))')
      sheet.setFormula(7, 16, '=IF(Q3<0,0,IF(AND((L3+M8+N7+O6+P5)+(M3+N8+O7+P6)+(N3+O8+P7)+(O3+P8)+P3+Q3<0,(L3+M8+N7+O6+P5)+(M3+N8+O7+P6)+(N3+O8+P7)+(O3+P8)+P3+Q3<0),Q3-Q4-Q5-Q6-Q7,IF(P3>0,0,IF(ABS(P3)>Q3-Q4-Q5-Q6-Q7,MIN(Q3-Q4-Q5-Q6-Q7,ABS(P3)),ABS(P3)))))')
      sheet.setFormula(8, 16, '=SUM(Q4:Q8)')
      sheet.setFormula(9, 16, '=IF(Q3<0,0,Q3-Q9)')

      // alert('Q9的值为' + sheet.getValue(8, 16) + '，Q10的值为' + sheet.getValue(9, 16))
    }
  }
}
</script>

<style scoped>
  .board {
    margin: 20px;
  }
  .result-board {
    margin-top: 20px;
    background-color: #f2f4f5;
    border-radius: 5px;
  }
  .total {
    border-bottom: solid 2px #dfdfdf;
  }
  .result-title {
    margin: 10px 20px;
    color: #1890ff;
    font-weight: bold;
    font-size: 20px;
  }
  .result-info {
    margin: 10px 20px;
    font-size: 17px;
  }
</style>
