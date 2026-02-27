/**
 * Robust file download utility for ConvertHub.
 *
 * Uses a server-side API route (/api/download-file) to guarantee
 * correct filenames via the Content-Disposition HTTP header.
 *
 * This is the GOLD STANDARD for download naming — ALL browsers
 * respect Content-Disposition without exception.
 */

/**
 * Download from raw data (Uint8Array from pdf-lib, string, etc.)
 */
export async function downloadFile(
    data: any,
    filename: string,
    mimeType: string
): Promise<void> {
    const blob = new Blob([data], { type: mimeType });
    await triggerServerDownload(blob, filename);
}

/**
 * Download from an existing Blob object.
 */
export async function downloadBlob(
    blob: Blob,
    filename: string
): Promise<void> {
    await triggerServerDownload(blob, filename);
}

/**
 * Download from a data URL (e.g. base64 image).
 */
export async function downloadDataUrl(
    dataUrl: string,
    filename: string
): Promise<void> {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await triggerServerDownload(blob, filename);
}

/**
 * Core download mechanism using the server-side API route.
 *
 * 1. POSTs blob to /api/download-file → gets key
 * 2. Uses <a download> pointing to GET /api/download-file?key=xxx
 * 3. Server responds with Content-Disposition header
 * 4. Browser downloads with correct filename ✅
 */
async function triggerServerDownload(
    blob: Blob,
    filename: string
): Promise<void> {
    // Step 1: Upload blob to server temp storage
    const formData = new FormData();
    formData.append("file", blob, filename);
    formData.append("filename", filename);

    const response = await fetch("/api/download-file", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to prepare download");
    }

    const { key } = await response.json();

    // Step 2: Use anchor element pointing at the API GET URL
    // The server will respond with Content-Disposition: attachment header
    const downloadUrl = `/api/download-file?key=${key}`;

    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = downloadUrl;
    anchor.download = filename; // Belt + suspenders: also set download attr
    document.body.appendChild(anchor);
    anchor.click();

    // Cleanup anchor element after a delay
    setTimeout(() => {
        try {
            document.body.removeChild(anchor);
        } catch {
            // Ignore if already removed
        }
    }, 5000);
}
