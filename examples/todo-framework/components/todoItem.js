import { hyperscript } from "../../../packages/runtime/dist/whitetree.js";

const TodoItem = ({ todo, index, edit}, emit) => {
    const isEditing = edit.index === index;

    return isEditing ? (
        hyperscript('li', {}, [
            hyperscript('input', {
                value: edit.edited,
                on: { change: ({ target }) => {
                    emit('edit-todo', target.value)}
                }
            }),
            hyperscript('button', { on: { click: ()=> emit ('save-edited-todo') }}, ['Save']),
            hyperscript('button', { on: { click: ()=> emit('cancel-editing-todo')}}, ['Cancel'])
        ])
    ) : (
        hyperscript('li', {}, [
            hyperscript('span', { on: {dblclick: ()=> emit('start-editing-todo', index)}}, [todo]),
            hyperscript('button', { on: { click: ()=> (emit('remove-todo', index))}}, ['Done'])
        ])
    )
}

export default TodoItem;