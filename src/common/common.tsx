import React from 'react';
import { ToTopOutlined } from '@ant-design/icons';
import { Button, Upload, Tag } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import { CONST, APPROVAL_STATUS_CONFIG, EVALUATION_STATUS_CONFIG, SYS_BLACKLOG_STATUS, INSPECTOR_APPROVAL_STATUS } from '@/common/const';
import moment from 'moment';
import { previewOfficeOnline } from '@/utils/utils';
import { queryApprovalBusinessProcessTemplate } from '@/services/backConfig/flow';

/**
 * 获取当前时区时间字符串
 * 零时区时间戳（秒）+当前时区*3600秒=当前时区时间
 * @param zeroZoneTimeStamp
 * @param formatStr format字符串
 * @return moment moment对象
 */
export const getCurZoneTime = (
  zeroZoneTimeStamp: string | number,
  formatStr: string = 'YYYY-MM-DD',
) => {
  if (!zeroZoneTimeStamp) return '-';

  // 获取时区
  const currDate = new Date();
  let curZone = currDate.getTimezoneOffset() / 60;
  curZone = curZone < 0 ? Math.abs(curZone) : -curZone; // +8 -8

  const curZoneTime = Number(zeroZoneTimeStamp) + Number(curZone) * 3600;

  return moment.unix(Number(curZoneTime)).format(formatStr);
};

/**
 * 获取零时区时间戳
 * 东8区 - 8h = 0时区时间戳； 西8区 + 8h = 0时区时间戳
 * @param t
 */
export const getZeroZoneTimeStamp = (t: number) => {
  // 获取时区
  const currDate = new Date();
  let curZone = currDate.getTimezoneOffset() / 60;
  curZone = curZone < 0 ? Math.abs(curZone) : -curZone; // +8 -8

  const zeroZoneTime = Number(t) - Number(curZone) * 3600; // 东8区 - 8h = 0时区时间戳； 西8区 + 8h = 0时区时间戳
  return zeroZoneTime;
};

/**
 * 获取当前时区时间戳
 * 零时区时间戳（秒）+当前时区*3600秒=当前时区时间
 * @param zeroZoneTimeStamp
 * @return moment moment对象
 */
export const getCurZoneTimeStamp = (zeroZoneTimeStamp: string | number) => {
  if (!zeroZoneTimeStamp) return '-';

  // 获取时区
  const currDate = new Date();
  let curZone = currDate.getTimezoneOffset() / 60;
  curZone = curZone < 0 ? Math.abs(curZone) : -curZone; // +8 -8

  const curZoneTime = Number(zeroZoneTimeStamp) + Number(curZone) * 3600;

  return curZoneTime;
};

/**
 * 文件预览
 * @param url
 * @param ext 后缀
 */
export const handlePreview = (url: string, ext: string) => {
  if (/(ppt|doc|docx|xlsx|xls)/i.test(ext)) {
    // office预览
    previewOfficeOnline(url);
  } else {
    // pdf、图片网页预览,压缩包下载
    window.open(url);
  }
};

interface CommonImportButtonProps {
  childRef: any;
  authority?: string;
  callback?: any;
  params?: any;
}
export const CommonImportButton: React.FC<CommonImportButtonProps> = ({
  childRef,
  authority = '',
  callback,
  params = {},
}) => {
  const { formatMessage } = useIntl();
  return (
    <Upload
      showUploadList={false}
      name="file"
      accept={CONST.IMPORT_FILE_TYPE}
      beforeUpload={(file) => {
        if (childRef.current) {
          const formData = new FormData();
          for (const key in params) {
            if (key) {
              formData.append(key, params[key]);
            }
          }
          // @ts-ignore
          childRef.current.importFile(file, authority, callback, formData);
        }
        return false;
      }}
    >
      <Button type="primary" icon={<ToTopOutlined />} size="small">
        {formatMessage({ id: 'common.list.import' })}
      </Button>
    </Upload>
  );
};

interface CommonDownloadButtonProps {
  childRef: any;
  authority: string;
}

export const CommonDownloadButton: React.FC<CommonDownloadButtonProps> = ({
  childRef,
  authority,
}) => {
  const { formatMessage } = useIntl();
  return (
    <Button
      type="primary"
      size="small"
      onClick={() => {
        if (childRef.current) {
          // @ts-ignore
          childRef.current.downloadImportFile(authority);
        }
      }}
    >
      {formatMessage({ id: 'common.list.template' })}
    </Button>
  );
};

export const VIDEO_ACCEPT =
  '.avi,.wmv,.mpg,.mpeg,.mov,.rm,.ram,.swf,.flv,.mp4,.mp3,.wma,.avi,.rm,.rmvb,.flv,.mpg,.mkv';

/**
 * 获取审批模板
 * @param template 模板编码
 * @returns 审批模板对象
 */
