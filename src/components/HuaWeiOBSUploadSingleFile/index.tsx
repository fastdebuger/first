import { Upload } from "@yayang/components"
import { encrypt, getUuid } from "@yayang/http";
import { getTTTKey } from "./utils";
export default Upload

/**
 * 生成加密URL 护网要求 限制访问
 * @param url - 原始URL
 * @returns 加密后的URL
 */
export const getUrlCrypto = (url: string): string => {
  const userCode = localStorage.getItem('auth-default-userCode') || '';
  const randomKey = encodeURIComponent(
    encrypt(
      JSON.stringify({ userCode, uuid: getUuid() }),
      getTTTKey()
    )
  );
  return `${url}?a=${randomKey}`;
};