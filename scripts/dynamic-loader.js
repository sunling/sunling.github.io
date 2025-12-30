// Lightweight loader for shared assets (no auth dependencies)
(function() {
    'use strict';

    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        return link;
    }

    function loadJS(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        if (callback) {
            script.onload = callback;
        }
        script.onerror = () => console.error('Failed to load script:', src);
        document.head.appendChild(script);
        return script;
    }

    function loadSharedResources() {
        loadCSS('styles/shared.css');
        loadJS('scripts/shared.js', () => {
            console.log('Shared assets loaded');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSharedResources);
    } else {
        loadSharedResources();
    }

    window.loadSharedResources = loadSharedResources;
})();
