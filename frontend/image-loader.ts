// Custom image loader: Cloudinary images are resized/compressed by Cloudinary
// (f_auto,q_auto). Any other image is served as-is.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const marker = "/image/upload/";
  if (src.includes("res.cloudinary.com") && src.includes(marker)) {
    const [base, rest] = src.split(marker);
    const t = `f_auto,q_${quality || "auto"},c_limit,w_${width}`;
    return `${base}${marker}${t}/${rest}`;
  }
  return src;
}
