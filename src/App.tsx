import "./App.css";
import { useState } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "test note 1",
      content: "bla bla note1",
    },
    {
      id: 2,
      title: "test note 2 ",
      content: "bla bla note2",
    },
    {
      id: 3,
      title: "test note 3",
      content: "bla bla note3",
    },
    {
      id: 4,
      title: "test note 4 ",
      content: "bla bla note4",
    },
    {
      id: 5,
      title: "test note 5",
      content: "bla bla note5",
    },
    {
      id: 6,
      title: "test note 6",
      content: "bla bla note6",
    },
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const newNote: Note = {
    id: notes.length + 1,
    title: title,
    content: content,
  };

  const resetState = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();

    setNotes([newNote, ...notes]);
    resetState();
  };

  const handleSelectedNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }
    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    };
    const updatedNotesList = notes.map((note) =>
      note.id === selectedNote.id ? updatedNote : note
    );

    setNotes(updatedNotesList);
    resetState();
  };

  const deleteNote = (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
  };

  return (
    <div className="app-container">
      <form className="note-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        ></input>
        <textarea
          placeholder="Content"
          rows={10}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {selectedNote ? (
          <div className="edit-buttons">
            <button onClick={handleUpdateNote} type="submit">
              Save
            </button>
            <button onClick={resetState}>Cancel</button>
          </div>
        ) : (
          <button onClick={handleAddNote} type="submit">
            Add Note
          </button>
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div
            onClick={() => handleSelectedNote(note)}
            key={note.id}
            className="note-item"
          >
            <div className="notes-header">
              <button onClick={(event) => deleteNote(event, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

// TODO:
// 1. React/TS UI - DONE 
// 2. Backend - TODO:

// Additional UI Work
// 1. Using material UI, recreate the frontend of this application for a minimalist and sleek look and feel.