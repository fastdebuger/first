import React, { useState } from 'react';
import { Button, message, Modal, Space, Tabs } from 'antd';
import { configColumns } from '../columns';

import { BasicTableColumns, SingleTable } from 'yayang-ui';
import PartEdit from '../Edit';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { hasPermission } from '@/utils/authority';
import { getDepTitle } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import Income from '@/components/Ledger/income';
import SubExpenseControl from '@/components/Ledger/SubExpenseControl';
import SubcontractorContract from '@/components/Ledger/SubcontractorContract';

const { CrudQueryDetailDrawer } = SingleTable;

const PartDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, actionRef, dispatch, authority } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      ...getDepTitle(),
      'contract_no',
      'income_info_wbs_code',
      'obs_name',
      'user_name',
      // 'contract_name',
      // 'contract_income_id',
      'contract_out_name',
      'subletting_enroll_name',
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
      'relative_person_code',
      {
        title: 'contract.scanning_file_url',
        dataIndex: 'file_url',
        subTitle: '合同扫描件',
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
    ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
      <Button
        key={authority + 'edit'}
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={'primary'}
        onClick={() => setEditVisible(true)}
      >
        编辑
      </Button>,
      <Button
        key={authority + 'del'}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        danger
        type={'primary'}
        onClick={() => setDelVisible(true)}
      >
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: 'expenditure/deleteContract',
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('删除成功');
          setTimeout(() => {
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="contract_no"
        title="支出合同台账详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >

        <Tabs defaultActiveKey="1">

          <Tabs.TabPane tab="预结算费控中心" key="1">
            <SubExpenseControl
              authority={authority}
              selectedRecord={selectedRecord}
              dispatch={dispatch}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="收入合同" key="2">
            <Income
              authority={authority}
              selectedRecord={selectedRecord}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="分包合同" key="5">
            <SubcontractorContract
              authority={authority}
              selectedRecord={selectedRecord}
            />
          </Tabs.TabPane>

        </Tabs>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <PartEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackAddSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      <Modal
        title="删除数据"
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={'primary'} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}
        onOk={handleDel}
        onCancel={() => setDelVisible(false)}
      >
        <p>是否删除当前的数据: {selectedRecord.part_number_code}</p>
      </Modal>
    </>
  );
};

export default connect()(PartDetail);
