#!/bin/bash

# Script to generate GitHub release notes between two tags
# Usage: ./scripts/generate-release-notes.sh <tag>
# Example: ./scripts/generate-release-notes.sh 2.0.2

set -e

if [ -z "$1" ]; then
  echo "Error: No tag specified"
  echo "Usage: $0 <tag>"
  echo "Example: $0 2.0.2"
  exit 1
fi

TARGET_TAG="$1"

# Check if the tag exists
if ! git rev-parse "$TARGET_TAG" >/dev/null 2>&1; then
  echo "Error: Tag '$TARGET_TAG' does not exist"
  exit 1
fi

# Get all tags sorted by version
ALL_TAGS=$(git tag --sort=-version:refname)

# Find the previous tag
PREVIOUS_TAG=""
FOUND_TARGET=false

for tag in $ALL_TAGS; do
  if [ "$FOUND_TARGET" = true ]; then
    PREVIOUS_TAG="$tag"
    break
  fi
  if [ "$tag" = "$TARGET_TAG" ]; then
    FOUND_TARGET=true
  fi
done

if [ "$FOUND_TARGET" = false ]; then
  echo "Error: Tag '$TARGET_TAG' not found in repository"
  exit 1
fi

if [ -z "$PREVIOUS_TAG" ]; then
  echo "Error: No previous tag found for comparison"
  exit 1
fi

# Get the date of the tag in the format: "Month, Day, Year"
TAG_DATE=$(git log -1 --format=%ai "$TARGET_TAG" | awk '{print $1}')
FORMATTED_DATE=$(date -d "$TAG_DATE" "+%B %-d, %Y" 2>/dev/null || date -j -f "%Y-%m-%d" "$TAG_DATE" "+%B %-d, %Y" 2>/dev/null)

# Output in the specified format
echo "$TARGET_TAG ($FORMATTED_DATE)"
echo ""

# Placeholder for summary - user should fill this in
echo "[Add a brief summary of the release here]"
echo ""

# Get commit messages with hash
git log "${PREVIOUS_TAG}..${TARGET_TAG}" --pretty=format:"    %s (%h)" --no-merges

echo ""
echo ""
echo "**Full Changelog**: https://github.com/ivmarcos/react-to-pdf/compare/${PREVIOUS_TAG}...${TARGET_TAG}"
