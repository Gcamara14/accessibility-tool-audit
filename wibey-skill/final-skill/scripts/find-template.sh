#!/bin/bash
# Dynamically resolve the absolute path to this script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Point to the JS index file now stored in references/
FILE="$DIR/../references/templates-v1-03-19-2026-refactored.js"
KEYWORD="$1"
PLATFORM="$2"

if [ ! -f "$FILE" ]; then
    echo "NOT_FOUND"
    exit 0
fi

# Use node to parse the JS by mocking the browser window object
node -e "
global.window = global;
require('$FILE');
const templates = global.A11Y_TEMPLATES;
const keyword = process.argv[1].toLowerCase();
const platform = process.argv[2] ? process.argv[2].toLowerCase() : 'web';

if (!templates || !Array.isArray(templates)) {
    console.log('NOT_FOUND');
    process.exit(0);
}

// Determine the platform ID segment to filter by
// WA11Y-ALL-* templates are valid for all platforms
const platformSegment = platform === 'ios' ? '-IOS-'
    : platform === 'android' ? '-AND-'
    : '-WEB-';

const match = templates.find(t => {
    const id = (t.id || '').toUpperCase();
    const platformMatch = id.includes(platformSegment) || id.includes('-ALL-');
    if (!platformMatch) return false;
    return (
        (t.title && t.title.toLowerCase().includes(keyword)) ||
        (t.accessibilityName && t.accessibilityName.toLowerCase().includes(keyword)) ||
        (t.id && t.id.toLowerCase().includes(keyword)) ||
        (t.shortDescription && t.shortDescription.toLowerCase().includes(keyword)) ||
        (t.expectedResult && t.expectedResult.toLowerCase().includes(keyword)) ||
        (t.wcag && t.wcag.toLowerCase().includes(keyword))
    );
});

if (match) {
    console.log(match.id);
} else {
    console.log('NOT_FOUND');
}
" "$KEYWORD" "$PLATFORM" 2>/dev/null
