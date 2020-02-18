import React from 'react';

import { MdDelete, MdEdit } from "react-icons/md";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { API, graphqlOperation } from 'aws-amplify';

import { deleteNote } from '../../graphql/mutations';

import './Note.css';

function Note(props) {
  
  function handleDelete() {
    const input = { id: props.note.id };
    API.graphql( graphqlOperation( deleteNote, { input } ));
  }

  function triggerNoteEdition() {
    props.triggerChildNoteEdition( props.note );
  }

  return (
    <Container className="p-0" key={ props.note.id }>
      <Row className="p-2 m-2 border border-white rounded">
        <Col className="p-1" xs={ 9 } sm={ 10 } md={ 11 }>
          { props.note.text }
        </Col>
        <Col className="p-0 text-right icons-group" xs={ 3 } sm={ 2 } md={ 1 }>
            <MdDelete className="selectable" size="2em" onClick={ handleDelete }></MdDelete>
            <MdEdit className="selectable" size="2em" onClick={ triggerNoteEdition }></MdEdit>
        </Col>
      </Row>
    </Container>
  );
}

export default Note;

