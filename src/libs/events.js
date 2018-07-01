import { isDescendant, selectorMatches, } from './utils';

// https://stackoverflow.com/a/5116987/4931825
export const getEventTarget = (event) => {
    event = event || window.event;
    return event.target || event.srcElement;
};

export const dispatchEvent = (appRoot, name, detail = {}) => {
    const event = new CustomEvent(name, {
        detail,
    });

    if (appRoot && typeof appRoot.dispatchEvent === 'function') {
        appRoot.dispatchEvent(event);
    } else console.log('{{Events.dispatchEvent}}: App root is invalid', appRoot);
};

/**
 *  To: Pass options object since args list is growing
 * @param {*} eventName
 * @param {*} appRoot
 * @param {*} handler
 * @param {*} targetSelector
 * @param {*} skipPrevents
 */
export const handleEvent = (eventName, appRoot, handler, targetSelector, skipPrevents) => {
    if (appRoot && typeof appRoot.addEventListener === 'function') {
        appRoot.addEventListener(eventName, (event) => {
            if (!skipPrevents) {
                event.preventDefault();
                event.stopPropagation();
            }

            if (targetSelector) {
                const target = getEventTarget(event);
                if (selectorMatches(target, targetSelector) || isDescendant(target, targetSelector)) handler(event);
            } else handler(event);
        });
    } else console.log('{{Events.handleEvent}}: App root is invalid', appRoot);
};
