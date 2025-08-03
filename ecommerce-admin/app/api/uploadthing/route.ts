import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: '854841872594433',
  api_secret: 'r_YkZUG0TiZv2xsWl0X3YnUC7jE',
  secure: true
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file, files } = body;

    // Handle single file upload (backward compatibility)
    if (file && !files) {
      const uploadResult = await cloudinary.uploader.upload(file, {
        folder: "abaya/images",
        use_filename: false,
        unique_filename: true,
        overwrite: true,
        resource_type: "auto",
        upload_preset: "ABAYA"
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      });
    }

    // Handle multiple files upload
    if (files && Array.isArray(files)) {
      const uploadResults = await Promise.all(files.map(async (file: string) => {
        const uploadResult = await cloudinary.uploader.upload(file, {
          folder: "abaya/images",
          use_filename: false,
          unique_filename: true,
          overwrite: true,
          resource_type: "auto",
          upload_preset: "ABAYA"
        });

        return {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id
        };
      }));

      return NextResponse.json({
        success: true,
        images: uploadResults
      });
    }

    return NextResponse.json(
      { error: "Either 'file' or 'files' is required" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
} 