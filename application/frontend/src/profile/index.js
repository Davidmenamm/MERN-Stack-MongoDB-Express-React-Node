import React, { useEffect, useLayoutEffect, useState } from 'react'
import Cover from './Cover'
import Page from './Page'
import { useParams, useHistory } from "react-router-dom";
import swal from 'sweetalert';
import axios from 'axios';

export default () => {
  console.log('HERE');
  // state
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState(null);
  // history
  const history = useHistory();
  // url params
  const { person_data } = useParams();
  let person_obj = null;
  if (person_data !== null && person_data !== 'user') {
    person_obj  = JSON.parse( Buffer.from(person_data, 'base64').toString('ascii') );
  }
  // use effect  
  useEffect(() => {
    setLoading(true);
    // set state
    setPerson({ ...person_obj });
    // token
    let token_temp = localStorage.getItem('token');
    // console.log ('TOKEN', token_temp)
    if (!token_temp) {
      // NOT logged in
      history.push('/login');
    } else {
      // YES logged in
      setToken( token_temp );
      // check person obj
      console.log('PARAMS', token, person);
      if(!person && person_obj === null){
        console.log ('TOKEN', token_temp)
        let id = localStorage.getItem('id');
        console.log ('ID', id)
        // API
        const params = `?id=${id}`;
        axios.get(`http://localhost:2000/get-employee${params}`, {
          headers: {
            'token': token_temp
          }
        }).then((res) => {
          console.log('RES2', res.data.updatePath);
          // update route to preserve ui functioning
          // history.push(`/profile/${res.data.updatePath}`)
          window.location.assign( `/profile/${res.data.updatePath}` );
        }).catch((err) => {
          console.log('RES1', err);
          swal({
            text: err.response.data.errorMessage,
            icon: "error",
            type: "error"
          });
        });
        // set state
        // setPerson({ ...person_obj });
      }
      // set loading
      setLoading(false);
    }
    return () => {
    };
  }, []);
  
  // update
  // update
  const updatePerson = () => {
    console.log('updatePerson');
    console.log(person);
    // prepare body
    // required parameters
    const file = new FormData();
    file.append('id', person._id);
    // file.append('file', person.image);
    file.append('name', person.name);
    file.append('apellido', person.apellido);
    file.append('correo', person.correo);
    file.append('cedula', person.cedula);
    // optional
    file.append('fechaNac', person.fechaNac);
    file.append('dir', person.dir);
    file.append('cel', person.cel);
    // vaccine related
    file.append('vaccine_status', person.vaccine_status);
    file.append('vaccine_type', person.vaccine_type);
    file.append('vaccine_date', person.vaccine_date);
    file.append('vaccine_dosis', person.vaccine_dosis);
    console.log('end params', token, person, file)
    // API
    axios.post('http://localhost:2000/update-person', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': token
      }
    }).then((res) => {
      console.log('RES', res.data.updatePath);
      // update route to preserve ui functioning
      history.replace({ pathname: `/profile/${res.data.updatePath}`})
      // alert
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }
  // return
  return (
    <>
      {loading === false && person && (
        <>
          <Cover cover_img = {person.image ? person.image : ""}/>
          <Page person = {person} set_person={setPerson} update_person={updatePerson}/>
        </>
      )}
    </>
  )
}
