const CleanCSS = require('clean-css');
const Terser = require('terser');
const fs = require('fs-extra');

async function minifyCSS(source, destination) {
    const input = await fs.readFile(source, 'utf-8');
    const output = new CleanCSS().minify(input);
    await fs.outputFile(destination, output.styles);
}

async function minifyJS(source, destination) {
    const input = await fs.readFile(source, 'utf-8');
    const output = Terser.minify(input);
    if (output.error) throw output.error;
    if (typeof output.code === "undefined") {
        throw new Error(`Minification failed for ${source}. Output is undefined.`);
    }
    await fs.outputFile(destination, output.code);
}

module.exports = {
    minifyCSS,
    minifyJS
};
