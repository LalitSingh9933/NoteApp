import React, { useState } from 'react'
import TagInput from '../../components/input/TagInput'
import { MdClose } from 'react-icons/md';


export default function AddEditNotes({ noteData, type, onClose }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);
    //Add Note

     const addNewNote =  async() => {};
    //Edit Note
     const editNote = async() =>{};
    
        const handleAddNote = () => {
            if (title.trim() === "" || content.trim() === "") {
                setError("Title and content cannot be empty");
                return;
            }
            setError(null);
            if (type === "edit") {
                EditNote();
            }
            else {
                addNewNote();
            }
        }
    


return (
    <div className=' relative'>
        <button className=' w-10 h-10 rounded-full flex justify-center items-center -top-3 -right-3 hover:bg-slate-50 absolute '
            onClick={onClose}>
            <MdClose />
        </button>
        <div className='flex flex-col gap-2'>
            <label className='input-label'>
                TITLE
            </label>
            <input
                type='text'
                className='text-2xl text-slate-950 outline-none  bg-slate-50 p-2'
                placeholder='Go to Gym at 6:00 PM'
                value={title}
                onChange={({ target }) => setTitle(target.value)}
            />
        </div>
        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-label'>
                CONTENT
            </label>
            <textarea
                className='text-sm  text-slate-950 outline-none bg-slate-50 p-2 rounded'
                placeholder='Content'
                rows={10}
                value={content}
                onChange={({ target }) => setContent(target.value)} />
        </div>
        <div className='mt-3'>
            <label className='input-label pr-2'>
                TAGS:
            </label>
            <TagInput
                tags={tags}
                setTags={setTags}
            />
            {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        </div>
        <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
            {type === "edit" ? "Update" : "Add"}
        </button>
    </div>
)
}
    


