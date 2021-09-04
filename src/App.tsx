import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from '@/pages/main';
import Setting from '@/pages/setting';

const App = () => (
  <Router>
    <Route exact path="/" component={Main} />
    <Route exact path="/setting" component={Setting} />
  </Router>
);

export default App;
