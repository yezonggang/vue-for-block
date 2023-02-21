/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  //redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    roles: ['admin', 'editor'],
    title: '权限控制',
    icon: 'table'
  },
  children: [
    {
      path: '/lifuer',
      component: () => import('@/views/table/user-table'),
      name: 'guess',
      meta: {
        roles: ['admin', 'editor'],
        title: '用户管理',
        icon: 'form',
        affix: true
      }
    },
    {
      path: '/BargainHunting',
      component: () => import('@/views/table/role-table'),
      name: 'guess',
      meta: {
        roles: ['admin', 'editor'],
        title: '角色管理',
        icon: 'form',
        affix: true
      }
    },
    {
      path: '/BuyingPoint',
      component: () => import('@/views/table/user-role'),
      name: 'guess',
      meta: {
        roles: ['admin', 'editor'],
        title: '权限管理',
        icon: 'form',
        affix: true
      }
    }
  ]
}
export default tableRouter
