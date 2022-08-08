import React, { useState } from "react";

function CreateNote(props) {
  const [titleNote, setTitleNote] = useState("");
  const [contentNote, setContentNote] = useState("");

  const [isExpand, setExpand] = useState(false);

  function titleInputhandler(event) {
    // console.log(event.target.value);
    setTitleNote(event.target.value);
  }

  function contentInputHandle(event) {
    // console.log(event.target.value);
    setContentNote(event.target.value);
  }

  function createNoteHandler(event) {
    event.preventDefault();
    const note = {
      title: titleNote,
      content: contentNote,
    };
    // console.log(note);
    props.addNote(note);
    // creating a refreshing to empty the entry values upon submission
    setTitleNote("");
    setContentNote("");
  }

  function expand() {
    setExpand(true);
  }

  return (
    <div>
      <form onSubmit={createNoteHandler}>
        {isExpand && (
          <input
            onChange={titleInputhandler}
            name="title"
            placeholder="Title"
            value={titleNote}
          />
        )}

        <textarea
          onClick={expand}
          onChange={contentInputHandle}
          name="content"
          placeholder="Take a note..."
          value={contentNote}
          rows={isExpand ? "3" : "1"}
        />
        <button>Add</button>
      </form>
    </div>
  );
}

export default CreateNote;
