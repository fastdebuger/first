import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from './columns';
import { getDepTitle } from '@/utils/utils';
import { getUrlCrypto } from '../HuaWeiOBSUploadSingleFile';

/**
 * 主合同操作记录台账
 * @param props
 * @constructor
 */
const LogIncomeContractModal: React.FC<any> = (props: any) => {
  const { selectedRows } = props;
  const [visible, setVisible] = useState(false)

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
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
                  onClick={() => window.open(getUrlCrypto(text))}
                  size='small'
                  type='link'
                >下载文件</Button>
              )
            }
            return ''
          }
        },
        {
          title: 'contract.others_file_url',
          dataIndex: 'others_file_url',
          subTitle: '其他附件',
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
      .noNeedToFilterIcon([
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
        'file_url',
        'others_file_url',
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
        'settlement_management_id_str'
      ])
      .noNeedToSorterIcon([
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
        'file_url',
        'others_file_url',
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
        'settlement_management_id_str'
      ])

    return cols.getNeedColumns();
  };


  return (
    <>
      <Button
        type="default"
        onClick={() => setVisible(true)}
      >
        操作记录
      </Button>
      {
        visible && (
          <Modal
            title={'查看'}
            visible={visible}
            onCancel={() => setVisible(false)}
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
              tableTitle="主合同操作记录台账"
              funcCode={'LogIncomeContractlog'}
              type="income/getIncomeInfoLog"
              importType="income/getIncomeInfoLog"
              tableColumns={getTableColumns()}
              tableSortOrder={{ sort: '', order: 'desc' }}
              tableDefaultField={{ id: selectedRows.id }}
              buttonToolbar={undefined}
              selectedRowsToolbar={undefined}
              rowSelection={null}
              tableScroll={{ y: 600 }}
              tableDefaultFilter={[]}
            />
          </Modal>
        )
      }
    </>
  );
};

export default LogIncomeContractModal;

