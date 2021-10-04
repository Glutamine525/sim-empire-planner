import { DarkColor, LightColor, ThemeType } from '@/types/theme';
import React, { FC, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Map from '@/pages/map';
import { connect } from 'react-redux';
import { message } from 'antd';
import Loading from './components/loading';
import { getMiniMapInStorage, getThemeInStorage } from './utils/storage';
import { changeMiniMap, changeTheme } from './actions';

interface AppProps {
  isLoading: boolean;
  theme: ThemeType;
  onChangeTheme: any;
  onChangeMiniMap: any;
}

const App: FC<AppProps> = (props: AppProps) => {
  const { isLoading, theme, onChangeTheme, onChangeMiniMap } = props;

  useEffect(() => {
    const themeInStorage = getThemeInStorage();
    if (!themeInStorage) {
      const isDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      if (isDarkMode) {
        onChangeTheme(ThemeType.Dark);
      }
    } else {
      onChangeTheme(themeInStorage);
    }
    const miniMapInStorage = getMiniMapInStorage();
    if (miniMapInStorage === 'false') {
      onChangeMiniMap(false);
    }
    message.config({
      top: 50,
      duration: 2,
      maxCount: 3,
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    if (theme === ThemeType.Light) {
      // ConfigProvider.config({
      //   theme: {
      //     primaryColor: '#25b864',
      //   },
      // });
      Object.keys(LightColor).forEach(v => {
        document.body.style.setProperty(v, LightColor[v]);
      });
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      // ConfigProvider.config({
      //   theme: {
      //     primaryColor: '#acb67c',
      //   },
      // });
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
        <Route exact path="/" component={Map} />
      </Router>
      <Loading isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    theme: state.TopMenu.theme,
    isLoading: state.App.isLoading,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onChangeTheme: (theme: ThemeType) => {
      dispatch(changeTheme(theme));
    },
    onChangeMiniMap: (showMiniMap: boolean) => {
      dispatch(changeMiniMap(showMiniMap));
    },
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
