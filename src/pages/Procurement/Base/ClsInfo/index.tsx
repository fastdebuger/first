import React, { useEffect, useState } from 'react';
import { Form, Radio, Card, message, Modal, Dropdown, Divider, Space, Spin, Button, Menu, Col, Row } from 'antd';
import { connect, useIntl } from 'umi';
import { ErrorCode } from '@/common/const';
import { Tree, Input } from 'antd';
import { DeleteOutlined, PlusOutlined, RedoOutlined, RollbackOutlined } from '@ant-design/icons';
import { hasPermission } from "@/utils/authority";
import { getFinalTableColumns, objectArrayRemoveRepeat } from "@/utils/utils";
import { configColumns } from './columns'
import { BasicTableColumns } from "qcx4-components";
import lodash from 'lodash'

const { confirm } = Modal;
const { Search } = Input;
/**
 * 物料分类信息
 * @param props
 * @constructor
 */

const MaterialClsInfoPage: React.FC<any> = (props) => {
  const {
    dispatch,
    route: { authority }
  } = props;
  const { formatMessage } = useIntl();
  const addPerm = hasPermission(authority, '新增')
  const initPerm = hasPermission(authority, '初始化')
  // 是否全部展开
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  // 搜索值
  const [searchValue, setSearchValue] = useState<string>('');
  // 变为树形的数值
  const [treeData, setTreeData] = useState<any[]>();
  // 基本数据 一维
  const [initData, setInitData] = useState<any>();
  // 当前操作
  const [option, setOption] = useState<string>('edit');
  // 当前选中的node对象
  const [selectedNode, setSelectedNode] = useState<any>({});
  // 展示
  const [clsCode, setClsCode] = useState<any>('');
  // 保存按钮loading
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  // 页面loading
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  // 新增一级分类Card
  const [addLevel1Visible, setAddLevel1Visible] = useState<boolean>(false);
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            initPerm && <a
              type='primary'
              key={2}
              // loading={initLoading}
              onClick={() => {
                handleInit()
              }}>{
                formatMessage({ id: "material.list.init" })
              }</a>
          ),
        },
      ]}
    />
  );
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };

  const newPushTreeNode = (rows: any[], parent: any, nodeKey: any, parentNodeKey: any) => {
    const children = rows.filter((item) => {
      return item[parentNodeKey] === parent[nodeKey];
    });
    if (children && children.length > 0) {
      Object.assign(parent, { children });
      children.forEach((item) => {
        Object.assign(item, { parent });
        newPushTreeNode(rows, item, nodeKey, parentNodeKey);
      });
    }
  }

  const convertTree = (originData: any[]) => {
    const treeData1: any[] = [];
    originData.forEach((item) => {
      if (item && item.level_no && item.level_no.toString() === '1') {
        treeData1.push(item);
      }
    });
    // 把带一层的children填上用第二层对应的
    treeData1.forEach((item1: any) => {
      const children = originData.filter((item2: any) => {
        return item2.up_cls_code === item1.cls_code;
      });
      if (children && children.length > 0) {
        Object.assign(item1, { children });
        children.forEach((item3: any) => {
          newPushTreeNode(originData, item3, 'cls_code', 'up_cls_code');
        });
      }
    })
    return treeData1;
  };
  const generateTreeData = (data: any[]) => {
    setPageLoading(false)
    setTreeData(convertTree(data));
  };

  // @ts-ignore
  const getParentKey = (key: any, tree: string | any[]) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: { key: any; }) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  // @ts-ignore
  const getParent = (item: any, nums: any, arr: any = []) => {
    if (nums - 1 > -1) {
      initData?.forEach((row: any) => {
        if (item.level_no === row.level_no + 1 && item.up_cls_code === row.cls_code) {
          arr.push(row)
          getParent(row, row.level_no, arr)
        }
      })
    }
    return arr
  };



  const generateTree = (type: boolean = false) => {
    setPageLoading(true)
    setAutoExpandParent(false)
    if (dispatch) {
      setBtnLoading(true);
      dispatch({
        type: 'materialclsinfo/getMaterialClsInfo',
        payload: {
          sort: 'cls_code',
          order: 'asc',
        },
        callback: (res: any) => {
          const list = lodash.cloneDeep(res.rows)
          setSelectedNode({});

          if (res && res.rows) {
            setInitData(list)
            generateTreeData(lodash.cloneDeep(res.rows));
          }
          if (type) {
            onChange(searchValue, lodash.cloneDeep(res.rows))
          }
          setBtnLoading(false);
        },
      });
    }
  };
  /**
   * 新增
   * @param fields
   */
  const handleAdd = (fields: any) => {
    if (dispatch) {
      setBtnLoading(true);
      dispatch({
        type: 'materialclsinfo/addMaterialClsInfo',
        payload: {
          ...fields,
          is_leaf: 1,
          cls_match_type: fields.cls_match_type || 3,// 默认穿个 全口径
        },
        callback: (res: any) => {
          setBtnLoading(false);
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({ id: 'common.list.add.success' }));
            generateTree(true);
          }
        },
      });
    }
  };

  /**
   * 删除
   */
  const handleDel = () => {
    confirm({
      title: `${formatMessage({ id: 'material.sure.you.want.to.delete' })}${selectedNode.key}?`,
      content: formatMessage({ id: 'material.after.deletion.no.restore' }),
      okText: formatMessage({ id: 'common.sure' }),
      cancelText: formatMessage({ id: 'common.cancel' }),
      onOk() {
        return new Promise<void>((resolve, reject) => {
          setBtnLoading(true);
          setTimeout(() => {
          }, 2000)
          dispatch({
            type: 'materialclsinfo/deleteMaterialClsInfo',
            payload: {
              cls_code: selectedNode.cls_code,
              id: selectedNode.id,
            },
            callback: (res: any) => {
              setBtnLoading(false);
              if (res.errCode === ErrorCode.ErrOk) {
                resolve();
                generateTree(true);
                message.success(formatMessage({ id: 'common.list.del.success' }));
              } else {
                generateTree(true);
                reject();
              }
            },
          });
          // setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      },
    });
  };

  const getFilterExportColumns = (columns: any[]) => {
    columns.map((item) => (item.title = formatMessage({ id: item.title })));
    const arr: any[] = [];
    columns.forEach((column) => {
      if (column.export) {
        const obj = {
          DataIndex: column.dataIndex,
          Title: column.title,
        };
        arr.push(obj);
      }
    });
    return arr;
  };

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'cls_code',
        'cls_name',
        'cls_match_type',
        'self_cls_code',
        'up_cls_code',
        'remark',
      ])
    return cols.getNeedColumns();
  };
  /**
   * exType 1: 单据明细  0：单据平铺
   * 导出
   */
  const exportFile = () => {
    setPageLoading(true);
    const exCols = getFilterExportColumns(getFinalTableColumns(getTableColumns()));
    dispatch({
      type: 'materialclsinfo/getMaterialClsInfo',
      payload: {
        op: 'xlsx',
        exType: 1,
        exColBasis: JSON.stringify(exCols),
        sort: 'cls_code',
        order: 'asc',
        moduleCaption: '物料分类信息',
      },
      callback: (response: any) => {
        setPageLoading(false);
        if (response && response.result && response.result.fileUrl) {
          window.open(response.result.fileUrl, '_blank');
        } else {
          message.error('生成导出文件有误，请稍后再试');
        }
      },
    });
  };


  const handleInputChange = (e: { target: { value: any; }; }) => {
    setClsCode(e.target.value);
  };


  // 树形结构 删除的垃圾桶
  const deleteDom = (item: { key: any; children: string | any[]; }) => {
    return (<>
      {selectedNode && item.key === selectedNode.key && !item.children?.length && <>
        <Divider type='vertical' />
        <DeleteOutlined style={{ cursor: 'pointer', color: 'gray' }} onClick={handleDel} /></>}
    </>)
  }
  // @ts-ignore
  const loop = (data: any[]) => data.map(item => {
    let title;
    if (searchValue?.length > 0) {
      const index = item.key.indexOf(searchValue);
      const beforeStr = item.key.substr(0, index);
      const afterStr = item.key.substr(index + searchValue.length);
      title =
        index > -1 ? (
          <>
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
            {/*{deleteDom(item)}*/}
          </>
        ) : (<span>{item.key}</span>);
    } else {
      title = <span>{item.key}</span>;
    }
    if (item.children) {
      return { title, key: item.key, children: loop(item.children) };
    }
    return {
      title,
      key: item.key,
    };
  });
  const onSelect = (selectedKeys: any) => {
    setOption('edit');
    const node = initData?.filter(item => item.key === selectedKeys[0])[0];
    const children = initData.filter((item2: any) => {
      return item2.up_cls_code === node.cls_code;
    });
    if (children && children.length) {
      Object.assign(node, { children })
    }
    form.setFieldsValue(node);
    setAddLevel1Visible(false);
    console.log(children)
    console.log(node)
    setSelectedNode(node || {});
  };

  /**
   * 修改
   * @param fields
   */
  const handleEdit = (fields: any) => {
    if (dispatch) {
      setBtnLoading(true);
      dispatch({
        type: 'materialclsinfo/updateMaterialClsInfo',
        payload: fields,
        callback: (res: any) => {
          setBtnLoading(false);
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({ id: 'common.list.edit.success' }));
            generateTree(true);
          }
        },
      });
    }
  };
  // 提交
  const onFinish = (values: any) => {
    const data = { ...selectedNode, ...values };
    if (dispatch) {
      if (option === 'edit') {
        handleEdit(data);
      }
      if (option === 'addLevel1') {
        handleAdd(values);
      }
      if (option === 'add') {
        const addData = {
          ...data,
          up_cls_code: selectedNode.cls_code,
          self_cls_code: data.cls_code,
          cls_code: `${selectedNode.cls_code}${data.cls_code}`,
        };
        delete addData.children;
        handleAdd(addData);
      }
      if (option === 'delete') {
        handleDel();
      }
    }
  };
  const handleChangeOption = (op: string) => {
    setOption(op);
    if (op === 'add') {
      form.resetFields();
      form.setFieldsValue({ self_cls_code: selectedNode.self_cls_code, level_no: Number(selectedNode.level_no) + 1 });
    }
  };
  /**
   * 初始化56大类
   */
  const handleInit = () => {
    Modal.confirm({
      title: formatMessage({ id: "common.warn" }),
      content: formatMessage({ id: "material.init.main.class" }),
      okText: formatMessage({ id: "common.sure" }),
      cancelText: formatMessage({ id: "common.cancel" }),
      onOk() {
        if (dispatch) {
          dispatch({
            type: "materialclsinfo/initSinopec56MaterialClsInfo",
            payload: {},
            callback(res: any) {
              if (res.errCode === 0 || res.status === "ok" || res.message === "success") {
                message.success(formatMessage({ id: "common.list.init.success" }));
                generateTree();
              } else {
                message.error(formatMessage({ id: "common.list.init.error" }));
              }
            }
          })
        }
      }
    })
  }

  const onChange = (value: any, rows: any) => {
    console.log(value)
    if (!value) {
      setSearchValue('');
      generateTree()
    } else {
      const arr: any = []
      lodash.cloneDeep(rows).forEach((item: any) => {
        if (item.key.indexOf(value) > -1) {
          arr.push(item)
          const list = getParent(item, item.level_no)
          arr.push(...list)
        }
      })
      generateTreeData(objectArrayRemoveRepeat(arr, 'key'));
      setSelectedNode({});
      setAutoExpandParent(true);
    }
  };

  useEffect(() => {
    generateTree();
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '40%', height: '100%', paddingLeft: 50 }}>
        <Spin spinning={pageLoading} tip="加载中...">
          <Divider orientation='left' plain>
            <h3> {formatMessage({ id: 'material.classification.tree' })} </h3>
          </Divider>
          <Row>
            <Col span={21}>
              <Search
                style={{ marginBottom: 8 }}
                placeholder={formatMessage({ id: 'common.search' })}
                value={searchValue}
                onChange={(e: any) => {
                  setSearchValue(e.target.value)
                }}
                onSearch={(value: any) => onChange(value, initData)} />
            </Col>
            <Col span={2} offset={1}> <Button icon={<RedoOutlined />} onClick={() => {
              setSearchValue('');
              generateTree()
            }} /></Col>
          </Row>
          {treeData && treeData.length &&
            <div style={{ height: 'calc( 100vh - 240px)', overflow: "auto" }}>
              <Tree
                key={`${searchValue}${autoExpandParent}`}
                onSelect={onSelect}
                //onExpand={onExpand}
                //expandedKeys={expandedKeys}
                defaultExpandAll={autoExpandParent}
                treeData={loop(treeData)}
                defaultSelectedKeys={[]}
              />
            </div>
          }
        </Spin>
      </div>
      <div style={{ width: '55%', height: '100%', paddingTop: 8 }}>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              {/*
              五公司 和 十公司的层级不一样 需要初始化 不需要新增和删除的功能
              <Button
                style={{display: addPerm ? 'inline' : 'none'}}
                type='primary'
                key={1}
                onClick={() => {
                  setAddLevel1Visible(true);
                  form.resetFields()
                  form.setFieldsValue({level_no: 1});
                  setOption('addLevel1');
                }
                }>{formatMessage({id: 'material.new.primary.classification'})}</Button>*/}
              <Button
                type='primary'
                key={2}
                onClick={() => {
                  exportFile()
                }
                }>导出
              </Button>
              <Dropdown overlay={menu} placement="bottomLeft">
                <Button>...</Button>
              </Dropdown>
            </Space>
          </Col>

        </Row>
        {addLevel1Visible && <Card
          style={{ width: '100%' }}
          title={formatMessage({ id: 'material.new.primary.classification' })}
        >
          <Form
            style={{ width: '100%' }}
            form={form}
            name='dynamic_rule'
            onFinish={onFinish}
          >
            <Form.Item
              {...formItemLayout}
              name='cls_code'
              label={formatMessage({ id: 'material.classification.code' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'material.classification.code.required' }),
                },
              ]}
            >
              <Input style={{ width: '50%' }}
                placeholder={formatMessage({ id: 'material.please.enter.material.classification.code' })} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name='cls_name'
              label={formatMessage({ id: 'material.classification.name' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'material.classification.name.required' }),
                },
              ]}
            >
              <Input placeholder={formatMessage({ id: 'material.please.enter.material.classification.name' })} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name='cls_match_type'
              label={formatMessage({ id: 'material.cls_match_type' })}
              rules={[{ required: true, message: formatMessage({ id: 'material.please.select.material.type' }) }]}>
              <Radio.Group>
                <Radio value={1}>{formatMessage({ id: 'material.prefab' })}</Radio>
                <Radio value={2}>{formatMessage({ id: 'material.install' })}</Radio>
                <Radio value={3}>{formatMessage({ id: 'material.full.bore' })}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name='level_no'
              label={formatMessage({ id: 'material.current.level' })}
            >
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name='remark'
              label={formatMessage({ id: 'material.remark' })}
            >
              <Input placeholder={formatMessage({ id: 'material.please.enter.remark' })} />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ marginLeft: '30%', display: addPerm ? 'inline' : 'none' }}
                loading={btnLoading}
                type='primary'
                htmlType='submit'
              >
                {formatMessage({ id: 'common.save' })}
              </Button>
            </Form.Item>
          </Form>
        </Card>}

        {selectedNode && !addLevel1Visible &&
          selectedNode.key &&
          <Card
            style={{ width: '100%' }}
            title={option === 'add' ? `${formatMessage({ id: 'material.adding' })}${selectedNode.key}${formatMessage({ id: 'material.down.material' })}` : `${formatMessage({ id: 'material.editing' })}${selectedNode.key}`}
          // 五公司 和 十公司的层级不一样 需要初始化 不需要新增和删除的功能
          // extra={
          //   selectedNode.level_no && addPerm &&
          //   <Space>
          //     <Button type='primary'
          //             icon={<PlusOutlined/>}
          //             onClick={() => handleChangeOption('add')}>{formatMessage({id: 'material.add.sub.material'})}
          //     </Button>
          //     <Button icon={<DeleteOutlined/>} type='primary' danger
          //             disabled={selectedNode?.children && selectedNode?.children.length}
          //             onClick={() => {
          //               handleChangeOption('delete')
          //               handleDel()
          //             }}>{formatMessage({id: 'common.delete'})}
          //     </Button>
          //   </Space>
          // }
          >
            <Form
              // key={selectedNode.key}
              style={{ width: '100%' }}
              form={form}
              name='dynamic_rule'
              onFinish={onFinish}
            >
              <Form.Item
                {...formItemLayout}
                name='cls_code'
                label={formatMessage({ id: 'material.classification.code' })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'material.classification.code.required' }),
                  },
                ]}
              >

                <Input style={{ width: '50%' }}
                  placeholder={formatMessage({ id: 'material.please.enter.material.classification.code' })}
                  onChange={handleInputChange}
                  disabled={option === 'edit'} />
              </Form.Item>
              {option === 'add' && <Form.Item
                {...formItemLayout}
                name='code_show'
                label={formatMessage({ id: 'material.last.generated.material.code' })}>
                {option === 'add' && <span>{selectedNode.cls_code}{clsCode}</span>}
                {/*<Input.Group compact>*/}
                {/*  {option === 'add' && <Input disabled={true} style={{width: '25%'}}*/}
                {/*                              addonBefore={formatMessage({id: 'material.primary.classification'})}*/}
                {/*                              value={selectedNode.level_no.toString() === '2' ? 88 : 99}/>}*/}
                {/*  {option === 'add' && <Input disabled={true} style={{width: '65%'}}*/}
                {/*                              addonBefore={formatMessage({id: 'material.secondary.classification'})}*/}
                {/*                              value={selectedNode.level_no.toString() === '2' ? selectedNode.self_cls_code : clsCode}/>}*/}
                {/*</Input.Group>*/}
              </Form.Item>}
              <Form.Item
                {...formItemLayout}
                name='cls_name'
                label={formatMessage({ id: 'material.cls_name' })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'material.classification.name.required' }),
                  },
                ]}
              >
                <Input disabled={true} placeholder={formatMessage({ id: 'material.please.enter.material.classification.name' })} />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                name='level_no'
                label={formatMessage({ id: 'material.current.level' })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'material.current.level.required' }),
                  },
                ]}
              >
                <Input placeholder={formatMessage({ id: 'material.please.enter.material.classification.code' })}
                  disabled={true} />
              </Form.Item>
              {(Number(selectedNode.is_leaf) === 1 || option === 'add') &&
                <Form.Item
                  {...formItemLayout}
                  name='cls_match_type'
                  label={formatMessage({ id: 'material.cls_match_type' })}
                  rules={[{ required: true, message: formatMessage({ id: 'material.please.select.material.type' }) }]}>
                  <Radio.Group>
                    <Radio value={1}>{formatMessage({ id: 'material.prefab' })}</Radio>
                    <Radio value={2}>{formatMessage({ id: 'material.install' })}</Radio>
                    <Radio value={3}>{formatMessage({ id: 'material.full.bore' })}</Radio>
                  </Radio.Group>
                </Form.Item>}
              <Form.Item
                {...formItemLayout}
                name='remark'
                label={formatMessage({ id: 'material.remark' })}
              >
                <Input placeholder={formatMessage({ id: 'material.please.enter.remark' })} />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ marginLeft: '30%', display: addPerm ? 'inline' : 'none' }}
                  loading={btnLoading}
                  type='primary'
                  htmlType='submit'>
                  {formatMessage({ id: 'common.save' })}
                </Button>
              </Form.Item>
            </Form>
          </Card>}
      </div>
    </div>
  );
};

export default connect()(MaterialClsInfoPage);
