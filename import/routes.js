import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App, { Home } from './ui/App.js';
import { ReviewListContainer } from './ui/Review.js';
import { HolidayInn, ShangriLa } from './ui/Hotels.js';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="text-analysis" component={ReviewListContainer}>
        <Route path="holiday-inn" component={HolidayInn} />
        <Route path="shangri-la" component={ShangriLa} />
      </Route>
    </Route>
  </Router>
);
