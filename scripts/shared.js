// Shared layout utilities for the static site (auth temporarily disabled)
(function () {
    'use strict';

    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/zh/') || path.includes('/en/')) {
            return '../';
        }
        return '';
    }

    function createSharedHeader() {
        const basePath = getBasePath();
        const isZh = window.location.pathname.includes('/zh/');
        const isEn = window.location.pathname.includes('/en/');

        const header = document.createElement('header');
        header.className = 'shared-header';

        const container = document.createElement('div');

        const title = document.createElement('h1');
        title.className = 'title';
        const homeLink = document.createElement('a');
        homeLink.className = 'link';
        homeLink.textContent = isZh ? '孙玲' : 'Sun Ling';
        title.appendChild(homeLink);

        const nav = document.createElement('nav');
        nav.setAttribute('aria-label', isZh ? '语言' : 'Language');
        const enLink = document.createElement('a');
        enLink.href = isEn ? `${basePath}zh/` : `${basePath}en/`;
        enLink.textContent = 'English';
        if (isEn) enLink.setAttribute('aria-current', 'true');
        const zhLink = document.createElement('a');
        zhLink.href = isZh ? `${basePath}en/` : `${basePath}zh/`;
        zhLink.textContent = '普通话';
        if (isZh) zhLink.setAttribute('aria-current', 'true');

        nav.appendChild(enLink);
        nav.appendChild(zhLink);

        container.appendChild(title);
        container.appendChild(nav);
        header.appendChild(container);

        return header;
    }

    function createSharedFooter() {
        const footer = document.createElement('div');
        footer.className = 'footer-inline';

        const email = document.createElement('a');
        email.className = 'link';
        email.href = 'mailto:sunling621@gmail.com';
        email.title = 'Email';
        email.setAttribute('aria-label', 'Email');
        email.innerHTML = '<svg viewBox="0 0 24 24" role="img"><rect x="3" y="5" width="18" height="14" rx="2" fill="none"></rect><path d="M3 7l9 6 9-6" fill="none"></path></svg>';

        const github = document.createElement('a');
        github.className = 'link';
        github.href = 'https://github.com/sunling';
        github.title = 'GitHub';
        github.setAttribute('aria-label', 'GitHub');
        github.target = '_blank';
        github.rel = 'noreferrer';
        github.innerHTML = '<svg viewBox="0 0 24 24" role="img"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.79-.25.79-.56v-2.02c-3.2.7-3.88-1.37-3.88-1.37-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.04 1.79 2.73 1.27 3.4.97.1-.78.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.09-.12-.3-.52-1.52.11-3.17 0 0 .98-.31 3.21 1.18a11 11 0 0 1 5.84 0c2.23-1.49 3.2-1.18 3.2-1.18.63 1.65.23 2.87.11 3.17.75.8 1.2 1.83 1.2 3.09 0 4.43-2.69 5.4-5.25 5.68.42.36.8 1.07.8 2.17v3.22c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"></path></svg>';

        const linkedin = document.createElement('a');
        linkedin.className = 'link';
        linkedin.href = 'https://www.linkedin.com/in/lingsunhi/';
        linkedin.title = 'LinkedIn';
        linkedin.setAttribute('aria-label', 'LinkedIn');
        linkedin.target = '_blank';
        linkedin.rel = 'noreferrer';
        linkedin.innerHTML = '<svg viewBox="0 0 24 24" role="img"><path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.454C23.204 24 24 23.226 24 22.271V1.729C24 .774 23.204 0 22.225 0zM7.34 20.452H3.998V9h3.342v11.452zM5.667 7.433a1.942 1.942 0 110-3.883 1.942 1.942 0 010 3.883zM20.447 20.452h-3.352v-5.569c0-1.328-.026-3.037-1.85-3.037-1.853 0-2.136 1.447-2.136 2.944v5.662H9.757V9h3.212v1.561h.046c.447-.846 1.537-1.732 3.164-1.732 3.386 0 4.268 2.229 4.268 5.126v6.497z"></path></svg>';

        footer.appendChild(email);
        footer.appendChild(github);
        footer.appendChild(linkedin);

        return footer;
    }


    function renderBgWords() {
        let container = document.querySelector('.bg-words');
        if (!container) {
            container = document.createElement('div');
            container.className = 'bg-words';
            document.body.insertBefore(container, document.body.firstChild);
        }
        container.innerHTML = '';
        const isZh = window.location.pathname.includes('/zh/');
        const phrases = isZh
            ? ['坚持出现', '相信过程', '每天一点点', '持续迭代']
            : ['Trust the process', 'Keep showing up', 'Small steps', 'Iterate daily'];
        const w = window.innerWidth;
        const h = window.innerHeight;
        const padding = 24;
        const maxCount = w < 640 ? 8 : 12;
        const placed = [];
        for (let i = 0; i < maxCount; i++) {
            const p = document.createElement('p');
            p.textContent = phrases[Math.floor(Math.random() * phrases.length)];
            const size = Math.round(14 + Math.random() * 8);
            const opacity = (0.020 + Math.random() * 0.010).toFixed(3);
            const rotate = (Math.random() - 0.5) * 10;
            p.style.fontSize = size + 'px';
            p.style.opacity = opacity;
            p.style.transform = 'rotate(' + rotate + 'deg)';
            container.appendChild(p);
            const pw = p.offsetWidth;
            const ph = p.offsetHeight;
            let tries = 0;
            let x, y;
            const maxX = w - pw - padding;
            const maxY = h - ph - padding;
            if (maxX <= padding || maxY <= padding) {
                container.removeChild(p);
                break;
            }
            do {
                x = Math.round(padding + Math.random() * maxX);
                y = Math.round(padding + Math.random() * maxY);
                let overlaps = false;
                for (const r of placed) {
                    if (!(x + pw + 6 < r.x || r.x + r.w + 6 < x || y + ph + 6 < r.y || r.y + r.h + 6 < y)) {
                        overlaps = true;
                        break;
                    }
                }
                if (!overlaps) break;
                tries++;
            } while (tries < 50);
            if (tries >= 50) {
                container.removeChild(p);
                continue;
            }
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            placed.push({ x, y, w: pw, h: ph });
        }
    }

    function renderRecentWriting() {
        const grid = document.querySelector('.recent-writing .writing-grid');
        if (!grid) return;
        const isZh = window.location.pathname.includes('/zh/');
        const base = getBasePath();
        fetch(base + 'data/recent-writing.json')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                const items = (isZh ? data.zh : data.en).slice(0, 3);
                grid.innerHTML = '';
                items.forEach(function (item) {
                    const a = document.createElement('a');
                    a.className = 'writing-card';
                    a.href = item.url;
                    a.target = '_blank';
                    a.rel = 'noreferrer';
                    const title = document.createElement('div');
                    title.className = 'title';
                    title.textContent = item.title;
                    const summary = document.createElement('div');
                    summary.className = 'summary';
                    summary.textContent = truncateSummary(item.summary);
                    const more = document.createElement('div');
                    more.className = 'more';
                    more.innerHTML = (isZh ? '阅读更多' : 'Read More');
                    a.appendChild(title);
                    a.appendChild(summary);
                    a.appendChild(more);
                    grid.appendChild(a);
                });
            })
            .catch(function () { });
    }

    function truncateSummary(text) {
        const limit = window.innerWidth <= 640 ? 90 : 140;
        const t = String(text || '');
        if (t.length <= limit) return t;
        return t.slice(0, limit).replace(/[,.，。;；、!\s]+$/, '') + '…';
    }

    function initSharedComponents() {
        if (!document.querySelector('.shared-header') && !document.querySelector('header')) {
            const body = document.body;
            const header = createSharedHeader();
            body.insertBefore(header, body.firstChild);
        }

        const bio = document.querySelector('.profile .profile-bio');
        if (bio && !bio.querySelector('.footer-inline')) {
            const footer = createSharedFooter();
            bio.appendChild(footer);
        }
        renderBgWords();
        window.addEventListener('resize', renderBgWords);
        renderRecentWriting();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSharedComponents);
    } else {
        initSharedComponents();
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { createSharedHeader, createSharedFooter, initSharedComponents };
    }
})();
