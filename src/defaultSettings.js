export default {
  primaryColor: '#1890FF', // 默认主题色
  navTheme: 'light', // ['dark', 'light'] 两种主题
  layout: 'sidemenu', // 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
  contentWidth: 'Fixed', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: true, // 固定 Header : boolean
  fixSiderbar: false, // 固定左侧菜单栏 ： boolean
  autoHideHeader: false, // 向下滚动时，隐藏 Header : boolean
  colorWeak: false,   // 色盲模式
  multipage: false, // 默认多页签模式
  // Vue-ls 插件配置项 (localStorage/sessionStorage)
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }
}
