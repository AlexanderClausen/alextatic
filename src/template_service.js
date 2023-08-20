const fs = require('fs-extra');
const handlebars = require('handlebars');
const context = require('./context')
const formatDate = require('./date_formatter');

let templatesCache = {};

handlebars.registerHelper('formatDate', (dateString) => {
    return formatDate(dateString);
});

async function loadTemplate(templateName) {
    if (!templatesCache[templateName]) {
        const content = await fs.readFile(`./templates/${templateName}.html`, 'utf-8');
        templatesCache[templateName] = handlebars.compile(content);
    }
    return templatesCache[templateName];
}

async function stitchTemplate(templateName, data) {
    const template = await loadTemplate(templateName);
    return template(data);
}

async function stitchFile(contentTemplateName, data) {
    const navHtml = context.get('navigation')
    const contentHtml = await stitchTemplate(contentTemplateName, data);
    return await stitchTemplate('layout', { ...data, bodyContent: contentHtml, navigation: navHtml });
}


exports.stitchFile = stitchFile;
exports.stitchTemplate = stitchTemplate; // Export this for use in generate_topnav.js
