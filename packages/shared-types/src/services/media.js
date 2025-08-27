"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThumbnailOptionsSchema = exports.OptimizationOptionsSchema = exports.UploadResultSchema = exports.UploadRequestSchema = void 0;
const zod_1 = require("zod");
// Upload Request Schema
exports.UploadRequestSchema = zod_1.z.object({
    file: zod_1.z.any(), // File object in browser, Buffer in Node.js
    type: zod_1.z.enum(['image', 'video', 'audio']),
    metadata: zod_1.z.object({
        originalName: zod_1.z.string(),
        mimeType: zod_1.z.string(),
        size: zod_1.z.number().int().min(0),
    }),
});
// Upload Result Schema
exports.UploadResultSchema = zod_1.z.object({
    mediaFile: zod_1.z.any(), // MediaFile
    uploadTime: zod_1.z.number().min(0), // in milliseconds
});
// Optimization Options Schema
exports.OptimizationOptionsSchema = zod_1.z.object({
    quality: zod_1.z.number().min(0).max(100).default(80),
    maxWidth: zod_1.z.number().int().min(1).optional(),
    maxHeight: zod_1.z.number().int().min(1).optional(),
    format: zod_1.z.string().optional(), // target format for conversion
    progressive: zod_1.z.boolean().default(true), // for JPEG images
    stripMetadata: zod_1.z.boolean().default(true),
});
// Thumbnail Options Schema
exports.ThumbnailOptionsSchema = zod_1.z.object({
    width: zod_1.z.number().int().min(1).default(300),
    height: zod_1.z.number().int().min(1).default(300),
    crop: zod_1.z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
    quality: zod_1.z.number().min(0).max(100).default(80),
});
