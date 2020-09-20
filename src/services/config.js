export default {
  API_URL: (!process.env.VUE_APP_API_BASE_URL ? window.location.origin : process.env.VUE_APP_API_BASE_URL) + (process.env.VUE_APP_API_URL || ''),
  CURRENCY_ICON: '&#8377;',
  LOGIN_URL: '/login/',
  LOGOUT_URL: '/logout/',
  CATEGORY_URL: '/category',
  SUB_CATEGORY_URL: '/subcategory',
  PRODUCT_URL: '/product'
}
