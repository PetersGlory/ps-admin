/* eslint-disable no-mixed-operators */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-extend-native */
import auth from './auth.js'
import JSEncrypt from 'jsencrypt'
import config from './config.js'
import moment from 'moment'
export function addCommas (x) {
  x = parseInt(x)
  x = x.toString()
  var lastThree = x.substring(x.length - 3)
  var otherNumbers = x.substring(0, x.length - 3)
  if (otherNumbers !== '') { lastThree = ',' + lastThree }
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
}

export function colorHightlight (str) {
  var repl1 = new RegExp('[{]{3}(?=[a-zA-Z_0-9\-])', 'g')
  var repl2 = new RegExp('(?<=[a-zA-Z_0-9\-])[}]{3}', 'g')
  return str.replace(repl1, "<span title='variable' class='text-orange'>{{{").replace(repl2, '}}}</span>')
}

export function titleFormatter (m) {
  return ucwords(m.replace(/_/g, ' '))
}

String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

export function getKeyMap (key, arr, str, obj) {
  if (typeof (obj) === 'object') {
    for (const k in obj) {
      if (k === key) {
        arr.push(str + '|||' + k)
      }
      getKeyMap(key, arr, str + '|||' + k, obj[k])
    }
  }
  return arr
}

export function unslug (m) {
  return titleFormatter(m.replaceAll('-', ' '))
}
export function configName (m) {
  return m.replaceAll('-', '_').toUpperCase()
}

export function camelCaseSlug (m) {
  return titleFormatter(m.replaceAll('-', ' ')).replaceAll(' ', '')
}

export function ucwords (str) {
  // str = str.toLowerCase();
  return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
    return $1.toUpperCase()
  })
}

export function isObjectEmpty (obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function objectDeepClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function formatError (error) {
  if (!error.response) {
    return error
  }

  if (error.response.status && error.response.status === 401) {
    auth.logoutClientSide()
  }
  if (error.response.data.error.hasOwnProperty('userMessage')) {
    return [error.response.data.error.userMessage]
  }
  return ['StatusCode ' + error.response.data.error.statusCode]
}

export function checkIfValidJSON (text) {
  try {
    return (JSON.parse(text) && !!text)
  } catch (e) {
    return false
  }
}

export function formatValidations (attributes) {
  const obj = {}
  attributes.map((attribute, index) => {
    const valiArray = {}
    // Real code
    JSON.parse(attribute.validations.validation).map((validation, index) => {
      if (validation.enabled) {
        switch (validation.validationName) {
          case 'regex':
            valiArray.regex = validation.value
            break
          case 'isNumber':
            valiArray.numeric = true
            break
          case 'minLength':
            valiArray.min = parseInt(validation.value)
            break
          case 'maxLength':
            valiArray.max = parseInt(validation.value)
            break
          case 'isGt':
            valiArray['min-value'] = parseInt(validation.value)
            break
          case 'isEqual':
            valiArray.in = [validation.value]
            break
          case 'isNotEqual':
            valiArray.not_in = [validation.value]
            break
          case 'mandatory':
            valiArray.required = true
            break
          default:
        }
      }
    })

    // This is temp solution
    // if(attribute.attributeName === 'name')
    // {
    //   valiArray["required"] = true;
    //   obj[attribute.attributeName] = valiArray;
    // }

    obj[attribute.attributeId] = valiArray
  })
  return obj
}

export function checkIfJSON (jsonString) {
  try {
    var o = JSON.parse(jsonString)
    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === 'object') {
      return true
    }
  } catch (e) {
  }

  return false
};

export function getBlankObject (a) {
  const obj = {}
  Object.keys(a).map((attr, index) => {
    if ((typeof (a[attr]) === 'object') && a[attr] !== null) {
      if (a[attr] instanceof Array) {
        if (a[attr].length === 0) {
          obj[attr] = []
        } else {
          obj[attr] = [this.getBlankObject(a[attr][0])]
        }
      } else {
        // Its an object
        obj[attr] = this.getBlankObject(a[attr])
      }
    } else {
      obj[attr] = ''
    }
  })

  return obj
};
export function makeid () {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < 5; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}
export function formatNumber (number) {
  return number > 10 ? number : '0' + number
}
export function getCredit (credit) {
  return credit > 999 ? (credit / 1000).toFixed(1) + 'k' : credit
}
export function encrypt (password) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(config.publicKey)
  return encrypt.encrypt(password)
}
export function getNameAbbr (name) {
  const namearr = name.split(' ')
  const letterArr = namearr.map(word => {
    return word.charAt(0).toUpperCase()
  })
  return letterArr.join('').substring(0, 2)
}
export function getNameAbbrClass (name) {
  const namearr = name.split(' ')
  return namearr[0].charAt(0).toUpperCase()
}

