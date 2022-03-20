const fs = require('fs');
const path = require('path');

const rootPath = path.resolve(__dirname, '../../');

function newFunction(code) {
    return () => {
        const codeExports = {};
        const codeModule = {
            exports: codeExports,
        };
        return new Function(
            'exports',
            'require',
            'module',
            '__filename',
            '__dirname',
            `${code};
            return Object.assign(module.exports, exports);`
        )(codeExports, require, codeModule, __filename, __dirname);
    }
}

function load(filepath) {
    filepath = path.resolve(rootPath, filepath);

    const content = fs.readFileSync(filepath, {
        encoding: 'utf-8',
    });

    const fn = newFunction(content);
    let info = fn();

    info = Object.assign({}, { ...info });
    info = Object.assign(info, {
        filepath,
        filetype: 'js',
        content,
    });
    return info;
}

function loadable(filepath) {
    return '.js' === path.extname(filepath);
}

module.exports = {
    name: '$/loader/js',
    type: wiz.type.LOADER,
    wiz: {
        load,
        loadable,
    },
}
