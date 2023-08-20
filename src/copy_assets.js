const fs = require('fs-extra');
const path = require('path');
const { minifyCSS, minifyJS } = require('./minify_assets');

async function copyAndProcessAssets() {
    console.log("🔍 Reading config.json...");
    // Read the theme from the config.json
    const config = await fs.readJson(path.join(__dirname, '../config/config.json'));
    const theme = config.theme || 'default';  // Default to a theme named 'default' if none specified
    console.log(`📝 Theme set to: ${theme}`);

    // Copy only the selected theme's CSS to public/css
    const themeSrcDir = path.join('./assets/css', theme);
    const cssDestDir = './public/css/';
    console.log(`🔍 Copying theme files from ${themeSrcDir} to ${cssDestDir}...`);
    await fs.copy(themeSrcDir, cssDestDir);
    console.log("✅ CSS Theme files copied.");

    // Get all files within the CSS directory
    console.log("🔍 Processing CSS files for minification...");
    const cssFiles = await fs.readdir(cssDestDir);
    for (const cssFile of cssFiles) {
        if (path.extname(cssFile) === '.css') {
            const originalPath = path.join(cssDestDir, cssFile);
            console.log(`🔄 Minifying CSS file: ${originalPath}`);
            await minifyCSS(originalPath, originalPath);
            console.log(`✅ Minified: ${originalPath}`);
        }
    }

    // Copy JS assets to the public folder
    const jsSrcDir = './assets/js/';
    const jsDestDir = './public/js/';
    console.log(`🔍 Copying JS files from ${jsSrcDir} to ${jsDestDir}...`);
    await fs.copy(jsSrcDir, jsDestDir);
    console.log("✅ JS files copied.");

    // WIP: throws error
    // // Minify all JS files in the public folder
    // console.log("🔍 Processing JS files for minification...");
    // const jsFiles = await fs.readdir(jsDestDir);
    // for (const jsFile of jsFiles) {
    //     if (path.extname(jsFile) === '.js') {
    //         const originalPath = path.join(jsDestDir, jsFile);
    //         console.log(`🔄 Minifying JS file: ${originalPath}`);
    //         await minifyJS(originalPath, originalPath);
    //         console.log(`✅ Minified: ${originalPath}`);
    //     }
    // }

    console.log('✅ Assets processed successfully.');
}

module.exports = copyAndProcessAssets;
