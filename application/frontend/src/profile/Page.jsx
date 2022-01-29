import React from 'react'
import { Container } from '@chakra-ui/layout'
import Content from './Content/Content'
import Sidebar from './Sidebar/Sidebar'

export default function Page({person, set_person, update_person}) {
  console.log('page', person);
  return (
    <Container display={{ base: 'block', md: 'flex' }} maxW="container.xl">
      <Sidebar person = {person} set_person={set_person} update_person={update_person}/>
      <Content person = {person} set_person={set_person} update_person={update_person}/>
    </Container>
  )
}
