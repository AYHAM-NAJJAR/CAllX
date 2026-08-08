import React from 'react';
import { StickyNote as StickyNoteIcon } from 'lucide-react'; // إعادة تسمية الأيقونة لتجنب التعارض مع اسم المكون
import { useStickyNotes } from '../../hooks/useStickyNotes';
import StickyNote from '../../pages/common/StickyNote';

const StickyNotesManager = () => {
  const { notes, addNote, deleteNote, bringToFront } = useStickyNotes();

  return (
    <>
      {/* زر أيقونة الملاحظة العائم في أسفل اليمين */}
      <button
        onClick={addNote}
        title="Add Note"
        className="fixed bottom-6 right-6 z-[9999] w-12 h-12 bg-transparent hover:bg-sky-500 text-white rounded-full shadow-lg hover:shadow-sky-500/25 border border-sky-400/40 transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95"
      >
        <StickyNoteIcon className="w-5 h-5 text-white" />
      </button>

      {/* عرض الملاحظات اللاصقة */}
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          id={note.id}
          zIndex={note.zIndex}
          onDelete={deleteNote}
          onSelect={() => bringToFront(note.id)}
        />
      ))}
    </>
  );
};

export default StickyNotesManager;