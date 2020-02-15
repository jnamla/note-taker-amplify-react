import React from 'react';

import { MdDelete, MdEdit } from "react-icons/md";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { API, graphqlOperation } from 'aws-amplify';

import { deleteNote } from '../graphql/mutations';

//import './Note.css'

class Note extends React.Component {

  constructor(props) {
    super(props);
    this.state = { ...props };

    this.handleDelete = this.handleDelete.bind(this);
    this.triggerNoteEdition = this.triggerNoteEdition.bind(this);
  }

  handleDelete() {
    const input = { id: this.state.note.id };
    API.graphql( graphqlOperation( deleteNote, {input} ));
  }

  triggerNoteEdition() {
    this.props.triggerChildNoteEdition(this.state.note);
  }

  render() {
    return (
      <Container key={this.state.note.id}>
      <Row className="p-1 m-2 border border-white rounded">
        <Col>
          {this.state.note.text}
        </Col>
        <Col className="align-middle text-center" >
          <Col >
            <MdDelete onClick={this.handleDelete}></MdDelete>
          </Col>
          <Col >
            <MdEdit onClick={this.triggerNoteEdition}></MdEdit>
        </Col>
        </Col>
      </Row>
    </Container>
    );
  }
}

export default Note;

