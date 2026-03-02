import React from 'react';
import { Button } from 'antd';
import { ExpenditureConfigColumns } from './columns';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { connect } from 'umi';
import { getDepTitle } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';


const PartDetail: React.FC<any> = (props) => {
  const { selectedRecord, actionRef, authority } = props;

  /**
   * 分包商下有哪些分包合同
   * @returns 
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(ExpenditureConfigColumns);
    cols
      .initTableColumns([
        "RowNumber",
        ...getDepTitle(),
        'subletting_enroll_name',
        'contract_no',
        "income_info_wbs_code",
        'obs_name',
        'user_name',
        // 'contract_name',
        // 'contract_income_id',
        'contract_out_name',
        // 'wbs_name',
        'y_signatory_name',
        'y_site_name',
        'contract_scope',
        'contract_type_str',
        'pur_way_str',
        'contract_start_date_str',
        'contract_end_date_str',
        'contract_say_price',
        'contract_un_say_price',
        'contract_sign_date_str',
        'materials_type_str',
        {
          title: 'contract.file_url',
          dataIndex: 'file_url',
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
        },
        'remark',
        'form_maker_name',
        'form_make_time_str',
        'settlement_management_id_str'
      ])
      .needToFixed([
        {
          value: "settlement_management_id_str",
          fixed: "right"
        }
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        ...getDepTitle(),
        'subletting_enroll_name',
        'obs_name',
        'user_name',
        'contract_no',
        'income_info_wbs_code',
        // 'contract_name',
        // 'contract_income_id',
        'contract_out_name',
        // 'wbs_name',
        'y_signatory_name',
        'y_site_name',
        // 'contract_no',
        'contract_scope',
        'contract_type_str',
        'pur_way_str',
        'contract_start_date_str',
        'contract_end_date_str',
        'contract_say_price',
        'contract_un_say_price',
        'contract_sign_date_str',
        'materials_type_str',
        'remark',
        'form_maker_name',
        'form_make_time_str',
        'settlement_management_id_str'
      ]);
    return cols.getNeedColumns();
  };


  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle="分包合同台帐"
        funcCode={authority + 'contract'}
        type="expenditure/queryContract"
        importType="expenditure/queryContract"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={undefined}
        selectedRowsToolbar={undefined}
        rowSelection={null}
        tableDefaultFilter={
          [
            { Key: 'subletting_enroll_name', Val: selectedRecord.subletting_enroll_name, Operator: '=' }
          ]
        }
      />
    </>
  );
};

export default connect()(PartDetail);
