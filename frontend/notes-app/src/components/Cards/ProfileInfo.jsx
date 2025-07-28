import React from 'react'
import { getInitials } from '../../utils/helper'

export default function ProfileInfo({ userInfo, onLogout }) {
  return (
    <div className=' flex items-center gap-3'>
      <div className='w-12 h-12 flex  items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
        {getInitials(userInfo?.fullName)}</div>
      <div >
        <p className='text-sm font-medium'>{userInfo?.fullName}</p>
        <button
          className="text-sm text-slate-600 hover:text-slate-800 transition-colors duration-200 relative group"
          onClick={onLogout}
        >
          <span className="relative">
            Logout
            <span className="absolute bottom-0 left-0 w-0 h-px bg-slate-600 group-hover:w-full transition-all duration-300 ease-out"></span>
          </span>
        </button>
      </div>

    </div>
  )
}
