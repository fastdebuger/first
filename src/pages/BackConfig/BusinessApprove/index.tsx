import React, { useEffect, useState } from "react";
import { connect, useIntl } from "umi";
import { Spin, Row, Col, Empty, Badge, Tooltip, Button, message, Input, Card } from "antd";
import style from './index.less'
import {
  queryFlowModel,
  queryApprovalBusinessProcessTemplate,
  saveApprovalBusinessProcessTemplate,
  queryGroupIdList
} from "@/services/backConfig/flow";

const img1 = require('@/assets/approve/001.png');
const img2 = require('@/assets/approve/002.png');
const img3 = require('@/assets/approve/003.png');
const img4 = require('@/assets/approve/004.png');
const img5 = require('@/assets/approve/005.png');
const selectedIcon = require('@/assets/handover/selected.png')
const imgs = [img1, img2, img3, img4, img5];
import FlowModal from './FlowModal'
const { Search } = Input;

import { RedoOutlined } from "@ant-design/icons";
import { log } from "console";

interface MenuListType {
  key: string;
  label: string;
}

const BusinessApprove: React.FC<any> = () => {
  const { formatMessage } = useIntl();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [sysModules, setSysModules] = useState<any>([]);
  const [checkedProcessTemplate, setCheckedProcessTemplate] = useState<any>({});
  const [menuKey, setMenuKey] = useState<string>('0');
  const [flowList, setFlowList] = useState<any>([]);
  const [flowModalVisible, setFlowModalVisible] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [menuList, setMenuList] = useState<any>([]);
  const [menuListAll, setMenuListAll] = useState<MenuListType[]>([]);

  const queryGroupList = async () => {
    const res = await queryGroupIdList({
      offset: 1,
      limit: 9999,
      filter: '[]',
      sort: 'groupId',
      order: 'asc'
    })
    if (res && res.data && res.data.rows.length) {
      let capitalizeFirstLetter = (str: string) => {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toLowerCase() + str.slice(1);
      }

      setMenuList(
        res.data.rows.map((item: any) => (
          { key: item.groupId, label: formatMessage({ id: capitalizeFirstLetter(item.groupId) }) }
        ))
      )
    }
  }
  useEffect(() => {
    queryGroupList()
  }, []);


  const queryFlowList = async () => {
    const res = await queryFlowModel({})
    if (res && res.data && res.data.length > 0) setFlowList(res.data)
  }

  const queryProcessTemplate = async () => {
    setSpinning(true)
    const res = await queryApprovalBusinessProcessTemplate({
      page: 1,
      limit: 9999,
      sort: 'funcCode',
      order: 'asc',
      propKey: localStorage.getItem('auth-default-wbs-prop-key')
    })
    setMenuKey(menuList[0].key)
    if (res && res.data && res.data.rows) {
      setSysModules(res.data.rows)
    }
    setSpinning(false)
  }

  useEffect(() => {
    if (menuList && menuList.length) {
      setMenuListAll(menuList)
      queryFlowList()
      queryProcessTemplate()
    }
  }, [menuList]);


  const onOk = async (item: any) => {
    setFlowModalVisible(false)
    let params: any = {
      businessId: checkedProcessTemplate.businessId,
      templateCode: item.code,
      templateVersion: item.version,
      modelId: item.id,
    }
    if (checkedProcessTemplate && checkedProcessTemplate.processTemplate && checkedProcessTemplate.processTemplate.id) {
      params.id = checkedProcessTemplate.processTemplate.id
    }
    const res = await saveApprovalBusinessProcessTemplate(params)
    if (res && res.code === 200) {
      message.success(formatMessage({ id: 'save.success' }));
      queryProcessTemplate()
    }
  }

  const getTemplateName = (code: any) => {
    const obj = flowList.find((item: any) => item.code === code)
    if (flowList && flowList.length && obj) {
      return obj.name
    }
    return code
  }

  const getNum = (code: any) => {
    if (code && sysModules && sysModules.length) {
      return sysModules.filter((item: any) => item.groupId === code).length
    }
    return 0
  }

  useEffect(() => {
    if (searchValue) {
      setMenuListAll(menuList.filter((item: any) => item.label.includes(searchValue)))
    } else {
      setMenuListAll(menuList)
    }
  }, [searchValue])

  return (
    <div className={'module'}>
      <Spin spinning={spinning}>
        <Card
          title={formatMessage({ id: 'menu.base.flow.businessApprove' })}
          headStyle={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 16, letterSpacing: 1 }}
          bordered
          className={'border-radio-8'}
          bodyStyle={{ padding: 12, height: 'calc(100vh - 144px)', overflowY: 'auto' }}
          size={'small'}
        >
          <Row gutter={[12, 12]}>
            <Col span={6}>
              <Row>
                <Col span={20}>
                  <Search
                    style={{ width: '100%' }}
                    placeholder={formatMessage({ id: 'system.module' })}
                    value={searchValue}
                    onChange={(e: any) => setSearchValue(e.target.value)}
                  />
                </Col>
                <Col span={1} offset={1}>
                  <Button icon={<RedoOutlined />} onClick={() => {
                    setSearchValue('')
                    setMenuListAll(menuList)
                  }} />
                </Col>
              </Row>
              <Row gutter={[16, 12]} className={'flowRow'}>
                {menuListAll.map((item: any) => (
                  <Col span={24}>
                    <Card
                      key={item.key}
                      className={menuKey && menuKey === item.key ? 'checkedFlowRowCard' : 'flowRowCard'}
                      onClick={() => setMenuKey(item.key)}
                      size={"small"}
                      bodyStyle={{ position: "relative" }}
                      hoverable
                    >
                      {menuKey && menuKey === item.key &&
                        <img className={'flowRowCardImg'} alt={item.title} src={selectedIcon} />}
                      <div className={'checkedFlowRowBox'}>
                        {item.label}
                        <div className={'checkedFlowRowBoxTitle'}>
                          {getNum(item.key)}{formatMessage({ id: 'section' })}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col span={18} className={style['module-content']}>
              <Row gutter={[16, 16]} align={'top'}>
                {sysModules && menuKey && sysModules.length ?
                  sysModules.filter((item: any) => item.groupId === menuKey).map((moduleItem: any, index: number) => (
                    <Col span={6}>
                      <Badge.Ribbon style={{ zIndex: 99 }} text={`v${moduleItem?.processTemplate?.templateVersion || 0}`}>
                        <Card.Grid className={style['grid-style']}>
                          <img alt='example' src={imgs[index % imgs.length]} className={style['grid-img']} />
                          <div className={style['grid-padding']}>
                            <div className={style['flow-center-row']}>
                              <span className={style['grid-name']}>{formatMessage({ id: "system.module_name" })}：</span>
                              <Tooltip placement="topLeft" title={moduleItem.funcName || ''}>
                                <div className={style['grid-value']}>{moduleItem.funcName || ''}</div>
                              </Tooltip>
                            </div>
                            <div className={style['grid-name-box']}>
                              <span className={style['grid-name']}>{formatMessage({ id: "system.template_name" })}：</span>
                              <a
                                type={'link'}
                                onClick={() => {
                                  setFlowModalVisible(true)
                                  setCheckedProcessTemplate(moduleItem)
                                }}
                                className={style['grid-value']}
                              >
                                {getTemplateName(moduleItem?.processTemplate?.templateCode) || formatMessage({ id: 'system.chose_template_name' })}
                              </a>
                            </div>
                          </div>
                        </Card.Grid>
                      </Badge.Ribbon>
                    </Col>
                  )) : <Empty className={style['empty']} description={formatMessage({ id: "system.no_template" })} />}
              </Row>
            </Col>
          </Row>
        </Card>
      </Spin>
      {flowModalVisible && checkedProcessTemplate &&
        <FlowModal
          flowList={flowList.filter((item: any) => item.groupId === menuKey)}
          visible={flowModalVisible}
          checkedFlow={''}
          onCancel={() => setFlowModalVisible(false)}
          onOk={onOk}
        />}
    </div>
  );
};

export default connect()(BusinessApprove);
