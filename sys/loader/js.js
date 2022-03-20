import * as fs from 'fs';
import * as path from 'path';

async function load(filepath) {
    filepath = path.join(wiz.env.root, filepath);

    const content = fs.readFileSync(filepath, {
        encoding: 'utf-8',
    });

    let info = (await import(filepath)).info;

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

export const info = {
    name: '$/loader/js',
    type: wiz.type.LOADER,
    wiz: {
        load,
        loadable,
    },
}
