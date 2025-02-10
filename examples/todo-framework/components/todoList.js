import { hyperscript } from "../../../packages/runtime/dist/whitetree.js";
import TodoItem from "./todoItem.js";

const TodoList = ({ todos, edit }, emit) => {
    return hyperscript('ul', {}, 
        todos.map((todo, index) => TodoItem({ todo, index, edit }, emit))
    );
}

export default TodoList;