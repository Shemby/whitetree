import { hyperscript } from "../../../packages/runtime/dist/whitetree.js";

const CreateTodo = ({ currentTodo }, emit) => {
    return hyperscript('div', {}, [
        hyperscript('h2', {}, ['New Todo']),
        hyperscript('input', {
            type: 'text',
            id: 'todo-input',
            value: currentTodo,
            className: 'add-todo',
            on: {
                change: ({ target }) => emit('update-current-todo', target.value),
                keydown: ({ key }) => {
                    if(key === 'Enter' && currentTodo.length >= 3) {
                        emit('add-todo');
                    }
                }
            }
        }),
        hyperscript('button', {
            className: 'add-todo',
            disabled: currentTodo.length < 3,
            on: { click: () => emit('add-todo') }
        },
        ['Add']
    )]);
}

export default CreateTodo;