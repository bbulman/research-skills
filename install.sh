#!/usr/bin/env bash
# Installs the research skills into Claude Code.
#
#   ./install.sh      installs into ~/.claude (set CLAUDE_DIR to install elsewhere)
#
# The skills read their shared rules from ~/.claude/skills/research-shared, so
# they go in your user skills, not a project's .claude/skills.
#
# An existing folder with one of these names is kept as backups/<name>.<stamp>/,
# outside skills/ so the copy doesn't load as a second skill.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
STAMP="$(date +%Y%m%d-%H%M%S)"

echo "Installing the research skills into $CLAUDE_DIR"
mkdir -p "$CLAUDE_DIR/skills"

count=0
for source in "$HERE"/skills/*/; do
  name="$(basename "$source")"
  target="$CLAUDE_DIR/skills/$name"
  if [ -e "$target" ]; then
    mkdir -p "$CLAUDE_DIR/backups"
    mv "$target" "$CLAUDE_DIR/backups/$name.$STAMP"
    echo "  kept the old $name as backups/$name.$STAMP"
  fi
  cp -R "$source" "$target"
  if [ "$name" != "research-shared" ]; then
    if ! grep -q "^name: $name\$" "$target/SKILL.md"; then
      echo "  $name: SKILL.md is missing or has the wrong name" >&2
      exit 1
    fi
    count=$((count + 1))
  fi
done
echo "  wrote $count skills and their shared rules"

if command -v node >/dev/null 2>&1; then
  node "$CLAUDE_DIR/skills/research-shared/check.mjs" --self-test | tail -1 | sed 's/^/  checker: /'
else
  echo "  Node isn't installed, and the skills need it for their checking scripts"
fi

echo
echo "Next: open a new Claude Code session and run a skill by name, such as /create-persona."
