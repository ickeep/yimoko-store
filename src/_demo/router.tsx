import { MenuProps } from 'antd';
import { DataNode } from 'antd/es/tree';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import { ArrayBaseDemo } from './components/array-base';
import { AddPageDemo } from './components/page/add';

import { DetailPageDemo } from './components/page/detail';

import { EditPageDemo } from './components/page/edit';

import { ListPageDemo } from './components/page/list';

import { TriggerDemo } from './components/trigger';

import { IndexDemo } from '.';

export const ROUTES_CONF: Array<IRouteConf> = [
  { path: '/', component: IndexDemo, name: 'index' },
  {
    path: '/components/', name: '组件',
    children: [
      {
        path: 'page/', name: '页面', children: [
          { path: 'add', name: '添加', component: AddPageDemo },
          { path: 'detail', name: '详情', component: DetailPageDemo },
          { path: 'edit', name: '编辑', component: EditPageDemo },
          { path: 'list', name: '列表', component: ListPageDemo },
        ],
      },
      { path: 'trigger', component: TriggerDemo, name: '触发器 - Trigger' },
      { path: 'arrayBase', component: ArrayBaseDemo, name: '数组基础 - ArrayBase' },
    ],
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

export const Router = () => (
  <Routes>
    {routes.map(route => (<Route key={route.path} path={route.path} element={<route.component />} />))}
  </Routes>
);

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

export const ROUTER_MENUS = routesConfToMenus(ROUTES_CONF);

const routersToTreeData = (routes: Array<IRouteConf>, baseUrl = ''): Array<DataNode> => routes.map((route) => {
  const path = baseUrl + route.path;
  if ('children' in route && route.children) {
    return {
      title: route.name,
      key: path,
      children: routersToTreeData(route.children, path),
    };
  }
  return {
    title: <Link to={path}>{route.name}</Link>,
    key: path,
  };
});

export const ROUTER_TREE_DATA = routersToTreeData(ROUTES_CONF);


export type IRouteConf = {
  path: string
  name: string
} & ({ component?: React.FC<any> } | { children?: Array<IRouteConf> });

type IRoute = {
  path: string
  name: string
  component: React.FC<any>
};
