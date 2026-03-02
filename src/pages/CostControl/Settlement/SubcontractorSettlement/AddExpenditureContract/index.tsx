import React, { useRef, useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { connect } from 'umi';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from './columns';
import { WBS_CODE } from '@/common/const';
import { getDepTitle } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
export interface SelectedExpenditureContract {
  RowNumber: number;
  branch_comp_code: string;
  branch_comp_name: string;
  contract_end_date: string;
  contract_end_date_str: string;
  contract_income_id: string;
  contract_name: string;
  contract_no: string;
  contract_out_name: string;
  contract_say_price: number;
  contract_scope: string;
  contract_sign_date: string;
  contract_sign_date_str: string;
  contract_start_date: string;
  contract_start_date_str: string;
  contract_type: string;
  contract_type_str: string;
  contract_un_say_price: number;
  dep_code: string;
  dep_name: string;
  file_url: null | string;
  form_make_time: number;
  form_make_time_str: string;
  form_make_tz: string;
  form_maker_code: string;
  form_maker_name: string;
  id: number;
  income_info_wbs_code: string;
  income_info_wbs_name: string;
  materials_type: string;
  materials_type_str: string;
  obs_code: string;
  obs_name: string;
  pur_way: string;
  pur_way_str: string;
  remark: null | string;
  subletting_enroll_code: null | string;
  subletting_enroll_name: null | string;
  tz: string;
  user_code: string;
  user_name: string;
  wbs_code: string;
  wbs_name: string;
  y_signatory_name: string;
  y_signatory_user: string;
  y_site_name: string;
  y_site_user: string;
}

interface AddIncomeContractProps {
  handleOk: (selectedRows: SelectedExpenditureContract[]) => void;
}

/**
 * 查询收入合同备选数据
 * @constructor
 */
const AddIncomeContract: React.FC<AddIncomeContractProps> = (props) => {
  const {
    handleOk,
  } = props;
  const actionRef: any = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState<SelectedExpenditureContract[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        ...getDepTitle(),
        'obs_name',
        'user_name',
        'income_info_wbs_name',
        // 'contract_name',
        // 'contract_income_id',
        'contract_out_name',
        'wbs_name',
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
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        'branch_comp_name',
        'dep_name',
        'obs_name',
        'user_name',
        'income_info_wbs_name',
        // 'contract_name',
        // 'contract_income_id',
        'contract_out_name',
        'wbs_name',
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
      ]);
    return cols.getNeedColumns();
  };
  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [

    ];
  };
  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: SelectedExpenditureContract[]) => {
    console.log(selectedRows, 'selectedRows');
    setSelectedRows(selectedRows);
    return [

    ];
  };
  return (
    <>
      <Input.Search
        value={inputValue}
        readOnly
        enterButton
        placeholder='请选择分包合同'
        onSearch={() => setIsVisible(true)}
      />
      <Modal
        title='分包合同台账'
        visible={isVisible}
        width={'80vw'}
        bodyStyle={{ height: 'calc(100vh - 108px)' }}
        destroyOnClose
        onCancel={() => setIsVisible(false)}
        onOk={() => {
          if (selectedRows && selectedRows.length > 0) {
            setInputValue(selectedRows[0].contract_name || '');
          }
          handleOk(selectedRows);
          setIsVisible(false);
        }}
        okText='确定'
        cancelText='取消'
      >
        {isVisible && (
          <BaseCurdSingleTable
            cRef={actionRef}
            rowKey="RowNumber"
            tableTitle="分包合同台账"
            funcCode={'expenditure'}
            type="expenditure/queryContract"
            importType="expenditure/queryContract"
            tableColumns={getTableColumns()}
            tableSortOrder={{ sort: 'id', order: 'asc' }}
            buttonToolbar={renderButtonToolbar}
            selectedRowsToolbar={renderSelectedRowsToolbar}
            rowSelection={{ type: 'radio' }}
            tableScroll={{ y: 600 }}
            tableDefaultFilter={
              [
                { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
              ]
            }
          />
        )}
      </Modal>
    </>
  );
};
export default connect()(AddIncomeContract);
