"use client";

export class ApiError extends Error {
  errors?: Record<string, string>;
  status: number;
  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function api<T = any>(url: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: opts.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
    credentials: "same-origin",
  });
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) {
    // Full reload on purpose: the session has expired.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/adminlogin";
    throw new ApiError("Please log in again", 401);
  }
  if (!res.ok || json.ok === false) throw new ApiError(json.error || "Something went wrong", res.status, json.errors);
  return json.data as T;
}

/** Shrink big photos in the browser before uploading (faster, fits the 8 MB limit). */
async function compress(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 1024 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file);
    const max = 2400;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export function uploadImage(file: File, onProgress?: (p: number) => void): Promise<{ url: string; publicId: string }> {
  return new Promise(async (resolve, reject) => {
    const blob = await compress(file);
    if (blob.size > 4 * 1024 * 1024) return reject(new Error("Image is too large (max 4 MB). Please use a smaller photo."));
    const fd = new FormData();
    fd.append("file", blob, file.name.replace(/\.[^.]+$/, "") + (blob === file ? "" : ".webp"));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let json: any = {};
      try {
        json = JSON.parse(xhr.responseText);
      } catch {}
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      if (xhr.status === 401) window.location.href = "/adminlogin";
      if (xhr.status >= 200 && xhr.status < 300 && json.ok) resolve(json.data);
      else reject(new Error(json.error || "Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(fd);
  });
}
