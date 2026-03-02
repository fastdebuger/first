import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { history, connect } from 'umi';
import { ErrorCode, PROP_KEY, WELDER_EQUIPMENT_TYPE_OPTIONS } from "@/common/const";

/**
 * 发起审批按钮组件
 * 质量管理模块中发起年审，复审使用，
 * 用来新增审批，如果审批中没有这个月份的话
 */
const InitiateApprovalButton: React.FC<any> = (props) => {
  const {
    actionRef, // 用于调用外部表格得加载方法
    defaultYear, // 默认的年份
    defaultMonth, // 默认的月份
    equipmentType, // 特种设备类别得值 （只有焊工业绩的模块有这个值）

    halfYear, // 当前年份：上半年、下半年
    startType, // 查询审批数据接口
    pathName, // 跳转路径
    approvalType, // 增加审批数据接口
    disabled = false,
    dispatch
  } = props;

  // 按钮加载状态
  const [loading, setLoading] = useState(false);

  /**
   * 获取弹窗提示内容
   * @param isSuccess 是否为成功提示
   * @returns 提示内容字符串
   */
  const getModalContent = (isSuccess: boolean = false) => {
    const actionText = isSuccess ? '已成功发起审批' : '已经发起审批了';
    
    if (equipmentType && halfYear) { // 特种设备类别和阶段都 有值
      const halfYearText = halfYear === '2' ? '下半年' : '上半年';
      return `您${defaultYear}-${halfYearText}-${WELDER_EQUIPMENT_TYPE_OPTIONS[equipmentType]?.label}-${actionText}，是否去审批页面查看？`;
    } else if (defaultMonth) {
      return `您${defaultYear}-${defaultMonth}月${actionText}，是否去审批页面查看？`;
    } else {
      return `您${defaultYear}年${actionText}，是否去审批页面查看？`;
    }
  };

  /**
 * 处理发起审批点击事件的函数
 * @returns void
 */
  const handleClick = () => {
    setLoading(true);
    // 准备请求参数
    const payload: any = {
      year: defaultYear,
    };
    // 根据是否有 halfYear 来决定参数结构
    if (halfYear && equipmentType) {
      // 半年度逻辑，不传递月份字段
      payload.year_stage = halfYear;
      payload.equipment_type = equipmentType;

    } else if(defaultMonth){
      // 月度逻辑
      payload.month = defaultMonth;
    } else {
      // 年度逻辑，不传递月份字段
    }

    dispatch({
      type: startType,
      payload,
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          // 当前月份是否已经发起审批了，如果为 false的话则需要发起审批
          if (res.result.isStart) {
            // 跳转到审批页面，传递参数
            Modal.confirm({
              title: '提示',
              content: getModalContent(false),
              okText: '确定',
              cancelText: '取消',
              onOk: () => {
                // 用户点击确定后跳转到审批页面
                history.push({
                  pathname: pathName,
                  query: payload
                });
              },
              onCancel: () => { setLoading(false); }
            });
          } else {
            // 如果为 false的话则需要发起审批
            dispatch({
              type: approvalType,
              payload: {
                sort: 'id',
                order: 'asc',
                ...payload,
              },
              callback: (res: any) => {
                if (res.errCode === ErrorCode.ErrOk) {
                  if (actionRef.current) {
                    actionRef.current.reloadTable();
                  }
                  Modal.success({
                    title: '成功',
                    content: getModalContent(true),
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                      // 用户点击确定后跳转到审批页面
                      history.push({
                        pathname: pathName,
                        query: payload
                      });
                    },
                    onCancel: () => { setLoading(false); }
                  });

                }
              }
            })
          }
        }

      }
    })
  }


  return (
    <>
      {
        PROP_KEY === 'dep' && (
          <Button
            type={'primary'}
            loading={loading}
            disabled={disabled}
            onClick={handleClick}
          >
            发起审批
          </Button>
        )
      }
    </>

  );
};

export default connect()(InitiateApprovalButton);