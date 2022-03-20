
import * as boot from './sys/core/boot.js';

async function main() {
    boot.info.wiz.boot({
        dirs: ['./resource'],
    });
}

main();