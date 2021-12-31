var fs = require('fs');

let homeJson = null;

function read(file, cb) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (!err) {
            cb(data.toString().split('\n'))
        } else {
            console.log(err)
        }
    });
}

read('./home-source.txt', function (data) {
    let newData = [];
    for (let d in data) {
        let replaced = data[d].replace(/\t/i, ' ');
        replaced = replaced.replace(/  +/g, ' ');
        let trimmed = replaced.trim();
        let splitted = trimmed.split(' ');
        newData.push({
            "blok": splitted[0],
            "no": splitted[1],
            "ikk": splitted[2]
        });
    }
    console.log(newData);
    fs.writeFile('./home.json', JSON.stringify(newData), 'utf8', ()=>{
        console.log('OK')
    });
    homeJson = newData;
});
