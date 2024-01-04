import * as React from "react";
import { v4 as uuid } from "uuid";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type TodoFilter = "all" | "completed" | "incomplete";

export class TodoApp extends React.Component {
  todoList: Todo[] = [];
  todoText = "";
  updatedTodoText = "";
  numberOfCompleted = 0;
  currentFilter = "all" as TodoFilter;
  todoUpdatingStatus: boolean[] = [];

  constructor(props) {
    super(props);
    this.initialize();
  }

  private initialize() {
    fetch("http://localhost:3000/api/todos/")
      .then((response) => response.json())
      .then((data) => {
        this.todoList = data;
        for (let i = 0; i < this.todoList.length; i++) {
          this.todoUpdatingStatus.push(false);
        }
        this.forceUpdate();
      })
      .catch((error) => console.log(error));
  }

  addTodo() {
    const min = 3; // Longitud mínima del texto
    const max = 100; // Longitud máxima del texto
    const forbidden = ["prohibited", "forbidden", "banned"];

    // Validación de longitud mínima y máxima
    if (this.todoText.length < min || this.todoText.length > max) {
      alert(
        `Error: The todo text must be between ${min} and ${max} characters long.`
      );
    } else if (/[^a-zA-Z0-9\s]/.test(this.todoText)) {
      // Validación de caracteres especiales
      alert(
        "Error: The todo text can only contain letters, numbers, and spaces."
      );
    } else {
      // Validación de palabras prohibidas
      const words = this.todoText.split(/\s+/);
      let foundForbiddenWord = false;
      for (let word of words) {
        if (forbidden.includes(word)) {
          alert(
            `Error: The todo text cannot include the prohibited word "${word}"`
          );
          foundForbiddenWord = true;
          break;
        }
      }

      if (!foundForbiddenWord) {
        // Validación de texto repetido
        let isRepeated = false;
        for (let i = 0; i < this.todoList.length; i++) {
          if (this.todoList[i].text === this.todoText) {
            isRepeated = true;
            break;
          }
        }

        if (isRepeated) {
          alert("Error: The todo text is already in the collection.");
        } else {
          // Si pasa todas las validaciones, agregar el "todo"
          fetch("http://localhost:3000/api/todos/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: uuid(),
              text: this.todoText,
              completed: false,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              this.todoList.push(data);
              this.todoText = "";
              this.forceUpdate();
            });
        }
      }
    }
  }

  updateTodo(index) {
    const min = 3; // Longitud mínima del texto
    const max = 100; // Longitud máxima del texto
    const words = ["prohibited", "forbidden", "banned"];

    // Validación de longitud mínima y máxima
    if (
      this.updatedTodoText.length < min ||
      this.updatedTodoText.length > max
    ) {
      alert(
        `Error: The todo text must be between ${min} and ${max} characters long.`
      );
    } else if (/[^a-zA-Z0-9\s]/.test(this.updatedTodoText)) {
      // Validación de caracteres especiales
      alert(
        "Error: The todo text can only contain letters, numbers, and spaces."
      );
    } else {
      // Validación de palabras prohibidas
      let temp1 = false;
      for (let word of this.updatedTodoText.split(/\s+/)) {
        if (words.includes(word)) {
          alert(
            `Error: The todo text cannot include the prohibited word "${word}"`
          );
          temp1 = true;
          break;
        }
      }

      if (!temp1) {
        // Validación de texto repetido (excluyendo el índice actual)
        let temp2 = false;
        for (let i = 0; i < this.todoList.length; i++) {
          if (i !== index && this.todoList[i].text === this.updatedTodoText) {
            temp2 = true;
            break;
          }
        }

        if (temp2) {
          alert("Error: The todo text is already in the collection.");
        } else {
          // Si pasa todas las validaciones, actualizar el "todo"
          fetch(`http://localhost:3000/api/todos/${this.todoList[index].id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: this.updatedTodoText,
              completed: this.todoList[index].completed,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              this.todoList[index] = data;
              this.close(index);
              this.forceUpdate();
            });
        }
      }
    }
  }

  deleteTodo(index) {
    fetch(`http://localhost:3000/api/todos/${this.todoList[index].id}`, {
      method: "DELETE",
    }).then(() => {
      if (this.todoList[index].completed) {
        this.numberOfCompleted--;
      }
      this.todoList.splice(index, 1);
      this.forceUpdate();
    });
  }

  toggleComplete(index) {
    this.todoList[index].completed = !this.todoList[index].completed;
    fetch(`http://localhost:3000/api/todos/${this.todoList[index].id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: this.todoList[index].completed }),
    })
      .then((response) => response.json())
      .then((data) => {
        // this.collection[index] = data;
        this.todoList[index].completed
          ? this.numberOfCompleted++
          : this.numberOfCompleted--;
        this.forceUpdate();
      });
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.forceUpdate();
  }

  getFilteredTodos() {
    const filteredTodos = [];
    for (let i = 0; i < this.todoList.length; i++) {
      if (
        this.currentFilter === "all" ||
        (this.currentFilter === "completed" && this.todoList[i].completed) ||
        (this.currentFilter === "incomplete" && !this.todoList[i].completed)
      ) {
        filteredTodos.push(this.todoList[i]);
      }
    }
    return filteredTodos;
  }

  edit(index, text) {
    this.updatedTodoText = text;
    this.todoUpdatingStatus[index] = true;
    this.forceUpdate();
  }

  close(index) {
    this.todoUpdatingStatus[index] = false;
    this.forceUpdate();
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    this.todoText = text;
    this.forceUpdate();
  };

  handleUpdateInputChange=(event: React.ChangeEvent<HTMLInputElement>) =>{
    const text = event.target.value;
    this.updatedTodoText = text;
    this.forceUpdate();
  }
    
  render() {
    const todosToShow = this.getFilteredTodos();

    return (
      <div className="todo-app-container">
        <h1>TODOLIST APP</h1>
        <input
          className="todo-input"
          value={this.todoText}
          onChange={this.handleInputChange}
        />
        <button
          className="todo-button add-todo-button"
          onClick={this.addTodo.bind(this)}
        >
          Add Todo
        </button>
        <h2>Completed Todos: {this.numberOfCompleted}</h2>
        <div>
          <button
            className="todo-button all-filter"
            onClick={this.setFilter.bind(this, "all")}
          >
            All
          </button>
          <button
            className="todo-button completed-filter"
            onClick={this.setFilter.bind(this, "completed")}
          >
            Completed
          </button>
          <button
            className="todo-button incomplete-filter"
            onClick={this.setFilter.bind(this, "incomplete")}
          >
            Incomplete
          </button>
        </div>
        {todosToShow.map((todo, index) => (
          <div className="todo-list-item">
            {this.todoUpdatingStatus[index] ? (
              <input
                className="todo-edit-input"
                defaultValue={todo.text} // Asumiendo que inputData se usa para la edición
                onChange={this.handleUpdateInputChange.bind(this)}
              />
            ) : (
              <p
                className="todo-text"
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.text}{" "}
                <button
                  className="todo-button edit-todo-button"
                  onClick={() => this.edit(index, todo.text)}
                >
                  Edit
                </button>
              </p>
            )}
            <button
              className="todo-button todo-mark-button"
              onClick={this.toggleComplete.bind(this, index)}
            >
              {todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </button>
            <button
              className="todo-button todo-delete-button"
              onClick={this.deleteTodo.bind(this, index)}
            >
              Delete Todo
            </button>

            <button
              className="todo-button todo-update-button"
              onClick={this.updateTodo.bind(this, index)}
            >
              Update Todo
            </button>
          </div>
        ))}
      </div>
    );
  }
}
