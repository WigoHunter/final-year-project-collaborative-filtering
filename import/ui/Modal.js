import React from 'react';
import ReactDOM from 'react-dom';

export class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.open ? "overlay modal-overlay-open" : "overlay modal-overlay"}>
        <div className="modal">
          {this.props.children}
        </div>
      </div>
    );
  }
}
