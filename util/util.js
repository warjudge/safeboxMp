function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  const hour = parseInt(time / 3600, 10)
  time %= 3600
  const minute = parseInt(time / 60, 10)
  time = parseInt(time % 60, 10)
  const second = time

  return ([hour, minute, second]).map(function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatTimestamp(time) {
  var date = new Date(time); //获取一个时间对象
  let year = date.getFullYear(); // 获取完整的年份(4位,1970)
  let month = date.getMonth(); // 获取月份(0-11,0代表1月,用的时候记得加上1)
  let d = date.getDate(); // 获取日(1-31)
  let se = date.getTime(); // 获取时间(从1970.1.1开始的毫秒数)
  let hour = date.getHours(); // 获取小时数(0-23)
  let minute = date.getMinutes(); // 获取分钟数(0-59)
  let second = date.getSeconds(); // 获取秒数(0-59)
  return year + "-" + month + "-" + d + " " + hour + ":" + minute + ":" + second;
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function fib(n) {
  if (n < 1) return 0
  if (n <= 2) return 1
  return fib(n - 1) + fib(n - 2)
}

module.exports = {
  formatTime,
  formatTimestamp,
  formatLocation,
  fib
}