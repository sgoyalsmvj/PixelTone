"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoFileSchema = exports.AudioFileSchema = exports.ImageFileSchema = exports.PastDateSchema = exports.FutureDateSchema = exports.UniqueArraySchema = exports.NonEmptyArraySchema = exports.CreationSortBySchema = exports.SortOrderSchema = exports.QualitySchema = exports.GenerationTypeSchema = exports.MediaTypeSchema = exports.CreativeSpecSchema = exports.CommentContentSchema = exports.DescriptionSchema = exports.TitleSchema = exports.SearchQuerySchema = exports.PaginationSchema = exports.HexColorSchema = exports.TagSchema = exports.FileSizeSchema = exports.PasswordSchema = exports.UsernameSchema = exports.DateTimeSchema = exports.URLSchema = exports.EmailSchema = exports.UUIDSchema = void 0;
exports.validateEmail = validateEmail;
exports.validateUsername = validateUsername;
exports.validatePassword = validatePassword;
exports.validateUUID = validateUUID;
exports.validateURL = validateURL;
exports.validateHexColor = validateHexColor;
exports.sanitizeString = sanitizeString;
exports.sanitizeHTML = sanitizeHTML;
exports.sanitizeFilename = sanitizeFilename;
exports.formatZodError = formatZodError;
exports.createValidator = createValidator;
exports.validateAsync = validateAsync;
exports.createPartialValidator = createPartialValidator;
const zod_1 = require("zod");
// Common validation schemas
exports.UUIDSchema = zod_1.z.string().uuid();
exports.EmailSchema = zod_1.z.string().email();
exports.URLSchema = zod_1.z.string().url();
exports.DateTimeSchema = zod_1.z.string().datetime();
// Username validation
exports.UsernameSchema = zod_1.z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');
// Password validation
exports.PasswordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');
// File size validation (in bytes)
exports.FileSizeSchema = zod_1.z.number().int().min(0).max(100 * 1024 * 1024); // 100MB max
// Tag validation
exports.TagSchema = zod_1.z
    .string()
    .min(1, 'Tag cannot be empty')
    .max(50, 'Tag must be at most 50 characters')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Tag can only contain letters, numbers, spaces, hyphens, and underscores');
// Color validation (hex colors)
exports.HexColorSchema = zod_1.z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format');
// Pagination validation
exports.PaginationSchema = zod_1.z.object({
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    offset: zod_1.z.number().int().min(0).default(0),
});
// Search query validation
exports.SearchQuerySchema = zod_1.z
    .string()
    .max(200, 'Search query must be at most 200 characters')
    .optional();
// Content validation
exports.TitleSchema = zod_1.z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be at most 200 characters')
    .trim();
exports.DescriptionSchema = zod_1.z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .trim()
    .optional();
exports.CommentContentSchema = zod_1.z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be at most 1000 characters')
    .trim();
// Creative spec validation
exports.CreativeSpecSchema = zod_1.z
    .string()
    .min(1, 'Creative specification cannot be empty')
    .max(2000, 'Creative specification must be at most 2000 characters')
    .trim();
// Validation helper functions
function validateEmail(email) {
    return exports.EmailSchema.safeParse(email).success;
}
function validateUsername(username) {
    return exports.UsernameSchema.safeParse(username).success;
}
function validatePassword(password) {
    return exports.PasswordSchema.safeParse(password).success;
}
function validateUUID(id) {
    return exports.UUIDSchema.safeParse(id).success;
}
function validateURL(url) {
    return exports.URLSchema.safeParse(url).success;
}
function validateHexColor(color) {
    return exports.HexColorSchema.safeParse(color).success;
}
// Sanitization functions
function sanitizeString(input) {
    return input.trim().replace(/\s+/g, ' ');
}
function sanitizeHTML(input) {
    // Basic HTML sanitization - remove script tags and dangerous attributes
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '');
}
function sanitizeFilename(filename) {
    // Remove or replace characters that are not safe for filenames
    return filename
        .replace(/[<>:"/\\|?*]/g, '_')
        .replace(/\s+/g, '_')
        .toLowerCase();
}
// Custom validation schemas for specific use cases
exports.MediaTypeSchema = zod_1.z.enum(['image', 'video', 'audio']);
exports.GenerationTypeSchema = zod_1.z.enum(['visual', 'audio']);
exports.QualitySchema = zod_1.z.enum(['low', 'medium', 'high']);
exports.SortOrderSchema = zod_1.z.enum(['asc', 'desc']);
exports.CreationSortBySchema = zod_1.z.enum(['recent', 'popular', 'trending', 'mostLiked', 'mostRemixed']);
function formatZodError(error) {
    return error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
        value: undefined, // ZodError doesn't provide input value in all cases
    }));
}
// Validation middleware helper
function createValidator(schema) {
    return (data) => {
        const result = schema.safeParse(data);
        if (result.success) {
            return { success: true, data: result.data };
        }
        else {
            return { success: false, errors: formatZodError(result.error) };
        }
    };
}
// Async validation helper
async function validateAsync(schema, data) {
    try {
        const validatedData = await schema.parseAsync(data);
        return { success: true, data: validatedData };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return { success: false, errors: formatZodError(error) };
        }
        throw error;
    }
}
// Partial validation for updates
function createPartialValidator(schema) {
    return createValidator(schema.partial());
}
// Array validation helpers
const NonEmptyArraySchema = (itemSchema) => zod_1.z.array(itemSchema).min(1, 'Array cannot be empty');
exports.NonEmptyArraySchema = NonEmptyArraySchema;
const UniqueArraySchema = (itemSchema) => zod_1.z.array(itemSchema).refine((items) => new Set(items).size === items.length, 'Array items must be unique');
exports.UniqueArraySchema = UniqueArraySchema;
// Custom refinements
exports.FutureDateSchema = zod_1.z.date().refine((date) => date > new Date(), 'Date must be in the future');
exports.PastDateSchema = zod_1.z.date().refine((date) => date < new Date(), 'Date must be in the past');
// File validation
exports.ImageFileSchema = zod_1.z.object({
    type: zod_1.z.string().refine((type) => type.startsWith('image/'), 'File must be an image'),
    size: zod_1.z.number().max(10 * 1024 * 1024, 'Image must be smaller than 10MB'),
});
exports.AudioFileSchema = zod_1.z.object({
    type: zod_1.z.string().refine((type) => type.startsWith('audio/'), 'File must be an audio file'),
    size: zod_1.z.number().max(50 * 1024 * 1024, 'Audio file must be smaller than 50MB'),
});
exports.VideoFileSchema = zod_1.z.object({
    type: zod_1.z.string().refine((type) => type.startsWith('video/'), 'File must be a video file'),
    size: zod_1.z.number().max(100 * 1024 * 1024, 'Video file must be smaller than 100MB'),
});
