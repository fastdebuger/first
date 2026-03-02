import React, {useEffect, useRef, useState} from 'react';
import {Button, DatePicker, Divider, message, Modal, Space} from "antd";
import {connect} from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns, BaseImportModal} from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";

import {configColumns} from "./columns";
import PushCourseAdd from "./Add";
import PushCourseDetail from "./Detail";
import PushCourseEdit from "./Edit";
import moment from 'moment';
import {pushCourse} from "@/services/hr/pushCourse";

/**
 * 推送课程
 * @constructor
 */
const PushCoursePage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();

  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedYear, setSelectedYear] = useState(moment());

  useEffect(() => {
    if(dispatch) {

    }
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      // "year",
      "course_name",
      // "course_id",
      "study_duration",
      "push_range_type_str",
      // "push_range_value",
      "push_range_name",
      "is_push",
      "pusher_code",
      "pusher_name",
      "push_time",
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
              {Number(record.is_push) !== 1 && (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => {
                    Modal.confirm({
                      title: "发布",
                      content: "确定要发布吗？",
                      okText: "确定发布",
                      cancelText: "我再想想",
                      onOk: async () => {
                        const res = await pushCourse({
                          id: record.id,
                          year: selectedYear.format("YYYY"),
                        })
                        if (res.errCode === ErrorCode.ErrOk) {
                          message.success("已发布");
                          if (actionRef.current) {
                            actionRef.current.reloadTable();
                          }
                        }
                      }
                    })
                  }}>发布</a>
                </>
              )}
            </>
          )
        }
      },
    ])
      .needToFixed([
        {value: 'operate', fixed: 'right'}
      ])
    .setTableColumnToDatePicker([
      {value: 'push_time', valueType: 'dateTs', format: 'YYYY-MM-DD'},
    ])
    return cols.getNeedColumns();
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
            setAddVisible(true);
          }}
        >
          新增
        </Button>
       {/* <Button
          type="primary"
          style={{display: hasPermission(authority, '导入') ? 'inline' : 'none'}}
          onClick={(e) => {
            e.stopPropagation();
            setVisible(true);
          }}
        >导入</Button>*/}
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
      //  无需修改功能，错了 直接删除即可
      /*<Button
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
          if(Number(selectedRows[0].is_push) === 1) {
            message.warning("已发布，不能修改");
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,*/
      <Button
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          if(Number(selectedRows[0].is_push) === 1) {
            message.warning("已发布，不能删除");
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
                type: "pushCourse/deletePushCourse",
                payload: {
                  id: selectedRows[0]['id'],
                  year: selectedYear.format("YYYY"),
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
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='推送课程'
        type="pushCourse/queryPushCourseConfigList"
        exportType="pushCourse/queryPushCourseConfigList"
        tableColumns={getTableColumns()}
        funcCode={authority}
        tableSortOrder={{ sort: 'push_time', order: 'desc' }}
        tableDefaultField={{
          year: selectedYear.format('YYYY'),
        }}
        renderSelfToolbar={() => {
          return (
            <DatePicker disabled format={'YYYY年'} value={selectedYear} onChange={(date, dateString) => {
              setSelectedYear(date)
            }} picker="year" />
          )
        }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <PushCourseDetail
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
      {addVisible && (
        <PushCourseAdd
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
        <PushCourseEdit
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
export default connect()(PushCoursePage);
