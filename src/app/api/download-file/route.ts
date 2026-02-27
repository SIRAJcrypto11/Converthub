import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side download API route for ConvertHub.
 *
 * This route guarantees correct filenames by using the
 * Content-Disposition HTTP header — the web standard that
 * ALL browsers respect without exception.
 *
 * Flow:
 *   1. Client POSTs file blob + desired filename
 *   2. Server stores temporarily in memory Map
 *   3. Client navigates to GET ?key=xxx
 *   4. Server responds with Content-Disposition: attachment; filename="xxx"
 *   5. Browser downloads with correct filename ✅
 */

// In-memory temporary storage (works for dev & single-instance serverless)
const tempStorage = new Map<
    string,
    { buffer: Buffer; filename: string; mimeType: string; createdAt: number }
>();

// Auto-cleanup old entries every 30 seconds
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        const entries = Array.from(tempStorage.entries());
        for (const [key, entry] of entries) {
            if (now - entry.createdAt > 120000) {
                // 2 minutes TTL
                tempStorage.delete(key);
            }
        }
    }, 30000);
}

/**
 * POST: Receive file blob and store temporarily.
 * Returns { key } that can be used with GET to download.
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const filename = (formData.get("filename") as string) || "download";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate a unique key
        const key = crypto.randomUUID();

        // Store in memory
        tempStorage.set(key, {
            buffer,
            filename,
            mimeType: file.type || "application/octet-stream",
            createdAt: Date.now(),
        });

        return NextResponse.json({ key });
    } catch (err) {
        console.error("Download API POST error:", err);
        return NextResponse.json(
            { error: "Failed to process file" },
            { status: 500 }
        );
    }
}

/**
 * GET: Serve stored file with Content-Disposition header.
 * This forces the browser to download with the correct filename.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json(
                { error: "No key provided" },
                { status: 400 }
            );
        }

        const entry = tempStorage.get(key);
        if (!entry) {
            return NextResponse.json(
                { error: "File not found or expired" },
                { status: 404 }
            );
        }

        // Delete after serving (one-time download)
        tempStorage.delete(key);

        // Return file with Content-Disposition header
        // This is the GOLD STANDARD for controlling download filenames
        // Sanitize filename for Content-Disposition header
        const safeName = entry.filename.replace(/[^\w.\-]/g, "_");

        return new Response(new Uint8Array(entry.buffer), {
            headers: {
                "Content-Type": entry.mimeType,
                "Content-Disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(entry.filename)}`,
                "Content-Length": entry.buffer.length.toString(),
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });
    } catch (err) {
        console.error("Download API GET error:", err);
        return NextResponse.json(
            { error: "Failed to serve file" },
            { status: 500 }
        );
    }
}
