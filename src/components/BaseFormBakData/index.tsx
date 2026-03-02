import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Row, Col, Alert, Badge } from 'antd';
import BaseFormSearchTable from '@/components/BaseFormSearchTable';
import _ from 'lodash';
import { SelectProps } from 'antd/es/select';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import Cart from './Cart';
import { ShoppingCartOutlined } from '@ant-design/icons';
// import BaseTaskForm from "@/components/BaseTaskForm";
// import {BasicFormColumns} from "qcx4-components";
// import {configColumns} from "@/pages/jia/ConcatFormOutStorage/columns";
// import UnitProjectList from "@/components/CommonList/UnitProjectList";
// import UnitList from "@/components/CommonList/UnitList";
// import ObsList from "@/components/CommonList/ObsList";
// import login from "@/models/login";
import { debounce } from '@/utils/utils';

interface BaseFormBakDataI {
  dispatch: any;
  rowKey: string; // 行唯一标识
  operator: any; // 过滤参数配置
  tableSortOrder: any; // 表格查询排序
  tableColumns: any[]; // 表格显示内容
  type: string; // 表格请求URL
  onSelectedCallBack: (keys: any[], rows: any[]) => void; // 选择行数据后的回调
  tableDefaultField: any; // 默认查询的数值
  showDefaultAlert?: () => ReactNode; // 展示默认的查询条件
  materialClsInfoList: any[]; // 分类信息
  isNeedFilterLevel?: boolean; // 分类信息
  scroll: any; // 分类信息
  defaultSeachKey: string; // 搜索唯一标识
}

