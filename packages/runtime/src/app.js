import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { mountDOM } from "./mount-dom";

export const createApp = ({ state, view, reducers = {} }) => {
    let parentElement = null;
    let vdom = null;

    const renderApp = () => {
        if (vdom) {
            destroyDOM(vdom);
        }

        vdom = view(state, emit);
        mountDOM(vdom, parentElement);
    };

    const dispatcher = new Dispatcher();
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

    const emit = (eventName, payload) => {
        dispatcher.dispatch(eventName, payload);
    };

    for (const actionName in reducers) {
        const reducer = reducers[actionName];

        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload);
        });
        subscriptions.push(subs);
    };

    return {
        mount(_parentElement) {
            parentElement = _parentElement;
            renderApp();
        },

        unmount() {
            destroyDOM(vdom);
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe());
        }
    };
}
