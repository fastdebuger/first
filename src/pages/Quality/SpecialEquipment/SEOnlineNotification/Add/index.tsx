import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { Cascader, Form, message } from "antd";
import { province } from "@/common/province";


const { CrudAddModal } = SingleTable;

/**
 * 新增特种设备网上告知相关信息统计表
 * @param props
 * @constructor
 */
const SEOnlineNotificationAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();
  const [provinceList, setProvinceList] = useState<any>();

  useEffect(() => {
    // 将地区转换为Cascader需要的格式  
    const cascaderOptions = province.map(province => ({
      value: province.name,
      label: province.name,
      children: province.children.map(city => ({
        value: city.name,
        label: city.name,
        children: []
      })),
    }));
    setProvinceList(cascaderOptions)
  }, [])

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'SEOnlineNotification.province',
          dataIndex: 'province',
          subTitle: '省|自治区/市',
          width: 160,
          align: 'center',
          renderSelfForm: () => {
            const handleChange = (value: any, selectedData: any) => {
              if (Array.isArray(value) && value.length > 0) {
                form.setFieldsValue({
                  province_name: value[0],
                  city_name: value[1],
                })
              }
            };
            return (
              <Cascader
                options={provinceList}
                onChange={handleChange}
                placeholder="请选择省市"
                showSearch={true}
              />
            )
          }
        },
        'province_name',  //省/自治区名称
        'city_name', //市名称
        'account', //账号
        'account_password', //密码
        'equipment_category', //特种设备种类
        'platform_name', //系统/平台名称
        'platform_url', //网址
        'applicant_contact', //申请人/联系人及联系电话
        'remark', //备注
      ])
      .needToHide([
        'province_name',
        'city_name',
      ])
      .needToRules([
        'account', //账号
        'account_password', //密码
        'equipment_category', //特种设备种类
        'platform_name', //系统/平台名称
        'platform_url', //网址
        'applicant_contact', //申请人/联系人及联系电话
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      form={form}
      title={"新增特种设备网上告知相关信息统计表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values = {}) => {
        // 处理null和undefined为空值
        for (const key in values) {
          if (!Object.hasOwn(values, key)) continue;
          const element = values[key];
          if (element === null || element === undefined) {
            values[key] = ""
          }
        }
        // 删除城市区
        delete values.province;

        return new Promise((resolve) => {
          dispatch({
            type: "SEOnlineNotification/saveBatch",
            payload: {
              Items: JSON.stringify([values])
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
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

export default connect()(SEOnlineNotificationAdd);
