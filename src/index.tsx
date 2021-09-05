import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { ConfigProvider } from 'antd';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import './var.less';
import 'antd/dist/antd.variable.min.css';
import './antd-override.css';
import './index.css';

let store = createStore(reducers);

export { store };

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
