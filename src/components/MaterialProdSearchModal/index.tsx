import { searchMaterialProdCode, getMaterialClsInfoInitial } from '@/services/common/list';
import { Drawer, Input, List, Tag, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

const { Search } = Input;

const MaterialProdSearchModal = (props: any) => {
  const { onHandleChange, onInputChange } = props;
  const [visible, setVisible] = useState(false);
  const [searchVal, setSearchVal] = useState<string | undefined>(undefined);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [prompt, setPrompt] = useState('查询')
  const [tabsKey, setTabsKey] = useState('1')
  const [innerSearchVal, setInnerSearchVal] = useState<string>('');

  const fetchList = async (searchVal: string) => {
    if (tabsKey === '1') {
      const res = await searchMaterialProdCode({
        wd: searchVal || ''
      })
      const result = res && res.result && res.result.search_result ? JSON.parse(res.result.search_result) : { result: [], totalHits: 0 };
      setList(result.result || []);
      setTotal(result.totalHits || 0)
      console.log(result.result,'asdasdasdasdasdasdasdasd');

    } else {
      const newRes = await getMaterialClsInfoInitial({
        sort: 'prod_describe',
        filter: JSON.stringify([{ Key: 'prod_describe', Val: searchVal || '' }])
      })
      setList(newRes.rows || []);
      setTotal(newRes.total || 0)
      console.log(newRes.rows,'adasdadsasdads');

    }
  }

  // useEffect(() => {
  //   if (visible) {

  //   }
  // }, [visible])
  const searchCompontents = () => {
    return (
      <div>
        <Search placeholder="输入举例：碳素无缝钢管 20 8163" value={innerSearchVal} onChange={e => setInnerSearchVal(e.target.value)} onSearch={(value: string) => {
          fetchList(value);
        }} enterButton />
        <div style={{ marginTop: 8 }}>
          共搜索出 <strong>{total}</strong> 条
          <span style={{ marginLeft: 16 }}>点击物料编码 可 选中当前行的数据</span>
          <div>
            <Tag color="blue" style={{ marginTop: 8 }}>{prompt}</Tag>
          </div>
        </div>
        <div style={{ marginTop: 8, maxHeight: 'calc(100vh - 152px)', overflow: 'scroll' }}>
          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item: any) => (
              <List.Item style={{ cursor: 'pointer' }}>
                <List.Item.Meta
                  title={(
                    <a
                      onClick={() => {
                        setSearchVal(item.materialCode || item.prod_code);
                        if (onHandleChange) onHandleChange(item);
                        setVisible(false);
                      }}
                    >
                      {item.materialCode || item.prod_code}
                      {item.materialName || item.prod_name}
                      <Tag style={{ marginLeft: 8 }}>{item.subDescription || item.cls_code || '无分类编码'}</Tag>
                      <Tag>{item.jldwId || item.cls_name || '无分类名称'}</Tag>
                      <Tag>{item.lbbm || item.unit || '无单位'}</Tag>
                    </a>
                  )}
                  description={item.description || item.prod_describe}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    )
  }
  return (
    <div>
      <Search
        value={searchVal}
        placeholder="可输入/可选择物料编码"
        onSearch={(value: string) => {
          setVisible(true)
          setList([]);
          setTotal(0);
          setInnerSearchVal('');
        }}
        onChange={(e) => {
          // console.log('----onChange', e.target.value);
          if (onInputChange) onInputChange(e.target.value || '')
          setSearchVal(e.target.value || '');
        }}
      />
      {visible && (
        <Drawer
          width={'75%'}
          title="物料搜索"
          placement="right"
          onClose={() => {
            setVisible(false)
          }}
          visible={visible}
        >
          <Tabs
            defaultActiveKey="1"
            onChange={(key) => {
              if(key === '1'){
                setPrompt('查询');
              }else{
                setPrompt('新物料查询');
              }
              setTabsKey(key);
              setList([]);
              setTotal(0);
              setInnerSearchVal('');
            }}
            items={[
              {
                label: `查询`,
                key: '1',
                children: searchCompontents(),
              },
              {
                label: `新物料查询`,
                key: '2',
                children: searchCompontents(),
              },
            ]}
          />

        </Drawer>
      )}
    </div>
  )
}

export default MaterialProdSearchModal;
