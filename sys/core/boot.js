import * as path from 'path';
import { fileURLToPath } from 'url';

const CORE = 'CORE';
const LOADER = 'LOADER';

async function boot(option) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    global.wiz = {
        type: {
            CORE,
            LOADER,
        },
        env: {
            root: path.join(__dirname, '../..'),
        },
    };
    global.notes = {};
    const loadJs = (await import('../loader/js.js')).info.wiz.load;
    const loadFile = (await import('./wiz.js')).info.wiz.loadFile;

    await loadFile('sys/core/wiz.js', { load: loadJs });
    await loadFile('sys/loader/js.js', { load: loadJs });

    await wiz.loadDir('sys/core');
    await wiz.loadDir('sys/loader');

    for (const dir of option.dirs) {
        await wiz.loadDir(dir);
    }

    console.log('notes keys: ', Object.keys(notes), Object.keys(notes.$));
}

export const info = {
    name: '$/core/boot',
    type: CORE,
    wiz: {
        boot,
    },
}