export function getFormattedOptions (obj) {
  if (typeof (obj) === 'undefined') {
    return []
  }

  return obj.map(opt => {
    if (typeof (opt) === 'object') {
      return opt
    } else {
      return Object.assign({}, {
        id: opt,
        label: opt
      })
    }
  })
}

export function getFormattedOptionsForSwaggerNames (obj) {
  if (typeof (obj) === 'undefined') {
    return []
  }

  return obj.map(opt => {
    return Object.assign({}, {
      id: opt.name,
      label: opt.name
    })
  })
}

export function readJSONFile (file, callback, errCb) {
  const reader = new FileReader()
  reader.onload = function (params) {
    try {
      callback(JSON.parse(event.target.result))
    } catch (error) {
      if (errCb) {
        errCb(error)
      } else {
        console.log(error)
      }
    }
  }
  reader.readAsText(file)
}

export function readFile (file, callback, errCb) {
  const reader = new FileReader()
  reader.onload = function (params) {
    try {
      callback(event.target.result)
    } catch (error) {
      if (errCb) {
        errCb(error)
      } else {
        console.log(error)
      }
    }
  }
  reader.readAsText(file)
}

export function typeOf (value) {
  var s = typeof value
  if (s === 'object') {
    if (value) {
      if (value instanceof Array) {
        s = 'array'
      }
    } else {
      s = 'null'
    }
  }
  return s
}

export function groupBy (list, keyGetter) {
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

export function slugify (text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export function cleanObject (obj) {
  const object = objectDeepClone(obj)
  const type = typeof object
  const isArray = object instanceof Array

  if (type === 'object') {
    if (isArray === true) {
      object.map(o => cleanObject(o))
    } else {
      const keys = Object.keys(object)
      keys.forEach(key => {
        if (object[key] === '' || object[key] === null || typeof (object[key]) === 'undefined') {
          delete object[key]
        }
      })
    }
  }
  return object
}

export function download (filename, text) {
  // Set up the link
  var link = document.createElement('a')
  link.setAttribute('target', '_blank')
  if (Blob !== undefined) {
    var blob = new Blob([text], { type: 'text/plain' })
    link.setAttribute('href', URL.createObjectURL(blob))
  } else {
    link.setAttribute('href', 'data:text/plain,' + encodeURIComponent(text))
  }
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
export function downloadObjectAsJson (exportName, exportObj) {
  var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj, 0, 4))
  var downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', exportName + '.json')
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

export function downloadObjectAsYaml (exportName, exportObj) {
  var dataStr = 'data:text/yaml;charset=utf-8,' + encodeURIComponent(exportObj)
  var downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', exportName + '.yaml')
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

export function returnDateModified (dateModified, type) {
  if (dateModified === '' || dateModified === undefined || dateModified === null) { return '' } else
  if (type === 'date') { return dateModified.slice(0, 10) }
  if (type === 'time') { return dateModified.slice(11, 16) }
}
export function sortArrayByKey (arrays, key) {
  function compare (a, b) {
    if (a[key] < b[key]) { return -1 }
    if (a[key] > b[key]) { return 1 }
    return 0
  }

  return arrays.sort(compare)
}
export function sortArrayByDate (arrays, key) {
  // sort the data by date using moment.js
  return objectDeepClone(arrays).sort(function (left, right) {
    return moment.utc(right[key]).diff(moment.utc(left[key]))
  })
}

export function presetRanges () {
  return {
    today: function () {
      const startToday = moment().subtract(7, 'd').toDate()
      const endToday = moment().toDate()
      return {
        label: 'Week',
        active: false,
        dateRange: {
          start: startToday,
          end: endToday
        }
      }
    },
    last30days: function () {
      const startToday = moment().subtract(30, 'd').toDate()
      const endToday = moment().toDate()
      return {
        label: 'Month',
        active: false,
        dateRange: {
          start: startToday,
          end: endToday
        }
      }
    }
  }
}
export function hasDuplicates (array) {
  var valuesSoFar = []
  for (var i = 0; i < array.length; ++i) {
    var value = array[i]
    if (valuesSoFar.indexOf(value) !== -1) {
      return true
    }
    valuesSoFar.push(value)
  }
  return false
}
export function validURL (str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
  return !!pattern.test(str)
}
/* JSON string formatter */
export function jsonFormatToString (data) {
  if (!checkIfJSON(data)) {
    return data
  } else {
    if (typeOf(data) === 'string') {
      data = JSON.parse(data)
    }
    return JSON.stringify(data, 0, 4)
  }
}
export const hasExtension = (fileName, exts) => {
  return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName)
}
export function formatBytes (a, b) { if (a === 0) return '0 Bytes'; var c = 1024; var d = b || 2; var e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; var f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f] }

export function pagination (c, m) {
  var current = c
  var last = m
  var delta = 2
  var left = current - delta
  var right = current + delta + 1
  var range = []
  var rangeWithDots = []
  var l

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || i >= left && i < right) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

export function generateRandomKey () {
  return (new Date()).getTime()
}

export function serialize (obj, prefix) {
  const str = []; let p
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + '[' + p + ']' : p
      const v = obj[p]
      str.push((v !== null && typeof v === 'object')
        ? serialize(v, k)
        : encodeURIComponent(k) + '=' + encodeURIComponent(v))
    }
  }
  return str.join('&')
}

