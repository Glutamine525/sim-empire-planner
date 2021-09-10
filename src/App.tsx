import { DarkColor, LightColor, ThemeType } from '@/types/theme';
import React, { FC, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from '@/pages/main';
import Setting from '@/pages/setting';
import TopMenuContainer from '@/components/top-menu';
import { connect } from 'react-redux';
import { store } from '.';
import { InitState } from '@/types/state';
import { ActionType } from '@/types/action';

interface AppProps {
  Theme: ThemeType;
}

const App: FC<AppProps> = (props: AppProps) => {
  const { Theme } = props;

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
  }, []);

  useEffect(() => {
    if (Theme === ThemeType.Light) {
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
  }, [Theme]);

  return (
    <Router>
      <TopMenuContainer />
      <Route exact path="/" component={Main} />
      <Route exact path="/setting" component={Setting} />
    </Router>
  );
};

const mapStateToProps = (state: any) => {
  return {
    Theme: state.TopMenu.theme,
  };
};

const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
