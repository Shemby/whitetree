const setClass = (element, className) => {
    element.className = '';

    if (typeof className === 'string'){
        element.className = className;
    }

    if (Array.isArray(className)) {
        element.classList.add(...className);
    }
};

export const setStyle = (element, name, value) => {
    element.style[name] = value;
};

export const removeStyle = (element, name) => {
    element.style[name] = null;
};

export const removeAttribute = (element, name) => {
    element[name] = null;
    element.removeAttribute(name);
};

export const setAttribute = (element, name, value) => {
    if (value === null) {
        removeAttribute(element, name);
    } else if (name.startsWith('data-')) {
        element.setAttribute(name, value);
    } else {
        element[name] = value;
    }
};

export const setAttributes = (element, attrs) => {
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