const fs = require('fs');
const path = require('path');

function load(filepath) {
    const content = fs.readFileSync(filepath, {
        encoding: 'utf-8',
    });
    let name = path.basename(filepath);
    const ext = path.extname(name);
    return {
        name: name.substring(0, name.length - ext.length),
        content,
    }
}

function loadable(filepath) {
    const ext = path.extname(filepath);
    return ext === '.md' || ext === '.markdown' || ext === '.mdx';
}


module.exports = {
    name: '$/loader/markdown',
    type: wiz.type.LOADER,
    wiz: {
        load,
        loadable,
    },
}
