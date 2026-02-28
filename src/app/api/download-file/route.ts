import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side download API route (Stateless / Vercel-Ready).
 *
 * Flow:
 *   1. Client triggers standard HTML <form> POST with file data.
 *   2. Server receives the POST payload.
 *   3. Server immediately responds with the exact same file buffer,
 *      but forces the `Content-Disposition: attachment` header.
 *   4. The browser intercepts this response as a native system download,
 *      ignoring page navigation and guaranteeing perfectly named files.
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
        const mimeType = file.type || "application/octet-stream";

        const safeName = filename.replace(/[^\w.\-]/g, "_");

        return new Response(arrayBuffer, {
            headers: {
                "Content-Type": mimeType,
                "Content-Disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
                "Content-Length": arrayBuffer.byteLength.toString(),
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });
    } catch (err) {
        console.error("Download API POST error:", err);
        return NextResponse.json(
            { error: "Failed to process file for download" },
            { status: 500 }
        );
    }
}
