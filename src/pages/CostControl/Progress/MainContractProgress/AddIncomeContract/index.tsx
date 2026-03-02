import React, { useRef, useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { connect } from 'umi';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from './columns';
import { WBS_CODE } from '@/common/const';
import { getDepTitle } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

export interface SelectedIncomeContract {
  id: number;
  branch_comp_code: string;
  dep_code: string;
  user_code: string;
  owner_name: string;
  owner_group: string;
  owner_unit_name: string;
  project_location: string;
  contract_no: string;
  wbs_code: string;
  contract_name: string;
  scope_fo_work: string;
  contract_mode: string;
  bidding_mode: string;
  valuation_mode: string;
  contract_commencement_date: string;
  contract_completion_date: string;
  contract_say_price: number;
  contract_un_say_price: number;
  contract_sign_date: string;
  project_level: string;
  project_category: string;
  revenue_method: string;
  file_url: string;
  remark: string;
  form_maker_code: string;
  form_maker_name: string;
  form_make_time: number;
  form_make_tz: string;
  owner_group_str: string;
  contract_mode_str: string;
  bidding_mode_str: string;
  valuation_mode_name: string;
  project_level_str: string;
  project_category_str: string;
  revenue_method_str: string;
  user_name: string;
  wbs_name: string;
  dep_name: string;
  branch_comp_name: string;
  contract_commencement_date_str: string;
  contract_completion_date_str: string;
  contract_sign_date_str: string;
  form_make_time_str: string;
  RowNumber: number;
}

interface AddIncomeContractProps {
  handleOk: (selectedRows: SelectedIncomeContract[]) => void;
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
  const [selectedRows, setSelectedRows] = useState<SelectedIncomeContract[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

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
        "bidding_mode",
        "valuation_mode_name",
        "contract_commencement_date_str",
        "contract_completion_date_str",
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
        "bidding_mode",
        "valuation_mode_name",
        "contract_commencement_date_str",
        "contract_completion_date_str",
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
  const renderSelectedRowsToolbar = (selectedRows: SelectedIncomeContract[]) => {
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
        placeholder='请选择收入合同'
        onSearch={() => setIsVisible(true)}
      />
      <Modal
        title='收入合同台账'
        visible={isVisible}
        width={'80vw'}
        bodyStyle={{ height: 'calc(100vh - 108px)'}}
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
            tableTitle="收入合同台账"
            funcCode={'收入合同台账'}
            type="income/getIncomeInfo"
            importType="income/getIncomeInfo"
            tableColumns={getTableColumns()}
            tableSortOrder={{ sort: 'id', order: 'desc' }}
            buttonToolbar={renderButtonToolbar}
            selectedRowsToolbar={renderSelectedRowsToolbar}
            rowSelection={{ type: 'radio' }}
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
