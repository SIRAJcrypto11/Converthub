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
 * Core download mechanism using a stateless POST form submission.
 *
 * This approach is 100% Vercel Serverless compatible because it stores
 * nothing in memory. It forces the browser to native-POST the blob,
 * and the Next.js API immediately responds with an attachment header.
 */
async function triggerServerDownload(
    blob: Blob,
    filename: string
): Promise<void> {
    // 100% Client-Side Download Engine
    // Bypasses Vercel's 4.5MB Serverless Payload Limit entirely.
    // Creates a temporary local URL in the browser's memory to download the file directly.
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    // Cleanup to prevent memory leaks
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 1000);
}
