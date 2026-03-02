import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from './columns';
import { getDepTitle } from '@/utils/utils';
import { getUrlCrypto } from '../HuaWeiOBSUploadSingleFile';
/**
 * 支出合同操作记录
 * @param props
 * @constructor
 */
const LogExpenditureInfoWbsNameModal: React.FC<any> = (props: any) => {
  const { selectedRows } = props;
  const [visible, setVisible] = useState(false)

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        ...getDepTitle(),
        'contract_no',
        "income_info_wbs_code",
        'obs_name',
        'user_name',
        'contract_name',
        // 'contract_income_id',
        'contract_out_name',
        'subletting_enroll_name',
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
        'remark',
        'form_maker_name',
        'form_make_time_str',
        'settlement_management_id_str'
      ])
      .noNeedToFilterIcon([
        ...getDepTitle(),
        'contract_no',
        "income_info_wbs_code",
        'obs_name',
        'user_name',
        'contract_name',
        'contract_out_name',
        'subletting_enroll_name',
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
        'file_url',
        'others_file_url',
        'remark',
        'form_maker_name',
        'form_make_time_str',
        'settlement_management_id_str'
      ])
      .noNeedToSorterIcon([
        ...getDepTitle(),
        'contract_no',
        "income_info_wbs_code",
        'obs_name',
        'user_name',
        'contract_name',
        'contract_out_name',
        'subletting_enroll_name',
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
        'file_url',
        'others_file_url',
        'remark',
        'form_maker_name',
        'form_make_time_str',
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
              tableTitle="分包合同操作记录台账"
              funcCode={'expenditure'}
              type="expenditure/queryLog"
              importType="expenditure/queryLog"
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

export default LogExpenditureInfoWbsNameModal;

