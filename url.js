const util = require('util');
const fs = require('fs');

function f() {
    const url = util.format(
        'mongodb://%s:%s@%s/?replicaSet=%s&authSource=%s&ssl=true',
        'filippovdima5',
        '24D1ma055x',
        [
            'rc1a-9vw44880ruyc0y5y.mdb.yandexcloud.net:27018'
        ].join(','),
        'rs01',
        'sito-mongo'
    )

    // const options = {
    //     useNewUrlParser: true,
    //     replSet: {
    //         sslCA: fs.readFileSync(
    //             '/usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt')
    //     }
    // }

    console.log(url)
}
 f()
