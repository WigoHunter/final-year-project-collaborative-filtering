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

export class UserPreferenceControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Modal open={this.props.openModal}>
          <span className="close" onClick={this.props.handleClose}>＋</span>
          <h2>User Behavior</h2>
          <div>
            <div
              className="pref"
            >
              <p>Hotel</p>
              {this.props.hotel}
            </div>
            <div
              className="pref"
            >
              <p>Location</p>
              {this.props.location}
            </div>
            <div
              className="pref"
            >
              <p>Room</p>
              {this.props.room}
            </div>
            <div
              className="pref"
            >
              <p>Breakfast</p>
              {this.props.breakfast}
            </div>
            <div
              className="pref"
            >
              <p>Clean</p>
              {this.props.clean}
            </div>
            <div
              className="pref"
            >
              <p>Stay</p>
              {this.props.stay}
            </div>
            <div
              className="pref"
            >
              <p>Staff</p>
              {this.props.staff}
            </div>
            <div
              className="pref"
            >
              <p>Service</p>
              {this.props.service}
            </div>
            <div
              className="pref"
            >
              <p>Comfortable</p>
              {this.props.comfortable}
            </div>
            <div
              className="pref"
            >
              <p>Station</p>
              {this.props.station}
            </div>
          </div>
          <div className="calc" onClick={this.props.reset}>
            Reset
          </div>
          <p className="desc">
            This data is supposed to be extracted from browsing histories of users, but for simplicity in this sample site, I decided to ask for input from users directly
          </p>
        </Modal>
      </div>
    );
  }
}
