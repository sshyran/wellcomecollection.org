const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');
const fs =  require('fs');
const root = path.resolve('./views/icons');
const SVGO = require('svgo');
const svgo = new SVGO({
    plugins: [{
        removeXMLNS: true
    }]
});
// TODO: Promisify (pify)
glob(`${root}/**/*.svg`, (err, files) => {
    files.forEach(file => {
        fs.readFile(file, 'utf8', function(err, data) {
            mkdirp(path.dirname(file), () => {
                svgo.optimize(data, optimisedFile => {
                    fs.writeFile(file, optimisedFile.data);
                });
            });
        });
    });
});
