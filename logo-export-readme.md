# Logo Export Guide

The `frontend/public/logo.svg` file is the master AI Tools Hub icon.

## Required Export Sizes

| Platform | Size | Usage |
|----------|------|-------|
| Web      | 32×32  | Favicon (use `favicon.svg` directly) |
| Android  | 1024×1024 | Play Store listing / adaptive icon |
| iOS      | 1024×1024 | App Store listing |
| Android Splash | 2732×2732 | Splash screen (12.9" iPad Pro scale) |

## How to Export via CloudConvert

1. Go to https://cloudconvert.com/svg-to-png
2. Upload `frontend/public/logo.svg`
3. Set **Width** and **Height** to the target size (e.g. 1024×1024)
4. Enable **Background** → set to `#0A0A0F` to keep the black background
5. Click **Convert**
6. Repeat for each required size

## Alternative: Inkscape (Free Desktop Tool)

```bash
# 1024×1024
inkscape logo.svg -o icon-1024.png -w 1024 -h 1024

# 2732×2732
inkscape logo.svg -o icon-2732.png -w 2732 -h 2732
```

## Alternative: ImageMagick (CLI)

```bash
# 1024×1024
magick convert -background none logo.svg -resize 1024x1024 icon-1024.png

# 2732×2732
magick convert -background none logo.svg -resize 2732x2732 icon-2732.png
```

> Use `-background "#0A0A0F"` if you want the black background baked into the PNG.
