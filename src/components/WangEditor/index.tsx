import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { Alert } from 'antd';
import {ErrorCode, HUA_WEI_OBS_CONFIG} from "@/common/const";
import moment from 'moment';
import {getUploadKey, upload} from "@/services/common/list";
import {decrypt} from "@/utils/request";
import { getTTTKey } from '@/utils/utils';

const WangEditor = (props: any) => {

  const { value, onChange, limitSize = 5 } = props;

  const [editor, setEditor] = useState<any>(null);
  const [content, setContent] = useState<string>('');

  // 销毁编辑器（避免内存泄漏）
  useEffect(() => {
    setContent(value || '')
    return () => {
      if (editor) editor.destroy();
    };
  }, [editor]);

  return (
    <div>
      <Alert type={'info'} message={'上传图片大小不能超过'+limitSize+'M'}/>
      <div style={{ border: '1px solid #ccc', borderRadius: '4px', marginTop: 8 }}>
        <Toolbar
          editor={editor}
          defaultConfig={{
            excludeKeys: ['fullScreen', 'insertLink', 'uploadVideo', 'insertVideo'],
          }}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={{
            placeholder: '请输入内容...',
            MENU_CONF: {
              // ================= 图片上传 =================
              uploadImage: {
                allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                maxFileSize: limitSize * 1024 * 1024, // 5MB

                async customUpload(file, insertFn) {

                  const currWbsCode = localStorage.getItem('auth-default-currWbsCode');
                  const fileKey = `${HUA_WEI_OBS_CONFIG.SYS_PATH.BASIC}/${currWbsCode}/message/${moment().format('YYYYMMDDHHmmss')}_${file.name}`;
                  const res = await getUploadKey({
                    objectKeyPrefix: fileKey,
                  });
                  if (res.result) {
                    try {
                      const u = JSON.parse(decrypt(res.result, getTTTKey()));
                      const formData = new FormData();
                      formData.append('key', fileKey);//key 必须第一位
                      formData.append('AccessKeyID', u.accessKeyId);
                      formData.append('policy', u.policy);
                      formData.append('signature', u.signature);
                      formData.append('file', file);
                      const r = await upload('/allUpload' + u.baseUrl, formData);
                      if (r.errCode === ErrorCode.ErrOk) {
                        insertFn(u.baseUrl + fileKey, file.name, u.baseUrl + fileKey);
                      }
                    } catch (e) {
                      // fields.onError();
                      console.log('---------eeeee', e)
                    }
                  } else {
                    // fields.onError();
                  }

                  // 必须调用 insertFn
                  // insertFn(res.url, file.name, res.url);
                },
              },

              // ================= 附件上传 =================
              // uploadAttachment: {
              //   allowedFileTypes: [
              //     'application/pdf',
              //     'application/msword',
              //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              //     'application/zip',
              //     'application/x-rar-compressed',
              //   ],
              //   maxFileSize: 20 * 1024 * 1024, // 20MB
              //
              //   async customUpload(file, insertFn) {
              //     const formData = new FormData();
              //     formData.append('file', file);
              //     console.log(file, insertFn);
              //     const res = await fetch('/api/upload/file', {
              //       method: 'POST',
              //       body: formData,
              //     }).then(r => r.json());
              //
              //     insertFn(res.url, file.name);
              //   },
              // },
            },
          }}
          value={content}
          onCreated={setEditor}
          onChange={(editor) => {
            setContent(editor.getHtml())
            if (onChange) onChange(editor.getHtml())
          }}
          style={{ height: '350px', overflow: 'auto' }}
        />
      </div>
    </div>
  );
};

export default WangEditor;
