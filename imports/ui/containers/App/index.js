import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { ToDos } from '../../../api/todos';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from '../../components/AccountsUIWrapper';


const ToDoItem = ({ todo, toggleComplete, removeToDo }) => (
  <li>{todo.title}
    <input
      type="checkbox"
      id={todo._id}
      checked={todo.complete}
      onChange={toggleComplete}
    />
    <label htmlFor={todo._id}></label>
    <button onClick={() => removeToDo(todo)}>
      <i className="fa fa-trash"></i>
    </button>
  </li>
);

const ClearButton = ({ removeCompleted }) => (
  <button onClick={removeCompleted}>Clear</button>
);

const ToDoCount = ({ number }) => (
  <p>{number} {number === 1 ? 'todo' : 'todos'}</p>
);

class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.toDoInput.focus();
  }
  
  toggleComplete(item) {
    ToDos.update(item._id, { $set: { complete: !item.complete } });
  }
  
  removeToDo = (item) => {
    ToDos.remove(item._id)
  }
  
  removeCompleted = () => {
    const todoIds = this.props.todos.filter(todo => todo.complete).map(todo => todo._id);
    todoIds.forEach(id => ToDos.remove(id));
  }

  hasCompleted = () => {
    const complete = this.props.todos.filter((todo) => todo.complete);
    return !!complete.length;
  }

  addToDo = (event) => {
    event.preventDefault();
    if (this.toDoInput.value) {
      ToDos.insert({
        owner: this.props.currentUserId,
        title: this.toDoInput.value,
        complete: false
      });
    }
    this.toDoInput.value = '';
  }

  render() {
    const { todos } = this.props;

    return (
      <div className="app-wrapper">
        <div className="login-wrapper">
          <AccountsUIWrapper />
          <div className="todo-list">
            <h1>Kindly do the following:</h1>
            {(!this.props.currentUserId) ?
              <div className="logged-out-message">
                <p>Please sign in to see your tasks.</p>
              </div>
              :
              <div>
                <div className="add-todo">
                  <form name="addTodo" onSubmit={this.addToDo}>
                    <input type="text" ref={(input) => (this.toDoInput = input)} />
                    <span>(press enter to add)</span>
                  </form>
                </div>
                <ul className="the-todos">
                  {this.props.todos.map((todo, i) =>
                    <ToDoItem toggleComplete={() =>
                      this.toggleComplete(todo)}
                      key={todo._id}
                      todo={todo}
                      removeToDo={this.removeToDo}
                    />
                  ).reverse()}
                </ul>
                <div className="todo-admin">
                  <ToDoCount number={this.props.todos.length} />
                  {this.hasCompleted() &&
                    <ClearButton removeCompleted={this.removeCompleted} />
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  todos: []
};

ToDoCount.propTypes = {
  number: PropTypes.number.isRequired
};

ClearButton.propTypes = {
  removeCompleted: PropTypes.func.isRequired
};

App.propTypes = {
  todos: PropTypes.array.isRequired,
  currentUserId: PropTypes.string,
  currentUser: PropTypes.object,

  // todos: PropTypes.shape({
  //   _id: PropTypes.string,
  //   title: PropTypes.string,
  //   complete: PropTypes.bool
  // }).isRequired,
  // toggleComplete: PropTypes.func.isRequired,
  // removeToDo: PropTypes.func.isRequired
};



export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
    currentUserId: Meteor.userId(),
    todos: ToDos.find().fetch()
  };
}, App);
