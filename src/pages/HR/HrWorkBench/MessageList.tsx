import React, { useEffect } from 'react';
import styles from "./index.css";
import {Button, Col, Drawer, Empty, List, message, Modal, Row, Skeleton, Tag } from 'antd';
import {batchUpdateReadStatus, queryMessageDetail, queryMessageList} from "@/services/common/list";
import {showTS} from "@/utils/utils-date";
import type {ConnectState} from "@/models/connect";
import { connect } from 'umi';

const ModalContent = (props: any) => {

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const fetchList = async () => {
    setLoading(true);
    const res = await queryMessageList({
      sort: 'send_time_str',
      order: 'desc',
    })
    setLoading(false);
    setList(res.rows || [])
  }

  useEffect(() => {
    fetchList()
  }, []);

  return (
    <>
      <Row justify={'space-between'}>
        <Col></Col>
        <Col>
          {list.length > 0 && (
            <Button type={'link'} onClick={() => {
              Modal.confirm({
                title: '标记为已读',
                content: '是否全部标记为已读状态？',
                okText: '确定',
                cancelText: '我再想想',
                onOk: async () => {
                  const ids = list.filter((item: any) => Number(item.is_read) !== 1).map((item: any) => item.id).join(',');
                  const res = await batchUpdateReadStatus({
                    messageIds: ids,
                  })
                  if (res.errCode === 0) {
                    message.success("已标记为已读状态");
                    fetchList();
                  }
                }
              })
            }}>全部已读</Button>
          )}
        </Col>
      </Row>
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={item => (
          <List.Item
            actions={[<a onClick={async () => {
              const res = await queryMessageDetail({
                id: item.id,
              })
              if (res.result) {
                setSelectedItem(res.result);
                setOpen(true);
              }
            }}>查看内容</a>]}
          >
            <Skeleton avatar title={false} loading={loading} active>
              <List.Item.Meta
                // avatar={<Avatar src={item.picture.large} />}
                title={<span><span className={`${styles.announcementTag} ${styles['tagNotice']}`}>
                      公告
                    </span><strong style={{marginLeft: 4, marginRight: 4}}>{item.title}</strong>{Number(item.is_read) === 1 ? <Tag color={'blue'}>已读</Tag> : <Tag color={'orange'}>未读</Tag> }</span>}
                description={(
                  <div>
                    {item.sender_name} ｜ {showTS(Number(item.send_time || 0), 'YYYY-MM-DD HH:mm')}
                  </div>
                )}
              />
            </Skeleton>
          </List.Item>
        )}
      />
      {open && selectedItem && (
        <Drawer
          width={'50%'}
          title={'公告详情'}
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
        >
          <h3>{selectedItem.title}</h3>
          <div>
            <div dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
          </div>
        </Drawer>
      )}
    </>
  )
}

const MessageList = (props: any) => {

  const { showModal, dispatch } = props;

  const userCode = localStorage.getItem('auth-default-userCode');

  const [visible, setVisible] = React.useState(false);
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);

  const fetchList = async () => {
    setLoading(true);
    const res = await queryMessageList({
      sort: 'send_time_str',
      order: 'desc',
      offset: 1,
      limit: 7
    })
    setLoading(false);
    setList(res.rows || [])
  }

  useEffect(() => {
    if (showModal) {
      setVisible(true);
    }
  }, [showModal])

  useEffect(() => {
    fetchList()
  }, [userCode]);

  // const announcements = [
  //   { tag: '公告', tagType: 'tagNotice', text: '关于2024年党员缴纳党费的通知' },
  //   { tag: '活动', tagType: 'tagActivity', text: '夏季科技竞赛的活动进行...' },
  //   { tag: '演示', tagType: 'tagUpdate', text: '系统V2.0功能更新要...' },
  //   { tag: '公告', tagType: 'tagNotice', text: '一季度招聘目标发布' },
  //   { tag: '活动', tagType: 'tagActivity', text: '恒务新职员月月有奖活动' },
  //   { tag: '公告', tagType: 'tagNotice', text: '关于部门调整结构优化通知' },
  //   { tag: '公告', tagType: 'tagNotice', text: '最新市高某手册说明' },
  // ]

  return (
    <div className={styles.announcementsCard}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>消息公告</span>
        <span className={styles.viewMore} onClick={() => setVisible(true)}>查看更多</span>
      </div>
      <Skeleton loading={loading}>
        {list.length > 0 ? list.map((item, index) => (
          <div style={{cursor: 'pointer'}}
                onClick={async () => {
                  const res = await queryMessageDetail({
                    id: item.id,
                  })
                  if (res.result) {
                    setSelectedItem(res.result);
                    setDetailVisible(true);
                  }
                }}
              key={index} className={styles.announcementItem}>
                    <span className={`${styles.announcementTag} ${styles['tagNotice']}`}>
                      {/*{item.tag}*/}公告
                    </span>
            <span className={styles.announcementText}>{item.title}</span>
          </div>
        )) : (
          <Empty/>
        )}
      </Skeleton>

      {/*{announcements.map((item, index) => (
        <div style={{cursor: 'pointer'}} onClick={() => {
          setSelectedItem(item);
          setDetailVisible(true);
        }} key={index} className={styles.announcementItem}>
                    <span className={`${styles.announcementTag} ${styles[item.tagType]}`}>
                      {item.tag}
                    </span>
          <span className={styles.announcementText}>{item.text}</span>
        </div>
      ))}*/}
      {visible && (
        <Modal
          width={'70%'}
          title={'所有公告'}
          visible={visible}
          onCancel={() => {
            setVisible(false)
            dispatch({
              type: 'common/showMessageModal',
              payload: {
                isShow: false
              }
            })
          }}
          footer={null}
        >
          <ModalContent/>
        </Modal>
      )}
      {detailVisible && selectedItem && (
        <Modal
          width={'70%'}
          title={'公告详情'}
          onCancel={() => setDetailVisible(false)}
          visible={detailVisible}
          bodyStyle={{
            overflow: 'scroll'
          }}
          footer={null}
        >
          <div>
            <strong style={{fontSize: 18, marginRight: 4}}>{selectedItem.title}</strong>
            {Number(selectedItem.is_read) === 1 ? <Tag color={'blue'}>已读</Tag> : <Tag color={'orange'}>未读</Tag> }
          </div>
          <div>
            <div dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default connect(({ common }: ConnectState) => ({
  showModal: common.showModal,
}))(MessageList);
