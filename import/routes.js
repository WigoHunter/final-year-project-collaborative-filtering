import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App, { TodoListContainer } from './ui/App.js';
import { ReviewListContainer } from './ui/Review.js';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={TodoListContainer} />
      <Route path="todo" component={TodoListContainer} />
      <Route path="text-analysis" component={ReviewListContainer} />
    </Route>
  </Router>
);