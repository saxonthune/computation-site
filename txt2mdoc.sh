#!/bin/bash
# Converts a .txt draft into a .mdoc file.
# Usage: ./txt2mdoc.sh src/content/pages/product-and-software.txt
#
# Transformations:
#   - Generates frontmatter (title from filename, permalink, today's date, earlyAccess)
#   - Paragraphs: joins consecutive non-blank lines into single lines

set -euo pipefail

input="$1"
output="${input%.txt}.mdoc"

# Derive title from filename: kebab-case -> Title Case
basename="${input##*/}"
basename="${basename%.txt}"
title=$(echo "$basename" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
permalink="$basename"
today=$(date +%Y-%m-%d)

# Write frontmatter + transformed body
{
  cat <<EOF
---
title: "$title"
permalink: $permalink
published: $today
earlyAccess: true
---

EOF

  # Join consecutive non-blank lines into paragraphs.
  # A blank line (or line with only whitespace) marks a paragraph boundary.
  awk '
    /^[[:space:]]*$/ {
      if (para != "") { print para; para = "" }
      print ""
      next
    }
    {
      if (para != "") para = para " " $0
      else para = $0
    }
    END { if (para != "") print para }
  ' "$input"
} > "$output"

echo "Wrote $output"
