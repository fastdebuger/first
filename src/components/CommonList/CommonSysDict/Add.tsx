import React from "react";
import { configColumns } from "./columns";
import { BasicFormColumns } from "yayang-ui";
import { useIntl, connect } from "umi";
import {Button, Modal, Row, Col, message, Input } from "antd";
import {BasicTaskForm} from "qcx4-components";
import { ErrorCode } from "@/common/const";


/**
 * 新增通用字典配置
 * @param props
 * @constructor
 */
const TaxAccountingAdd: React.FC<any> = (props) => {
  const { dispatch, title = '', type, visible, isNeedColor = false, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        // "id",
        "type",
        "value",
        "label",
        {
          title: 'compinfo.color',
          subTitle: '颜色',
          dataIndex: 'color',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const onChange = (e) => {
              form.setFieldsValue({color: e.target.value});
            }
            return <Input type='color' onChange={onChange} />;
          },
        },
      ])
      .needToRules([
        "type",
        "value",
        "label",
        "color",
      ])
      .needToHide([
        "type",
        !isNeedColor ? "color" : '' // 需要color就 不隐藏
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <Modal
      title={"新增" + title}
      visible={visible}
      onCancel={onCancel}
      width={'70%'}
      footer={null}
    >
      <BasicTaskForm
        formColumns={getFormColumns()}
        footerBarRender={(form: any) => [
          <Row gutter={16} justify="space-between">
            <Col></Col>
            <Col>
              <Button type="primary" onClick={async () => {
                const values = await form.validateFields();
                dispatch({
                  type: "common/addSysBasicDict",
                  payload: {...values},
                  callback: (res: any) => {
                    if (res.errCode === ErrorCode.ErrOk) {
                      message.success("新增成功");
                      setTimeout(() => {
                        callbackSuccess();
                      }, 1000);
                    }
                  },
                });
              }}>
                保存
              </Button>
            </Col>
          </Row>
        ]}
        initialValue={{
          type,
          color: ''
        }}
      />
    </Modal>
  )

  // return (
  //   <CrudAddModal
  //     title={"新增" + title}
  //     visible={visible}
  //     onCancel={onCancel}
  //     initialValue={{
  //       type,
  //     }}
  //     columns={getFormColumns()}
  //     onCommit={(values: any) => {
  //       return new Promise((resolve) => {
  //         dispatch({
  //           type: "common/addSysBasicDict",
  //           payload: values,
  //           callback: (res: any) => {
  //             resolve(true);
  //             if (res.errCode === ErrorCode.ErrOk) {
  //               message.success("新增成功");
  //               setTimeout(() => {
  //                 callbackSuccess();
  //               }, 1000);
  //             }
  //           },
  //         });
  //       });
  //     }}
  //   />
  // );
};

export default connect()(TaxAccountingAdd);
