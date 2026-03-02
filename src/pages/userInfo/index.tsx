import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Image,
  Card,
  Radio,
  Row,
  Col,
  Upload,
  message,
  Tooltip,
  Spin,
  Divider,
  Avatar,
  Space,
} from 'antd';
import './index.less';
import { connect } from 'umi';
import PersonalCenter from '@/components/GlobalHeader/ChangePassword';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { useIntl } from 'umi';
import CryptoJS from 'crypto-js';
import ApprovalPwdSetting from '@/components/GlobalHeader/ApprovalPwdSetting';
import { UserOutlined } from '@ant-design/icons';
import { getYYYKey } from '@/utils/utils';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

const UserInfo: React.FC<any> = (props: any) => {
  const { dispatch } = props;
  const [visible, setVisible] = useState(false);
  const [approvalVisible, setApprovalVisible] = useState(false);
  const userinfo = JSON.parse(localStorage.getItem('login-user-information') as 'user');
  const [wbsList, setWbsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [signImgSrc, setSignImgSrc] = useState<string>('error');
  const [imgVisible, setImgVisible] = useState(false);


  function encrypt(plaintText: string) {
    const key = CryptoJS.enc.Utf8.parse(getYYYKey());
    const src = CryptoJS.enc.Utf8.parse(plaintText);
    const options = {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };
    const encryptedData = CryptoJS.AES.encrypt(src, key, options);
    return CryptoJS.enc.Base64.stringify(encryptedData.ciphertext);
  }

  // 获取用户的签字照片
  const getUserSignImg = () => {
    if (dispatch) {
      dispatch({
        type: 'user/queryUserElecSignature',
        callback: (res: any) => {
          if (res && res.errCode === ErrorCode.ErrOk) {
            setSignImgSrc(res?.elec_signature || 'error');
          }
        },
      });
    }
  };
  const getProject = () => {
    if (dispatch) {
      setLoading(true);
      dispatch({
        type: 'configuserwbs/getUserRelationData',
        payload: {
          sort: 'user_code',
          userCode: localStorage.getItem('auth-default-userCode'),
        },
        callback(res: any) {
          if (res && res.result) {
            res.result.forEach((item: any) => {
              if (item.default_wbs_code === item.wbs_code) {
                item.checked = true;
              } else {
                item.checked = false;
              }
            });
            setWbsList(res.result);
            setLoading(false);
          }
        },
      });
    }
  };

  useEffect(() => {
    if (userinfo) {
      // @ts-ignore
      form1.setFieldsValue({
        user_name: userinfo.user_name || '',
      });
      // @ts-ignore
      form2.setFieldsValue({
        user_name: userinfo.user_name || '',
      });
      // @ts-ignore
      form3.setFieldsValue({
        user_name: userinfo.user_name || '',
      });
    }
    getProject();
    getUserSignImg();
  }, []);

  const formItemLayout = {
    labelCol: {
      style: {
        width: '80px',
      },
    },
  };


  /**
   * 设置默认项目部
   */
  const setDefaultWbs = (data: any) => {
    if (dispatch) {
      dispatch({
        type: 'configuserwbs/batchSetUserDefaultDep',
        payload: {
          default_dep: data.wbs_code,
          userCode: userinfo.user_code,
        },
        callback(res: any) {
          if (res && res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({ id: 'common.list.commit.ok.message' }));
          } else {
            message.error(formatMessage({ id: 'common.list.commit.failed.message' }));
          }
          setLoading(false);
        },
      });
    }
  };
  /**
   * 修改密码确定方法
   * @param fields
   */
  const handleModifyPwd = (fields: any) => {
    // eslint-disable-next-line no-param-reassign
    fields.new_password = encrypt(JSON.stringify({ pwd: fields.new_password }));
    // eslint-disable-next-line no-param-reassign
    fields.old_password = encrypt(JSON.stringify({ pwd: fields.old_password }));
    if (dispatch) {
      dispatch({
        type: 'login/modifyPwd',
        payload: fields,
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({ id: 'base.user.login.change_password_success_tips' }));
            setVisible(false);
            setTimeout(() => {
              dispatch({
                type: 'login/logout',
              }, 800);
            });
          }
          if (res.errCode === -1 || res.errCode === '-1') {
            message.error(res.errText);
          } else if (res.errCode === -104) {
            message.error(
              formatMessage({ id: 'base.user.login.password_security_change.content' }),
            );
          }
        },
      });
    }
  };
  /**
   * 设置审批密码
   * @param fields
   */
  const settingApprovalPwd = (fields: any) => {
    // eslint-disable-next-line no-param-reassign
    fields.approvalPwd = encrypt(JSON.stringify({ pwd: fields.approvalPwd }));
    // eslint-disable-next-line no-param-reassign
    fields.pwd = encrypt(JSON.stringify({ pwd: fields.pwd }));
    if (dispatch) {
      dispatch({
        type: 'user/setUserApprovalPwd',
        payload: fields,
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({ id: 'base.user.login.success.change.approval.pwd' }));
            setApprovalVisible(false);
          }
        },
      });
    }
  };
  /**
   * 上传电子签名
   * @param file 上传电子签名回调
   */
  const onChangeUpload = (file: any) => {
    setImgVisible(false)
    const url = file.response.url
    if (url) {
      dispatch({
        type: 'user/updateUserElecSignature',
        payload: {
          url,
        },
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            getUserSignImg();
            message.success(formatMessage({ id: 'common.file_upload_success' }));
          }
        },

      });
    }
  }
  return (
    <div className={'main-userinfo'}>
      <div className={'user-avatar'}>
        <div className={'tips'}>个人信息</div>
        <div className={'avatar-box'}>
          <span className={'avatar-tips'}>头像</span>
          <Avatar size={64} icon={<UserOutlined />} />
          <Upload
            name='avatar'
            accept='image/*'
            showUploadList={false}
            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
            onChange={() => {
            }}
          >
          </Upload>
        </div>
      </div>
      <div>
        <div className={'tips'}>
          账号安全
        </div>
        <Form {...formItemLayout}
          form={form3}
        >
          <Form.Item
            label='密码'
            labelAlign='left'
          >
            <Form.Item
              name='password'
              noStyle
            >
              <span>*************</span>
            </Form.Item>
            <Divider type='vertical' />
            <Button
              type='link'
              onClick={() => {
                setVisible(true);
              }}>更改</Button>

          </Form.Item>
        </Form>
        <div className={'tips'}>
          电子签名
        </div>
        <Space align='end'>
          <Image
            width={120}
            height={120}
            src={signImgSrc}
            fallback='data:image/png;base64,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'
          />
          <Divider type='vertical' />
          <Button
            type='primary'
            onClick={() => setImgVisible(true)}
          >重新上传</Button>
          {imgVisible && (<div>
            <HuaWeiOBSUploadSingleFile
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.BASIC}
              limitSize={50}
              fileCount={1}
              onChange={onChangeUpload}
              accept=".png,.jpg,.jpeg,.bmp"
            />
          </div>)}
        </Space>
        <div style={{ marginTop: 20, marginBottom: 24 }}>
          <div className={'tips'}>
            组织架构
          </div>
          <div>
            <Spin spinning={loading}>
              <Row gutter={[24, 24]}>
                {wbsList && wbsList.length > 0 && wbsList.map((item: any, index: number) => {
                  return (<Col span={4} key={item.wbs_code || index}>
                    <Card style={{ borderRadius: '6px' }} bodyStyle={{ padding: '12px 16px' }}
                      className={'radio-card'}>
                      <div className={'radio-card-row'}>
                        <div className={'name'}>部门</div>
                        <Tooltip placement='topLeft' title={item.wbs_name}>
                          <div style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}>{item.wbs_name}</div>
                        </Tooltip>
                      </div>
                      <div className={'radio-card-row'}>
                        <div className={'name'}>角色</div>
                        <Tooltip placement='topLeft' title={item.groupInfo?.[0]?.group_name}>
                          <div style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}>{item.groupInfo?.[0]?.group_name || '无'}</div>
                        </Tooltip>
                      </div>
                      <div className={'radio-box'}>
                        <Radio onClick={(e) => {
                          const list = JSON.parse(JSON.stringify(wbsList));
                          if (list[index].checked === true) {
                            return;
                          }
                          setLoading(true);
                          setDefaultWbs(item);
                          list.forEach((child: any) => {
                            child.checked = false;
                          });
                          list[index].checked = true;
                          setWbsList(list);
                        }} checked={item.checked}>设为默认</Radio>
                      </div>
                    </Card>
                  </Col>
                  );
                })}
              </Row>
            </Spin>
          </div>
        </div>
      </div>
      {visible && <PersonalCenter showChangePasswordModal={visible} handleModifyPwd={handleModifyPwd}
        handleHideModal={() => setVisible(false)} />}
      {approvalVisible &&
        <ApprovalPwdSetting showChangePasswordModal={approvalVisible} handleModifyPwd={settingApprovalPwd}
          handleHideModal={() => setApprovalVisible(false)} />}
    </div>
  );
};
export default connect()(UserInfo);

