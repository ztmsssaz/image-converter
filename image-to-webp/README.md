Image to WebP

A fast, lightweight, and fully offline desktop application for converting images to WebP.

Built with Tauri 2, React, TypeScript, Vite, and Rust.

Overview

Image to WebP is a local desktop image converter designed to convert images to the WebP format without uploading files to a server or relying on an external API.

All image processing is performed locally on the user’s computer.

The application is being designed with a focus on:

- Fast image conversion
- Local and offline processing
- Batch image conversion
- Simple and clean user interface
- Low memory usage
- Native filesystem access
- Cross-platform desktop support

Tech Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

Desktop

- Tauri 2

Image Processing

- Rust
- image
- webp

Architecture

React + TypeScript
│
│ Tauri invoke
▼
Rust Commands
│
▼
Image Processing
│
▼
Local Filesystem

The frontend is responsible for the user interface and application state, while Rust handles filesystem operations and image processing.

Current Features

- Select multiple images from the local filesystem
- Drag and drop images into the application
- Detect supported image formats
- Display selected image information
- Display file sizes
- Prevent duplicate files from being added
- Select an output directory
- Configure WebP quality
- Convert images locally to WebP
- Display conversion status for each file
- Display original and converted file sizes
- Show conversion errors per file

Supported Formats

Currently supported input formats:

- JPG
- JPEG
- PNG
- GIF

Output format:

- WebP

Additional formats may be added in future versions.

Privacy

The application is designed to work completely locally.

Images are not:

- Uploaded to a server
- Sent to an external API
- Stored in a cloud service
- Processed by a remote service

The conversion process happens directly on the user’s computer.

Project Structure

image-to-webp/
├── src/
│ ├── features/
│ │ └── converter/
│ │ ├── components/
│ │ │ └── drop-zone.tsx
│ │ ├── services/
│ │ │ └── converter.ts
│ │ ├── types/
│ │ │ └── converter.ts
│ │ └── utils/
│ │ └── file.ts
│ │
│ ├── App.tsx
│ └── ...
│
├── src-tauri/
│ ├── src/
│ │ ├── commands/
│ │ │ ├── converter.rs
│ │ │ └── mod.rs
│ │ ├── lib.rs
│ │ └── main.rs
│ │
│ ├── capabilities/
│ ├── Cargo.toml
│ └── tauri.conf.json
│
├── package.json
├── vite.config.ts
└── README.md

Development

Requirements

Make sure the following tools are installed:

- Node.js
- npm
- Rust
- Cargo
- Tauri prerequisites for your operating system

Install Dependencies

Clone the repository and install the frontend dependencies:

npm install

Install Rust dependencies:

cd src-tauri
cargo check
cd ..

Run Development Mode

Start the application in development mode:

npm run tauri dev

This starts the Vite development server and launches the Tauri desktop application.

Build

To create a production desktop build:

npm run tauri build

The generated installers and application bundles will be available under:

src-tauri/target/release/bundle/

The exact output depends on the operating system and configured Tauri targets.

How It Works

1. Select Images

Users can select one or more supported images using the native file picker or drag and drop files directly into the application.

2. Read File Information

The application retrieves basic file metadata such as:

- File name
- File path
- File size
- File extension

Only the information required by the application is handled by the frontend.

3. Select Output Directory

The user chooses where the converted WebP files should be saved.

4. Configure Quality

The WebP quality can be configured before starting the conversion.

5. Convert

The React application sends the conversion request to Rust through the Tauri command system.

Rust then:

1. Opens the source image
2. Decodes the image
3. Encodes it as WebP
4. Writes the resulting file to the selected directory
5. Returns conversion information to the frontend

6. Display Results

The frontend displays the conversion result, including the output path and file size.

Design Goals

The project is intentionally built around a native desktop architecture rather than a traditional web application.

Local Processing

Image files can be large, so processing them locally avoids unnecessary network transfers and server-side processing.

Rust for Image Processing

Rust is used for filesystem operations and image conversion to provide a native processing layer that can later support:

- Parallel conversion
- Large batches
- Progress reporting
- Cancellation
- Memory-efficient processing
- Additional image formats

React for UI

React is responsible for:

- Application state
- File list management
- Conversion controls
- Progress display
- User interaction
- Error presentation

Roadmap

Planned improvements include:

- Batch conversion optimization
- Parallel image processing
- Real-time conversion progress
- Cancel conversion
- Conversion queue
- Before/after file size comparison
- Lossy and lossless WebP modes
- Better quality controls
- Image resizing
- Preserve original folder structure
- Custom output filenames
- Automatic filename conflict handling
- Image previews
- AVIF support
- BMP support
- TIFF support
- HEIC support
- Metadata handling
- Dark mode
- Improved error reporting
- Cross-platform release builds

Contributing

Contributions, improvements, and bug reports are welcome.

Before submitting changes, make sure the project builds successfully:

npm run tauri dev

and verify the Rust code:

cd src-tauri
cargo check

License

This project is currently under development.

The license will be added before the first public release.
