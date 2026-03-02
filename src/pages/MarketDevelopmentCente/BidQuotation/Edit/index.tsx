import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { Form, message } from "antd";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";
import _ from 'lodash';

const { CrudEditModal } = SingleTable;

/**
 * 编辑投标报价管理
 * @param props
 * @constructor
 */
const BidQuotationEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const bid_result = Form.useWatch('bid_result', form);

  const [winningAmountRequired, setWinningAmountRequired] = useState(false)

  /**
   * 判断用户是否选择已中标
   * 需要展示performance_detail字段
   */
  useEffect(() => {
    if (bid_result === '已中标') {
      setWinningAmountRequired(true)
    } else {
      setWinningAmountRequired(false)
    }
  }, [bid_result])

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'owner_unit_name',
        'project_name',
        'applicant_unit',
        'is_internal_project',
        'lt_5m_flag',
        'is_new_lowcarbon',
        'project_description',
        'quotation_method',
        'bid_open_time',
        'bid_result',
        'winning_amount',
        'fact_sheet',
        ...[
          'fact_sheet_file',
          'resource_review_report',
          'tender_docs_and_attachments',
          'tender_doc_review',
          'bid_document',
          'bid_document_review',
          'winning_notice',
          'company_meeting_materials',
        ].map(item => ({
          title: 'BidQuotation.' + item,
          subTitle: "附件",
          dataIndex: item,
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <HuaWeiOBSUploadSingleFile
                accept=".doc,.docx,.xls,.xlsx,.pdf"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/BidQuotation"
                handleRemove={() => form.setFieldsValue({ [item]: null })}
                onChange={(file) => {
                  form.setFieldsValue({ [item]: file?.response?.url })
                }}
              />
            )
          }
        })),
        'crm_entry_no',
      ])
      .setFormColumnToSelect([
        {
          value: 'is_internal_project',
          name: 'is_internal_project_str',
          valueType: 'select',
          data: [
            {
              is_internal_project: "0",
              is_internal_project_str: "否",
            },
            {
              is_internal_project: "1",
              is_internal_project_str: "是",
            }
          ]
        },
        {
          value: 'lt_5m_flag',
          name: 'lt_5m_flag_str',
          valueType: 'select',
          data: [
            {
              lt_5m_flag: "0",
              lt_5m_flag_str: "否",
            },
            {
              lt_5m_flag: "1",
              lt_5m_flag_str: "是",
            }
          ]
        },
        {
          value: 'is_new_lowcarbon',
          name: 'is_new_lowcarbon_str',
          valueType: 'select',
          data: [
            {
              is_new_lowcarbon: "0",
              is_new_lowcarbon_str: "否",
            },
            {
              is_new_lowcarbon: "1",
              is_new_lowcarbon_str: "是",
            }
          ]
        },
        {
          value: 'bid_result',
          name: 'bid_result_str',
          valueType: 'select',
          data: [
            {
              bid_result: "已中标",
              bid_result_str: "已中标",
            },
            {
              bid_result: "未中标",
              bid_result_str: "未中标",
            },
            {
              bid_result: "待确定",
              bid_result_str: "待确定",
            }
          ]
        },
      ])
      .setFormColumnToDatePicker([
        {
          value: 'bid_open_time',
          valueType: 'dateTs',
          needValueType: 'timestamp'
        },
      ])
      .setFormColumnToInputNumber([
        {
          value: 'winning_amount',
          valueType: "digit"
        }
      ])
      .setSplitGroupFormColumns([
        {
          title: '项目概览',
          order: 1,
          columns: [
            "owner_unit_name",
            "project_name",
            "applicant_unit",
            "is_internal_project",
            "lt_5m_flag",
            "is_new_lowcarbon",
          ]
        },
        {
          title: '详细信息',
          order: 2,
          columns: [
            "project_description",
            // "construction_location",
            "quotation_method",
            "bid_open_time",
            "bid_result",
            "winning_amount",
            "fact_sheet",
            "fact_sheet_file",
          ]
        },
        {
          title: '投标文件管理',
          order: 3,
          columns: [
            "resource_review_report",
            "tender_docs_and_attachments",
            "tender_doc_review",
            "bid_document",
            "bid_document_review",
            "winning_notice",
          ]
        },
        {
          title: '内部管理与归档',
          order: 5,
          columns: [
            "company_meeting_materials",
            "crm_entry_no",
          ]
        }
      ])
      .needToRules([
        'owner_unit_name',
        'project_name',
        'applicant_unit',
        'is_internal_project',
        'lt_5m_flag',
        'is_new_lowcarbon',

        "project_description",
        // "construction_location",
        "quotation_method",
        "bid_open_time",
        "bid_result",
        winningAmountRequired ? "winning_amount" : "",

      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑投标报价管理"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        "is_internal_project": String(selectedRecord.is_internal_project),
        "lt_5m_flag": String(selectedRecord.lt_5m_flag),
        "is_new_lowcarbon": String(selectedRecord.is_new_lowcarbon),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "bidQuotation/updateInfo",
            payload: {
              ...selectedRecord,
              ...values,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect()(BidQuotationEdit);
