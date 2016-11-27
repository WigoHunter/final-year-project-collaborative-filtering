import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import AccountsUIWrapper from './Accounts.js';

import { Todos } from '../api/todos.js';

const App = ({ children }) => (
  <div>
    <div className="navi">
      <h3>FYP - Personalised Review System</h3>
      <ul>
        <li><AccountsUIWrapper /></li>
        <Link to="/"><li>Home</li></Link>
      </ul>
    </div>
    <div className="content">
      {children}
    </div>
  </div>
);

export default App;

export const Home = ({}) => (
  <div className="home">
    <div className="head">
      <h2>Final Year Project</h2>
      <p>- Personalised Review System -</p>
    </div>
    <ul className="hotel-list">
      <Link to="/text-analysis/holiday-inn">
        <li className="hotel">
          <div className="pic">
            <img src="http://r-ec.bstatic.com/images/hotel/840x460/137/13767830.jpg" />
          </div>
          <div className="desc">
            <h2>Holiday Inn Express</h2>
            <h3>83 Jervois Street, Sheung Wan, Hong Kong 00000, China</h3>
            <h3>00 1 877-859-5095</h3>
          </div>
        </li>
      </Link>
      <Link to="/text-analysis/shangri-la">
        <li className="hotel">
          <div className="pic">
            <img src="https://cdn.kiwicollection.com/media/property/PR002772/xl/002772-01-suite-living-area-city-water-view.jpg" />
          </div>
          <div className="desc">
            <h2>Shangri-La Hong Kong</h2>
            <h3>64 Mody Road | Tsim Sha Tsui East, Kowloon, Hong Kong, China</h3>
            <h3>00 1 877-859-5095</h3>
          </div>
        </li>
      </Link>
    </ul>
  </div>
);
