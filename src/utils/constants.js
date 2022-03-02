export const HTTP = {
  NOT_LOGIN: 4001,
  SUCCESS: 2000
}

export const ROLE = {
  SUPER_ADMIN: 2,
  ADMIN: 1,
  NORMAL: 0
}

export const AUDIT_STATUS = {
  NotAudit: 0,
  UnderAudit: 1,
  NotPassed: 2,
  PASSED: 3
}

export const AUDIT_STATUS_2_CN = [
  '未审核',
  '审核中',
  '不通过',
  '已通过'
]

export const ITEM_TYPES = [
  '住宅',
  '商住',
  '商业',
  '商办',
  '办公',
  '综合体',
  '产业园',
  '公寓',
  '酒店',
  '工业',
  '物流',
  '自定义'
]

export const defaultUserInfo = {
  role: '',
  ID: '',
  certificate: {
    ID: ''
  }
}

export const EXCHANGE_TYPES = [
  '股权转让',
  '资产转让',
  '融资代建',
  '代建',
  '开放股权',
  '委托运营',
  '自定义'
]
