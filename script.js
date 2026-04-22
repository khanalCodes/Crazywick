// Admin password (change this!)
const ADMIN_PASSWORD = 'crazywick2024';

// Initialize storage
let articles = JSON.parse(localStorage.getItem('articles')) || [];
let journals = JSON.parse(localStorage.getItem('journals')) || [];
let predictions = JSON.parse(localStorage.getItem('predictions')) || [];
let learnings = JSON.parse(localStorage.getItem('learnings')) || [];

// Navigation
function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
}

// Admin Login
function openAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    modal.classList.add('active');
}

document.querySelector('.close').onclick = function() {
    document.getElementById('adminLoginModal').classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('adminLoginModal');
    if (event.target == modal) {
        modal.classList.remove('active');
    }
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminLoginModal').classList.remove('active');
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('active');
        document.getElementById('adminPassword').value = '';
    } else {
        alert('Incorrect password');
    }
}

function closeAdmin() {
    document.getElementById('adminPanel').classList.remove('active');
    setTimeout(() => {
        document.getElementById('adminPanel').classList.add('hidden');
    }, 300);
}

// Admin Tabs
function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.admin-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Form').classList.remove('hidden');
}

// Article Functions
function saveArticle() {
    const title = document.getElementById('articleTitle').value;
    const category = document.getElementById('articleCategory').value;
    const content = document.getElementById('articleContent').value;
    
    if (!title || !category || !content) {
        alert('Please fill all fields');
        return;
    }
    
    const article = {
        id: Date.now(),
        title,
        category,
        content,
        date: new Date().toISOString()
    };
    
    articles.unshift(article);
    localStorage.setItem('articles', JSON.stringify(articles));
    
    // Clear form
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleCategory').value = '';
    document.getElementById('articleContent').value = '';
    
    renderArticles();
    alert('Article published successfully!');
}

function renderArticles() {
    const grid = document.getElementById('articlesGrid');
    
    if (articles.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1;">No articles yet. Use the admin panel to create your first article.</p>';
        return;
    }
    
    grid.innerHTML = articles.map(article => `
        <div class="article-card" onclick="viewArticle(${article.id})">
            <div class="category">${article.category}</div>
            <h3>${article.title}</h3>
            <div class="content">${article.content.substring(0, 150)}...</div>
            <div class="date">${new Date(article.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })}</div>
        </div>
    `).join('');
}

function viewArticle(id) {
    const article = articles.find(a => a.id === id);
    if (article) {
        alert(`${article.title}\n\n${article.content}\n\n— ${article.category}`);
    }
}

// Journal Functions
function previewJournalImage(event) {
    const preview = document.getElementById('journalImagePreview');
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Trade screenshot">`;
        };
        reader.readAsDataURL(file);
    }
}

function saveJournal() {
    const title = document.getElementById('journalTitle').value;
    const market = document.getElementById('journalMarket').value;
    const symbol = document.getElementById('journalSymbol').value;
    const entry = document.getElementById('journalEntry').value;
    const exit = document.getElementById('journalExit').value;
    const size = document.getElementById('journalSize').value;
    const type = document.getElementById('journalType').value;
    const notes = document.getElementById('journalNotes').value;
    
    if (!title || !market || !symbol || !entry || !size) {
        alert('Please fill all required fields');
        return;
    }
    
    const imageInput = document.getElementById('journalImage');
    let imageData = null;
    
    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveJournalEntry();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveJournalEntry();
    }
    
    function saveJournalEntry() {
        const pnl = exit ? ((parseFloat(exit) - parseFloat(entry)) / parseFloat(entry) * 100 * (type === 'Short' ? -1 : 1)).toFixed(2) : null;
        
        const journal = {
            id: Date.now(),
            title,
            market,
            symbol,
            entry: parseFloat(entry),
            exit: exit ? parseFloat(exit) : null,
            size,
            type,
            notes,
            pnl,
            image: imageData,
            date: new Date().toISOString()
        };
        
        journals.unshift(journal);
        localStorage.setItem('journals', JSON.stringify(journals));
        
        // Clear form
        document.getElementById('journalTitle').value = '';
        document.getElementById('journalMarket').value = '';
        document.getElementById('journalSymbol').value = '';
        document.getElementById('journalEntry').value = '';
        document.getElementById('journalExit').value = '';
        document.getElementById('journalSize').value = '';
        document.getElementById('journalNotes').value = '';
        document.getElementById('journalImage').value = '';
        document.getElementById('journalImagePreview').innerHTML = '';
        
        renderJournals();
        alert('Trade saved successfully!');
    }
}

function renderJournals(filter = 'all') {
    const grid = document.getElementById('journalGrid');
    
    let filteredJournals = journals;
    if (filter !== 'all') {
        filteredJournals = journals.filter(j => j.market === filter);
    }
    
    if (filteredJournals.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1;">No journal entries yet.</p>';
        return;
    }
    
    grid.innerHTML = filteredJournals.map(journal => `
        <div class="journal-card">
            <div class="journal-header">
                <h3>${journal.title}</h3>
                <div class="journal-meta">
                    <span>${journal.market}</span>
                    <span>${journal.symbol}</span>
                    <span>${journal.type}</span>
                    <span>${new Date(journal.date).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="journal-stats">
                <div class="stat-item">
                    <div class="stat-label">Entry</div>
                    <div class="stat-value">${journal.entry}</div>
                </div>
                ${journal.exit ? `
                <div class="stat-item">
                    <div class="stat-label">Exit</div>
                    <div class="stat-value">${journal.exit}</div>
                </div>
                ` : '<div class="stat-item"><div class="stat-label">Status</div><div class="stat-value">Open</div></div>'}
                <div class="stat-item">
                    <div class="stat-label">Size</div>
                    <div class="stat-value">${journal.size}</div>
                </div>
                ${journal.pnl ? `
                <div class="stat-item">
                    <div class="stat-label">P&L</div>
                    <div class="stat-value ${journal.pnl > 0 ? 'positive' : 'negative'}">${journal.pnl > 0 ? '+' : ''}${journal.pnl}%</div>
                </div>
                ` : ''}
            </div>
            ${journal.notes ? `
            <div class="journal-notes">${journal.notes}</div>
            ` : ''}
            ${journal.image ? `
            <img src="${journal.image}" class="journal-image" alt="Trade screenshot">
            ` : ''}
        </div>
    `).join('');
}

