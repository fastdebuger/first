import routesBranchComp from "./routesBranchComp";
import routesSubComp from "./routesSubComp";
import routesDep from "./routesDep";

export default [
  {
    routes: [
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/workBench',
                name: '工作台',
                icon: 'icon-home2',
                component: './WorkBench',
              },
              ...routesBranchComp,
              ...routesSubComp,
              ...routesDep,
              // {
              //   path: '/system',
              //   name: '业务系统',
              //   icon: 'icon-menu',
              //   routes: [
              //     ...routesBranchComp,
              //     ...routesSubComp,
              //     ...routesDep,
              //   ]
              // },
              // {
              //   path: '/',
              //   redirect: '/contract/income',
              // },
              // {
              //   path: '/base',
              //   redirect: `/contract/income`,
              // },
              // {
              //   path: '/steel',
              //   redirect: '/contract/income',
              // },

              {
                path: '/userInfo',
                name: '个人中心',
                component: './UserInfo',
                hideInMenu: true,
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
