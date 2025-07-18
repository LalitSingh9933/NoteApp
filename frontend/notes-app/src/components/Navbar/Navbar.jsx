import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileInfo from '../Cards/ProfileInfo';
import SearchBar from '../SearchBar/SearchBar';



const navigate = useNavigate;
export default function Navbar() {
  const [searchQuery, setSearchQuery]=useState("");
 
  const onLogout =() =>{
     navigate("/login")
  };
  const handleSearch =() =>{

  };
  const onClearSearch =() =>{
    setSearchQuery("");

  }
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className='text-xl font-medium text-black py-2'>Notes</h2>
     <SearchBar value={searchQuery}
      onChange={({ target})=> {
        setSearchQuery(target.value);
      }}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}/>
      <ProfileInfo onLogout={onLogout}/>
    </div>
  )
}
