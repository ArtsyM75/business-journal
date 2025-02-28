// State management
let state = {
    notes: [],
    tasks: [],
    salesTotal: 0,
    approvalsTotal: 0,
    approvalItems: [],
    dailySummary: {},
    currentDate: new Date().toISOString().split('T')[0],
    activeTab: 'daily'
};

// Add this right after the state management section
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Debounced save
let saveTimeout;
function debouncedSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            localStorage.setItem('notesAppState', JSON.stringify(state));
            updateTotalsDisplay();
        } catch (error) {
            console.error('Failed to save state:', error);
            alert('Failed to save data. Please ensure you have enough storage space.');
        }
    }, 1000);
}

// Enhanced initialize function with error handling
function initialize() {
    try {
        loadState();
        // Set current date to today if not already set
        if (!state.currentDate) {
            state.currentDate = getTodayDate();
        }
        updateDateDisplay();
        setDateSelector();
        switchTab('daily');
        renderAll();
    } catch (error) {
        console.error('Initialization error:', error);
        alert('There was an error initializing the application. Please refresh the page.');
    }
}

// Enhanced renderAll with loading states
function renderAll() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'text-center py-4';
    loadingIndicator.textContent = 'Loading...';
    
    try {
        // Show loading state
        const sections = ['noteList', 'taskList', 'approvalItemsList', 'monthlySummaryContent'];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.innerHTML = loadingIndicator.outerHTML;
        });
        
        // Perform renders
        renderNotes();
        renderTasks();
        renderApprovalItems();
        renderMonthlySummary();
    } catch (error) {
        console.error('Render error:', error);
        alert('An error occurred while rendering the content. Please refresh the page.');
    }
}

// Load saved state
function loadState() {
    const saved = localStorage.getItem('notesAppState');
    if (saved) {
        try {
            const loadedState = JSON.parse(saved);
            // Always set the current date to today's date when loading the state
            loadedState.currentDate = getTodayDate();
            // Initialize arrays if they don't exist
            if (!loadedState.approvalItems) loadedState.approvalItems = [];
            if (!loadedState.dailySummary) loadedState.dailySummary = {};
            if (!loadedState.notes) loadedState.notes = [];
            if (!loadedState.tasks) loadedState.tasks = [];
            
            state = loadedState;
        } catch (e) {
            console.error("Error loading state:", e);
            // Keep the default state if loading fails
        }
    } else {
        // If there is no saved state, set the current date to today's date
        state.currentDate = getTodayDate();
    }
    updateDateDisplay();
    updateTotalsDisplay();
}

// Save state
function saveState() {
    try {
        localStorage.setItem('notesAppState', JSON.stringify(state));
        updateTotalsDisplay();
    } catch (error) {
        console.error('Failed to save state:', error);
        alert('Failed to save data. Please ensure you have enough storage space.');
    }
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        // Reset the state
        state = {
            notes: [],
            tasks: [],
            salesTotal: 0,
            approvalsTotal: 0,
            approvalItems: [],
            dailySummary: {},
            currentDate: state.currentDate, // Maintain current date
            activeTab: state.activeTab // Maintain active tab
        };
        
        // Clear localStorage
        localStorage.removeItem('notesAppState');
        
        // Re-render everything
        renderAll();
        updateTotalsDisplay();
        
        alert('All data has been cleared.');
    }
}

// Tab switching
function switchTab(tabName) {
    // Update state
    state.activeTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('[id^="tab-"]').forEach(tab => {
        if (tab.id === `tab-${tabName}`) {
            tab.classList.add('tab-active');
            tab.classList.remove('text-gray-600');
        } else if (tab.id.startsWith('tab-') && tab.id !== 'tab-content-') {
            tab.classList.remove('tab-active');
            tab.classList.add('text-gray-600');
        }
    });
    
    // Show/hide content
    document.querySelectorAll('[id^="tab-content-"]').forEach(content => {
        if (content.id === `tab-content-${tabName}`) {
            content.classList.remove('hidden');
        } else {
166|             content.classList.add('hidden');
167|         }
168|     });
169| }
170| 
171| // Get today's date
172| function getTodayDate() {
173|     return new Date().toISOString().split('T')[0];
174| }
175| 
176| // Update the date display
177| function updateDateDisplay() {
178|     const dateElement = document.getElementById('currentDateDisplay');
179|     if (dateElement) dateElement.textContent = state.currentDate;
180| }
181| 
182| // Set date selector
183| function setDateSelector() {
184|     const dateSelector = document.getElementById('dateSelector');
185|     if (dateSelector) dateSelector.value = state.currentDate;
186| }
187| 
188| // Render notes
189| function renderNotes() {
190|     const notesContainer = document.getElementById('noteList');
191|     if (notesContainer) {
192|         notesContainer.innerHTML = state.notes.map(note => `
193|             <div class="note">
194|                 <p>${escapeHtml(note)}</p>
195|             </div>
196|         `).join('');
197|     }
198| }
199| 
200| // Render tasks
201| function renderTasks() {
202|     const tasksContainer = document.getElementById('taskList');
203|     if (tasksContainer) {
204|         tasksContainer.innerHTML = state.tasks.map(task => `
205|             <div class="task">
206|                 <p>${escapeHtml(task)}</p>
207|             </div>
208|         `).join('');
209|     }
210| }
211| 
212| // Render approval items
213| function renderApprovalItems() {
214|     const approvalsContainer = document.getElementById('approvalItemsList');
215|     if (approvalsContainer) {
216|         approvalsContainer.innerHTML = state.approvalItems.map(item => `
217|             <div class="approval-item">
218|                 <p>${escapeHtml(item)}</p>
219|             </div>
220|         `).join('');
221|     }
222| }
223| 
224| // Render monthly summary
225| function renderMonthlySummary() {
226|     const summaryContainer = document.getElementById('monthlySummaryContent');
227|     if (summaryContainer) {
228|         // Example: Render summary data
229|         summaryContainer.innerHTML = `
230|             <div class="summary">
231|                 <p>Total Sales: ${state.salesTotal}</p>
232|                 <p>Total Approvals: ${state.approvalsTotal}</p>
233|             </div>
234|         `;
235|     }
236| }
237| 
238| // Event Listeners
239| document.getElementById('saveButton').addEventListener('click', saveState);
240| document.getElementById('clearButton').addEventListener('click', clearAllData);
241| document.getElementById('tab-daily').addEventListener('click', () => switchTab('daily'));
242| document.getElementById('tab-monthly').addEventListener('click', () => switchTab('monthly'));
243| document.getElementById('dateSelector').addEventListener('change', event => {
244|     state.currentDate = event.target.value;
245|     updateDateDisplay();
246|     debouncedSave();
247| });
248| 
249| // Initialize the application
250| initialize();
