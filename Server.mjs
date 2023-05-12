import fs from 'fs';


const filename = 'example.txt';

fs.writeFile(filename, 'Hello, world!', (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Write success');
    }
});