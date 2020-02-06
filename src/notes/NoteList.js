import React from 'react';

import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Note from './Note'

class NoteList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "View notes",
      author: this.props.author,
      notes: []
    };
  }

  componentDidMount() {
    this.setState({ 
      notes: [
        {
          id: 123434,
          text: "Hello world",
          author: "Johanna"
        }
      ]
    });
  }

  render() {
    return (
      <Container className="p-1">
        <Accordion>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              {this.state.title}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                  {
                    this.state.notes.map((theNote, index) => (
                      <Note key={index} note={theNote} />
                    ))
                  }
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>
    );
  }
}

export default NoteList;

