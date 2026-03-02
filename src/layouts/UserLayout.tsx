import type { MenuDataItem } from '@ant-design/pro-layout';
import type { ConnectProps } from 'umi';
import { connect, Link } from 'umi';
import React, { useState } from 'react';
import type { ConnectState } from '@/models/connect';
import './UserLayout.less';

export type UserLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
} & Partial<ConnectProps>;

const UserLayout: React.FC<UserLayoutProps> = ({children}) => {
 

  // const copyright = (
  //     <a style={{ fontSize: 13 }} href="https://beian.miit.gov.cn/" target="view_window">
  //       鲁ICP备18057782号-1
  //     </a>
  // );

  return (
    <div>
      {children}
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
