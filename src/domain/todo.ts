import { v4 as uuid } from "uuid";

export class Todo {
  constructor(
    readonly id: string,
    readonly text: string,
    readonly completed = false
  ) {}
}

export function createTodo(text: string) {
  ensureThatHaveValidLength(text);
  ensureThatOnlyContainsAlphanumeric(text);
  ensureThatNotContainsForbbidenWords(text);
  return {
    id: uuid(),
    text,
    completed: false,
  };
}

export function updateTodoText(todo: Todo, text: string) {
  ensureThatHaveValidLength(text);
  ensureThatOnlyContainsAlphanumeric(text);
  ensureThatNotContainsForbbidenWords(text);
  return {
    ...todo,
    text,
  };
}


function ensureThatNotContainsForbbidenWords(text: string) {
  const prohibitedWords: string[] = ["prohibited", "forbidden", "banned"];
  if (prohibitedWords.some((word) => text.includes(word))) {
    throw new Error(`Error: The todo text cannot include the prohibited word`);
  }
}

function ensureThatOnlyContainsAlphanumeric(text: string) {
  if (!text.match(/^[a-zA-Z0-9 ]+$/)) {
    throw new Error(
      `Error: The todo text can only contain letters, numbers, and spaces.`
    );
  }
}

function ensureThatHaveValidLength(text: string) {
  if (!text || text.length < 3 || text.length > 100) {
    throw new Error(
      `Error: The todo text must be between 3 and 100 characters long.`
    );
  }
}
