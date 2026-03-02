import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Divider, Empty, Input, message, Modal, Row, Space, Tree} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import HrCourseAdd from "./Add";
import HrCourseDetail from "./Detail";
import HrCourseEdit from "./Edit";
import {queryWorkTypeTree, updatePublicStatus} from "@/services/hr/hrCourse";
import {deepArr} from "@/utils/utils-array";
import { DownOutlined } from '@ant-design/icons';
import {buildTree} from "@/utils/utils";


/**
 * 课程信息
 * @constructor
 */
const HrCoursePage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const propKey = localStorage.getItem("auth-default-wbs-prop-key")
  const wbsCode = localStorage.getItem('auth-default-wbsCode');

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
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
        width: 180,
        align: "center",
        render: (text, record) => {
          return (
            <>
              {Number(record.is_public) === 0 ? (
                <a onClick={async () => {
                  const res = await updatePublicStatus({
                    id: record.id,
                    is_public: '1'
                  })
                  if (res.errCode === 0) {
                    message.success("课程已公开，可在首页查看");
                    if(actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                }}>公开</a>
              ) : (
                <a onClick={async () => {
                  const res = await updatePublicStatus({
                    id: record.id,
                    is_public: '0'
                  })
                  if (res.errCode === 0) {
                    message.success("课程已关闭");
                    if(actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                }}>不公开</a>
              )}
              <Divider type="vertical" />
              <a onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}>详情</a>
              {/*{Number(record.publish_status) !== 1 && Number(record.approval_status) === 2 && (*/}
              <Divider type="vertical" />
              <a onClick={() => {
                setSelectedRecord(record);
                setOpen(true);
              }}>配置资料</a>
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
          style={{display: hasPermission(authority, '新增') ? 'inline' : 'none'}}
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
        {/*<Button
          type="primary"
          style={{display: hasPermission(authority, '导入') ? 'inline' : 'none'}}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>*/}
      </Space>,
      <a
        style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        onClick={(e) => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >导出</a>
    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1){
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      <Button
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          Modal.confirm({
            title: "删除",
            content: "确定删除所选的内容？",
            okText: "确定删除",
            okType: "danger",
            cancelText: "我再想想",
            onOk() {
              dispatch({
                type: "hrCourse/delHrCourse",
                payload: {
                  id: selectedRows[0]['id'],
                },
                callback: (res: any) => {
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success("删除成功");
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                },
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        }}
      >
        删除
      </Button>
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
          authority={authority}
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
      {visible && (
        <BaseImportModal
          visible={visible}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if(actionRef.current) {
              return actionRef.current.importFile(file, authority, () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile(authority);
            }
          }}
        />
      )}
      {editVisible && (
        <HrCourseEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(HrCoursePage);
