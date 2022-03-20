import * as fs from 'fs'
import * as path from 'path'
import yaml from 'yaml'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'


async function load(filepath) {
    const content = fs.readFileSync(filepath, {
        encoding: 'utf-8',
    });

    let info = {};

    const processor = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter, ['yaml', 'toml'])
        .use(() => (tree) => {
            if (tree.children && tree.children[0] && tree.children[0].type === 'yaml') {
                info = yaml.parse(tree.children[0].value);
            }
        })
        .use(remarkStringify)
        .use(rehypeStringify)
        .use(remarkRehype)


    const res = await processor.process(content);
    
    let name = path.basename(filepath);
    const ext = path.extname(name);

    info = Object.assign({}, { ...info });
    info = Object.assign(info, {
        name: name.substring(0, name.length - ext.length),
        filepath,
        filetype: 'markdown',
        content,
        html: res.value,
    });

    return info;
}

function loadable(filepath) {
    const ext = path.extname(filepath);
    return ext === '.md' || ext === '.markdown' || ext === '.mdx';
}

export const info = {
    name: '$/loader/markdown',
    type: wiz.type.LOADER,
    wiz: {
        load,
        loadable,
    },
}
