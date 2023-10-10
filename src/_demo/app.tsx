import { MenuOutlined } from '@ant-design/icons';
import { FloatButton, Dropdown, MenuProps } from 'antd';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { ArrayBaseDemo } from './components/array-base';

import { IndexDemo } from '.';

export const ROUTES_CONF: Array<IRouteConf> = [
  { path: '/', component: IndexDemo, name: 'index' },
  {
    path: '/components', name: '组件',
    children: [{ path: '/arrayBase', component: ArrayBaseDemo, name: '数组基础 - ArrayBase' }],
  },
];

const routes: Array<IRoute> = [];

const handleRoutesConf = (routesConfig: Array<IRouteConf>, baseUrl = '') => routesConfig.forEach((route) => {
  // 如果有子路由，则递归渲染子路由
  if ('children' in route && route.children) {
    handleRoutesConf(route.children, baseUrl + route.path);
  } else if ('component' in route && route.component) {
    routes.push({ name: route.name, component: route.component, path: baseUrl + route.path });
  }
});

handleRoutesConf(ROUTES_CONF);


const routesConfToMenus = (routes: Array<IRouteConf>, baseUrl = ''): MenuProps['items'] => routes.map((route) => {
  const path = baseUrl + route.path;

  if ('children' in route && route.children) {
    return {
      key: path,
      label: route.name,
      children: routesConfToMenus(route.children, path),
    };
  }
  return {
    key: path,
    label: <Link to={path}>{route.name}</Link>,
  };
});
function App() {
  return (
    <BrowserRouter>
      <div className="App" style={{ minHeight: '100%', padding: 20, boxSizing: 'border-box' }}>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={<route.component />} />
          ))}
        </Routes>
        <FloatButton
          shape='square'
          description={<Dropdown
            menu={{
              items: routesConfToMenus(ROUTES_CONF),
            }}
          >
            <div style={{ width: 40, height: 40, display: 'flex', justifyContent: 'center' }}><MenuOutlined rev="菜单" /></div>
          </Dropdown>}
        />
      </div>
    </BrowserRouter >
  );
}

export default App;

export type IRouteConf = {
  path: string
  name: string
} & ({ component?: React.FC<any> } | { children?: Array<IRouteConf> });

type IRoute = {
  path: string
  name: string
  component: React.FC<any>
};
