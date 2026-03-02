import React from 'react';
import { DocumentEditor } from '@onlyoffice/document-editor-react';

interface IShowOnlyOfficeInfoProps {
  url: string;
  fileName: string;
}

/**
 * 获取 OBS 文件地址后缀（简单拆分法）
 * @param {string} obsUrl OBS 文件完整地址
 * @returns {string} 文件后缀（小写，无小数点，如 docx、png）
 */
function getObsFileExtSimple(obsUrl: string) {
  // 1. 校验参数是否为有效字符串
  if (typeof obsUrl !== 'string' || obsUrl.trim() === '') {
    return '';
  }
  // 2. 按 "/" 拆分 URL，取最后一段（即文件名+参数/锚点）
  const fileNameWithExtra = obsUrl.split('/').pop();
  // 3. 若存在 "?"（URL 参数）或 "#"（锚点），截取前面的文件名部分
  const pureFileName = fileNameWithExtra.split(/[?#]/)[0];
  // 4. 按 "." 拆分文件名，取最后一段（即后缀）
  const ext = pureFileName.split('.').pop();
  // 5. 转为小写（统一格式，避免 DOCX 和 docx 区分），返回结果
  return ext ? ext.toLowerCase() : '';
}

const ShowOnlyOfficeInfo = (props: IShowOnlyOfficeInfoProps) => {

  const { url, fileName = '测试文件' } = props;
  const userCode = localStorage.getItem('auth-default-userCode')
  const userName = localStorage.getItem('auth-default-userName');

  return (
    <div style={{height: '80vh'}}>
      <DocumentEditor
        id="onlyoffice-editor"
        documentServerUrl={'http://117.78.40.158:8888/'} // 你的 OnlyOffice 服务地址
        config={{
          document: {
            fileType: getObsFileExtSimple(url) || 'docx',
            key: Date.now() + '',
            title: fileName,
            url,
            permissions: {
              edit: false,            // 可否编辑
              download: false,       // 是否允许下载
              comment: false,         // 是否允许评论
              print: false,
              review: false,           // 是否开启审阅模式
              chat: false,
              fillForms: false,
            }
          },
          editorConfig: {
            mode: 'view',
            user: {
              id: userCode + '', // 'user-001',
              name: userName + '', // '测试用户',
            },
            lang: 'zh-CN',
            // customization: {
            //   forcesave: true,  // ✅ 允许强制保存
            //   spellcheck: false // ✅ 关闭拼写检查
            // },
            // coEditing: {
            //   mode: "fast",           // fast 或 strict，代表实时或锁定编辑
            //   // mode: "strict", // 用户切换编辑需获取锁
            //   change: true            // 是否允许切换模式
            // }
          }
        }}
        // events_onDocumentReady={() => {
        //   window.removeEventListener('message', handleIframeMessage, false);
        //   window.addEventListener('message', handleIframeMessage, false)
        // }}
        // events={{
        //   onDocumentStateChange: (event) => {
        //     console.log('文档状态变更:', event);
        //   },
        //   onRequestSave: () => {
        //     console.log('触发保存请求');
        //   },
        //   onDocumentReady: () => {
        //     console.log('文档加载完成');
        //   },
        // }}
      />
    </div>
  )
}

export default ShowOnlyOfficeInfo;
