import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `prf/${folder}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      )
      .end(buffer);
  });
}

export async function deleteFromCloudinary(url: string): Promise<void> {
  try {
    // Extract public_id from Cloudinary URL
    const parts = url.split("/upload/");
    if (parts.length < 2) return;
    const pathWithExt = parts[1].replace(/^v\d+\//, "");
    const publicId = pathWithExt.replace(/\.[^.]+$/, "");
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Silently fail - file may already be deleted
  }
}
