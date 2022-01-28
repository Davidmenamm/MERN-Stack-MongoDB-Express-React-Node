import React from 'react'
import Cover from './Cover'
import Page from './Page'
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  console.log('id', id);
  return (
    <>
      <Cover cover_img = {}/>
      <Page person = {}/>
    </>
  )
}
