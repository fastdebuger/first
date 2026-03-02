import React, { useEffect, useState } from "react";
import { PageContainer } from '@ant-design/pro-layout';
import { Tooltip, Segmented } from "antd";
import { ReadOutlined, BarsOutlined } from '@ant-design/icons'

interface IListAndTilePage {
  title: string;
}

const ListAndTilePage: React.FC<IListAndTilePage> = (props: any) => {
  const {
    title = '',
    children
  } = props;
  const [showMode, setShowMode] = useState('list')
  const [childArr, setChildArr] = useState([])
  useEffect(() => {
    const arr: any = []
    if (children.length) {
      children.forEach((item: { props: { needShow: any; }; }) => {
        if (item.props.needShow) {
          arr.push(item)
        }
      })
    }
    setChildArr(arr)
  }, [])

  const onChange = (e: any) => {
    setShowMode(e.target.value)
  }

  return (
    <PageContainer
      style={{
        padding: 12
      }}
      title={<div style={{ paddingTop: 6, paddingLeft: 4 }}>{title}</div>}
      key='listAndTile'
      breadcrumb={{}}
      extra={childArr.length > 1 ? [
        <Segmented
          style={{ marginTop: 10 }}
          onChange={(val: any) => setShowMode(val)}
          options={[
            { label: '', value: 'list', icon: <Tooltip title="列表模式"><BarsOutlined /></Tooltip> },
            { label: '', value: 'tile', icon: <Tooltip title="平铺模式"><ReadOutlined /></Tooltip> },
          ]}
        />
        // <Radio.Group style={{paddingTop: 10}} defaultValue={showMode} onChange={onChange} buttonStyle="solid">
        //   <Radio.Button value="list" key='list'>列表</Radio.Button>
        //   <Radio.Button value="tile" key='tile'>平铺</Radio.Button>
        // </Radio.Group>
      ] : []}
    >
      <div style={{ margin: "-34px -24px 0px -24px", padding: '0px 16px' }}>
        {childArr.length > 1 ?
          (<div>
            {showMode === 'list' && childArr[0]}
            {showMode === 'tile' && childArr[1]}
          </div>) :
          (<div>
            {childArr[0]}
          </div>)
        }
      </div>
    </PageContainer>
  )
}

export default ListAndTilePage;
