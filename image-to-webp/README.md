# Image to WebP

A fast, lightweight, and fully offline desktop application for converting images to WebP.

Built with **Tauri 2**, **React**, **TypeScript**, **Vite**, and **Rust**.

Convert your images locally — no uploads, no servers, and no external APIs.

## ✨ Features

- 🖼️ Select multiple images
- 📂 Drag & drop image files
- 🔄 Convert images to WebP
- 🎚️ Adjustable WebP quality
- 📁 Choose a custom output directory
- 📊 Display original and converted file sizes
- ⚡ Local image processing with Rust
- 🔒 Completely offline
- 🚫 No server or API required
- ♻️ Prevent duplicate files
- 📋 Per-file conversion status
- ❌ Per-file error handling

## 🖥️ Supported Formats

**Input**

- JPG
- JPEG
- PNG
- GIF

**Output**

- WebP

> More formats will be added over time.

## 🛠️ Tech Stack

| Technology   | Purpose                        |
| ------------ | ------------------------------ |
| React        | User interface                 |
| TypeScript   | Type-safe frontend development |
| Vite         | Frontend build tooling         |
| Tailwind CSS | UI styling                     |
| Tauri 2      | Desktop application framework  |
| Rust         | Native image processing        |
| image        | Image decoding                 |
| webp         | WebP encoding                  |

## 🏗️ Architecture

```
┌──────────────────────────────┐
│        React + TypeScript     │
│                                │
│  File Selection                │
│  Drag & Drop                   │
│  Settings                      │
│  Conversion Status             │
└──────────────┬─────────────────┘
               │
               │ Tauri invoke
               ▼
┌──────────────────────────────┐
│            Rust               │
│                                │
│  File System                   │
│  Image Decoding                 │
│  WebP Encoding                  │
│  Conversion                     │
└──────────────┬─────────────────┘
               │
               ▼
        Local Filesystem
```

The application uses React for the UI and Rust for native filesystem operations and image processing.

No image data needs to leave the user's computer.

## 🔐 Privacy

**Image to WebP** is designed as a local-first application.

Your images are processed directly on your computer.

The application does **not** require:

- A backend server
- An external API
- Cloud storage
- Image uploads
- An internet connection

Your files remain on your local filesystem.

## 📁 Project Structure

```
image-to-webp/
├── src/
│   ├── features/
│   │   └── converter/
│   │       ├── components/
│   │       │   └── drop-zone.tsx
│   │       ├── services/
│   │       │   └── converter.ts
│   │       ├── types/
│   │       │   └── converter.ts
│   │       └── utils/
│   │           └── file.ts
│   │
│   ├── App.tsx
│   └── ...
│
├── src-tauri/
│   ├── src/
│   │   ├── commands/
│   │   │   ├── converter.rs
│   │   │   └── mod.rs
│   │   ├── lib.rs
│   │   └── main.rs
│   │
│   ├── capabilities/
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── package.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/)
- Cargo
- [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your operating system

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/image-to-webp.git
cd image-to-webp
```

Install frontend dependencies:

```bash
npm install
```

Check the Rust dependencies:

```bash
cd src-tauri
cargo check
cd ..
```

### Development

Start the application in development mode:

```bash
npm run tauri dev
```

This starts the Vite development server and launches the Tauri desktop application.

## 📦 Build

Create a production build with:

```bash
npm run tauri build
```

The generated application bundles will be available in:

```
src-tauri/target/release/bundle/
```

The generated files depend on the target operating system.

## 🧭 Roadmap

- [x] Image selection
- [x] Drag & drop
- [x] Multiple image selection
- [x] Output directory selection
- [x] WebP quality control
- [x] Local WebP conversion
- [x] Per-file conversion status
- [x] File size comparison
- [ ] Conversion queue
- [ ] Parallel processing
- [ ] Real-time conversion progress
- [ ] Cancel active conversion
- [ ] Lossless WebP mode
- [ ] Image resizing
- [ ] Custom output filenames
- [ ] Automatic filename conflict handling
- [ ] Preserve folder structure
- [ ] Image previews
- [ ] AVIF support
- [ ] BMP support
- [ ] TIFF support
- [ ] HEIC support
- [ ] Metadata handling
- [ ] Dark mode
- [ ] Cross-platform release builds

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome.

To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the application
5. Open a pull request

Before submitting a pull request, make sure the project builds successfully:

```bash
npm run tauri dev
```

and verify the Rust code:

```bash
cd src-tauri
cargo check
```

## 📄 License

This project is currently under development.

A license will be added before the first public release.

---

Made with ❤️ using React, Tauri, and Rust.
