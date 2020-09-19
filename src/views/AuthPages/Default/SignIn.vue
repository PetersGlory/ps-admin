<template>
  <div>
    <h1 class="mb-0">Sign in</h1>
    <p>Enter your email address and password to access admin panel.</p>
    <sign-in1-form formType="jwt" username="7738455452" password="admin"></sign-in1-form>
  </div>
</template>

<script>
import SignIn1Form from './Forms/SignIn1Form'

export default {
  name: 'SignIn1',
  components: { SignIn1Form },
  data: () => ({}),
  mounted () {
    const loggedIn = this.$helper.getCookie('jwt-token')
    if (loggedIn !== undefined && loggedIn !== null) {
      this.$router.push({ name: 'dashboard' })
    }
  },
  methods: {
  }
}
</script>
