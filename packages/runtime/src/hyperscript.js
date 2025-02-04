import { filterNulls } from "./utils/arrays";

export const DOM_TYPES = {
    TEXT: 'text',
    ELEMENT: 'element',
    FRAGMENT: 'fragment',
};

const mapTextNodes = (nodes) => (
    nodes.map((node) => typeof node === 'string' ? hString(node) : node)
);

export const hFragment = (nodes) => ({ 
    type: DOM_TYPES.FRAGMENT, 
    children: mapTextNodes(filterNulls(nodes))
});

export const hString = (str) => ({ 
    type: DOM_TYPES.TEXT, 
    value: str 
});

export const hyperscript = (tag, props = {}, nodes = []) => ({
    tag,
    props,
    children: mapTextNodes(filterNulls(nodes)),
    type: DOM_TYPES.ELEMENT
});