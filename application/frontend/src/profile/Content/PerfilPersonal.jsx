import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,  
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'
import {SingleDatepicker} from 'chakra-dayzed-datepicker'

function PerfilPersonal(
  { set_person, person, nombre, apellido, cedula, correo, fechaNac, dir, cel } ) {
  
  // format input date
  const [formattedDate, setFormattedDate] = useState(new Date());
  const formatInputDate = () => {
    let initial_format = new Date(fechaNac);
    let formatted_date_str = initial_format.getFullYear() + "-" + (initial_format.getMonth() + 1) + "-" + initial_format.getDate();
    setFormattedDate (new Date(formatted_date_str));
  }
  
  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      gap={6}
    >
      <FormControl id="firstName">
        <FormLabel>Nombre</FormLabel>
        <Input
          value={nombre}
          onChange={ e => set_person({...person, name: e.target.value}) }
          focusBorderColor="brand.blue"
          type="text"
          placeholder="Pedro"
        />
      </FormControl>
      <FormControl id="lastName">
        <FormLabel>Apellido</FormLabel>
        <Input
          value={apellido}          
          onChange={ e => set_person({...person, apellido: e.target.value}) }
          focusBorderColor="brand.blue"
          type="text"
          placeholder="González"
        />
      </FormControl>
      <FormControl id="idCard">
        <FormLabel>Cédula</FormLabel>
        <NumberInput
          value={cedula}          
          onChange={ e => {
            set_person({...person, cedula: e}) }
          }
          focusBorderColor="brand.blue"
          placeholder={"1717842152"}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>
      <FormControl id="phoneNumber">
        <FormLabel>Teléfono Celular</FormLabel>
        <NumberInput
          value={cel}          
          onChange={ e => {
            set_person({...person, cel: e}) }
          }
          focusBorderColor="brand.blue"
          defaultValue={"0954152889"}
          placeholder={"0914292991"}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>
      <FormControl id="emailAddress">
        <FormLabel>Correo Electrónico</FormLabel>
        <Input
          value={correo}          
          onChange={ e => set_person({...person, correo: e.target.value}) }
          focusBorderColor="brand.blue"
          type="email"
          placeholder="example@gmail.com"
        />
      </FormControl>
      <FormControl id="address">
        <FormLabel>Dirección</FormLabel>
        <Input
          value={dir}
          onChange={ e => set_person({...person, dir: e.target.value}) }
          focusBorderColor="brand.blue"
          type="text"
          placeholder="Av. 6 de Diciembre y el Inca N24-188"
        />
      </FormControl>
      <FormControl id="birth_date">
        <FormLabel>Fecha de Nacimiento</FormLabel>
        <SingleDatepicker
          name="date-input-birth"
          date={formattedDate}
          onDateChange={ dt => {
            set_person({...person, fechaNac: dt});
            setFormattedDate(dt);
          }
          }
        />
      </FormControl>
    </Grid>
  )
}

export default PerfilPersonal
