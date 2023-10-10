import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ArrayBaseDemo } from './components/array-base';

const routes: Array<{ path: string, component: React.FC<any>, name: string }> = [
  { path: '', component: ArrayBaseDemo, name: '数组基础 - ArrayBase' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
