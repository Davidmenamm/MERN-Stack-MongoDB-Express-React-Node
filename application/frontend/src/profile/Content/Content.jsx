import React from 'react'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

import PerfilPersonal from './PerfilPersonal'
import Actions from './Actions'
import PerfilSalud from './PerfilSalud'
import Notifications from './Notifications'

const Content = ({person, set_person, update_person}) => {
  const tabs = ['Personal', 'Salud', 'Notificaciones']
  console.log('CONTENT!', person)
  return (
    <Box
      as="main"
      flex={3}
      d="flex"
      flexDir="column"
      justifyContent="space-between"
      pt={5}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="gray.200"
      style={{ transform: 'translateY(-100px)' }}
    >
      <Tabs>
        <TabList px={5}>
          {tabs.map(tab => (
            <Tab
              key={tab}
              mx={3}
              px={0}
              py={3}
              fontWeight="semibold"
              color="brand.cadet"
              borderBottomWidth={1}
              _active={{ bg: 'transparent' }}
              _selected={{ color: 'brand.dark', borderColor: 'brand.blue' }}
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels px={3} mt={5}>
          <TabPanel>
            <PerfilPersonal
              set_person = {set_person}
              person = {person ? person : null}
              nombre = {person.name ? person.name : ""}
              apellido = {person.apellido ? person.apellido : ""}
              cedula = {person.cedula ? person.cedula : ""}
              correo = {person.correo ? person.correo : ""}
              fechaNac = {person.fechaNac ? person.fechaNac : ""}
              dir = {person.dir ? person.dir : ""}
              cel = {person.cel ? person.cel : ""}
            />
          </TabPanel>
          <TabPanel>
            <PerfilSalud
            set_person = {set_person}
            person = {person ? person : null}
            vaccine_status = {person.vaccine_status ? person.vaccine_status : ""}
            vaccine_type = {person.vaccine_type  ? person.vaccine_type : ""}
            vaccine_date = {person.vaccine_date  ? person.vaccine_date : ""}
            vaccine_dosis = {person.vaccine_dosis  ? person.vaccine_dosis : ""}
            />
          </TabPanel>
          <TabPanel>
            <Notifications />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Actions update_person={update_person}/>
    </Box>
  )
}

export default Content
