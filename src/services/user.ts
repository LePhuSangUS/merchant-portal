import request from '@/utils/request';
import { history } from 'umi';
import { stringify } from 'querystring';
import { getUser } from '@/utils/storage';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  const user = getUser();
  if (!user) {
    history.replace({
      pathname: "/user/login",
      search: stringify({
        redirect: window.location.href,
      }),
    });
  }
  const profile = user?.profile || {};
  return {
    name: profile.fullName,
    avatar: profile.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    userId: profile.userId,
    app: profile.app,
    org: profile.org,
    email: profile.email,
    signature: 'signature',
    title: 'title',
    group: 'Group',
    tags: [
      // {
      //   key: '1',
      //   label: 'Label 1',
      // }
    ],
    notifyCount: 0,
    unreadCount: 0,
    country: 'Vietnam',
    geographic: {
      province: {
        label: 'Province',
        key: '1',
      },
      city: {
        label: 'City',
        key: '2',
      },
    },
    address: '66 Pho Duc Chinh',
    phone: '0969806202',
  }
}

export async function queryNotices(): Promise<any> {
  // TODO: Get notices
  // return [
  //   {
  //     id: '000000001',
  //     avatar: '',
  //     title: 'Title 1',
  //     datetime: '2017-08-09',
  //     type: 'notification',
  //   }
  // ]
  return [];
}
