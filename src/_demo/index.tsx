import { Tree } from 'antd';
import React from 'react';

import { ROUTER_TREE_DATA } from './router';

export const IndexDemo = () => (<Tree treeData={ROUTER_TREE_DATA} />);
// export const IndexDemo = () => {
//   const [arr, setArr] = useState([1, 2, 3, 4, 5]);
//   return (<div>
//     <div style={{ height: 500, width: 500, background: '#eee', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
//       <div style={{ flexGrow: 1 }} >
//         {arr.map(item => <div key={item} style={{ height: item * 10, border: '1px solid #ccc' }}>{item}</div>)}
//       </div >
//     </div >
//     <Button onClick={() => setArr([...arr, arr.length + 1])}>添加</Button>
//   </div >);
// };
