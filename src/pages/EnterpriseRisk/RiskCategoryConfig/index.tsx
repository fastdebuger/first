import React, { useEffect, useState } from 'react';
import { Form, Card, message, Row, Col, Input, Tree, Spin, Button, Divider, Space } from 'antd';
import { connect } from 'umi';
import { RedoOutlined } from '@ant-design/icons';
import lodash from 'lodash';
import RiskControlConfigAdd from "./Add";
import { hasPermission } from "@/utils/authority";
import { ErrorCode } from '@yayang/constants';

const { Search } = Input;

/**
 * 风险类别配置信息
 * @param props 
 * @returns 
 */
const RiskCategoryConfigPage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;

  // 状态管理
  const [treeData, setTreeData] = useState<any[]>([]);
  const [initData, setInitData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<any>({});
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState(false);

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };

  /**
   * 递归构建树形结构
   */
  const buildTree = (data: any[], parentId: any = null): any[] => {
    return data
      .filter((item) => item.parent_id === parentId)
      .map((item) => ({
        ...item,
        title: item.category_name,
        key: item.id.toString(),
        children: buildTree(data, item.id),
      }));
  };

  /**
   * 获取数据
   */
  const loadData = () => {
    setPageLoading(true);
    if (dispatch) {
      dispatch({
        type: 'RiskCategoryConfig/getInfo',
        payload: { sort: 'id', order: 'asc' },
        callback: (res: any) => {
          setPageLoading(false);
          if (res && res.rows) {
            const list = res.rows;
            setInitData(list);
            const structuredTree = buildTree(lodash.cloneDeep(list));
            setTreeData(structuredTree);
          }
        },
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * 搜索逻辑
   */
  const onSearch = (value: string) => {
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  /**
   * 选择节点
   */
  const onSelect = (selectedKeys: any) => {
    const nodeId = selectedKeys[0];
    const node = initData.find((item) => item.id.toString() === nodeId);
    if (node) {
      setSelectedNode({
        ...node,
        id: node.id,
        category_name: node.category_name,
        wbs_code: node.wbs_code,
        parent_id: node.parent_id,
      });
      form.setFieldsValue({
        id: node.id,
        category_name: node.category_name,
        wbs_code: node.wbs_code,
        parent_id: node.parent_id,
      });
    } else {
      setSelectedNode({});
    }
  };

  /**
   * 递归渲染树节点（支持搜索高亮）
   */
  const loop = (data: any[]): any[] =>
    data.map((item) => {
      const index = item.category_name.indexOf(searchValue);
      const beforeStr = item.category_name.substring(0, index);
      const afterStr = item.category_name.substring(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.category_name}</span>
        );

      if (item.children) {
        return { title, key: item.id.toString(), children: loop(item.children) };
      }
      return { title, key: item.id.toString() };
    });

  /**
   * 提交表单（保存/修改）
   */
  const onFinish = (values: any) => {

    if (selectedNode.parent_id === null) {
      delete selectedNode.parent_id
    }
    if (values.parent_id === null) {
      delete values.parent_id
    }

    setBtnLoading(true);
    dispatch({
      type: 'RiskCategoryConfig/updateInfo',
      payload: {
        ...selectedNode,
        ...values,
      },
      callback: (res: any) => {
        setBtnLoading(false);
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('保存成功');
          loadData();
        }
      },
    });
  };


  /**
   * 删除
   */
  const handleDel = (id: string) => {
    setBtnLoading(true);
    dispatch({
      type: 'RiskCategoryConfig/delInfo',
      payload: { id },
      callback: (res: any) => {
        setBtnLoading(false);
        message.success('删除成功');
        setSelectedNode({})
        loadData();
      },
    });
  };

  return (
    <div style={{ backgroundColor: '#fff', display: 'flex', padding: '20px', minHeight: '80vh' }}>
      {/* 左侧：树形展示 */}
      <div style={{ width: '30%', borderRight: '1px solid #f0f0f0', paddingRight: '20px' }}>
        <Spin spinning={pageLoading}>
          <Divider orientation="left" plain>
            <h3 style={{ margin: 0 }}>风险类别配置信息</h3>
          </Divider>
          <Row gutter={8} style={{ marginBottom: 16 }}>
            <Col span={20}>
              <Search
                placeholder="搜索岗位名称"
                onSearch={onSearch}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Col>
            <Col span={4}>
              <Button icon={<RedoOutlined />} onClick={loadData} />
            </Col>
          </Row>
          <div style={{ height: 'calc(100vh - 300px)', overflow: 'auto' }}>
            {treeData.length > 0 && (
              <Tree
                onSelect={onSelect}
                treeData={loop(treeData)}
                defaultExpandAll={true}
                autoExpandParent={autoExpandParent}
              />
            )}
          </div>
        </Spin>
      </div>

      {/* 右侧：详情编辑 */}
      <div style={{ width: '70%', padding: '40px' }}>
        <div
          style={{ textAlign: "right", padding: 8, paddingBottom: 24 }}
        >
          {
            !(selectedNode?.id) && <Button
              type="primary"
              style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
              onClick={() => {
                setAddVisible(true);
              }}
            >
              新增
            </Button>
          }
        </div>
        {selectedNode.id ? (
          <Card title={`编辑: ${selectedNode.category_name}`}>
            <Form form={form} {...formItemLayout} onFinish={onFinish}>
              <Form.Item name="id" label="岗位ID" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="category_name"
                label="岗位名称"
                rules={[{ required: true, message: '请输入岗位名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="parent_id" label="上级ID" hidden>
                <Input disabled />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 7 }}>
                <Space>
                  {
                    // 父节点和一级节点可以存放子节点
                    selectedNode?.risk_category_type < 3 && (
                      <Button
                        type="primary"
                        loading={btnLoading}
                        onClick={() => {
                          setAddVisible(true);
                        }}>
                        新增下级节点
                      </Button>
                    )
                  }

                  <Button type="primary" htmlType="submit" loading={btnLoading}>
                    保存修改
                  </Button>

                  <Button danger type="primary" loading={btnLoading} onClick={() => handleDel(form.getFieldValue("id"))}>
                    删除
                  </Button>


                </Space>
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#999' }}>
            请在左侧选择一个信息进行编辑
          </div>
        )}
      </div>


      {addVisible && (
        <RiskControlConfigAdd
          selectedNode={selectedNode}
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if (loadData) {
              loadData()
            }
          }}
        />
      )}
    </div>
  );
};

export default connect()(RiskCategoryConfigPage);