<template>
  <div class="nuxt-error">
    Error:<br/>
    {{error.message}}
  </div>
</template>
<script>
export default {
  name: 'nuxt-error',
   props: ['error'],
}
</script>