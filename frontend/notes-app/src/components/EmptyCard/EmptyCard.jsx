import React from 'react'
import { motion } from 'framer-motion'


export default function EmptyCard({ imgSrc, message }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-12">
      {/* Floating animation for the image */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 20 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <img 
          src={imgSrc} 
          alt='No notes' 
          className='w-60 opacity-80'
        />
      </motion.div>

      {/* Text with fade animation */}
      <motion.p 
        className='w-full max-w-md text-lg font-medium text-gray-600 text-center mt-8 px-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {message}
      </motion.p>

      
    </div>
  )
}