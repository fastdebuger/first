import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Drawer, Menu, Empty, Row, Skeleton, Space, Tag} from "antd";
import {connect} from "umi";
import BaseFormSearchTable from "@/components/BaseFormSearchTable";
import {BasicTableColumns} from "qcx4-components";
import {configColumns} from "@/pages/Procurement/JiaPurchasePlan/columns";

const versionDrawer = (props: any) => {
  const {visible, onCancel, selectedRecord, dispatch} = props;
  const childRef: any = useRef();
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'
  const [versionList, setVersionList] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (dispatch) {
      setLoading(true);
      dispatch({
        type: 'jiapurchaseplan/queryPipeVersionCodeLst',
        payload: {
          sort: 'version_code',
          order: 'desc',
          unit_code: selectedRecord.unit_code,
          pipe_code: selectedRecord.pipe_code,
        },
        callback: (res: any) => {
          setVersionList(res.rows || []);
          setLoading(false);
          if (res.rows.length > 0) {
            setSelectedKeys(res.rows[0].version_code || '')
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
    setSelectedKeys(e.key)
  };

  // 定义过滤的条件
  const operator = {
    in: [],
    '=': ['version_code'],
    '>': [],
    '<': [],
    '><': [],
    noFilters: ['unit_code', 'pipe_code'],
  };

  // 定义按钮
  const toolBarRender = () => {
    return [
      <Button
        key={7}
        style={{borderRadius: 6}}
        size="middle"
        type="primary"
        onClick={() => {
          // @ts-ignore
          childRef.current.exportFile();
        }}
      >
        导出
      </Button>,
    ];
  };

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'prod_code',
        'form_no_show',
        'form_date',
        'prod_name',
        'cls_name',

        'demand_time',
        'arrival_place',
        'prod_describe',
        'auxiliary1_unit',
        'auxiliary1_num',
        'auxiliary2_unit',
        'auxiliary2_num',
        'prod_memo',
        isShowNetAndMargin ? 'plan_net_num' : '',
        isShowNetAndMargin ? 'plan_margin_num' : '',
        'plan_num',
      ]).needToFixed([
      {value: 'plan_num', fixed: 'right'},
    ])
      .setTableColumnToDatePicker([
        {value: 'demand_time', valueType: 'dateTs'},
        {value: 'form_date', valueType: 'dateTs'}
      ])
    return cols.getNeedColumns();
  };

  return (
    <>
      <Drawer
        title={`管线号 ${selectedRecord.pipe_code} 版本`}
        width={'80%'}
        placement="right"
        bodyStyle={{
          padding: '16px 16px 0 16px'
        }}
        onClose={onCancel}
        visible={visible}
      >
        <Row gutter={16}>
          <Col span={6}>
            <div>
              <Skeleton loading={loading} active>
                {versionList.length > 0 ? (
                  <Menu
                    selectedKeys={selectedKeys}
                    style={{
                      height: 'calc(100vh - 91px)',
                      overflowY: 'auto',
                      overflowX: 'hidden'
                    }}
                    mode="inline"
                    onClick={onClickMenu}
                  >
                    {versionList.map(v => {
                      return (
                        <Menu.Item key={v.version_code}>
                          <span style={{fontWeight: 'bolder', color: '#0063e8'}}>版本</span>
                          <span style={{marginLeft: 12}}>{v.version_code}</span>
                        </Menu.Item>
                      )
                    })}
                  </Menu>
                ) : (
                  <Empty/>
                )}
              </Skeleton>
            </div>
          </Col>
          <Col span={18}>
            {selectedKeys &&
            <BaseFormSearchTable
              cRef={childRef}
              moduleCaption={`${selectedKeys}版本`}
              scroll={{y: 'calc(100vh - 265px)'}}
              rowKey="RowNumber"
              noSettingIcon={false}
              tableSortOrder={{
                sort: 'prod_key', order: 'desc'
              }}
              tableTitle={() => {
                return (
                  <Space style={{paddingTop: 8}}>
                    <Tag color={'blue'}>{selectedRecord.dev_name}</Tag>
                    <Tag color={'geekblue'}>{selectedRecord.unit_project_name}</Tag>
                    <Tag color={'purple'}>{selectedRecord.unit_name}</Tag>
                  </Space>
                )
              }}
              formColumns={[]}
              tableColumns={getTableColumns()}
              type={'jiapurchaseplan/queryPurchasePlanHistory'}
              exportType={'jiapurchaseplan/queryPurchasePlanHistory'}
              tableDefaultField={{
                version_code: selectedKeys,
                unit_code: selectedRecord.unit_code,
                pipe_code: selectedRecord.pipe_code,
              }}
              toolBarRender={toolBarRender}
              dateCols={[]}
              operator={operator}
              identityCols={[]}
            />
            }
          </Col>
        </Row>
      </Drawer>
    </>
  )
}

export default connect()(versionDrawer);
