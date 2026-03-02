import React, {useState} from 'react';
import {Button, message, Modal, Space} from 'antd';
import {configColumns} from '../columns';
// @ts-ignore
import {BasicTableColumns, SingleTable} from 'yayang-ui';
import EditModal from '../Edit';
import {connect} from 'dva';
import {ErrorCode} from '@/common/const';
import {useIntl} from 'umi';

const {CrudQueryDetailDrawer} = SingleTable;
const {confirm} = Modal;
import {ExclamationCircleOutlined} from "@ant-design/icons";

/**
 * @param props
 * @constructor
 */
const ProdInfoDetail: React.FC<any> = (props: any) => {
  const {open, onClose, selectedRecord, actionRef, dispatch} = props;
  const [editVisible, setEditVisible] = useState(false);
  const {formatMessage} = useIntl();

  const handleDel = () => {
    confirm({
      title: '是否删除当前的数据吗?',
      icon: <ExclamationCircleOutlined/>,
      okType: 'danger',
      okText: formatMessage({id: 'common.yes'}),
      cancelText: formatMessage({id: 'common.no'}),
      onOk() {
        return new Promise((resolve: any) => {
          dispatch({
            type: 'matreialprodinfo/batchDeleteMaterialProdInfo',
            payload: {
              delId: `"${selectedRecord.prod_code}"`
            },
            callback: (res: any) => {
              resolve();
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("删除成功");
                if (onClose) onClose();
                if (actionRef.current) {
                  actionRef.current.reloadTable();
                }
              }
            },
          });
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      },
    });
  };

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'comp_type_str',
      'prod_code',
      'prod_name',
      'aid_name',
      'cls_code',
      'cls_name',
      'spec',
      'unit',
      'linear_meter',
      'prod_describe',
      'standard',
      'nps1',
      'nps2',
      'nps3',
      'material',
      'material_type',
      'unit_weight',
      'upload_ts_str',
      'owner_prod_code',
      'owner_prod_describe',
      'remark',
    ]);
    cols.tableColumns.forEach((item: any) => (item.title = formatMessage({id: item.title})));
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
      <Button type={'primary'} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
      <Button danger type={'primary'} onClick={() => handleDel()}>
        删除
      </Button>,
    ];
  };


  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="prod_code"
        title="物料信息详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      />
      {editVisible && (
        <EditModal
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
    </>
  );
};

export default connect()(ProdInfoDetail);
