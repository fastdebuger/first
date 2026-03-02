import React, { useEffect, useState } from 'react';
import { Dispatch } from 'umi';
import { connect } from 'umi';
import { Button, Space } from 'antd';
import InfoCard, { ProjectRecord } from './InfoCard';
import IncomeInfoWbsNameModal from '../SelectIncome';

/**
 * PopulateCardWithData 组件 Props 接口
 */
interface PopulateCardWithDataProps {
  dispatch: Dispatch;
  onCardCancel: () => void;         // 移除或取消展示信息卡片的回调
  selectedRecord: null | { contract_income_id: number }; // 外部传入的初始记录对象
  onSelect: (values: ProjectRecord) => void;    // 选中数据后的回调，常用于同步数据到父组件
  infoConfigs: { value: string, label: string }[]; // 配置项数组，决定 InfoCard 展示哪些字段
  value?: string;
  operate?: 'add' | 'edit';
}

/**
 * 数据填充展示组件
 * 功能：根据传入的 contract_income_id 自动获取详情并展示卡片，或通过弹窗选择项目
 */
const PopulateCardWithData: React.FC<PopulateCardWithDataProps> = (props) => {
  const {
    selectedRecord = null,
    onSelect,
    onCardCancel,
    dispatch,
    operate = 'add'
  } = props;
  // 控制“选择项目”弹窗的显隐
  const [projectSelectionModalVisible, setProjectSelectionModalVisible] = useState(false);
  // 存储当前组件内用于展示的项目记录详情
  const [record, setRecord] = useState(null);

  /**
   * 初始化/依赖查询：
   * 编辑需要查询数据
   */
  useEffect(() => {
    // 如果参数不存在，则直接返回
    if (!selectedRecord?.contract_income_id) return

    dispatch({
      type: "income/getIncomeInfo",
      payload: {
        order: 'desc',
        sort: 'id',
        filter: JSON.stringify([
          { Key: 'id', Val: selectedRecord?.contract_income_id, Operator: '=' }
        ]),
      },
      callback: (res: { errCode: number; rows: any }) => {
        const flatData = res.rows;
        // 如果查询到数据，则更新本地 record 状态用于展示卡片
        if (flatData && flatData.length > 0) {
          setRecord(flatData[0]);
          // 开始编辑id是undefined 需要请求接口后手动触发一次选中效果
          onSelect(flatData[0]);
        } else {
          setRecord(null);
        }
      },
    });
  }, [selectedRecord?.contract_income_id]);

  return (
    <>
      {/*
          1. 如果存在 record 数据，则展示详细的信息展示卡片
          2. 如果没有数据，则展示一个按钮引导用户进行选择
      */}
      {
        record ? (
          <InfoCard
            operate={operate}
            record={record}           // 传递具体的记录数据
            setIncomeInfoWbsNameOpen={() => setProjectSelectionModalVisible(true)}
            handleCancel={() => {
              onCardCancel();         // 触发外部关闭回调
              setRecord(null);        // 清空本地数据状态
            }}
          />
        ) : (
          <Space>
            <Button
              type="dashed"
              style={{ width: 160 }}
              onClick={() => {
                setProjectSelectionModalVisible(true); // 打开选择弹窗
              }}
            >
              请选择一份主合同
            </Button>
          </Space>
        )
      }
      {/* 业务弹窗组件：用于从列表选择 WBS 项目定义
          采用受控方式管理显隐
      */}
      {projectSelectionModalVisible && (
        <IncomeInfoWbsNameModal
          visible={projectSelectionModalVisible}
          onCancel={() => setProjectSelectionModalVisible(false)} // 点击取消时直接关闭
          onSelect={(data: any) => {                      // 选中数据行的回调
            setProjectSelectionModalVisible(false);              // 关闭弹窗
            if (data) {
              setRecord(data);                            // 更新本地展示数据
              onSelect(data);                             // 同步给父组件
            }
          }}
        />
      )}
    </>
  );
};

export default connect()(PopulateCardWithData);
