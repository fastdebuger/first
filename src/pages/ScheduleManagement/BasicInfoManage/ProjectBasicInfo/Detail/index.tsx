import React, { useRef, useEffect } from "react";
import { useIntl, connect } from "umi";
import { Modal, Card, Tabs, Button, Space } from "antd";

import BasicInfo from "../Common/BasicInfo";
import ContractInfo from "../Common/ContractInfo";
import CostControlInfo from "../Common/CostControlInfo";
import HumanResource from "../Common/HumanResource";
import EquipmentInves from "../Common/EquipmentInves";
import '../Add/index.less';
/**
 * 编辑项目基本信息
 * @param props - 组件接收的props
 *  @param visible: 是否显示模态框 (必传)
 *  @param onCancel: 关闭模态框的回调函数 (必传)
 * @constructor
 */
const BasicProjectInfoDetail: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, selectedRecord } = props;

  const { formatMessage } = useIntl();

  // 创建Ref用于获取各Tab子组件的表单实例
  const basicInfoRef = useRef<any>(null); // 基础信息Tab的表单Ref
  const contractInfoRef = useRef<any>(null); // 合同信息Tab的表单Ref
  const costControlRef = useRef<any>(null); // 费控信息Tab的表单Ref
  const humanResourceRef = useRef<any>(null); // 人力资源Tab的表单Ref
  const equipmentInvesRef = useRef<any>(null); // 设备投入Tab的表单Ref

  useEffect(() => {
    if (!visible || !selectedRecord?.project_id) return;

    dispatch({
      type: 'basicInfo/getProjectBaseInfoDetail',
      payload: { project_id: selectedRecord.project_id },
      callback: (res: any) => {
        if (!res?.result) return;

        const data = res.result;

        const parsed = {
          baseInfo: data.baseInfo || {},
          contractInfo: data.contractInfo || {},
          financeCostInfo: data.financeCostInfo || {},
          humanResourceInputList: data.humanResourceInputList || [],
          equipmentResourceList: data.equipmentResourceList || [],
        };

        console.log('真实回填数据:', parsed); // 现在这里会打印出完整数据！

        // 转换 0/1 → 文字
        const displayBaseInfo = {
          ...parsed.baseInfo,
          region_category: parsed.baseInfo.region_category === 0 ? '国内' : '国外',
          owner_group: parsed.baseInfo.owner_group === 0 ? '集团内' : '集团外',
          is_related: parsed.baseInfo.is_related === 1 ? '是' : '否',
          is_guaranty: parsed.baseInfo.is_guaranty === 1 ? '是' : '否', 
          import_level: parsed.baseInfo.import_level?.split(','),
          contract_say_price: (Number(parsed.baseInfo?.contract_say_price) / 10000) || null,
          contract_un_say_price: (Number(parsed.baseInfo?.contract_un_say_price) / 10000) || null,
          project_level: parsed.baseInfo?.project_level_name,
          contract_mode: parsed.baseInfo?.contract_mode_name,
          sub_category: parsed.baseInfo?.sub_category_name,
          create_dep_code: parsed.baseInfo?.create_dep_name,
          report_dep_code: parsed.baseInfo?.report_dep_name,
          specialty_type: parsed.baseInfo?.specialty_type_str,

        };

        setTimeout(() => {
          basicInfoRef.current?.setFormData?.(displayBaseInfo);
          contractInfoRef.current?.setFormData?.(parsed.contractInfo);
          costControlRef.current?.setFormData?.(parsed.financeCostInfo);
          humanResourceRef.current?.setFormData?.(parsed.humanResourceInputList);
          equipmentInvesRef.current?.setFormData?.(parsed.equipmentResourceList);
        }, 300);
      },
    });
  }, [selectedRecord?.project_id]);

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
            {formatMessage({ id: 'base.user.list.detail' }) + formatMessage({ id: 'scheduleManagement.basicInfoMent' })}
          </span>
          <div className="modal-buttons">
            <Space>
              <Button onClick={onCancel}>
                关闭
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
          style={{ height: "100%" }}
        >
          {/* 基础信息 */}
          <Tabs.TabPane tab="基础信息" key="basic" forceRender={true}>
            <div className="scrollTabsContent">
              {/* 通过ref传递给子组件，使子组件能暴露getFormData方法 */}
              <BasicInfo ref={basicInfoRef} disabled={true} />
            </div>
          </Tabs.TabPane>
          {/* 合同信息 */}
          <Tabs.TabPane tab="合同信息" key="contract" forceRender={true}>
            <div className="scrollTabsContent">
              <ContractInfo ref={contractInfoRef} disabled={true} />
            </div>
          </Tabs.TabPane>
          {/* 费控信息 */}
          <Tabs.TabPane tab="费控信息" key="cost" forceRender={true}>
            <div className="scrollTabsContent">
              <CostControlInfo ref={costControlRef} disabled={true} />
            </div>
          </Tabs.TabPane>
          {/* 人力资源投入（全生命周期高峰期） */}
          <Tabs.TabPane tab="人力资源投入（全生命周期高峰期）" key="HR" forceRender={true}>
            <div className="scrollTabsContent">
              <HumanResource ref={humanResourceRef} disabled={true} />
            </div>
          </Tabs.TabPane>
          {/* 关键设备投入（全生命周期高峰期） */}
          <Tabs.TabPane tab="关键设备投入（全生命周期高峰期）" key="equipment" forceRender={true}>
            <div className="scrollTabsContent">
              <EquipmentInves ref={equipmentInvesRef} disabled={true} />
            </div>
          </Tabs.TabPane>

        </Tabs>
      </Card>
    </Modal>
  );
};

export default connect()(BasicProjectInfoDetail);
