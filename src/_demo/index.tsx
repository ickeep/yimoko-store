import { Tree } from 'antd';

import { DataNode } from 'antd/es/tree';
import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { ROUTES_CONF, IRouteConf } from './app';


export const IndexDemo = () => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  useEffect(() => {
    const routersToTreeData = (routes: Array<IRouteConf>, baseUrl = ''): Array<DataNode> => routes.map((route) => {
      // 如果有子路由，则递归渲染子路由
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

    setTreeData(routersToTreeData(ROUTES_CONF));
  }, []);
  return (
    <div>

      <Tree
        treeData={treeData}
      />
    </div>
  );
};
