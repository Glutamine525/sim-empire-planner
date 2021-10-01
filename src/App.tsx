import { DarkColor, LightColor, ThemeType } from '@/types/theme';
import React, { FC, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Map from '@/pages/map';
import { connect } from 'react-redux';
import { store } from '.';
import { InitState } from '@/types/state';
import { ActionType } from '@/types/action';
import { message } from 'antd';
import Loading from './components/loading';

interface AppProps {
  isLoading: boolean;
  theme: ThemeType;
}

const App: FC<AppProps> = (props: AppProps) => {
  const { isLoading, theme } = props;

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (isDarkMode) {
      store.dispatch({
        ...InitState,
        type: ActionType.ChangeTheme,
        theme: ThemeType.Dark,
      });
    }
    message.config({
      top: 50,
      duration: 2,
      maxCount: 3,
    });
  }, []);

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

const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
