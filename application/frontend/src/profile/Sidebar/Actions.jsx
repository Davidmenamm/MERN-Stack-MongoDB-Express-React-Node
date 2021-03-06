import React from 'react'
import { useEffect, useRef } from 'react'
import { useHistory } from "react-router-dom";
import {
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  useClipboard,
  VStack,
  Box
} from '@chakra-ui/react'

export default function Actions() {
  const value = 'https://apple.com/cook'
  const { hasCopied, onCopy } = useClipboard(value)
  let history = useHistory();
  let typeAccount = localStorage.getItem('typeAccount');

  const profileUrl = useRef(null)

  useEffect(() => {
    if (hasCopied) {
      profileUrl.current.focus()
      profileUrl.current.select()
    }
  })

  const logOut = () => {    
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('type_account');
    localStorage.removeItem('id');
    history.push('/');
  }
  
  const handle = (type) => {
    if (type === 'admin') {
      history.push("/dashboard");
    } else {
      logOut();
    }
  }

  return (
    <VStack py={8} px={5} spacing={3}>
      {/* <Button w="full" variant="outline">
        View Public Profile
      </Button>
      <InputGroup>
        <Input
          ref={profileUrl}
          type="url"
          color="brand.blue"
          value={value}
          userSelect="all"
          isReadOnly
          _focus={{ borderColor: 'brand.blue' }}
        />
        <InputRightAddon bg="transparent" px={0} overflow="hidden">
          <Button onClick={onCopy} variant="link">
            <svg width="1.2em" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </Button>
        </InputRightAddon>
      </InputGroup> */}
        <Box mt={5} py={5} px={8} borderTopWidth={1} borderColor="brand.light">
          <Button backgroundColor="brand.cadet" onClick={() => handle(typeAccount)}>
            {typeAccount === 'admin' ?  '<Return' : 'LogOut' }
          </Button>
        </Box>
    </VStack>
  )
}