export function getUniqueId () {
  return new Date().getTime()
}

export function showElement (obj, getCurrentRoles, userType) {
  let showElement = false

  const roles = obj.roles ? obj.roles.map(r => r.toLowerCase()) : []
  const currentRoles = getCurrentRoles.map(r => r.toLowerCase())

  if (!obj.userType && roles.length === 0) {
    showElement = true
  }

  if (roles.length) {
    const intersection = currentRoles.filter(element => roles.includes(element))
    if (intersection.length > 0) {
      showElement = true
    }
  }

  if (obj.userType && obj.userType === userType) {
    showElement = true
  }

  if (obj.enabled === false) {
    showElement = false
  }

  return showElement
}

export function calHeight (arrayOfIds) {
  let sum = 0
  arrayOfIds.forEach(el => {
    if (document.getElementById(el)) {
      sum = sum + document.getElementById(el).offsetHeight
    }
  })
  return sum
}

export function numberSuffix (i) {
  const j = i % 10
  const k = i % 100
  if (j === 1 && k !== 11) {
    return i + 'st'
  }
  if (j === 2 && k !== 12) {
    return i + 'nd'
  }
  if (j === 3 && k !== 13) {
    return i + 'rd'
  }
  return i + 'th'
}

export function setCookie (cookieName, cookieValue) {
  document.cookie = cookieName + '=' + cookieValue + ';path=/'
}

export function getCookie (cookieName) {
  const nameEQ = cookieName + '='
  const cookieArr = document.cookie.split(';')
  for (var i = 0; i < cookieArr.length; i++) {
    var c = cookieArr[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

export function eraseCookie (cookieName) {
  document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/'
  if (getCookie(cookieName)) {
  }
}

export function parseXMl (value) {
  let str = value
  if (window.DOMParser) {
    str = (new window.DOMParser()).parseFromString(str, 'text/xml')
  } else if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
    str = function (str) {
      var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM')
      xmlDoc.async = 'false'
      xmlDoc.loadXML(str)
      return xmlDoc
    }
  } else {
    str = function () { return null }
  }
  return str
}

export function xmlToJSON (xml) {
  var obj = {}

  if (xml.nodeType === 1) {
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {}
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j)
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue
      }
    }
  } else if (xml.nodeType === 3) {
    obj = xml.nodeValue
  }

  var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
    return node.nodeType === 3
  })
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
      return text + node.nodeValue
    }, '')
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i)
      var nodeName = item.nodeName
      if (typeof obj[nodeName] === 'undefined') {
        obj[nodeName] = this.xmlToJson(item)
      } else {
        if (typeof obj[nodeName].push === 'undefined') {
          var old = obj[nodeName]
          obj[nodeName] = []
          obj[nodeName].push(old)
        }
        obj[nodeName].push(this.xmlToJson(item))
      }
    }
  }
  return obj
}
