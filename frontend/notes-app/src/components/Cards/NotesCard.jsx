import React, { useEffect, useState } from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';

const colorPalette = [
  'bg-blue-100', 'bg-green-100', 'bg-yellow-100',
  'bg-pink-100', 'bg-purple-100', 'bg-indigo-100',
  'bg-teal-100', 'bg-orange-100', 'bg-cyan-100',
  'bg-amber-100'
];

export default function NotesCard({
  id,
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote
}) {
  const [cardColor, setCardColor] = useState('bg-white');
  const [processedTags, setProcessedTags] = useState([]);

  useEffect(() => {
    const savedColor = localStorage.getItem(`noteColor_${id}`);
    if (savedColor && colorPalette.includes(savedColor)) {
      setCardColor(savedColor);
    } else {
      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      setCardColor(randomColor);
      localStorage.setItem(`noteColor_${id}`, randomColor);
    }

    // Process tags - handle both string and array formats
    if (typeof tags === 'string') {
      // Split comma-separated string and filter empty tags
      const tagsArray = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      setProcessedTags(tagsArray);
    } else if (Array.isArray(tags)) {
      // Ensure all tags are strings and not empty
      const validTags = tags.map(tag => String(tag).trim())
        .filter(tag => tag.length > 0);
      setProcessedTags(validTags);
    } else {
      setProcessedTags([]);
    }
  }, [id, tags]);

  const handlePinClick = (e) => {
    e.stopPropagation();
    onPinNote(id, isPinned);
  };

  return (
    <div className={`
      rounded-xl p-4 ${cardColor}
      shadow-md hover:shadow-lg
      transform transition-all duration-300 ease-in-out
      hover:-translate-y-1 hover:scale-[1.02]
      relative overflow-hidden
      group
      ${isPinned ? 'ring-2 ring-green-500' : ''}
    `}>
      <div className="left-2 right-2 h-2 bg-white/50 rounded-b-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <h6 className='text-sm font-medium text-gray-800'>{title}</h6>
            <span className='text-xs text-gray-600'>{date}</span>
          </div>
          <button
            onClick={handlePinClick}
            className="p-1 rounded-full hover:bg-white/30 transition-colors"
            aria-label={isPinned ? "Unpin note" : "Pin note"}
          >
            <MdOutlinePushPin
              className={`text-lg transition-all duration-200 ${isPinned
                  ? 'text-green-600 rotate-45 hover:rotate-0'
                  : 'text-gray-400 hover:text-gray-600 hover:rotate-45'
                }`}
            />
          </button>
        </div>

        <p className='text-sm text-gray-700 mt-2 mb-3'>{content?.slice(0, 60)}</p>

        <div className='flex items-center justify-between'>
          <div className='flex flex-wrap gap-1'>
            {processedTags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-white/70 text-gray-700 shadow-sm flex items-center"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                {tag}
              </span>
            ))}
          </div>
          <div className='flex items-center gap-2'>
            <MdCreate
              className='text-gray-500 hover:text-green-600 text-lg hover:scale-110 transition-all duration-200'
              onClick={onEdit}
            />
            <MdDelete
              className='text-gray-500 hover:text-red-600 text-lg hover:scale-110 transition-all duration-200'
              onClick={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}