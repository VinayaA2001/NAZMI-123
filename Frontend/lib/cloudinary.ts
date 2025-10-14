// lib/cloudinary.ts
// Do NOT add "use client" here.
import { v2 as cloudinary } from "cloudinary";

function requireEnv(name: keyof NodeJS.ProcessEnv): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

cloudinary.config({
  cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: requireEnv("CLOUDINARY_API_KEY"),
  api_secret: requireEnv("CLOUDINARY_API_SECRET"),
  secure: true,
});

export default cloudinary;
