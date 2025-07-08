// Life Tracker 2.0 - Background Script for Safari Web Extension
// Compatible with Apple Developer Web Extension requirements and Xcode Cloud

console.log('Life Tracker 2.0 Safari Web Extension background script loaded');

// Initialize extension when installed
chrome.runtime.onInstalled.addListener(function(details) {
    console.log('Life Tracker 2.0 extension installed:', details.reason);
    
    // Set default settings and initialize data structure
    chrome.storage.local.set({
        'life_tracker_initialized': true,
        'install_date': new Date().toISOString(),
        'version': '1.0.0',
        'settings': {
            colorScheme: 'default',
            fontStyle: 'default',
            notifications: true,
            syncEnabled: true
        },
        'dailyAffirmations': [],
        'workoutExercises': [],
        'foodEntries': [],
        'groceryItems': [],
        'expenses': [],
        'budgetData': {},
        'dayPlans': {},
        'journalEntries': []
    });
    
    // Show welcome notification
    if (details.reason === 'install') {
        showNotification('Welcome to Life Tracker 2.0!', 'Your personal life organization companion is ready.');
    }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(function() {
    console.log('Life Tracker 2.0 extension started');
    
    // Perform daily cleanup and maintenance
    performDailyMaintenance();
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Background script received message:', request);
    
    switch(request.action) {
        case 'get_settings':
            chrome.storage.local.get(null, function(items) {
                sendResponse({settings: items});
            });
            return true; // Will respond asynchronously
            
        case 'save_data':
            chrome.storage.local.set(request.data, function() {
                sendResponse({success: true});
                // Sync to cloud if enabled
                if (request.sync) {
                    syncToCloud(request.data);
                }
            });
            return true;
            
        case 'get_affirmations':
            chrome.storage.local.get(['dailyAffirmations'], function(result) {
                sendResponse({affirmations: result.dailyAffirmations || []});
            });
            return true;
            
        case 'get_budget_summary':
            chrome.storage.local.get(['budgetData', 'expenses'], function(result) {
                const summary = calculateBudgetSummary(result.budgetData, result.expenses);
                sendResponse({budgetSummary: summary});
            });
            return true;
            
        case 'get_today_schedule':
            getTodaySchedule().then(schedule => {
                sendResponse({schedule: schedule});
            });
            return true;
            
        case 'open_life_tracker':
            openLifeTrackerApp();
            sendResponse({success: true});
            break;
            
        case 'show_notification':
            showNotification(request.title, request.message);
            sendResponse({success: true});
            break;
            
        default:
            sendResponse({error: 'Unknown action: ' + request.action});
    }
});

// Handle browser action click (extension icon click)
chrome.browserAction?.onClicked?.addListener(function(tab) {
    console.log('Life Tracker 2.0 extension icon clicked');
    openLifeTrackerApp();
});

// Storage change listener for data synchronization
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log('Storage changed:', changes, namespace);
    
    // Broadcast changes to all content scripts
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                action: 'data_changed',
                changes: changes
            }).catch(() => {
                // Tab might not have content script, ignore error
            });
        });
    });
});

// Daily maintenance function
function performDailyMaintenance() {
    const today = new Date().toDateString();
    
    chrome.storage.local.get(['lastMaintenanceDate'], function(result) {
        const lastMaintenance = result.lastMaintenanceDate;
        
        if (lastMaintenance !== today) {
            console.log('Performing daily maintenance...');
            
            // Clean up old data (keep last 30 days)
            cleanupOldData();
            
            // Reset daily counters
            resetDailyCounters();
            
            // Update maintenance date
            chrome.storage.local.set({
                'lastMaintenanceDate': today
            });
            
            // Send daily motivation
            sendDailyMotivation();
        }
    });
}

// Clean up old data to prevent storage bloat
function cleanupOldData() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    chrome.storage.local.get(['journalEntries', 'workoutExercises', 'foodEntries'], function(result) {
        let hasChanges = false;
        
        // Clean journal entries
        if (result.journalEntries) {
            const filteredJournal = result.journalEntries.filter(entry => 
                new Date(entry.timestamp) > thirtyDaysAgo
            );
            if (filteredJournal.length !== result.journalEntries.length) {
                result.journalEntries = filteredJournal;
                hasChanges = true;
            }
        }
        
        // Clean workout exercises
        if (result.workoutExercises) {
            const filteredExercises = result.workoutExercises.filter(exercise => 
                new Date(exercise.timestamp) > thirtyDaysAgo
            );
            if (filteredExercises.length !== result.workoutExercises.length) {
                result.workoutExercises = filteredExercises;
                hasChanges = true;
            }
        }
        
        // Clean food entries
        if (result.foodEntries) {
            const filteredFood = result.foodEntries.filter(entry => 
                new Date(entry.timestamp) > thirtyDaysAgo
            );
            if (filteredFood.length !== result.foodEntries.length) {
                result.foodEntries = filteredFood;
                hasChanges = true;
            }
        }
        
        if (hasChanges) {
            chrome.storage.local.set(result);
            console.log('Old data cleaned up');
        }
    });
}

