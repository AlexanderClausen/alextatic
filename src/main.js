const fs = require('fs-extra');

const generatePosts = require('./generate_posts');
const generatePages = require('./generate_pages');
const generateIndex = require('./generate_index');
const { generateNavHtml, checkInternalLinksExistence } = require('./generate_topnav.js');
const context = require('./context');
const { ensureSampleMarkdownFiles } = require('./sample_creator.js');
const copyAndProcessAssets = require('./copy_assets');

(async function main() {
    try {
        // Remove the existing "public" directory
        await fs.remove('./public');
        console.log('🗑️  Cleaned up old build');
    
        // ... rest of your code
    } catch (error) {
        console.error('❌ An error occurred during the generation process:', error);
    }
    
    try {
        // Ensure sample markdown files are created if none exist
        await ensureSampleMarkdownFiles();

        // Generate the navigation HTML
        const navHtml = await generateNavHtml();
        context.set('navigation', navHtml);

        // Pass the navigation HTML to the generators
        const postsData = await generatePosts.run();
        
        // Check the validity of the postsData before proceeding
        if (!postsData || !Array.isArray(postsData) || postsData.length === 0) {
            console.error('❌ Error generating posts or no posts found.');
            return;
        }
        
        const pagesData = await generatePages.run();

        // Check the validity of the pagesData before proceeding
        if (!pagesData || !Array.isArray(pagesData) || pagesData.length === 0) {
            console.error('❌ Error generating pages or no pages found.');
            return;
        }

        await generateIndex.run(postsData, navHtml);
        
        // Copy and process (minify) assets
        await copyAndProcessAssets();

        // Check the existence of internal links
        await checkInternalLinksExistence();


    } catch (error) {
        console.error('❌ An error occurred during the generation process:', error);
    }
})();