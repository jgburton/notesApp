import "./App.css";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import NoteCard from "./components/NoteCard";
import {
  Button,
  ButtonType,
  ShapeType,
  SizeType,
  TextField,
} from "@zebra-fed/zds-react";

export interface Note {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string | number>("");
  const [content, setContent] = useState<string | number>("");
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
    <>
    <div className="app-container">
      <form className="note-form">
        <TextField
          onChange={(e, val) => setTitle(val)}
          placeholder="Title"
          shape={ShapeType.Rounded}
          size={SizeType.Medium}
          value={title}
        />
        <TextField
          elementType="textare"
          enableNewLine
          onChange={(e, val) => setContent(val)}
          placeholder="Content"
          shape={ShapeType.Rounded}
          size={SizeType.Medium}
          value={content}
        />

        {selectedNote ? (
          <div className="edit-buttons">
            <Button
              type={ButtonType.Basic}
              size={SizeType.Medium}
              rounded={true}
              onClick={handleUpdateNote as any}
              children={"Save"}
            />
            <Button
              type={ButtonType.Negative}
              size={SizeType.Medium}
              rounded={true}
              onClick={resetState}
              children={"Cancel"}
            />
          </div>
        ) : (
          <Button
            type={ButtonType.Primary}
            size={SizeType.Medium}
            rounded={true}
            onClick={handleAddNote as any}
            children={"Add Note"}
          />
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <NoteCard
            note={note}
            handleSelectedNote={handleSelectedNote}
            deleteNote={deleteNote}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default App;
