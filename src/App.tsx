import "./App.css";
import { useEffect, useState } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/notes");
        const notes: Note[] = await response.json();
        setNotes(notes);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNotes();
  }, []);

  const resetState = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  // Add Note
  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const newNote = await response.json();

      setNotes([newNote, ...notes]);
      resetState();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  // Update Note
  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );
      const updatedNote = await response.json();

      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNote : note
      );

      setNotes(updatedNotesList);
      resetState();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Note
  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    try {
      await fetch(`http://localhost:5001/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }

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
// 2. Backend - DONE

// Additional UI Work
// 1. Using material UI, recreate the frontend of this application for a minimalist and sleek look and feel.
