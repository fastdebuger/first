import React from 'react';
import { Button } from 'antd';
import { IncomeConfigColumns } from './columns';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { connect } from 'umi';
import { getDepTitle } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';


const PartDetail: React.FC<any> = (props) => {
  const { selectedRecord, actionRef, authority } = props;

  /**
   * 承包商台账
   * @returns 
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(IncomeConfigColumns);
    cols
      .initTableColumns([
        "RowNumber",
        ...getDepTitle(),
        'owner_unit_name',
        'contract_no',
        "wbs_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode_str",
        "bidding_mode_str",
        "valuation_mode_name",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "contract_un_say_price",
        "contract_sign_date_str",
        "project_level_str",
        "project_category_str",
        "revenue_method_str",
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
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
        'settlement_management_id_str'
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToFixed([
        {
          value: "settlement_management_id_str",
          fixed: "right"
        }
      ])
      .needToExport([
        "RowNumber",
        ...getDepTitle(),
        "owner_unit_name",
        "user_name",
        "owner_name",
        "owner_group_str",

        "project_location",
        "contract_no",
        "wbs_code",
        "contract_name",
        "scope_fo_work",
        "contract_mode_str",
        "bidding_mode_str",
        "valuation_mode_name",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "contract_un_say_price",
        "contract_sign_date_str",
        "project_level_str",
        "project_category_str",
        "revenue_method_str",
        'file_url',
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
        'settlement_management_id_str'
      ]);
    return cols.getNeedColumns();
  };

  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle="承包商台账"
        funcCode={authority + 'getIncomeInfoyyy'}
        type="income/getIncomeInfo"
        importType="income/getIncomeInfo"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={undefined}
        selectedRowsToolbar={undefined}
        rowSelection={null}
        tableDefaultFilter={
          [
            { Key: 'owner_unit_name', Val: selectedRecord.owner_unit_name, Operator: '=' }
          ]
        }
      />
    </>
  );
};

export default connect()(PartDetail);
