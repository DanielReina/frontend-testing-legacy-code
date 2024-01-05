import * as React from "react";
import { v4 as uuid } from "uuid";
import { TodoItem } from "./todoItem";

export type Todo = {
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

  updateTodo = (index) => {
    const minLength = 3; // Longitud mínima del texto
    const maxLength = 100; // Longitud máxima del texto
    const forbiddenWords = ["prohibited", "forbidden", "banned"];

    const hasValidLength =
      this.updatedTodoText.length < minLength ||
      this.updatedTodoText.length > maxLength;
    // Validación de longitud mínima y máxima
    if (hasValidLength) {
      alert(
        `Error: The todo text must be between ${minLength} and ${maxLength} characters long.`
      );
      return;
    }
    const isValidText = /[^a-zA-Z0-9\s]/.test(this.updatedTodoText);
    if (isValidText) {
      // Validación de caracteres especiales
      alert(
        "Error: The todo text can only contain letters, numbers, and spaces."
      );
      return;
    }
    // Validación de palabras prohibidas
    let temp1 = false;
    const words = this.updatedTodoText.split(/\s+/);
    const hasForbiddenWrods = words.some((word) =>
      forbiddenWords.includes(word)
    );
    if (hasForbiddenWrods) {
      alert(`Error: The todo text cannot include the prohibited word`);
      return;
    }
    this.todoList.forEach((todo: Todo): void => {
      if (todo.text === this.updatedTodoText) {
        alert("Error: The todo text is already in the collection.");
        return;
      }
    });
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
  };

  deleteTodo = (index) => {
    fetch(`http://localhost:3000/api/todos/${this.todoList[index].id}`, {
      method: "DELETE",
    }).then(() => {
      if (this.todoList[index].completed) {
        this.numberOfCompleted--;
      }
      this.todoList.splice(index, 1);
      this.forceUpdate();
    });
  };

  toggleComplete = (index) => {
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
  };

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

  onEdit = (index, text) => {
    this.updatedTodoText = text;
    this.todoUpdatingStatus[index] = true;
    this.forceUpdate();
  };

  close = (index) => {
    this.todoUpdatingStatus[index] = false;
    this.forceUpdate();
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    this.todoText = text;
    this.forceUpdate();
  };

  handleUpdateTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    this.updatedTodoText = text;
    this.forceUpdate();
  };

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
          <TodoItem
            index={index}
            todo={todo}
            todoUpdatingStatuses={this.todoUpdatingStatus}
            handleUpdateTextChange={this.handleUpdateTextChange}
            onEdit={this.onEdit}
            toggleComplete={this.toggleComplete}
            deleteTodo={this.deleteTodo}
            updateTodo={this.updateTodo}
          />
        ))}
      </div>
    );
  }
}
