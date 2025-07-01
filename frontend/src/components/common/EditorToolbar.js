import React from 'react';
import { FaBold, FaItalic, FaStrikethrough, FaListUl, FaListOl } from 'react-icons/fa';

const EditorToolbar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="border border-gray-300 dark:border-slate-600 rounded-t-lg p-2 flex items-center gap-2">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-700 p-2 rounded' : 'p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900'}>
                <FaBold />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-700 p-2 rounded' : 'p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900'}>
                <FaItalic />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-slate-200 dark:bg-slate-700 p-2 rounded' : 'p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900'}>
                <FaStrikethrough />
            </button>
             <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-700 p-2 rounded' : 'p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900'}>
                <FaListUl />
            </button>
             <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-700 p-2 rounded' : 'p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900'}>
                <FaListOl />
            </button>
        </div>
    );
};

export default EditorToolbar;