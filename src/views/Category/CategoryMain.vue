<template>
    <div>
      <router-link :to="{name:'category.edit',params:{name:'nilesh', id:2}}">2</router-link>
    </div>
</template>
<script>
import { core } from '../../config/pluginInit'
export default {
  name: 'CategoryMain',
  mounted () {
    core.index()
  }
}
</script>
