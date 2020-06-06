<template>
  <div>
    <div class="page">
      <nuxt/>  
    </div>
  </div>
</template>
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
