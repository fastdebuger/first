import React from "react";
import { Button } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { configColumns } from "../columns";
import { getUrlCrypto } from "@/components/HuaWeiOBSUploadSingleFile";
const { CrudQueryDetailDrawer } = SingleTable;

/**
 * HSE法律法规库详情
 * @param props
 * @constructor
 */
const SupplierInfoDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord } = props;

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "wbs_name",
      'law_name',
      "element",
      "law_level_name",
      "keywords",
      "version_no",
      "publish_content",
      "publish_date_str",
      "effective_date_str",
      "audit_status",
      "create_by_name",
      "create_date_str",
      {
        title: 'HSELegislation.file_path',
        dataIndex: 'file_path',
        subTitle: '文件',
        align: 'center',
        width: 160,
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
    ])
      .noNeedToFilterIcon(['RowNumber'])
      .noNeedToSorterIcon(['RowNumber'])
    return cols.getNeedColumns();
  }

  const renderButtonToolbar = () => {
    return [
    ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="supplier_code"
        title="HSE法律法规库"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
      </CrudQueryDetailDrawer>
    </>
  );
};

export default connect()(SupplierInfoDetail);
