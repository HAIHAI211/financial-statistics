// 微信接口promisefy化
export function pf (method, options = {}) {
  return new Promise((resolve, reject) => {
    // 将options对象赋值 然后再传给下面调用的方法中
    options.success = resolve
    options.fail = err => {
      reject(err)
    }
    wx[method](options)
  })
}

// 在线预览文档
export async function openOnline (fileUrl) {
  // 下载到本地
  const {tempFilePath} = await pf('downloadFile', {
    url: fileUrl
  })
  // console.log('tempFilePath', tempFilePath)
  // 预览文件
  return pf('openDocument', {
    filePath: tempFilePath
  })
}

// 拷贝
export function copy (str) {
  return pf('setClipboardData', {
    data: str
  })
}

// 加载中
export const showLoading = (msg) => {
  wx.showLoading({
    title: msg || '加载中',
    mask: true
  })
}

// 显示toat
export const showToast = (msg, duration = 500) => {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: duration
  })
}

// 显示异常
export const showError = (msg, duration = 500) => {
  wx.showToast({
    title: msg || '网络异常，请重试',
    icon: 'none',
    duration: duration
  })
}
