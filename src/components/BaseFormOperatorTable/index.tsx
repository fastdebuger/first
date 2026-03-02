import React, { useEffect, useState } from 'react';
import { BasicFormOperatorTable } from 'qcx4-components';
import { useIntl } from 'umi';
import { getFinalTableColumns } from "@/utils/utils";
import './index.less';
import { deepArr } from "@/utils/utils-array";
import { message, Spin } from "antd";
import { connect } from "dva";
import { ConnectProps } from "@@/plugin-dva/connect";

interface BaseFormOperatorTablePropsI extends Pick<ConnectProps, 'dispatch'> {
  cRef: any; // 控制子组件的暴露给父组件的方法
  /** 表格上的工具组件渲染方法，返回的是一个数组，可以返回一个按钮数组，两个参数：handleAdd: 新增一行， handleBatchAdd: 新增批量数据*/
  toolBarRender: (
    handleAdd: (selfRow?: any) => void,
    handleBatchAdd: (addDataSource: any[]) => void,
    form: any,
  ) => any[];
  /** 表单的初始化值 */
  initFormValues: any;
  /** 表单列的列表*/
  formColumns: any[];
  /** 表格列的选择列表*/
  tableColumns: any[];
  /** 初始化数据*/
  initDataSource: any[];
  /** 点击右下角的 提交 按钮 会把对表格操作的一些数据返回，form: 表单的值，addItems: 新增的行，editItems：编辑的行，delItems: 删除的行， dataSource: 新增修改删除之后的数据，oldDataSource： 原始的数据*/
  callbackCommitData?: ({ form, addItems, editItems, delItems, dataSource, oldDataSource, }: {
    form: any;
    addItems: any;
    editItems: any;
    delItems: any;
    dataSource: any;
    oldDataSource: any;
  }) => void | undefined;
  form?: any;
  /** 提交按钮的loading事件 */
  commitButtonLoading?: boolean;
  pagination?: any;
  scroll?: any;
  formProps?: any,
  renderSelfOperatorTableCell?: (
    dataSource: any,
    updateLoadDataSource: (changeDataSource: any) => void
  ) => any;
  /** 配置列需要的funcCode */
  funcCode: string;
}

/**
 * 用于表格的新增 和 编辑
 * @param props
 * @constructor
 */
