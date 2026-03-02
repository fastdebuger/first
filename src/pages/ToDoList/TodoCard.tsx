import React from 'react';
import { showTS } from "@/utils/utils-date";
import { Card, Button, Avatar, Tag, Space, Typography, Row, Col, Badge } from "antd"
import { updateUserToDoStatus } from "@/services/approve";
const { Text } = Typography;
import { baseModuleList } from './columns';

/**
 * 待办列表卡片
 * @param param 
 * @returns 
 */
const TodoCard = ({ item }: any) => {
  const renderFuncPath = (code: string) => {
    const tar = baseModuleList.find(item => item.moduleCode === code)
    return tar ? window.location.origin + tar.modulePath : '/'
  }

  const getSysTag = (item: any) => {
    if (item.systemKey === 'WMMaterial') {
      return (
        <Badge color="green" text={<span style={{ color: 'green' }}>物资系统</span>} />
      )
    }
    return ''
  }

  return (
    <Card style={{ marginBottom: 16 }} hoverable>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          {/* 标题和标签 */}
          <div style={{ marginBottom: 12 }}>
            <Row justify={"space-between"}>
              <Col>
                <Space>
                  <Text strong style={{ fontSize: 16 }}>
                    {item.no}. {item.content}
                  </Text>
                  <Tag color="orange">待处理</Tag>
                </Space>
              </Col>
              <Col>
                {getSysTag(item)}
              </Col>
            </Row>
          </div>

          {/* 发起人信息 */}
          {item.initiatorName && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <Avatar size="small" style={{ backgroundColor: "#1890ff", marginRight: 8 }}>
                {item.initiatorName ? item.initiatorName.substr(0, 1) : ''}
              </Avatar>
              <Text type="secondary">发起人：{item.initiatorName || ''}</Text>
            </div>
          )}
          <Row justify={"space-between"}>
            <Col>
              <Text type="secondary">
                {showTS(Number(item.create_time), 'YYYY-MM-DD HH:mm:ss')}
              </Text>
            </Col>
            <Col>
              <Space>
                <Button ghost type={'primary'} onClick={async () => {
                  await updateUserToDoStatus({
                    id: item.id,
                    is_looked: '1'
                  });
                  window.location.href = `${renderFuncPath(item.FuncCode)}?type=todo`
                }}>去处理</Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  )
}

export default TodoCard;
