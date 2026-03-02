/**
 * PCDEMO v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useRef, useState } from 'react';
import type { Dispatch } from 'umi';
import { Link, useIntl, connect, history } from 'umi';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
// @ts-ignore
import logo from '@/assets/homeLeftLogo.png';
import { decryptConfig } from '@/utils/utils';
import { queryUserToDoInfo } from '@/services/approve';
import { Badge, Space, Tag, Tooltip } from 'antd';
import './BasicLayout.css';
// @ts-ignore
import styles from './BasicLayoutHeadder.css';
import CustomBreadcrumb from './CustomBreadcrumb';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
// @ts-ignore
import homeLeftLogo from "@/assets/homeLeftLogo.png";
import GlobalSearchModal from "@/layouts/GlobalSearchModal";

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
} & ProLayoutProps;
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};


/**
 * use Authorized check all menu item
 * 通过权限过滤菜单
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  // return menuList
  // 1. 获取用户权限列表
  let funCodeList: string[] = [];
  try {
    const authWbsRight = localStorage.getItem('auth_wbs_right');
    if (authWbsRight) {
      const userWbsRight = JSON.parse(authWbsRight);
      // 假设 userWbsRight 是一个对象数组，每个对象有 func_code 字段
      funCodeList = userWbsRight.map((r: any) => r.func_code).filter((code: any) => typeof code === 'string');
    }
  } catch (error) {
    console.error('解析用户权限数据失败:', error);
    // 失败时，funCodeList 保持为空数组，即无任何权限
    return [];
  }

  /**
   * 递归过滤路由/菜单列表
   * @param arr 待过滤的路由数组
   * @returns 过滤后的路由数组
   */
  const getAuthorityRoutes = (arr: MenuDataItem[]): MenuDataItem[] => {
    // 过滤掉那些没有权限的项
    return arr.filter(item => {
      // 1. 处理子路由/子菜单 (routes/children)
      if (item.routes && item.routes.length > 0) {
        // 递归过滤子项
        const filteredRoutes = getAuthorityRoutes(item.routes);

        // 如果子项被过滤后有剩余，则更新 item.routes (并赋值给 children，如果需要的话)
        if (filteredRoutes.length > 0) {
          item.routes = filteredRoutes;
          // 如果你的菜单组件依赖 'children' 字段，可以在这里同步更新
          item.children = filteredRoutes;
        } else {
          // 如果所有子项都被过滤了，清空 routes 数组，防止渲染空子菜单
          item.routes = undefined;
          item.children = undefined;
        }
      }

      // 2. 权限校验逻辑

      // 允许没有 'authority' 字段的路由通过 (通常是布局组件、重定向、404 等公共路由)
      if (!item.authority) {
        // 即使没有 authority，如果它是个父级菜单且routes为空，也不应该显示（除非它有 component）
        // 对于你提供的路由结构，我们允许没有 authority 的项通过，
        // 它们通常是顶层结构或重定向。
        return true;
      }

      // 如果 item 有 authority 字段，检查用户是否有该权限
      if (funCodeList.includes(item.authority)) {
        return true; // 有权限，保留
      }

      // 特殊情况：父级菜单自身没有权限，但其子项经过过滤后还有剩余。
      // 我们遵循：如果父级有 authority 且未通过校验，则整个父级及其子树都被过滤掉。
      // 如果没有权限且没有子路由/子菜单，则过滤掉
      if (item.authority && !funCodeList.includes(item.authority)) {
        return false;
      }

      // 走到这里只剩下有权限或没有 authority 的项。
      // 但为了确保逻辑清晰，我们再明确返回一次
      return true;
    });
  };
  // 这里的 menuList 通常是所有路由列表
  const arr = getAuthorityRoutes(menuList);
  return arr
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    route
  } = props;

  const isFirstRender = useRef(true); // 标记是否是第一次渲染

  const menuDataRef = useRef<MenuDataItem[]>([]);

  const [showCount, setShowCount] = useState("");

  const handleMenuCollapse = (payload: boolean): void => {
    // 忽略第一次渲染时的自动触发, 因为第一次渲染 组件内部会把 payload 变成 false 传过来
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  // localStorage.setItem('Cloud_Provider', 'local');
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'common/querySysBasicDict',
        payload: {
          sort: 'id',
          order: 'asc',
        }
      })
    }
  }, []);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'common/getWebParam',
        callback(res: any) {
          if (res.errCode === 0) {
            localStorage.setItem('hw-fire-web-param', res.webParam);
            try {
              const dWebParam = decryptConfig(res.webParam);
              const result = JSON.parse(dWebParam);
              // console.log(result, 'result');
              // console.log('--hw-fire-web-param---result', result);
              localStorage.setItem('Cloud_Provider', result.Cloud_Provider);
              localStorage.setItem('Cloud_Route', result.Cloud_Route || 'web');
            } catch (e) {
              console.error('utils getWebParam/decrypt error');
            }
          } else {
            throw new Error('服务器上没有配置云服务器及报表对应的静态数据');
          }
        },
      });
      // 查询用户待办事项
      fetchList()
    }
  }, [])

  /**
   * 查询用户待办事项
   * 如果存在显示徽标
   */
  const fetchList = async () => {
    const userCode = localStorage.getItem('auth-default-userCode');
    const wbsCode = localStorage.getItem('auth-default-wbsCode');
    const res = await queryUserToDoInfo({
      sort: 'is_looked asc,create_time',
      order: 'desc',
      filter: JSON.stringify([
        { "Key": "wbs_code", "Val": wbsCode, "Operator": "=" },
        { "Key": "user_code", "Val": userCode, "Operator": "=" },
        { "Key": "is_looked", "Val": "0", "Operator": "=" }
      ])
    });
    setShowCount(res?.total)
  }

  // 数据驾驶舱页面
  if (location?.pathname?.includes('/branchComp/DataCockpit')) {
    return (
      <div>{children}</div>
    )
  }

  return (
    <div id='basiclayout'>
      <ProLayout
        logo={<img style={{borderRadius: 6}} src={logo}/>}
        formatMessage={formatMessage}
        {...props}
        {...settings}
        // collapsed={showCollapsed}
        onCollapse={handleMenuCollapse}
        headerHeight={60}
        headerRender={(headerProps: any) => {
          return (
            <header className={styles.header}>
              <div className={styles.headerPattern} />
              <div className={styles.logo} style={{display: 'flex', alignItems: 'center'}}>
                <img src={homeLeftLogo} style={{width: 30, marginRight: 8, marginLeft: -8}} />
                公司数字化管理平台
              </div>
              <div className={styles.headerRight}>
                {/* <div className={styles.searchBox}>
                  <Search size={16} color="#999" />
                  <input placeholder="小智一下，搜你所想" />
                  <button className={styles.searchBtn}>搜索</button>
                </div> */}
                {/* 占位推右 */}
                <div style={{ flex: 1 }}></div>

                {/* 右侧内容（用户信息等） */}
                {headerProps.rightContentRender?.()}
              </div>
            </header>
          )
        }}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          // 待办事项需要提示
          if (menuItemProps.path?.endsWith("/ToDoList")) {
            return (
              <Link
                to={menuItemProps.path}
              >
                {defaultDom}
                {(
                  <Badge
                    count={showCount}
                    offset={[2, -12]}
                  >
                  </Badge>
                )}
              </Link>
            );
          }

          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        postMenuData={(menuData) => {
          menuDataRef.current = menuData || [];
          return menuData || [];
        }}
      >
        {location?.pathname === '/workBench' ? (
          <div>
            {children}
          </div>
        ) : (
          <div style={{marginTop: -8}}>
            <Space>
              {props.collapsed ? (
                <Tooltip title="展开">
                  <RightCircleOutlined onClick={() => {
                    handleMenuCollapse(false)
                  }} />
                </Tooltip>
              ) : (
                <Tooltip title="展开">
                  <LeftCircleOutlined onClick={() => {
                    handleMenuCollapse(true)
                  }}/>
                </Tooltip>
              )}
              <CustomBreadcrumb routes={route.routes || []} pathName={location.pathname || ''}/>
              <Tag color="blue">Shift/鼠标左键 双击两下可唤起菜单检索</Tag>
            </Space>
            <div
              style={{
                margin: '8px -8px 0 -8px',
                padding: location?.pathname.includes('/hrWorkBench') ? 0 : '8px',
                borderRadius: 8,
                boxSizing: 'border-box',
                overflowY: 'hidden',
                overflowX: 'hidden',
                backgroundColor: 'white',
                height: 'calc(100vh - 116px)',
              }}
            >
              <div>
                {children}
              </div>
            </div>
          </div>
        )}
      </ProLayout>
      <GlobalSearchModal routes={route.routes || []}/>
    </div>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
