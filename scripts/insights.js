// Insights页面JavaScript功能

(function() {
    'use strict';
    
    // 避免重复初始化
    if (window.InsightsApp) {
        return;
    }

class InsightsApp {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.currentLanguage = 'zh'; // 默认中文
        this.filters = {
            search: '',
            source: '',
            tag: '',
            date: ''
        };
        this.sortBy = 'date-desc';
        
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.populateFilters();
            this.updateLanguageDisplay(); // 初始化语言显示状态
            this.applyFilters();
            this.hideLoading();
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('加载数据失败，请刷新页面重试');
        }
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.data = await response.json();
            this.filteredData = [...this.data];
            console.log(`成功加载 ${this.data.length} 条数据`);
        } catch (error) {
            console.error('加载数据失败:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // 语言切换
        const languageToggle = document.getElementById('languageToggle');
        languageToggle?.addEventListener('click', () => this.toggleLanguage());

        // 搜索
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchInput?.addEventListener('input', (e) => {
            this.filters.search = e.target.value.trim();
            this.debounceSearch();
        });
        
        searchBtn?.addEventListener('click', () => this.applyFilters());
        
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyFilters();
            }
        });

        // 过滤器选项点击
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-option')) {
                this.handleFilterOptionClick(e.target);
            }
        });
        
        const sortBy = document.getElementById('sortBy');
        sortBy?.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });

        // 显示更多标签按钮
        document.addEventListener('click', (e) => {
            if (e.target.id === 'showMoreTags' || e.target.closest('#showMoreTags')) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTagsExpansion();
            }
        });

        // 清除过滤器
        const clearFilters = document.getElementById('clearFilters');
        clearFilters?.addEventListener('click', () => this.clearAllFilters());
    }

    handleFilterOptionClick(option) {
        const type = option.dataset.type;
        const container = option.parentElement;
        
        // Remove active class from all options in this container
        container.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Update filters
        this.filters[type] = option.dataset.value;
        this.applyFilters();
    }

    toggleTagsExpansion() {
        const tagsFilter = document.getElementById('tagsFilter');
        const showMoreBtn = document.getElementById('showMoreTags');
        if (!tagsFilter || !showMoreBtn) return;
        
        const options = tagsFilter.querySelectorAll('.filter-option:not([data-value=""])');
        const hiddenOptions = Array.from(options).filter(opt => opt.style.display === 'none');
        const isCollapsed = hiddenOptions.length > 0;
        
        // 使用requestAnimationFrame优化性能
        requestAnimationFrame(() => {
            if (isCollapsed) {
                // Expand: show all options
                options.forEach(option => {
                    option.style.display = '';
                });
                showMoreBtn.innerHTML = `
                    <span class="lang-content" data-lang="en">Show Less</span>
                    <span class="lang-content" data-lang="zh">收起</span>
                `;
            } else {
                // Collapse: hide options beyond first 10
                options.forEach((option, index) => {
                    if (index >= 10) {
                        option.style.display = 'none';
                    }
                });
                showMoreBtn.innerHTML = `
                    <span class="lang-content" data-lang="en">Show More</span>
                    <span class="lang-content" data-lang="zh">显示更多</span>
                `;
            }
            
            // Update language display
            this.updateLanguageDisplay();
        });
    }

    debounceSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.applyFilters();
        }, 300);
    }

    // 性能优化：批量DOM更新
    batchDOMUpdate(callback) {
        if (this.updatePending) return;
        this.updatePending = true;
        
        requestAnimationFrame(() => {
            callback();
            this.updatePending = false;
        });
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'zh' ? 'en' : 'zh';
        document.body.classList.toggle('lang-en', this.currentLanguage === 'en');
        
        // 更新语言切换按钮的状态
        this.updateLanguageDisplay();
        
        // 更新搜索框占位符
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.placeholder = this.currentLanguage === 'en' 
                ? 'Search titles, content, authors...' 
                : '搜索标题、内容、作者...';
        }
        
        // 更新标签过滤器以显示对应语言的标签
        this.updateTagsFilter();
        
        // 重新渲染文章以显示对应语言
        this.renderArticles();
    }

    updateLanguageDisplay() {
        // 更新语言切换按钮的active状态
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // 更新所有语言相关的内容显示
        const langContents = document.querySelectorAll('.lang-content');
        langContents.forEach(content => {
            const lang = content.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }

    populateFilters() {
        // 填充信息源过滤器
        const sources = [...new Set(this.data.map(item => item.source))].sort();
        this.populateFilterOptions('sourceFilter', sources, 'source');

        // 填充标签过滤器
        this.updateTagsFilter();
    }

    updateTagsFilter() {
        const allTags = new Set();
        this.data.forEach(item => {
            if (this.currentLanguage === 'en') {
                if (item.tags) item.tags.forEach(tag => allTags.add(tag));
            } else {
                if (item.tags_zh) item.tags_zh.forEach(tag => allTags.add(tag));
            }
        });
        
        const tags = [...allTags].sort();
        this.populateFilterOptions('tagsFilter', tags, 'tag');
        this.initializeTagsShowMore();
    }

    populateFilterOptions(containerId, options, type) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Clear existing options
        container.innerHTML = '';
        
        // Add "All" option
        const allOption = document.createElement('div');
        allOption.className = 'filter-option active';
        allOption.dataset.value = '';
        allOption.dataset.type = type;
        
        const allText = type === 'source' ? 
            (this.currentLanguage === 'zh' ? '全部来源' : 'All Sources') :
            (this.currentLanguage === 'zh' ? '全部标签' : 'All Tags');
        allOption.textContent = allText;
        container.appendChild(allOption);
        
        // Add individual options
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'filter-option';
            optionElement.dataset.value = option;
            optionElement.dataset.type = type;
            optionElement.textContent = option;
            container.appendChild(optionElement);
        });
    }

    initializeTagsShowMore() {
        const tagsFilter = document.getElementById('tagsFilter');
        const showMoreBtn = document.getElementById('showMoreTags');
        if (!tagsFilter || !showMoreBtn) return;
        
        const options = tagsFilter.querySelectorAll('.filter-option:not([data-value=""])');
        if (options.length > 10) {
            // Hide options beyond the first 10
            options.forEach((option, index) => {
                if (index >= 10) {
                    option.style.display = 'none';
                }
            });
            showMoreBtn.style.display = 'block';
        } else {
            showMoreBtn.style.display = 'none';
        }
    }

    applyFilters() {
        let filtered = [...this.data];

        // 搜索过滤
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(item => {
                const tagsToSearch = this.currentLanguage === 'en' ? (item.tags || []) : (item.tags_zh || []);
                const searchFields = [
                    item.title,
                    item.title_zh,
                    item.source,
                    item.summary_en,
                    item.summary_zh,
                    item.best_quote_en,
                    item.best_quote_zh,
                    ...tagsToSearch
                ];
                
                return searchFields.some(field => 
                    field && field.toString().toLowerCase().includes(searchTerm)
                );
            });
        }

        // 信息源过滤
        if (this.filters.source) {
            filtered = filtered.filter(item => item.source === this.filters.source);
        }

        // 标签过滤
        if (this.filters.tag) {
            filtered = filtered.filter(item => {
                const tagsToCheck = this.currentLanguage === 'en' ? (item.tags || []) : (item.tags_zh || []);
                return tagsToCheck.includes(this.filters.tag);
            });
        }

        // 排序
        this.sortData(filtered);
        
        this.filteredData = filtered;
        this.updateResultsCount();
        this.renderArticles();
    }

    sortData(data) {
        data.sort((a, b) => {
            switch (this.sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title-asc':
                    const titleA = this.currentLanguage === 'en' ? a.title : (a.title_zh || a.title);
                    const titleB = this.currentLanguage === 'en' ? b.title : (b.title_zh || b.title);
                    return titleA.localeCompare(titleB);
                case 'source-asc':
                    return a.source.localeCompare(b.source);
                default:
                    return 0;
            }
        });
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            const total = this.data.length;
            const filtered = this.filteredData.length;
            
            if (this.currentLanguage === 'en') {
                resultsCount.textContent = filtered === total 
                    ? `${total} insights` 
                    : `${filtered} of ${total} insights`;
            } else {
                resultsCount.textContent = filtered === total 
                    ? `共 ${total} 条洞察` 
                    : `显示 ${filtered} / ${total} 条洞察`;
            }
        }
    }

    renderArticles() {
        const articlesGrid = document.getElementById('articlesGrid');
        const noResults = document.getElementById('noResults');
        
        if (!articlesGrid) return;

        this.batchDOMUpdate(() => {
            if (this.filteredData.length === 0) {
                articlesGrid.innerHTML = '';
                if (noResults) noResults.style.display = 'block';
                return;
            }

            if (noResults) noResults.style.display = 'none';
            
            // 性能优化：使用DocumentFragment
            const fragment = document.createDocumentFragment();
            const tempDiv = document.createElement('div');
            
            this.filteredData.forEach(item => {
                tempDiv.innerHTML = this.createArticleCard(item);
                while (tempDiv.firstChild) {
                    fragment.appendChild(tempDiv.firstChild);
                }
            });
            
            articlesGrid.innerHTML = '';
            articlesGrid.appendChild(fragment);
            
            // 添加卡片点击事件
            this.setupCardEvents();
        });
    }

    createArticleCard(item) {
        const title = this.currentLanguage === 'en' ? item.title : (item.title_zh || item.title);
        const summary = this.currentLanguage === 'en' ? item.summary_en : (item.summary_zh || item.summary_en);
        const quote = this.currentLanguage === 'en' ? item.best_quote_en : (item.best_quote_zh || item.best_quote_en);
        const tags = this.currentLanguage === 'en' ? (item.tags || []) : (item.tags_zh || item.tags || []);
        
        const formattedDate = this.formatDate(item.date);
        const tagsHtml = tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('');
        
        return `
            <div class="article-card" data-id="${item.id}">
                <div class="article-header">
                    <h3 class="article-title">${this.escapeHtml(title)}</h3>
                    <div class="article-meta">
                        <span class="article-source">${this.escapeHtml(item.source)}</span>
                        <span class="article-date">${formattedDate}</span>
                    </div>
                    ${tags.length > 0 ? `<div class="article-tags">${tagsHtml}</div>` : ''}
                </div>
                
                <div class="article-summary">${this.escapeHtml(summary)}</div>
                
                ${quote ? `<div class="article-quote">"${this.escapeHtml(quote)}"</div>` : ''}
                
                <div class="article-actions">
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="read-more">
                        ${this.currentLanguage === 'en' ? 'Read Original' : '阅读原文'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M7 17l9.2-9.2M17 17V7H7"/>
                        </svg>
                    </a>
                    <button class="expand-btn" data-action="expand">
                        ${this.currentLanguage === 'en' ? 'Show More' : '展开'}
                    </button>
                </div>
            </div>
        `;
    }

    setupCardEvents() {
        // 展开/收起功能
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.article-card');
                const summary = card.querySelector('.article-summary');
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    card.classList.remove('expanded');
                    summary.style.webkitLineClamp = '4';
                    btn.textContent = this.currentLanguage === 'en' ? 'Show More' : '展开';
                } else {
                    card.classList.add('expanded');
                    summary.style.webkitLineClamp = 'unset';
                    btn.textContent = this.currentLanguage === 'en' ? 'Show Less' : '收起';
                }
            });
        });
    }

    clearAllFilters() {
        // 重置过滤器
        this.filters = {
            search: '',
            source: '',
            tag: ''
        };
        
        // 重置表单元素
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        // 重置过滤器选项
        document.querySelectorAll('.filter-option').forEach(option => {
            option.classList.remove('active');
        });
        
        // 激活"全部"选项
        document.querySelectorAll('.filter-option[data-value=""]').forEach(option => {
            option.classList.add('active');
        });
        
        // 重新应用过滤器
        this.applyFilters();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        if (this.currentLanguage === 'en') {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } else {
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showError(message) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div class="error-icon">⚠️</div>
                <p class="error-text">${message}</p>
                <button onclick="location.reload()" class="retry-btn">
                    ${this.currentLanguage === 'en' ? 'Retry' : '重试'}
                </button>
            `;
        }
    }
}

    // 将类暴露到全局作用域
    window.InsightsApp = InsightsApp;

    // 页面加载完成后初始化应用
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof window.insightsApp === 'undefined') {
            window.insightsApp = new InsightsApp();
        }
    });

    // 导出供其他脚本使用
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = InsightsApp;
    }

})(); // 立即执行函数表达式结束
