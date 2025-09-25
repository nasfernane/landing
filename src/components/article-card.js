// Import Third-party Dependencies
import { LitElement, html, css } from "lit";

function formatDate(dateStr) {
  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

export class ArticleCard extends LitElement {
  static properties = {
    article: { type: Object },
    author: { type: Object }
  };

  static styles = css`
    .article-card {
      position: relative;
      padding: 0.5rem;
      color: #fff;
      border-radius: 12px;
      box-shadow: 0 6px 32px #0003;
      background: var(--bg-img) center/cover no-repeat, #3722AF;
      display: flex;
      transition: transform 0.2s;
      z-index: 2;
    }

    .article-card:hover {
      transform: scale(1.04);
      box-shadow: 0 12px 40px #0005;
    }

    .article-card-content {
      padding: 2rem;
      width: 100%;
      background: linear-gradient(0deg, #3722AFee 80%, #00D1FF44 100%);
      border-radius: 12px;
      display: flex; 
      flex-direction: column;
      justify-content: start;
      align-items: start;
      gap: 10px;
    }

    .article-card-header {
      display: flex;
      justify-content: start;
      align-items: start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .article-card-header {
      display: flex;
      justify-content: start;
      align-items: start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .article-card-header .authorImg {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      box-shadow:
        0 0 0 6px rgba(0, 209, 255, 0.18),
        0 0 24px 8px #00d1ff55,
        0 0 48px 8px #3722af33;
      transition: transform 0.3s, box-shadow 0.3s;
      background: linear-gradient(120deg, #261877 0%, #3722AF 100%);
      object-fit: cover;
    }

    .article-card-header .authorImg:hover {
      box-shadow:
        0 0 0 8px #00d1ff88,
        0 0 32px 12px #00d1ff77,
        0 0 64px 16px #3722af55;
    }

    .article-card-header-infos {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      gap: 0.6rem;
    }

    .article-card-header-infos > span:first-child  {
      font-size: 20px;
    }

    .article-card-header-infos > span:last-child  {
      font-size: 12px;
    }

    .article-link {
      color: white;
      font-size: 30px;
      z-index: 2;
      font-weight: 600;
    }

    .article-link:hover {
      text-decoration: underline;
    }
  `;

  render() {
    const { article, author } = this;

    const authorImgSrc = author?.github
      ? `https://github.com/${author.github}.png`
      : "https://img.icons8.com/ios-glyphs/30/test-account.png";

    return html`
      <div class="article-card">
        <div class="article-card-content">
          <div class="article-card-header">
            <a target="_blank" rel="noopener" href="https://github.com/${author.github}">
              <img class="authorImg" src="${authorImgSrc}" alt="Author">
            </a>
            <div class="article-card-header-infos">
              <span>${author?.name || article.author}</span>
              <span style="display: flex; align-items: center; gap: 10px;">
                <span style="display: flex; align-items: center; gap: 5px;">
                  <img 
                    src="https://img.icons8.com/material-rounded/24/calendar--v1.png" 
                    alt="calendar" 
                    style="width:18px;height:18px;filter:invert(1) brightness(2);"
                  />
                  <span>${formatDate(article.date)}</span>
                </span>
                <span style="display: flex; align-items: center; gap: 5px;"> 
                  <img 
                    src="https://img.icons8.com/forma-regular/24/clock.png" 
                    alt="clock" 
                    style="width:18px;height:18px;filter:invert(1) brightness(2);"
                  />
                  <span>${article.readTime} min read</span>
                </span>
              </span>
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
  }
}

customElements.define("article-card", ArticleCard);
