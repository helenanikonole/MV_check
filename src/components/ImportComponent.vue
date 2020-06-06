<template> 
    <div>
      <client-only placeholder="Loading...">
        <component :is="componentFile"/>
      </client-only>
    </div>
</template>
<script>
export default {
  props: {
    componentName: {
      type: String,
      default: 'Default'
    },
    type: {
      type: String,
      default: 'modals'
    }
  },
  computed: {
    componentFile() {
      const context = this
      return () => import(`./${context.type}/${context.componentName}`)
    }
  }
}
</script>
