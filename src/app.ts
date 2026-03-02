import { queryUserGroupRight } from '@/services/user';
import { getWebParam } from '@/services/common/list';
// debugger
/**
 * 对象数组分组
 * @param arr
 */
const groupObjArr = (arr: any[]) => {
  if (arr.length < 1) {
    return [];
  }
  return arr.reduce((prevValue: any, currentValue: any) => {
    let index = -1;
    prevValue.some((item: any, i: number) => {
      if (item.func_code === currentValue.func_code) {
        index = i;
        return true;
      }
      return false;
    });
    if (index > -1) {
      prevValue[index].ability_code.push({
        key: currentValue.ability_code,
        template_code: currentValue.template_code,
      });
    } else {
      prevValue.push({
        func_code: currentValue.func_code,
        ability_code: [
          {
            key: currentValue.ability_code,
            template_code: currentValue.template_code,
          },
        ],
      });
    }
    return prevValue;
  }, []);
};

async function init() {
  const res = await getWebParam();
  if (res.errCode === 0) {
    localStorage.setItem('hw-fire-web-param', res.webParam);
  } else {
    throw new Error('服务器上没有配置华为云以及报表对应的静态数据');
  }

  // 请求用户权限
  let groupList = [];
  try {
    groupList = JSON.parse(localStorage.getItem('login-user-information') as string).groupInfo;
  } catch (e) {
    groupList = [];
  }
  const groupCode = groupList.map((item: any) => item.group_code).join(',');
  console.log('groupCode :>> ', groupCode);
  const userGroupRight = await queryUserGroupRight({
    sort: 'func_code',
    order: 'asc',
    group_code: groupCode,
    module_code: (() => {
      switch (localStorage.getItem("auth-default-wbs-prop-key")) {
        case 'branchComp':
          // document.querySelector('#root')?.classList.add('company')
          // setOverflowXHidden()
          return 'B51'
        case 'subComp':
          // document.querySelector('#root')?.classList.add('company')
          // setOverflowXHidden()
          return 'S51'
        default:
          // document.querySelector('#root')?.classList.add('dev')
          return 'D51'
      }
    })()
  });
  console.log('userGroupRight :>> ', userGroupRight);
  // 把权限存到缓存里面
  localStorage.setItem('auth_wbs_right_design', JSON.stringify(groupObjArr(userGroupRight)));
}

// init()


// 动态菜单配置 -》研究怎么生成系统自带的动态菜单 -》微前端（qiankun）集成 顺 / 性能调优
export const qiankun = {
  // 应用 render 之前触发
  async mount() {
    // const res = await getWebParam();
    // if (res.errCode === 0) {
    //   localStorage.setItem('hw-fire-web-param', res.webParam);
    // } else {
    //   throw new Error('服务器上没有配置华为云以及报表对应的静态数据');
    // }

    // // 请求用户权限
    // let groupList = [];
    // try {
    //   groupList = JSON.parse(localStorage.getItem('login-user-information') as string).groupInfo;
    // } catch (e) {
    //   groupList = [];
    // }
    // const groupCode = groupList.map((item: any) => item.group_code).join(',');
    // const userGroupRight = await queryUserGroupRight({
    //   sort: 'func_code',
    //   order: 'asc',
    //   group_code: groupCode,
    //   module_code: (() => {
    //     switch (localStorage.getItem("auth-default-wbs-prop-key")) {
    //       case 'branchComp':
    //         document.querySelector('#root')?.classList.add('company')
    //         // setOverflowXHidden()
    //         return 'B51'
    //       case 'subComp':
    //         document.querySelector('#root')?.classList.add('company')
    //         // setOverflowXHidden()
    //         return 'S51'
    //       default:
    //         document.querySelector('#root')?.classList.add('dev')
    //         return 'D51'
    //     }
    //   })()
    // });
    // // 把权限存到缓存里面
    // localStorage.setItem('auth_wbs_right_design', JSON.stringify(groupObjArr(userGroupRight)));
  },
  // 应用卸载之后触发
  async unmount(props: any) {
    console.log('app1 unmount', props);
  },
};
