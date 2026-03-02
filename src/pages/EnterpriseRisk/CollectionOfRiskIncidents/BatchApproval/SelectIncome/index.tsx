import React, { useState } from 'react';
import { Button, message, Modal } from 'antd';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from '@/pages/Contract/Income/columns';
import { getDepTitle } from '@/utils/utils';
// import { getUrlCrypto } from '../HuaWeiOBSUploadSingleFile';

/**
 * 查看文件的弹窗
 * @param props
 * @constructor
 */
const IncomeInfoWbsNameModal: React.FC<any> = (props: any) => {
  const { visible, onCancel, title, onSelect } = props;
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
        // {
        //   title: 'contract.file_url',
        //   dataIndex: 'file_url',
        //   subTitle: '文件',
        //   align: 'center',
        //   width: 160,
        //   render: (text: any) => {
        //     if (text) {
        //       return (
        //         <Button
        //           onClick={() => window.open(getUrlCrypto(text))}
        //           size='small'
        //           type='link'
        //         >下载文件</Button>
        //       )
        //     }
        //     return ''
        //   }
        // },
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

  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    if (selectedRows.length > 0) {
      onSelect(selectedRows[0])
      // setRecord(selectedRows[0])
    }
    return [];
  };

  return (
    <Modal
      title={'查看'}
      visible={visible}
      onCancel={onCancel}
      // okText={'完成'}
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
        height: 'calc(100vh - 56px)',
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
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={undefined}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: 'radio' }}
      />
    </Modal>
  );
};

export default IncomeInfoWbsNameModal;
