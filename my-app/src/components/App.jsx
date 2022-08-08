import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import Notes from "./Notes";
import CreateNote from "./CreateNote";

// a mapping helper function, with just 2 intakes i.e title and

function App() {
  // Initial state of the Notes available
  const [availableNote, setNotes] = useState(Notes);

  //   helper function to delete a note for the availableNotes
  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((notes, index) => {
        return index !== id;
      });
    });
  }

  function addedNote(note) {
    // console.log(note);
    setNotes([note, ...availableNote]);
  }

  return (
    <div>
      <Header />
      <CreateNote addNote={addedNote} />
      {availableNote.map((notes, index) => {
        return (
          <Card
            key={index}
            id={index}
            title={notes.title}
            content={notes.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}
export default App;
