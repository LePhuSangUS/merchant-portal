// @ts-ignore
import { mapRoutes, setRoutes } from '@/utils/routes';
import { getUser } from '@/utils/storage';

export async function patchRoutes({ routes }: any) {
  // @ts-ignore
  globalThis.routes = routes;

  // nếu đã login thì lấy từ routes localStorage và set lại (trường hợp refresh page)
  const user = getUser();
  if (user) {
    const routesMapped = mapRoutes(user?.routes || {});
    setRoutes(routesMapped);
  }
}
