import React from 'react';

import { API, graphqlOperation } from 'aws-amplify';

import Container from 'react-bootstrap/Container';
import Note from './Note'

import { listNotes } from '../graphql/queries';
import { onCreateNote, onUpdateNote, onDeleteNote } from '../graphql/subscriptions';

class NoteList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "View notes...",
      author: this.props.author,
      notes: []
    };

    this.triggerChildNoteEdition = this.triggerChildNoteEdition.bind(this);
  
  }

  componentDidMount() {
    this.getNotes();
    this.createSubscriptions();
  }

  componentWillUnmount() {
    this.cancelSubscriptions();
  }

  createSubscriptions() {

    this.createNoteSubs = API.graphql(graphqlOperation(onCreateNote)).subscribe({
      next: noteData => {
        const newNote = noteData.value.data.onCreateNote;
        const prevNotes = this.state.notes;
        const newNotes = [...prevNotes, newNote];
        this.setState({ notes: newNotes });
      }
    });
    
    this.updateNoteSubs = API.graphql(graphqlOperation(onUpdateNote)).subscribe({
      next: noteData => {
        const updatedNote = noteData.value.data.onUpdateNote;
        const position = this.state.notes.findIndex((note) => note.id === updatedNote.id);
        if( position >= 0) {
          const newNotes = [...this.state.notes.slice(0,position), ...this.state.notes.slice(position+1), updatedNote];
          // TODO: Check what to do to make setState to notice there is something different
          this.setState({ notes: [] });
          this.setState({ notes: newNotes });
        }
      }
    });

    this.deleteNoteSubs = API.graphql(graphqlOperation(onDeleteNote)).subscribe({
      next: noteData => {
        const deletedNote = noteData.value.data.onDeleteNote;
        const newNotes = this.state.notes.filter((note) => note.id === deletedNote.id );
        this.setState({ notes: newNotes });
      }
    });

  }

  cancelSubscriptions() {
    this.createNoteSubs.unsubscribe();
    this.updateNoteSubs.unsubscribe();
    this.deleteNoteSubs.unsubscribe();
  }

  async getNotes() {
    const result = await API.graphql(graphqlOperation(listNotes));
    this.setState({ notes: result.data.listNotes.items });
  }

  triggerChildNoteEdition(note) {
    this.props.prepareNoteForEdition(note);
  }

  render() {
    return (
      <Container className="p-1">
        {(this.state.notes.map((theNote, index) => (
            <Note key={index} note={theNote} triggerChildNoteEdition={this.triggerChildNoteEdition} />
          )))}
      </Container>
    );
  }
}

export default NoteList;
