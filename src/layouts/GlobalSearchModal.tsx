import {Avatar, Empty, Input, List, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import {deepArr} from "@/utils/utils-array";
// @ts-ignore
import menuPng from '@/assets/menu.png'

// 递归算法实现，保存叶子节点和最终菜单名称
function flattenRoutes(routes: any[], parentNames = '', lastMenuName = '') {
  let result: any[] = [];

  routes.forEach(route => {
    const currentName = parentNames + (parentNames ? '/' : '') + route.name;

    // 如果当前节点有子路由，递归遍历子路由
    if (route.routes && route.routes.length > 0) {
      result = result.concat(flattenRoutes(route.routes, currentName, route.name));
    } else {
      // 如果是叶子节点，检查是否有有效的 path, name 和 component
      if (route.path && route.name && route.component) {
        result.push({
          path: route.path,             // 拼接的完整路径
          authority: route.authority,
          name: currentName,            // 拼接的完整名称
          component: route.component,   // 当前节点的组件
          lastMenuName: route.name      // 当前叶子节点的菜单名称
        });
      }
    }
  });

  // 1. 获取用户权限列表
  try {
    const authWbsRight = localStorage.getItem('auth_wbs_right');
    if (authWbsRight && result.length > 0) {
      const userWbsRight = JSON.parse(authWbsRight);
      // 假设 userWbsRight 是一个对象数组，每个对象有 func_code 字段
      const funCodeList = userWbsRight.map((r: any) => r.func_code).filter((code: any) => typeof code === 'string');
      return result.filter((r: any) => funCodeList.includes(r.authority));
    }
    return [];
  } catch (error) {
    return [];
  }
}

const GlobalSearchModal = (props: any) => {

  const { routes } = props;
  const propKey = localStorage.getItem('auth-default-wbs-prop-key') || '';
  const inputRef: any = React.useRef(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);

  const [inputVal, setInputVal] = useState<any>('');
  const [showData, setShowData] = useState<any[]>([]);
  const [showOldData, setShowOldData] = useState<any[]>([]);

  useEffect(() => {
    // 获取最终结果
    const flattenedRoutes = flattenRoutes(routes);
    const filterRoutes = flattenedRoutes.length > 0 ? flattenedRoutes.filter((item: any) =>  item.path.includes(`/${propKey}`)) : [];

    setShowData(filterRoutes || []);
    setShowOldData(filterRoutes || [])
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      // Detect Shift key press
      if (e.key === 'Shift') {
        if (!shiftPressed) {
          setShiftPressed(true);
          setTimeout(() => setShiftPressed(false), 500); // Reset after 500ms
        } else {
          setIsModalVisible(true); // Trigger modal if Shift is pressed twice
        }
      }
    };

    const handleDoubleClick = () => {
      // Open modal on double click
      setIsModalVisible(true);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dblclick', handleDoubleClick);

    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [shiftPressed]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const keywords = ['合同', '风险', '费控', '采购','安全','工程','技术','市场','财务','质量','人力资源', ];

  return (
    <>
      {isModalVisible && (
        <Modal
          // title="Triggered Modal"
          visible={isModalVisible}
          width={'60%'}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Input
            style={{marginTop: 8}}
            placeholder="输入菜单名称检索（多词组中间要加空格，比如：损益 项目信息"
            value={inputVal}
            ref={inputRef}
            onChange={(e) => {
              const _value = e.target.value;
              setInputVal(_value);
              if(_value) {
                const copyArr: any[] = deepArr(showOldData);
                const filterArr = copyArr.filter(r => {
                  // 处理带空格的 inputVal，拆分成数组并逐一匹配
                  return _value.split(' ').every((word: string) => r.name.includes(word));
                });
                setShowData(filterArr);
              } else {
                setShowData(showOldData)
              }
            }}
          />
          <div style={{marginTop: '1rem'}}>
            {keywords.map((item: any) => (
              <Tag style={{cursor: 'pointer'}} key={item} onClick={() => {
                setInputVal('')
                setInputVal(`${item} `)
                const copyArr: any[] = deepArr(showOldData);
                const filterArr = copyArr.filter(r => {
                  // 处理带空格的 inputVal，拆分成数组并逐一匹配
                  return r.name.includes(item);
                });
                setShowData(filterArr);
                if (inputRef && inputRef.current) {
                  inputRef.current.focus();
                }
              }}>{item}</Tag>
            ))}
          </div>
          <div style={{marginTop: '1rem', height: '500px', overflowY: 'scroll'}}>
            {showData.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={showData}
                renderItem={item => (
                  <List.Item style={{cursor: 'pointer',}} onClick={() => {
                    history.push(item.path);
                    setIsModalVisible(false)
                  }}>
                    <List.Item.Meta
                      avatar={<Avatar src={menuPng} />}
                      title={<a onClick={() => {
                        history.push(item.path);
                      }}>{item.lastMenuName}</a>}
                      description={item.name}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description={'暂无数据/无权限'} />
            )}
          </div>
        </Modal>
      )}
    </>
  )
}

export default GlobalSearchModal;
