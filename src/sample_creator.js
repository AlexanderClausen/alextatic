const fs = require('fs-extra');
const path = require('path');

const contentDirectories = [
    'content/posts',
    'content/pages',
    // add more directories as needed
];

const getSampleMarkdownContent = (date) => 
`---
title: "Meaningful Title"
author: "John Doe"
date: "${date}"
tags: ["tag1", "tag2"]
---

# Heading
## Subheading
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et elit lobortis, mattis dui sed, vehicula erat. Praesent posuere lacus et molestie aliquet. Donec fringilla pellentesque dui, sit amet vehicula nunc blandit at. Vivamus ex sapien, auctor a porttitor nec, venenatis sed dolor. Vestibulum ut eleifend magna. Mauris vestibulum luctus nibh vitae varius. Suspendisse vel condimentum libero. Fusce id lacinia odio.
`;

async function createSampleMarkdownIfNotExist(directory) {
    const files = await fs.readdir(directory);
    const mdFiles = files.filter(file => path.extname(file) === '.md');

    if (mdFiles.length === 0) {
        const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        await fs.outputFile(path.join(directory, 'sample.md'), getSampleMarkdownContent(currentDate));
        console.log(`✅ Created a sample.md in ${directory}`);
    }
}

async function ensureSampleMarkdownFiles() {
    for (const dir of contentDirectories) {
        await createSampleMarkdownIfNotExist(dir);
    }
}

module.exports = {
    ensureSampleMarkdownFiles
};
