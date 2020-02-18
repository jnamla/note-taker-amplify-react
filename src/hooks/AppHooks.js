import React, { useState } from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Amplify from 'aws-amplify';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

import { createNote, updateNote } from '../graphql/mutations'

import NoteList from './notes/NoteList';

import '../App.css';

Amplify.configure(awsconfig);

function App () {

  const [ text, setText ] = useState("");
  const [ id, setId ] = useState(undefined);
  const [ currentUser, setCurrentUser ] = useState("")

  Auth.currentSession()
    .then(data => setCurrentUser(data.getIdToken().payload.sub))
    .catch(err => console.log(err));

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    let input = {};

    //If there is an id then the user is editing a note
    if( id ) {
      input = { text, id };
      API.graphql( graphqlOperation( updateNote, { input } ) );
    } else {
      input = { text };
      API.graphql( graphqlOperation( createNote, { input } ) );
    }
    
    resetNote( id );
  }

  function prepareNoteForEdition(note) {
    setText( note.text );
    setId( note.id );
  }

  function resetNote( idToReset ) {
    if( !id || id === idToReset ) {
      setText("");
      setId(undefined);
    }
  }

  function clear() {
    resetNote( id );
  }

  return (
    <Container className="p-3">
        <Jumbotron>
          <h1 className="header">Amplify NoteTaker</h1>
          {/* Note form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNote">
              <Form.Label>Note</Form.Label>
              <Form.Control type="text" value={text} onChange={handleChange} placeholder="Write your note." />
              <Form.Text className="text-muted" >
                Keep record of what is important.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={clear}>
              Cancel
            </Button>
          </Form>
          
        </Jumbotron>

        <Jumbotron className="p-3" >
          <NoteList prepareNoteForEdition={prepareNoteForEdition} resetNote={resetNote} currentUser={currentUser}></NoteList>
        </Jumbotron>

    </Container>
    
  );

}

export default withAuthenticator(App, true);
