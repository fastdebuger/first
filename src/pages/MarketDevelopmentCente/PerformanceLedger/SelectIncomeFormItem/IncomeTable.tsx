import React, { useRef } from 'react';
import { Button, Modal } from "antd";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { WBS_CODE } from "@/common/const";
import { configColumns } from "./columns";
import { getDepTitle } from '@/utils/utils';

/**
 * 收入合同台账清单
 * 选择一条数据
 * @constructor
 */
const IncomeTable: React.FC<any> = (props) => {
  const { onSelect, visible, onCancel } = props;

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        ...getDepTitle(),
        'contract_no',
        "wbs_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        'owner_unit_name',
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
                  onClick={() => window.open(text)}
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
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "branch_comp_code",
        "dep_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        "owner_unit_name",
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
      ]);
    return cols.getNeedColumns();
  };

  /**
   * 选择数据后关闭
   * @param rows 
   */
  const selectedRowsToolbar = (selectedRows: any) => {
    if (selectedRows.length > 0) {
      onSelect(selectedRows[0])
      onCancel()
    }
    return [];
  }

  return (
    <div>
      {visible && (
        <Modal
          title={''}
          visible={visible}
          onCancel={onCancel}
          width={'100vw'}
          footer={null}
          style={{
            top: 0,
            maxWidth: '100vw',
            paddingBottom: 0,
            maxHeight: '100vh',
            overflow: 'hidden',
          }}
          bodyStyle={{
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <BaseCurdSingleTable
            rowKey="RowNumber"
            tableTitle="收入合同台账"
            funcCode={"shouruhetongselect"}
            type="income/getIncomeInfo"
            importType="income/getIncomeInfo"
            tableColumns={getTableColumns()}
            tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
            buttonToolbar={undefined}
            selectedRowsToolbar={selectedRowsToolbar}
            rowSelection={{ type: 'radio' }}
            tableDefaultFilter={
              [
                { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' },
              ]
            }
          />
        </Modal>
      )}
    </div>
  )
}
export default IncomeTable;
