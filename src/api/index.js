/* eslint-disable no-unused-vars */
import nprogress from 'nprogress'
import axios from 'axios'
import config from '@/services/config'
import auth from '@/services/auth'
import * as helper from '@/services/helper'

const headers = {
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json'
  // 'x-apikey': config.API_KEY
  // 'User-Agent': navigator.userAgent
}
const apiAxios = axios.create({
  baseURL: config.API_URL,
  headers: headers
})
const requestLogger = {
  url: config.LOGGER_URL,
  params: {
    InteractionId: null,
    RequestTimestamp: null,
    ResponseTimestamp: null,
    StatusCode: null,
    RequestURL: null,
    RequestVerb: null
  },
  send: function () {
    // axios.post(this.url, this.params);
  }
}

apiAxios.interceptors.request.use(function (config) {
  var date = new Date()
  var timestamp = date.getTime()
  console.log(config)
  // Do something before request is sent
  nprogress.start()
  config.RequestTimestamp = timestamp
  // config.params.tm = timestamp
  config.params = { ...config.params, t: timestamp }
  return config
}, function (error) {
  // Do something with request error
  nprogress.start()
  return Promise.reject(error)
})

// Add a response interceptor
apiAxios.interceptors.response.use(function (response) {
  var date = new Date()
  var timestamp = date.getTime()
  // Do something with response data
  nprogress.done()
  requestLogger.params.RequestTimestamp = response.config.RequestTimestamp
  requestLogger.params.ResponseTimestamp = timestamp
  requestLogger.params.StatusCode = response.status
  requestLogger.params.RequestURL = response.config.url.replace(response.config.baseURL, '')
  requestLogger.params.RequestVerb = response.config.method.toUpperCase()
  requestLogger.params.InteractionId = response.config.headers.interactionId
  // console.log('requestLogger', requestLogger);
  requestLogger.send()
  return response
}, function (error) {
  // Do something with response error
  if (error.response.status === 401) {
    auth.logout()
  }
  nprogress.done()
  return Promise.reject(error)
})
function interactionId () {
  var text = ''
  var stringLength = 17
  var stringArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  for (var i = 1; i < stringLength; i++) {
    var rndNum = Math.ceil(Math.random() * stringArray.length) - 1
    text = text + stringArray[rndNum]
  }
  return text
}

export default {
  initHeaders () {
    if (auth.user.authenticated) {
      apiAxios.defaults.headers.common.Authorization = 'JWT ' + helper.getCookie('jwt-token')
    }
  },

  // Login
  login (params, cb, errorCb) {
    apiAxios.post(config.LOGIN_URL, params)
      .then((objects) => {
        cb(objects.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },

  // SignUp
  signup (params, cb, errorCb) {
    // http://{{awshost}}/UserManagement/v1/user/register
    apiAxios.post(config.SIGNUP_URL, params)
      .then((objects) => {
        cb(objects.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },
  resendToken (params, cb, errorCb) {
    apiAxios.post(config.RESEND_TOKEN, params)
      .then((objects) => {
        cb(objects.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },

  // Verify
  verify (params, cb, errorCb) {
    apiAxios.get(config.VERIFY_URL + '?code=' + params.code)
      .then((object) => {
        cb(object.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },

  // LoginWithToken
  loginWithToken (params, cb, errorCb) {
    var url = config.LOGIN_WITH_TOKEN_URL + '?code=' + params.code
    if (params.state) {
      url = config.LOGIN_WITH_TOKEN_URL + '?code=' + params.code + '&state=' + params.state
    }
    apiAxios.get(url)
      .then((object) => {
        cb(object.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },
  // forgotPassword
  forgotPassword (params, cb, errorCb) {
    apiAxios.get(config.FORGOT_PASSWORD_URL + '?emailId=' + params.email + '&reset=true')
      .then((object) => {
        cb(object.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },

  // resetPassword
  resetPassword (emailId) {
    return new Promise((resolve, reject) => {
      apiAxios.get(`${config.USERLIST}/${emailId}${config.RESET_PASSWORD}`)
        .then((objects) => {
          resolve(objects.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  removeFromWorkSpace (userId) {
    return new Promise((resolve, reject) => {
      apiAxios.patch(`${config.USERLIST}/${userId}${config.REMOVE_FROM_WORKSPACE}`)
        .then((objects) => {
          resolve(objects)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  // resetPassword
  resetPasswordChange (params, cb, errorCb) {
    apiAxios.post(config.RESET_PASSWORD_CHANGE_URL, params)
      .then((objects) => {
        cb(objects.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },

  // ChangePassword
  changePassword (params) {
    return new Promise((resolve, reject) => {
      apiAxios.put(config.CHANGE_PASSWORD_URL, params)
        .then((objects) => {
          resolve(objects.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  // ChangePassword
  getUserRoles (params, cb, errorCb) {
    apiAxios.get(config.GET_ROLES)
      .then((objects) => {
        cb(objects.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },

  // validateToken
  validateToken (token, cb, errorCb) {
    // console.log(token);
    apiAxios.get(config.VALIDATE_TOKEN, { headers: { JSESSIONID: token } })
      .then((object) => {
        cb(object.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },

  getUIPermissions (cb, errorCb) {
    apiAxios.get(config.UI_PERMISSIONS)
      .then((object) => {
        cb(object.data)
      })
      .catch(e => {
        errorCb(e)
      })
  },

  // logout
  logout () {
    return new Promise((resolve, reject) => {
      apiAxios.post(config.LOGOUT_URL)
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  // delete sessions
  deleteSessions () {
    return new Promise((resolve, reject) => {
      apiAxios.delete(config.DELETE_SESSIONS)
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  getCategories (params) {
    return new Promise((resolve, reject) => {
      apiAxios.get(config.CATEGORY_URL, {
        params: {
          ...params
        }
      })
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  getCategoryById (params) {
    return new Promise((resolve, reject) => {
      apiAxios.get(config.CATEGORY_URL + '/' + params.id)
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  addCategory (params) {
    return new Promise((resolve, reject) => {
      apiAxios.post(config.CATEGORY_URL + '/', params)
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  saveCategory (params) {
    return new Promise((resolve, reject) => {
      apiAxios.put(config.CATEGORY_URL + '/' + params.id + '/', params)
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  deleteCategory (params) {
    return new Promise((resolve, reject) => {
      apiAxios.delete(config.CATEGORY_URL + '/' + params.id)
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  addSubCategories (params) {
    return new Promise((resolve, reject) => {
      apiAxios.post(config.SUB_CATEGORY_URL + '/', params)
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  saveSubCategories (params) {
    return new Promise((resolve, reject) => {
      apiAxios.put(config.SUB_CATEGORY_URL + '/' + params.id + '/', params)
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  deleteSubCategories (params) {
    return new Promise((resolve, reject) => {
      apiAxios.delete(config.SUB_CATEGORY_URL + '/' + params.id)
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  getProducts (params) {
    return new Promise((resolve, reject) => {
      apiAxios.get(config.PRODUCT_URL, {
        params: {
          ...params
        }
      })
        .then((object) => {
          resolve(object.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}