// Reset daily counters and goals
function resetDailyCounters() {
    chrome.storage.local.get(['settings'], function(result) {
        const settings = result.settings || {};
        
        // Reset daily goal completion status
        settings.dailyGoalCompleted = false;
        settings.lastGoalReset = new Date().toDateString();
        
        chrome.storage.local.set({settings: settings});
    });
}

// Send daily motivation notification
function sendDailyMotivation() {
    const motivationalMessages = [
        "Start your day with intention! Open Life Tracker 2.0 to plan your success.",
        "Today is a new opportunity to grow! Check your affirmations and goals.",
        "Your future self will thank you for the actions you take today.",
        "Small daily improvements lead to stunning long-term results.",
        "You have the power to make today amazing! Let's track your progress."
    ];
    
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    chrome.storage.local.get(['settings'], function(result) {
        const settings = result.settings || {};
        
        if (settings.notifications !== false) {
            showNotification('Good Morning! 🌅', randomMessage);
        }
    });
}

// Calculate budget summary for quick access
function calculateBudgetSummary(budgetData, expenses) {
    if (!budgetData || !budgetData.incomeAmount) {
        return null;
    }
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Filter expenses for current month
    const monthlyExpenses = (expenses || []).filter(expense => {
        const expenseDate = new Date(expense.timestamp);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate monthly income
    let monthlyIncome = parseFloat(budgetData.incomeAmount) || 0;
    if (budgetData.incomeFrequency === 'weekly') {
        monthlyIncome *= 4;
    } else if (budgetData.incomeFrequency === 'biweekly') {
        monthlyIncome *= 2;
    }
    
    const monthlyBills = parseFloat(budgetData.monthlyBills) || 0;
    const remaining = monthlyIncome - monthlyBills - totalExpenses;
    
    return {
        income: monthlyIncome,
        bills: monthlyBills,
        expenses: totalExpenses,
        remaining: remaining,
        expenseCount: monthlyExpenses.length
    };
}

// Get today's schedule
async function getTodaySchedule() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['dayPlans'], function(result) {
            const today = new Date();
            const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            const dayPlans = result.dayPlans || {};
            const todayPlans = dayPlans[todayKey] || { tasks: [], events: [], notes: [] };
            
            // Sort events by time
            const sortedEvents = todayPlans.events.sort((a, b) => {
                const timeA = a.time || '23:59';
                const timeB = b.time || '23:59';
                return timeA.localeCompare(timeB);
            });
            
            resolve({
                tasks: todayPlans.tasks,
                events: sortedEvents,
                notes: todayPlans.notes
            });
        });
    });
}

// Open Life Tracker app in new tab
function openLifeTrackerApp() {
    // Try to find existing tab with Life Tracker
    chrome.tabs.query({}, function(tabs) {
        let lifeTrackerTab = null;
        
        for (let tab of tabs) {
            if (tab.url && (tab.url.includes('index.html') || tab.url.includes('life-tracker') || tab.url.includes('daily-planner'))) {
                lifeTrackerTab = tab;
                break;
            }
        }
        
        if (lifeTrackerTab) {
            // Switch to existing tab
            chrome.tabs.update(lifeTrackerTab.id, {active: true});
            chrome.windows.update(lifeTrackerTab.windowId, {focused: true});
        } else {
            // Create new tab
            chrome.tabs.create({
                url: chrome.runtime.getURL('popup.html'),
                active: true
            });
        }
    });
}

// Show notification (if supported)
function showNotification(title, message) {
    if (chrome.notifications) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon-128.png',
            title: title,
            message: message
        });
    }
}

// Sync data to cloud (placeholder for future cloud sync feature)
function syncToCloud(data) {
    console.log('Cloud sync placeholder - data ready for sync:', Object.keys(data));
    // Future implementation: sync to iCloud, Google Drive, etc.
}

// Handle notification clicks
if (chrome.notifications) {
    chrome.notifications.onClicked.addListener(function(notificationId) {
        openLifeTrackerApp();
    });
}

// Alarm for daily reminders
chrome.alarms?.onAlarm?.addListener(function(alarm) {
    if (alarm.name === 'daily-reminder') {
        sendDailyMotivation();
        
        // Schedule next reminder
        chrome.alarms.create('daily-reminder', {
            when: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        });
    }
});

// Set up daily reminder alarm
chrome.storage.local.get(['settings'], function(result) {
    const settings = result.settings || {};
    
    if (settings.notifications !== false) {
        // Create alarm for tomorrow morning at 8 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);
        
        chrome.alarms?.create('daily-reminder', {
            when: tomorrow.getTime()
        });
    }
});

console.log('Life Tracker 2.0 background script initialization complete');
