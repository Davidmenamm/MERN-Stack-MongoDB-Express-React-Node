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
} from '@chakra-ui/react'
import {SingleDatepicker} from 'chakra-dayzed-datepicker'
import { Radio, RadioGroup } from '@material-ui/core'

function PerfilSalud({set_person, person, vaccine_status, vaccine_type, vaccine_date, vaccine_dosis}) {
  // format input date
  const [formattedDate, setFormattedDate] = useState(new Date());
  const formatInputDate = () => {
    let initial_format = new Date(vaccine_date);
    let formatted_date_str = initial_format.getFullYear() + "-" + (initial_format.getMonth() + 1) + "-" + initial_format.getDate();
    setFormattedDate (new Date(formatted_date_str));
  }
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
            <Radio value="1"></Radio>
            <p>Activo</p>
            <Radio value="2"></Radio>
            <p>Completo</p>
            <Radio value="3"></Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl id="vaccine_type">
        <FormLabel>Tipo de Vacuna</FormLabel>
        <Input
          value={vaccine_type}          
          onChange={ e => set_person({...person, vaccine_type: e.target.value}) }
          focusBorderColor="brand.blue"
          type="text"
          placeholder="Pfizer" />
      </FormControl>
      <FormControl id="vaccine_dosis">
        <FormLabel>Número de Dosis</FormLabel>
        <NumberInput
          value={vaccine_dosis}          
          onChange={ e => {
            set_person({...person, vaccine_dosis: e}) }
          }
          focusBorderColor="brand.blue"
          placeholder={"1717842152"}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>
      <FormControl id="vaccine_date">
        <FormLabel>Fecha de Vacunación</FormLabel>
        <SingleDatepicker
          name="date-input-vaccine"
          date={formattedDate}
          onDateChange={ dt => {
            set_person({...person, vaccine_date: dt});
            setFormattedDate(dt);
          }
          }
        />
      </FormControl>
    </Grid>
  )
}

export default PerfilSalud
