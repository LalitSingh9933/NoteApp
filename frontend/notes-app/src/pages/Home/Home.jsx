import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NotesCard from '../../components/Cards/NotesCard'


export default function Home() {
  return (
  <>
  <Navbar/>
  <div className='container mx-auto'>
<NotesCard/>
  </div>
  </>
  )
}
