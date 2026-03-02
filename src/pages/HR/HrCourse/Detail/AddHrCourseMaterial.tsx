import { Button, message, Modal, Tag } from 'antd';
import React, { useEffect } from 'react';
import HrCourseMaterialAdd from "@/pages/HR/HrCourseMaterial/Add";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {configColumns} from "@/pages/HR/HrCourseMaterial/columns";
import { BasicTableColumns } from 'yayang-ui';
import {ErrorCode} from "@/common/const";
import HrCourseMaterialEdit from "@/pages/HR/HrCourseMaterial/Edit";
import { connect } from 'umi';
import {translateIntoCourseware} from "@/services/hr/hrCourseMaterial";

const AddHrCourseMaterial = (props: any) => {

  const { selectedCourseItem, dispatch } = props;
  const actionRef = React.useRef<any>();
  const [addVisible, setAddVisible] = React.useState(false);
  const [editVisible, setEditVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState([]);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "material_name",
      // "material_url",
      {
        title: "compinfo.material_url",
        subTitle: "资料地址",
        dataIndex: "material_url",
        width: 160,
        align: "center",
        render: (text, record) => {
          if (!text) {
            return '--'
          }
          return (
            <a onClick={() => {
              window.open(text, '_blank');
            }}>查看</a>
          )
        }
      },
      "material_type_str",
      "create_ts",
      "create_user_name",
      {
        title: "compinfo.operate",
        subTitle: "操作",
        dataIndex: "operate",
        width: 160,
        align: "center",
        render: (text, record) => {
          if (Number(record.is_translate) === 1) {
            return (
              <Tag color={'blue'}>已转课件</Tag>
            )
          }
          return (
            <>
              <a onClick={() => {
                Modal.confirm({
                  title: "转课件",
                  content: "确定转课件吗？",
                  okText: '确定',
                  cancelText: '我再想想',
                  onOk: async () => {
                    const res = await translateIntoCourseware({
                      id: record.id,
                    })
                    if(res.errCode === ErrorCode.ErrOk) {
                      message.success('已转课件');
                      actionRef.current.reloadTable();
                    }
                  }

                })
              }}>转课件</a>
            </>
          )
        }
      },
    ])
      .setTableColumnToDatePicker([
        {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ])
      .needToFixed([
        {value: 'operate', fixed: 'right'}
      ])
      .needToExport([])
    return cols.getNeedColumns();
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        // style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
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
                type: "hrCourseMaterial/delHrCourseMaterial",
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


  return (
    <div>
      <div>
        <BaseCurdSingleTable
          cRef={actionRef}
          rowKey="id"
          tableTitle='课程资料'
          type="hrCourseMaterial/queryHrCourseMaterial"
          importType="hrCourseMaterial/importHrCourseMaterial"
          tableColumns={getTableColumns()}
          funcCode={'课程资料'}
          tableDefaultFilter={[
            {Key: 'course_id', Val: selectedCourseItem.id, Operator: '='}
          ]}
          tableSortOrder={{ sort: 'create_ts', order: 'desc' }}
          buttonToolbar={() => {
            return [
              <Button type={'primary'} onClick={() => {
                setAddVisible(true);
              }}>
                添加资料
              </Button>
            ]
          }}
          selectedRowsToolbar={renderSelectedRowsToolbar}
        />
      </div>
      {addVisible && (
        <HrCourseMaterialAdd
          selectedCourseItem={selectedCourseItem}
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
      {editVisible && (
        <HrCourseMaterialEdit
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


export default connect()(AddHrCourseMaterial);
