import CryptoJS from 'crypto-js'
import { _const } from './const.js'
export default {
  // 加密
  encrypt (obj) {
    var key = CryptoJS.enc.Utf8.parse(sessionStorage.getItem('k'))
    var srcs = CryptoJS.enc.Utf8.parse(obj)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
  },
  // 解密
  decrypt (string) {
    var key = CryptoJS.enc.Utf8.parse(sessionStorage.getItem('k'))
    var decrypt = CryptoJS.AES.decrypt(string, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt)
  },
  /**
   * @description 格式化金额
   * @param number：要格式化的数字
   * @param decimals：保留几位小数 默认0位
   * @param decPoint：小数点符号 默认.
   * @param thousandsSep：千分位符号 默认为,
   */
  formatMoney (number, decimals = 0, decPoint = '.', thousandsSep = ',') {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    let n = !isFinite(+number) ? 0 : +number
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep
    let dec = typeof decPoint === 'undefined' ? '.' : decPoint
    let s = ''
    let toFixedFix = function (n, prec) {
      let k = Math.pow(10, prec)
      return '' + Math.ceil(n * k) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    let re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  },
  // 获取浏览器信息
  browser () {
    var u = navigator.userAgent
    // 移动终端浏览器版本信息
    if (u.indexOf('Trident') > -1) return 'IE' // IE内核
    if (u.indexOf('Presto') > -1) return 'OPERA' // opera内核
    if (u.indexOf('AppleWebKit') > -1) return 'CHROME' // 苹果、谷歌内核
    if (u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1) return 'FF' // 火狐内核
    return 'GENERAL'
  },
  // 生成随机长度的字符串
  randomstring (len) {
    const charSet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-='
    var randomString = ''
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length)
      randomString += charSet.substring(randomPoz, randomPoz + 1)
    }
    return randomString
  },
  // 数字转中文
  chnNumChar: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
  chnUnitSection: ['', '万', '亿', '万亿', '亿亿'],
  chnUnitChar: ['', '十', '百', '千'],
  numberToChinese (num) {
    var numbak = num
    var unitPos = 0
    var strIns = ''
    var chnStr = ''
    var needZero = false
    if (num === 0) {
      return this.chnNumChar[0]
    }
    while (num > 0) {
      var section = num % 10000
      if (needZero) {
        chnStr = this.chnNumChar[0] + chnStr
      }
      strIns = this.sectionToChinese(section)
      strIns +=
        section !== 0 ? this.chnUnitSection[unitPos] : this.chnUnitSection[0]
      chnStr = strIns + chnStr
      needZero = section < 1000 && section > 0
      num = Math.floor(num / 10000)
      unitPos++
    }
    if (numbak >= 10 && numbak < 20) return chnStr.substr(1)
    return chnStr
  },
  sectionToChinese (section) {
    var strIns = ''
    var chnStr = ''
    var unitPos = 0
    var zero = true
    while (section > 0) {
      var v = section % 10
      if (v === 0) {
        if (!zero) {
          zero = true
          chnStr = this.chnNumChar[v] + chnStr
        }
      } else {
        zero = false
        strIns = this.chnNumChar[v]
        strIns += this.chnUnitChar[unitPos]
        chnStr = strIns + chnStr
      }
      unitPos++
      section = Math.floor(section / 10)
    }
    return chnStr
  },
  // 格式化时间的时候验证不为空
  formatteNewDate (val) {
    if (val === null || val === undefined || val === '') {
      return null
    } else {
      return new Date(val)
    }
  },
  // 构建通用表单验证规则
  buildRules (arrays, selectFields) {
    let rules = {}
    arrays.forEach(array => {
      var rule = []
      var trigger = 'blur'
      if (selectFields) {
        selectFields.forEach(field => {
          if (field === array.fieldName) {
            trigger = 'change'
          }
        })
      }
      // 最大长度限制
      if (array.maxLength !== -1) {
        rule.push({
          max: array.maxLength,
          message: '最大输入：' + array.maxLength,
          trigger: trigger
        })
      }

      // 必填限制
      if (array.required) {
        rule.push({
          required: array.required,
          message: '请输入内容',
          trigger: trigger
        })
      }
      // 类型限制
      let t = array.type.toLowerCase()
      if (array.type) {
        let type
        switch (array.type) {
          case 'string':
            type = '字符型'
            break
          case 'text':
            type = '字符型'
            break
          case 'int':
            t = 'number'
            type = '数字型'
            break
          case 'double':
            t = 'number'
            type = '数字型'
            break
          case 'date':
            type = '日期型'
            break
          default:
            type = ''
            break
        }
        rule.push({
          type: t,
          message: '输入类型限制：' + type,
          trigger: trigger
        })
      }
      rules[array.fieldName] = rule
    })
    return rules
  },
  datetoMonth (val) {
    let arr = [
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '十一',
      '十二'
    ]
    return arr[parseInt(val, 10) - 1] + '月'
  },
  // 状态码转义
  stateTranslate (code) {
    for (var k in _const.state) {
      if (_const.state[k].value === code) {
        return _const.state[k].name
      }
    }
  }
}
