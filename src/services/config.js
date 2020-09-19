export default {
  API_URL: (!process.env.VUE_APP_API_BASE_URL ? window.location.origin : process.env.VUE_APP_API_BASE_URL) + (process.env.VUE_APP_API_URL || ''),
  LOGIN_URL: '/login/',
  CATEGORY_URL: '/category'
}
