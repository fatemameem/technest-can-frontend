import { BlockType } from '@/types';

const WORDS_PER_MINUTE = 200;

function stripMarkdown(input: string): string {
  return (input || '')
    .replace(/`{1,3}[^`]*`{1,3}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(input: string): number {
  if (!input) return 0;
  const normalized = stripMarkdown(input);
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

function extractTextFromBlock(block: { type?: BlockType; props?: Record<string, any> }): string {
  if (!block?.props) return '';
  switch (block.type) {
    case BlockType.LEAD_PARAGRAPH:
      return block.props.text || '';
    case BlockType.RICH_TEXT:
      return block.props.content || '';
    case BlockType.QUOTE:
      return `${block.props.quote || ''} ${block.props.attribution || ''}`;
    case BlockType.CALLOUT:
      return `${block.props.title || ''} ${block.props.content || ''}`;
    case BlockType.CODE_BLOCK:
      return block.props.code || '';
    case BlockType.HERO_MEDIA:
    case BlockType.IMAGE_FIGURE:
    case BlockType.VIDEO_EMBED:
    case BlockType.DIVIDER:
    default:
      return '';
  }
}

export function calculateReadingTime(
  blocks: Array<{ type: BlockType; props: Record<string, any> }> | undefined | null
): number {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return 1;
  }
  const totalWords = blocks.reduce((sum, block) => sum + countWords(extractTextFromBlock(block)), 0);
  if (totalWords === 0) return 1;
  return Math.max(1, Math.round(totalWords / WORDS_PER_MINUTE));
}

export function collectTextFromBlocks(
  blocks: Array<{ type: BlockType; props: Record<string, any> }> | undefined | null
): string {
  if (!Array.isArray(blocks)) return '';
  return blocks.map(block => extractTextFromBlock(block)).filter(Boolean).join(' ').trim();
}
