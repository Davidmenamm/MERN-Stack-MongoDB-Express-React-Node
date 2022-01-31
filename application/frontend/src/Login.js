import React, { Component } from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link } from '@material-ui/core';
const axios = require('axios');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  componentDidMount = () => {
    // check token
    let token = localStorage.getItem('token');
    if (token) {
      // check type of user
      let typeAccount = localStorage.getItem('typeAccount');
      console.log(typeAccount);
      if(typeAccount){
        if(typeAccount==="admin"){
          this.props.history.push('/dashboard');
        } else {
          this.props.history.push('/profile/user');
        }
      }
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {

    const pwd = bcrypt.hashSync(this.state.password, salt);

    axios.post('http://localhost:2000/login', {
      username: this.state.username,
      password: pwd,
    }).then((res) => {
      console.log('RESS', res);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);
      localStorage.setItem('id', res.data.id);
      localStorage.setItem('typeAccount', res.data.typeAccount);
      if(res.data.typeAccount==="admin") this.props.history.push('/dashboard')
      else this.props.history.push('/profile/user');
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div style={{ marginTop: '200px'}}>
        <div>
          <p style={{ fontSize: '28px', color: '#2B6CB0'}}>Login</p>
          <br/><br/>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="#2B6CB0"
            size="medium"
            disabled={this.state.username == '' && this.state.password == ''}
            onClick={this.login}
          >
            Login
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {/* <Link href="/register" style={{ color: '#2B6CB0' }}>
            Register
          </Link> */}
        </div>
      </div>
    );
  }
}
