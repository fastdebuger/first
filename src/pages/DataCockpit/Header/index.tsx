import React from 'react'
import './index.less'
import HeaderCenter from './HeaderCenter'
import HeaderBoth from './HeaderBoth'
import { history } from "umi"

/**
 * 顶部
 */
const Header = () => {
  return (
    <div id="top-header">
      <HeaderBoth className="header-left-decoration" />
      <HeaderCenter className="header-left-decoration" />
      <HeaderBoth className="header-right-decoration" reverse={true} />
      <div className="center-title" onClick={() => history.push("/")}>数字化管理平台</div>
    </div>
  )
}

export default Header