#!/usr/bin/env tsx
/**
 * Manual Media Cleanup Script
 * 
 * This script finds and deletes orphaned media files from the database
 * and cloud storage (Cloudinary + Google Drive).
 * 
 * Usage:
 *   npx tsx scripts/cleanup-orphaned-media.ts [--dry-run]
 * 
 * Options:
 *   --dry-run    Show what would be deleted without actually deleting
 */

import 'server-only';
import { getPayload } from 'payload';
import configPromise from '../src/payload.config';
import { findOrphanedMedia, deleteOrphanedMedia } from '../helpers/cleanupOrphanedMedia';

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  console.log('🚀 Starting media cleanup script...\n');
  
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No files will be deleted\n');
  }

  try {
    // Initialize Payload
    console.log('📦 Initializing Payload...');
    const payload = await getPayload({ config: configPromise });
    console.log('✅ Payload initialized\n');

    // Find orphaned media
    console.log('🔍 Searching for orphaned media files...');
    const orphanedIds = await findOrphanedMedia(payload);
    
    console.log(`\n📊 Results:`);
    console.log(`   Found ${orphanedIds.length} orphaned media files\n`);

    if (orphanedIds.length === 0) {
      console.log('✨ No orphaned media found. Your storage is clean!\n');
      process.exit(0);
    }

    // Show details
    console.log('📋 Orphaned Media IDs:');
    orphanedIds.forEach((id, index) => {
      console.log(`   ${index + 1}. ${id}`);
    });
    console.log('');

    if (isDryRun) {
      console.log('⚠️  DRY RUN: These files would be deleted in a real run.\n');
      console.log('💡 To actually delete, run without --dry-run flag\n');
      process.exit(0);
    }

    // Confirm deletion
    console.log('⚠️  WARNING: This will permanently delete these files from:');
    console.log('   • MongoDB (media collection)');
    console.log('   • Cloudinary');
    console.log('   • Google Drive\n');
    
    // In a real terminal environment, you'd want to use readline for confirmation
    // For now, we'll just delete (since this is meant to be run manually)
    console.log('🗑️  Deleting orphaned media...\n');
    
    const { deleted, errors } = await deleteOrphanedMedia(payload, orphanedIds);
    
    console.log(`\n✅ Cleanup Complete!`);
    console.log(`   Successfully deleted: ${deleted} files`);
    
    if (errors > 0) {
      console.log(`   ❌ Errors: ${errors} files`);
      console.log(`   Check the logs above for error details\n`);
      process.exit(1);
    } else {
      console.log(`   No errors encountered\n`);
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Fatal Error:', error);
    process.exit(1);
  }
}

// Run the script
main();
