const fs = require('fs-extra');
const path = require('path');
const templateService = require('./template_service');

async function generateNavHtml() {
    const menuData = await fs.readJson(path.join(__dirname, '../config/menu_config.json'));

    // Check if all internal pages exist
    var notfound_counter = 0;
    for (const item of menuData.items) {
        if (!item.link.startsWith("http") && !await fs.pathExists(path.join(__dirname, '../public', item.link))) {
            console.warn(`⚠️ Warning: The internal page ${item.link} referenced in menu_config.json does not exist.`);
            notfound_counter++;
        }
    }
    if (notfound_counter === 0) {
        console.log(`✅ Generated: Top Navigation Bar - All internal pages referenced in menu_config.json exist.`);
    }

    return templateService.stitchTemplate('topnav', menuData);
}

module.exports = {
    generateNavHtml
};
