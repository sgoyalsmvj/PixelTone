import { z } from 'zod';

// Common validation schemas
export const UUIDSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const URLSchema = z.string().url();
export const DateTimeSchema = z.string().datetime();

// Username validation
export const UsernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

// Password validation
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');

// File size validation (in bytes)
export const FileSizeSchema = z.number().int().min(0).max(100 * 1024 * 1024); // 100MB max

// Tag validation
export const TagSchema = z
  .string()
  .min(1, 'Tag cannot be empty')
  .max(50, 'Tag must be at most 50 characters')
  .regex(/^[a-zA-Z0-9\s-_]+$/, 'Tag can only contain letters, numbers, spaces, hyphens, and underscores');

// Color validation (hex colors)
export const HexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format');

// Pagination validation
export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Search query validation
export const SearchQuerySchema = z
  .string()
  .max(200, 'Search query must be at most 200 characters')
  .optional();

// Content validation
export const TitleSchema = z
  .string()
  .min(1, 'Title cannot be empty')
  .max(200, 'Title must be at most 200 characters')
  .trim();

export const DescriptionSchema = z
  .string()
  .max(1000, 'Description must be at most 1000 characters')
  .trim()
  .optional();

export const CommentContentSchema = z
  .string()
  .min(1, 'Comment cannot be empty')
  .max(1000, 'Comment must be at most 1000 characters')
  .trim();

// Creative spec validation
export const CreativeSpecSchema = z
  .string()
  .min(1, 'Creative specification cannot be empty')
  .max(2000, 'Creative specification must be at most 2000 characters')
  .trim();

// Validation helper functions
export function validateEmail(email: string): boolean {
  return EmailSchema.safeParse(email).success;
}

export function validateUsername(username: string): boolean {
  return UsernameSchema.safeParse(username).success;
}

export function validatePassword(password: string): boolean {
  return PasswordSchema.safeParse(password).success;
}

export function validateUUID(id: string): boolean {
  return UUIDSchema.safeParse(id).success;
}

export function validateURL(url: string): boolean {
  return URLSchema.safeParse(url).success;
}

export function validateHexColor(color: string): boolean {
  return HexColorSchema.safeParse(color).success;
}

// Sanitization functions
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export function sanitizeHTML(input: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
}

export function sanitizeFilename(filename: string): string {
  // Remove or replace characters that are not safe for filenames
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

// Custom validation schemas for specific use cases
export const MediaTypeSchema = z.enum(['image', 'video', 'audio']);

export const GenerationTypeSchema = z.enum(['visual', 'audio']);

export const QualitySchema = z.enum(['low', 'medium', 'high']);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const CreationSortBySchema = z.enum(['recent', 'popular', 'trending', 'mostLiked', 'mostRemixed']);

// Validation error formatting
export interface FormattedValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export function formatZodError(error: z.ZodError): FormattedValidationError[] {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
    value: undefined, // ZodError doesn't provide input value in all cases
  }));
}

// Validation middleware helper
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): { success: true; data: T } | { success: false; errors: FormattedValidationError[] } => {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, errors: formatZodError(result.error) };
    }
  };
}

// Async validation helper
export async function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: FormattedValidationError[] }> {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatZodError(error) };
    }
    throw error;
  }
}

// Partial validation for updates
export function createPartialValidator<T>(schema: z.ZodObject<any>) {
  return createValidator(schema.partial());
}

// Array validation helpers
export const NonEmptyArraySchema = <T>(itemSchema: z.ZodSchema<T>) =>
  z.array(itemSchema).min(1, 'Array cannot be empty');

export const UniqueArraySchema = <T>(itemSchema: z.ZodSchema<T>) =>
  z.array(itemSchema).refine(
    (items) => new Set(items).size === items.length,
    'Array items must be unique'
  );

// Custom refinements
export const FutureDateSchema = z.date().refine(
  (date) => date > new Date(),
  'Date must be in the future'
);

export const PastDateSchema = z.date().refine(
  (date) => date < new Date(),
  'Date must be in the past'
);

// File validation
export const ImageFileSchema = z.object({
  type: z.string().refine(
    (type) => type.startsWith('image/'),
    'File must be an image'
  ),
  size: z.number().max(10 * 1024 * 1024, 'Image must be smaller than 10MB'),
});

export const AudioFileSchema = z.object({
  type: z.string().refine(
    (type) => type.startsWith('audio/'),
    'File must be an audio file'
  ),
  size: z.number().max(50 * 1024 * 1024, 'Audio file must be smaller than 50MB'),
});

export const VideoFileSchema = z.object({
  type: z.string().refine(
    (type) => type.startsWith('video/'),
    'File must be a video file'
  ),
  size: z.number().max(100 * 1024 * 1024, 'Video file must be smaller than 100MB'),
});