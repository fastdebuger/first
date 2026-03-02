import React, { useEffect } from "react";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";

import { configColumns } from "../columns";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 施工技术方案审批详情
 * @param props
 * @constructor
 */
const TechnologyBaseDataDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, dispatch } = props;

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
  }, []);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'up_wbs_name',
        'contract_out_name',
        'base_data_name',
        'approval_date',
        'level_str',
        'data_ts_str',
    ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [

    ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title={"施工技术方案审批"}
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        {/* <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="关联业务清单" key="1">
            自行追加与设备计费科目相关的业务清单
          </Tabs.TabPane>
        </Tabs> */}
      </CrudQueryDetailDrawer>
    </>
  );
};

export default connect()(TechnologyBaseDataDetail);




