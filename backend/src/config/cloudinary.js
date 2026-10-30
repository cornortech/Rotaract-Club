import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_FOLDER = "rotaract-butwal-synergy";

export const cloudinaryReady = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadBuffer(buffer) {
  configure();
  const res = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: CLOUDINARY_FOLDER, resource_type: "image", overwrite: false },
      (err, result) => (err || !result ? reject(err || new Error("Upload failed")) : resolve(result))
    );
    stream.end(buffer);
  });
  return { url: res.secure_url, publicId: res.public_id };
}

export async function uploadFromUrl(url) {
  configure();
  const res = await cloudinary.uploader.upload(url, { folder: CLOUDINARY_FOLDER, resource_type: "image" });
  return { url: res.secure_url, publicId: res.public_id };
}

/** Delete an image we uploaded earlier (ignored if it fails). */
export async function destroyImage(publicId) {
  if (!publicId || !cloudinaryReady() || !publicId.startsWith(CLOUDINARY_FOLDER)) return;
  try {
    configure();
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (e) {
    console.warn("[cloudinary] could not delete", publicId, e.message);
  }
}

/** Detect the real image type from the first bytes (don't trust the file name). */
export function sniffImage(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  const g = buf.subarray(0, 6).toString("ascii");
  if (g === "GIF87a" || g === "GIF89a") return "gif";
  const f = buf.subarray(4, 12).toString("ascii");
  if (f.startsWith("ftypavif") || f.startsWith("ftypheic")) return "avif";
  return null;
}
