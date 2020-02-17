import React from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Amplify from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

import { createNote, updateNote } from './graphql/mutations'

import NoteList from './notes/NoteList';

import './App.css';

Amplify.configure(awsconfig);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.prepareNoteForEdition = this.prepareNoteForEdition.bind(this);
    this.resetNote = this.resetNote.bind(this);
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { text, id } = this.state;
    let input = {};

    //If there is an id then the user is editing a note
    if(id) {
      input = { text, id };
      API.graphql(graphqlOperation(updateNote, { input }));
    } else {
      input = { text };
      API.graphql(graphqlOperation(createNote, { input }));
    }
    
    this.resetNote();
  }

  prepareNoteForEdition(note) {
    this.setState({...note});
  }

  resetNote(id) {
    if(!id || this.state.id === id) {
      this.setState({text: "", id: undefined});
    }
  }

  render() {
    return (
      <Container className="p-3">
          <Jumbotron>
            <h1 className="header">Amplify NoteTaker</h1>
            {/* Note form */}
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formNote">
                <Form.Label>Note</Form.Label>
                <Form.Control type="text" value={this.state.text} onChange={this.handleChange} placeholder="Write your note." />
                <Form.Text className="text-muted" >
                  Keep record of what is important.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            
          </Jumbotron>

          <Jumbotron className="p-3" >
            <NoteList prepareNoteForEdition={this.prepareNoteForEdition} resetNote={this.resetNote}></NoteList>
          </Jumbotron>

      </Container>
      
    );
  }
}

export default withAuthenticator(App, true);
