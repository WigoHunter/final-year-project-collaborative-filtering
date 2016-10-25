import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Parallax from 'react-simple-parallax';
import { createContainer } from 'meteor/react-meteor-data';

import { Todos } from '../api/todos.js';

const App = ({ children }) => (
  <div>
    <div className="navi">
      <h3>FYP - Personalised Review System</h3>
      <ul>
        <Link to="/text-analysis"><li>Text Analysis</li></Link>
        <Link to="/todo"><li>Todo</li></Link>
      </ul>
    </div>
    <div className="content">
      {children}
    </div>
  </div>
);

export default App;


//TESTING


export class TodoList extends React.Component {
  handleSubmit(event) {
    //prevent actual default submission
    event.preventDefault();

    //Find the input
    const text = ReactDOM.findDOMNode(this.refs.input).value;

    //Push to DB
    Todos.insert({
      text,
      createdAt: new Date(),
    });

    //Clear form
    ReactDOM.findDOMNode(this.refs.input).value = '';
  }

  render() {
    return (
      <div className="list-container">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="text"
            ref="input"
            placeholder="New todo?"
          />
        </form>
        <ul>
          {this.props.todos.map((todo) => (
            <Todo text={todo.text} />
          ))}
        </ul>
      </div>
    );
  }
}

TodoList.propTypes = {
  todos: React.PropTypes.array.isRequired,
};

export const TodoListContainer = createContainer(() => {
  return {
    todos: Todos.find({}).fetch(),
  }
}, TodoList);

const Todo = ({ text }) => (
  <li>{text}</li>
);
