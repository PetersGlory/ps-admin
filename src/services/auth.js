/* eslint-disable prefer-promise-reject-errors */
import API from '@/api'
import config from '@/services/config'
import * as helper from '@/services/helper'

export default {
  // User object will let us check authentication status
  user: {
    authenticated: false,
    emailID: ''
  },

  // Send a request to the login URL and save the returned JWT
  login (context, creds, redirect) {
    context.message.type = ''
    context.message.data = []
    API.login(creds,
      data => {
        this.loginSuccess(data, context)
        // Redirect to a specified route
        if (redirect) {
          context.$router.push(redirect)
        }
      },
      e => {
        context.message.type = 'error'
        context.message.data = helper.formatError(e)
        context.success = false
      }
    )
  },

  loginSuccess (data, context) {
    helper.setCookie('jwt-token', data.token)
    context.$store.commit('SET_USER', data.user)
    this.user.authenticated = true
    API.initHeaders()
  },

  signup (context, creds, redirect) {
    context.message.type = ''
    context.message.data = []
    API.signup({
      loginId: creds.login_id,
      email: creds.email,
      password: helper.encrypt(creds.password),
      firstName: creds.first_name,
      lastName: creds.last_name,
      roles: creds.role
    },
    data => {
      context.success = true
      context.message.type = ''
      context.message.data = []
      this.user.emailID = creds.email
      // Redirect to a specified route
      if (redirect) {
        context.$router.push(redirect)
      }
    },
    e => {
      context.message.type = 'error'
      context.message.data = helper.formatError(e)
      context.success = false
    }
    )
  },

  loginWithGoogle () {
    window.location = config.GOOGLE_URL
    // window.open(config.GOOGLE_URL,'popUpWindow','height=400,width=600,left=10,top=10,,scrollbars=yes,menubar=no');
  },
  loginWithFacebook () {
    window.location = config.FACEBOOK_URL
    // window.open(config.FACEBOOK_URL,'popUpWindow','height=400,width=600,left=10,top=10,,scrollbars=yes,menubar=no');
  },
  // To log out, we just need to remove the token
  logout (context) {
    API.logout().then(
      data => {
        this.logoutClientSide()
      }).catch(
      e => {
        this.logoutClientSide()
      })
  },
  logoutClientSide () {
    helper.eraseCookie('jwt-token')
    this.user.authenticated = false
    location.reload()
  },
  checkAuth (store) {
    return new Promise((resolve, reject) => {
      const jwt = helper.getCookie('jwt-token')
      if (jwt) {
        API.getUserProfile(jwt)
          .then(response => {
            this.user.authenticated = true
            store.commit('SET_USER', response)
            API.initHeaders()
            resolve(true)
          })
          .catch(err => {
            this.user.authenticated = false
            reject(err)
          })
      } else {
        this.user.authenticated = false
        reject(false)
      }
    })
  }
}
