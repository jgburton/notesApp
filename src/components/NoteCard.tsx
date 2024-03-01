import { Note } from "../App";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";

interface NoteCardProps {
  note: Note;
  handleSelectedNote: (note: Note) => void;
  deleteNote: (event: any, id: number) => void;
}

const NoteCard = ({ note, deleteNote, handleSelectedNote }: NoteCardProps) => {
  return (
    <Card onClick={() => handleSelectedNote(note)}>
      <CardHeader
        action={
          <IconButton onClick={(event) => deleteNote(event, note.id)} aria-label="settings">
            <CancelOutlined />
          </IconButton>
        }
        title={note.title}
      />
      <CardContent style={{paddingTop: "0px"}}>
        <Typography variant="body1" component="div">
          {note.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
