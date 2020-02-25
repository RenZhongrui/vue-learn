import Layout from '@/layout';
export default [
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {title: 'Error Pages', icon: '404'},
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', icon:'dashboard',noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true } // 如果前面所有路由都匹配不到，则到404页面
];