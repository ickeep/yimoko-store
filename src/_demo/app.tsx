import { MenuOutlined } from '@ant-design/icons';
import { FloatButton, Dropdown } from 'antd';
import { BrowserRouter } from 'react-router-dom';

import { ROUTER_MENUS, Router } from './router';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter >
  );
}

export default App;

