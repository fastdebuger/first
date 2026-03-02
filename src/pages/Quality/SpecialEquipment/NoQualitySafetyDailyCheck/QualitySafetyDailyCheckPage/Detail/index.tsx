import React, { useState } from "react";
import { configColumns } from "../columns";
import { BasicTableColumns, HeaderAndBodyTable } from "yayang-ui";
import QualitySafetyDailyCheckEdit from "../Edit";
import { connect, useIntl } from "umi";

const { CrudQueryDetailDrawer } = HeaderAndBodyTable;

/**
 * 特种设备每日不合格质量安全检查记录详情
 * @param props
 * @returns
 */
const QualitySafetyDailyCheckDetail: React.FC<any> = (props: any) => {
  const { open, onClose, selectedRecord, actionRef, title, special_equip_type } = props;
  const [editVisible, setEditVisible] = useState(false);
  const { formatMessage } = useIntl();

  const getTableColumns = () => {
    const cols: any = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'wbs_name',
      "preventive_measures",
      'control_process_name',
      'check_result',
      'handle_result',
      'quality_officer_name',
      'remark',
      "create_by_name",
      "create_date_str",
    ])
    cols.needColumns.forEach((item: any) => {
      Object.assign(item, { subTitle: formatMessage({ id: item.title }) })
    });
    return cols.getNeedColumns();
  };

  const renderButtonToolbar = () => {
    return [];
  };


  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title={title}
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
      </CrudQueryDetailDrawer>
      {editVisible && (
        <QualitySafetyDailyCheckEdit
          title={title}
          visible={editVisible}
          selectedRecord={selectedRecord}
          special_equip_type={special_equip_type}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </>
  )
}

export default connect()(QualitySafetyDailyCheckDetail);
