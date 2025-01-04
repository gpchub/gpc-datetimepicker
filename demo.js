function padZero(n) {
    return n < 10 ? '0' + n : n;
}

function createElement(tag, attrs = {}, html = '') {
    const el = document.createElement(tag);

    if (attrs !== null && typeof attrs === 'object') {
        Object.keys(attrs).forEach(key => {
            el.setAttribute(key, attrs[key]);
        });
    }

    if (typeof html === 'string') {
        el.innerHTML = html;
    } else if (typeof html === 'object') {
        el.appendChild(html);
    }

    return el;
}

function createDTP(id, options = {}) {
    const dtp = new GDatetimepicker('#' + id, {...options});
    dtp.on('change', function (value) {
        document.getElementById(`${id}_value`).textContent = dtp.getValueString();
    });

    const input = document.getElementById(id);

    const currentValue = dtp.getValueString();
    const valueText = createElement('p', {
        class: 'mt-2'
    }, `Value string: <code id="${id}_value">${currentValue}</code>`);
    input.after(valueText);

    let codeHtml = input.value ? input.outerHTML + '\n\n' : '';
    if (! Object.keys(options).length) {
        codeHtml += `const ${id} = new GDatetimepicker('#${id}');`;
    } else {
        codeHtml += `const ${id} = new GDatetimepicker('#${id}', ` + JSON5.stringify(options, null, "\t") + `);`;
    }

    const codeElem = createElement('code', {
        class: 'language-javascript',
        id: 'code_' + id
    });
    codeElem.textContent = codeHtml;

    const preElem = createElement('pre', {}, codeElem);
    valueText.after(preElem);
}