export const getApprovalTemplate = async (template: string) => {
  const res = await queryApprovalBusinessProcessTemplate({
    page: 1,
    limit: 9999,
    sort: 'funcCode',
    order: 'asc',
    propKey: localStorage.getItem('auth-default-wbs-prop-key')
  });
  if (res && res.data && res.data.rows) {
    return res.data.rows.find((item: any) => item.funcCode === template);
  }
  return null;
}
/**封装审批状态码转换
 * @param status 状态码
 * @returns 状态码对应的中文描述
 */
export const ApprovalStatusTag = (status: string | number) => {
  // 不管后台返回什么都转为字符串，和常量审批状态码匹配
  const key = String(status);
  // 查找匹配的状态配置 -- APPROVAL_STATUS_CONFIG审批状态码 在 const.ts中定义的
  const config = APPROVAL_STATUS_CONFIG.find(item => item.key === key);

  if (!config) {
    // 不设置颜色，会默认为灰色的
    return <Tag>-</Tag>;
  }
  return (
    <Tag color={config.color}>
      <FormattedMessage id={config.textId} />
    </Tag>
  );
};

/**封装 质量检查员通用得 审批状态码转换
 * @param status 状态码
 * @returns 状态码对应的中文描述
 */
export const inspectorApprovalStatusTag = (status: string | number) => {
  // 不管后台返回什么都转为字符串，和常量审批状态码匹配
  const key = String(status);
  // 查找匹配的状态配置 -- INSPECTOR_APPROVAL_STATUS审批状态码 在 const.ts中定义的
  const config = INSPECTOR_APPROVAL_STATUS.find(item => item.key === key);

  if (!config) {
    // 不设置颜色，会默认为灰色的
    return <>/</>;
  }
  return (
    <Tag color={config.color}>
      <FormattedMessage id={config.textId} />
    </Tag>
  );
};



/**
 * 承包商人员状态标签配置
 * @param color - 要渲染的tags颜色
 * @param text - 要渲染的tags文本
 */
export const CONTRACTOR_STATUS_CONFIG: any = {
  '-1': {
    color: 'warning',
    text: SYS_BLACKLOG_STATUS.BLACKLIST_APPROVING || '黑名单审批中'
  },
  '0': {
    color: 'red',
    text: SYS_BLACKLOG_STATUS.EXIT || '退场'
  },
  '1': {
    color: 'success',
    text: SYS_BLACKLOG_STATUS.ENTRY || '进场'
  },
  '2': {
    color: 'orange',
    text: SYS_BLACKLOG_STATUS.BLACKLIST_APPROVED || '黑名单审批通过'
  },
  '3': {
    color: 'error',
    text: SYS_BLACKLOG_STATUS.BLACKLIST_REJECTED || '黑名单审批驳回'
  }
}

/**
 * 根据分数获取评估结果状态
 * @param score - 评估分数
 * @returns 评估tags状态码
 */
export const getEvaluationStatusByScore = (score: number | null) => {
  // 后台返回null则为未评估
  if (score === null) {
    return EVALUATION_STATUS_CONFIG.NOT_EVALUATED;
  }
  const numScore = Number(score);
  // 按分数从高到低判断
  // 优秀
  if (numScore >= EVALUATION_STATUS_CONFIG.EXCELLENT.minScore) {
    return EVALUATION_STATUS_CONFIG.EXCELLENT;
  }
  // 良好
  if (numScore >= EVALUATION_STATUS_CONFIG.GOOD.minScore) {
    return EVALUATION_STATUS_CONFIG.GOOD;
  }
  // 合格
  if (numScore >= EVALUATION_STATUS_CONFIG.PASS.minScore) {
    return EVALUATION_STATUS_CONFIG.PASS;
  }
  // 观察使用
  if (numScore >= EVALUATION_STATUS_CONFIG.OBSERVE.minScore) {
    return EVALUATION_STATUS_CONFIG.OBSERVE;
  }
  // 黑名单
  return EVALUATION_STATUS_CONFIG.BLACKLIST;
};


/**
 * 审批状态
 */
export const AUDIT_STATUS_NAME: any = {
  "待提交": 'default',
  "审批中": 'processing',
  "已通过": 'success',
  "驳回": 'error',
}

// 全局常量定义
export const POSSIBILITY_OPTIONS = [
  { label: '未评分 (0)', value: 0, disabled: true },
  { label: '极小 (1)', value: 1 },
  { label: '不太可能 (2)', value: 2 },
  { label: '有可能 (3)', value: 3 },
  { label: '很可能 (4)', value: 4 },
  { label: '基本会发生 (5)', value: 5 },
];

export const INFLUENCE_OPTIONS = [
  { label: '未评分 (0)', value: 0, disabled: true },
  { label: '极小 (1)', value: 1 },
  { label: '较小 (2)', value: 2 },
  { label: '一般 (3)', value: 3 },
  { label: '严重 (4)', value: 4 },
  { label: '非常严重 (5)', value: 5 },
];