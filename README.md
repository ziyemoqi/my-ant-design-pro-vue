My Ant Design Pro Vue
====

当前最新版本： 0.0.1（发布日期：20190904）

Overview
----

基于 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 实现的 Ant Design Pro  Vue 版
前段UI框架，采用前后端分离方案。



#### 前端技术

- 基础框架：[ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- JavaScript框架：Vue
- Webpack
- node
- yarn
- eslint
- @vue/cli 3.2.1

### 后端技术
- SpringBoot
- Mysql
- MybatisPlus
- ...

项目下载和运行
----

- 拉取项目代码
```bash
git clone https://github.com/Kroos-x/my-ant-design-pro-vue.git
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```



其他说明
----

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请更新您的 cli

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码

- 修改 Ant Design 配色，在文件 `vue.config.js` 中，其他 less 变量覆盖参考 [ant design](https://ant.design/docs/react/customize-theme-cn) 官方说明
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```



文档解析
----

* ```bash
  ├── public
  │   └── logo.png             # LOGO
  |   └── index.html           # Vue 入口模板
  ├── src
  │   ├── api                  # Api ajax 等
  │   ├── assets               # 本地静态资源
  │   ├── config               # 项目基础配置，包含路由，全局设置
  │   ├── components           # 业务通用组件
  │   ├── core                 # 项目引导, 全局配置初始化，依赖包引入等
  │   ├── router               # Vue-Router
  │   ├── store                # Vuex
  │   ├── utils                # 工具库
  │   ├── locales              # 国际化资源
  │   ├── views                # 业务页面入口和常用模板
  │   ├── App.vue              # Vue 模板入口
  │   └── main.js              # Vue 入口 JS
  │   └── permission.js        # 路由守卫(路由权限控制)
  ├── tests                    # 测试工具
  ├── README.md
  └── package.json
  ```
  
* views和components 文件夹
  
  * views是页面级组件，一般views组件不被复用
  * components是小组件，小组件可被引用在views中

备注
----

> 路由配置问题，如何首次跳转到/user/login
