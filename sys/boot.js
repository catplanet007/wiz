const CORE = 'CORE';
const LOADER = 'LOADER';

function boot(option) {
    global.wiz = {
        type: {
            CORE,
            LOADER,
        },
    };
    global.notes = {};
    const loadJs = require('./loader/js.js').wiz.load;
    const loadFile = require('./core.js').wiz.loadFile;

    loadFile('sys/core.js', { load: loadJs });
    loadFile('sys/loader/js.js', { load: loadJs });
    wiz.loadDir('sys');

    for (const dir of option.dirs) {
        wiz.loadDir(dir);
    }

    console.log('wiz: ', wiz);
    console.log('notes keys: ', Object.keys(notes), Object.keys(notes.$));
}

module.exports = {
    name: '$/boot',
    type: CORE,
    wiz: {
        boot,
    },
}