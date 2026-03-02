import React, { useEffect, useState ,useRef} from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, Select, Divider,Space, Input,Button } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

const { CrudEditModal } = SingleTable;

/**
 * 编辑承包商年度评价基本信息
 * @param props
 * @constructor
 */
const ContractorAnnualEvalEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  const [contractorNameItems, setContractorNameItems] = useState<any>([]);
  const [contractorInputName, setContractorInputName] = useState<string | number | null>(null);
  const [contractorPhoneItems, setContractorPhoneItems] = useState<any>([]);
  const [contractorInputPhone, setContractorInputPhone] = useState<string | number | null>(null);
  const inputRef = useRef<InputRef>(null);

  /**
 * 获取下拉选项数据、承包商基本信息和手机号码信息
 */
  const fetchSelectOptions = () => {
    // 请求获取承包商注册号码列表
    dispatch({
      type: 'appraiseInfo/getContractorBasicInfo',
      payload: {
        contractor_name: selectedRecord?.contractor_name,
        group_by: 0
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const newRes = res.result.map((item: any) => item.register_number)
          setContractorNameItems(newRes);
        }
      }
    })

    // 请求获取承包商联系电话列表
    dispatch({
      type: 'appraiseInfo/getContractorBasicInfo',
      payload: {
        contractor_name: selectedRecord?.contractor_name,
        group_by: 1
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const newRes = res.result.map((item: any) => item.contact_phone)
          setContractorPhoneItems(newRes);
        }
      }

    })
  }

  useEffect(() => {
    // 获取初始化数据
    fetchSelectOptions();
  },[])


  /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "branch_comp_name",
        "dep_name",
        'belong_year',
        'contractor_name',
        "contractor_manager",
        {
          title: "compinfo.register_number",
          subTitle: "承包商编码",
          dataIndex: "register_number",
          width: 160,
          align: "center",
          renderSelfForm : (form: any) => {
            const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
              setContractorInputName(event.target.value);
            };
            const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if(!contractorInputName) return
              e.preventDefault();
              setContractorNameItems([...contractorNameItems, contractorInputName || `New item ${1}`]);
              setContractorInputName(null);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            };
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="自定义承包商编码"
                dropdownRender={menu => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Input
                        placeholder="请输入承包商编码"
                        ref={inputRef}
                        value={contractorInputName || undefined}
                        onChange={onNameChange}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                        新增承包商编码
                      </Button>
                    </Space>
                  </>
                )}
                options={contractorNameItems.map(o => ({ label: o, value: o }))}
              />
            )
          }
        },
        {
          title: "compinfo.contact_phone",
          subTitle: "联系方式",
          dataIndex: "contact_phone",
          width: 160,
          align: "center",
          renderSelfForm : (form: any) => {
            const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
              setContractorInputPhone(event.target.value);
            };
            const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if(!contractorInputPhone) return
              e.preventDefault();
              setContractorPhoneItems([...contractorPhoneItems, contractorInputPhone || `New item ${1}`]);
              setContractorInputPhone(null);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            };
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="自定义联系方式"
                dropdownRender={menu => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Input
                        placeholder="请输入联系方式"
                        ref={inputRef}
                        value={contractorInputPhone || undefined}
                        onChange={onNameChange}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                        新增联系方式
                      </Button>
                    </Space>
                  </>
                )}
                options={contractorPhoneItems.map((o: any) => ({ label: o, value: o }))}
              />
            )
          }
        },

      ])
      .needToDisabled([
        "branch_comp_name",
        "dep_name",
        'belong_year',
        'contractor_name',
        "contractor_manager",
      ])
      .needToRules([
        "branch_comp_name",
        "dep_name",
        'belong_year',
        'contractor_name',
        "contractor_manager",
        "register_number",
        "contact_phone",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={formatMessage({ id: 'base.user.list.edit' }) +'承包商年度评价基本信息'}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        const payload = {
          ...selectedRecord,
          ...values,
        };
        /**
         * 创建一个Promise实例
         */
        return new Promise((resolve) => {
          dispatch({
            type: "appraiseInfo/updateContractorInfo",
            payload,
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("修改成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });

      }}
    />

  );
};

export default connect()(ContractorAnnualEvalEdit);
