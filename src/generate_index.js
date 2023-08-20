const fs = require('fs-extra');
const path = require('path');
const templateService = require('./template_service');

async function generateHomepage(posts) {
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentPosts = posts.slice(0, 10); // Adjust the number as needed

    // Use the templateService to generate the homepage content and embed it inside the main layout
    const finalHtml = await templateService.stitchFile('homepage', { title: 'Home', posts: recentPosts });

    await fs.outputFile(path.join('./public', 'index.html'), finalHtml);
    console.log('✅ Generated: index.html');
}

exports.run = async function(posts) {
    await generateHomepage(posts);
};
