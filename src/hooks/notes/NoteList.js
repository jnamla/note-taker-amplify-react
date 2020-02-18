import React, { useState, useEffect } from 'react';

import { API, graphqlOperation } from 'aws-amplify';

import Container from 'react-bootstrap/Container';
import Note from './Note'

import { listNotes } from '../../graphql/queries';
import { onCreateNote, onUpdateNote, onDeleteNote } from '../../graphql/subscriptions';


function NoteList(props) {

  const [ notes, setNotes ] = useState( [] );
  
  /* 
    component data initialization
  */
  async function getNotes() {
    const result = await API.graphql( graphqlOperation(listNotes) );
    setNotes(result.data.listNotes.items);
  }

  useEffect(() => {
    getNotes();
  }, []);

  /* 
    component data mutation subscriptions handling
  */
  useEffect( () => {
    function createSubscriptions() {

      const createNoteSubs = API.graphql( graphqlOperation(onCreateNote, { owner: props.currentUser })).subscribe({
        next: noteData => {
          const newNote = noteData.value.data.onCreateNote;
          const prevNotes = notes;
          const newNotes = [...prevNotes, newNote];
          setNotes(newNotes);
        }
      });
      
      const updateNoteSubs = API.graphql( graphqlOperation(onUpdateNote, { owner: props.currentUser })).subscribe({
        next: noteData => {
          const updatedNote = noteData.value.data.onUpdateNote;
          const position = notes.findIndex((note) => note.id === updatedNote.id);
          if( position >= 0) {
            const newNotes = [...notes.slice(0,position), updatedNote, ...notes.slice(position+1)];
            // TODO: Check what to do to make setState to notice there is something different
            setNotes([]);
            setNotes(newNotes);
          }
        }
      });

      const deleteNoteSubs = API.graphql( graphqlOperation(onDeleteNote, { owner: props.currentUser })).subscribe({
        next: noteData => {
          const deletedNote = noteData.value.data.onDeleteNote;
          const newNotes = notes.filter((note) => note.id !== deletedNote.id );
          props.resetNote(deletedNote.id);
          setNotes(newNotes);
        }
      });

      return  [ createNoteSubs, updateNoteSubs, deleteNoteSubs ];
    }

    const subscriptions = createSubscriptions();

    return function cleanup() {
      for (const subscription of subscriptions) {
        subscription.unsubscribe();
      }
    }

  }, [props, notes]);

  return (
    <Container className="p-0">
      {
        notes.map((theNote, index) => (
            <Note key={index} note={theNote} triggerChildNoteEdition={props.prepareNoteForEdition} />
        ))
      }
    </Container>
  );

}

export default NoteList;
