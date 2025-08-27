"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioFileSchema = exports.VideoFileSchema = exports.ImageFileSchema = exports.AudioFormats = exports.VideoFormats = exports.ImageFormats = exports.ExportResultSchema = exports.ExportFormatSchema = exports.MediaFileSchema = exports.MediaDimensionsSchema = void 0;
const zod_1 = require("zod");
// Media Dimensions Schema
exports.MediaDimensionsSchema = zod_1.z.object({
    width: zod_1.z.number().int().min(1),
    height: zod_1.z.number().int().min(1),
});
// Media File Schema
exports.MediaFileSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['image', 'video', 'audio']),
    url: zod_1.z.string().url(),
    format: zod_1.z.string().min(1), // e.g., 'png', 'mp4', 'wav'
    size: zod_1.z.number().int().min(0), // file size in bytes
    dimensions: exports.MediaDimensionsSchema.optional(), // for images and videos
    duration: zod_1.z.number().min(0).optional(), // for videos and audio in seconds
    createdAt: zod_1.z.date(),
});
// Export Format Schema
exports.ExportFormatSchema = zod_1.z.object({
    type: zod_1.z.enum(['image', 'video', 'audio']),
    format: zod_1.z.string().min(1), // 'png', 'gif', 'mp4', 'mp3', 'wav'
    quality: zod_1.z.enum(['low', 'medium', 'high']).default('medium'),
    dimensions: exports.MediaDimensionsSchema.optional(),
});
// Export Result Schema
exports.ExportResultSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    originalMediaId: zod_1.z.string().uuid(),
    format: exports.ExportFormatSchema,
    url: zod_1.z.string().url(),
    size: zod_1.z.number().int().min(0),
    processingTime: zod_1.z.number().min(0), // in milliseconds
    createdAt: zod_1.z.date(),
});
// Validation helpers for file types
exports.ImageFormats = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
exports.VideoFormats = ['mp4', 'webm', 'mov'];
exports.AudioFormats = ['mp3', 'wav', 'ogg', 'aac'];
// File validation schemas
exports.ImageFileSchema = exports.MediaFileSchema.extend({
    type: zod_1.z.literal('image'),
    format: zod_1.z.enum(exports.ImageFormats),
    dimensions: exports.MediaDimensionsSchema,
});
exports.VideoFileSchema = exports.MediaFileSchema.extend({
    type: zod_1.z.literal('video'),
    format: zod_1.z.enum(exports.VideoFormats),
    dimensions: exports.MediaDimensionsSchema,
    duration: zod_1.z.number().min(0),
});
exports.AudioFileSchema = exports.MediaFileSchema.extend({
    type: zod_1.z.literal('audio'),
    format: zod_1.z.enum(exports.AudioFormats),
    duration: zod_1.z.number().min(0),
});
