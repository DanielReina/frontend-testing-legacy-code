import React from "react";
import { Todo } from "./todoApp";

type TodoItemProps = {
  index: number;
  todo: Todo;
  todoUpdatingStatuses: boolean[];
  handleUpdateTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (index: number, text: string) => void;
  toggleComplete: (index: number) => void;
  deleteTodo: (index: number) => void;
  updateTodo: (index: number) => void;
};

export function TodoItem({
  index,
  todo,
  todoUpdatingStatuses,
  handleUpdateTextChange,
  onEdit,
  toggleComplete,
  deleteTodo,
  updateTodo,
}: TodoItemProps): React.JSX.Element {
  return (
    <div className="todo-list-item">
      {todoUpdatingStatuses[index] ? (
        <input
          className="todo-edit-input"
          defaultValue={todo.text} // Asumiendo que inputData se usa para la edición
          onChange={handleUpdateTextChange}
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
            onClick={() => onEdit(index, todo.text)}
          >
            Edit
          </button>
        </p>
      )}
      <button
        className="todo-button todo-mark-button"
        onClick={() => toggleComplete(index)}
      >
        {todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
      </button>
      <button
        className="todo-button todo-delete-button"
        onClick={() => deleteTodo(index)}
      >
        Delete Todo
      </button>

      <button
        className="todo-button todo-update-button"
        onClick={() => updateTodo(index)}
      >
        Update Todo
      </button>
    </div>
  );
}
