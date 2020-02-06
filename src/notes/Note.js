import React from 'react';

class Note extends React.Component {

  constructor(props) {
    super(props);
    this.state = { ...props };
  }

  render() {
    return (
      <div>
        {this.state.text};
      </div>
    );
  }
}

export default Note;

