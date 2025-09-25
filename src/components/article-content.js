// Import Third-party Dependencies
import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

export class ArticleContent extends LitElement {
  static properties = {
    title: { type: String },
    content: { type: String }
  };

  static styles = css`
    article {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

   .article-content {
      margin: 40px 0;
      max-width: 60%;
      padding: 40px;
      background: linear-gradient(135deg, rgba(90, 68, 218, 0.5) 0%, rgba(55, 34, 175, 0.5) 100%);
      z-index: 2;
    }

    .article-content > h1, 
    .article-content > h2, 
    .article-content >h3 {
      margin: 30px 0 20px 0;
      font-weight: 600;
    }

    .article-content > h1 {
      font-size: 40px
    }

    .article-content > h2 {
      font-size: 28px;
    }

    .article-content > h3 {
      font-size: 24px;
    }

    img {
      max-width: 100%;
    }

    h1.article-title {
      display: block;
      text-align: center;
      margin: 50px 0;
    }

    .article-content > p {
      font-size: 20px;
      margin: 12px 0;
    }

    .article-content > p:has(img) {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
      gap: 20px;
      max-width: 100%;
    }

    .article-content > pre {
      position: relative;
      background-color: #1e1e1e;
      border-radius: 8px;
      overflow: hidden;
      margin: 1.5rem 0;
    }

    .article-content > pre code[class^="language-"]::before {
      display: block;
      color: grey;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }

    .article-content > pre code.language-js::before,
    .article-content > pre code.language-javascript::before {
      content: "JavaScript";
    }

    .article-content > pre code.language-ts::before,
    .article-content > pre code.language-typescript::before {
      content: "TypeScript";
    }

    .article-content > pre code.language-css::before {
      content: "CSS";
    }

    .article-content > pre code.language-html::before {
      content: "HTML";
    }

    .article-content > pre code.language-json::before {
      content: "JSON";
    }

    .article-content > pre code.language-yml::before {
      content: 'YAML'
    }

    .article-content > pre code.language-bash::before {
      content: 'BASH'
    }

    .article-content code {
      background: #23272f;
      color: #ffecb3;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 0.95em;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 500;
      box-shadow: 0 1px 2px #0002;
      white-space: break-spaces;
    }

    .article-content li {
      list-style: disc inside;
      margin-left: 1.5em;
      margin-bottom: 0.5em;
    }

    .article-content > table {
      border: 1px solid #ccc;
      border-collapse: collapse;
      width: 100%;
    }

    .article-content > table th,
    .article-content > table td {
      border: 1px solid #ccc;
      padding: 10px 16px;
    }

    .article-content > pre code {
      display: block;
      padding: 1rem;
      color: #f8f8f2;
      font-family: 'JetBrains Mono', monospace;
      background: none;
      border: none;
    }

    .external-article-link, a {
      color: white;
      text-decoration: none;
    }

    .external-article-link:hover {
      text-decoration: underline;
    }
  `;

  render() {
    const { title, content } = this;

    return html`
      <article>
        <div class="article-content">
          <h1 class="article-title">${title}</h1>
          ${unsafeHTML(content)}
        </div>
      </article>
    `;
  }
}

customElements.define("article-content", ArticleContent);
