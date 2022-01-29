import React from 'react'
import { Box, Button } from '@chakra-ui/react'

function Actions({update_person}) {
  return (
    <Box mt={5} py={5} px={8} borderTopWidth={1} borderColor="brand.light">
      <Button onClick={() => update_person()}>Update</Button>
    </Box>
  )
}

export default Actions
