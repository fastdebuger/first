import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Space, Tag } from 'antd';
import { configColumns } from '../columns';
import { BasicTableColumns, SingleTable } from 'yayang-ui';
import PartEdit from '../Edit';
import { connect } from 'umi';
import { ErrorCode, WBS_CODE } from '@/common/const';
import { hasPermission } from '@/utils/authority';
import { getDepTitle, fetchContractData } from '@/utils/utils';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
const { CrudQueryDetailDrawer } = SingleTable;

const PartDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, actionRef, dispatch, authority } = props;
  // console.log('selectedRecord :>> ', selectedRecord);
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const [contractList, setContractList] = useState([]);//存储主合同信息列表

  useEffect(() => {
    fetchContractData('income', {
      filter: JSON.stringify([
        { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' },
      ]),
      sort: 'id',
      order: 'desc',
    }, dispatch, (res: any) => {
      if (res.errCode === ErrorCode.ErrOk) {
        setContractList(res.rows);
      }
    });
  }, [dispatch])
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
      "revenue_method_str",
      "remark",
      "form_maker_code",
      "form_maker_name",
      "form_make_time_str",

      'visa_code',
      'visa_major',
      'visa_content',
      'visa_budget_amount',
      'visa_review_amount',
      'visa_prepared_by_str',
      'visa_agent_by_str',
      'visa_date_str',
      'reporting_date_str',
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
    ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    // 检查合同是否已结算
    const isSettled = selectedRecord?.contract_income_id && contractList?.length > 0 && (() => {
      const matchedContract = contractList.find((contract: any) =>
        String(contract.id) === String(selectedRecord?.contract_income_id)
      );
      return matchedContract && (matchedContract as any).settlement_management_id > 0;
    })();

    if (isSettled) {
      return [
        <Tag key="settlement-tag" color="warning">当前合同已经结算，无法进行任何操作</Tag>
      ];
    }

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
      type: 'visa/delEngineeringVisa',
      payload: {
        form_no: selectedRecord.form_no,
      },
      callback: (res: { errCode: number }) => {
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
        title="主合同签证详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
      </CrudQueryDetailDrawer>
      {editVisible && (
        <PartEdit
          visible={editVisible}
          record={selectedRecord}
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
        <p>是否删除当前的数据?</p>
      </Modal>
    </>
  );
};

export default connect()(PartDetail);
