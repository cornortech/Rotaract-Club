import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const ImageSchema = new Schema({ url: { type: String, default: "" }, publicId: { type: String, default: "" } }, { _id: false });

/* Site settings: one document holds all editable website text */
const SettingsSchema = new Schema({ _id: String, data: { type: Schema.Types.Mixed, default: {} } }, { timestamps: true, minimize: false });

const HeroSlideSchema = new Schema(
  {
    image: { type: ImageSchema, required: true },
    title: { type: String, default: "" },
    caption: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: "Event" },
    date: { type: Date, default: null },
    time: { type: String, default: "" },
    location: { type: String, default: "" },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: ImageSchema, default: () => ({}) },
    images: { type: [ImageSchema], default: [] },
    collaborators: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    group: { type: String, enum: ["board", "leader"], default: "board" },
    year: { type: String, default: "" },
    photo: { type: ImageSchema, default: () => ({}) },
    bio: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GallerySchema = new Schema(
  {
    image: { type: ImageSchema, required: true },
    caption: { type: String, default: "" },
    album: { type: String, default: "General" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PartnerSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: ImageSchema, default: () => ({}) },
    url: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "Admin" },
    passwordHash: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/* Rate limiting: documents delete themselves when expired */
const RateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const m = (name, schema) => models[name] || model(name, schema);

export const Settings = m("Settings", SettingsSchema);
export const HeroSlide = m("HeroSlide", HeroSlideSchema);
export const Event = m("Event", EventSchema);
export const TeamMember = m("TeamMember", TeamSchema);
export const GalleryItem = m("GalleryItem", GallerySchema);
export const Partner = m("Partner", PartnerSchema);
export const Message = m("Message", MessageSchema);
export const Admin = m("Admin", AdminSchema);
export const RateLimit = m("RateLimit", RateLimitSchema);
