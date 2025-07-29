import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NotesCard from '../../components/Cards/NotesCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosinstance';
import moment from 'moment';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNoteImage from '../../assets/img/noteNotfound.png'
import NoNotes from '../../assets/img/nothing.png'

Modal.setAppElement('#root');

export default function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearch, setIsSearch] = useState(false)

  const navigate = useNavigate();

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg(prev => ({ ...prev, isShown: false }));
  };
  //get all userInfo
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user-details");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };
  //get all notes
  const getAllNotes = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data?.notes) {
        setUserNotes(response.data.notes);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };
  //delete
  const handleDeleteNote = async (id) => {
    try {
      await axiosInstance.delete(`/delete-note/${id}`);
      await getAllNotes();
      showToastMessage("Note deleted successfully", "delete");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  //pinhandel
  const handlePinNote = async (id, isPinned) => {
    try {
      const response = await axiosInstance.put(`/update-pin-status/${id}`, {
        isPinned: !isPinned // Toggle the current pin status
      });

      if (response.data.error === false) {
        await getAllNotes();
        showToastMessage(
          response.data.message,
          isPinned ? "edit" : "add"
        );
      }
    } catch (error) {
      console.error("Error pinning note:", error);
      showToastMessage("Failed to update pin status", "error");
    }
  };
  //Search for a Notes
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get('/search-notes', {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setUserNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);

    }
  };
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

      <div className="flex-1 px-4 py-8 overflow-y-auto max-h-[calc(100vh-64px)] container mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          userNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {userNotes.map((item) => (
                <NotesCard
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  date={moment(item.createdOn).format('Do MMM YYYY')}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => {
                    setOpenAddEditModal({
                      isShown: true,
                      type: "edit",
                      data: item
                    });
                  }}
                  onDelete={() => handleDeleteNote(item._id)}
                  onPinNote={() => handlePinNote(item._id, item.isPinned)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard imgSrc={isSearch ? NoNotes : AddNoteImage} message={isSearch ? `Oops! No note found  matching your search.` : `Start creating your notes! By Click on Add Button`} />
          )
        )}

        <button
          className="fixed bottom-8 right-8 w-16 h-16 flex justify-center items-center rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all"
          onClick={() => {
            setOpenAddEditModal({
              isShown: true,
              type: "add",
              data: null
            });
          }}
        >
          <MdAdd className="text-2xl" />
        </button>
      </div>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            maxHeight: '90vh',
            overflow: 'auto',
          }
        }}
        contentLabel="Add/Edit Note"
        className="w-[90%] md:w-[70%] lg:w-[50%] bg-white rounded-2xl mx-auto my-8 p-6 outline-none"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
}
