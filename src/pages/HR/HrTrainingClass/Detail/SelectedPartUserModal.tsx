import React, { useEffect } from 'react';
import { Button, Col, message, Popconfirm, Row, Table } from 'antd';
import UserFetchModal from "@/components/CommonList/UserFetchModal";
import {configureStudent, queryClassStudent} from "@/services/hr/hrTrainingClass";
import {ErrorCode} from "@/common/const";
import {showTS} from "@/utils/utils-date";


const SelectedPartUserModal = (props: any) => {

  const { selectedRecord } = props;
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [commitLoading, setCommitLoading] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);

  const fetchList = async () => {
    setLoading(true);
    const res = await queryClassStudent({
      sort: 'user_code',
      order: 'desc',
      id: selectedRecord.id,
    })
    setLoading(false);
    setList(res.rows || []);
  }

  useEffect(() => {
    fetchList();
  }, []);

  const columns = [
    {
      title: "用户编码",
      subTitle: "用户编码",
      dataIndex: "user_code",
      width: 200,
      align: "center",
    },
    {
      title: "用户名称",
      subTitle: "用户名称",
      dataIndex: "user_name",
      width: 200,
      align: "center",
    },
    {
      title: "操作",
      subTitle: "操作",
      dataIndex: "operate",
      width: 100,
      align: "center",
      render: (h: any, record: any) => {
        return (
          <Popconfirm title="确定删除?" onConfirm={async () => {
            setLoading(true);
            const filterArr = list.filter(item => item.user_code !== record.user_code);
            const res = await configureStudent({
              userCodes: JSON.stringify(filterArr.map((u) => u.user_code)),
              id: selectedRecord.id,
            })
            setLoading(false);
            if (res.errCode === ErrorCode.ErrOk) {
              message.success('删除成功');
              setVisible(false);
              fetchList();
            }
          }}>
            <a style={{color: '#f40'}}>删除</a>
          </Popconfirm>
        )
      }
    },
  ]

  return (
    <>
      <Row justify="space-between">
        <Col></Col>
        <Col>
          <Button loading={commitLoading} type="primary" onClick={() => {
            setVisible(true);
          }}>
            新增
          </Button>
        </Col>
      </Row>
      <Table
        rowKey={'id'}
        loading={loading}
        style={{marginTop: 8}}
        size={'small'}
        columns={columns}
        dataSource={list}
      />
      <UserFetchModal
        visible={visible}
        onCancel={() => setVisible(false)}
        commitLoading={commitLoading}
        onSelect={async (users) => {
          setCommitLoading(true);
          if(list.length > 0) {
            list.forEach(item => {
              users.push(item)
            })
          }
          const res = await configureStudent({
            userCodes: JSON.stringify(users.map((u) => u.user_code)),
            id: selectedRecord.id,
          })
          setCommitLoading(false);
          if (res.errCode === ErrorCode.ErrOk) {
            message.success('新增成功');
            setVisible(false);
            fetchList();
          }
        }}
      />
    </>
  )
}

export default SelectedPartUserModal;
