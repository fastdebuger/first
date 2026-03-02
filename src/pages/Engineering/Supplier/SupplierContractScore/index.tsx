import React, { useEffect } from "react";
import { connect } from "umi";
import {getSupplierDateConfig} from "@/services/engineering/supplierDateConfig";
import { Col, Empty, Row, Tree } from "antd";
import Rating from "@/pages/Engineering/Supplier/SupplierContractScore/Rating";
import {getUnitLinkman} from "@/services/engineering/supplierContractScore";

/**
 * 供应商合同得分
 * @param props
 * @constructor
 */
const SupplierContractScorePage: React.FC<any> = (props: any) => {

  const [treeData, setTreeData] = React.useState<any>([{
    title: '年份',
    key: '0-0',
    children: []
  }]);
  const [selectedNodeInfo, setSelectedNodeInfo] = React.useState<any>(null);
  const [isConfigLink, setIsConfigLink] = React.useState(false);

  /**
   * 包含两个接口，控制 current
   */
  const fetchList = async () => {
    const res1 = await getUnitLinkman({
      sort: 'wbs_code',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'wbs_code', Val: localStorage.getItem('auth-default-wbsCode'), Operator: '='}
      ])
    })
    if (res1.rows.length > 0) {
      setIsConfigLink(true)
    }
    // 请求公司级的配置接口
    const res: any = await getSupplierDateConfig({
      sort: 'year',
      order: 'desc'
    })
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
    fetchList();
  }, []);

  const onSelect = (selectedKeys, info) => {
    console.log(info.node);

    setSelectedNodeInfo(info.node ? {...info.node} : null);
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
              {selectedNodeInfo && (
                <div>
                  <Rating isConfigLink={isConfigLink} selectedNodeInfo={selectedNodeInfo}/>
                </div>
              )}
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

