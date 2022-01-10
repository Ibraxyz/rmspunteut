let Obj = require('./home.json');

let homeObj = Obj;
/** use this for inspect invalid value */
var fs = require('fs');
const arr = [];
const filtered = homeObj.forEach((obj) => {
    if (isNaN(parseInt(obj.ikk)) && obj.ikk !== 'RK' && obj.ikk !== 'EMPTY' && obj.ikk !== 'TMB') {
        console.log(`Blok ${obj['blok']} No. ${obj['no']}  ${parseInt(obj.ikk)}`);
        arr.push(obj)
    }
})
fs.writeFile('./src/bulk-upload/home-filtered.json', JSON.stringify(arr), 'utf8', () => {
    console.log('OK')
});


//export { homeObj }