const BaseFormBakData: React.FC<BaseFormBakDataI> = (props) => {
  const {
    dispatch,
    tableColumns,
    rowKey,
    tableSortOrder = { sort: 'prod_code', order: 'asc' },
    type,
    onSelectedCallBack,
    tableDefaultField: defaultField = {},
    operator,
    showDefaultAlert = undefined,
    isNeedFilterLevel = false,
    defaultSeachKey = 'search_val',
    scroll = { y: 'calc(100vh - 320px)' },
    // materialClsInfoList,
  } = props;
  const childRef: any = useRef();
  const [options, setOptions] = useState<SelectProps<object>['options']>([]);
  const [tableDefaultField, setTableDefaultField] = useState<any>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const level: string = localStorage.getItem('system-min-level-module-config') || '';
  console.log('scrollscrollscrollscroll', scroll);
  // useEffect(() => {
  //   if (dispatch) {
  //     dispatch({
  //       type: 'materialclsinfo/getMaterialClsInfo',
  //       payload: {
  //         sort: 'cls_code',
  //         order: 'asc',
  //       },
  //     });
  //   }
  // }, []);
  //监听 分类 和 物料 搜索搜索的变化
  useEffect(() => {
    if (tableDefaultField) {
      childRef.current.reloadTable();
      // childRef.current.onChangeSelectedRows(selectedKeys, selectedRows);
    }
  }, [tableDefaultField]);
  // 监听物料信息的改变 触发重新加载表格
  /**
   * 字符串转换成 search_val格式的查询数组
   * @param val
   */
  const getFilterArr = (val: string) => {
    const arr = val.split(' ');
    const filterArr = arr.filter((item) => item);
    return filterArr.map((item) => Object.assign({}, { Key: defaultSeachKey, Val: item }));
  };
  /**
   * 物料信息的模糊搜索
   * @param value
   */
  const handleSearch = (value: string) => {
    if (value) {
      const searchFilterArr = getFilterArr(value);
      dispatch({
        type,
        payload: {
          sort: 'prod_code',
          order: 'asc',
          ...defaultField,
          filter: JSON.stringify(searchFilterArr),
        },
        callback: (res: any) => {
          if (res && res.rows && res.rows.length > 0) {
            const filterArr: any[] = [];
            res.rows.forEach((item: any) => {
              filterArr.push({
                value: item.prod_code,
                label: (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      {item.prod_code}&nbsp;&nbsp;{item.prod_name}&nbsp;&nbsp;{item.prod_describe}
                    </span>
                  </div>
                ),
              });
            });
            setOptions(filterArr);
          } else {
            setOptions([]);
          }
        },
      });
    } else {
      setOptions([]);
      // 清空时 触发重新加载表格
      const copyField = { ...tableDefaultField };
      Object.assign(copyField, {
        prod_code: '',
      });
      setTableDefaultField(copyField);
    }
  };
  /**
   * 物料信息的筛选
   * @param value
   */
  const onSelectProdCode = (value: string) => {
    const copyField = { ...tableDefaultField };
    Object.assign(copyField, {
      prod_code: value,
    });
    setTableDefaultField(copyField);
  };
  /**
   * 左侧类型菜单选择的事件
   * @param e
   */
  // const handleMenuClick = (e: any) => {
  //   const searchKey = e.key || '';
  //   const copyField = {...tableDefaultField};
  //   Object.assign(copyField, {
  //     cls_code: e.key === 'all' ? '' : searchKey,
  //   });
  //   setTableDefaultField(copyField);
  // };
  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const handleSubmit = () => {
    onSelectedCallBack(selectedKeys, selectedRows);
    closeDrawer();
  };
  // 删除购物车回调
  const delCartCallBack = (item: { [x: string]: any }) => {
    const filterKeys = selectedKeys.filter((key) => key !== item[rowKey]);
    const filterRows = selectedRows.filter((row) => row[rowKey] !== item[rowKey]);
    setSelectedKeys(filterKeys);
    setSelectedRows(filterRows);
    // childRef.current.onChangeSelectedRows(filterKeys, filterRows);
  };
  const selectListConfig = {
    rowKey,
    tableColumns,
    delCartCallBack,
    selectedRows,
    drawerVisible,
    handleSubmit,
    handleCancel: () => {
      closeDrawer();
    },
  };

  const searchParam = !isNeedFilterLevel
    ? []
    : level === 'pipe_code'
    ? [
        {
          lable: '管线号',
          value: 'pipe_code',
        },
      ]
    : level === 'pipe_image_no'
    ? [
        {
          lable: '管线号',
          value: 'pipe_code',
        },
        {
          lable: '管线图号',
          value: 'pipe_image_no',
        },
      ]
    : [
        {
          lable: '管线号',
          value: 'pipe_code',
        },
        {
          lable: '管线图号',
          value: 'pipe_image_no',
        },
        {
          lable: '管段号',
          value: 'pipe_section_code',
        },
      ];
  const delayedChange = debounce((val: any, key: any) => {
    const copyField = { ...tableDefaultField };
    Object.assign(copyField, {
      [key]: val,
    });
    setTableDefaultField(copyField);
  }, 2000);
  const handleFilter = (val: string, key: string) => {
    delayedChange(val, key);
  };
  console.log('tableDefaultFieldtableDefaultFieldtableDefaultFieldtableDefaultField',tableDefaultField)
  // const getFormColumns = () => {
  //   const cols = new BasicFormColumns(configColumns);
  //   cols.initFormColumns([
  //     'pipe_code',
  //     'pipe_image_no',
  //     'pipe_section_code',
  //   ])
  //   return cols.getNeedColumns();
  // };
  // const footerBarRender = (formSelf: any) => {
  //   const onChange = async () => {
  //     const values = await formSelf.validateFields();
  //     console.log('values', values)
  //   };
  //   return [
  //     <Button type='primary' onClick={onChange}>搜索</Button>,
  //   ];
  // };
  return (
    <div>
      <Row gutter={[16, 24]}>
        <Cart {...selectListConfig} />
        <Col span={24}>
          {/*<Row>*/}
          {/*  /!* 层级筛选 *!/*/}
          {/*  {searchParam.map((item) => (*/}
          {/*    <Col*/}
          {/*      // span={parseInt(String(16 / searchParam.length), 10) > 8 ? 8 : parseInt(String(16 / searchParam.length), 10)}>*/}
          {/*      span={6}*/}
          {/*    >*/}
          {/*      <Row>*/}
          {/*        <Col*/}
          {/*          span={6}*/}
          {/*          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}*/}
          {/*        >*/}
          {/*          {item.lable}:*/}
          {/*        </Col>*/}
          {/*        <Col span={18}>*/}
          {/*          <Input*/}
          {/*            placeholder={`请输入${item.lable}`}*/}
          {/*            onChange={(e) => handleFilter(e.target.value, item.value)}*/}
          {/*          />*/}
          {/*        </Col>*/}
          {/*      </Row>*/}
          {/*    </Col>*/}
          {/*  ))}*/}
          {/*  <Col span={6}>*/}
          {/*    <Row>*/}
          {/*      <Col*/}
          {/*        span={6}*/}
          {/*        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}*/}
          {/*      >*/}
          {/*        物料检索:*/}
          {/*      </Col>*/}
          {/*      <Col span={18}>*/}
          {/*        <AutoComplete*/}
          {/*          dropdownMatchSelectWidth={252}*/}
          {/*          style={{ width: '18vw' }}*/}
          {/*          options={options}*/}
          {/*          onSelect={onSelectProdCode}*/}
          {/*          onChange={_.debounce(onSelectProdCode, 1000)}*/}
          {/*          onSearch={_.debounce(handleSearch, 1000)}*/}
          {/*          placeholder="请输入物料信息"*/}
          {/*        />*/}
          {/*      </Col>*/}
          {/*    </Row>*/}
          {/*  </Col>*/}
          {/*</Row>*/}

          {(showDefaultAlert || selectedRows.length > 0) && (
            <Alert
              style={{ marginTop: 10 }}
              message={
                <>
                  {selectedRows.length > 0 && (
                    <a>已选择 {selectedRows.length} 条&nbsp;&nbsp;&nbsp;&nbsp;</a>
                  )}
                  {showDefaultAlert && showDefaultAlert()}
                  {selectedRows.length > 0 && (
                    <div
                      style={{ float: 'right', cursor: 'pointer' }}
                      onClick={() => setDrawerVisible(true)}
                    >
                      <Badge offset={[8, 0]} count={selectedRows.length}>
                        <ShoppingCartOutlined style={{ fontSize: 20 }} />
                      </Badge>
                    </div>
                  )}
                </>
              }
              type="success"
            />
          )}
          <BaseFormSearchTable
            cRef={childRef}
            rowKey={rowKey}
            scroll={scroll}
            tableSortOrder={tableSortOrder}
            tableDefaultField={Object.assign(defaultField, tableDefaultField)}
            formColumns={[]}
            tableColumns={tableColumns}
            noSettingIcon={false}
            type={type}
            toolBarRender={() => []}
            operator={operator}
            rowSelection={{
              type: 'checkbox',
              callback: (keys: any, rows: any) => {
                setSelectedRows(rows);
                setSelectedKeys(keys);
                onSelectedCallBack(keys, rows);
              },
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ materialclsinfo }: ConnectState) => ({
  materialClsInfoList: materialclsinfo.materialClsInfoList,
}))(BaseFormBakData);
