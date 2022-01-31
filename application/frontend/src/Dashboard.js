import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell, Grid
} from '@material-ui/core';
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import {RangeDatepicker} from 'chakra-dayzed-datepicker'
import Select1 from 'react-select'
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import {formatDate} from './utils/dates'
import {formatStatus} from './utils/conversions'
import { ACTIVE_VACCINE, COMPLETE_VACCINE, NO_VACCINE } from './constants/text';
import { MenuItem } from 'material-ui';
const axios = require('axios');

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProductModal: false,
      openProductEditModal: false,
      typeAccount : '',
      id: '',
      name: '',
      apellido: '',
      cedula: '',
      correo: '',
      file: '',
      fileName: '',
      page: 1,
      products: [],
      dateRange: [ new Date().setDate(new Date().getDate()-1000), new Date() ],
      search: '',
      searchStatus: '',
      searchType: '',
      searchInitDate: '',
      searchEndDate: '',
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token ) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getProduct('name');
        let typeAccount = localStorage.getItem('typeAccount');
        if(typeAccount !== 'admin'){
          this.props.history.push('/profile/user');
        }
      });
    }
  }

  getProduct = (options) => {    
    this.setState({ loading: true });
    // search
    let data = '?';
    // page
    data = `${data}page=${this.state.page}`;
    console.log(
      'Searches',
      this.state.search,
      this.state.searchStatus,
      this.state.searchType,
      this.state.searchInitDate,
      this.state.searchEndDate,
    )
    // search name
    if ( this.state.search ) {
      data = `${data}&search=${this.state.search}`;
    }
    // search status
    if ( this.state.searchStatus ) {
      data = `${data}&searchStatus=${this.state.searchStatus}`;
    }
    // search type
    if ( this.state.searchType ) {
      data = `${data}&searchType=${this.state.searchType}`;
    }
    // date ranges
    if (this.state.searchInitDate && this.state.searchEndDate){
      data = `${data}&initDate=${this.state.searchInitDate}&endDate=${this.state.searchEndDate}`;
    }
    // call API
    axios.get(`http://localhost:2000/get-product${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      console.log('res.data.products', res.data.products);
      this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, products: [], pages: 0 },()=>{});
    });
  }

  handleDelete = (id) => {
    axios.post('http://localhost:2000/delete-product', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  searchDate = () => {
    // search
    this.setState(
      { page: 1, searchInitDate: formatDate(this.state.dateRange[0]), searchEndDate: formatDate(this.state.dateRange[1]) }
      , () => { this.getProduct('name');
        console.log('in_vaccine_dates') }
    );
  }

  handleVaccine = (response, name) => {
    console.log('NAME', name, response);
    if (name === 'vaccine_dates'){    
      const date = new Date(response[0])
      // date range states
      if ( date > this.state.dateRange[1] ){ // greater than end date
        this.setState((prevState, props) => ({ dateRange: [new Date(prevState.dateRange[1]), date] }),
          () => { console.log('daterange1', this.state.dateRange); this.searchDate()}
        );
      }
      else if ( date <= this.state.dateRange[1] ) { // greater than end date
        this.setState((prevState, props) => ({ dateRange: [date, new Date(prevState.dateRange[1])] }),
          () => { console.log('daterange2', this.state.dateRange); this.searchDate()}
        );
      }
      console.log('daterange3', this.state.dateRange);
      
    // vaccine status
    } else if (name === 'vaccine_status') {
      // search
      this.setState(
        { page: 1, searchStatus: response.value }
        , () => { this.getProduct(name) }
      );
    // vaccine type
    } else if (name === 'vaccine_type') {
      // search
      this.setState(
        { page: 1, searchType: response.value }
        , () => { this.getProduct(name) }
      );
    }
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getProduct('name');
    });
  }

  logOut = () => {    
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('type_account');
    localStorage.removeItem('id');
    this.props.history.push('/');
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    console.log(e.target.name);
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getProduct('name');
      });
    }
  };

  handleResetDate = (e) => {    
    const initDt = new Date().setDate(new Date().getDate()-1000);
    const endDt = new Date();
    const searchInitDt = formatDate( (new Date().setDate(new Date().getDate()-1000)) );
    const searchEndDt = formatDate( new Date() );
    this.setState(
      { dateRange: [initDt, endDt],
        searchInitDate: searchInitDt, searchEndDate: searchEndDt
      },
    () => {
      this.getProduct('name');
    });
  };

  addProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    console.log( fileInput.files[0] );
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('apellido', this.state.apellido);
    file.append('correo', this.state.correo);
    file.append('cedula', this.state.cedula);
    file.append('typeAccount', this.state.typeAccount);

    axios.post('http://localhost:2000/add-employee', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleProductClose();
      this.setState({ typeAccount: '', name: '', apellido: '', correo: '', cedula: '', file: null, page: 1 }, () => {
        this.getProduct('name');
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleProductClose();
    });

  }

  updateProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('apellido', this.state.apellido);
    file.append('correo', this.state.correo);
    file.append('cedula', this.state.cedula);
    file.append('typeAcccount', this.state.typeAccount);

    axios.post('http://localhost:2000/update-person', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleProductEditClose();
      this.setState({ typeAccount: '', name: '', apellido: '', correo: '', cedula: '', file: null }, () => {
        this.getProduct('name');
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleProductEditClose();
    });

  }

  handleProductOpen = () => {
    this.setState({
      openProductModal: true,
      typeAccount: '',
      id: '',
      name: '',
      apellido: '',
      cedula: '',
      correo: '',
      fileName: ''
    });
  };

  handleProductClose = () => {
    this.setState({ openProductModal: false });
  };

  handleEdit = (data) => {
    console.log('row', data);
    this.setState({
      openProductEditModal: true,
      typeAccount: data.typeAccount,
      id: data._id,
      name: data.name,
      apellido: data.apellido,
      cedula: data.cedula,
      correo: data.correo,
      fileName: data.image
    });
  };

  handleView = (data) => {
    // encode obj to base 64
    let objJsonStr = JSON.stringify(data);
    let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
    // change screen and send encoded string
    this.props.history.push(`/profile/${objJsonB64}`);    
  };

  handleProductEditClose = () => {
    this.setState({ openProductEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <br />
          <p style={{ fontSize: '35px'}}>  Kruger Corp</p>
          <br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
          >
            Add Employee
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        {/* Edit Product */}
        <Dialog
          open={this.state.openProductEditModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Employee</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Nombres"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="apellido"
              value={this.state.apellido}
              onChange={this.onChange}
              placeholder="Apellidos"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="cedula"
              value={this.state.cedula}
              onChange={this.onChange}
              placeholder="Cédula"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="correo"
              value={this.state.correo}
              onChange={this.onChange}
              placeholder="Correo Electrónico"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="typeAccount"
              value={this.state.typeAccount}
              onChange={this.onChange}
              placeholder="Tipo de Cuenta"
              required
            /><br /><br />
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                id="standard-basic"
                type="file"
                accept="image/*"
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == '' || this.state.apellido == '' ||
                this.state.correo == '' || this.state.cedula == '' ||
                this.state.typeAccount == ''}
              onClick={(e) => this.updateProduct()} color="primary" autoFocus>
              Edit Employee
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Employee */}
        <Dialog
          open={this.state.openProductModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Employee</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Nombres"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="apellido"
              value={this.state.apellido}
              onChange={this.onChange}
              placeholder="Apellidos"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="cedula"
              value={this.state.cedula}
              onChange={this.onChange}
              placeholder="Cédula"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="correo"
              value={this.state.correo}
              onChange={this.onChange}
              placeholder="Correo Electrónico"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="typeAccount"
              value={this.state.typeAccount}
              onChange={this.onChange}
              placeholder="Tipo de Cuenta"
              required
            /><br /><br />
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                id="standard-basic"
                type="file"
                accept="image/*"
                // inputProps={{
                //   accept: "image/*"
                // }}
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
                required
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == '' || this.state.apellido == '' ||
                this.state.correo == '' || this.state.cedula == '' ||
                this.state.typeAccount == '' || this.state.file == null}
              onClick={(e) => this.addProduct()} color="primary" autoFocus>
              Add Employee
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <TableContainer  style={{padding: '20px'}}>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Buscar por el nombre"
            required
          />
          <Table aria-label="simple table" >
            <TableHead>
              <TableRow>
                <TableCell align="left">Nombre</TableCell>
                <TableCell align="center">Foto</TableCell>
                <TableCell align="center">
                  <p>Estado</p>
                  <Select1
                    onChange={e => this.handleVaccine(e, 'vaccine_status')}
                    options={[
                      { value: "0", label: 'No' },
                      { value: "1", label: 'Activo' },
                      { value: "2", label: 'Completo' },
                      { value: "", label: 'Todos' }
                    ]}
                  />
                </TableCell>
                <TableCell align="center">
                  <p>Tipo</p>
                  <Select1
                    onChange={e => this.handleVaccine(e, 'vaccine_type')}
                    options={[
                      { value: "Pfizer", label: 'Pfizer' },
                      { value: "AstraZeneca", label: 'AstraZeneca' },
                      { value: "Johnson", label: 'Johnson' },
                      { value: "CoronaVac", label: 'CoronaVac' },
                      { value: "Sputnik", label: 'Sputnik' },
                      { value: "", label: 'Todos' }
                    ]}
                  />
                </TableCell>
                <TableCell align="center">
                  <p>Última Fecha</p>
                  <Grid container justifyContent="center">
                    <Grid key={'range_dates'} item>
                      <FormControl id="vaccine_date_range">
                        <RangeDatepicker
                          name="vaccine_range"
                          selectedDates={this.state.dateRange} // {formattedDate}
                          onDateChange={ dts => {
                            this.handleVaccine(dts, 'vaccine_dates');
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid key={'button_dates'} item>
                      <button
                          type="button"
                          className="narrow_button_style"
                          onClick={this.handleResetDate}
                        >
                      R
                      </button>
                    </Grid>
                    
                  </Grid>
                </TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log('productss', this.state.products)}
              {this.state.products.map((row) => (
                <TableRow key={`${row.name}-${row.apellido}`}>
                  <TableCell align="left" component="th" scope="row">
                      {`${row.name} ${row.apellido}`}
                  </TableCell>
                  <TableCell align="center"><img src={`http://localhost:2000/${row.image}`} width="70" height="70" /></TableCell>
                  <TableCell align="center">{formatStatus(row.vaccine_status)}</TableCell>
                  <TableCell align="center">{row.vaccine_type}</TableCell>
                  <TableCell align="center">{formatDate(row.vaccine_date)}</TableCell>
                  <TableCell align="center">
                    <Button
                      type = "button"
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleView(row)}
                    >
                      View
                    </Button>
                    <Button
                      type = "button"
                      className="button_style"
                      variant="outlined"
                      size="small"
                      onClick={(e) => this.handleEdit(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      type = "button"
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.handleDelete(row._id)}
                    >
                      Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>

      </div>
    );
  }
}