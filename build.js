// build.js
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const outputDir = path.join(__dirname, 'public');
const readmePath = path.join(__dirname, 'README.md');
const cssOriginPath = path.join(__dirname, 'node_modules/github-markdown-css/github-markdown.css');
const cssDestPath = path.join(outputDir, 'style.css');
const htmlDestPath = path.join(outputDir, 'index.html');
// ---------------------

try {
  // 1. Create public directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // 2. Read and convert README.md
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  const htmlContent = marked(readmeContent);

  // 3. Copy the GitHub CSS file
  fs.copyFileSync(cssOriginPath, cssDestPath);

  // 4. Create the final index.html template
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>README</title>
  <link rel="stylesheet" href="style.css">
  <style>
    /* This centers the content and adds padding, like GitHub */
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
    }
    @media (max-width: 767px) {
      .markdown-body {
        padding: 15px;
      }
    }
  </style>
</head>
<body class="markdown-body">
  ${htmlContent}
</body>
</html>
`;

  // 5. Write the index.html file
  fs.writeFileSync(htmlDestPath, htmlTemplate);

  console.log('Build complete! /public/index.html and /public/style.css generated.');

} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
