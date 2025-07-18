import React from 'react'
import { useState } from 'react';
import { FaEye,FaEyeSlash } from "react-icons/fa";



export default function PasswordInput({ value, onChange, placeholder }) {
    const [isShowPassword, setIsPassword] = useState(false);
    const toggelShowPassword = () => {
        setIsPassword(!isShowPassword);
    }
    return (
        <div className=' flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3' >
            <input
            value={value}
            onChange={onChange}
            type= {isShowPassword ? "text": "password"}
            placeholder={placeholder || "Password"}
            className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'/>
            {isShowPassword ? (<FaEye
            size={22}
            className='text-green-600 cursor-pointer'
            onClick={()=> toggelShowPassword()}
            />): ( <FaEyeSlash
            size={22}
            className='text-slate-400 cursor-pointer '
            onClick={()=> toggelShowPassword()}/>)}
            
            
            
           


        </div>
    )
}
