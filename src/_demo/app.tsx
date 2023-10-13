import { MenuOutlined } from '@ant-design/icons';
import { createSchemaField } from '@formily/react';
import { FloatButton, Dropdown, ConfigProvider, notification, Spin, Skeleton, Input, Button, Typography } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ConfigStore, ConfigStoreProvider, INotifier, SchemaComponentsProvider, SchemaFieldProvider, httpRequest, judgeValidKey, withValueChildren } from '../library';

import { ErrorContent } from './error-content';
import { ROUTER_MENUS, Router } from './router';


const components = {
  Typography,
  Title: withValueChildren(Typography.Title),
  Input: (props: any) => <Input {...props} onChange={e => props?.onChange?.(e.target.value, e)} />,
  Button,
};

const SchemaField = createSchemaField({ components });

export const defaultConfig = {
  // static: staticConfig,
  // version: versionConfig,
  // deep: deepConfig,

  versionKey: '',
  apiHost: '',
  uploadAPI: '',
  indexPage: '',
  pageCachePrefix: '',
};

export type IConfig = typeof defaultConfig;


// eslint-disable-next-line complexity
export const notifier: INotifier = (type, msg, options) => {
  if (type === 'close') {
    notification.destroy(msg ?? options?.key);
    return;
  }
  if (type === 'config') {
    options && notification.config(options);
    return;
  }
  if (judgeValidKey(type, notification)) {
    const fn = notification[type] as Function;
    if (typeof fn === 'function') {
      fn({ message: titleMap[type], ...options, description: msg || options?.description });
    };
  }
};

const useRouter = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  return { location, params, navigate };
};

export const configStore: ConfigStore<typeof defaultConfig> = new ConfigStore(
  defaultConfig,
  {
    notifier,
    apiExecutor: httpRequest,
    useRouter,
    components: {
      Loading: Spin,
      Skeleton,
      ErrorContent,
    },
  },
);


function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <ConfigStoreProvider value={configStore}>
        <SchemaComponentsProvider value={components}>
          <SchemaFieldProvider value={SchemaField}>
            <div className="App" style={{ minHeight: '100%', padding: 20, boxSizing: 'border-box' }}>
              <Router />
              <FloatButton
                shape='square'
                description={(
                  <Dropdown menu={{ items: ROUTER_MENUS }} >
                    <div style={{ width: 40, height: 40, display: 'flex', justifyContent: 'center' }}><MenuOutlined rev="菜单" /></div>
                  </Dropdown>
                )}
              />
            </div>
          </SchemaFieldProvider>
        </SchemaComponentsProvider>
      </ConfigStoreProvider>
    </ConfigProvider>
  );
}

const titleMap = {
  success: '成功',
  error: '错误',
  info: '提示',
  warning: '警告',
  warn: '警告',
  confirm: '确认',
  loading: '加载',
};


export default App;

