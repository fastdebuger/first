import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import type { ConnectProps } from 'umi';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import { PROP_KEY, WORK_BENCH } from '@/common/const';
import { getRebuildObsCode } from '@/services/base/obs/list';

type SecurityLayoutProps = {
  loading?: boolean;
  currentUser?: CurrentUser;
} & ConnectProps;

type SecurityLayoutState = {
  isReady: boolean;
};

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const cToken = localStorage.getItem('x-auth-token');
    if (cToken) {
      getRebuildObsCode({}).then(r => {
        localStorage.setItem('getRebuildObsCode', r.result ? r.result + '.00.01' : '')
      })
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // You can replace it with your own login authentication rules (such as judging whether the token exists)
    const cToken = localStorage.getItem('x-auth-token');
    const queryString = stringify({
      redirect: window.location.href,
    });
    if ((!cToken && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!cToken && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    if (cToken && (window.location.pathname === '/' || window.location.pathname === '/main')) {
      return <Redirect to={`/workBench?version=${WORK_BENCH.VERSION}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
