import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Clean filename and make unique
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Ensure directory exists (node 10+ handles recursive mkdir)
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await writeFile(path.join(uploadDir, filename), buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}
