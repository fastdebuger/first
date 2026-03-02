import React from 'react';
import { Modal } from 'antd';
import TechnologyBaseDataDetail from '../../TechnologyAuditQuality/Detail';

const TechnologyAuditQualityStatsDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, authority, actionRef, callbackSuccess } = props;

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
          selectedRecord={selectedRecord}
          authority={authority}
          actionRef={actionRef}
          callbackSuccess={callbackSuccess}
        />
      )}
    </Modal>
  );
};

export default TechnologyAuditQualityStatsDetail;

