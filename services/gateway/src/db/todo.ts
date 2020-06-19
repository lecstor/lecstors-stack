import Todo from "./models/todo/todo.model";

type NewTodo = {
  name: string;
  description?: string;
  groupId: string;
};

export async function createTodo(newTodo: NewTodo) {
  return Todo.query().insert(newTodo).returning("*");
}
