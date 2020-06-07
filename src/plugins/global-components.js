
import Vue from 'vue'

import Modal from '@/components/templates/Modal'

const components = { Modal }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
