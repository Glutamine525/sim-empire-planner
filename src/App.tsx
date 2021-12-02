import 'moment/locale/zh-cn';

import { message } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Map from '@/pages/map';
import { DarkColor, LightColor, ThemeType } from '@/types/theme';

import Loading from './components/loading';
import Home from './pages/home';
import NoMatch from './pages/no-match';
import { AppAction } from './state/reducers/app';
import { useAppCreators, useMapCreators, useValue } from './utils/hook';
import { getMiniMapInStorage, getThemeInStorage } from './utils/storage';

const App = () => {
  const { isLoading, theme } = useValue<AppAction>(state => state.app);
  const { changeIsLoading, changeTheme } = useAppCreators();
  const { changeMiniMap } = useMapCreators();

  useEffect(() => {
    moment.locale('zh-cn');
    const themeInStorage = getThemeInStorage();
    if (!themeInStorage) {
      const isDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      if (isDarkMode) {
        changeTheme(ThemeType.Dark);
      }
    } else {
      changeTheme(themeInStorage as ThemeType);
    }
    const miniMapInStorage = getMiniMapInStorage();
    if (miniMapInStorage === 'false') {
      changeMiniMap(false);
    }
    message.config({
      top: 50,
      duration: 2,
      maxCount: 3,
    });
    document.body.removeChild(document.getElementById('init-loading')!);
    changeIsLoading(false);
    document.addEventListener('contextmenu', event => event.preventDefault());
  }, []); // eslint-disable-line

  useEffect(() => {
    if (theme === ThemeType.Light) {
      // ConfigProvider.config({ theme: { primaryColor: '#25b864' } });
      Object.keys(LightColor).forEach(v => {
        document.body.style.setProperty(v, LightColor[v]);
      });
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      // ConfigProvider.config({ theme: { primaryColor: '#acb67c' } });
      Object.keys(DarkColor).forEach(v => {
        document.body.style.setProperty(v, DarkColor[v]);
      });
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  }, [theme]);

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/map" component={Map} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </Router>
      <Loading isLoading={isLoading} />
    </>
  );
};

export default App;
