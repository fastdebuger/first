import React, { forwardRef } from "react";
import { connect } from "umi";
import BasicInfoWrapper from "./BasicInfoWrapper";

/**
 * 中间层组件
 *   - 公司组件库 BasicTaskForm 会通过 cRef 劫持 ref
 *   - connect() 默认不转发 ref
 *   - 必须用 forwardRef + connect(..., { forwardRef: true })
 *   - 必须把 connect 放在最外层，且只出现一次！
 *   - 内层组件（BasicInfoWrapper）必须是纯 forwardRef 组件，不加 connect
 *   - dispatch 通过 props 透传，不依赖内层 connect
 *
 *    必须加这一层“中间层”转发组件，目的就是：
 *   → 绕过 BasicTaskForm 的 cRef 劫持问题
 *   → 绕过 connect() 的 吞噬 ref问题
 *   → 同时保留 dispatch 的注入能力
 *
 */

const BasicInfo = forwardRef((props: any, ref: any) => {
  // 把 ref 和所有 props（包括 dispatch）原样传给最内层的表单组件
  return <BasicInfoWrapper ref={ref} {...props} />;
});

// 给 React DevTools 一个名字，方便调试
BasicInfo.displayName = "BasicInfo";

/**
 * 关键配置：{ forwardRef: true }
 *
 * 这是 umi/dva 的 connect 高阶组件提供的选项
 * 默认情况下 connect() 会“吃掉” ref，导致子组件收不到
 * 加上 forwardRef: true 后，connect 会自动把 ref 转发给 forwardRef 组件
 *
 */
/**
 * connect
 * 第一个参数 null：mapStateToProps，表示不需要从Redux store中获取状态映射到组件props。如果组件不需要使用store中的数据，可以传null。
   第二个参数 null：mapDispatchToProps，表示不需要将dispatch函数映射到组件props。如果组件不需要触发Redux actions，可以传null。
   第三个参数 null：mergeProps，表示使用默认的合并逻辑（Object.assign）来合并stateProps、dispatchProps和ownProps。如果不需要自定义合并逻辑，可以传null。
   第四个参数 { forwardRef: true }：options，这是一个特殊配置选项。forwardRef: true是React-Redux 7.0+引入的，用于允许组件接收ref。不设置这个选项的话，connect包装后的组件将无法接收ref，导致外部无法通过ref访问组件实例。
 */
export default connect(null, null, null, { forwardRef: true })(BasicInfo);