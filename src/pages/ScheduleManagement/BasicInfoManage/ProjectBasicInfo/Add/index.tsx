import React, { useRef, useState } from "react";
import { useIntl, connect } from "umi";
import { Modal, Card, Tabs, Button, Space, message } from "antd";
import { ErrorCode } from "@/common/const";
import BasicInfo from "../Common/BasicInfo";
import ContractInfo from "../Common/ContractInfo";
import CostControlInfo from "../Common/CostControlInfo";
import HumanResource from "../Common/HumanResource";
import EquipmentInves from "../Common/EquipmentInves";
import './index.less';
/**
 * 新增项目基本信息
 * @param props - 组件接收的props
 *  @param visible: 是否显示模态框 (必传)
 *  @param onCancel: 关闭模态框的回调函数 (必传)
 * @constructor
 */
const BasicProjectInfoAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;

  const { formatMessage } = useIntl();

  // 控制当前激活的Tab，用来切换没有填写数据的tabs页
  const [activeTabKey, setActiveTabKey] = useState<string>("basic");
  // 创建Ref用于获取各Tab子组件的表单实例
  const basicInfoRef = useRef<any>(null); // 基础信息Tab的表单Ref
  const contractInfoRef = useRef<any>(null); // 合同信息Tab的表单Ref
  const costControlRef = useRef<any>(null); // 费控信息Tab的表单Ref
  const humanResourceRef = useRef<any>(null); // 人力资源Tab的表单Ref
  const equipmentInvesRef = useRef<any>(null); // 设备投入Tab的表单Ref
  const tabNameMap: Record<string, string> = {
    basic: "基础信息",
    contract: "合同信息",
    cost: "费控信息",
    HR: "人力资源投入（全生命周期高峰期）",
    equipment: "关键设备投入（全生命周期高峰期）"
  };

  /**
  * 提交表单处理函数
  * 1. 通过Ref获取所有Tab的表单数据
  * 2. 统一整理为提交格式
  * 3. 调用API提交数据
  * 4. 提交成功后关闭模态框
  */
  const handleSubmit = async () => {
    try {
      // 定义Tab页验证顺序
      const tabValidations = [
        { key: "basic", name: "基础信息", ref: basicInfoRef },
        { key: "contract", name: "合同信息", ref: contractInfoRef },
        { key: "cost", name: "费控信息", ref: costControlRef },
        { key: "HR", name: "人力资源投入（全生命周期高峰期）", ref: humanResourceRef },
        { key: "equipment", name: "关键设备投入（全生命周期高峰期）", ref: equipmentInvesRef }
      ];

      const validationErrors: Array<{tab: string, error: string}> = [];
      // 按顺序验证每个Tab
      for (const tab of tabValidations) {
        try {
          // 调用子组件的getFormData方法，该组件内部会调用form.validateFields()
          await tab.ref.current?.getFormData?.();
        } catch (error: any) {
          // 捕获子组件抛出的验证错误
          validationErrors.push({
            tab: tab.name,
            error: error.message || "表单验证失败"
          });
        }
      }
      // 如果有验证错误，提示用户
      if (validationErrors.length > 0) {
        // 切换到第一个有错误的Tab页
        const firstErrorTab = validationErrors[0];
        const errorTabKey = Object.keys(tabNameMap).find(key => 
          tabNameMap[key] === firstErrorTab.tab
        );
        if (errorTabKey) {
          setActiveTabKey(errorTabKey);
        }
        
        // 构建错误提示信息
        const errorTabs = validationErrors.map(err => err.tab).join("、");
        message.error({
          content: `以下Tab页数据未填写完整：${errorTabs}，请填写完整后再提交！`,
          duration: 3,
          style: {
            zIndex: 9999,
          },
        });
        return;
      }

      // 统一收集所有 Tab 数据
      const result = {
        baseInfo: await basicInfoRef.current?.getFormData?.() || {},
        contractInfo: await contractInfoRef.current?.getFormData?.() || {},
        financeCostInfo: await costControlRef.current?.getFormData?.() || {},
        humanResourceInputList: await humanResourceRef.current?.getFormData?.() || {},
        equipmentResourceList: await equipmentInvesRef.current?.getFormData?.() || [],
      };

      const transformedBaseInfo = {
        ...result.baseInfo,
        region_category: result.baseInfo.region_category === '国内' ? 0 : 1,
        owner_group: result.baseInfo.owner_group === '集团内' ? 0 : 1,
        is_related: result.baseInfo.is_related === '是' ? 1 : 0,
        import_level: result.baseInfo?.import_level?.join(','),
      };
  
      // 3. 组装最终提交数据
      const rawData = {
        ...result,
        baseInfo: transformedBaseInfo,
      };

      // 调用接口提交
      dispatch({
        type: 'basicInfo/addProjectBaseInfo',
        payload: {
          baseInfo: JSON.stringify(rawData.baseInfo),
          contractInfo: JSON.stringify(result.contractInfo),
          financeCostInfo: JSON.stringify(result.financeCostInfo),
          humanResourceInputList: JSON.stringify(result.humanResourceInputList),
          equipmentResourceList: JSON.stringify(result.equipmentResourceList),
        },
        callback: (res: any) => {
          if(res.errCode === ErrorCode.ErrOk){
            message.success("提交成功！");
            callbackSuccess?.();
          }
        }
      });

    } catch (err: any) {

      message.error("请您填写完整的基础信息");
      console.error(err);
    }
  };

  return (
    <Modal
      style={{
        maxWidth: '100vw',
        top: 0,
        paddingBottom: 0,
      }}
      closable={false} // 禁用右上角关闭按钮
      bodyStyle={{
        height: 'calc(100vh - 65px)', // 保留顶部标题栏高度
        overflowY: 'hidden',
      }}
      width={'100%'}
      title={
        <div className="custom-modal-header">
          <span className="modal-title">
            {formatMessage({ id: 'base.user.list.add' }) + formatMessage({ id: 'scheduleManagement.basicInfoMent' })}
          </span>
          <div className="modal-buttons">
            <Space>
              <Button type="primary" onClick={handleSubmit}>
                提交
              </Button>
              <Button onClick={onCancel}>
                取消
              </Button>
            </Space>

          </div>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Card style={{ height: "100%" }}>
        <Tabs
          type="card"
          activeKey={activeTabKey}
          style={{ height: "100%" }}
          onChange={(key) => setActiveTabKey(key)}
        >
          {/* 基础信息 */}
          <Tabs.TabPane tab="基础信息" key="basic" forceRender={true}>
            <div className="scrollTabsContent">
              {/* 通过ref传递给子组件，使子组件能暴露getFormData方法 */}
              <BasicInfo ref={basicInfoRef} />
            </div>
          </Tabs.TabPane>
          {/* 合同信息 */}
          <Tabs.TabPane tab="合同信息" key="contract" forceRender={true}>
            <div className="scrollTabsContent">
              <ContractInfo ref={contractInfoRef} />
            </div>
          </Tabs.TabPane>
          {/* 费控信息 */}
          <Tabs.TabPane tab="费控信息" key="cost" forceRender={true}>
            <div className="scrollTabsContent">
              <CostControlInfo ref={costControlRef} />
            </div>
          </Tabs.TabPane>
          {/* 人力资源投入（全生命周期高峰期） */}
          <Tabs.TabPane tab="人力资源投入（全生命周期高峰期）" key="HR" forceRender={true}>
            <div className="scrollTabsContent">
              <HumanResource ref={humanResourceRef} />
            </div>
          </Tabs.TabPane>
          {/* 关键设备投入（全生命周期高峰期） */}
          <Tabs.TabPane tab="关键设备投入（全生命周期高峰期）" key="equipment" forceRender={true}>
            <div className="scrollTabsContent">
              <EquipmentInves ref={equipmentInvesRef} />
            </div>
          </Tabs.TabPane>

        </Tabs>
      </Card>
    </Modal>
  );
};

export default connect()(BasicProjectInfoAdd);
