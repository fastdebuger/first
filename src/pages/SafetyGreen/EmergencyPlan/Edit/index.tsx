import React, { useEffect, useState } from 'react';
import { configColumns } from '../columns';
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { Button, message, Space } from 'antd';
import type { ConnectState } from '@/models/connect';
import { convertLevelCodeToNumber } from '@/utils/utils';
import { renderTextArea } from '../Add';

const { CrudAddModal } = HeaderAndBodyTable;

interface Income {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[],
  record: any
}

/**
 * 应急预案模板编辑
 * @param props 
 * @returns 
 */
const EmergencyPlanEdit: React.FC<Income> = (props) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackAddSuccess,
    record
  } = props;

  const { formatMessage } = useIntl();
  // 表体区域
  const [bodyData, setBodyData] = useState<any>([]);


  useEffect(() => {
    let form_no = record?.form_no;
    if (form_no) {
      dispatch({
        type: 'emergencyplan/queryContingencyPlanConfigBody',
        payload: {
          sort: 'order_num',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'form_no', Val: form_no, Operator: '=' }
          ]),
        },
        callback: (res: any) => {
          const result = res?.rows || []
          setBodyData(result);
        },
      });
    }
  }, [record]);

  /**
   * 表单配置
   * @returns 
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "plan_name",
        "applicable_area",
        "scene",
        "punishment_principle",
        // "disposal_process",
      ])
      .setFormColumnToInputTextArea([
        {
          value: "punishment_principle",
        }
      ])
      .needToRules([
        "plan_name",
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  /**
   * 表格配置
   * @returns 
   */
  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        renderTextArea("level_name"),
        "level_rgb",
        "level_code",
        renderTextArea("description"),
        renderTextArea("message_source"),
        renderTextArea("verification_analysis"),
        renderTextArea("push_level_and_scope"),
        renderTextArea("response_preparation"),
        renderTextArea("warning_release"),
        renderTextArea("possible_accident"),
        renderTextArea("report_path"),
        renderTextArea("social_resource"),
        renderTextArea("social_resource_contact"),
        renderTextArea("social_resource_estimate"),
        renderTextArea("termination_condition"),
        renderTextArea("follow_up_requirements"),
        renderTextArea("disposal_process"),
      ])
      .setTableColumnToSelect([
        {
          value: "level_rgb",
          valueType: "select",
          name: "level_rgb_str",
          data: [
            {
              level_rgb: "blue",
              level_rgb_str: "蓝色"
            },
            {
              level_rgb: "yellow",
              level_rgb_str: "黄色"
            },
            {
              level_rgb: "orange",
              level_rgb_str: "橙色"
            },
            {
              level_rgb: "red",
              level_rgb_str: "红色"
            },
          ]
        },
        {
          value: "level_code",
          valueType: "select",
          name: "level_code_str",
          data: [
            {
              level_code: "IV级/一般",
              level_code_str: "IV级/一般"
            },
            {
              level_code: "III级/较重",
              level_code_str: "III级/较重"
            },
            {
              level_code: "II级/严重",
              level_code_str: "II级/严重"
            },
            {
              level_code: "I级/特别严重",
              level_code_str: "I级/特别严重"
            },
          ]
        }
      ])
      .getNeedColumns();

    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };



  const toolBarRender = (
    handleAdd: any,
    handleBatchAdd: any,
    form: any,
    updateLoadDataSourc: any,
    dataSource: any
  ) => {
    return [
      <Space>
        <h3>应急预案内容 </h3>
        <Button onClick={async () => {
          await form?.current?.validateFields();
          handleAdd();
        }}
        >
          新增
        </Button>
      </Space>
    ]
  }

  return (
    <>
      <CrudAddModal
        sticky={false}
        scroll={{
          y: false,
        }}
        title={'编辑应急预案模板'}
        visible={true}
        onCancel={onCancel}
        toolBarRender={
          toolBarRender
        }
        formColumns={getFormColumns()}
        tableColumns={getTableColumns()}
        initFormValues={{ ...record }}
        initDataSource={[...bodyData]}
        onCommit={(data: any) => {
          const { dataSource, form, addItems, editItems, delItems } = data;
          const values = form.getFieldsValue();
          if (!(dataSource.length > 0)) {
            message.error("请添加数据")
            return new Promise((resolve: any) => {
              resolve(true)
            })
          }
          dataSource.forEach((item: any) => {
            item.order_num = convertLevelCodeToNumber(item.level_code)
          });
          const del = delItems.map((item: any) => item.id);
          const update = editItems.map((i: any) => {
            delete i.key;
            delete i.isEditRow;
            delete i.isAddRow;
            delete i.RowNumber;
            return i;
          });
          const add = addItems.map((i: any) => {
            delete i.id;
            delete i.key;
            delete i.isEditRow;
            delete i.isAddRow;
            delete i.RowNumber;
            return i;
          });

          // return new Promise(o => o(true))
          return new Promise((resolve: any) => {
            dispatch({
              type: 'emergencyplan/updateContingencyPlanConfig',
              payload: {
                ...record,
                ...values,
                AddItems: JSON.stringify(add),
                UpdateItems: JSON.stringify(update),
                DelItems: JSON.stringify(del),
              },
              callback: (res: any) => {
                resolve(true);
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success(formatMessage({ id: 'common.list.edit.success' }));
                  setTimeout(() => {
                    callbackAddSuccess();
                  }, 200);
                }
              },
            });
          });
        }}
      >
      </CrudAddModal>

    </>
  );
};

export default connect(({ steelmembercategory }: ConnectState) => ({
  steelmembercategoryTypeList: steelmembercategory.steelmembercategoryTypeList,
}))(EmergencyPlanEdit);
