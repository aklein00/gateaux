#!/bin/bash
# Gateaux Venus Deployment Checklist Script

echo "🍰 Gateaux Venus Deployment Checklist"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Check if dist/ folder exists
echo -n "✓ Checking dist/ folder... "
if [ -d "dist" ]; then
  echo -e "${GREEN}EXISTS${NC}"
else
  echo -e "${RED}MISSING${NC}"
  echo "  Run 'npm run build' first!"
  ERRORS=$((ERRORS + 1))
fi

# 2. Check if build is recent (within last hour)
if [ -d "dist" ]; then
  echo -n "✓ Checking build freshness... "
  DIST_TIME=$(stat -f "%m" dist 2>/dev/null || stat -c "%Y" dist 2>/dev/null)
  NOW_TIME=$(date +%s)
  AGE=$((NOW_TIME - DIST_TIME))

  if [ $AGE -lt 3600 ]; then
    echo -e "${GREEN}FRESH (${AGE}s old)${NC}"
  else
    echo -e "${YELLOW}OLD ($(($AGE / 60)) minutes)${NC}"
    echo "  Consider rebuilding: 'npm run build'"
  fi
fi

# 3. Check for critical files
echo -n "✓ Checking index.html... "
if [ -f "dist/index.html" ]; then
  echo -e "${GREEN}EXISTS${NC}"
else
  echo -e "${RED}MISSING${NC}"
  ERRORS=$((ERRORS + 1))
fi

echo -n "✓ Checking game.config.json... "
if [ -f "game.config.json" ]; then
  echo -e "${GREEN}EXISTS${NC}"
else
  echo -e "${RED}MISSING${NC}"
  echo "  Run 'venus init' first!"
  ERRORS=$((ERRORS + 1))
fi

echo -n "✓ Checking Venus SDK in build... "
if grep -q "venus-sdk" dist/assets/*.js 2>/dev/null; then
  echo -e "${GREEN}FOUND${NC}"
else
  echo -e "${YELLOW}NOT DETECTED${NC}"
  echo "  Venus SDK might not be bundled"
fi

# 4. Check asset folders
echo -n "✓ Checking assets/images/... "
if [ -d "assets/images" ]; then
  IMAGE_COUNT=$(find assets/images -type f | wc -l | tr -d ' ')
  echo -e "${GREEN}EXISTS (${IMAGE_COUNT} images)${NC}"
else
  echo -e "${YELLOW}MISSING${NC}"
fi

# 5. Show build size
echo ""
echo "📦 Build Size:"
if [ -d "dist" ]; then
  TOTAL_SIZE=$(du -sh dist | cut -f1)
  echo "  Total: $TOTAL_SIZE"

  if [ -f "dist/assets"/*.js ]; then
    JS_SIZE=$(du -sh dist/assets/*.js 2>/dev/null | awk '{sum+=$1} END {print sum}')
    echo "  JavaScript: $(ls -lh dist/assets/*.js | awk '{print $5}' | head -1)"
  fi

  if [ -f "dist/assets"/*.css ]; then
    CSS_SIZE=$(ls -lh dist/assets/*.css | awk '{print $5}' | head -1)
    echo "  CSS: $CSS_SIZE"
  fi
fi

# 6. Venus deployment checklist
echo ""
echo "📋 Pre-Deployment Checklist:"
echo "  [ ] Game tested in browser (http://localhost:8080)"
echo "  [ ] Mobile responsive design verified"
echo "  [ ] Audio unlock works on first interaction"
echo "  [ ] No console errors in DevTools"
echo "  [ ] All critical assets loaded"
echo "  [ ] Haptic feedback integrated (if applicable)"
echo ""

# Final status
echo "======================================"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed! Ready to deploy.${NC}"
  echo ""
  echo "To deploy:"
  echo "  Unlisted: venus publish"
  echo "  Public:   venus publish --public"
else
  echo -e "${RED}✗ ${ERRORS} error(s) found. Fix before deploying.${NC}"
  exit 1
fi
