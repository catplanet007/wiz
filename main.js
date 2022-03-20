const boot = require('./sys/boot');

async function main() {
    boot.wiz.boot({
        dirs: ['./resource'],
    });
}

main();