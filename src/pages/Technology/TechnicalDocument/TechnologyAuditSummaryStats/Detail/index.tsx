import React from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import TechnologyBaseDataDetail from '../../TechnologyAuditSummary/Detail';

const TechnologyAuditSummaryStatsDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, authority, actionRef, callbackSuccess, dispatch } = props;

  return (
    <Modal
      title="详情"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      destroyOnClose
    >
      {selectedRecord && (
        <TechnologyBaseDataDetail
          open={open}
          onClose={onClose}
          selectedRecord={selectedRecord}
          authority={authority}
          actionRef={actionRef}
          callbackSuccess={callbackSuccess}
          dispatch={dispatch}
        />
      )}
    </Modal>
  );
};

export default connect()(TechnologyAuditSummaryStatsDetail);
