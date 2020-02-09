import React from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Amplify from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

import { createNote } from './graphql/mutations'

import NoteList from './notes/NoteList';

import './App.css';

Amplify.configure(awsconfig);

class App extends React.Component {

  constructor(props) {
    super(props);//TODO: where to get the logged in id from?
    this.state = { 
      author: "990df005-8116-4e82-b8d8-8dface9b34e0",
      text: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
    console.log("new state " + this.state)
  }

  handleSubmit(event) {
    event.preventDefault();
    const { text, author } = this.state;
    const input = { text, author };
    API.graphql(graphqlOperation(createNote, { input }));
  }

  componentDidMount() {

  }

  componentWillUnmount() {

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

          <Jumbotron>
            <NoteList author={this.state.author}></NoteList>
          </Jumbotron>

      </Container>
      
    );
  }
}

export default withAuthenticator(App, true);
