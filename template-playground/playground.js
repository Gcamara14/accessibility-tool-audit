document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const jsonInput = document.getElementById('jsonInput');
    const loadBtn = document.getElementById('loadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const jsonError = document.getElementById('jsonError');
    const playgroundArea = document.getElementById('playgroundArea');
    
    // New Containers
    const customSection = document.getElementById('customSection');
    const customResultsContainer = document.getElementById('customResultsContainer');
    const standardSection = document.getElementById('standardSection');
    const standardResultsContainer = document.getElementById('standardResultsContainer');
    const standardCountDisplay = document.getElementById('standardCountDisplay');
    const tableViewSection = document.getElementById('tableViewSection');
    const analysisSection = document.getElementById('analysisSection');
    const analysisContent = document.getElementById('analysisContent');
    const tableBody = document.getElementById('tableBody');

    const templateSearch = document.getElementById('templateSearch');
    const platformFilter = document.getElementById('platformFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const levelFilter = document.getElementById('levelFilter');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const analysisViewBtn = document.getElementById('analysisViewBtn');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyAiPromptBtn = document.getElementById('copyAiPromptBtn');
    const countDisplay = document.getElementById('countDisplay');
    const detailModal = $('#detailModal'); // jQuery for Bootstrap modal
    const jiraPreviewContent = document.getElementById('jiraPreviewContent');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const copyJiraBtn = document.getElementById('copyJiraBtn');
    const downloadJsonBtn = document.getElementById('downloadJsonBtn');
    
    // Export Buttons
    const exportSection = document.getElementById('exportSection');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');

    // State
    let standardTemplates = [];
    let customTemplates = [];
    
    let filteredStandard = [];
    let filteredCustom = [];
    
    let currentView = 'grid'; // 'grid' or 'table'

    let currentDetailTemplate = null;
    let fuse = null;

    // Constants
    const MY_LIBRARY_KEY = 'catalyst_my_library';
    const DRAFT_INPUT_KEY = 'catalyst_draft_input';

    // Initialize
    init();

    function init() {
        initAwesomplete();
        
        // Load Draft Input
        const savedDraft = localStorage.getItem(DRAFT_INPUT_KEY);
        if (savedDraft) {
            jsonInput.value = savedDraft;
        }

        // Load Defaults
        if (window.A11Y_TEMPLATES && Array.isArray(window.A11Y_TEMPLATES)) {
            standardTemplates = window.A11Y_TEMPLATES;
            filteredStandard = standardTemplates;
        }

        // Load Custom Library
        try {
            const savedLibrary = localStorage.getItem(MY_LIBRARY_KEY);
            if (savedLibrary) {
                customTemplates = JSON.parse(savedLibrary);
                filteredCustom = customTemplates;
            }
        } catch (e) {
            console.error("Failed to load custom library", e);
            customTemplates = [];
            filteredCustom = [];
        }

        // Initialize Fuse with ALL templates
        updateSearchIndex();

        // Initial Render
        render();
        
        // Show playground area immediately since we have defaults
        playgroundArea.classList.remove('d-none');
    }

    // Event Listeners
    loadBtn.addEventListener('click', handleLoad);
    
    // Draft Auto-Save
    jsonInput.addEventListener('input', (e) => {
        localStorage.setItem(DRAFT_INPUT_KEY, e.target.value);
    });

    clearBtn.addEventListener('click', () => {
        // Clear Workspace (Custom Library)
        if (confirm("Are you sure you want to clear your entire workspace? This cannot be undone.")) {
            customTemplates = [];
            localStorage.removeItem(MY_LIBRARY_KEY);
            
            // Also clear input? Maybe not, user might want to keep the draft.
            // Let's clear input only if they explicitly want to?
            // The button says "Clear Workspace", so it implies clearing the list.
            // Let's also clear the input for a fresh start.
            jsonInput.value = '';
            localStorage.removeItem(DRAFT_INPUT_KEY);
            
            updateSearchIndex();
            handleSearch(); // Triggers render
            $('#configSection').collapse('show');
        }
    });

    templateSearch.addEventListener('input', handleSearch);
    platformFilter.addEventListener('change', handleSearch);
    priorityFilter.addEventListener('change', handleSearch);
    levelFilter.addEventListener('change', handleSearch);
    
    // View Toggle Listeners
    gridViewBtn.addEventListener('click', () => {
        if (currentView !== 'grid') {
            currentView = 'grid';
            render();
        }
    });
    
    tableViewBtn.addEventListener('click', () => {
        if (currentView !== 'table') {
            currentView = 'table';
            render();
        }
    });

    analysisViewBtn.addEventListener('click', () => {
        if (currentView !== 'analysis') {
            currentView = 'analysis';
            render();
        }
    });

    copyEmailBtn.addEventListener('click', copyAnalysisEmail);
    copyAiPromptBtn.addEventListener('click', copyAiPrompt);

    copyTextBtn.addEventListener('click', copyPreviewText);
    copyJiraBtn.addEventListener('click', copyJiraMarkup);
    downloadJsonBtn.addEventListener('click', downloadCurrentTemplate);
    
    // Export Listeners
    exportCsvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        exportTableData('csv');
    });
    
    exportExcelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        exportTableData('excel');
    });

    // --- Core Functions ---

    function handleLoad() {
        let input = jsonInput.value.trim();
        if (!input) return;

        try {
            // Attempt to parse JSON
            
            // 1. Handle "window.A11Y_TEMPLATES =" prefix
            if (input.includes('window.A11Y_TEMPLATES')) {
                const equalsIndex = input.indexOf('=');
                if (equalsIndex !== -1) {
                     let potentialJson = input.substring(equalsIndex + 1).trim();
                     if (potentialJson.endsWith(';')) {
                         potentialJson = potentialJson.slice(0, -1).trim();
                     }
                     input = potentialJson;
                }
            }

            // 2. Handle JS object syntax
            let parsed;
            try {
                parsed = JSON.parse(input);
            } catch (jsonError) {
                console.log("Standard JSON parse failed, attempting to fix JS syntax...");
                try {
                    const func = new Function("return " + input);
                    parsed = func();
                } catch (evalError) {
                    throw jsonError;
                }
            }

            // Normalize to array
            if (!Array.isArray(parsed)) {
                parsed = [parsed];
            }

            // Basic validation
            const valid = parsed.every(t => t.title && (t.wcag || t.wcag === "Missing-WCAG"));
            if (!valid) {
                throw new Error("Invalid template structure. Missing 'title' or 'wcag'.");
            }

            // Append to Custom Templates (Workspace)
            // Avoid exact duplicates? For now, just append.
            customTemplates = [...parsed, ...customTemplates];
            
            // Save to LocalStorage
            localStorage.setItem(MY_LIBRARY_KEY, JSON.stringify(customTemplates));

            jsonInput.classList.remove('is-invalid');
            
            // Clear input after successful add? 
            // User requested "accruing list", so maybe clear input to indicate success and readiness for next input.
            jsonInput.value = '';
            localStorage.removeItem(DRAFT_INPUT_KEY);

            // Update Search & Render
            updateSearchIndex();
            handleSearch(); // Triggers render
            
            // Collapse config section
            $('#configSection').collapse('hide');

            // Show success toast or feedback? (Optional, but good UX)
            // For now, the UI update is feedback enough.

        } catch (e) {
            console.error(e);
            jsonInput.classList.add('is-invalid');
            jsonError.textContent = "Error parsing input: " + e.message;
        }
    }

    function deleteTemplate(index) {
        if (confirm("Remove this template from your workspace?")) {
            // Remove from customTemplates
            // Note: filteredCustom might be a subset, so we need to find the correct index in the main array.
            // Or simpler: re-render from main array.
            // But wait, the index passed here comes from the loop in renderGrid.
            // If we are filtering, the index in filteredCustom doesn't match customTemplates.
            // We need to pass the actual template object or a unique ID.
            // Since we don't have IDs, let's pass the template object reference.
            
            // Actually, let's change renderGrid to pass the template object to delete.
        }
    }
    
    // Improved delete function using object reference
    function deleteCustomTemplate(templateToDelete) {
        if (confirm("Remove this template from your workspace?")) {
            customTemplates = customTemplates.filter(t => t !== templateToDelete);
            localStorage.setItem(MY_LIBRARY_KEY, JSON.stringify(customTemplates));
            updateSearchIndex();
            handleSearch();
        }
    }

    function updateSearchIndex() {
        // Combine for search suggestions
        const allTemplates = [...customTemplates, ...standardTemplates];
        
        const options = {
            keys: [
                { name: 'wcag', weight: 2.0 },
                { name: 'title', weight: 1.0 },
                { name: 'shortDescription', weight: 0.5 }
            ],
            threshold: 0.1,
            ignoreLocation: true,
            useExtendedSearch: true
        };
        fuse = new Fuse(allTemplates, options);
        
        // Update Awesomplete list
        const titles = allTemplates.map(t => t.title);
        if (templateSearch.awesomplete) {
             templateSearch.awesomplete.list = titles;
        }
    }

    function handleSearch() {
        const query = templateSearch.value.trim();
        const platform = platformFilter.value;
        const priority = priorityFilter.value;
        const level = levelFilter.value;

        // Helper filter function
        const filterList = (list) => {
            let results = list;

            // 1. Filter by Platform
            if (platform !== 'all') {
                results = results.filter(t => {
                    if (Array.isArray(t.platforms)) {
                        return t.platforms.includes(platform);
                    }
                    return true;
                });
            }

            // 2. Filter by Priority
            if (priority !== 'all') {
                results = results.filter(t => t.priority === priority);
            }

            // 3. Filter by WCAG Level
            if (level !== 'all') {
                results = results.filter(t => {
                    const wcagCode = t.wcag;
                    const mappedLevel = window.WCAG_MAP && window.WCAG_MAP[wcagCode];
                    return mappedLevel === level;
                });
            }

            // 4. Filter by Search Query
            if (query) {
                // Superpower: Exact WCAG Match
                // If query looks like "WCAG-X.X.X" or just "X.X.X", force exact match on the wcag field
                const wcagRegex = /^(?:wcag-)?\d+(?:\.\d+)*$/i;
                
                if (wcagRegex.test(query)) {
                    // Normalize query: ensure it starts with "wcag-" for comparison against standard format
                    let targetWcag = query.toLowerCase();
                    if (!targetWcag.startsWith('wcag-')) {
                        targetWcag = 'wcag-' + targetWcag;
                    }

                    results = results.filter(t => t.wcag && t.wcag.toLowerCase() === targetWcag);
                } else if (fuse) {
                    // Standard Fuzzy Search
                    const fuseResults = fuse.search(query).map(r => r.item);
                    results = results.filter(t => fuseResults.includes(t));
                }
            }
            
            return results;
        };

        filteredCustom = filterList(customTemplates);
        filteredStandard = filterList(standardTemplates);

        render();
    }

    function render() {
        const total = filteredCustom.length + filteredStandard.length;
        countDisplay.textContent = `${total} templates found`;
        standardCountDisplay.textContent = `(${filteredStandard.length} items)`;

        if (currentView === 'grid') {
            // Show Grid Sections, Hide Table and Analysis
            tableViewSection.classList.add('d-none');
            analysisSection.classList.add('d-none');
            exportSection.classList.add('d-none'); // Hide Export
            
            // Render Custom
            if (customTemplates.length > 0) {
                customSection.classList.remove('d-none');
                renderGrid(filteredCustom, customResultsContainer, true); // true = isCustom
            } else {
                customSection.classList.add('d-none');
                customResultsContainer.innerHTML = '';
            }

            // Render Standard
            standardSection.classList.remove('d-none');
            renderGrid(filteredStandard, standardResultsContainer, false);
            
            // Empty State for Grid
            if (total === 0) {
                standardResultsContainer.innerHTML = '<div class="col-12 text-center text-muted mt-4">No templates match your search.</div>';
            }
        } else if (currentView === 'table') {
            // Show Table, Hide Grid and Analysis
            customSection.classList.add('d-none');
            standardSection.classList.add('d-none');
            analysisSection.classList.add('d-none');
            tableViewSection.classList.remove('d-none');
            exportSection.classList.remove('d-none'); // Show Export
            
            renderTable();
        } else if (currentView === 'analysis') {
            // Show Analysis, Hide Grid and Table
            customSection.classList.add('d-none');
            standardSection.classList.add('d-none');
            tableViewSection.classList.add('d-none');
            analysisSection.classList.remove('d-none');
            exportSection.classList.add('d-none'); // Hide Export (for now)

            renderAnalysis();
        }
    }

    function renderAnalysis() {
        if (!window.WCAG_MAP) {
            analysisContent.innerHTML = '<div class="alert alert-warning">WCAG Map not loaded. Cannot generate analysis.</div>';
            return;
        }

        // Use standardTemplates for analysis as requested (ignoring current filters for the base analysis, 
        // but maybe we should respect them? User said "only looks at the standard library".
        // Let's use standardTemplates (all of them) to give a complete picture of the library coverage.
        const templatesToAnalyze = standardTemplates;

        const stats = {};
        let totalTemplates = templatesToAnalyze.length;
        let totalCriteria = Object.keys(window.WCAG_MAP).length;
        let coveredCriteria = 0;

        // Initialize stats for each WCAG criteria
        Object.keys(window.WCAG_MAP).forEach(code => {
            stats[code] = {
                level: window.WCAG_MAP[code],
                count: 0,
                platforms: {
                    Web: 0,
                    iOS: 0,
                    Android: 0
                },
                missingCodeExample: 0
            };
        });

        // Track coverage by level
        const levelStats = {
            A: { total: 0, covered: 0 },
            AA: { total: 0, covered: 0 },
            AAA: { total: 0, covered: 0 }
        };

        // Track coverage by platform (how many criteria have at least one template for this platform)
        const platformCoverage = {
            Web: 0,
            iOS: 0,
            Android: 0
        };

        // Calculate totals per level first
        Object.values(window.WCAG_MAP).forEach(level => {
            if (levelStats[level]) levelStats[level].total++;
        });

        // Process templates
        templatesToAnalyze.forEach(t => {
            const code = t.wcag;
            if (stats[code]) {
                stats[code].count++;
                
                if (Array.isArray(t.platforms)) {
                    t.platforms.forEach(p => {
                        if (stats[code].platforms[p] !== undefined) {
                            stats[code].platforms[p]++;
                        }
                    });
                }

                if (!t.codeExample) {
                    stats[code].missingCodeExample++;
                }
            }
        });

        // Calculate coverage metrics
        Object.keys(stats).forEach(code => {
            const s = stats[code];
            if (s.count > 0) {
                coveredCriteria++;
                if (levelStats[s.level]) levelStats[s.level].covered++;

                // Check platform coverage for this criteria
                if (s.platforms.Web > 0) platformCoverage.Web++;
                if (s.platforms.iOS > 0) platformCoverage.iOS++;
                if (s.platforms.Android > 0) platformCoverage.Android++;
            }
        });

        const coveragePercent = Math.round((coveredCriteria / totalCriteria) * 100);

        // Platform Score Calculation
        const totalPossiblePlatformCoverage = totalCriteria * 3; // Web, iOS, Android
        const actualPlatformCoverage = platformCoverage.Web + platformCoverage.iOS + platformCoverage.Android;
        const platformScorePercent = Math.round((actualPlatformCoverage / totalPossiblePlatformCoverage) * 100);

        // Helper for percentages
        const getPct = (num, den) => den === 0 ? 0 : Math.round((num / den) * 100);

        // Generate HTML
        let html = `
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card bg-light text-center h-100">
                        <div class="card-body">
                            <h3 class="display-4 text-primary">${totalTemplates}</h3>
                            <p class="text-muted">Total Standard Templates</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light text-center h-100">
                        <div class="card-body">
                            <h3 class="display-4 ${coveragePercent < 50 ? 'text-danger' : 'text-success'}">${coveragePercent}%</h3>
                            <p class="text-muted mb-1">WCAG Criteria Coverage</p>
                            <small class="d-block text-muted mb-2">${coveredCriteria} of ${totalCriteria} criteria covered</small>
                            
                            <div class="text-left small border-top pt-2 mt-2" style="font-size: 0.85em;">
                                <div class="d-flex justify-content-between">
                                    <span>Level A:</span>
                                    <strong>${levelStats.A.covered}/${levelStats.A.total} (${getPct(levelStats.A.covered, levelStats.A.total)}%)</strong>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span>Level AA:</span>
                                    <strong>${levelStats.AA.covered}/${levelStats.AA.total} (${getPct(levelStats.AA.covered, levelStats.AA.total)}%)</strong>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span>Level AAA:</span>
                                    <strong>${levelStats.AAA.covered}/${levelStats.AAA.total} (${getPct(levelStats.AAA.covered, levelStats.AAA.total)}%)</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                     <div class="card bg-light text-center h-100">
                        <div class="card-body">
                            <h3 class="display-4 ${platformScorePercent < 50 ? 'text-warning' : 'text-info'}">${platformScorePercent}%</h3>
                            <p class="text-muted mb-1">Overall Platform Score</p>
                            <small class="d-block text-muted mb-2">${actualPlatformCoverage} of ${totalPossiblePlatformCoverage} points</small>
                            
                            <div class="text-left small border-top pt-2 mt-2" style="font-size: 0.85em;">
                                <div class="d-flex justify-content-between">
                                    <span>Web:</span>
                                    <strong>${getPct(platformCoverage.Web, totalCriteria)}% (${platformCoverage.Web}/${totalCriteria})</strong>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span>iOS:</span>
                                    <strong>${getPct(platformCoverage.iOS, totalCriteria)}% (${platformCoverage.iOS}/${totalCriteria})</strong>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span>Android:</span>
                                    <strong>${getPct(platformCoverage.Android, totalCriteria)}% (${platformCoverage.Android}/${totalCriteria})</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-light text-center h-100">
                        <div class="card-body">
                            <h3 class="display-4 text-warning">${totalCriteria - coveredCriteria}</h3>
                            <p class="text-muted">Missing Criteria (Gaps)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-bordered table-sm table-hover">
                    <thead class="thead-light">
                        <tr>
                            <th>WCAG Criteria</th>
                            <th>Level</th>
                            <th>Total Templates</th>
                            <th>Web</th>
                            <th>iOS</th>
                            <th>Android</th>
                            <th>Missing Code Ex.</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Sort keys naturally
        const sortedKeys = Object.keys(stats).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

        sortedKeys.forEach(code => {
            const s = stats[code];
            const isGap = s.count === 0;
            const rowClass = isGap ? 'table-danger' : '';
            
            html += `
                <tr class="${rowClass}">
                    <td class="font-weight-bold">${code}</td>
                    <td><span class="badge badge-light border">Level ${s.level}</span></td>
                    <td class="text-center font-weight-bold">${s.count}</td>
                    <td class="text-center text-muted">${s.platforms.Web}</td>
                    <td class="text-center text-muted">${s.platforms.iOS}</td>
                    <td class="text-center text-muted">${s.platforms.Android}</td>
                    <td class="text-center ${s.missingCodeExample > 0 ? 'text-danger font-weight-bold' : 'text-muted'}">${s.missingCodeExample}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        analysisContent.innerHTML = html;
    }

    function copyAnalysisEmail() {
        if (!window.WCAG_MAP) return;

        const templatesToAnalyze = standardTemplates;
        const totalTemplates = templatesToAnalyze.length;
        const totalCriteria = Object.keys(window.WCAG_MAP).length;
        let coveredCriteria = 0;

        const stats = {};
        Object.keys(window.WCAG_MAP).forEach(code => {
            stats[code] = { count: 0, platforms: { Web: 0, iOS: 0, Android: 0 } };
        });
        
        const levelStats = { A: { total: 0, covered: 0 }, AA: { total: 0, covered: 0 }, AAA: { total: 0, covered: 0 } };
        const platformCoverage = { Web: 0, iOS: 0, Android: 0 };
        
        Object.values(window.WCAG_MAP).forEach(level => { if (levelStats[level]) levelStats[level].total++; });

        templatesToAnalyze.forEach(t => {
            const code = t.wcag;
            if (stats[code]) {
                stats[code].count++;
                if (Array.isArray(t.platforms)) {
                    t.platforms.forEach(p => { if (stats[code].platforms[p] !== undefined) stats[code].platforms[p]++; });
                }
            }
        });

        Object.keys(stats).forEach(code => {
            const s = stats[code];
            const level = window.WCAG_MAP[code];
            if (s.count > 0) {
                coveredCriteria++;
                if (levelStats[level]) levelStats[level].covered++;
                if (s.platforms.Web > 0) platformCoverage.Web++;
                if (s.platforms.iOS > 0) platformCoverage.iOS++;
                if (s.platforms.Android > 0) platformCoverage.Android++;
            }
        });

        const getPct = (num, den) => den === 0 ? 0 : Math.round((num / den) * 100);
        const coveragePercent = getPct(coveredCriteria, totalCriteria);
        
        // Platform Score
        const totalPossiblePlatformCoverage = totalCriteria * 3;
        const actualPlatformCoverage = platformCoverage.Web + platformCoverage.iOS + platformCoverage.Android;
        const platformScorePercent = getPct(actualPlatformCoverage, totalPossiblePlatformCoverage);
        
        const date = new Date().toLocaleDateString();

        const emailBody = `
Subject: Accessibility Template Library Status - ${date}

Hi Team,

Here is the current status of the Catalyst Accessibility Template Library as of ${date}:

📊 High-Level Stats
• Total Templates: ${totalTemplates}
• Overall WCAG Coverage: ${coveragePercent}% (${coveredCriteria}/${totalCriteria} criteria)
• Overall Platform Score: ${platformScorePercent}% (${actualPlatformCoverage}/${totalPossiblePlatformCoverage} points)

🎯 Coverage by Level
• Level A: ${getPct(levelStats.A.covered, levelStats.A.total)}% (${levelStats.A.covered}/${levelStats.A.total})
• Level AA: ${getPct(levelStats.AA.covered, levelStats.AA.total)}% (${levelStats.AA.covered}/${levelStats.AA.total})
• Level AAA: ${getPct(levelStats.AAA.covered, levelStats.AAA.total)}% (${levelStats.AAA.covered}/${levelStats.AAA.total})

📱 Coverage by Platform
(Percentage of criteria with at least one template)
• Web: ${getPct(platformCoverage.Web, totalCriteria)}%
• iOS: ${getPct(platformCoverage.iOS, totalCriteria)}%
• Android: ${getPct(platformCoverage.Android, totalCriteria)}%

⚠️ Gaps
• ${totalCriteria - coveredCriteria} criteria currently have 0 templates.

View the full breakdown in the Template Playground.
`.trim();

        navigator.clipboard.writeText(emailBody).then(() => {
            const originalText = copyEmailBtn.innerHTML;
            copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyEmailBtn.classList.remove('btn-outline-primary');
            copyEmailBtn.classList.add('btn-success');
            setTimeout(() => {
                copyEmailBtn.innerHTML = originalText;
                copyEmailBtn.classList.add('btn-outline-primary');
                copyEmailBtn.classList.remove('btn-success');
            }, 2000);
        });
    }

    function copyAiPrompt() {
        if (!window.WCAG_MAP) return;

        // Use ALL templates (Standard + Custom) to give a complete picture
        const allTemplates = [...standardTemplates, ...customTemplates];
        
        // Group WCAG by Level
        const levels = { A: [], AA: [], AAA: [] };
        const coveredWcag = new Set();
        
        allTemplates.forEach(t => {
            if (t.wcag) coveredWcag.add(t.wcag);
        });

        // Populate levels
        Object.keys(window.WCAG_MAP).forEach(code => {
            const level = window.WCAG_MAP[code];
            if (levels[level]) {
                levels[level].push({
                    code: code,
                    isCovered: coveredWcag.has(code)
                });
            }
        });

        // Sort criteria within levels
        const sortCriteria = (a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' });
        levels.A.sort(sortCriteria);
        levels.AA.sort(sortCriteria);
        levels.AAA.sort(sortCriteria);
        
        let prompt = `I am conducting an accessibility audit for a digital product.
Please help me research and analyze the following WCAG criteria.

For each criterion listed below that is NOT marked as [Covered], please provide:

1. The Top 5 most common failure scenarios (bugs) in plain language.
   - These should be the most frequent issues found in audits.
   - Use simple, clear language (e.g., "The page title is missing" or "The page title is not descriptive").
2. Another 5 potential failure scenarios.
   - These can be less common but still relevant edge cases.

I do NOT need code examples or testing steps. Just the list of failure scenarios to help me build bug templates.

Here is the checklist of criteria to review:

## Level A Criteria
`;

        levels.A.forEach(item => {
            const status = item.isCovered ? '[x] (Covered)' : '[ ]';
            prompt += `- ${status} ${item.code}\n`;
        });

        prompt += `\n## Level AA Criteria\n`;
        levels.AA.forEach(item => {
            const status = item.isCovered ? '[x] (Covered)' : '[ ]';
            prompt += `- ${status} ${item.code}\n`;
        });

        prompt += `\n## Level AAA Criteria\n`;
        levels.AAA.forEach(item => {
            const status = item.isCovered ? '[x] (Covered)' : '[ ]';
            prompt += `- ${status} ${item.code}\n`;
        });

        prompt += `\n\nPlease prioritize the unchecked items.`;

        navigator.clipboard.writeText(prompt).then(() => {
            const originalText = copyAiPromptBtn.innerHTML;
            copyAiPromptBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyAiPromptBtn.classList.remove('btn-outline-info');
            copyAiPromptBtn.classList.add('btn-success');
            setTimeout(() => {
                copyAiPromptBtn.innerHTML = originalText;
                copyAiPromptBtn.classList.add('btn-outline-info');
                copyAiPromptBtn.classList.remove('btn-success');
            }, 2000);
        });
    }

    function renderTable() {
        tableBody.innerHTML = '';
        
        // Combine lists with type indicator
        const allItems = [
            ...filteredCustom.map(t => ({ ...t, _type: 'Workspace' })),
            ...filteredStandard.map(t => ({ ...t, _type: 'Standard Library' }))
        ];

        if (allItems.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No templates match your search.</td></tr>';
            return;
        }

        // Sort by WCAG
        allItems.sort((a, b) => {
            const wcagA = a.wcag || 'ZZZ'; // Put N/A at end
            const wcagB = b.wcag || 'ZZZ';
            return wcagA.localeCompare(wcagB, undefined, { numeric: true, sensitivity: 'base' });
        });

        // Helper to escape HTML
        const escapeHtml = (unsafe) => {
            return unsafe
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        };

        let i = 0;
        let groupIndex = 0;

        while (i < allItems.length) {
            const currentItem = allItems[i];
            const currentWcag = currentItem.wcag || 'N/A';
            
            // Count how many items have this same WCAG
            let rowspan = 1;
            for (let j = i + 1; j < allItems.length; j++) {
                const nextWcag = allItems[j].wcag || 'N/A';
                if (nextWcag === currentWcag) {
                    rowspan++;
                } else {
                    break;
                }
            }

            // Render rows for this group
            for (let k = 0; k < rowspan; k++) {
                const item = allItems[i + k];
                const tr = document.createElement('tr');
                tr.className = 'table-row-clickable';
                tr.onclick = () => openDetail(item);
                
                // Check if this is the last item in the group
                if (k === rowspan - 1) {
                    tr.classList.add('wcag-group-end');
                }

                let rowHtml = '';

                // WCAG Cell (only for first row in group)
                if (k === 0) {
                    const colorClass = `wcag-accent-${(groupIndex % 3) + 1}`;
                    const wcagLevel = (window.WCAG_MAP && window.WCAG_MAP[currentWcag]) || '';
                    const levelBadge = wcagLevel ? `<br><span class="badge badge-light border mt-1">Level ${wcagLevel}</span>` : '';
                    rowHtml += `<td rowspan="${rowspan}" class="align-top font-weight-bold bg-light ${colorClass}"><div class="wcag-sticky-wrapper">${escapeHtml(currentWcag)}${levelBadge}</div></td>`;
                }

                // Other Cells
                const platforms = Array.isArray(item.platforms) ? item.platforms.join(', ') : 'All';
                const priorityClass = `priority-${item.priority || 'P3'}`;
                const typeBadgeClass = item._type === 'Workspace' ? 'badge-info' : 'badge-secondary';
                
                rowHtml += `
                    <td>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="font-weight-bold text-dark">${escapeHtml(item.title)}</div>
                            <i class="fas fa-chevron-right text-muted small ml-2"></i>
                        </div>
                        <div class="small text-muted text-truncate" style="max-width: 400px;">${escapeHtml(item.shortDescription || '')}</div>
                    </td>
                    <td><span class="priority-badge ${priorityClass}">${item.priority || 'P3'}</span></td>
                    <td><span class="badge ${typeBadgeClass}">${item._type}</span></td>
                    <td>${platforms}</td>
                `;
                
                tr.innerHTML = rowHtml;
                tableBody.appendChild(tr);
            }

            // Advance index
            i += rowspan;
            groupIndex++;
        }
    }

    function renderGrid(templates, container, isCustom = false) {
        container.innerHTML = '';

        if (templates.length === 0) {
            return; 
        }

        // Helper to escape HTML for card display
        const escapeHtml = (unsafe) => {
            return unsafe
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        };

        templates.forEach((template) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';
            
            const card = document.createElement('div');
            card.className = 'card h-100 template-card shadow-sm';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            const activate = () => openDetail(template);
            
            // Click on card body activates detail
            // Click on delete button (if exists) deletes
            
            const priorityClass = `priority-${template.priority || 'P3'}`;
            const wcag = template.wcag || 'N/A';
            const platforms = Array.isArray(template.platforms) ? template.platforms.join(', ') : 'All';

            let deleteBtnHtml = '';
            if (isCustom) {
                deleteBtnHtml = `
                    <button class="btn btn-sm btn-outline-danger delete-btn" style="z-index: 2; position: relative;" title="Remove from workspace">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
            }

            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="wcag-badge">${wcag}</span>
                            <span class="priority-badge ${priorityClass}">${template.priority || 'P3'}</span>
                        </div>
                        ${deleteBtnHtml}
                    </div>
                    <h5 class="card-title text-truncate" title="${template.title}">${template.title}</h5>
                    <p class="card-text small text-muted mb-2">
                        <i class="fas fa-desktop"></i> ${platforms}
                    </p>
                    <p class="card-text small text-secondary" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        ${escapeHtml(template.shortDescription || 'No description provided.')}
                    </p>
                </div>
            `;

            // Event Listeners
            card.onclick = (e) => {
                // Check if delete button was clicked
                if (e.target.closest('.delete-btn')) {
                    e.stopPropagation();
                    deleteCustomTemplate(template);
                    return;
                }
                activate();
            };
            
            card.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activate();
                }
            };

            col.appendChild(card);
            container.appendChild(col);
        });
    }

    function openDetail(template) {
        currentDetailTemplate = template;
        renderJiraPreview(template);
        detailModal.modal('show');
    }

    function renderJiraPreview(template) {
        // Helper to unescape HTML entities
        const unescapeHtml = (safe) => {
            return safe
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, "\"")
                .replace(/&#039;/g, "'");
        };

        // Helper to escape HTML
        const escapeHtml = (unsafe) => {
            return unsafe
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        };

        // Clean HTML: Unescape first (to handle double escaping) then escape
        const cleanHtml = (str) => {
             if (!str) return '';
             return escapeHtml(unescapeHtml(str));
        };

        // Format Steps
        let stepsHtml = '';
        if (Array.isArray(template.steps) && template.steps.length > 0) {
            stepsHtml = '<ol class="jira-steps-list">';
            template.steps.forEach(step => {
                stepsHtml += `<li>${cleanHtml(step)}</li>`;
            });
            stepsHtml += '</ol>';
        }

        // Format Code
        let codeHtml = '';
        if (template.codeExample) {
            const lang = template.codeExample.includes('<') ? 'html' : 'javascript';
            codeHtml = `
                <div class="jira-section-label">Code Example:</div>
                <pre><code class="language-${lang}">${cleanHtml(template.codeExample)}</code></pre>
            `;
        }

        let html = `
            <div class="jira-preview-header">
                <div class="jira-preview-title">${cleanHtml(template.title)}</div>
                <div class="text-muted">
                    <strong>WCAG:</strong> ${cleanHtml(template.wcag)} | 
                    <strong>Priority:</strong> ${cleanHtml(template.priority)} | 
                    <strong>Severity:</strong> ${cleanHtml(template.severity)}
                </div>
            </div>

            <div class="jira-section-label"><i class="fas fa-align-left"></i> Description:</div>
            <p>${cleanHtml(template.shortDescription)}</p>

            <div class="jira-section-label label-expected"><i class="fas fa-check-circle"></i> Expected Result:</div>
            <p>${cleanHtml(template.expectedResult)}</p>

            <div class="jira-section-label label-actual"><i class="fas fa-times-circle"></i> Actual Result:</div>
            <p>${cleanHtml(template.actualResult)}</p>

            <div class="jira-section-label label-recommendation"><i class="fas fa-wrench"></i> Recommendation:</div>
            <p>${cleanHtml(template.recommendation)}</p>

            ${codeHtml}

            <div class="jira-section-label"><i class="fas fa-list-ol"></i> Steps to Reproduce:</div>
            ${stepsHtml}
        `;

        if (template.additionalInfo) {
            html += `
                <div class="jira-section-label"><i class="fas fa-info-circle"></i> Additional Information:</div>
                <pre style="white-space: pre-wrap; font-family: inherit; background: #f8f9fa; padding: 10px; border-radius: 4px;">${cleanHtml(template.additionalInfo)}</pre>
            `;
        }

        jiraPreviewContent.innerHTML = html;
        Prism.highlightAllUnder(jiraPreviewContent);
    }

    // --- History Management ---
    // (Removed as requested)

    // --- Utilities ---

    function initAwesomplete() {
        new Awesomplete(templateSearch, {
            minChars: 1,
            maxItems: 10,
            list: []
        });
    }

    function copyPreviewText() {
        if (!currentDetailTemplate) return;
        const text = JSON.stringify(currentDetailTemplate, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyTextBtn.textContent;
            copyTextBtn.textContent = 'Copied JSON!';
            copyTextBtn.classList.remove('btn-success');
            copyTextBtn.classList.add('btn-outline-success');
            setTimeout(() => {
                copyTextBtn.textContent = originalText;
                copyTextBtn.classList.add('btn-success');
                copyTextBtn.classList.remove('btn-outline-success');
            }, 2000);
        });
    }

    function copyJiraMarkup() {
        if (!currentDetailTemplate) return;
        const t = currentDetailTemplate;
        
        let markup = `h3. ${t.title || 'No Title'}\n\n`;
        // Removed Priority/Severity/WCAG from description as requested
        
        markup += `📝 *Description:*\n\n${t.shortDescription || ''}\n\n`;
        
        markup += `✅ *Expected Result:*\n\n${t.expectedResult || ''}\n\n`;
        
        markup += `❌ *Actual Result:*\n\n${t.actualResult || ''}\n\n`;
        
        if (t.recommendation) {
            markup += `🛠 *Recommendation - How to Fix:*\n\n${t.recommendation}\n\n`;
        }
        
        if (t.codeExample) {
            markup += `💻 *Code Example (For reference only):*\n\n{code}\n${t.codeExample}\n{code}\n\n`;
        }
        
        if (Array.isArray(t.steps) && t.steps.length > 0) {
            markup += `🔁 *Steps to Reproduce:*\n\n`;
            t.steps.forEach((step, index) => {
                markup += `${index + 1}. ${step}\n`;
            });
            markup += `\n`;
        }

        markup += `🌐 *Environment Details:*\n\n* Operating system:\n* Screen Reader:\n* Browser:\n* Build:\n* Environment:\n\n`;
        
        markup += `ℹ️ *Additional Information (Optional):*\n`;
        
        if (t.additionalInfo) {
            markup += `${t.additionalInfo}\n`;
        }

        navigator.clipboard.writeText(markup).then(() => {
            const originalText = copyJiraBtn.textContent;
            copyJiraBtn.textContent = 'Copied Markup!';
            copyJiraBtn.classList.remove('btn-primary');
            copyJiraBtn.classList.add('btn-outline-primary');
            setTimeout(() => {
                copyJiraBtn.textContent = originalText;
                copyJiraBtn.classList.add('btn-primary');
                copyJiraBtn.classList.remove('btn-outline-primary');
            }, 2000);
        });
    }

    function downloadCurrentTemplate() {
        if (!currentDetailTemplate) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDetailTemplate, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "template_" + (currentDetailTemplate.wcag || "export") + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function exportTableData(format) {
        // Combine lists with type indicator
        const allItems = [
            ...filteredCustom.map(t => ({ ...t, _type: 'Workspace' })),
            ...filteredStandard.map(t => ({ ...t, _type: 'Standard Library' }))
        ];

        if (allItems.length === 0) {
            alert("No data to export.");
            return;
        }

        // Sort by WCAG
        allItems.sort((a, b) => {
            const wcagA = a.wcag || 'ZZZ';
            const wcagB = b.wcag || 'ZZZ';
            return wcagA.localeCompare(wcagB, undefined, { numeric: true, sensitivity: 'base' });
        });

        if (format === 'csv') {
            // CSV Export
            const headers = ['WCAG', 'Ruleset Title', 'Priority', 'Type', 'Platform', 'Description'];
            const rows = allItems.map(item => {
                const platforms = Array.isArray(item.platforms) ? item.platforms.join(', ') : 'All';
                return [
                    `"${(item.wcag || 'N/A').replace(/"/g, '""')}"`,
                    `"${(item.title || '').replace(/"/g, '""')}"`,
                    `"${(item.priority || 'P3').replace(/"/g, '""')}"`,
                    `"${(item._type || '').replace(/"/g, '""')}"`,
                    `"${platforms.replace(/"/g, '""')}"`,
                    `"${(item.shortDescription || '').replace(/"/g, '""')}"`
                ].join(',');
            });

            const csvContent = [
                headers.join(','),
                ...rows
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "catalyst_templates_export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } else if (format === 'excel') {
            // Simple HTML Table Export for Excel
            let tableHtml = '<table border="1"><thead><tr>';
            ['WCAG', 'Ruleset Title', 'Priority', 'Type', 'Platform', 'Description'].forEach(h => {
                tableHtml += `<th>${h}</th>`;
            });
            tableHtml += '</tr></thead><tbody>';

            allItems.forEach(item => {
                const platforms = Array.isArray(item.platforms) ? item.platforms.join(', ') : 'All';
                tableHtml += '<tr>';
                tableHtml += `<td>${item.wcag || 'N/A'}</td>`;
                tableHtml += `<td>${(item.title || '').replace(/</g, '&lt;')}</td>`;
                tableHtml += `<td>${item.priority || 'P3'}</td>`;
                tableHtml += `<td>${item._type || ''}</td>`;
                tableHtml += `<td>${platforms}</td>`;
                tableHtml += `<td>${(item.shortDescription || '').replace(/</g, '&lt;')}</td>`;
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody></table>';

            const blob = new Blob(['\ufeff', tableHtml], {
                type: 'application/vnd.ms-excel'
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "catalyst_templates_export.xls";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
});