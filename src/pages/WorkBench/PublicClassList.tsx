import React, { useEffect } from 'react';
import styles from "./index.css";
import {Card, Col, Empty, Modal, Row, Skeleton, Typography } from 'antd';
import type {ConnectState} from "@/models/connect";
import { connect } from 'umi';
import {queryHrCourse} from "@/services/hr/hrCourse";
import ShowPublicClassModal from "@/pages/WorkBench/ShowPublicClassModal";
const { Paragraph } = Typography;
const { Meta } = Card;
const ModalContent = (props: any) => {

  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);

  const fetchList = async () => {
    setLoading(true);
    const res = await queryHrCourse({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'is_public', Val: '1', Operator: '='}
      ])
    })
    setLoading(false);
    setList(res.rows || [])
  }

  useEffect(() => {
    fetchList()
  }, []);

  return (
    <Skeleton loading={loading}>
      <Row gutter={12}>
        {list.map((item: any, index: number) => {
          return (
            <Col span={4} key={index}>
              <Card
                style={{cursor: 'pointer'}}
                cover={
                  <img
                    style={{height: 100}}
                    alt="公开课"
                    src={item.course_cover}
                  />
                }
              >
                <Meta
                  title={item.course_name}
                  description={
                  <Paragraph ellipsis={{ rows: 2, expandable: true}} style={{fontSize: 12}}>
                    {item.course_intro}
                  </Paragraph>}
                />
              </Card>
            </Col>
          )
        })}
      </Row>
    </Skeleton>
  )
}

const PublicClassList = (props: any) => {

  const { showModal, dispatch } = props;

  const userCode = localStorage.getItem('auth-default-userCode');

  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<any[]>([]);
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState(null);

  const fetchList = async () => {
    setLoading(true);
    const res = await queryHrCourse({
      sort: 'id',
      order: 'asc',
      offset: 1,
      limit: 2,
      filter: JSON.stringify([
        {Key: 'is_public', Val: '1', Operator: '='}
      ])
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

  return (
    <div className={styles.announcementsCard} style={{marginBottom: '16px'  }}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>公开课</span>
        <span className={styles.viewMore} onClick={() => setVisible(true)}>查看更多</span>
      </div>
      <Skeleton loading={loading}>
        {list.length > 0 ? list.map((item, index) => (
          <div
            onClick={() => {
              setSelectedCourse(item);
              setDetailVisible(true)
            }}
            key={item.course_name}
            className="flex cursor-pointer gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
          >
            <img
              src={item.course_cover || "/placeholder.svg"}
              alt={item.course_name}
              className="h-14 w-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="mb-1 text-sm font-medium text-gray-800 line-clamp-1">
                {item.course_name}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2">
                {item.course_intro}
              </p>
            </div>
          </div>
        )) : (
          <Empty/>
        )}
      </Skeleton>

      {detailVisible && selectedCourse && (
        <ShowPublicClassModal
          visible={detailVisible}
          onCancel={() => setDetailVisible(false)}
          selectedCourse={selectedCourse}
        />
      )}

      {visible && (
        <Modal
          width={'96%'}
          title={'所有公开课'}
          visible={visible}
          onCancel={() => {
            setVisible(false)
          }}
          footer={null}
        >
          <ModalContent/>
        </Modal>
      )}
    </div>
  )
}

export default connect(({ common }: ConnectState) => ({
  showModal: common.showModal,
}))(PublicClassList);
