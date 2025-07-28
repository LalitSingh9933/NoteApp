// ToastMessage/Toast.js
import React, { useEffect } from 'react'
import { LuCheck } from 'react-icons/lu'
import { IoClose } from 'react-icons/io5'

export default function Toast({ isShown, message, type, onClose }) {
    useEffect(() => {
        if (isShown) {
            const timeoutId = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
    }, [isShown, onClose]);

    return (
        <div className={`fixed top-6 right-6 transition-all duration-300 z-50 ${isShown ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
            <div className={`
                min-w-64 bg-white shadow-lg rounded-lg overflow-hidden
                border-l-4 ${type === 'delete' ? 'border-red-500' : 'border-green-500'}
                relative
            `}>
                <div className='flex items-start gap-3 py-3 px-4'>
                    <div className={`
                        mt-1 flex-shrink-0 flex items-center justify-center 
                        rounded-full w-6 h-6 ${type === "delete" ? "bg-red-100" : "bg-green-100"}
                    `}>
                        {type === "delete" ? (
                            <IoClose className='text-sm text-red-500' />
                        ) : (
                            <LuCheck className="text-sm text-green-500" />
                        )}
                    </div>
                    <div className='flex-1'>
                        <p className='text-sm font-medium text-gray-800'>
                            {message || (type === 'delete' ? 'Note Deleted' : type === 'edit' ? 'Note Updated' : 'Note Added')} Successfully
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <IoClose className="text-lg" />
                    </button>
                </div>
                <div className={`h-1 w-full bg-gradient-to-r ${type === 'delete'
                    ? 'from-red-400 to-red-300'
                    : 'from-green-400 to-green-300'
                }`}></div>
            </div>
        </div>
    )
}