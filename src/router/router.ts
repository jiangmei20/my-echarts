/**
 * @description : 路由
 * @author：jm
 * @email :
 * @creatTime : 2022/06/12
 */

export default [
  {
    path: '/',
    component: '@/layouts/index',
    exact: false,
    routes: [
      {
        path: '/home',
        name: '首页',
        component: '@/pages/Home',
      },
    ],
  },
];
