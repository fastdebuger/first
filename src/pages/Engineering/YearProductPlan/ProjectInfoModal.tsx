import React, { useRef, useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect } from "umi";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { configColumns } from "@/pages/ScheduleManagement/BasicInfoManage/ProjectBasicInfo/columns";
import { BasicTableColumns } from "yayang-ui";
import { CloseCircleOutlined } from "@ant-design/icons";
import { getDefaultFilters } from "@/utils/utils"

let selectRecords: any[] = [];
/**
 * 项目信息选择弹窗组件（带搜索、表格、单选功能）
 * 用途：用于在表单中用项目中快速选择一个项目信息（合同编号）
 * @param props.value           当前已选中的合同对象（父组件控制）
 * @param props.handleChange    选择或清除后的回调函数，参数为选中记录或 null
 */
const ProjectInfoModal: React.FC<any> = (props: any) => {
  const { value, handleChange, dataSource: addedDataSource, disabled, form } = props;
  const childRef: any = useRef();
  // 控制项目信息
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    addedDataSource?.map((item: any) => item.id) || []
  );
  /**
   * 获取表格需要的列配置
   * 使用 yayang-ui 的 BasicTableColumns 工具类动态生成列
   * @returns 配置好的列数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'project_name', // 
      "report_project_status_name", // 项目状态（按新开工、按在执行、按完工、按累计执行、按计划完工）
      'contract_start_date_format', //合同开工日期
      'contract_end_date_format', // 合同完工日期
      'actual_start_date',
      'plan_finish_date',
      'contract_mode_name', // 合同类型
      // 项目等级
      'contract_say_price', //合同金额（含税）
      "construction_dep", // 建设单位
      //  审批状态
      // 'flow_status',
      // 	录入日期
      'create_user_name',
      // 	录入日期
      'create_ts_format',
      'modify_user_name',
      // 修改时间
      'modify_ts_format',
    ])
    .setTableColumnToDatePicker([
      { value: 'actual_start_date', valueType: 'dateTs' },
      { value: 'plan_finish_date', valueType: 'dateTs' },
    ])
    return cols.getNeedColumns();
  };
  /**
     * 自定义表格上方的按钮工具栏（固定在右上角）
     * @param reloadTable 表格刷新函数（本组件未使用）
     * @returns React 节点数组
     */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space
        style={{
          position: 'fixed',
          right: 0,
          top: '0',
          transform: 'translate(-10%, 30%)',
          zIndex: 10,
        }}
      >
        <Button
          type={"primary"}
          onClick={() => {
            // 校验：必须选中一条记录
            if (!selectRecords.length) {
              message.warning("请至少选择一条数据");
              return
            }
            // 去重：排除已经添加过的合同（防止重复添加）
            const filterArr = selectRecords.filter((item: any) => {
              return addedDataSource.findIndex((item2: any) => item2.id === item.id) === -1;
            })
            // 回调父组件，将选中的合同对象传回去
            handleChange(filterArr[0]);
            // 关闭弹窗
            setIsVisible(false);
          }}
        >提交</Button>
        <Button onClick={() => setIsVisible(false)}>取消</Button>
      </Space>
    ]
  }

  /**
   * 当用户在表格中勾选或取消勾选时触发
   *
   * @param keys          当前所有选中的 rowKey 数组
   * @param selectedRows  当前所有选中的完整行数据数组
   *   - 不允许取消已添加合同的选中状态（只能在主表中删除）
   *   - 只能新增选择，不能反选已存在的
   */
  const handleSelectionChange = (keys: React.Key[], selectedRows: any[]) => {
    const addedBfCodes = addedDataSource?.map((item: any) => item.id) || [];

    // 计算新增的keys（不在已添加数据中的）
    const newKeys = keys.filter(key => !addedBfCodes.includes(key));

    // 计算需要移除的keys（在已添加数据中但未被选中的）
    const removedKeys = addedBfCodes.filter((key: React.Key) => !keys.includes(key));
    // 如果用户试图取消已添加合同的选中 → 拦截并提示
    if (newKeys) {
      const updatedKeys = [
        ...addedBfCodes,
        ...newKeys
      ];
      setSelectedRowKeys(updatedKeys);

    } else {
      message.info('请在表体中删除');
      setSelectedRowKeys(removedKeys);

    }
    selectRecords = selectedRows
  };

  return (
    <>
      <Button
        type='dashed'
        block
        style={{ position: "relative" }}
        disabled={disabled}
        onClick={() => {
          // 清空上次打开的选择的数据
          selectRecords = [];
          setIsVisible(true);
        }}
      >
        {/* 显示当前已选项目编号（文本截断 + 省略号） */}
        <span style={{
          'width': '90%', /* 必须设置宽度 */
          'whiteSpace': 'nowrap', /* 禁止换行 */
          'overflow': 'hidden', /* 隐藏溢出内容 */
          'textOverflow': 'ellipsis', /* 显示省略号 */
        }}>{value ? value : '请选择项目信息'}</span>
        {/* 清除按钮（小叉号） */}
        <CloseCircleOutlined
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            transform: "translate(-50%, 55%)"
          }}
          onClick={(event: any) => {
            event.stopPropagation();     // 阻止触发打开弹窗
            handleChange(null);          // 清空父组件选中值
            setSelectedRowKeys([]);      // 清空表格选中状态
          }}
        />
      </Button>
      {
        isVisible && (
          <Modal
            title={"请选择项目信息"}
            visible={isVisible}
            onCancel={() => setIsVisible(false)}
            closable={false}
            destroyOnClose={true}
            width={'100vw'}
            style={{
              top: 0,
              maxWidth: '100vw',
              paddingBottom: 0,
              maxHeight: '100vh',
              overflow: 'hidden',
            }}
            bodyStyle={{ height: 'calc(100vh - 35px)', marginTop: '-20px' }}
            footer={null}
          >
            <BaseCurdSingleTable
              cRef={childRef}
              rowKey="project_id"
              funcCode={'getProjectBaseInfoList1'}
              height={'calc(100vh - 340px)'}
              type="basicInfo/getProjectBaseInfoList"
              tableColumns={getTableColumns()}
              tableSortOrder={{ sort: "project_id", order: "desc" }}
              renderDropMenuToolbar={() => <></>}
              buttonToolbar={renderButtonToolbar}
              selectedRowsToolbar={() => []}
              tableDefaultField={{
                queryAlternativeInfo: 1,
                belong_year: form?.getFieldValue('belong_year') || undefined
              }}
              tableDefaultFilter={[
                ...getDefaultFilters(),
                // { Key: 'report_project_status', Val: '2', Operator: '=' },
              ]}
              rowSelection={{
                type: "radio",
                selectedRowKeys,
                callback: handleSelectionChange,
              }}
            />
          </Modal>
        )
      }
    </>

  )
}

export default connect()(ProjectInfoModal);
