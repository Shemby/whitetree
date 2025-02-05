import { DOM_TYPES } from "./hyperscript";
import { removeEventListeners } from "./events";

const removeTextNode = (vdom) => {
    const { el } = vdom;
    el.remove();
};

const reomveElementNode = (vdom) => {
    const { el, children, listeners } = vdom;

    el.remove();
    children.forEach(destroyDOM);

    if(listeners) {
        removeEventListeners(listeners, el);
        delete vdom.listeners;
    }
};

const removeFragmentNode = (vdom) => {
    const { children } = vdom;
    children.forEach(destroyDOM);
};d

export const destroyDOM = (vdom) => {
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

    delete vdom.el;
};