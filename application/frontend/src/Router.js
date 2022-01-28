import React, { Component } from 'react';
import { Switch, Redirect, Route } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Profile from './Profile';
import store from './redux/store'
import './index.css';

export default class Router extends React.Component {
  render() {
    return (      
      <Provider store={store}>
          <BrowserRouter>
              <Switch>
                  <Route exact path='/' component={Login} />
                  <Route exact path='/register' component={Register} />
                  <Route path='/profile' component={Profile} />
                  <Route path='/dashboard' component={Dashboard} />
                  {/* <Route component={NotFound}/> */}
              </Switch>
          </BrowserRouter>
      </Provider>
    );
  }
}
