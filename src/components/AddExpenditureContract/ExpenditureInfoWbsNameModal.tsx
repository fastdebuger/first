import React from 'react';
import { Button, Modal } from 'antd';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from './columns';
import { getDepTitle } from '@/utils/utils';
import { WBS_CODE } from '@/common/const';

/**
 * 支出合同选择模态框
 * @param props
 * @constructor
 */
const ExpenditureInfoWbsNameModal: React.FC<any> = (props: any) => {
  const { visible, onCancel, onSelect, filter, isNeedFilter } = props;

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        ...getDepTitle(),
        'contract_no',
        'income_info_wbs_code',
        'obs_name',
        'user_name',
        'subletting_enroll_code',
        'pre_total_output_value',
        'y_site_user',
        'actual_start_date', // 实际开工日期
        // 'contract_name',
        // 'contract_income_id',
        'contract_out_name',
        'subletting_enroll_name',
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
                  onClick={() => window.open(text)}
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
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .setTableColumnToDatePicker([
        { value: 'actual_start_date', valueType: 'dateTs' }
      ])
    return cols.getNeedColumns();
  };

  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    if (selectedRows.length > 0) {
      onSelect(selectedRows[0])
    }
    return [];
  };

  return (
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
        tableTitle="分包合同台账"
        funcCode={'expenditureExpenditure1InfoWbsNameModal'}
        type="expenditure/queryContract"
        importType="expenditure/queryContract"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
        buttonToolbar={undefined}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: 'radio' }}
        tableScroll={{ y: 600 }}
        tableDefaultField={ isNeedFilter && { queryAlternativeInfo: 1 }}
        tableDefaultFilter={
          [
            { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' },
            ...filter
          ]

        }
      />
    </Modal>
  );
};

export default ExpenditureInfoWbsNameModal;

