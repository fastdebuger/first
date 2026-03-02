import React, { useState } from "react";
import { useIntl } from "umi";
import { Tabs, Empty } from "antd";
import CrudQueryDetailDrawer from "@/components/CrudQueryDetailDrawer";
import ApprovalIframeContent from "./ApprovalIframeContent";
import ApprovalButtons from "./ApprovalButtons";

interface ApprovalDrawerBetchProps {
  open: boolean;
  onClose: () => void;
  recordArray: {
    funcCode: string;
    id: string;
    number?: string;
    [key: string]: any;
  }[];
  system?: string;
  operationSuccess?: () => void;
  paramsData?: any;
}

const ApprovalDrawerBetch: React.FC<ApprovalDrawerBetchProps> = (props) => {
  const {
    open,
    onClose,
    recordArray = [],
    operationSuccess,
    system = "ZyyjIms",
    paramsData,
  } = props;
  const { formatMessage } = useIntl();
  const [activeKey, setActiveKey] = useState<string>(
    recordArray[0].audit_id || "",
  );

  const items = recordArray?.map((item, index) => {
    const currentInstanceId = item.instanceId;
    return {
      key: item.audit_id,
      label: `审批单 ${index + 1}`,
      children: (
        <div style={{ height: `calc(100vh - 200px)`, overflow: "hidden" }}>
          {currentInstanceId ? (
            <ApprovalIframeContent
              key={currentInstanceId}
              instanceId={currentInstanceId}
              businessId={item.audit_id}
              record={item}
              // betchApprovalData={recordArray}
              system={system}
              paramsData={paramsData}
              operationSuccess={operationSuccess}
            />
          ) : (
            <Empty description="未发起审批" />
          )}
        </div>
      ),
    };
  });

  return (
    <CrudQueryDetailDrawer
      rowKey="1"
      title={`${formatMessage({ id: "approval" })}${formatMessage({ id: "detail" })}`}
      columns={[]}
      open={open}
      onClose={onClose}
      selectedRecord={{}}
      buttonToolbar={() => []}
    >
      {recordArray?.length > 0 ? (
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={items}
          tabBarExtraContent={
            <ApprovalButtons
              selectedRows={recordArray}
              onRefresh={() => {
                if (operationSuccess) operationSuccess();
              }}
            />
          }
        />
      ) : (
        <Empty />
      )}
    </CrudQueryDetailDrawer>
  );
};

export default ApprovalDrawerBetch;
