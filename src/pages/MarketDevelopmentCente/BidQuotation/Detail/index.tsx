import React, { useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import BidQuotationEdit from "../Edit";
import { configColumns } from "../columns";
import { getUrlCrypto } from "@/components/HuaWeiOBSUploadSingleFile";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 投标报价管理详情
 * @param props
 * @constructor
 */
const BidQuotationDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "owner_unit_name",
      'project_name',
      "applicant_unit",
      "is_internal_project_str",
      "lt_5m_flag_str",
      "is_new_lowcarbon_str",
      "project_description",
      // "construction_location",
      "quotation_method",
      "bid_open_time_str",
      "bid_result",
      "winning_amount",
      'fact_sheet',
      ...[
        'fact_sheet_file',
        "resource_review_report",
        "tender_docs_and_attachments",
        "tender_doc_review",
        "bid_document",
        "bid_document_review",
        "winning_notice",
        "company_meeting_materials",
      ].map(item => {
        return {
          title: 'BidQuotation.' + item,
          dataIndex: item,
          subTitle: formatMessage({ id: 'BidQuotation.' + item }),
          align: 'center',
          width: 240,
          render: (text: any) => {
            if (text) {
              return (
                <Button
                  onClick={() => window.open(getUrlCrypto(text))}
                  size='small'
                  type='link'
                >下载文件</Button>
              )
            }
            return ''
          }
        }
      }),
      "crm_entry_no",
      // "wbs_code",
    ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "owner_unit_name",
        'project_name',
        "applicant_unit",
        "is_internal_project_str",
        "lt_5m_flag_str",
        "is_new_lowcarbon_str",
        "project_description",
        // "construction_location",
        "quotation_method",
        "bid_open_time_str",
        "bid_result",
        "winning_amount",
        "resource_review_report",
        "tender_docs_and_attachments",
        "tender_doc_review",
        "bid_document",
        "bid_document_review",
        "winning_notice",
        "company_meeting_materials",
        "crm_entry_no",
      ])
    return cols.getNeedColumns();
  }

  const renderButtonToolbar = () => {
    return [
      <Button style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }} type={"primary"} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
      <Button style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }} danger type={"primary"} onClick={() => setDelVisible(true)}>
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "bidQuotation/delInfo",
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="owner_unit_name"
        title="投标报价管理"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
      </CrudQueryDetailDrawer>
      {editVisible && (
        <BidQuotationEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }}
        />
      )}
      <Modal
        title="删除数据"
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={"primary"} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}
        onOk={handleDel}
        onCancel={() => setDelVisible(false)}
      >
        <p>是否删除当前的数据: {selectedRecord["id"]}</p>
      </Modal>
    </>
  );
};

export default connect()(BidQuotationDetail);
