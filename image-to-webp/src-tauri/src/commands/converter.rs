use std::fs;
use std::path::{Path, PathBuf};

use image::ImageReader;
use serde::Serialize;
use webp::Encoder;

#[derive(Debug, Serialize)]
pub struct ConversionResult {
    pub input_path: String,
    pub output_path: String,
    pub original_size: u64,
    pub output_size: u64,
}

#[tauri::command]
pub fn convert_to_webp(
    input_path: String,
    output_directory: String,
    quality: u8,
) -> Result<ConversionResult, String> {
    if quality > 100 {
        return Err("Quality must be between 0 and 100.".to_string());
    }

    let input = Path::new(&input_path);
    let output_directory = Path::new(&output_directory);

    if !input.exists() {
        return Err(format!("Input file does not exist: {input_path}"));
    }

    if !output_directory.exists() {
        fs::create_dir_all(output_directory)
            .map_err(|error| format!("Failed to create output directory: {error}"))?;
    }

    let file_stem = input
        .file_stem()
        .and_then(|value| value.to_str())
        .ok_or_else(|| "Invalid input file name.".to_string())?;

    let output_path: PathBuf = output_directory.join(format!("{file_stem}.webp"));

    let image = ImageReader::open(input)
        .map_err(|error| format!("Failed to open image: {error}"))?
        .decode()
        .map_err(|error| format!("Failed to decode image: {error}"))?;

    let rgba_image = image.to_rgba8();

    let encoder = Encoder::from_rgba(
        rgba_image.as_raw(),
        rgba_image.width(),
        rgba_image.height(),
    );

    let encoded = encoder.encode(f32::from(quality));

    fs::write(&output_path, &*encoded)
        .map_err(|error| format!("Failed to write WebP file: {error}"))?;

    let original_size = fs::metadata(input)
        .map_err(|error| format!("Failed to read input metadata: {error}"))?
        .len();

    let output_size = fs::metadata(&output_path)
        .map_err(|error| format!("Failed to read output metadata: {error}"))?
        .len();

    Ok(ConversionResult {
        input_path,
        output_path: output_path
            .to_str()
            .ok_or_else(|| "Invalid output path.".to_string())?
            .to_string(),
        original_size,
        output_size,
    })
}