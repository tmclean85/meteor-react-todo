import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { ToDos } from '../../../api/todos';
import { createContainer } from 'meteor/react-meteor-data';

const ToDoItem = ({ todo, toggleComplete, removeToDo }) => (
    <li>{todo.title}
      <input
         type="checkbox"
         id={todo._id}
         checked={todo.complete}
         onChange= {toggleComplete}
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
    const newTodos = this.props.todos.map(todo => {
      if (item.id === todo._id) {
        todo.complete = !todo.complete
      }
      return todo;
    });
    this.setState({ todos: newTodos });
  }

  removeToDo = (item) => {
    const newTodos = this.props.todos.filter(todo => todo._id !== item.id);
    this.setState({ todos: newTodos });    
  }

  removeCompleted = () => {
   let newTodos = this.props.todos.filter((todo) => !todo.complete);
   this.setState({ todos: newTodos });
  }

  hasCompleted = () => {
    const complete = this.props.todos.filter((todo) => todo.complete);
      return !!complete.length;
  }

  addToDo = (event) => {
    event.preventDefault();
    if (this.toDoInput.value) {
      ToDos.insert({      
        title: this.toDoInput.value,     
        complete: false
      });
    }
  }

  render() {
    const { todos } = this.props;

    return (
      <div className="todo-list">
        <h1>Things to Procrastinate On</h1>
        <div className="add-todo">
          <form name="addTodo" onSubmit={this.addToDo}>
            <input type="text" ref={(input) => (this.toDoInput = input)} />
            <span>(press enter to add)</span>
          </form>
        </div>
        <ul>  
          {this.props.todos.map((todo, i) => 
            <ToDoItem toggleComplete={() => 
              this.toggleComplete(todo)} 
              key={todo._id} 
              todo={todo}
              removeToDo={this.removeToDo}
              />
            )}
        </ul>         
        <div className="todo-admin">   
          <ToDoCount number={this.props.todos.length}/>
          {this.hasCompleted() &&
          <ClearButton removeCompleted={this.removeCompleted} />
        }
        </div> 
      </div>   
    );    
  }
}

App.defaultProps = {
  todos: []
}

ToDoCount.propTypes = {
  number: PropTypes.number.isRequired
};

ClearButton.propTypes = {
  removeCompleted: PropTypes.func.isRequired
};

ToDoItem.propTypes = {
  todo: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    complete: PropTypes.bool
  }).isRequired,
  toggleComplete: PropTypes.func.isRequired,
  removeToDo: PropTypes.func.isRequired
};



export default createContainer(() => {
  return {
    todos: ToDos.find().fetch()
  };
}, App);
