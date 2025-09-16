// Import Node.js Dependencies
import fs from "node:fs";
import path from "node:path";

const inputDir = "./articles";
const outputDir = "./blog";

function markdownToHtml(markdown) {
  let html = markdown;

  // headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // bold text
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // italic text
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // code inline `code`
  // html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // code blocks ```
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // line breaks
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";

  // empty paragraphs
  // html = html.replace(/<p><\/p>/g, "");

  return html;
}

function generateBlogPost(markdownFile) {
  const content = fs.readFileSync(markdownFile, "utf8");
  const fileName = path.basename(markdownFile, ".md");

  // extract title from first # header or use filename
  const titleMatch = content.match(/^# (.*)$/m);
  const title = titleMatch ? titleMatch[1] : fileName;

  const htmlContent = markdownToHtml(content);

  const template = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="../public/css/reset.css">
        <link rel="stylesheet" href="../public/css/blog.css">
      </head>
      <body>
        <header>
          <a href="../index.html">← Retour à l'accueil</a>
        </header>
        <main>
          <article>
            ${htmlContent}
          </article>
        </main>
      </body>
    </html>
  `;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${fileName}.html`);
  fs.writeFileSync(outputPath, template);

  console.log(`articled generated: ${outputPath}`);

  return outputPath;
}

// processes all markdown files in articles directory
function convertAllMarkdownArticles() {
  if (!fs.existsSync(inputDir)) {
    console.log(`Directory ${inputDir} does not exist`);

    return;
  }

  const files = fs.readdirSync(inputDir)
    .filter((file) => file.endsWith(".md"));

  files.forEach((file) => {
    const filePath = path.join(inputDir, file);
    generateBlogPost(filePath, outputDir);
  });

  // Generate index page
  generateBlogIndex(files, outputDir);
}

function generateBlogIndex(markdownFiles, outputDir) {
  const articles = markdownFiles.map((file) => {
    const fileName = path.basename(file, ".md");

    return `<li><a href="${fileName}.html">${fileName}</a></li>`;
  }).join("\n    ");

  const indexTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blog - NodeSecure</title>
        <link rel="stylesheet" href="../public/css/reset.css">
        <link rel="stylesheet" href="../public/css/blog.css">
      </head>
      <body>
        <header>
          <a href="../index.html">← Retour à l'accueil</a>
          <h1>Articles de blog</h1>
        </header>
        <main>
          <ul class="articles-list">
            ${articles}
          </ul>
        </main>
      </body>
    </html>
  `;

  const indexPath = path.join(outputDir, "index.html");
  fs.writeFileSync(indexPath, indexTemplate);
  console.log(`blog index generated: ${indexPath}`);
}

(() => {
  convertAllMarkdownArticles();
})();

