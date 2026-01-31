import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const carbonDir = path.join(process.cwd(), 'public/images/spectre-carbon');
const frameCount = 120; // 0 to 119

async function convert() {
    console.log(`Starting conversion for ${frameCount} frames in ${carbonDir}...`);

    for (let i = 0; i < frameCount; i++) {
        const input = path.join(carbonDir, `${i}.jpg`);
        const output = path.join(carbonDir, `${i}.webp`);

        if (fs.existsSync(input)) {
            try {
                await sharp(input)
                    .resize(1920, 1080, { fit: 'inside' }) // Ensure reasonable size
                    .webp({ quality: 80 })
                    .toFile(output);

                // console.log(`Converted ${i}.jpg -> ${i}.webp`);
                if (i % 20 === 0) process.stdout.write('.');
            } catch (err) {
                console.error(`Failed to convert ${i}.jpg:`, err);
            }
        } else {
            console.warn(`Missing file: ${input}`);
        }
    }

    console.log('\nConversion complete.');
}

convert();
