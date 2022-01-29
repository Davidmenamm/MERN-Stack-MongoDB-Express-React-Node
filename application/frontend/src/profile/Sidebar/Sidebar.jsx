import React from 'react'
import { Box } from '@chakra-ui/react'
import Actions from './Actions'
import Data from './Data'
import Profile from './Profile'

function Sidebar({person, set_person, update_person}) {
  return (
    <Box
      as="aside"
      flex={1}
      mr={{ base: 0, md: 5 }}
      mb={{ base: 5, md: 0 }}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="brand.light"
      style={{ transform: 'translateY(-100px)' }}
    >
      <Profile
        name={person.name}
        lastname={person.apellido}
        profile_img={person.image}
        set_profile_img={set_person}
        update_person={update_person}
      />
      <Data />
      <Actions />
    </Box>
  )
}

export default Sidebar
