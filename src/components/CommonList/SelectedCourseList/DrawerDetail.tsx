import {queryWorkTypeTree} from "@/services/hr/hrCourse";
import {buildTree} from "@/utils/utils";
import {deepArr} from "@/utils/utils-array";
import {configColumns} from "@/pages/HR/HrCourse/columns";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import HrCourseDetail from "@/pages/HR/HrCourse/Detail";
import HrCourseAdd from "@/pages/HR/HrCourse/Add";
import React, {useEffect, useRef, useState } from 'react';
import {Button, Drawer, Col, Empty, Input, Modal, Row, Space, Tree} from "antd";
import { BasicTableColumns } from 'yayang-ui';
import { DownOutlined } from '@ant-design/icons';

const DrawerDetail = (props: any) => {
  const { onChange } = props;

  const actionRef: any = useRef();
  const propKey = localStorage.getItem("auth-default-wbs-prop-key")
  const wbsCode = localStorage.getItem('auth-default-wbsCode');

  const [addVisible, setAddVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['all']);
  const [selectedTreeInfo, setSelectedTreeInfo] = useState<any>(null);

  const [treeData, setTreeData] = useState<any[]>([
    {
      title: '全部',
      key: 'all',
      children: []
    }
  ]);

  const fetchTree = async () => {
    const res = await queryWorkTypeTree({
      sort: 'id',
      order: 'asc'
    })
    const treeList = buildTree(res.result || []);
    const deepCloneTreeDate = deepArr(treeData);
    deepCloneTreeDate[0].children = treeList;
    setTreeData(deepCloneTreeDate);
  }

  useEffect(() => {
    fetchTree();
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      // "wbs_code",
      // "prop_key",
      "course_name",
      "course_cover",
      "course_intro",
      // "tree_id",
      "tree_name",
      "course_tag_str",
      // "course_status",
      "is_public",
      "create_ts",
      // "create_tz",
      // "create_user_code",
      "create_user_name",
      // "modify_ts",
      // "modify_tz",
      // "modify_user_code",
      // "modify_user_name",
      {
        title: "compinfo.operate",
        subTitle: "操作",
        dataIndex: "operate",
        width: 160,
        align: "center",
        render: (text, record) => {
          return (
            <>
              <a onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}>详情</a>
            </>
          )
        }
      },
    ])
      .setTableColumnToDatePicker([
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ])
      .needToFixed([
        {value: 'operate', fixed: 'right'},
      ])
      .needToExport([
        // "id",
        "wbs_code",
        "prop_key",
        "course_name",
        "course_content",
        "course_cover",
        "course_intro",
        "tree_name",
        "course_tag_str",
        // "course_status",
        "is_public_str",
        "create_ts",
        // "create_tz",
        // "create_user_code",
        "create_user_name",
        "modify_ts",
        // "modify_tz",
        // "modify_user_code",
        "modify_user_name",
      ])
    return cols.getNeedColumns();
  }

  const showWarnModal = () => {
    Modal.warning({
      title: '课程选择',
      content: '新增需要指定具体的课程分类，请选择左侧要新增的课程分类，比如：社会保险',
      okText: '知道了',
    })
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space>
        <Button
          type="primary"
          onClick={() => {
            const key = selectedKeys[0];
            if(key === 'all') {
              showWarnModal();
              return;
            }
            if (!selectedTreeInfo) {
              showWarnModal();
              return;
            }
            if (selectedTreeInfo.children.length != 0) {
              showWarnModal();
              return;
            }
            setAddVisible(true);
          }}
        >
          新增
        </Button>
      </Space>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [

    ]
  }

  const onSelect = (_selectedKeys: string[], info: any) => {
    console.log('selected', _selectedKeys, info);
    setSelectedKeys(_selectedKeys);
    setSelectedTreeInfo(info.node);
  };


  return (
    <div>
      <Row gutter={8}>
        <Col span={5}>
          {treeData[0].children.length > 0 ? (
            <div style={{paddingTop: 10, paddingLeft: 8}}>
              <Input.Search style={{ marginBottom: 8 }} placeholder="输入分类名称搜索" />
              <div style={{height: 'calc(100vh - 200px)', overflowY: 'scroll'}}>
                <Tree
                  showLine
                  switcherIcon={<DownOutlined />}
                  defaultExpandedKeys={['all', `${treeData[0].children[0].id}`]}
                  selectedKeys={selectedKeys}
                  onSelect={onSelect}
                  treeData={treeData}
                />
              </div>
            </div>
          ) : (
            <Empty description={'未配置课程分类树信息'}/>
          )}
        </Col>
        <Col span={19}>
          <BaseCurdSingleTable
            cRef={actionRef}
            rowKey="id"
            key={selectedKeys[0]}
            tableTitle='课程信息'
            type="hrCourse/queryHrCourse"
            importType="hrCourse/importHrCourse"
            tableColumns={getTableColumns()}
            funcCode={'课程信息'}
            tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
            tableDefaultField={selectedKeys[0] === 'all' ? {} :{
              tree_id: selectedKeys[0],
            }}
            rowSelection={{
              type: 'radio',
              callback: (keys: string[], rows: any[]) => {
                if (rows.length > 0) {
                  if (onChange) onChange(rows[0])
                }
              }
            }}
            buttonToolbar={renderButtonToolbar}
            // tableDefaultFilter={selectedKeys[0] === 'all' ? [] : [
            //   {Key: 'tree_id', Val: selectedKeys[0], Operator: '='}
            // ]}
            tableDefaultFilter={[
              {Key: 'prop_key', Val: propKey, Operator: '='},
              {Key: 'wbs_code', Val: wbsCode, Operator: '='},
            ]}
            selectedRowsToolbar={renderSelectedRowsToolbar}
          />
        </Col>
      </Row>
      {open && selectedRecord && (
        <HrCourseDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={'authority'}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {addVisible && selectedTreeInfo && (
        <HrCourseAdd
          selectedTreeInfo={selectedTreeInfo}
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}

export default DrawerDetail;
