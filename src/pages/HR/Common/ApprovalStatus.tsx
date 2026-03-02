import React from 'react';
import { Tag } from 'antd';

const ApprovalStatus = (props: any) => {

  const { text } = props;

  if(text === null || text === undefined) {
    return (
      <Tag color={'orange'}>未审批</Tag>
    );
  }

  if(Number(text) === -1) {
    return (
      <Tag color={'orange'}>审批驳回</Tag>
    );
  }

  if(Number(text) === 0) {
    return (
      <Tag color={'orange'}>待审批</Tag>
    );
  }

  if(Number(text) === 1) {
    return (
      <Tag color={'blue'}>审批中</Tag>
    );
  }

  if(Number(text) === 2) {
    return (
      <Tag color={'green'}>审批完成</Tag>
    );
  }

  return (
    <Tag color={'orange'}>待审批</Tag>
  )
}

export default ApprovalStatus;
