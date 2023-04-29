import { getAllData } from '@/services/boxjs.api';
import { getMediaMode } from '@/utils';
import { RequestConfig } from '@@/plugin-request/request';

type Initial = {
  boxdata: boxjs.data;
  apps: boxjs.App[];
  fetchData: () => Promise<boxjs.data>;

  mode: 'light' | 'dark';
  ui: (data: boxjs.data) => UI;
  random: number;
};

export interface UI {
  iconThemeIdx: number;
  isTransparentIcons?: boolean;
  isSystemDarkMode: boolean;
  defaultIcons: string[];
  loadAppBaseInfo: any;
  isWallpaper: boolean;
  isMutiWallpaper?: boolean;
  bgimgs?: { name: string; url: string }[];
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<Initial> {
  const boxdata = await getAllData();
  let apps: boxjs.App[] = [...boxdata.sysapps];
  boxdata.usercfgs.appsubs.forEach((item) => {
    if (boxdata.appSubCaches[item.url]) {
      apps = [...apps, ...boxdata.appSubCaches[item.url].apps];
    }
  });
  const defaultMode: 'light' | 'dark' =
    boxdata?.usercfgs.theme !== 'auto'
      ? boxdata?.usercfgs.theme || 'light'
      : getMediaMode();

  return {
    boxdata,
    apps,
    random: Math.random(),
    mode: defaultMode,
    fetchData: getAllData,
    ui: (data = boxdata) => {
      const mode =
        boxdata?.usercfgs.theme !== 'auto'
          ? boxdata?.usercfgs.theme || 'light'
          : getMediaMode();
      const theme: UI = {
        iconThemeIdx: 0,
        isSystemDarkMode: getMediaMode() === 'dark',
        isTransparentIcons: data.usercfgs.isTransparentIcons,
        defaultIcons: [
          'https://raw.githubusercontent.com/Orz-3/mini/master/appstore.png',
          'https://raw.githubusercontent.com/Orz-3/task/master/appstore.png',
        ],
        isWallpaper: !!data.usercfgs.bgimg,
        bgimgs: data.usercfgs.bgimgs?.split('\n').map((item) => {
          const [name, url] = item.split(',');
          return { name, url };
        }),
        loadAppBaseInfo: null,
      };

      theme.isMutiWallpaper = theme.bgimgs && theme.bgimgs?.length > 2;

      theme.iconThemeIdx = mode === 'dark' && theme.isTransparentIcons ? 0 : 1;

      theme.loadAppBaseInfo = (app: boxjs.App) => {
        // 应用图标
        app.icons = Array.isArray(app.icons) ? app.icons : theme.defaultIcons;
        const isBrokenIcons = app.icons.find((i) =>
          i.includes('/Orz-3/task/master/'),
        );
        if (isBrokenIcons) {
          app.icons[0] = app.icons[0].replace(
            '/Orz-3/mini/master/',
            '/Orz-3/mini/master/Alpha/',
          );
          app.icons[1] = app.icons[1].replace(
            '/Orz-3/task/master/',
            '/Orz-3/mini/master/Color/',
          );
        }

        app.icon = app.icons[theme.iconThemeIdx];
      };

      return theme;
    },
  };
}

export const request: RequestConfig = {
  timeout: 50000,
  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [
    (url: string, options: any) => {
      return { url: `//boxjs.net${url}`, options };
    },
  ],
  responseInterceptors: [],
};