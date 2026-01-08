# Obsidian Kindle Book Info

English | [日本語](README.md)

Fetch book information from Kindle/Amazon URLs and create notes with templates. Supports shortened URLs (a.co) as well.

> **Note**: This plugin has only been tested with amazon.co.jp. Operation with Amazon sites from other countries is not guaranteed.

> **Multilingual Support**: The plugin supports both English and Japanese. The display language switches automatically according to Obsidian's language settings.

## Features
- Automatically create book notes by simply entering a URL
- Save essential information in Frontmatter (title/author/release date/ASIN/ISBN/URL, etc.)
- Auto-insert thumbnails and description sections
- Load templates from external .md files (specified in settings)

## Installation

### Manual Installation
- Download `main.js`, `manifest.json`, and `styles.css` from GitHub [Releases](https://github.com/mizuki-momose/obsidian-kindle-book-info/releases)
- Place them in `.obsidian/plugins/obsidian-kindle-book-info/` in your Vault and restart Obsidian

## Usage
- Desktop: URLs from clipboard are automatically populated in the modal when launched (if clipboard doesn't contain a URL, field remains empty)
- Mobile: Click "Search from Clipboard" button in the modal to extract URL and search immediately
- Launch from Command Palette or ribbon icon

## Saved Information (Frontmatter)
The following keys are saved (see template example):
- Title: {{title}}
- Authors: {{authors}} (YAML array)
- Published: {{published}}
- Series: {{series}}
- Volume: {{volume}}
- ASIN: {{asin}}
- ISBN-10: {{isbn10}}
- ISBN-13: {{isbn13}}
- Thumbnail: {{thumbnail}}
- URL: {{url}}
- Description: {{description_short}}
- Created: {{created}}

## Template Example
Specify a template file in settings (e.g., Templates/kindle-book-template.md).

```yaml
---
Title: {{title}}
Authors: {{authors}}
Published: {{published}}
Series: {{series}}
Volume: {{volume}}
ASIN: {{asin}}
ISBN-10: {{isbn10}}
ISBN-13: {{isbn13}}
Thumbnail: {{thumbnail}}
URL: {{url}}
Description: {{description_short}}
Created: {{created}}
---

## Thumbnail
{{thumbnail_display}}

## Description
{{description}}

## Notes
```

## Advanced URI (Optional)
- Direct call: obsidian://kindle-book-info?url=https://a.co/xxxx
- Specify Vault: obsidian://kindle-book-info?vault=VaultName&url=https://www.amazon.co.jp/dp/ASIN
- Via Advanced URI: obsidian://advanced-uri?vault=VaultName&uid=kindle-book-info&url=...

## Settings
- Save folder / Image save folder: Select from existing folders (folder suggest)
- Template file path: Path to the .md template file to load
- Download images: Whether to save thumbnails to Vault
- Filename template: Example: {{title}} - {{authors}}

## Additional Notes
- Book detection uses JSON-LD `@type: Book` and breadcrumbs (Kindle Store > Kindle Books, or top-level "Books")
- Paper edition ISBNs are supplemented by following ASINs from format selection (Paperback/Hardcover/Comic/etc.)
- Supported version: Obsidian 0.15.0 or higher (desktop/mobile compatible)
- Privacy: Accesses Amazon pages externally but does not send Vault contents outside

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Development build (watch mode)
pnpm run dev

# Production build
pnpm run build
```

### Build Output
Build artifacts are generated in the project root:
- `./main.js` - Plugin main file
- `./manifest.json` - Plugin manifest
- `./styles.css` - Stylesheet

## Contributing

Bug reports and feature requests are welcome at [Issues](https://github.com/mizuki-momose/obsidian-kindle-book-info/issues).
Pull Requests are also welcome!

## License
MIT
