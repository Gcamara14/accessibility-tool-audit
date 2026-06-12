#!/bin/bash
# Usage: bash final-skill/check-lock.sh <file-path>
# Returns: LOCKED_BY=<agent> LOCKED_AGO=<seconds> or FREE

FILE=$1
STALE_THRESHOLD=300 # 5 minutes in seconds
LOCK_DIR=$(git rev-parse --show-toplevel)/.agents/mailboxes/__locks/messages
SAFE_FILE=$(echo $FILE | sed 's|/|-|g; s|\..|_|g')

# Find the most recent lock message for this file
LATEST=$(ls -t $LOCK_DIR/*$SAFE_FILE*.msg 2>/dev/null | head -1)

if [ -z "$LATEST" ]; then
    echo "FREE"
    exit 0
fi

STATUS=$(jq -r '.status' $LATEST)
CLONE=$(jq -r '.clone' $LATEST)
TIMESTAMP=$(jq -r '.timestamp' $LATEST)

# Calculate how many seconds ago the lock was acquired
# Note: Uses date -j for macOS BSD date format compatibility as requested by Wibey
AGO=$(( $(date +%s) - $(date -j -f "%Y-%m-%dT%H:%M:%SZ" $TIMESTAMP +%s 2>/dev/null || date -d $TIMESTAMP +%s 2>/dev/null) ))

if [ "$STATUS" = "released" ]; then
    echo "FREE"
elif [ $AGO -gt $STALE_THRESHOLD ]; then
    echo "STALE LOCKED_BY=$CLONE AGO=${AGO}s"
else
    echo "LOCKED LOCKED_BY=$CLONE AGO=${AGO}s"
fi
