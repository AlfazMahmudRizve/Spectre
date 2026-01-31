import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_WIDTH = 1920;
const TARGET_QUALITY = 80;
const OUTPUT_DIR = './public/images/spectre';
const SOURCE_DIR = './public/images/ghost-cyber/New folder/upscayl_webp_ultramix-balanced-4x_3x'; // Path based on user info, or I can scan for it.

// Helper to find the source dir just in case
const findSourceDir = (startPath) => {
    // Hardcoded logic based on previous context
    if (fs.existsSync(startPath)) return startPath;
    return null;
}

const sourcePath = findSourceDir('E:/Ai Agents/whoisalfaz.me/Web Projects/spectre/public/images/ghost-cyber/New folder/upscayl_webp_ultramix-balanced-4x_3x');

if (!sourcePath) {
    console.error("Source directory not found!");
    process.exit(1);
}

// Ensure output dir exists and is clear (files will be overwritten)
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function processImages() {
    const files = fs.readdirSync(sourcePath)
        .filter(f => f.match(/\.(webp|jpg|png)$/i))
        .sort();

    console.log(`Found ${files.length} images. Processing to ${TARGET_WIDTH}px width...`);

    // Target 120 frames
    const targetCount = 120;

    for (let i = 0; i < targetCount; i++) {
        // Map index
        const sourceIndex = Math.floor((i / targetCount) * files.length);
        const file = files[Math.min(sourceIndex, files.length - 1)];

        const inputPath = path.join(sourcePath, file);
        const outputPath = path.join(OUTPUT_DIR, `${i}.webp`);

        await sharp(inputPath)
            .resize(TARGET_WIDTH) // Resize to 1080p width equivalent roughly
            .webp({ quality: TARGET_QUALITY })
            .toFile(outputPath);

        process.stdout.write(`\rProcessed ${i + 1}/${targetCount}`);
    }
    console.log("\nDone!");
}

processImages();
