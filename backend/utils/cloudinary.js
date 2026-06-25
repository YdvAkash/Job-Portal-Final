import { v2 as cloudinary } from "cloudinary";

const hasCloudinaryConfig =
  process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET;

if (!hasCloudinaryConfig) {
  console.warn("Cloudinary is not configured. Using fallback uploader.");
}

const cloudinaryClient = hasCloudinaryConfig
  ? cloudinary
  : {
      uploader: {
        upload: async () => ({
          secure_url: "https://via.placeholder.com/300x300?text=No+Image",
        }),
      },
    };

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
}

export default cloudinaryClient;
