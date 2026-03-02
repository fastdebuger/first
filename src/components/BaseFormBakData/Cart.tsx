import {Card, Col, Drawer, Input, List, Row, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import {deepArr} from "@/utils/utils-array";
import {CloseOutlined} from "@ant-design/icons";

const {Meta} = Card;

const {Search} = Input;
/**
 * 抽屉
 * @param props
 * @constructor
 */
const Cart: React.FC<any> = (props: any) => {
  const {
    rowKey,
    delCartCallBack,
    handleCancel,
    drawerVisible,
    selectedRows,
  } = props;
  const [showRows, setShowRows] = useState<any[]>([]);
  const [searchRows, setSearchRows] = useState<any[]>([]);

  useEffect(
    () => {
      setShowRows(selectedRows);
    },
    [selectedRows],
  );

  useEffect(
    () => {
      setSearchRows(showRows);
    },
    [showRows],
  );
  // 移除购物车
  const removeCart = (item: any) => {
    const filterRows = searchRows.filter((row) => row[rowKey] !== item[rowKey]);
    const arr = deepArr(filterRows);
    setSearchRows(arr);
    delCartCallBack(item);
  };
  // 搜索后的购物车数据
  const searchCart = (value: string) => {
    const arr: any[] = [];
    showRows.filter((item: any) => {
      if (item.search_val.indexOf(value) > -1) {
        arr.push(item);
      }
    });
    setSearchRows(arr);
  };

  return (
    <>
      <Drawer
        title='已选物料'
        width={800}
        closable={false}
        onClose={handleCancel}
        visible={drawerVisible}
      >
        {showRows && showRows.length > 0 && (
          <Search
            allowClear
            placeholder='请输入物料信息'
            onSearch={(value) => searchCart(value)}
            enterButton
          />
        )}
        <List
          style={{marginTop: 10, marginBottom: 40}}
          bordered
          itemLayout='horizontal'
          dataSource={searchRows}
          renderItem={(item) => (
            <>

              <Row>
                <Col span={24}>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <>
                          {/*<div className={styles.cartBox}>*/}

                          {/*  <Descriptions size='middle' bordered>*/}
                          {/*    {tableColumns.map((col) =>*/}
                          {/*      <Descriptions.Item*/}
                          {/*        label={formatMessage({id: col.title})}>{item[col.dataIndex]}</Descriptions.Item>*/}
                          {/*    )}*/}
                          {/*  </Descriptions>*/}
                          {/*</div>*/}
                          <Card
                            title={<>
                              <b>
                                {item.prod_code}
                                <Tag style={{marginLeft: 30}} color="blue">规格：{item.spec || '/'}</Tag>
                              </b>
                            </>}
                            extra={<div
                              onClick={() => {
                                removeCart(item);
                              }}
                            >
                              <CloseOutlined/>
                            </div>}
                            hoverable
                            size='middle'
                            // cover={
                            //   <img
                            //     alt="example"
                            //     src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            //   />
                            // }
                            actions={
                              [
                                `${item.cls_code}-${item.cls_name}`,
                                item.unit,
                                item.material_type,
                                // <CloseOutlined key="delete"/>,
                              ]}
                          >
                            <Meta
                              title={item.prod_name}
                              description={item.prod_describe}
                            />
                            <Tag color="#4b6cb1" style={{marginTop: 10}}>
                              {item.pipe_code ? <span>管线号:{item.pipe_code}</span> : <></>}
                              {item.pipe_image_no ?
                                <span style={{marginLeft: 10}}>管道图号:{item.pipe_image_no}</span> : <></>}
                              {item.pipe_section_code ?
                                <span style={{marginLeft: 10}}>管段号:{item.pipe_section_code}</span> : <></>}
                            </Tag>
                          </Card>
                        </>
                      }
                    />
                  </List.Item>
                </Col>
              </Row>
            </>
          )}
        />
        {/*<div*/}
        {/*  style={{*/}
        {/*    position: 'absolute',*/}
        {/*    bottom: 0,*/}
        {/*    width: '100%',*/}
        {/*    borderTop: '1px solid #e8e8e8',*/}
        {/*    padding: '10px 16px',*/}
        {/*    textAlign: 'right',*/}
        {/*    left: 0,*/}
        {/*    background: '#fff',*/}
        {/*    borderRadius: '0 0 4px 4px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    style={{*/}
        {/*      marginRight: 8,*/}
        {/*    }}*/}
        {/*    onClick={handleCancel}*/}
        {/*  >*/}
        {/*    返回*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    onClick={() => {*/}
        {/*      handleSubmit(showRows);*/}
        {/*    }}*/}
        {/*    type='primary'*/}
        {/*  >*/}
        {/*    添加*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </Drawer>
    </>
  );
};
export default Cart;
