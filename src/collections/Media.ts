// src/collections/Media.ts
import type { CollectionConfig } from 'payload';
import { v2 as cloudinary } from 'cloudinary';
import { google } from 'googleapis';
import { compressImage } from '@/lib/compressImage';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Configure Google Drive client
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    private_key: process.env.GOOGLE_CLIENT_SECRET!.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

// Helper to convert an incoming file stream to Buffer (for Sharp)
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []; // Changed from Buffer[] to Uint8Array[]
    stream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? new Uint8Array(chunk) : new Uint8Array(Buffer.from(chunk))));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true, // Payload will parse multipart form data; we handle remote storage
  admin: { useAsTitle: 'alt' },
  fields: [
    { name: 'alt', type: 'text' },
    // store Cloudinary metadata
    {
      name: 'cloudinary',
      type: 'group',
      fields: [
        { name: 'publicId', type: 'text' },
        { name: 'secureUrl', type: 'text' },
        { name: 'width', type: 'number' },
        { name: 'height', type: 'number' },
        { name: 'bytes', type: 'number' },
        { name: 'quality', type: 'number' },
        { name: 'format', type: 'text' },
      ],
    },
    // store Google Drive metadata
    {
      name: 'drive',
      type: 'group',
      fields: [
        { name: 'fileId', type: 'text' },
        { name: 'viewUrl', type: 'text' },
        { name: 'downloadUrl', type: 'text' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        // Check if an upload is present
        const uploadedFile: any = req.file || null;
        if (!uploadedFile) return data;

        // Convert incoming file to Buffer (for compression)
        const fileBuffer: Buffer = uploadedFile.data
          ? uploadedFile.data
          : await streamToBuffer(uploadedFile.stream);

        const filename = uploadedFile.name;
        const mimetype = uploadedFile.mimetype;

        /* A. Upload original to Google Drive */
        const driveRes = await drive.files.create({
          requestBody: {
            name: filename,
            mimeType: mimetype,
            parents: [process.env.GDRIVE_FOLDER_ID!],
          },
          media: { mimeType: mimetype, body: fileBuffer },
        });
        const fileId = driveRes.data.id!;

        // Make the file publicly readable
        await drive.permissions.create({
          fileId,
          requestBody: { type: 'anyone', role: 'reader' },
        });

        data.drive = {
          fileId,
          viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
          downloadUrl: `https://drive.google.com/uc?id=${fileId}`,
        };

        /* B. Compress for Cloudinary */
        const { buffer: compressed, usedQuality } = await compressImage(fileBuffer, {
          targetKB: Number(process.env.IMG_TARGET_KB || 150),
          maxWidth: Number(process.env.IMG_MAX_W || 1600),
          maxHeight: Number(process.env.IMG_MAX_H || 1600),
          format: (process.env.IMG_FORMAT as any) || 'webp',
        });

        /* C. Upload to Cloudinary */
        const uploadResult: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: process.env.CLOUDINARY_FOLDER || 'payload',
              resource_type: 'image',
              format: (process.env.IMG_FORMAT as any) || 'webp',
            },
            (error, result) => (error ? reject(error) : resolve(result)),
          );
          stream.end(compressed);
        });

        data.cloudinary = {
          publicId: uploadResult.public_id,
          secureUrl: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
          bytes: compressed.length,
          quality: usedQuality,
          format: (process.env.IMG_FORMAT as any) || 'webp',
        };

        return data;
      },
    ],
  },
};
