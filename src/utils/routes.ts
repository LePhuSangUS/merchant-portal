import RootComponentMap from '@/pages/RootComponent';
import { getLanguageKey } from '@/utils';
import Profile from '@/pages/user/MyProfile';
import Balance from '@/pages/user/balance';
import PaymentConfig from '@/pages/user/payment-config';
import ChangePassword from '@/pages/user/change-password';
import Notification from "@/pages/user/notification";
import Disbursement from "@/pages/disbursement/disbursement-registration";
import CollectionService from "@/pages/collection-service/collection-registration";

interface PageProps {
  id: string,
  component: string,
  path?: string,
  name?: string,
  icon?: string,
  exact?: boolean,
  hideInMenu?: boolean,
  pageType?: string,
}

interface ModuleProps {
  id: string,
  path?: string,
  name?: string,
  icon?: string,
  component?: string,
  pages?: PageProps[],
  exact?: boolean,
  hideInMenu?: boolean,
  redirect?: string,
}

const ROOT_PATH = '/'
const REDIRECT_PATH = '/dashboard'

export const mapRoutes = (routes = []) => {
  // redirect to dashboard when enter wrong url, use for route level 2 or more depth
  const redirectRoute = routes.find((route: ModuleProps) => !!route?.redirect && route?.path === ROOT_PATH) || { path: ROOT_PATH, redirect: REDIRECT_PATH }
  return routes.map((module: ModuleProps) => (
    module.id
      ? {
        id: module.id,
        path: module.path,
        name: module.name?.[getLanguageKey() || 'vi'],
        icon: module.icon,
        // component: RootComponentMap[module.id]?.[module.component],
        component: '',
        exact: module.exact,
        hideInMenu: module.hideInMenu,
        hideInBreadcrumb: (
          (
            module?.pages
            && module?.pages?.length <= 1
            && !module.pages?.[0].hideInMenu
          ) 
          // || (
          //   module?.pages
          //   && module.pages?.length > 1
          // )
        ),
        routes: [...(module.pages || []).map((page) => {
          const isSupertsetPage = page.pageType === 'SUPERSET';
          const componentName = isSupertsetPage ? 'SupersetPage' : page.component;
          const dashboardID = isSupertsetPage ? page.component : null;

          return ({
            id: page.id,
            path: page.path,
            name: page.name?.[getLanguageKey() || 'vi'],
            icon: page.icon,
            component: RootComponentMap[module.id]?.[componentName],
            supersetDashboardID: dashboardID,
            exact: page.exact,
            hideInMenu: page.hideInMenu,
            hideInBreadcrumb: false,
          })
        }), redirectRoute],
      }
      : module
    )
  );
};

export const resetRoutes = () => {
  // @ts-ignore
  globalThis.routes[0].routes[1].routes = [
    {
      path: '/my-profile',
      name: 'my-profile',
      component: Profile,
      hideInMenu: true
    },
    {
      path: '/my-notification',
      name: 'my-notification',
      component: Notification,
      hideInMenu: true
    },
    {
      path: '/balance-management',
      name: 'balance-management',
      component: Balance,
      hideInMenu: true
    },
    {
      path: '/payment-page-config',
      name: 'payment-page-config',
      component: PaymentConfig,
      hideInMenu: true
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePassword,
      hideInMenu: true
    },
    {
      path: '/disbursement',
      name: 'disbursement',
      component: Disbursement,
      hideInMenu: true
    },
    {
      path: '/collection-service-registration',
      name: 'collection-service',
      component: CollectionService,
      hideInMenu: true
    },
  ]
}

export const setRoutes = (routes: any[]) => {
  resetRoutes();
  // @ts-ignore
  globalThis.routes[0].routes[1].routes.push(...routes);
};
