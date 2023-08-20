const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const grayMatter = require('gray-matter');
const templateService = require('./template_service');

async function convertMarkdownToHtml(file) {
    // Read the markdown file
    const rawContent = await fs.readFile(`./content/posts/${file}`, 'utf-8');

    // Parse front matter and content
    const { data, content } = grayMatter(rawContent);

    // Convert the markdown content to HTML
    const htmlContent = marked(content);

    // Use the templateService to wrap the HTML content
    const finalHtml = await templateService.stitchFile('post', {
        content: htmlContent,
        title: data.title,
        author: data.author,
        date: data.date,
        tags: data.tags,
        excerpt: data.excerpt,
    })

    // Construct an HTML output filename, based on date and basename
    const outputFilename = path.join('./public/post', data.date + '-' + path.basename(file, '.md') + '.html');

    // Save the converted content to the public directory
    await fs.outputFile(outputFilename, finalHtml);
    console.log(`✅ Generated: ${outputFilename}`);

    // Return post data for later use in generating the homepage
    return {
        content: htmlContent,
        title: data.title,
        author: data.author,
        date: data.date,
        excerpt: data.excerpt,
        filename: 'post/' + path.basename(outputFilename)
    };
}

async function convertAllMarkdownToHtml() {
    // Get a list of all files in the posts directory
    const files = await fs.readdir('./content/posts');
    const postsData = [];

    // Process each file
    for (const file of files) {
        if (path.extname(file) === '.md') {
            const postData = await convertMarkdownToHtml(file);
            postsData.push(postData);
        }
    }
    return postsData;
}

exports.run = async function() {
    try {
        const postsData = await convertAllMarkdownToHtml();
        return postsData;
    } catch (error) {
        console.error('❌ ' + error);
    }
};
