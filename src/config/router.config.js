// y
// eslint-disable-next-line
import { UserLayout, TabLayout } from '@/components/layouts'

// /**
//  * 走菜单，走权限控制
//  * @type {[null,null]}
//  */
export const asyncRouterMap = [

  {
    path: '/',
    name: 'dashboard',
    component: TabLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

// /**
//  * 白名单路由
//  * @type { *[] }
//  */
export const constantRouterMap = [

  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/user/Login')
      }
    ]
  }
]
