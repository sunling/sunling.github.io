// Centralized site links for both zh/en pages
const SiteLinks = {
    email: 'mailto:sunling621@gmail.com',
    inspirePlanet: 'https://inspireplanet.cc/',
    repo: 'https://github.com/sunling/inspireplanet.cc',
    zhihu: 'https://www.zhihu.com/people/sunling22',
    substack: 'https://lingsun.substack.com/',
    blog: 'https://blog.bysunling.com',
    cards: 'https://cards.bysunling.com',
    meetup: 'https://meetup.bysunling.com',
    tools: 'https://tools.bysunling.com',
    wechatName: 'Being 孙玲',
    xhsName: 'Being 孙玲',
    wechatQr: '../assets/wechat-qr.jpg',
    xhsQr: '../assets/xhs-qr.jpg',
    zhihuAnswer: 'https://www.zhihu.com/question/68154951'
};

// expose globally for inline scripts
if (typeof window !== 'undefined') {
    window.SiteLinks = SiteLinks;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteLinks;
}
