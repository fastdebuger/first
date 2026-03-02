import type { ReactNode } from "react"
import type { Dispatch } from 'umi';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { HeaderAndBodyTable } from 'yayang-ui';
import { useIntl } from 'umi';
import { message, Spin } from 'antd';
import { connect } from 'umi';
import { isDateFormatOrTimeStamp } from '@/utils/utils-date';
import { deepArr } from '@/utils/utils-array';

type RadioButtonType = 'header' | 'split' | 'scan' | 'noRadio';

interface BaseHeaderAndBodyTablePropI {
  /** ref 操控表格内的一些方法 比如;reloadTable 刷新表格 */
  cRef?: any;
  height: any,
  /** 表头的配置查询 导入 导出 */
  header: {
    type: string;
    sort: string;
    order: string;
    rowKey: string;
    importType?: string;
    exportType?: string;
    sumCols?: string[];
  };
  /** 表体的配置查询 导入 导出 */
  body: {
    type: string;
    sort: string;
    order: string;
    rowKey: string;
    importType?: string;
    exportType?: string;
    left: {
      height?: number | string;
      searchKey?: string;
      showColumns?: string[];
    };
    right?: {
      title?: (record: any) => ReactNode;
    };
    sumCols?: string[];
  };
  /** 平铺的配置查询 导入 导出 */
  scan: {
    type: string;
    sort: string;
    order: string;
    rowKey: string;
    importType?: string;
    exportType?: string;
    sumCols?: string[];
  };
  /** 请求dispatch */
  dispatch: Dispatch;
  /** 表格列 */
  tableColumns: any[];
  /** 左上角的标题 */
  tableTitle: string;
  /** 右上角 按钮组的显示 */
  buttonToolbar: () => any[];
  /** 批量选中行之后的需要执行的按钮操作 */
  selectedRowsToolbar: () => {
    headerToolbar: (
      selectedRows?: any[],
      reloadTable?: (
        filters?: { Key: string; Val: string; Operator?: string }[],
        noFilters?: any,
      ) => void,
    ) => any[];
    scanToolbar: (
      selectedRows?: any[],
      reloadTable?: (
        filters?: { Key: string; Val: string; Operator?: string }[],
        noFilters?: any,
      ) => void,
    ) => any[];
  };
  /** 筛选位置的 Toolbar 自定义显示组件 */
  renderSelfToolbar?: any;
  tableDefaultField?: any;
  tableDefaultFilter?: any;
  funcCode: string;
  scroll: any;
  defaultPageSize: any;
  tableDefaultFields: any;
  /** 模块名称 下载时的文件显示的名字 */
  caption: string;
  renderNoticeToolbar?: any;
  footer?: any;
  onDataSourceChange?: (dataSource: any) => void; // 监听DataSource变化
}

const { CrudQueryTable } = HeaderAndBodyTable;

