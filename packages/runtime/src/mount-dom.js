import { DOM_TYPES } from "./hyperscript";
import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";

export const mountDOM = (vdom, parent) => {
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
    vdom.el = textNode;

    parent.append(textNode);
};

const createElementNode = (vdom, parent) => {
    const { props, tag, children } = vdom;

    const newElement = document.createElement(tag);
    addProps(newElement, props, vdom);
    vdom.el = newElement;

    children.forEach((child) => mountDOM(child, newElement));
    parent.append(newElement);
};

const createFragmentNode = (vdom, parent) => {
    const { children } = vdom;
    vdom.el = parent;

    children.forEach((child) => mountDOM(child, parent));
};