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
        const header = document.createElement('div');
        header.className = 'shared-header';

        const headerContent = document.createElement('div');
        headerContent.className = 'header-content';

        // Left: logo + slogan
        const leftSection = document.createElement('div');
        leftSection.className = 'header-left';

        const logoContainer = document.createElement('div');
        logoContainer.className = 'logo-container';

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = 'LS';

        const logo = document.createElement('a');
        logo.href = `${basePath}index.html`;
        logo.className = 'logo';
        logo.innerHTML = '<span class=\"site-name\">bysunling.com</span>';

        logoContainer.appendChild(avatar);
        logoContainer.appendChild(logo);

        const slogan = document.createElement('div');
        slogan.className = 'slogan';
        slogan.innerHTML = '记录、分享、慢慢生长';

        leftSection.appendChild(logoContainer);
        leftSection.appendChild(slogan);

        // Middle: navigation
        const navSection = document.createElement('nav');
        navSection.className = 'header-nav';

        const navItems = [
            { text: 'Inspire Planet', url: SiteLinks?.inspirePlanet || 'https://inspireplanet.cc/' },
            { text: 'GitHub Repo', url: SiteLinks?.repo || 'https://github.com/sunling/inspireplanet.cc' },
            { text: 'Blog', url: SiteLinks?.blog || 'https://blog.bysunling.com' },
            { text: 'Cards', url: SiteLinks?.cards || 'https://cards.bysunling.com' },
            { text: 'Insights', url: `${basePath}insights.html` }
        ];

        navItems.forEach(item => {
            const navLink = document.createElement('a');
            navLink.href = item.url;
            navLink.className = 'nav-link';
            navLink.innerHTML = item.text;
            navLink.title = item.text;
            navSection.appendChild(navLink);
        });

        // Right: about + info about auth being disabled
        const rightSection = document.createElement('div');
        rightSection.className = 'header-right';

        const aboutLink = document.createElement('a');
        aboutLink.href = `${basePath}index.html`;
        aboutLink.className = 'about-link';
        aboutLink.innerHTML = '关于我';

        // Language switcher
        const langSwitch = document.createElement('div');
        langSwitch.className = 'lang-switch';
        const zhLink = document.createElement('a');
        const enLink = document.createElement('a');

        const isZh = window.location.pathname.includes('/zh/');
        const isEn = window.location.pathname.includes('/en/');

        zhLink.href = isZh ? '#' : `${basePath}zh/`;
        zhLink.textContent = '中文';
        zhLink.className = isZh ? 'lang active' : 'lang';

        enLink.href = isEn ? '#' : `${basePath}en/`;
        enLink.textContent = 'English';
        enLink.className = isEn ? 'lang active' : 'lang';

        langSwitch.appendChild(zhLink);
        langSwitch.appendChild(document.createTextNode(' / '));
        langSwitch.appendChild(enLink);

        rightSection.appendChild(aboutLink);
        rightSection.appendChild(langSwitch);

        headerContent.appendChild(leftSection);
        headerContent.appendChild(navSection);
        headerContent.appendChild(rightSection);
        header.appendChild(headerContent);

        return header;
    }

    function createSharedFooter() {
        const footer = document.createElement('div');
        footer.className = 'shared-footer';

        const footerContent = document.createElement('div');
        footerContent.className = 'footer-content';

        const leftSection = document.createElement('div');
        leftSection.className = 'footer-left';
        const signature = document.createElement('div');
        signature.className = 'signature';
        signature.innerHTML = '做喜欢的事，认识有趣的人';
        leftSection.appendChild(signature);

        const centerSection = document.createElement('div');
        centerSection.className = 'footer-center';
        const friendsContainer = document.createElement('div');
        friendsContainer.className = 'friends-container';
        const friendsTitle = document.createElement('span');
        friendsTitle.className = 'friends-title';
        const friendsLinks = document.createElement('div');
        friendsLinks.className = 'friends-links';
        friendsContainer.appendChild(friendsTitle);
        friendsContainer.appendChild(friendsLinks);
        centerSection.appendChild(friendsContainer);

        const rightSection = document.createElement('div');
        rightSection.className = 'footer-right';
        const copyright = document.createElement('div');
        copyright.className = 'copyright';
        copyright.innerHTML = '© 2025 bysunling.com';
        const contact = document.createElement('div');
        contact.className = 'contact';
        rightSection.appendChild(copyright);
        rightSection.appendChild(contact);

        footerContent.appendChild(leftSection);
        footerContent.appendChild(centerSection);
        footerContent.appendChild(rightSection);
        footer.appendChild(footerContent);

        return footer;
    }

    function initSharedComponents() {
        if (!document.querySelector('.shared-header') && !document.querySelector('.custom-header')) {
            const body = document.body;
            const header = createSharedHeader();
            body.insertBefore(header, body.firstChild);
        }

        if (!document.querySelector('.shared-footer') && !document.querySelector('.custom-footer')) {
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
