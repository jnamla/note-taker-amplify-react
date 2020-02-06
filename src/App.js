import React from 'react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

import NoteList from './notes/NoteList';

import './App.css';


Amplify.configure(awsconfig);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { author: "Johanna" };
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

            <Form>
              <Form.Group controlId="formNote">
                <Form.Label>Note</Form.Label>
                <Form.Control type="text" placeholder="Write your note." />
                <Form.Text className="text-muted">
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
