import React from 'react';
import { Tag } from 'antd';

const PublishStatus = (props: any) => {

  const { text } = props;

  if(!text){
    return (
      <Tag color={'orange'}>未发布</Tag>
    );
  }

  if(Number(text) === 0) {
    return (
      <Tag color={'orange'}>未发布</Tag>
    );
  }

  if(Number(text) === 1) {
    return (
      <Tag color={'blue'}>已发布</Tag>
    );
  }

  return (
    <Tag color={'orange'}>未发布</Tag>
  )
}

export default PublishStatus;
