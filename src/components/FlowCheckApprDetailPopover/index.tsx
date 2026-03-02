/**
 * @file 根据流程实例号查询该流程的审批人及审批状态组件
 * @author wyd11221
 * @date 2025-06-27
 * @lastModified 2025-06-27
 * @path applications/pc-master/src/func/FlowCheckApprDetailPopover/index.tsx
 */
import React, {useState} from 'react';
import {List, Popover, Skeleton, Tag,Space} from "antd";
import {useIntl} from "umi";
import {CloseOutlined} from "@ant-design/icons";
import {getAssigneeAndStatusByInstanceId} from "@/services/backConfig/flow";

interface FlowCheckApprDetailPopoverProps {
  instanceId:string
}

let FlowCheckApprDetailPopover:React.FC<FlowCheckApprDetailPopoverProps> = (props)=>{
  let { instanceId,children} = props
  let [isShowSkeleton, setIsShowSkeleton] = useState(true);
  let [isShowPopover, setIsShowPopover] = useState(false);
  let [dataSource, setDataSource] = useState([])
  let {formatMessage} = useIntl()

  let statusColors:{[key:string]:string} = {
    '0':'blue',
    '1':"green",
    '2':'',
    '3':"red",
    '4':"volcano",
    '5':"purple",
  }
  let statusName:{[key:string]:string} = {
    '0':formatMessage({id:'inApproval'}),
    '1':formatMessage({id:'approvalPass'}),
    '2':formatMessage({id:'approvalRevoke'}),
    '3':formatMessage({id:'approvalFailed'}),
    '4':formatMessage({id:'approvalBack'}),
    '5':formatMessage({id:'approvalHangup'}),
  }
  let fetch = async () => {
    if(!instanceId){
      setDataSource([])
      setIsShowSkeleton(false)
      return
    }
    let res = await getAssigneeAndStatusByInstanceId({
      instanceId
    })
    if (res && res.data&& res.data.rows) {
      setIsShowSkeleton(false)
      setDataSource(res.data.rows)
    } else {
      setDataSource([])
    }
  }

  let Content = () => {
    return (
      <div className={'height width'}>
        {isShowSkeleton && <Skeleton/>}
        {!isShowSkeleton && <List
          bordered={false}
          size={'small'}
          dataSource={dataSource}
          renderItem={(item: any) => (
            <List.Item>
              <Space>
                <div>
                  <h4 className={'margin-bottom-0'}>{item.userName || ''}</h4>
                </div>
                  <div>
                    <Tag color={statusColors[`${item.status}`]}>{statusName[`${item.status}`]}</Tag>
                  </div>
              </Space>
            </List.Item>
          )}
        />}
      </div>
    )
  }

  return (
    <Popover
      placement='top'
      title={<div className={'display-align-center-just-between'}>
        <span>{formatMessage({id: 'checkApprDetail'})}</span>
        <a onClick={()=>{setIsShowPopover(false)}}><CloseOutlined /></a>
      </div>}
      content={Content()}
      trigger="click"
      zIndex={999}
      open={isShowPopover}
    >
      <div style={{cursor:'pointer'}} onClick={()=>{
        setIsShowPopover(true);
        fetch();
      }}>
        {children}
      </div>
    </Popover>
  )
}

export default FlowCheckApprDetailPopover
