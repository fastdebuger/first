import React from 'react';
import { Tag } from 'antd';

const PublicStatus = (props: any) => {

  const { text } = props;

  if(!text){
    return (
      <Tag color={'orange'}>私密</Tag>
    );
  }

  if(Number(text) === 0) {
    return (
      <Tag color={'orange'}>私密</Tag>
    );
  }

  if(Number(text) === 1) {
    return (
      <Tag color={'blue'}>公开</Tag>
    );
  }

  return (
    <Tag color={'orange'}>私密</Tag>
  )
}

export default PublicStatus;
