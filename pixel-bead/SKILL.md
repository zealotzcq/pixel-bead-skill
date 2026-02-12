---
name: bead-art
description: Generate perler bead patterns from images. This skill should be used when users request to create bead art patterns from images, or 拼豆
---

## Purpose

This skill converts any image into a perler bead (拼豆) pattern, enabling users to create physical bead art. It provides a web-based interface for image upload, resolution selection, and generates pixel-style bead patterns with color mapping and bead count statistics.

## When to Use This Skill

Trigger this skill when users:
- Request to generate a bead pattern from an image
- Ask to convert a photo to perler bead art
- Want to create pixel art for bead crafting
- Need a bead pattern with color references and bead counts

## Workflow

### Step 1: Start the Web Server

Navigate to the scripts directory and install dependencies:

```bash
cd .opencode/skills/bead-art/scripts
npm install
```

Start the server:

```bash
npm start
```

The server will start on `http://localhost:3000` and automatically open your browser.

### Step 2: Use the Web Interface

The web interface will automatically open. You can:
- Upload images and generate bead patterns
- Adjust resolution and color tables
- Download patterns and color palettes
- Switch between Chinese and English languages using the dropdown menu in the header
- Stop the service by clicking the "停止服务" (Stop Service) button in the top right corner

**Language Support:**
- The interface automatically detects your browser's language setting
- If your browser is set to Chinese (zh-CN, zh-TW, etc.), the interface defaults to Chinese
- Otherwise, it defaults to English
- You can manually switch languages at any time using the language dropdown

### Step 3: Upload and Generate Pattern

Let user use the webpage to finish the rest of works.

## Skill Contents

### scripts/

- **server.js**: Node.js Express server providing web interface
  - Handles image upload and processing
  - Converts images to bead patterns using color mapping
  - Generates pixel-style preview images
  - Calculates bead count statistics
  - Provides download functionality
  - Automatically opens browser on startup
  - Provides `/api/stop` endpoint to gracefully shutdown the server
- **index.html**: Frontend web interface with bilingual support (Chinese/English)
  - Auto-detects browser language to set default language
  - Allows manual language switching via dropdown
  - All UI text supports both Chinese and English

## Technical Details

**Dependencies:**
- Node.js 14+
- npm
- express
- multer
- sharp
- open