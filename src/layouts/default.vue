<template>
  <div class="page">
    <div class="text-in-corner z-index-10">Project name</div>
    <nuxt/>  
  </div>
</template>
<style lang='scss'>
@import '@/assets/scss/pages/main.scss';
@import '@/assets/scss/components/modal.scss';
</style>
<script>
import {mapActions, mapMutations} from 'vuex'
import { mapState } from 'vuex'
export default {
  computed:{
    ...mapState({})
  },
  mounted(){    
  },
  methods: {    
  }
}
</script>