const BaseFormOperatorTable: React.FC<BaseFormOperatorTablePropsI> = (props) => {
  const {
    cRef,
    dispatch,
    toolBarRender,
    initFormValues = {},
    formProps = {},
    formColumns = [],
    tableColumns = [],
    initDataSource = [],
    callbackCommitData,
    commitButtonLoading = false,
    pagination = { pageSize: 10 },
    scroll = { y: '100%' },
    renderSelfOperatorTableCell = undefined,
    funcCode = '',
  } = props;
  const { formatMessage } = useIntl();

  formColumns.map(item => item.title = formatMessage({ id: item.title }));
  tableColumns.map(item => item.title = formatMessage({ id: item.title }));

  const userCode = localStorage.getItem('auth-default-userCode');
  const outerUserObsCode = localStorage.getItem('MaterialOuterUser-obsCode')
  const [spinLoading, setSpinLoading] = useState(false);
  const [spinTip, setSpinTip] = useState('Loading...');
  const [settingCols, setSettingCols] = useState<any>([]);
  const [settingConfig, setSettingConfig] = useState<any>({});

  const getTableColumns = () => {
    const result = getFinalTableColumns(tableColumns);
    return result;
  }

  const fetchSettingCol = () => {
    setSpinTip('列配置加载中');
    if (dispatch) {
      dispatch({
        type: 'user/queryColViewConfig',
        payload: {
          sort: 'user_code',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'func_code', Val: funcCode, Operator: '=' },
            { Key: 'user_code', Val: userCode, Operator: '=' },
          ]),
        },
        callback: (res: any) => {
          if (res.rows && res.rows.length > 0) {
            setSettingConfig(res.rows[0]);
          } else {
            // 没查询出配置 赋值为空，激活useEffect的使用
            setSettingConfig({
              json_layout: '[]',
              json_layout1: '[]',
              json_layout2: '[]',
              json_layout3: '[]'
            });
          }
        }
      })
    }
  }

  useEffect(() => {
    if (settingConfig && funcCode) {
      const columns: any[] = getTableColumns();
      let jsonStr = '';
      try {
        jsonStr = settingConfig.json_layout3;
        if (jsonStr && jsonStr != '[]') { // 后台返回的数据有可能是空数组
          const jsonObj = JSON.parse(jsonStr);
          console.log('------config 0 jsonObj', jsonObj);
          const deepColumns: any[] = deepArr(columns);
          const resCols: any[] = jsonObj.changeColumns;
          console.log('-------resCols', resCols)
          // 第一步 存储最新的columns里的dataIndex 因为可能会出现后期多加列 或者 删除列的操作
          const originDataIndexCols = deepColumns.map(col => col.dataIndex);
          console.log('-----------originDataIndexCols', originDataIndexCols);
          // 第二步 需要判断后台存储的配置列是否都在最新的columns里
          const filterExistCols = resCols.filter(col => originDataIndexCols.includes(col.key));
          console.log('-----------filterExistCols', filterExistCols);
          // 第三步 过滤出 最新的columns不存在后台配置的列（比如 新增的列 要筛选出来）
          const filterExistColKeys = filterExistCols.map(col => col.key);
          const filterNoExistInResCols = deepColumns.filter(col => !filterExistColKeys.includes(col.dataIndex));
          console.log('-----------filterNoExistInResCols', filterNoExistInResCols);
          // 第四部 将新增加的列 追加到 配置列中
          const deepCols: any[] = deepArr(filterExistCols);
          if (filterNoExistInResCols.length > 0) {
            filterNoExistInResCols.forEach(col => {
              const findIndex = filterExistCols.findIndex(fc => fc.key === col.upDataIndex);
              if (findIndex > -1) {
                deepCols.splice(findIndex + 1, 0, { ...col });
              }
            })
          }
          const result: any = [];
          deepCols.forEach(s => {
            const findObj = deepColumns.find(c => c.key === s.key);
            if (findObj) {
              Object.assign(findObj, s);
              result.push(findObj)
            }
          });
          console.log('------result', result);
          console.log('-----------columns', columns);
          setSettingCols(result);
        } else {
          console.log('------no config 1', columns);
          setSettingCols(columns.sort((a, b) => a.serial_no - b.serial_no))
        }
      } catch (e) {
        console.log('------no config 2', columns);
        setSettingCols(columns.sort((a, b) => a.serial_no - b.serial_no))
      }
    }
  }, [settingConfig]);

  const saveColViewConfig = (type: string, config: any) => {
    if (!funcCode) return;
    setSpinLoading(true);
    setSpinTip('列配置加载中');
    if (dispatch) {
      dispatch({
        type: 'user/saveColViewConfig',
        payload: {
          func_code: funcCode,
          user_code: userCode,
          json_layout3: JSON.stringify(config || []),
        },
        callback: (res: any) => {
          if (res.errCode === 0) {
            message.success('配置列成功');
            fetchSettingCol();
            setSpinLoading(false);
          } else {
            message.warn('配置列失败');
            setSpinLoading(false);
          }

        }
      })
    }
  }

  useEffect(() => {
    if (funcCode) {
      fetchSettingCol()
    } else {
      const columns = getTableColumns();
      setSettingCols(columns)
    }
  }, [tableColumns])

  return (
    <Spin spinning={spinLoading} tip={spinTip}>
      <div id={'operatorTable'}>
        {settingCols.length > 0 && (
          <BasicFormOperatorTable
            cRef={cRef}
            formProps={formProps}
            toolBarRender={toolBarRender}
            initFormValues={outerUserObsCode ? {
              obs_code: outerUserObsCode,
              user_code: userCode,
              ...initFormValues
            } : initFormValues}
            formColumns={formColumns}
            tableColumns={settingCols}
            initDataSource={initDataSource}
            callbackCommitData={callbackCommitData}
            pagination={pagination}
            scroll={scroll}
            noSettingIcon={true}
            commitButtonLoading={commitButtonLoading}
            renderSelfOperatorTableCell={renderSelfOperatorTableCell}
            onResizeStop={(types: string, config: any) => {
              saveColViewConfig(types, config)
            }}
            onSettingColumnsChange={(types: string, config: any) => {
              saveColViewConfig(types, config)
            }}
            onResetSettingColumnsChange={(type: any, config: any, getConfigCols: any) => {
              const columns = getTableColumns();
              const changeColumns = getConfigCols(columns);
              Object.assign(config, {
                changeColumns
              })
              saveColViewConfig(type, config);
            }}
          />
        )}
      </div>
    </Spin>
  );
}

export default connect()(BaseFormOperatorTable);
