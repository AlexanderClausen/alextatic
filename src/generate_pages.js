const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const grayMatter = require('gray-matter');
const templateService = require('./template_service');

async function convertMarkdownToHtml(file) {
    // Read the markdown file
    const rawContent = await fs.readFile(`./content/pages/${file}`, 'utf-8');

    // Parse front matter and content
    const { data, content } = grayMatter(rawContent);

    // Convert the markdown content to HTML
    const htmlContent = marked(content);

    // Use the templateService to wrap the HTML content
    const finalHtml = await templateService.stitchFile('page', {
        content: htmlContent,
        title: data.title,
        author: data.author,
        date: data.date,
        tags: data.tags,
        excerpt: data.excerpt,
    })

    // Construct an HTML output filename, based on basename
    const outputFilename = path.join('./public/page', path.basename(file, '.md') + '.html');

    // Save the converted content to the public directory
    await fs.outputFile(outputFilename, finalHtml);
    console.log(`✅ Generated: ${outputFilename}`);

    // Return page data for later use in generating the homepage
    return {
        content: htmlContent,
        title: data.title,
        author: data.author,
        date: data.date,
        excerpt: data.excerpt,
        filename: 'page/' + path.basename(outputFilename)
    };
}

async function convertAllMarkdownToHtml() {
    // Get a list of all files in the pages directory
    const files = await fs.readdir('./content/pages');
    const pagesData = [];

    // Process each file
    for (const file of files) {
        if (path.extname(file) === '.md') {
            const pageData = await convertMarkdownToHtml(file);
            pagesData.push(pageData);
        }
    }
    return pagesData;
}

async function deleteUnsyncedHtmlFiles() {
    const generatedHtmlFiles = (await fs.readdir('./public/page'))
        .filter(file => path.extname(file) === '.html');

    for (const htmlFile of generatedHtmlFiles) {
        const basename = path.basename(htmlFile, '.html');
        const correspondingMdFile = path.join('./content/pages', basename + '.md');

        if (!await fs.pathExists(correspondingMdFile)) {
            await fs.unlink(path.join('./public/page', htmlFile));
            console.log(`🗑️ Deleted: ${htmlFile} (as no corresponding MD file exists)`);
        }
    }
}

exports.run = async function() {
    try {
        const pagesData = await convertAllMarkdownToHtml();
        await deleteUnsyncedHtmlFiles();
        return pagesData;
    } catch (error) {
        console.error('❌ ' + error);
    }
};
