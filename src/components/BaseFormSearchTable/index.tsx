import React, {ReactNode, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useIntl} from 'umi';
import {message, Modal, Spin} from 'antd';
import {connect} from 'dva';
import {SingleTable} from 'qcx4-components';
import {showTS} from '@/utils/utils-date';
import {getApprovalTableColumns, getFinalTableColumns} from '@/utils/utils';
import './index.less';
import ErrorTable from "@/components/ErrorTable";
import {deepArr} from "@/utils/utils-array";

const {CrudQueryTable} = SingleTable;

// tslint:disable-next-line:interface-name
interface BaseFormSearchTableI {
  type: string;
  errType?: string;
  formColumns: any[];
  tableColumns: any[];
  errTableColumns?: any[];
  tableSortOrder: { sort: string; order: string };
  errTableSortOrder?: { sort: string; order: string };
  toolBarRender: (selectedRows: any) => any[];
  operator: any;
  errOperator?: any;
  rowKey: string;
  importType?: string;
  exportType?: string;
  cRef: any;
  tableDefaultField?: any;
  dispatch?: any;
  rowSelection?: any;
  tableTitle: () => ReactNode;
  tableTitleFilter?: any;
  dateCols?: string[]; // 配置哪些列是日期过滤的格式
  identityCols?: string[]; // 当前列的在数据库中的所有数据 一般用于当前列的 内容搜索 ['DevName', 'UnitName']
  footer?: any;
  sumCols?: string[];
  scroll?: any;
  moduleCaption?: string;
  rowClassName?: any;
  funcCode?: string;
  noSettingIcon?: boolean;
  height?: string;
  selectedRowsToolbar?: (selectedRows: any) => any[];
  ZYApprovalConfig:any,
  sticky:boolean
}

