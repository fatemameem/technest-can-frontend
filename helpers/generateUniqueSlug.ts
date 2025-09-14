/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(input: string): string {
  return (input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/['".,()/#!?$%^*;:{}=`~[\]\\]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Generates a unique slug for a document in a collection
 */
export async function generateUniqueSlug({ 
  collection, 
  data, 
  req, 
  originalDoc 
}: {
  collection: string;
  data: any;
  req: any;
  originalDoc?: any;
}): Promise<string> {
  if (!data) return '';
  
  const src = (data.slug as string) || (data.title as string) || (originalDoc?.title as string);
  if (!src) return '';
  
  const base = slugify(src);
  let candidate = base;
  let i = 1;
  const currentId = originalDoc?.id;
  
  while (true) {
    const found = await req.payload.find({
      collection,
      where: { slug: { equals: candidate } },
      limit: 1,
      depth: 0,
    });
    
    const exists = found?.docs?.length ? found.docs[0] : null;
    if (!exists || (currentId && exists.id === currentId)) break;
    candidate = `${base}-${i++}`;
  }
  
  return candidate;
}