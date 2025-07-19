import React, { useState } from 'react';
import { MdAdd ,MdClose } from 'react-icons/md';

export default function TagInput({ tags, setTags }) {
    const [inputValue, setInputValue] = useState("");
    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }
    const addNewTag = () => {
        if (inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addNewTag();
        }
    };
    const handleRemoveTag = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };
    return (
        <div>
            <div>
                {tags?.length>0 &&(
                    <div className='flex flex-wrap gap-2 items-center mt-2'>
                        {tags.map((tag, index) => (
                            <span key={index} className='bg-slate-200 text-slate-800 px-2 py-1 rounded-full text-sm'>
                                {tag}
                                <button onClick={() => {handleRemoveTag(index)}}>
                                    <MdClose/>

                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className='flex items-center gap-4 mt-3'>
                <input
                    type='text'
                    value={inputValue}
                    className='text-sm  px-3 pt-2 pb-2 rounded outline-none bg-slate-100 '
                    placeholder='Add tags'
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown} />
                <button className='w-8 h-8 flex items-center justify-center border border-green-700 hover:bg-green-700 rounded-xl'
                    onClick={() => { addNewTag(); }}>
                    <MdAdd className=' text-green-500 hover:text-white text-2xl' />

                </button>
            </div>
        </div>
    )
}
