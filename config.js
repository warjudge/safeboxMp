/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

// const host = 'https://api.blingblingstar.com/Gesture'
// const host = 'http://192.168.31.142:8080/Gesture'
// const host = 'http://192.168.31.157:8080/Gesture'
// const host = 'http://192.168.31.128:18083/Gesture'
// const host = 'http://47.100.205.81:18085/Gesture'
// const host1 = 'http://47.100.205.81:18085/ImageUpload'
// const host = 'http://192.168.31.209:8080/Gesture'
// const host1 = 'http://192.168.31.209:8080/ImageUpload'
const host = 'https://bgj.blingblingstar.com/Gesture'
const host1 = 'http://47.100.205.81:18085/ImageUpload'


const config = {

  // 下面的地址配合云端 Server 工作
  host,
  host1,

  // 登录地址，用于建立会话
  loginUrl: `https://${host}`,

  // 测试的请求地址，用于测试会话
  requestUrl: `https://${host}/testRequest`,

  // 用code换取openId
  openIdUrl: `https://${host}/openid`,

  // 测试的信道服务接口
  tunnelUrl: `https://${host}/tunnel`,

  // 生成支付订单的接口
  paymentUrl: `https://${host}/payment`,

  // 发送模板消息接口
  templateMessageUrl: `https://${host}/templateMessage`,

  // 发送订阅消息接口
  subscribeMessageUrl: `https://${host}/subscribeMessage`,

  // 上传文件接口
  uploadFileUrl: `https://${host}/upload`,

  // 下载示例图片接口
  downloadExampleUrl: `https://${host}/static/weapp.jpg`
}

const imgHost = 'http://qiniu.blingblingstar.com/'

const imgConfig={
  icon:{

  },
  banner:{

  },
  product:{

  },
}

module.exports = config
