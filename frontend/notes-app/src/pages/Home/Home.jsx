import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NotesCard from '../../components/Cards/NotesCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'

// Set the app element for accessibility (adjust selector if needed)
Modal.setAppElement('#root');


export default function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  return (
    <>
      <Navbar />
      <div className='container mx-auto'>
        <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 mr-4 ml-4'>
          <NotesCard
            title=" Meeting on 7th April"
            date="3rd Apr 2024 "
            content=" Meeting on 7th April Meeting on 7th April
            dfjdlfjdlkfjlkd
            fdkfjdljlk"
            tags="#meeting"
            isPinned={true}
            onEdit={() => { }}
            onDelete={() => { }}
            onPinNote={() => { }}
          />
          <button className='w-16 h-16 flex justify-center items-center rounded-2xl bg-green-400 hover:bg-green-600 absolute right-10 bottom-10 '
            onClick={() => {
              setOpenAddEditModal({
                isShown: true, type: "add", data: null
              });
            }}>
            <MdAdd className='text-white text-[32px]' />
          </button>
          <Modal
            isOpen={openAddEditModal.isShown}
            onRequestClose={() => { }}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
            contentLabel="Add/Edit Note"
            className="w-[80%] max-h-[75%] md:w-[60%] lg:w-[50%] bg-white rounded-2xl mx-auto mt-8 p-5  "
          >
            <AddEditNotes
             onClose={() =>{
              setOpenAddEditModal({isShown:false, type:"add",data:null});
             }}
            />
          </Modal>


        </div>

      </div>
    </>
  )
}
