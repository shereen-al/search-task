class PageSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.clearBtn = document.getElementById('clearBtn');
        this.searchResults = document.getElementById('searchResults');
        this.resultsCount = document.getElementById('resultsCount');
        this.currentResult = document.getElementById('currentResult');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.matches = [];
        this.currentIndex = 0;
        this.searchTerm = '';
        
        this.init();
    }

    init() {
        // Event listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.clearBtn.addEventListener('click', () => this.clearSearch());
        this.prevBtn.addEventListener('click', () => this.navigateResults(-1));
        this.nextBtn.addEventListener('click', () => this.navigateResults(1));

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            } else if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }

    handleSearch(query) {
        this.searchTerm = query.trim();
        
        // Show/hide clear button
        this.clearBtn.style.display = this.searchTerm ? 'flex' : 'none';
        
        if (this.searchTerm.length === 0) {
            this.clearHighlights();
            this.hideResults();
            return;
        }

        if (this.searchTerm.length < 2) {
            return; // Wait for at least 2 characters
        }

        this.performSearch();
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.matches.length > 0) {
                this.navigateResults(1);
            }
        }
    }

    performSearch() {
        this.clearHighlights();
        this.matches = [];
        
        const searchRegex = new RegExp(this.escapeRegex(this.searchTerm), 'gi');
        const walker = document.createTreeWalker(
            document.querySelector('.content-wrapper'),
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script, style, and search widget elements
                    const parent = node.parentNode;
                    if (parent.closest('.search-widget') || 
                        parent.tagName === 'SCRIPT' || 
                        parent.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return node.textContent.trim().length > 0 ? 
                           NodeFilter.FILTER_ACCEPT : 
                           NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const matches = [...text.matchAll(searchRegex)];
            
            if (matches.length > 0) {
                this.highlightTextNode(textNode, matches);
            }
        });

        this.updateResults();
    }

    highlightTextNode(textNode, matches) {
        const text = textNode.textContent;
        const parent = textNode.parentNode;
        const fragment = document.createDocumentFragment();
        
        let lastIndex = 0;
        
        matches.forEach((match, index) => {
            // Add text before match
            if (match.index > lastIndex) {
                fragment.appendChild(
                    document.createTextNode(text.slice(lastIndex, match.index))
                );
            }
            
            // Create highlight element
            const highlight = document.createElement('span');
            highlight.className = 'search-highlight';
            highlight.textContent = match[0];
            highlight.setAttribute('data-search-index', this.matches.length);
            
            fragment.appendChild(highlight);
            this.matches.push(highlight);
            
            lastIndex = match.index + match[0].length;
        });
        
        // Add remaining text
        if (lastIndex < text.length) {
            fragment.appendChild(
                document.createTextNode(text.slice(lastIndex))
            );
        }
        
        parent.replaceChild(fragment, textNode);
    }

    updateResults() {
        if (this.matches.length === 0) {
            this.hideResults();
            return;
        }

        this.currentIndex = 0;
        this.showResults();
        this.updateCurrentHighlight();
        this.scrollToCurrentMatch();
    }

    showResults() {
        this.searchResults.style.display = 'flex';
        this.resultsCount.textContent = `${this.matches.length} result${this.matches.length !== 1 ? 's' : ''}`;
        this.updateNavigationControls();
    }

    hideResults() {
        this.searchResults.style.display = 'none';
    }

    updateNavigationControls() {
        if (this.matches.length === 0) {
            this.prevBtn.disabled = true;
            this.nextBtn.disabled = true;
            this.currentResult.textContent = '0/0';
            return;
        }

        this.prevBtn.disabled = this.matches.length <= 1;
        this.nextBtn.disabled = this.matches.length <= 1;
        this.currentResult.textContent = `${this.currentIndex + 1}/${this.matches.length}`;
    }

    navigateResults(direction) {
        if (this.matches.length === 0) return;
        
        this.currentIndex = (this.currentIndex + direction + this.matches.length) % this.matches.length;
        this.updateCurrentHighlight();
        this.scrollToCurrentMatch();
        this.updateNavigationControls();
    }

    updateCurrentHighlight() {
        this.matches.forEach((match, index) => {
            match.classList.toggle('current', index === this.currentIndex);
        });
    }

    scrollToCurrentMatch() {
        if (this.matches.length === 0) return;
        
        const currentMatch = this.matches[this.currentIndex];
        const rect = currentMatch.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        if (!isVisible) {
            currentMatch.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    }

    clearHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize(); // Merge adjacent text nodes
        });
        this.matches = [];
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchTerm = '';
        this.clearBtn.style.display = 'none';
        this.clearHighlights();
        this.hideResults();
        this.searchInput.focus();
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageSearch();
});

// Add some visual feedback for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add focus ring animation
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('focus', () => {
        searchInput.closest('.search-input-wrapper').style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.closest('.search-input-wrapper').style.transform = 'scale(1)';
    });
    
    // Add typing animation to placeholder
    const placeholders = [
        'Search this page...',
        'Find any text...',
        'Try "search" or "technology"...',
        'Type to find content...'
    ];
    
    let placeholderIndex = 0;
    
    setInterval(() => {
        if (!searchInput.value && document.activeElement !== searchInput) {
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            searchInput.placeholder = placeholders[placeholderIndex];
        }
    }, 3000);
});