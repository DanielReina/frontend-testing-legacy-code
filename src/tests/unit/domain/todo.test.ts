import { createTodo, updateTodoText } from "../../../domain/todo";

describe("The Todo Model", () => {
  describe("when creating a new todo", () => {
    it("should create a todo when text is valid", () => {
      const text = "A valid todo text";
      const todo = createTodo(text);
      expect(todo.id).toMatch(/^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/);
      expect(todo.text).toMatch(text);
      expect(todo.completed).toBe(false);
    });
    it("should throw an error when text is less than minimum length", () => {
      const text = "a";
      expect(() => createTodo(text)).toThrowError(
        `Error: The todo text must be between 3 and 100 characters long.`
      );
    });

    it("should throw an error when text is more than maximum length", () => {
      const text = "a".repeat(101);
      expect(() => createTodo(text)).toThrowError(
        `Error: The todo text must be between 3 and 100 characters long.`
      );
    });
    it("should throw an error when text is empty", () => {
      const text = "";
      expect(() => createTodo(text)).toThrowError(
        `Error: The todo text must be between 3 and 100 characters long.`
      );
    });
    it("should throw an error when text is null", () => {
      const text = null;
      expect(() => createTodo(text)).toThrowError(
        `Error: The todo text must be between 3 and 100 characters long.`
      );
    });
    it("should throw an error when text is not alphanumeric", () => {
      const text =
        "A valid todo text with special characters: !@#$%^&*()_+{}|:<>?/.,';][=-`~";
      expect(() => createTodo(text)).toThrowError(
        `Error: The todo text can only contain letters, numbers, and spaces.`
      );
    });
    it("should throw an error when text contains a prohibited word", () => {
      const text = "A valid todo text with prohibited word";
      expect(() => createTodo(text)).toThrowError(
        `Error: The todo text cannot include the prohibited word`
      );
    });
  });
  describe("when updating a todo", () => {
    it("should update a todo when text is valid", () => {
      const text = "A valid todo text";
      const todo = createTodo("some text");
      const updatedTodo = updateTodoText(todo, text);
      expect(updatedTodo.id).toMatch(todo.id);
      expect(updatedTodo.text).toMatch(text);
      expect(updatedTodo.completed).toBe(false);
    });
    it("should throw an error when text is less than minimum length", () => {
      const text = "a";
      const todo = createTodo("some text");
      expect(() => updateTodoText(todo, text)).toThrowError(
        `Error: The todo text must be between 3 and 100 characters long.`
      );
    });
    it("should throw an error when text is more than maximum length", () => {
      const text = "a".repeat(101);
      const todo = createTodo("some text");
      expect(() => updateTodoText(todo, text)).toThrowError(
        `Error: The todo text must be between 3 and 100 characters long.`
      );
    });
    it("should throw an error when text is not alphanumeric", () => {
      const text =
        "A valid todo text with special characters: !@#$%^&*()_+{}|:<>?/.,';][=-`~";
      const todo = createTodo("some text");
      expect(() => updateTodoText(todo, text)).toThrowError(
        `Error: The todo text can only contain letters, numbers, and spaces.`
      );
    });
    it("should throw an error when text contains a prohibited word", () => {
      const text = "A valid todo text with prohibited word";
      const todo = createTodo("some text");
      expect(() => updateTodoText(todo, text)).toThrowError(
        `Error: The todo text cannot include the prohibited word`
      );
    });
  });
});
