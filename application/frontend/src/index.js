import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Redirect, Route } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Profile from './profile';
import store from './redux/store'
// import CssBaseline from '@material-ui/core/CssBaseline';
import './index.css';
import { theme } from './constants/theme'
import { ChakraProvider } from '@chakra-ui/react'


ReactDOM.render(
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>,
    document.getElementById('root')
);