// Shared layout utilities for the static site (auth temporarily disabled)
(function() {
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
        homeLink.href = `${basePath}index.html`;
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
        const footer = document.createElement('footer');

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

        footer.appendChild(email);
        footer.appendChild(github);

        return footer;
    }

    function initSharedComponents() {
        if (!document.querySelector('.shared-header') && !document.querySelector('header')) {
            const body = document.body;
            const header = createSharedHeader();
            body.insertBefore(header, body.firstChild);
        }

        if (!document.querySelector('footer')) {
            const footer = createSharedFooter();
            document.body.appendChild(footer);
        }
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
