import RenderAuthorize from '@/components/Authorized';
import { getAuthority } from './authority';
let Authorized = RenderAuthorize(getAuthority());

const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getAuthority());
};

(window as any).reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default Authorized;