const BaseFormSearchTable: React.FC<BaseFormSearchTableI> = (props) => {
  const {
    type,
    formColumns,
    tableColumns,
    tableSortOrder,
    toolBarRender,
    operator,
    rowKey,
    importType,
    exportType,
    cRef,
    dateCols = [],
    tableDefaultField = undefined,
    rowSelection,
    tableTitle = undefined,
    errType,
    errTableColumns = [],
    errTableSortOrder,
    errOperator,
    identityCols = [],
    footer = undefined,
    rowClassName = undefined,
    sumCols = [],
    moduleCaption = '',
    scroll = sumCols && sumCols.length > 0 ? {y: 'calc(100vh - 320px)'} : {y: 'calc(100vh - 295px)'},
    funcCode = '',
    noSettingIcon = true,
    height = 'calc(100vh - 350px)',
    selectedRowsToolbar = undefined,
    ZYApprovalConfig=[],
    sticky=false
  } = props;
  const {dispatch} = props;
  const actionRef: any = useRef();
  // const [selectedRows, setSelectedRows] = useState([]);
  // console.log('-selectedRows', selectedRows);
  const [spinLoading, setSpinLoading] = useState(false);
  const [spinTip, setSpinTip] = useState('Loading...');
  const [exportField, setExportField] = useState({});
  // 后台返回一串代码去查询错误信息
  const [errVisible, setErrVisible] = useState<boolean>(false);
  const [rowsData, setRowsData] = useState<any>({});
  const [errDefaultField, setErrDefaultField] = useState<any>({});
  const [settingConfig, setSettingConfig] = useState<any>({});
  // 列配置
  const [settingCols, setSettingCols] = useState<any>([]);
  const [totalNum, setTotalNum] = useState<any>(0);

  const userCode = localStorage.getItem('auth-default-userCode')

  const {formatMessage} = useIntl();
  formColumns.map((item) => (item.title = formatMessage({id: item.title})));
  const getTableColumns = () => {
    // 业务表单 处理表单表格内时间的展示
    tableColumns.forEach((col) => {
      if (formatMessage({id: col.title})) {
        col.title = formatMessage({id: col.title})
      }
      //col.className=col.hideInTable?'tableHiddle':'tableShow'
      if (col.valueType && col.valueType === 'dateTs') {
        Object.assign(col, {
          render: (text: string) => {
            if (!text) {
              return <span>--</span>;
            }
            return <span>{showTS((Number(text)), col.format || 'YYYY-MM-DD')}</span>;
          },
        });
      }
    });
    console.log('----------tableColumns-', tableColumns);
     const result = getFinalTableColumns(getApprovalTableColumns(tableColumns.filter(c => !c.hideInTable)))
     console.log('----------result-', result);
     return result;
    // return tableColumns;
  }

  const fetchSettingCol = () => {
    dispatch({
      type: 'user/queryColViewConfig',
      payload: {
        sort: 'user_code',
        order: 'asc',
        filter: JSON.stringify([
          {Key: 'func_code', Val: funcCode, Operator: '='},
          {Key: 'user_code', Val: userCode, Operator: '='},
        ]),
      },
      callback: (res: any) => {
        if (res.rows && res.rows.length > 0) {
          setSettingConfig(res.rows[0]);
        } else {
          // 没查询出配置 赋值为空，激活useEffect的使用
          setSettingConfig({
            json_layout1: '[]',
            json_layout2: '[]',
            json_layout3: '[]'
          });
        }
      }
    })
  }

  useEffect(() => {
    if (settingConfig && funcCode) {
      const columns = getTableColumns()
      let jsonStr = '';
      try {
        jsonStr = settingConfig.json_layout;
        if (jsonStr && jsonStr != '[]') { // 后台返回的数据有可能是空数组
          const jsonObj = JSON.parse(jsonStr);
          const deepColumns: any[] = deepArr(columns);
          const resCols: any[] = jsonObj.changeColumns;
          // 第一步 存储最新的columns里的dataIndex 因为可能会出现后期多加列 或者 删除列的操作
          const originDataIndexCols = deepColumns.map(col => col.dataIndex);
          // 第二步 需要判断后台存储的配置列是否都在最新的columns里
          const filterExistCols = resCols.filter(col => originDataIndexCols.includes(col.key));
          // 第三步 过滤出 最新的columns不存在后台配置的列（比如 新增的列 要筛选出来）
          const filterExistColKeys = filterExistCols.map(col => col.key);
          const filterNoExistInResCols = deepColumns.filter(col => !filterExistColKeys.includes(col.dataIndex));
          // 第四部 将新增加的列 追加到 配置列中
          //const deepCols = deepArr(filterExistCols);
          const deepCols: any[] = filterExistCols;
          if (filterNoExistInResCols.length > 0) {
            filterNoExistInResCols.forEach(col => {
              const findIndex = filterExistCols.findIndex(fc => fc.key === col.upDataIndex);
              if (findIndex > -1) {
                deepCols.splice(findIndex + 1, 0, {...col});
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
          setSettingCols(result);
        } else {
          // console.log('------no config 1', columns);
          setSettingCols(columns.sort((a, b) => a.serial_no - b.serial_no))
        }
      } catch (e) {
        // console.log('------no config 2', columns);
        setSettingCols(columns.sort((a, b) => a.serial_no - b.serial_no))
      }
    }
  }, [settingConfig]);

  const saveColViewConfig = (_type: string, config: any) => {
    if (!funcCode) return;
    setSpinLoading(true);
    dispatch({
      type: 'user/saveColViewConfig',
      payload: {
        func_code: funcCode,
        user_code: userCode,
        json_layout: JSON.stringify(config || []),
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

  useEffect(() => {
    if (funcCode) {
      fetchSettingCol()
    } else {
      const columns = getTableColumns();
      setSettingCols(columns)
    }
  }, [tableColumns.length,ZYApprovalConfig.length])


  const request = async (page: any, filters: any, sorter: any, noFilters: any) => {
    // 列表查询 加此字段
    setExportField({
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,
    });
    const payload = {
      offset: page.offset,
      limit: page.limit,
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,
      identityCols: JSON.stringify(identityCols),
      sumCols: JSON.stringify(sumCols),
    }
    const response = await dispatch({
      type,
      payload
    });
    setRowsData(response)
    setTotalNum(response.total)
    return {
      data: response.rows || [],
      total: response.total || 0,
      status: 'success',
    };
  };

  const requestCellFilter = async (page: any, filters: any, sorter: any, col: any) => {

    // 列表查询 加此字段
    setExportField({
      ...sorter,
      filter: JSON.stringify(filters),
    });
    const payload = {
      ...sorter,
      ...tableDefaultField,
      offset: page.offset,
      limit: page.limit,
      op: 'colVal',
      opColName: col.dataIndex,
      filter: JSON.stringify(filters),
    }
    const response = await dispatch({
      type,
      payload
    });
    setTotalNum(response.total)
    return {
      data: response.rows || [],
      total: response.total || 0,
      status: 'success',
    };
  };

  /**
   * 下载导入模板
   * @funcCode
   */
  const downloadImportFile = (_funcCode: string) => {
    setSpinLoading(true);
    console.log(moduleCaption)
    setSpinTip('模版下载中......');
    dispatch({
      type: 'common/downloadImportFile',
      payload: {
        funcCode: _funcCode,
        moduleCaption: moduleCaption ? `${moduleCaption}模板` : '',
      },
      callback: (response: any) => {
        if (response && response.result && response.result.fileUrl) {
          window.open(response.result.fileUrl, '_self');
        }
        setSpinLoading(false);
      },
    });
  };
  /**
   * 导入文件
   * @param file
   * @param _funcCode
   * @param callback
   */
  const importFile = (file: any, _funcCode: string, callback: any = undefined) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('funcCode', _funcCode);
    console.log(_funcCode)
    setSpinLoading(true);
    setSpinTip('导入中......');
    dispatch({
      type: importType,
      payload: formData,
      callback: (response: any) => {
        setSpinLoading(false);
        if (response) {
          if (callback) {
            callback(response)
          } else {
            if (response.status === 'error' || response.errCode !== 0) {
              if (Object.prototype.toString.call(response.errText) === '[object String]') {
                // errText : '验证失败'  Json{fileUrl: ''}
                try {
                  const result = JSON.parse(response.errText);
                  if (result.fileUrl) {
                    Modal.confirm({
                      title: '导入失败，是否导出报告？',
                      content:
                        '点击确定，将导出报告,' + '\t\n点击取消，则不导出报告，详见-操作日志模块',
                      onOk() {
                        window.open(result.fileUrl, '_self');
                        actionRef.current.reloadTable();
                      },
                      onCancel() {
                        actionRef.current.reloadTable();
                      },
                    });
                  }
                } catch (err) {
                  message.error('上传失败');
                }
              }
            } else if (response && response.errCode === 0) {
              if (response && response.result && response.result.subDetailTbl) {
                setErrDefaultField({subDetailTbl: response.result.subDetailTbl})
                setErrVisible(true)
              }
              actionRef.current.reloadTable();
              message.success('上传成功');
            } else {
              actionRef.current.reloadTable();
              message.success('上传成功');
            }
          }
        }
      },
    });
  };
  /**
   * 导出的列过滤 和 列配置
   * 因为导出需要的格式是：DataIndex, Title的格式 需要转换一下
   * @param columns
   */
  const getFilterExportColumns = (columns: any[]) => {
    const arr: any[] = [];
    columns.forEach((column) => {
      if (column.export) {
        const obj = {
          DataIndex: column.dataIndex,
          Title: formatMessage({id: column.title}),// column.title,
        };
        arr.push(obj);
      }
    });
    return arr;
  };
  /**
   * exType 1: 单据明细  0：单据平铺
   * 导出
   */
  const exportFile = (exType: string) => {
    setSpinLoading(true);
    setSpinTip('导出中......');
    const exCols = getFilterExportColumns(getFinalTableColumns(tableColumns));
    dispatch({
      type: exportType,
      payload: {
        op: 'xlsx',
        exType,
        moduleCaption,
        exColBasis: JSON.stringify(exCols),
        ...exportField,
      },
      callback: (response: any) => {
        setSpinLoading(false);
        if (response && response.result && response.result.fileUrl) {
          window.open(response.result.fileUrl, '_blank');
        } else {
          message.error('生成导出文件有误，请稍后再试');
        }
      },
    });
  };


  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      // reloadTable 是暴露给父组件的用于刷新Table表格的方法
      importFile: (file: any, _funcCode: string, callback: any) => {
        importFile(file, _funcCode, callback);
      },
      exportFile: (exType: string) => {
        exportFile(exType);
      },
      downloadImportFile: (_funcCode: string) => {
        downloadImportFile(_funcCode);
      },
      reloadTable: (filters?: { Key: string, Val: string, Operator?: string }[], noFilters?: object) => {
        if (actionRef.current) {
          actionRef.current.reloadTable(filters, noFilters);
        }
      },
      onChangeSelectedRows: (selectedKeys: any, selectedRows: any) => {
        actionRef.current.onChangeSelectedRows(selectedKeys, selectedRows);
      },
    };
  });

  const findSumTitle = (val: any) => {
    return tableColumns.find(item => item.dataIndex === val).title
  }

  const getFootRender = () => {
    if (rowsData.sum && rowsData.total) {
      return (
        <div>
          <span>总条数 : </span><span>{rowsData.total}</span>
          {sumCols.map((item: any) => (
            <>
              <span
                style={{marginLeft: 10}}>{formatMessage({id: findSumTitle(item)})} : </span><span>{rowsData.sum[item]}</span>
            </>
          ))}
        </div>
      )
    }
    return null
  }

  const transferTableField = (arr: any[], obj: any) => {
    arr.forEach(k => {
      if (tableDefaultField.hasOwnProperty(k)) {
        Object.assign(obj, {
          [k]: tableDefaultField[k],
        })
      }

    })
    return obj;
  }

  const transferTableFilter = (key: string, arr: any[], result: any[]) => {
    arr.forEach(k => {
      if (tableDefaultField.hasOwnProperty(k)) {
        result.push({
          Key: k,
          Operator: key,
          Val: tableDefaultField[k] == undefined ? '' : tableDefaultField[k], // 这里不能强行忽略掉，会存在数据的问题
        })
      }
    })
  }

  /**
   * 将原有的 tableDefaultField 和 operator 处理成 新的Table表格 需要的 tableDefaultField
   */
  const getTableField = () => {
    const obj = {};
    if (tableDefaultField && operator) {
      if (Object.keys(tableDefaultField).length > 0) {
        for (const [key, val] of Object.entries(operator)) {
          if (key === 'noFilters') {
            transferTableField(val as any[], obj);
          }
        }
      }
    }
    return obj;
  }

  const getTableFilter = () => {
    const result: any[] = [];
    if (tableDefaultField && operator) {
      if (Object.keys(tableDefaultField).length > 0) {
        for (const [key, val] of Object.entries(operator)) {
          if (key !== 'noFilters') {
            transferTableFilter(key, val as any[], result);
          }
        }
      }
    }
    return result;
  }
  console.log('------settingCols', settingCols)
  return (
    <Spin spinning={spinLoading} tip={spinTip}>
      <div style={{backgroundColor: '#fff'}}>
        {settingCols.length > 0 && (
          <CrudQueryTable
            sticky={sticky}
            cRef={actionRef}
            height={height}
            tableTitle={tableTitle}
            noSettingIcon={noSettingIcon}
            columns={settingCols}
            requestHeader={request}
            requestCellFilter={requestCellFilter}
            // sortOrder={tableSortOrder}
            headerConfig={{
              // sort: 'FormDate', order: 'desc',
              ...tableSortOrder,
              rowKey: rowKey || 'rownumber'
            }}
            // operator={operator}
            renderSelfToolbar={toolBarRender}
            selectedRowsToolbar={selectedRowsToolbar}
            tableDefaultField={getTableField()}
            tableDefaultFilter={getTableFilter()}
            rowSelection={rowSelection}
            scroll={scroll}
            footer={rowsData && rowsData.sum ? getFootRender : footer}
            rowClassName={rowClassName}
            onResizeStop={(types: string, config: any) => {
              saveColViewConfig(types, config)
            }}
            onSettingColumnsChange={(types: string, config: any) => {
              saveColViewConfig(types, config)
            }}
            onResetSettingColumnsChange={(_type, config, getConfigCols) => {
              const columns = getTableColumns();
              const changeColumns = getConfigCols(columns);
              Object.assign(config, {
                changeColumns
              })
              saveColViewConfig(_type, config);
            }}
          />
        )}
      </div>
      {errVisible && (
        <Modal width='80%' title={formatMessage({id: 'common.import.error.tip'})}
               footer={null}
               visible={errVisible}
               onCancel={() => {
                 setErrVisible(false)
               }}>
          <ErrorTable
            operator={errOperator}
            type={errType}
            rowKey={rowKey}
            tableDefaultField={errDefaultField}
            tableColumns={getFinalTableColumns(errTableColumns)}
            tableSortOrder={errTableSortOrder}/>
        </Modal>
      )}
    </Spin>
  );
};

export default connect()(BaseFormSearchTable);
