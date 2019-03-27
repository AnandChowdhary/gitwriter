# 📝  GitWriter

[![Build status](https://img.shields.io/travis/AnandChowdhary/gitwriter.svg)](https://travis-ci.org/AnandChowdhary/gitwriter)
![Netlify status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fdeveloper.oswaldlabs.com%2Fnetlify-status%2Fe6d5a4e0-dee1-4261-833e-2f47f509c68f)
![Dependencies](https://img.shields.io/david/AnandChowdhary/gitwriter.svg)
[![GitHub](https://img.shields.io/github/license/anandchowdhary/gitwriter.svg)](https://github.com/AnandChowdhary/gitwriter/blob/master/LICENSE)
![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/AnandChowdhary/gitwriter.svg)

GitWriter is the easiest way to version control your thoughts. Write in Markdown, auto save every minute like Google Docs. Easy.

## ⭐ Usage

Login with GitHub, choose your repo and file, and just start writing.

The service is frontend-only and only uses local storage for your token. Since GitHub's OAuth endpoints don't support CORS, it also uses [Cors Anywhere](https://github.com/Rob--W/cors-anywhere/).

![Screenshot](https://raw.githubusercontent.com/AnandChowdhary/gitwriter/master/public/screenshot.png)

## 🛠 Development

Start development server with:

```bash
yarn serve
```

### XSS vulnerability

Because GitWriter uses simplemde, it's open to XSS: [CVE-2018-19057](https://nvd.nist.gov/vuln/detail/CVE-2018-19057). Since you're writing Markdown which compiles to HTML, you can add JavaScript on things like the `img` tag's `onerror` attribute. However, GitHub strips any JavaScript from Markdown files, so it will only be executed on the GitWriter site, not on GitHub.

### Todo
- [x] Autosaving
- [x] Add support for saving every 2 minutes if it's dirty (interval, not just on text change)
- [ ] Before unloading the page, make sure it's saved
- [ ] Use `localStorage` for every change, so you don't lose anything
- [x] Better auto-commit message
- [x] Add login with GitHub (integrate GitHub App, not personal token)
- [x] Show all repos, support filter/search

## License

MIT
