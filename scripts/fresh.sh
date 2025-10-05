#!/usr/bin/env bash
set -euo pipefail

npm run start register caleb || true
npm run start login caleb
npm run start addfeed 'Tech Crunch' https://techcrunch.com/feed/ || true
npm run start addfeed 'Hacker News' https://news.ycombinator.com/rss || true
npm run start addfeed 'Boot.dev Blog' https://blog.boot.dev/index.xml || true