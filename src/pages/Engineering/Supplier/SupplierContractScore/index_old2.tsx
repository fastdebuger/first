import React, { useEffect } from "react";
import { connect } from "umi";
import {getSupplierDateConfig} from "@/services/engineering/supplierDateConfig";
import {Button, Col, Descriptions, Empty, Form, Input, message, Row, Steps, Tree } from "antd";
import {
  addSupplierContractScoreHead,
  querySupplierContractScoreHead
} from "@/services/engineering/supplierContractScore";
import SupplierContractPage from "@/pages/Engineering/Supplier/SupplierContract";
import Rating from "@/pages/Engineering/Supplier/SupplierContractScore/Rating";
import moment from "moment";

/**
 * 供应商合同得分
 * @param props
 * @constructor
 */
const SupplierContractScorePage: React.FC<any> = (props: any) => {
  const { } = props;
  const wbsCode = localStorage.getItem('auth-default-wbsCode');
  const currDate = moment().format("YYYY-MM-DD");

  const [treeData, setTreeData] = React.useState<any>([{
    title: '年份',
    key: '0-0',
    children: []
  }]);
  const [selectedNodeInfo, setSelectedNodeInfo] = React.useState<any>(null);
  const [headerList, setHeaderList] = React.useState<any[]>([]);
  const [current, setCurrent] = React.useState<number>(0);

  /**
   * 包含两个接口，控制 current
   */
  const fetchList = async () => {
    // 请求公司级的配置接口
    const res: any = await getSupplierDateConfig({
      sort: 'year',
      order: 'desc'
    })
    // 请求是否配置填报月份表头
    const resHead = await querySupplierContractScoreHead({
      sort: 'year',
      order: 'desc',
      filter: JSON.stringify([
        {Key: 'wbs_code', Val: wbsCode}
      ])
    })
    setHeaderList(resHead.rows || []);
    const arr: any[] = [];
    if (res.rows.length > 0) {
      res.rows.forEach((r: any) => {
        arr.push({ title: r.year, key: r.year, ...r });
      })
      setSelectedNodeInfo(arr[0]);
      setTreeData([{ title: '年份', key: '0-0', children: arr}]);
    }
  }

  useEffect(() => {
    if (selectedNodeInfo && headerList.length > 0) {
      // 这里说明配置了 打分开始时间 则自动调整到最后一步进行打分
      if (selectedNodeInfo.score_date_start && currDate > selectedNodeInfo.score_date_start) {
        setCurrent(2)
        return;
      }
      // 合同上传模块逻辑
      // 这里判断逻辑是，默认选中了年份，查询该年份有没有配置联系方式
      const findObj = headerList.find(r => r.year === selectedNodeInfo.year);
      setCurrent((findObj && findObj.phone_number )> 0 ? 1 : 0);
    }
  }, [selectedNodeInfo]);

  useEffect(() => {
    fetchList();
  }, []);

  const onSelect = (selectedKeys, info) => {
    setSelectedNodeInfo(info.node || null);
  };

  const getTableContent = () => {
    const findObj = headerList.find(r => r.year === selectedNodeInfo.year);
    if (!findObj && current === 0) {
      return (
        <Form
          style={{marginTop: 32}}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={async (values: any) => {
            console.log('Success:', values);
            const res = await addSupplierContractScoreHead({
              phone_number: values.phone_number,
              wbs_code: wbsCode,
              year: selectedNodeInfo.year,
            })
            if (res.errCode === 0) {
              message.success('配置成功，接下里需要上传打分合同');
              setCurrent(1)
            }
          }}
          autoComplete="off"
        >
          <Form.Item
            label="联系方式"
            name="phone_number"
            rules={[{ required: true, message: '请输入联系方式!' }]}
          >
            <Input style={{width: '200px'}} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交配置信息
            </Button>
          </Form.Item>
        </Form>
      )
    }
    if (current === 1) {
      return (
        <>
          <div style={{ paddingLeft: 8 }}>
            <Descriptions title={"填报信息"}>
              <Descriptions.Item label="联系方式">{findObj.phone_number}</Descriptions.Item>
              <Descriptions.Item label="单位">{findObj.wbs_name}</Descriptions.Item>
            </Descriptions>
          </div>
          <SupplierContractPage selectedItem={findObj} selectedNodeInfo={selectedNodeInfo}/>
        </>
      )
    }
    if (current === 2) {
      return (
        <div>
          <Rating selectedItem={findObj} selectedNodeInfo={selectedNodeInfo}/>
        </div>
      )
    }
    return null;
  }

  // 定义不换行样式对象（组件内复用）
  const descNoWrapStyle = {
    whiteSpace: 'nowrap',       // 核心：禁止换行
    overflow: 'hidden',         // 可选：溢出隐藏
    textOverflow: 'ellipsis',   // 可选：溢出显示省略号
    color: 'rgba(0, 0, 0, 0.45)',           // 可选：红色区域（Antd危险色）
    fontSize: '10px',
    display: 'inline-block',    // 可选：确保样式生效
    maxWidth: '200px',          // 可选：限制最大宽度（避免溢出容器）
  };

  return (
    <div style={{padding: 8}}>
      <div>
        {treeData[0].children.length > 0 ? (
          <Row gutter={8}>
            <Col span={4}>
              <strong style={{fontSize: 18}}>供应商合同评分</strong>
              <Tree
                style={{marginTop: 8}}
                selectedKeys={[selectedNodeInfo.key]}
                defaultExpandedKeys={['0-0']}
                onSelect={onSelect}
                treeData={treeData}
              />
            </Col>
            <Col span={20}>
              <Steps
                size="small"
                current={current}
                items={[
                  {
                    title: '配置填报信息',
                    description: <span style={descNoWrapStyle}>需要配置填报方的联系方式</span>
                  },
                  {
                    title: `上传合同`,
                    description: <span style={descNoWrapStyle}>在公司级规定时间内及时上传合同</span>
                  },
                  {
                    title: '进行评分',
                    description: <span style={descNoWrapStyle}>在公司级规定的时间内进行评分</span>
                  },
                ]}
              />
              <div>
                {getTableContent()}
              </div>
            </Col>
          </Row>
        ) : (
          <Empty description={'需要公司级发起开始本年度开始评分的时间段'}/>
        )}
      </div>
    </div>
  )
}
export default connect()(SupplierContractScorePage);

