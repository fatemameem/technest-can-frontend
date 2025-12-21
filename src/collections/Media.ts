// src/collections/Media.ts
import 'server-only'
import type { CollectionConfig } from 'payload';
import { v2 as cloudinary } from 'cloudinary';
import { google } from 'googleapis';
import { compressImage } from '@/lib/compressImage';
import { Readable, PassThrough } from 'stream';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper to convert an incoming file stream to Buffer (for Sharp)
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []; // Changed from Buffer[] to Uint8Array[]
    stream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? new Uint8Array(chunk) : new Uint8Array(Buffer.from(chunk))));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

// //cloudinary- fix service account storage quota issue

const getAuthenticatedDriveClient = () => {
  try {
    // Get the private key from env variables
    let privateKey = process.env.GOOGLE_SA_KEY || '';
    privateKey = privateKey.split(String.raw`\n`).join('\n');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SA_EMAIL,
        private_key: privateKey,
        project_id: process.env.GOOGLE_PROJECT_ID,
      },
      // //cloudinary- update scopes to include shared drives access
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.appdata'
      ]
    });
    
    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Google Drive authentication error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to initialize Google Drive client: ${errorMessage}`);
  }
};

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
    afterDelete: [
      async ({ doc }) => {
        // Clean up Cloudinary file
        if (doc.cloudinary?.publicId) {
          try {
            await cloudinary.uploader.destroy(doc.cloudinary.publicId);
            // console.log(`✅ Deleted Cloudinary file: ${doc.cloudinary.publicId}`);
          } catch (error) {
            console.error(`❌ Error deleting Cloudinary file ${doc.cloudinary.publicId}:`, error);
          }
        }

        // Clean up Google Drive file
        if (doc.drive?.fileId && doc.drive.fileId !== 'skipped' && doc.drive.fileId !== 'error') {
          try {
            const drive = getAuthenticatedDriveClient();
            await drive.files.delete({
              fileId: doc.drive.fileId,
              supportsAllDrives: true,
            });
            console.log(`✅ Deleted Google Drive file: ${doc.drive.fileId}`);
          } catch (error) {
            console.error(`❌ Error deleting Google Drive file ${doc.drive.fileId}:`, error);
          }
        }
      },
    ],
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

        /* A. Upload original to Google Drive */
        try {
          // Skip Google Drive upload if disabled
          if (process.env.SKIP_GDRIVE_UPLOAD === 'true') {
            console.log('Skipping Google Drive upload (disabled by config)');
            data.drive = { 
              fileId: 'skipped',
              viewUrl: '',
              downloadUrl: ''
            };
          } else {
            const drive = getAuthenticatedDriveClient();
            
            // //cloudinary- use a shared drive instead of service account storage
            const driveRes = await drive.files.create({
              // //cloudinary- specify supportsAllDrives for shared drive access
              supportsAllDrives: true,
              
              requestBody: {
                name: filename,
                mimeType: mimetype,
                // //cloudinary- use shared drive ID instead of folder ID
                ...(process.env.GDRIVE_FOLDER_ID ? { 
                  parents: [process.env.GDRIVE_FOLDER_ID || 'root'],
                  driveId: process.env.GDRIVE_FOLDER_ID 
                } : { 
                  parents: [process.env.GDRIVE_FOLDER_ID || 'root']
                })
              },
              media: {
                mimeType: mimetype,
                body: new PassThrough().end(fileBuffer),
              },
            });
            
            const fileId = driveRes.data.id!;

            // Make the file publicly readable
            await drive.permissions.create({
              fileId,
              // //cloudinary- add support for shared drives
              supportsAllDrives: true,
              requestBody: { type: 'anyone', role: 'reader' },
            });

            data.drive = {
              fileId,
              viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
              downloadUrl: `https://drive.google.com/uc?id=${fileId}`,
            };
          }
        } catch (driveError) {
          console.error('Error uploading to Google Drive:', driveError);
          // Don't throw error, just record it and continue with Cloudinary upload
          data.drive = {
            fileId: 'error',
            viewUrl: '',
            downloadUrl: '',
            error: driveError instanceof Error ? driveError.message : String(driveError)
          };
        }

        /* B. Compress for Cloudinary */
        try {
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
        } catch (cloudinaryError) {
          console.error('Error processing/uploading to Cloudinary:', cloudinaryError);
          throw new Error('Failed to upload file to Cloudinary');
        }

        return data;
      },
    ],
  },
};
