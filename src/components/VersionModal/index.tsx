import React, {useEffect, useRef, useState} from 'react';
import {Badge, Radio, Button, Col, Drawer, Menu, message, Modal, Popover, Row, Space, Skeleton, Tag, List, Alert} from "antd";
import {connect} from "umi";
import lodash from 'lodash';
import {ConnectProps} from "@@/plugin-dva/connect";
import {DeleteOutlined} from "@ant-design/icons";
import BaseFormSearchTable from "@/components/BaseFormSearchTable";
import {
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const ShowMenu: any = Menu;

type PayloadParams = {
  sort: string;
  order: string;
  filter?: string;
}

type PayloadType = {
  type: string;
  payload: PayloadParams;
}

type PayloadColumnsType = PayloadType & {
  columns: any[];
}

interface IVersionModalProps extends Pick<ConnectProps, 'dispatch'>{
  visible: boolean;
  onCancel: () => void;
  selectedRecord: any;
  header: PayloadType,
  body: PayloadColumnsType,
  result: PayloadColumnsType,
}

const ShowCompareResultModal = (props: any) => {
  const { result, visible, onCancel, selectedRows} = props;
  const childRef: any = useRef();
  const [radioValue, setRadioValue] = useState('0');
  // 定义过滤的条件
  const operator = {
    in: [],
    '=': [],
    '>': [],
    '<': [],
    '><': [],
    noFilters: ['version_code1', 'version_code2', 'data_status'],
  };

  return (
    <Drawer
      title='比对结果'
      width={'60%'}
      placement="right"
      bodyStyle={{
        padding: '16px 16px 0 16px'
      }}
      onClose={onCancel}
      visible={visible}
      closable={false}
      extra={
        <Space>
          <Button onClick={onCancel} style={{borderRadius:6}}>关闭</Button>
        </Space>
      }
    >
      <BaseFormSearchTable
        cRef={childRef}
        rowKey="form_no"
        moduleCaption={`${selectedRows.join('-')}比对结果`}
        key={radioValue}
        tableTitle={() => {
          return (
            <Space>
              <Radio.Group value={radioValue} buttonStyle="solid" onChange={(e) => {
                setRadioValue(e.target.value);
              }}>
                <Radio.Button value="0">全部</Radio.Button>
                <Radio.Button value="1">不同项</Radio.Button>
                <Radio.Button value="2">相同项</Radio.Button>
              </Radio.Group>
              <Alert type={"info"} message={`版本1：${selectedRows[0]}、版本2：${selectedRows[1]}`}/>
            </Space>
          )
        }}
        noSettingIcon={false}
        tableSortOrder={result.payload}
        formColumns={[]}
        tableColumns={result.columns}
        type={result.type}
        exportType={result.type}
        tableDefaultField={{
          version_code1: selectedRows[0],
          version_code2: selectedRows[1],
          data_status: radioValue,
        }}
        toolBarRender={() => {
          return [
            <Button
              key={7}
              size="middle"
              type="primary"
              onClick={() => {
                // @ts-ignore
                childRef.current.exportFile(1, result.columns);
              }}
            >
              导出
            </Button>
          ]
        }}
        dateCols={[]}
        operator={operator}
        identityCols={[]}
      />
    </Drawer>
  )
}

/**
 * 版本比对
 * @param props
 * @constructor
 */
const VersionModal = (props: IVersionModalProps) => {
  const {header, body, result, visible, onCancel, selectedRecord, dispatch } = props;
  const childRef: any = useRef();

  const [versionList, setVersionList] = useState<any[]>([]);
  const [selectedHeader, setSelectedHeader] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (dispatch) {
      setLoading(true);
      dispatch({
        type: header.type,
        payload: header.payload,
        callback: (res: any) => {
          setVersionList(res.rows || []);
          setLoading(false);
          if (res.rows.length > 0) {
            setSelectedHeader(res.rows[0]);
            setSelectedKeys([res.rows[0].version_code || ''])
          }
        }
      })
    }
  }, []);


  /**
   * 点击单个菜单方法
   * @param e
   */
  const onClickMenu = (e: any) => {
    console.log('click ', e);
    const findObj = versionList.find(v => v.version_code === e.key);
    if (findObj) {
      setSelectedHeader(findObj);
      setSelectedKeys(findObj.version_code || '')
    }
  };

  // 定义过滤的条件
  const operator = {
    in: [],
    '=': ['version_code'],
    '>': [],
    '<': [],
    '><': [],
    noFilters: [],
  };

  // 定义按钮
  const toolBarRender = () => {
    return [
      <Button
        key={7}
        size="middle"
        type="primary"
        style={{borderRadius:6}}
        onClick={() => {
          const copySelectedRows = lodash.cloneDeep(selectedRows);
          if (selectedHeader) {
            if(copySelectedRows.includes(selectedHeader.version_code)) {
              message.warn('比对结果中已经存在此版本，请选择其它版本加入比对');
              return;
            }
            if (copySelectedRows.length === 2) {
              Modal.info({
                title: '提示',
                content: '每次只能进行两个版本的比对',
                okText: '知道了'
              })
              return;
            }
            message.success("加入成功，可点击右上角 版本比对")
            copySelectedRows.push(selectedHeader.version_code);
            setSelectedRows(copySelectedRows);
          }
        }}
      >
        加入对比
      </Button>,
      <Button
        key={7}
        style={{borderRadius:6}}
        size="middle"
        type="primary"
        onClick={() => {
          // @ts-ignore
          childRef.current.exportFile(1, body.columns);
        }}
      >
        导出
      </Button>,
    ];
  };

  const showCompareStatus = (versionCode: string, text: string = '比对中') => {
    if (selectedRows.length < 1) {
      return null;
    }
    if (selectedRows.includes(versionCode)) {
      return (
        <Tag style={{marginLeft: 12}} color="#2db7f5">
          {text}
        </Tag>
      )
    }
    return null;
  }

  const showContent = () => {
    if (selectedRows.length < 1) {
      return (
        <span style={{color: 'orange'}}>
          选择要比对的两个版本
        </span>
      )
    }
    return (
      <>
        <List
          itemLayout="horizontal"
          dataSource={selectedRows}
          renderItem={item => (
            <List.Item
              actions={[<DeleteOutlined style={{color: '#f40'}} onClick={() => {
                const filterRows = selectedRows.filter(r => r !== item);
                setSelectedRows(filterRows);
              }} />]}
            >
              <div>{item}版</div>
            </List.Item>
          )}
        />
        <Button
          type={'primary'}
          style={{
            marginTop: 8
          }}
          onClick={() => {
          if (selectedRows.length !== 2) {
            message.warn("需要选择两个版本进行对比");
            return;
          }
          setModalVisible(true);
        }}>比对</Button>
      </>
    )
  }

  const showTitle = () => {
    return (
      <Space>
        <strong>
          {selectedRecord.unit_name} 修改记录
        </strong>
        <Tag icon={<ExclamationCircleOutlined />} color="warning" style={{marginLeft:16}}>
          自2024-05-11后做的单据才会产生版本记录、新增、修改、导入都会增加新的版本
        </Tag>
      </Space>
    )
  }

  return (
    <>
      <Drawer
        title={showTitle()}
        width={'90%'}
        placement="right"
        bodyStyle={{
          padding: '16px 16px 0 16px'
        }}
        onClose={onCancel}
        visible={visible}
        closable={false}
        extra={
          <Space >
            <Popover placement="topLeft" title={'对比版本'} content={showContent()} trigger="hover">
              <Badge count={selectedRows.length}>
                <Button style={{borderRadius:6}} onClick={() => {
                  if (selectedRows.length !== 2) {
                    message.warn("需要选择两个版本进行对比");
                    return;
                  }
                }}>版本比对</Button>
              </Badge>
            </Popover>
            <Button onClick={onCancel} style={{borderRadius:6}}>关闭</Button>
          </Space>
        }
      >
        <Row gutter={16}>
          <Col span={5}>
            <div>
              <Skeleton loading={loading} active>
                {versionList.length > 0 ? (
                  <ShowMenu
                    selectedKeys={selectedKeys}
                    style={{
                      height: 'calc(100vh - 91px)',
                      overflowY: 'auto',
                      overflowX:'hidden'
                    }}
                    mode="inline"
                    onClick={onClickMenu}
                  >
                    {versionList.map(v => {
                      return (
                        <ShowMenu.Item key={v.version_code}>
                          <span style={{fontWeight: 'bolder', color: '#0063e8'}}>版本</span>
                          <span style={{marginLeft: 12}}>{v.version_code}</span>
                          {showCompareStatus(v.version_code, 'VS')}
                        </ShowMenu.Item>
                      )
                    })}
                  </ShowMenu>
                ) : (
                  <div style={{padding: 16, color: 'orange'}}>
                    未查询到任何记录
                  </div>
                )}
              </Skeleton>
            </div>
          </Col>
          <Col span={19}>
            {selectedHeader ? (
              <div style={{padding: 16,
                overflowY: 'auto',
                overflowX:"hidden",
                height: 'calc(100vh - 91px)',
              }}>
                <BaseFormSearchTable
                  cRef={childRef}
                  moduleCaption={`${selectedHeader.version_code}版`}
                  tableTitle={() => {
                    return (
                      <h3>
                        {selectedHeader.version_code}版本
                        {showCompareStatus(selectedHeader.version_code)}
                      </h3>
                    )
                  }}
                  scroll={{y: 'calc(100vh - 265px)'}}
                  rowKey="RowNumber"
                  noSettingIcon={false}
                  tableSortOrder={body.payload}
                  formColumns={[]}
                  tableColumns={body.columns}
                  type={body.type}
                  exportType={body.type}
                  tableDefaultField={{
                    version_code: selectedHeader.version_code
                  }}
                  toolBarRender={toolBarRender}
                  dateCols={[]}
                  operator={operator}
                  identityCols={[]}
                />
              </div>
            ) : (
              <span> </span>
            )}
          </Col>
        </Row>
      </Drawer>
      {modalVisible && (
        <ShowCompareResultModal
          visible={modalVisible}
          result={result}
          onCancel={() => setModalVisible(false)}
          selectedRows={selectedRows}
          dispatch={dispatch}
        />
      )}
    </>
  )
}

export default connect()(VersionModal);
