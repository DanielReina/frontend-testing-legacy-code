import React from "react";
import { Todo } from "./todoApp";

type TodoItemProps = {
  index: number;
  todo: Todo;
  toggleComplete: (index: number) => void;
  deleteTodo: (index: number) => void;
  updateTodo: (index: number, todo:Todo, newText:string) => void;
};

type TodoItemState = {
    newText: string;
    isEditing: boolean;
    };

export function TodoItem({ index, todo, toggleComplete, deleteTodo, updateTodo }: TodoItemProps
): React.JSX.Element {
    const [state, setState] = React.useState<TodoItemState>({
      newText: "",
      isEditing: false,
    });
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         
        setState({ ...state, newText: event.target.value });
        
    }
    const handleEdit = () => {
        setState({ ...state, isEditing: true });
    }
    const handleUpdate = () => {
        setState({ ...state, isEditing: false });
        updateTodo(index, todo, state.newText);
    }
  return (
    <div className="todo-list-item">
      {state.isEditing ? (
        <input
          className="todo-edit-input"
          defaultValue={todo.text} // Asumiendo que inputData se usa para la edición
          onChange={handleTextChange}
        />
      ) : (
        <p
          className="todo-text"
          style={{
            textDecoration: todo.completed ? "line-through" : "none",
          }}
        >
          {todo.text}{" "}
          <button className="todo-button edit-todo-button" onClick={handleEdit}>
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

      <button className="todo-button todo-update-button" onClick={handleUpdate}>
        Update Todo
      </button>
    </div>
  );
}
