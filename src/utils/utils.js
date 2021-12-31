import userApi from '@system/api/user'

function CheckMobileExist (rule, value, callback) {
  userApi.checkMobile(value).then(res => {
    if (res.data.data.mobile === true) {
      callback(new Error('该手机号已经存在!'))
    } else {
      callback()
    }
  }, _ => callback())
}

function getBase64 (file) {
  // 把图片解析成base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

function CheckEmailExist (rule, value, callback) {
  userApi.checkEmail({'email': value}).then(res => {
    if (res.data.data.email === true) {
      callback(new Error('该邮箱地址已经存在!'))
    } else {
      callback()
    }
  }, _ => callback())
}

function MobileValid (rule, value, callback) {
  if (/^1[345789]\d{9}$/.test(value) === false) {
    if (rule) {
      callback(new Error('请输入正确的号码!'))
    } else {
      return false
    }
  }
  if (rule) {
    callback()
  } else {
    return true
  }
}

function Copy (source) {
  return JSON.parse(JSON.stringify(source))
}

export default {
  CheckMobileExist: CheckMobileExist,
  Copy: Copy,
  MobileValid: MobileValid,
  getBase64: getBase64,
  CheckEmailExist: CheckEmailExist
}
