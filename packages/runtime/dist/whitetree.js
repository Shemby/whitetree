const filterNulls = (nodes) => (
    nodes.filter((node) => node !== null && node !== undefined)
);

const DOM_TYPES = {
    TEXT: 'text',
    ELEMENT: 'element',
    FRAGMENT: 'fragment',
};
const mapTextNodes = (nodes) => (
    nodes.map((node) => typeof node === 'string' ? hString(node) : node)
);
const hFragment = (nodes) => ({
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(filterNulls(nodes))
});
const hString = (str) => ({
    type: DOM_TYPES.TEXT,
    value: str
});
const hyperscript = (tag, props = {}, nodes = []) => ({
    tag,
    props,
    children: mapTextNodes(filterNulls(nodes)),
    type: DOM_TYPES.ELEMENT
});

const addEventListener = (eventName, eventHandler, element) => {
    element.addEventListener(eventName, eventHandler);
    return eventHandler;
};
const addEventListeners = (eventListeners = {}, element) => {
    const addedListeners = {};
    Object.entries(eventListeners).forEach(([eventName, eventHandler]) => {
        const eventListener = addEventListener(eventName, eventHandler, element);
        addedListeners[eventName] = eventListener;
    });
    return addedListeners;
};
const removeEventListeners = (eventListeners = {}, element) => {
    Object.entries(eventListeners).forEach(([eventName, eventHandler]) => {
        element.removeEventListener(eventName, eventHandler);
    });
};

const removeTextNode = (vdom) => {
    const { element } = vdom;
    element.remove();
};
const reomveElementNode = (vdom) => {
    const { element, children, listeners } = vdom;
    element.remove();
    children.forEach(destroyDOM);
    if(listeners) {
        removeEventListeners(listeners, element);
        delete vdom.listeners;
    }
};
const removeFragmentNode = (vdom) => {
    const { children } = vdom;
    children.forEach(destroyDOM);
};
const destroyDOM = (vdom) => {
    const { type } = vdom;
    switch (type) {
        case DOM_TYPES.TEXT: {
            removeTextNode(vdom);
            break;
        }
        case DOM_TYPES.ELEMENT: {
            reomveElementNode(vdom);
            break;
        }
        case DOM_TYPES.FRAGMENT: {
            removeFragmentNode(vdom);
            break;
        }
        default: {
            throw new Error(`Can not destroy node of type ${vdom.type}`);
        }
    }
    delete vdom.element;
};

class Dispatcher {
    #subs = new Map();
    #afterHandlers = [];
    subscribe(commandName, handler) {
        if (!this.#subs.has(commandName)) {
            this.#subs.set(commandName, []);
        }
        const handlers = this.#subs.get(commandName);
        if (handlers.includes(handler)) {
            return () => {};
        }
        handlers.push(handler);
        return () => {
            const idx = handlers.indexOf(handler);
            handlers.splice(idx, 1);
        }
    }
    afterEveryCommand(handler) {
        this.#afterHandlers.push(handler);
        return () => {
            const idx = this.#afterHandlers.indexOf(handler);
            this.#afterHandlers.splice(idx,1);
        }
    }
    dispatch(commandName, payload) {
        if (this.#subs.has(commandName)) {
            this.#subs.get(commandName).forEach((handler) => handler(payload));
        } else {
            console.warn(`No handlers for command: ${commandName}`);
        }
        this.#afterHandlers.forEach((handler) => handler());
    }
}

const setClass = (element, className) => {
    element.className = '';
    if (typeof className === 'string'){
        element.className = className;
    }
    if (Array.isArray(className)) {
        element.classList.add(...className);
    }
};
const setStyle = (element, name, value) => {
    element.style[name] = value;
};
const removeAttribute = (element, name) => {
    element[name] = null;
    element.removeAttribute(name);
};
const setAttribute = (element, name, value) => {
    if (value === null) {
        removeAttribute(element, name);
    } else if (name.startsWith('data-')) {
        element.setAttribute(name, value);
    } else {
        element[name] = value;
    }
};
const setAttributes = (element, attrs) => {
    const { class: className, style, ...attributes } = attrs;
    if (className) {
        setClass(element, className);
    }
    if (style) {
        Object.entries(style).forEach(([prop, value]) => {
            setStyle(element, prop, value);
        });
    }
    for (const [name, value] of Object.entries(attributes)) {
        setAttribute(element, name, value);
    }
};

const mountDOM = (vdom, parent) => {
    switch (vdom.type) {
        case DOM_TYPES.TEXT: {
            createTextNode(vdom, parent);
            break;
        }
        case DOM_TYPES.ELEMENT: {
            createElementNode(vdom, parent);
            break;
        }
        case DOM_TYPES.FRAGMENT: {
            createFragmentNode(vdom, parent);
            break;
        }
        default: {
            throw new Error(`Can not create node of type ${vdom.type}`);
        }
    }
};
const addProps = (element, props, vdom) => {
    const { on: events, ...attrs } = props;
    vdom.listeners = addEventListeners(events, element);
    setAttributes(element, attrs);
};
const createTextNode = (vdom, parent) => {
    const { value } = vdom;
    const textNode = document.createTextNode(value);
    vdom.element = textNode;
    parent.append(textNode);
};
const createElementNode = (vdom, parent) => {
    const { props, tag, children } = vdom;
    const newElement = document.createElement(tag);
    addProps(newElement, props, vdom);
    vdom.element = newElement;
    children.forEach((child) => mountDOM(child, newElement));
    parent.append(newElement);
};
const createFragmentNode = (vdom, parent) => {
    const { children } = vdom;
    vdom.element = parent;
    children.forEach((child) => mountDOM(child, parent));
};

const createApp = ({ state, view, reducers = {} }) => {
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
    }    return {
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
};

export { createApp, hFragment, hString, hyperscript };
