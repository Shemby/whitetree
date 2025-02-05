export const addEventListener = (eventName, eventHandler, element) => {
    element.addEventListener(eventName, eventHandler);
    return eventHandler;
};

export const addEventListeners = (eventListeners = {}, element) => {
    const addedListeners = {};

    Object.entries(eventListeners).forEach(([eventName, eventHandler]) => {
        const eventListener = addEventListener(eventName, eventHandler, element);
        addedListeners[eventName] = eventListener;
    });

    return addedListeners;
};