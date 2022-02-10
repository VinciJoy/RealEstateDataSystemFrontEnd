import userApi from '@system/api/user'
import { ROLE } from '@/utils/constants'

/*
       三个参数
       file：一个是文件(类型是图片格式)，
       w：一个是文件压缩的后宽度，宽度越小，字节越小
       objDiv：一个是容器或者回调函数
       photoCompress()
       */
function photoCompress (file, w, objDiv) {
  let ready = new FileReader()
  /* 开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容. */
  ready.readAsDataURL(file)
  ready.onload = function () {
    let re = this.result
    canvasDataURL(re, w, objDiv)
  }
}

function canvasDataURL (path, obj, callback) {
  let img = new Image()
  img.src = path
  img.onload = function () {
    let that = this
    // 默认按比例压缩
    let w = that.width
    let h = that.height
    let scale = w / h
    w = obj.width || w
    h = obj.height || (w / scale)
    let quality = 0.7 // 默认图片质量为0.7
    // 生成canvas
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    // 创建属性节点
    let anw = document.createAttribute('width')
    anw.nodeValue = w
    let anh = document.createAttribute('height')
    anh.nodeValue = h
    canvas.setAttributeNode(anw)
    canvas.setAttributeNode(anh)
    ctx.drawImage(that, 0, 0, w, h)
    // 图像质量
    if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
      quality = obj.quality
    }
    // quality值越小，所绘制出的图像越模糊
    let base64 = canvas.toDataURL('image/jpeg', quality)
    // 回调函数返回base64的值
    callback(base64)
  }
}

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
  // return new Promise((resolve, reject) => {
  //   const reader = new FileReader()
  //   reader.readAsDataURL(file)
  //   reader.onload = () => resolve(reader.result)
  //   reader.onerror = error => reject(error)
  // })
  return new Promise((resolve, reject) => {
    photoCompress(file, {width: 200, height: 200}, (base64) => {
      resolve(base64)
    })
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

function IsAdmin (userRole) {
  return [ROLE.ADMIN, ROLE.SUPER_ADMIN].includes(userRole)
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
  IsAdmin: IsAdmin,
  getBase64: getBase64,
  CheckEmailExist: CheckEmailExist
}
