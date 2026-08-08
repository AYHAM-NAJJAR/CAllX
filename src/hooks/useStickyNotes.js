import { useState } from 'react';

export const useStickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [highestZIndex, setHighestZIndex] = useState(1);

  // إضافة ملاحظة جديدة
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      zIndex: highestZIndex + 1,
    };
    setHighestZIndex((prev) => prev + 1);
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  // حذف ملاحظة
  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  // رفع الملاحظة النشطة للأمام
  const bringToFront = (id) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, zIndex: newZIndex } : note
      )
    );
  };

  return {
    notes,
    addNote,
    deleteNote,
    bringToFront,
  };
};