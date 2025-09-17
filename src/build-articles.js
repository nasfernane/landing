// Import Node.js Dependencies
import fs from "node:fs";
import path from "node:path";

// Import Third-party Dependencies
import { marked } from "marked";

const inputDir = "./articles";
const outputDir = "./blog";
const coreContributors = [];

// function markdownToHtml(markdown) {
//   let html = markdown;

//   // escapes "<" that are not html tags
//   html = html.replace(/</g, "&lt;");

//   // headers
//   html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
//   html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
//   html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

//   // bold text
//   html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

//   // italic text
//   html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

//   // links [text](url)
//   html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

//   // code blocks ```
//   const usedLangages = ["json", "js", "ts", "css"];

//   for (const lang of usedLangages) {
//     const regex = new RegExp(`\`\`\`${lang}([\\s\\S]*?)\`\`\``, "g");
//     html = html.replace(regex, "<pre><code>$1</code></pre>");
//   }

//   // line breaks
//   html = html.replace(/\n\n/g, "</p><p>");
//   html = "<p>" + html + "</p>";

//   // empty paragraphs
//   // html = html.replace(/<p><\/p>/g, "");

//   return html;
// }

function generateBlogPost(markdownFile) {
  const markdownContent = fs.readFileSync(markdownFile, "utf8");
  const fileName = path.basename(markdownFile, ".md");

  const { metadata, content } = parseYamlFile(markdownContent);
  // const htmlContent = markdownToHtml(content);
  const htmlContent = marked.parse(content);

  const baseArticleTemplate = fs.readFileSync(`${outputDir}/article-base-template.html`, "utf-8");

  const articleTemplate = baseArticleTemplate.replace("<article></article>", `
    <article>
      <div class="article-content">
        <h1 class="article-title">${metadata.title}</h1>
        ${htmlContent}
      </div>
    </article>`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${fileName}.html`);
  fs.writeFileSync(outputPath, articleTemplate);

  return { ...metadata, path: `${fileName}.html` };
}

function parseYamlFile(content) {
  if (!content.startsWith("---")) {
    return { metadata: {}, content };
  }

  const lines = content.split("\n");
  let endLineIndex = -1;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      endLineIndex = i;
      break;
    }
  }

  if (endLineIndex === -1) {
    return { metadata: {}, content };
  }

  // Extraire le frontmatter (entre les deux ---)
  const frontmatterLines = lines.slice(1, endLineIndex);
  const markdownLines = lines.slice(endLineIndex + 1);

  // const frontmatterText = frontmatterLines.join("\n");
  const markdownContent = markdownLines.join("\n").trim();

  // Parser le YAML simple (clé: valeur)
  const metadata = {};

  for (const line of frontmatterLines) {
    const trimmedLine = line.trim();
    if (trimmedLine && trimmedLine.includes(":")) {
      const [key, ...valueParts] = trimmedLine.split(":");
      const value = valueParts.join(":").trim();
      metadata[key.trim()] = value;
    }
  }

  return { metadata, content: markdownContent };
}

// processes all markdown files in articles directory
export function convertAllMarkdownArticles() {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`${inputDir} directory does not exist`);
  }

  const files = fs.readdirSync(inputDir)
    .filter((file) => file.endsWith(".md"));

  const articles = files.map((file) => {
    const filePath = path.join(inputDir, file);

    return generateBlogPost(filePath, outputDir);
  });

  // Generate index page
  generateBlogIndex(articles);
}

function generateBlogIndex(articles) {
  const articlesList = articles.map((article) => {
    const coreContributor = coreContributors.filter((c) => c.github === article.author)?.[0];
    console.log("coreContributors", coreContributors);

    const imgSource = coreContributor?.github
      ? `https://github.com/${coreContributor.github}.png`
      : "https://img.icons8.com/ios-glyphs/30/test-account.png";

    return `
      <div class="article-card">
        <div class="article-card-content">
          <div class="article-card-header">
            <a>
              <img src="${imgSource}" alt="Thomas">
            </a>
            <div class="article-card-header-infos">
              <span>${coreContributor?.name || article.author}</span>
              <span>${article.date}</span>
            </div>
          </div>
          <a 
            href="${article.path}" 
            title="${article.title}" 
            class="article-link">
            <span>${article.title}</span>
          </a>
          <p>${article.description}</p>
      </div>
      </div>
      `;
  }).join("\n    ");

  const baseTemplate = fs.readFileSync(`${outputDir}/index-base-template.html`, "utf-8");

  const indexTemplate = baseTemplate.replace('<section class="articles-list"></section>', `
    <section class="articles-list">
      ${articlesList}
    </section>`);

  const indexPath = path.join(outputDir, "index.html");
  fs.writeFileSync(indexPath, indexTemplate);
}

(async() => {
  const response = await fetch("https://raw.githubusercontent.com/NodeSecure/Governance/main/contributors.json");

  if (!response.ok) {
    throw new Error(`Error while fetching contributors list: ${response.status}`);
  }

  const contributors = await response.json();

  if (contributors.core) {
    coreContributors.push(...contributors.core);
  }

  convertAllMarkdownArticles();
})();

