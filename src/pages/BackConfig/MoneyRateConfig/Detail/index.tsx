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
import Contract from '@/components/Ledger/contract';
import Contractor from '@/components/Ledger/contractor';
import Subcontractor from '@/components/Ledger/subcontractor';
import ExpenseControl from '@/components/Ledger/expenseControl';

const { CrudQueryDetailDrawer } = SingleTable;

const PartDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, actionRef, dispatch, authority } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  /**
   * 收入合同台账
   * @returns 
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      ...getDepTitle(),
      "user_name",
      "owner_name",
      "owner_group_str",
      'owner_unit_name',
      "project_location",
      "contract_no",
      "wbs_code",
      "contract_name",
      "scope_fo_work",
      "contract_mode_str",
      "bidding_mode",
      "valuation_mode_name",
      "contract_start_date_str",
      "contract_end_date_str",
      "contract_say_price",
      "contract_un_say_price",
      "contract_sign_date_str",
      "project_level_str",
      "project_category_str",
      "specialty_type_str",
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
      'settlement_management_id_str',
      "form_maker_code",
      "form_maker_name",
      "form_make_time_str",
    ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"]);
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
      type: 'income/deleteIncomeInfo',
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
        title="收入合同台账详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Tabs defaultActiveKey="3">
          <Tabs.TabPane tab="预结算费控中心" key="3">
            <ExpenseControl
              dispatch={dispatch}
              selectedRecord={selectedRecord}
            />
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="支出合同" key="1">
            <Contract
              authority={authority}
              selectedRecord={selectedRecord}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="分包商" key="2">
            <Subcontractor
              authority={authority}
              selectedRecord={selectedRecord}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="承包商" key="4">
            <Contractor
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
