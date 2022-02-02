import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Select
} from '@chakra-ui/react'
import {SingleDatepicker} from 'chakra-dayzed-datepicker'
import { Radio, RadioGroup } from '@material-ui/core'
import { formatDate } from '../../utils/dates';

function PerfilSalud({set_person, person, vaccine_status, vaccine_type, vaccine_date, vaccine_dosis}) {
  // return
  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      gap={6}
    >
      <FormControl id="vaccine_status">
        <FormLabel>Estado de Vacunación</FormLabel>
        <RadioGroup          
          onChange={ e =>{
            console.log(e.target.value)
            set_person({...person, vaccine_status: e.target.value}) }
          }
          value={vaccine_status}
        >
          <Stack  direction="row" align="center" spacing={1}>
            <p>No</p>
            <Radio value="0"></Radio>
            <p>Activo</p>
            <Radio value="1"></Radio>
            <p>Completo</p>
            <Radio value="2"></Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl id="vaccine_type">
        <FormLabel>Tipo de Vacuna</FormLabel>
        <Select
          focusBorderColor="brand.blue"
          placeholder="Seleccione..."
          value={vaccine_type}
          onChange={ e => {
            set_person({...person, vaccine_type: e.target.value}) }
          }
        >
          <option value="Pfizer">Pfizer</option>
          <option value="AstraZeneca">AstraZeneca</option>
          <option value="Johnson">Johnson</option>
          <option value="CoronaVac">CoronaVac</option>
          <option value="Sputnik">Sputnik</option>
          <option value="Ninguna">Ninguna</option>
        </Select>
      </FormControl>
      <FormControl id="vaccine_dosis">
        <FormLabel>Número de Dosis</FormLabel>
        <Select
          focusBorderColor="brand.blue"
          placeholder="Seleccione..."
          value={vaccine_dosis}
          onChange={ e => {
            set_person({...person, vaccine_dosis: e.target.value}) }
          }
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </Select>
      </FormControl>
      <FormControl id="vaccine_date">
        <FormLabel>Fecha de Vacunación</FormLabel>
        <SingleDatepicker
          name="date-input-vaccine"
          date={new Date(formatDate(vaccine_date))}
          onDateChange={ dt => {
            console.log('new Date(formatDate(vaccine_date))')
            console.log(new Date(formatDate(vaccine_date)))
            console.log(new Date())
            set_person({...person, vaccine_date: dt});
          }
          }
        />
      </FormControl>
    </Grid>
  )
}

export default PerfilSalud
