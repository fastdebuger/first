import React from 'react';
import { history } from 'umi';
import AliIcon from "@/components/MyIcon";
import { Empty } from 'antd';
import styles from "@/pages/WorkBench/index.css";

const QuickLinks = (props: any) => {

  const { routes } = props;
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');

  /**
   * 获取带描述 和 图标的菜单
   */
  const getQuickLinks = () => {
    const result: any[] = [];
    const getArr = (arr: any[]) => {
      arr.forEach((item: any) => {
        if (item && item.icon && item.desc && item.path && item.path.includes(`/${propKey}`)) {
          result.push(item);
        }
        if (item.routes) {
          getArr(item.routes);
        }
      })
    }
    getArr(routes)
    // 1. 获取用户权限列表
    try {
      const authWbsRight = localStorage.getItem('auth_wbs_right');
      if (authWbsRight && result.length > 0) {
        const userWbsRight = JSON.parse(authWbsRight);
        // 假设 userWbsRight 是一个对象数组，每个对象有 func_code 字段
        const funCodeList = userWbsRight.map((r: any) => r.func_code).filter((code: any) => typeof code === 'string');
        return result.filter((r: any) => funCodeList.includes(r.authority));
      }
    } catch (error) {
      return [];
    }
  }

  const result: any[] = getQuickLinks();

  return (
    <>
      <div className={styles.quickLinks}>
        {result.length > 0 ? (
          <div className={styles.quickLinksGrid}>
            {result.map((link, index) => (
              <div key={index} className={styles.quickLink} onClick={() => {
                history.push(link.path);
              }}>
                <div className={`${styles.quickLinkIcon} ${styles[link.color]}`}>
                  <AliIcon type={link.icon} />
                </div>
                <div className={styles.quickLinkContent}>
                  <div className={styles.quickLinkTitle}>{link.name}</div>
                  <div className={styles.quickLinkDesc}>{link.desc}</div>
                </div>
              </div>
            ))}
          </div>
          ) : (
          <Empty description={'暂无任何业务系统的权限'}/>
          )}
      </div>

    </>
  )
}

export default QuickLinks;
