import Vue from 'vue'

const reqContext = require.context('.', false, /\.(vue|js)$/)
reqContext.keys().forEach(path => {
  let component = reqContext(path)
  component = component.default || component
  const componentName = component.name || (
    path
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  Vue.component(componentName, component)
})