function filterJournal(market) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderJournals(market);
}

// Prediction Functions
function savePrediction() {
    const title = document.getElementById('predictionTitle').value;
    const symbol = document.getElementById('predictionSymbol').value;
    const tradingView = document.getElementById('predictionTradingView').value;
    const target = document.getElementById('predictionTarget').value;
    const stopLoss = document.getElementById('predictionStopLoss').value;
    const timeframe = document.getElementById('predictionTimeframe').value;
    const analysis = document.getElementById('predictionAnalysis').value;
    
    if (!title || !symbol || !tradingView || !target || !stopLoss || !analysis) {
        alert('Please fill all fields');
        return;
    }
    
    const prediction = {
        id: Date.now(),
        title,
        symbol,
        tradingView,
        target,
        stopLoss,
        timeframe,
        analysis,
        date: new Date().toISOString()
    };
    
    predictions.unshift(prediction);
    localStorage.setItem('predictions', JSON.stringify(predictions));
    
    // Clear form
    document.getElementById('predictionTitle').value = '';
    document.getElementById('predictionSymbol').value = '';
    document.getElementById('predictionTradingView').value = '';
    document.getElementById('predictionTarget').value = '';
    document.getElementById('predictionStopLoss').value = '';
    document.getElementById('predictionTimeframe').value = '';
    document.getElementById('predictionAnalysis').value = '';
    
    renderPredictions();
    alert('Prediction published successfully!');
}

function renderPredictions() {
    const grid = document.getElementById('predictionsGrid');
    
    if (predictions.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1;">No predictions yet.</p>';
        return;
    }
    
    grid.innerHTML = predictions.map(prediction => `
        <div class="prediction-card">
            <div class="prediction-header">
                <h3>${prediction.title}</h3>
                <div class="prediction-symbol">${prediction.symbol}</div>
            </div>
            <div class="tradingview-widget" id="tv-${prediction.id}"></div>
            <div class="prediction-targets">
                <div class="target-item">
                    <div class="target-label">Target</div>
                    <div class="target-value success">${prediction.target}</div>
                </div>
                <div class="target-item">
                    <div class="target-label">Stop Loss</div>
                    <div class="target-value danger">${prediction.stopLoss}</div>
                </div>
            </div>
            <div class="prediction-analysis">${prediction.analysis}</div>
            <div class="prediction-footer">
                <span>${prediction.timeframe}</span>
                <span>${new Date(prediction.date).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
    
    // Load TradingView widgets
    setTimeout(() => {
        predictions.forEach(prediction => {
            loadTradingViewWidget(prediction.id, prediction.tradingView);
        });
    }, 100);
}

function loadTradingViewWidget(id, symbol) {
    const container = document.getElementById(`tv-${id}`);
    if (!container) return;
    
    // Create TradingView widget
    container.innerHTML = `
        <iframe 
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${id}&symbol=${symbol}&interval=D&theme=dark&style=1&locale=en&toolbar_bg=f1f3f6&enable_publishing=false&hide_top_toolbar=false&hide_legend=false&save_image=false&backgroundColor=rgba(10,14,26,1)"
            style="width: 100%; height: 100%; border: 0;"
        ></iframe>
    `;
}

// Learning Functions
function saveLearning() {
    const title = document.getElementById('learningTitle').value;
    const category = document.getElementById('learningCategory').value;
    const content = document.getElementById('learningContent').value;
    
    if (!title || !category || !content) {
        alert('Please fill all fields');
        return;
    }
    
    const learning = {
        id: Date.now(),
        title,
        category,
        content,
        date: new Date().toISOString()
    };
    
    learnings.unshift(learning);
    localStorage.setItem('learnings', JSON.stringify(learnings));
    
    // Clear form
    document.getElementById('learningTitle').value = '';
    document.getElementById('learningCategory').value = '';
    document.getElementById('learningContent').value = '';
    
    renderLearnings();
    alert('Learning saved successfully!');
}

function renderLearnings() {
    const grid = document.getElementById('learningsGrid');
    
    if (learnings.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1;">No learnings yet.</p>';
        return;
    }
    
    grid.innerHTML = learnings.map(learning => `
        <div class="learning-card">
            <div class="category">${learning.category}</div>
            <h3>${learning.title}</h3>
            <div class="content">${learning.content}</div>
        </div>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderArticles();
    renderJournals();
    renderPredictions();
    renderLearnings();
    
    // Show articles section by default
    showSection('articles');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt+A for admin
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        openAdminLogin();
    }
    
    // Esc to close admin panel
    if (e.key === 'Escape') {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel.classList.contains('active')) {
            closeAdmin();
        }
    }
});
