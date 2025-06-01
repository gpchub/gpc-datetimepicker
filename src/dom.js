export const show = (el) => el.style.display = '';
export const hide = (el) => el.style.display = 'none';
export const toggle = (el) => el.style.display = (el.style.display ==='none' ? '' : 'none');
export const setStyles = (el, styles) => Object.assign(el.style, styles);
export const setAttributes = (el, attrs) => Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
export const triggerEvent = (el, type, detail = {}) => el.dispatchEvent(new CustomEvent(type, { bubbles: true, detail }));

export function createElement (tagName = 'div', className = '', innerHtml = '', id = '', attrs = {}) {
    let $element = document.createElement(tagName);
    if (className) $element.classList.add(...className.split(' '));
    if (id) $element.id = id;

    if (innerHtml) {
        $element.innerHTML = innerHtml;
    }

    if (attrs) {
        setAttributes($element, attrs);
    }

    return $element;
}

/** Tính offset của element so với document */
export function getDocumentOffset(element) {
    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;

    return {
        top: rect.top + win.scrollY,
        right: rect.right + win.scrollX,
        bottom: rect.bottom + win.scrollY,
        left: rect.left + win.scrollX,
    };
}

export function delegateEvent (parent, selector, eventType, handler) {
    const parentElement = typeof parent === 'string'
        ? document.querySelector(parent)
        : parent;

    if (!parentElement) {
        console.warn(`Parent element with selector "${parent}" not found.`);
        return;
    }

    parentElement.addEventListener(eventType, (e) => {
        const target = e.target.closest(selector);
        if (target && parentElement.contains(target)) {
            handler.call(target, e, target);
        }
    });
}

function getScrollableAncestors(element) {
    const scrollables = [];
    let parent = element.parentElement;

    while (parent) {
        const style = getComputedStyle(parent);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
            scrollables.push(parent);
        }
        parent = parent.parentElement;
    }

    // Also listen to window scroll (viewport)
    scrollables.push(window);
    return scrollables;
}

export function setPosition(popupElement, referenceElement) {
    const scrollableAncestors = getScrollableAncestors(referenceElement);

    function updatePosition() {
        const viewportHeight = window.innerHeight;
        const viewportWidth = document.documentElement.clientWidth;

        const popupRect = {
            width: popupElement.offsetWidth,
            height: popupElement.offsetHeight,
        };

        const refRect = referenceElement.getBoundingClientRect();

        const fitsBelow = refRect.bottom + popupRect.height <= viewportHeight;
        const top = fitsBelow
            ? refRect.bottom
            : Math.max(0, refRect.top - popupRect.height);

        let left = refRect.left;
        const overflowsRight = left + popupRect.width > viewportWidth;

        if (overflowsRight) {
            const fitsRightAligned = refRect.right >= popupRect.width;
            left = fitsRightAligned
                ? refRect.right - popupRect.width
                : Math.max(0, viewportWidth - popupRect.width);
        }

        setStyles(popupElement, {
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            bottom: '',
        });
    }

    // Initial position
    updatePosition();

    // Add listeners to all scrollable ancestors + resize
    scrollableAncestors.forEach(el => {
        el.addEventListener('scroll', updatePosition, { passive: true });
    });
    window.addEventListener('resize', updatePosition);

    // Cleanup function to remove listeners
    return () => {
        scrollableAncestors.forEach(el => {
            el.removeEventListener('scroll', updatePosition);
        });
        window.removeEventListener('resize', updatePosition);
    };
}

export default {
    setAttributes,
    createElement,
    show,
    hide,
    toggle,
    setStyles,
    getDocumentOffset,
    triggerEvent,
    delegateEvent,
    setPosition,
}