const BaseHeaderAndBodyTable: React.FC<BaseHeaderAndBodyTablePropI> = (props) => {
  const {
    cRef,
    header = {
      type: '',
      sort: 'FormNo',
      order: 'asc',
      rowKey: 'FormNo',
      importType: '',
      exportType: '',
    },
    body = {
      type: '',
      sort: 'ProdCode',
      order: 'asc',
      rowKey: 'ProdKey',
      importType: '',
      exportType: '',
      left: {
        height: '200px',
        searchKey: '',
        showColumns: [],
      },
    },
    scan = {
      type: '',
      sort: 'FormNo',
      order: 'asc',
      rowKey: 'rownumber',
      importType: '',
      exportType: '',
    },
    dispatch,
    tableColumns,
    tableTitle = '',
    buttonToolbar = () => [],
    selectedRowsToolbar = () => {
      return {
        headerToolbar: () => [],
        scanToolbar: () => [],
      };
    },
    renderSelfToolbar = () => { },
    renderNoticeToolbar = undefined,
    tableDefaultField = {},
    tableDefaultFilter = [],
    funcCode = '',
    height = 'calc(100vh - 159px)',
    scroll = { y: 'calc(100vh - 339px)' },
    defaultPageSize = 20,
    caption = '下载文件',
    footer = undefined,
    onDataSourceChange= undefined,
  } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  const [exportField, setExportField] = useState({});
  const [spinLoading, setSpinLoading] = useState(false);
  const [spinTip, setSpinTip] = useState('Loading...');
  const [exportType, setExportType] = useState<string | undefined>(header.exportType || '');
  const [importType, setImportType] = useState<string | undefined>(header.importType || '');
  const [settingCols, setSettingCols] = useState<any>([]);
  const [radioType, setRadioType] = useState<RadioButtonType>('header');
  const userCode = localStorage.getItem('auth-default-userCode');
  const [rowsData, setRowsData] = useState<any>({});

  const [settingConfig, setSettingConfig] = useState<any>({});
  const getTableColumns = () => {
    tableColumns.forEach((item: any) => {
      item.title = formatMessage({ id: item.title });
      if (item.valueType && item.valueType === 'dateTs') {
        Object.assign(item, {
          // isChecked: true,
          render: (text: any) => {
            if (!text) {
              return <span>--</span>;
            }
            return <span>{isDateFormatOrTimeStamp(text, item.format)}</span>;
          },
        });
      }
    });
    return tableColumns;
  };

  const fetchSettingCol = () => {
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
            json_layout1: '[]',
            json_layout2: '[]',
            json_layout3: '[]',
            json_layout: '[]',
          });
        }
      },
    });
  };

  useEffect(() => {
    if (funcCode) {
      fetchSettingCol();
    } else {
      const columns = getTableColumns();
      setSettingCols(columns);
    }
  }, []);

  const getShowColumns = () => {
    const columns: any[] = getTableColumns();
    if (radioType === 'header') {
      return columns.filter((col) => col.header);
    } else if (radioType === 'split') {
      return columns;
    } else if (radioType === 'scan') {
      return columns;
    }
    return [];
  };

  const getExportShowColumns = () => {
    const columns: any[] = getTableColumns();

    if (radioType === 'header') {
      return columns.filter((col) => col.header);
    } else if (radioType === 'split') {
      return columns.filter((col) => col.body);
    } else if (radioType === 'scan') {
      return columns;
    }
    return [];
  };

  useEffect(() => {
    if (settingConfig && funcCode) {
      const columns: any[] = getShowColumns();
      let jsonStr = '';
      try {
        if (radioType === 'header') {
          jsonStr = settingConfig.json_layout1;
        } else if (radioType === 'split') {
          jsonStr = settingConfig.json_layout2;
        } else if (radioType === 'scan') {
          jsonStr = settingConfig.json_layout3;
        }
        if (jsonStr && jsonStr != '[]') {
          // 后台返回的数据有可能是空数组
          const jsonObj = JSON.parse(jsonStr);
          const deepColumns = deepArr(columns);
          const resCols: any[] = jsonObj.changeColumns;
          // 第一步 存储最新的columns里的dataIndex 因为可能会出现后期多加列 或者 删除列的操作
          const originDataIndexCols = deepColumns.map((col: { dataIndex: any }) => col.dataIndex);
          // 第二步 需要判断后台存储的配置列是否都在最新的columns里
          const filterExistCols = resCols.filter((col) => originDataIndexCols.includes(col.key));
          // 第三步 过滤出 最新的columns不存在后台配置的列（比如 新增的列 要筛选出来）
          const filterExistColKeys = filterExistCols.map((col) => col.key);
          const filterNoExistInResCols = deepColumns.filter(
            (col: { dataIndex: any }) => !filterExistColKeys.includes(col.dataIndex),
          );
          // 第四部 将新增加的列 追加到 配置列中
          const deepCols = deepArr(filterExistCols);
          if (filterNoExistInResCols.length > 0) {
            filterNoExistInResCols.forEach((col: { upDataIndex: any }) => {
              const findIndex = filterExistCols.findIndex((fc) => fc.key === col.upDataIndex);
              if (findIndex > -1) {
                deepCols.splice(findIndex + 1, 0, { ...col });
              }
            });
          }
          const result: any[] = [];
          deepCols.forEach((s: { key: any }) => {
            const findObj = deepColumns.find((c: { key: any }) => c.key === s.key);
            if (findObj) {
              Object.assign(findObj, s);
              result.push(findObj);
            }
          });
          setSettingCols(result);
        } else {
          setSettingCols(columns.sort((a, b) => a.serial_no - b.serial_no));
        }
      } catch (e) {
        setSettingCols(columns.sort((a, b) => a.serial_no - b.serial_no));
      }
    }
  }, [radioType, settingConfig]);

  const saveColViewConfig = (type: string, config: any) => {
    if (!funcCode) return;
    setSpinLoading(true);
    dispatch({
      type: 'user/saveColViewConfig',
      payload: {
        func_code: funcCode,
        user_code: userCode,
        json_layout1: JSON.stringify(type === 'header' ? config : []),
        json_layout2: JSON.stringify(type === 'split' ? config : []),
        json_layout3: JSON.stringify(type === 'scan' ? config : []),
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
      },
    });
  };

  const requestCellFilter = async (page: any, filters: any, sorter: any, col: any) => {
    setExportField({
      ...sorter,
      filter: JSON.stringify(filters),
    });
    setImportType(header.importType);
    setExportType(header.exportType);
    if (!header.type) {
      message.warning('表头查询未传type内容');
    }
    const payload = {
      ...sorter,
      op: 'colVal',
      opColName: col.dataIndex,
      filter: JSON.stringify([...filters, ...tableDefaultFilter]),
    };
    if (page) {
      Object.assign(payload, { offset: page.offset, limit: page.limit });
    }
    const response = await dispatch({
      type: radioType === 'header' ? header.type : scan.type,
      payload,
    });
    return {
      data: response.rows || [],
      total: response.total || 0,
      status: 'success',
    };
  };

  const requestHeader = async (page: any, filters: any, sorter: any, noFilters: any) => {
    setExportField({
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,
    });
    setImportType(header.importType);
    setExportType(header.exportType);
    if (!header.type) {
      message.warning('表头查询未传type内容');
    }
    const payload = {
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,

      // identityCols: JSON.stringify(identityCols),
    };
    if (header.sumCols) {
      Object.assign(payload, {
        sumCols: JSON.stringify(header.sumCols),
      })
    }
    if (page) {
      Object.assign(payload, { offset: page.offset, limit: page.limit });
    }
    const response = await dispatch({
      type: header.type,
      payload,
    });
    setRowsData(response)
    // 通知父组件数据已更新
    if (onDataSourceChange) {
      onDataSourceChange(response);
    }
    return {
      data: response.rows || [],
      total: response.total || 0,
      status: 'success',
    };
  };

  const requestBody = async (page: any, filters: any, sorter: any, noFilters: any) => {
    // 列表查询 加此字段
    setExportField({
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,
    });
    setImportType(body.importType);
    setExportType(body.exportType);
    if (!body.type) {
      message.warning('表头查询未传type内容');
    }
    const payload = {
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,
      // identityCols: JSON.stringify(identityCols),
    };
    if (body.sumCols) {
      Object.assign(payload, {
        sumCols: JSON.stringify(body.sumCols),
      })
    }
    if (page) {
      Object.assign(payload, { offset: page.offset, limit: page.limit });
    }
    const response = await dispatch({
      type: body.type,
      payload,
    });
    setRowsData(response)
    return {
      data: response.rows || [],
      total: response.total || 0,
      status: 'success',
    };
  };

  const requestScan = async (page: any, filters: any, sorter: any, noFilters: any) => {
    // 列表查询 加此字段
    setExportField({
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,
    });
    setImportType(scan.importType);
    setExportType(scan.exportType);
    if (!scan.type) {
      message.warning('表头查询未传type内容');
    }
    const payload = {
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,
      // identityCols: JSON.stringify(identityCols),
    };
    if (scan.sumCols) {
      Object.assign(payload, {
        sumCols: JSON.stringify(scan.sumCols),
      })
    }
    if (page) {
      Object.assign(payload, { offset: page.offset, limit: page.limit });
    }
    const response = await dispatch({
      type: scan.type,
      payload,
    });
    setRowsData(response)
    return {
      data: response.rows || [],
      total: response.total || 0,
      status: 'success',
    };
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
          Title: formatMessage({ id: column.title }),
        };
        arr.push(obj);
      }
    });
    return arr;
  };

  /**
   * 导入
   * @param file
   * @param funcCode
   * @param callback
   * @param typeCode
   * @param formData
   */
  const importFile = (file: any, funcCode: any, callback: any, typeCode?: string,  formData?: any,) => {
    if (!importType) {
      message.warn('导入的请求URL未配置');
      return;
    }
    const _formData = formData || new FormData();
    const devCode = localStorage.getItem('auth-cpecc-selected-devCode');
    _formData.append('file', file);
    _formData.append('funcCode', funcCode);
    if (typeCode) {
      formData.append('type_code', typeCode);
    }

    return new Promise<boolean>((resolve) => {
      dispatch({
        type: importType,
        payload: formData,
        callback: (res: any) => {
          if (res && res.errCode === 0) {
            message.success('上传成功');
            actionRef.current.reloadTable();
            if (callback) {
              callback(res);
            }
          }
          resolve(true);
        },
      });
    });
  };

  /**
   * 下载导入模板
   * @code
   */
  const downloadImportFile = (code: string) => {
    dispatch({
      type: 'common/downloadImportFile',
      payload: {
        funcCode: code,
        moduleCaption: caption,
      },
      callback: (response: any) => {
        if (response && response.result && response.result.fileUrl) {
          window.open(response.result.fileUrl, '_self');
        } else if (response && response.fileUrl) {
          window.open(response.fileUrl, '_self');
        }
      },
    });
  };

  /**
   * exType 1: 单据明细  0：单据平铺
   * 导出
   */
  const exportFile = () => {
    let name = '';
    if (radioType === 'header') {
      name = caption;
    } else if (radioType === 'split') {
      name = `${caption}详情`;
    } else if (radioType === 'scan') {
      name = `${caption}平铺`;
    }
    if (!exportType) {
      message.warn('导出的请求URL未配置');
      return;
    }
    setSpinLoading(true);
    setSpinTip('导出中......');
    console.log(getExportShowColumns());

    const exCols = getFilterExportColumns(getExportShowColumns());
    dispatch({
      type: exportType,
      payload: {
        op: 'xlsx',
        exType: '1',
        moduleCaption: name,
        exColBasis: JSON.stringify(exCols),
        ...exportField,
      },
      callback: (response: any) => {
        setSpinLoading(false);

        if (response && response.result && response.result.fileUrl) {
          window.open(response.result.fileUrl, '_blank');
        } else if (response && response.fileUrl) {
          window.open(response.fileUrl, '_blank');
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
      importFile: (file: any, funcCodes: string, success: () => void, typeCode?: string, formData: any, ) => {
        return importFile(file, funcCodes, success, typeCode, formData);
      },
      exportFile: () => {
        exportFile();
      },
      downloadImportFile: (code: string) => {
        downloadImportFile(code);
      },
      reloadTable: (
        filters?: { Key: string; Val: string; Operator?: string }[],
        noFilters?: object,
      ) => {
        if (actionRef.current) {
          actionRef.current.reloadTable(filters, noFilters);
        }
      },
    };
  });

  const findSumTitle = (val: any) => {
    return tableColumns.find((item: any) => item.dataIndex === val)?.title
  }
  const getFootRender = () => {
    if (rowsData.sum && rowsData.total) {
      if (header.sumCols) {
        return (
          <div>
            <span>统计：</span>
            {header.sumCols.map((item: any) => (
              <>
                <span
                  style={{ marginLeft: 10 }}>{formatMessage({ id: findSumTitle(item) })} : </span><span>{rowsData.sum[item]}</span>
              </>
            ))}
          </div>
        )
      }
      if (body.sumCols) {
        return (
          <div>
            <span>统计：</span>
            {body.sumCols.map((item: any) => (
              <>
                <span
                  style={{ marginLeft: 10 }}>{formatMessage({ id: findSumTitle(item) })} : </span><span>{rowsData.sum[item]}</span>
              </>
            ))}
          </div>
        )
      }
      if (scan.sumCols) {
        return (
          <div>
            <span>统计：</span>
            {scan.sumCols.map((item: any) => (
              <>
                <span
                  style={{ marginLeft: 10 }}>{formatMessage({ id: findSumTitle(item) })} : </span><span>{rowsData.sum[item]}</span>
              </>
            ))}
          </div>
        )
      }
    }
    return null
  }

  return (
    <Spin spinning={spinLoading} tip={spinTip}>
      <div id="BaseHeaderAndBodyTable">
        {settingCols.length > 0 && (
          <CrudQueryTable
            cRef={actionRef}
            scroll={scroll}
            renderNoticeToolbar={renderNoticeToolbar}
            defaultPageSize={defaultPageSize}
            height={height}
            tableTitle={tableTitle}
            columns={settingCols}
            headerConfig={header}
            requestHeader={requestHeader}
            requestCellFilter={requestCellFilter}
            bodyConfig={body}
            requestBody={requestBody}
            scanConfig={scan}
            requestScan={requestScan}
            buttonToolbar={buttonToolbar}
            renderSelfToolbar={renderSelfToolbar}
            selectedRowsToolbar={selectedRowsToolbar}
            tableDefaultField={tableDefaultField}
            tableDefaultFilter={tableDefaultFilter}
            onResizeStop={(type: string, config: any) => {
              // console.log('1111111111111111111', type, config)
              saveColViewConfig(type, config);
            }}
            radioButton={radioType}
            onChangeRadioButton={(type: React.SetStateAction<string>) => {
              // console.log('------------type', type);
              setRadioType(type as RadioButtonType);
            }}
            onResetSettingColumnsChange={(
              type: string,
              config: any,
              getConfigCols: (arg0: any[]) => any,
            ) => {
              const columns = getShowColumns();
              const changeColumns = getConfigCols(columns);
              Object.assign(config, {
                changeColumns,
              });
              saveColViewConfig(type, config);
            }}
            onSettingColumnsChange={(type: string, config: any) => {
              saveColViewConfig(type, config);
            }}
            footer={rowsData && rowsData.sum ? getFootRender : footer}
          />
        )}
      </div>
    </Spin>
  );
};

export default connect()(BaseHeaderAndBodyTable);
