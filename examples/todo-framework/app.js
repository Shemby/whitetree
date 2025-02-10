import { createApp, hyperscript, hFragment } from '../../packages/runtime/dist/whitetree.js'; 
import CreateTodo from "./components/createTodo.js";
import TodoList from "./components/todoList.js";

const state = {
    currentTodo: '',
    edit: {
        index: null,
        original: null,
        edited: null
    },
    todos: ['Feed the kids', 'Read the documentation']
};

const reducers = {
    'update-current-todo': (state, currentTodo) => ({
        ...state,
        currentTodo
    }),

    'add-todo': (state) => ({
        ...state,
        currentTodo: '',
        todos: [...state.todos, state.currentTodo]
    }),

    'start-editing-todo': (state, index) => ({
        ...state,
        edit:{
            index,
            original: state.todos[index],
            edited: state.todos[index]
        }
    }),

    'edit-todo': (state, edited) => ({
        ...state,
        edit: { ...state.edit, edited: edited}
    }),

    'save-edited-todo': (state) => {
        const todos = [...state.todos];
        todos[state.edit.index] = state.edit.edited;

        return {
            ...state,
            todos,
            edit: { index: null, original: null, edited: null}
        }
    },

    'cancel-editing-todo': (state) => ({
        ...state,
        edit: { idx: null, original: null, edited: null },
    }),

    'remove-todo': (state, index) => ({
        ...state,
        todos: state.todos.filter((todo, idx) => idx !== index)
    })
};

const App = (state, emit) => {
    return hFragment([
        hyperscript('h1', {}, ['Todos']),
        CreateTodo(state, emit),
        TodoList(state, emit)
    ]);
}

createApp({ state, reducers, view: App }).mount(document.body);