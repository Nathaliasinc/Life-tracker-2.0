// Life Tracker 2.0 - Content Script for Safari Web Extension
// Enhances web pages with Life Tracker functionality

console.log('Life Tracker 2.0 content script loaded on:', window.location.hostname);

// Initialize content script
(function() {
    'use strict';
    
    let lifeTrackerWidget = null;
    let isWidgetVisible = false;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLifeTracker);
    } else {
        initializeLifeTracker();
    }
    
    function initializeLifeTracker() {
        console.log('Initializing Life Tracker 2.0 enhancements');
        
        // Add extension indicator
        addExtensionIndicator();
        
        // Set up keyboard shortcuts
        addKeyboardShortcuts();
        
        // Listen for messages from background script
        chrome.runtime.onMessage.addListener(handleMessage);
        
        // Create floating widget
        createFloatingWidget();
        
        // Sync with extension storage
        syncWithExtensionStorage();
    }
    
    function addExtensionIndicator() {
        // Add a small indicator that Life Tracker 2.0 is active
        const indicator = document.createElement('div');
        indicator.id = 'life-tracker-extension-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            width: 14px;
            height: 14px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            z-index: 10000;
            opacity: 0.8;
            pointer-events: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            border: 2px solid white;
        `;
        indicator.title = 'Life Tracker 2.0 Extension Active';
        document.body?.appendChild(indicator);
        
        // Pulse animation and fade out
        indicator.style.animation = 'lifeTrackerPulse 2s ease-in-out';
        setTimeout(() => {
            indicator.style.opacity = '0.4';
            indicator.style.transition = 'opacity 1s';
        }, 3000);
    }
    
    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + Shift + L = Toggle Life Tracker Widget
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                toggleLifeTrackerWidget();
                console.log('Life Tracker widget toggled via keyboard shortcut');
            }
            
            // Ctrl/Cmd + Shift + A = Quick add affirmation
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                showQuickAffirmationDialog();
                console.log('Quick affirmation dialog opened via keyboard shortcut');
            }
            
            // Ctrl/Cmd + Shift + T = Add quick task
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                showQuickTaskDialog();
                console.log('Quick task dialog opened via keyboard shortcut');
            }
        });
    }
    
    function createFloatingWidget() {
        // Create floating Life Tracker widget
        lifeTrackerWidget = document.createElement('div');
        lifeTrackerWidget.id = 'life-tracker-floating-widget';
        lifeTrackerWidget.style.cssText = `
            position: fixed;
            top: 20px;
            right: -350px;
            width: 320px;
            height: 400px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transition: right 0.3s ease-in-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            color: white;
            overflow: hidden;
        `;
        
        lifeTrackerWidget.innerHTML = `
            <div style="padding: 20px; height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 600;">🌟 Life Tracker 2.0</h3>
                    <button id="close-widget" style="background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 16px;">×</button>
                </div>
                
                <div style="flex: 1; overflow-y: auto;">
                    <div id="widget-content">
                        <div style="margin-bottom: 15px;">
                            <h4 style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.9;">📅 Today's Schedule</h4>
                            <div id="widget-schedule" style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; min-height: 60px; font-size: 12px;">
                                Loading...
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h4 style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.9;">💰 Budget Status</h4>
                            <div id="widget-budget" style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; font-size: 12px;">
                                Loading...
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h4 style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.9;">✨ Today's Affirmation</h4>
                            <div id="widget-affirmation" style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; font-size: 12px; line-height: 1.4;">
                                Loading...
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 10px;">
                    <button id="open-full-app" style="width: 100%; background: rgba(255,255,255,0.2); border: none; color: white; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                        Open Full Life Tracker
                    </button>
                </div>
            </div>
        `;
        
        document.body?.appendChild(lifeTrackerWidget);
        
        // Add event listeners
        document.getElementById('close-widget')?.addEventListener('click', hideLifeTrackerWidget);
        document.getElementById('open-full-app')?.addEventListener('click', openFullApp);
        
        // Load widget content
        loadWidgetContent();
    }
    
    function toggleLifeTrackerWidget() {
        if (isWidgetVisible) {
            hideLifeTrackerWidget();
        } else {
            showLifeTrackerWidget();
        }
    }
    
    function showLifeTrackerWidget() {
        if (lifeTrackerWidget) {
            lifeTrackerWidget.style.right = '20px';
            isWidgetVisible = true;
            loadWidgetContent();
        }
    }
    
    function hideLifeTrackerWidget() {
        if (lifeTrackerWidget) {
            lifeTrackerWidget.style.right = '-350px';
            isWidgetVisible = false;
        }
    }
    
    function loadWidgetContent() {
        // Load today's schedule
        chrome.runtime.sendMessage({action: 'get_today_schedule'}, function(response) {
            const scheduleDiv = document.getElementById('widget-schedule');
            if (scheduleDiv && response.schedule) {
                const schedule = response.schedule;
                let scheduleHTML = '';
                
                if (schedule.events.length > 0) {
                    scheduleHTML = schedule.events.slice(0, 3).map(event => {
                        const time = event.time ? new Date(`2000-01-01 ${event.time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        }) : '';
                        return `<div style="margin-bottom: 5px;"><strong>${time}</strong> ${event.text}</div>`;
                    }).join('');
                } else {
                    scheduleHTML = '<div style="opacity: 0.7;">No events scheduled for today</div>';
                }
                
                scheduleDiv.innerHTML = scheduleHTML;
            }
        });
        
        // Load budget summary
        chrome.runtime.sendMessage({action: 'get_budget_summary'}, function(response) {
            const budgetDiv = document.getElementById('widget-budget');
            if (budgetDiv && response.budgetSummary) {
                const budget = response.budgetSummary;
                const remaining = budget.remaining;
                const color = remaining >= 0 ? '#4CAF50' : '#F44336';
                
                budgetDiv.innerHTML = `
                    <div>Remaining: <span style="color: ${color}; font-weight: bold;">$${remaining.toFixed(2)}</span></div>
                    <div style="opacity: 0.8; font-size: 11px; margin-top: 2px;">Expenses: $${budget.expenses.toFixed(2)}</div>
                `;
            } else if (budgetDiv) {
                budgetDiv.innerHTML = '<div style="opacity: 0.7;">Budget not configured</div>';
            }
        });
        
        // Load random affirmation
        chrome.runtime.sendMessage({action: 'get_affirmations'}, function(response) {
            const affirmationDiv = document.getElementById('widget-affirmation');
            if (affirmationDiv && response.affirmations && response.affirmations.length > 0) {
                const randomAffirmation = response.affirmations[Math.floor(Math.random() * response.affirmations.length)];
                affirmationDiv.innerHTML = `<div>"${randomAffirmation.text}"</div>`;
            } else if (affirmationDiv) {
                affirmationDiv.innerHTML = '<div style="opacity: 0.7;">No affirmations yet. Add some in Life Tracker!</div>';
            }
        });
    }
    
    function openFullApp() {
        chrome.runtime.sendMessage({action: 'open_life_tracker'});
        hideLifeTrackerWidget();
    }
    
    function showQuickAffirmationDialog() {
        const dialog = createQuickDialog('Add Affirmation', 'Enter a positive affirmation:', '', function(text) {
            if (text.trim()) {
                // Save affirmation
                chrome.runtime.sendMessage({
                    action: 'save_data',
                    data: {
                        'tempAffirmation': text.trim(),
                        'tempAffirmationTime': Date.now()
                    }
                });
                
                showToast('Affirmation saved! ✨');
            }
        });
    }
    
    function showQuickTaskDialog() {
        const dialog = createQuickDialog('Add Quick Task', 'Enter a task for today:', '', function(text) {
            if (text.trim()) {
                // Save task
                chrome.runtime.sendMessage({
                    action: 'save_data',
                    data: {
                        'tempTask': text.trim(),
                        'tempTaskTime': Date.now()
                    }
                });
                
                showToast('Task saved! 📝');
            }
        });
    }
    
    function createQuickDialog(title, prompt, defaultValue, callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            width: 400px;
            max-width: 90vw;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        `;
        
        dialog.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">${title}</h3>
            <p style="margin: 0 0 15px 0; color: #666;">${prompt}</p>
            <textarea id="quick-input" style="width: 100%; height: 80px; border: 2px solid #ddd; border-radius: 5px; padding: 10px; font-family: inherit; resize: vertical;" placeholder="Type here...">${defaultValue}</textarea>
            <div style="margin-top: 15px; text-align: right;">
                <button id="cancel-btn" style="background: #ccc; border: none; padding: 8px 16px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Cancel</button>
                <button id="save-btn" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Save</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        const input = document.getElementById('quick-input');
        const saveBtn = document.getElementById('save-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        
        input.focus();
        input.select();
        
        function close() {
            document.body.removeChild(overlay);
        }
        
        saveBtn.addEventListener('click', function() {
            callback(input.value);
            close();
        });
        
        cancelBtn.addEventListener('click', close);
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                callback(input.value);
                close();
            } else if (e.key === 'Escape') {
                close();
            }
        });
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                close();
            }
        });
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10003;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    function handleMessage(request, sender, sendResponse) {
        switch(request.action) {
            case 'data_changed':
                // Refresh widget content when data changes
                if (isWidgetVisible) {
                    loadWidgetContent();
                }
                break;
                
            case 'show_widget':
                showLifeTrackerWidget();
                break;
                
            case 'hide_widget':
                hideLifeTrackerWidget();
                break;
        }
    }
    
    function syncWithExtensionStorage() {
        // Sync any temporary data with extension storage
        try {
            chrome.runtime.sendMessage({
                action: 'get_settings'
            }, function(response) {
                if (response && response.settings) {
                    console.log('Extension settings loaded for content script');
                    // Could use settings to customize behavior
                }
            });
        } catch (e) {
            console.log('Extension messaging not available:', e);
        }
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes lifeTrackerPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Life Tracker 2.0 content script initialized successfully');
    
})();
