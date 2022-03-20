import * as fs from 'fs';
import * as path from 'path';

function mount(name, info) {
    const { holder, mountAt } = calcMountAt(name);
    if (holder[mountAt]) {
        return true;
    }
    holder[mountAt] = info;
    return false;
}

function calcMountAt(name) {
    const arr = name.split('/');
    let holder = notes;
    for (const v of arr.slice(0, arr.length - 1)) {
        if (v === '') {
            continue;
        }
        if (!holder[v]) {
            holder[v] = {};
        }
        holder = holder[v];
    }
    const mountAt = arr[arr.length - 1];
    return {
        holder,
        mountAt,
    }
}

const sources = new Map();

async function loadFile(filepath, option = {}) {
    if (option?.load) {
        const info = await option.load(filepath);
        if (mount(info.name, info)) {
            return;
        }
        registerWiz(info);
        return;
    }
    for (const loader of wiz.loaders) {
        if (loader.loadable(filepath)) {
            const info = await loader.load(filepath);
            if (mount(info.name, info)) {
                return;
            }
            registerWiz(info);
            return;
        }
    }
    console.warn(`no loader can load ${filepath}`);
}

async function loadDir(dir) {
    const filenames = fs.readdirSync(dir);
    for (const filename of filenames) {
        const filepath = path.join(dir, filename);
        var stat = fs.statSync(filepath);
        if (stat.isFile()) {
            await loadFile(filepath);
        } else if (stat.isDirectory()) {
            await loadDir(filepath);
        }
    }
}

function registerWiz(info) {
    if (info.type === wiz.type.LOADER) {
        registerLoader(info);
        return true;
    }
    if (info.type === wiz.type.CORE) {
        registerCore(info);
        return true;
    }
    return false;
}

function registerLoader(info) {
    sources.set(info.wiz.load, info.name);
    sources.set(info.wiz.loadable, info.name);
    wiz.loaders.push({
        load: info.wiz.load,
        loadable: info.wiz.loadable,
    });
}

function registerCore(info) {
    for (const [k, v] of Object.entries(info.wiz)) {
        wiz[k] = v;
    }
}

export const info = {
    name: '$/core/wiz',
    type: wiz.type.CORE,
    wiz: {
        loadFile,
        loadDir,
        source: (obj) => {
            return sources.get(obj);
        },
        loaders: [],
    },
}