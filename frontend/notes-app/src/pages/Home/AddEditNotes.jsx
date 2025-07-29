import React, { useState, useEffect } from 'react';
import TagInput from '../../components/input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '@/utils/axiosInstance';

export default function AddEditNotes({ noteData, type, getAllNotes, onClose, showToastMessage }) {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (type === 'edit' && noteData) {
            setTitle(noteData.title);
            setContent(noteData.content);
            setTags(noteData.tags);
        }
    }, [noteData, type]);

    const addNewNote = async () => {
        setIsLoading(true);
        try {

            const response = await axiosInstance.post('/add-note', {
                title,
                content,
                tags
            });
            if (response.data?.note) {
                showToastMessage("Note added successfully", "add");
                await getAllNotes();
                onClose();
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to add note. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const editNote = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.put(`/edit-note/${noteData._id}`, {
                title,
                content,
                tags
            });
            if (response.data?.note) {
                showToastMessage("Note updated successfully", "edit");
                await getAllNotes();
                onClose();
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to update note. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            setError("Title cannot be empty");
            return;
        }
        if (!content.trim()) {
            setError("Content cannot be empty");
            return;
        }
        setError(null);

        if (type === "edit") {
            editNote();
        } else {
            addNewNote();
        }
    };

    return (
        <div className='relative p-4 bg-white rounded-lg shadow-lg'>
            <button
                className='absolute top-2 right-2 w-8 h-8 rounded-full flex justify-center items-center hover:bg-slate-100 transition-colors'
                onClick={onClose}
            >
                <MdClose className='text-gray-600' />
            </button>

            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                        TITLE
                    </label>
                    <input
                        type='text'
                        className='text-lg text-gray-900 outline-none border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='Write some note at 9:00 PM'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                        CONTENT
                    </label>
                    <textarea
                        className='text-sm text-gray-900 outline-none border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='Content'
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium text-gray-700'>
                        TAGS
                    </label>
                    <TagInput
                        tags={tags}
                        setTags={setTags}
                    />
                </div>

                {error && (
                    <p className='text-red-500 text-sm mt-1'>{error}</p>
                )}

                <button
                    className={`btn-primary font-medium mt-2 p-2 rounded-md transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        'Processing...'
                    ) : type === "edit" ? (
                        'Update Note'
                    ) : (
                        'Add Note'
                    )}
                </button>
            </div>
        </div>
    );
}