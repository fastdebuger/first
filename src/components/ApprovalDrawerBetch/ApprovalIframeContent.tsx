import { aimInstanceTask } from "@/services/backConfig/flow";
import { Spin } from "antd";
import React, { useEffect, useState, useMemo } from "react";

/**
 * 审批详情 Iframe 内容组件
 * 负责：
 * 获取当前实例的审批人状态；
 * 生成对应的审批/查看 URL；
 * 与 Iframe 跨域通信
 */
const ApprovalIframeContent: React.FC<{
  instanceId: string;
  businessId: string | number;
  record: any;
  system: string;
  paramsData: any;
  operationSuccess?: () => void;
}> = ({
  instanceId,
  businessId,
  record,
  system,
  paramsData,
  operationSuccess,
}) => {
  const [approvalUserData, setApprovalUserData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const userCode = localStorage.getItem("auth-default-userCode");

  useEffect(() => {
    setLoading(true);
    aimInstanceTask({ instanceId }).then((res) => {
      setApprovalUserData(res?.data?.rows || []);
      setLoading(false);
    });
  }, [instanceId]);

  const iframeSrc = useMemo(() => {
    if (!approvalUserData) return "";
    const isProd = process.env.NODE_ENV === "production";
    const port = "3232";

    const path = "instanceCpecc";

    const baseUrl = isProd
      ? `${window.location.origin}/micro/comp/base/backconfig/flow/approve/flow/${path}`
      : `${window.location.protocol}//${window.location.hostname}:${port}/micro/comp/base/backconfig/flow/approve/flow/${path}`;

    const urlObj = new URL(baseUrl);
    if (paramsData) {
      Object.entries(paramsData).forEach(([k, v]) => {
        if (v !== null && v !== undefined)
          urlObj.searchParams.append(k, String(v));
      });
    }
    return urlObj.toString();
  }, [approvalUserData, userCode, paramsData]);

  // 监听来自 Iframe 内部的消息并作出响应
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { source } = event.data;
      const iframe = document.getElementById(
        `iframe-${instanceId}`,
      ) as HTMLIFrameElement;
      const win = iframe?.contentWindow;
      if (!win) return;

      const approvalUser = approvalUserData?.find(
        (item) => item.assignee === userCode && item.status === 0,
      );

      if (source === "yayangflow") {
        win.postMessage(
          {
            source: "yayang",
            isHasApproval: !!approvalUser,
            taskId: approvalUser?.id || "",
            system,
            ...record,
            id: businessId,
            instanceId: instanceId,
            job: approvalUser?.name || "",
            currWbsCode: localStorage.getItem("auth-default-currWbsCode"),
          },
          "*",
        );
      }

      if (source === "yayangFlowLoadSuccess") {
        win.postMessage(
          {
            source: "yayangPutData",
            data: [
              {
                key: "auth-default-wbsCode",
                value: localStorage.getItem("auth-default-wbsCode"),
              },
              {
                key: "x-auth-token",
                value: localStorage.getItem("x-auth-token") || "",
              },
              { key: "auth-default-userCode", value: userCode },
            ],
          },
          "*",
        );
      }

      if (source === "yayangflowOperation" && operationSuccess) {
        setTimeout(operationSuccess, 2000);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    approvalUserData,
    instanceId,
    businessId,
    userCode,
    system,
    record,
    operationSuccess,
  ]);

  if (loading) return <Spin style={{ width: "100%", marginTop: 40 }} />;

  return (
    <iframe
      id={`iframe-${instanceId}`}
      src={iframeSrc}
      width="100%"
      height="100%"
      style={{ border: "none" }}
      title={`approval-frame-${instanceId}`}
    />
  );
};

export default ApprovalIframeContent;
