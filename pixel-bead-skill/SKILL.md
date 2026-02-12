# Skill: bead-art

name: bead-art
description: Generate perler bead patterns from images. This skill should be used when users request to create bead art patterns from images, convert photos to perler bead templates, or generate pixel art for bead crafting.

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

The server will start on `http://localhost:3000`

### Step 2: Open the Web Interface

Open your browser and navigate to `http://localhost:3000`

### Step 3: Upload and Generate Pattern

On the web interface:
1. **Select resolution**: Choose from preset options (50x50, 58x58, 80x80, 100x100, etc.)
2. **Upload image**: Click "选择图片" and select your image file
3. **Generate**: Click "生成拼豆图" to process the image

The system will:
1. Resize the image to the specified grid resolution
2. Map each pixel to the closest MARD bead color (291 colors available)
3. Generate a pixel-style preview image
4. Calculate bead counts for each color used

### Step 4: View Results and Download

After generation:
- View the pixel-style bead pattern preview
- See color legend with bead counts
- Check statistics (total beads, unique colors used)
- Download the pattern image by clicking "下载拼豆图"

## Skill Contents

### scripts/

- **server.js**: Node.js Express server providing web interface
  - Handles image upload and processing
  - Converts images to bead patterns using color mapping
  - Generates pixel-style preview images
  - Calculates bead count statistics
  - Provides download functionality

- **package.json**: Node.js dependencies
  - Express: Web server framework
  - Multer: File upload handling
  - Sharp: Image processing library

### references/

- **bead-colors.md**: Complete reference for MARD bead colors
  - 291 MARD bead colors with HEX and RGB values
  - Organized by series (A, B, C, D, E, F, G, H, M, P, Q, R, T, Y, ZG)
  - Color mapping algorithms and display methods
  - HTML/CSS/Vue.js examples for color display

### assets/

- **outputs/**: Generated pattern images (created at runtime)
  - Temporary storage for generated PNG files
  - Pattern ID-based naming

## How Color Mapping Works

The system uses Euclidean color distance in RGB space to find the nearest bead color for each pixel:

```
distance = sqrt((r1 - r2)² + (g1 - g2)² + (b1 - b2)²)
```

For each pixel:
1. Extract RGB values from the resized image
2. Calculate distance to all 291 MARD bead colors
3. Select the color with minimum distance
4. Record color code and count

## Resolution Options

Available grid sizes:
- 50x50: 2,500 beads
- 58x58: 3,364 beads (standard MARD board size)
- 60x60: 3,600 beads
- 70x70: 4,900 beads
- 80x80: 6,400 beads (recommended)
- 100x100: 10,000 beads
- 116x116: 13,456 beads (2x standard boards)
- 120x120: 14,400 beads

## Tips

- **Image quality**: Use high-contrast images with clear shapes for best results
- **Resolution**: 80x80 is a good balance between detail and practical size
- **Color variety**: Simple images work better than complex gradients
- **Preview**: Use the web preview to verify the pattern before downloading
- **Bead availability**: Check if you have all required colors before starting

## Output Format

Generated images are in PNG format with:
- Each pixel represented as a colored square
- 20px square size per bead in the preview
- 4x scaling for clearer viewing
- Border grid lines between beads

Color legend shows:
- Bead swatch (color preview)
- Color code (e.g., A1, B10, H7)
- Bead count for that color

## Technical Details

**Dependencies:**
- Node.js 14+
- npm

**Image Processing:**
- Uses Sharp library for efficient image resizing
- Nearest-neighbor resizing to maintain pixel art style
- SVG generation for pixel grid rendering

**Color Palette:**
- MARD 291-color palette
- Full RGB mapping included in server.js
- Pre-computed for performance

**Performance:**
- Typical generation time: 1-3 seconds
- Supports images up to 10MB
- Auto-cleanup of uploaded files after processing
