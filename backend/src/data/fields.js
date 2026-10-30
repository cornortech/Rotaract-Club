// Field definitions shared by the admin forms (client) and validation (server).
import { BOARD_ROLES, EVENT_CATEGORIES } from "./defaults.js";
export const SETTINGS_SECTIONS = [
    {
        key: "general",
        title: "General & branding",
        description: "Club name, logo and the short lines used across the website.",
        fields: [
            { name: "siteName", label: "Club name", type: "text", required: true, max: 120 },
            { name: "shortName", label: "Short name", type: "text", max: 60, help: "Used on small screens and the browser tab." },
            { name: "logo", label: "Logo", type: "image", help: "Square or wide PNG with transparent background works best." },
            { name: "district", label: "District line", type: "text", max: 120 },
            { name: "motto", label: "Motto", type: "text", max: 80 },
            { name: "tagline", label: "Tagline", type: "textarea", max: 300, full: true },
            { name: "footerText", label: "Footer text", type: "textarea", max: 300, full: true },
        ],
    },
    {
        key: "home",
        title: "Home page",
        description: "The first thing visitors see, plus the closing call-to-action.",
        fields: [
            { name: "heroEyebrow", label: "Small line above the title", type: "text", max: 100 },
            { name: "heroTitle", label: "Title (first part)", type: "text", max: 80 },
            { name: "heroHighlight", label: "Title (highlighted part)", type: "text", max: 80 },
            { name: "heroImage", label: "Main image (used when there are no hero slides)", type: "image" },
            { name: "heroText", label: "Intro text", type: "textarea", max: 400, full: true },
            { name: "heroPrimaryLabel", label: "Main button text", type: "text", max: 40 },
            { name: "heroPrimaryLink", label: "Main button link", type: "link", max: 300, placeholder: "/about" },
            { name: "heroSecondaryLabel", label: "Second button text", type: "text", max: 40 },
            { name: "heroSecondaryLink", label: "Second button link", type: "link", max: 300, placeholder: "/events" },
            { name: "ctaTitle", label: "Closing banner title", type: "text", max: 120 },
            { name: "ctaText", label: "Closing banner text", type: "textarea", max: 300 },
        ],
    },
    {
        key: "about",
        title: "About, mission & vision",
        description: "Who you are, official club details and your numbers.",
        fields: [
            { name: "aboutTitle", label: "About heading", type: "text", max: 120 },
            { name: "aboutImage", label: "About image", type: "image" },
            { name: "aboutIntro", label: "About text", type: "longtext", max: 3000, full: true },
            { name: "mission", label: "Mission", type: "textarea", max: 800 },
            { name: "vision", label: "Vision", type: "textarea", max: 800 },
            { name: "officialInfo", label: "Official club information", type: "pairs", full: true, help: "e.g. Club ID → 215519" },
            { name: "stats", label: "Numbers (Years of Service, Members, Projects…)", type: "pairs", full: true, help: "Leave a value empty to hide that number. Example value: 120+" },
            { name: "pillars", label: "What we do (pillars)", type: "cards", full: true },
        ],
    },
    {
        key: "president",
        title: "President’s message",
        description: "Shown on the home and about pages.",
        fields: [
            { name: "president.name", label: "Name", type: "text", max: 80 },
            { name: "president.role", label: "Role", type: "text", max: 60 },
            { name: "president.year", label: "Rotary year", type: "text", max: 40, placeholder: "RY 2026–27" },
            { name: "president.photo", label: "Photo", type: "image" },
            { name: "president.greeting", label: "Greeting", type: "text", max: 200, full: true },
            { name: "president.message", label: "Message", type: "longtext", max: 5000, full: true, help: "Leave an empty line between paragraphs." },
            { name: "president.signoff", label: "Sign-off line", type: "text", max: 200, full: true },
        ],
    },
    {
        key: "theme",
        title: "Presidential theme",
        description: "District and Rotary International themes for the year.",
        fields: [
            { name: "theme.title", label: "Section title", type: "text", max: 80 },
            { name: "theme.image", label: "Theme logo / image", type: "image" },
            { name: "theme.districtTheme", label: "District theme", type: "text", max: 120 },
            { name: "theme.riTheme", label: "Rotary International theme", type: "text", max: 120 },
            { name: "theme.text", label: "Short description", type: "textarea", max: 400, full: true },
        ],
    },
    {
        key: "contact",
        title: "Contact & social media",
        description: "Shown on the contact page and in the footer. Empty fields are hidden.",
        fields: [
            { name: "contact.email", label: "Email", type: "email", max: 120 },
            { name: "contact.phone", label: "Phone", type: "tel", max: 40 },
            { name: "contact.address", label: "Address", type: "text", max: 200, full: true },
            { name: "contact.meetingInfo", label: "Meeting time & place", type: "text", max: 200, full: true, placeholder: "Every Saturday, 5 PM · Butwal" },
            { name: "contact.mapUrl", label: "Google Maps embed link", type: "map", max: 1500, full: true, help: "Google Maps → Share → Embed a map → copy the HTML and paste it here (the link is taken out automatically)." },
            { name: "socials.facebook", label: "Facebook", type: "url", max: 300 },
            { name: "socials.instagram", label: "Instagram", type: "url", max: 300 },
            { name: "socials.linkedin", label: "LinkedIn", type: "url", max: 300 },
            { name: "socials.youtube", label: "YouTube", type: "url", max: 300 },
            { name: "socials.tiktok", label: "TikTok", type: "url", max: 300 },
            { name: "socials.x", label: "X (Twitter)", type: "url", max: 300 },
        ],
    },
    {
        key: "seo",
        title: "SEO & sharing",
        description: "How the website appears on Google, Facebook and WhatsApp.",
        fields: [
            { name: "seo.title", label: "Google title", type: "text", max: 90, full: true, help: "Best under 60 characters." },
            { name: "seo.description", label: "Google description", type: "textarea", max: 300, full: true, help: "Best between 120 and 160 characters." },
            { name: "seo.keywords", label: "Keywords (comma separated)", type: "textarea", max: 500, full: true },
            { name: "seo.ogImage", label: "Share image (1200×630 recommended)", type: "image" },
        ],
    },
    {
        key: "sections",
        title: "Show / hide sections",
        description: "Turn home page sections on or off.",
        fields: [
            { name: "show.stats", label: "Numbers", type: "toggle" },
            { name: "show.president", label: "President’s message", type: "toggle" },
            { name: "show.theme", label: "Presidential theme", type: "toggle" },
            { name: "show.events", label: "Events & projects", type: "toggle" },
            { name: "show.team", label: "Team", type: "toggle" },
            { name: "show.gallery", label: "Gallery", type: "toggle" },
            { name: "show.partners", label: "Partners", type: "toggle" },
        ],
    },
];
export const RESOURCES = {
    hero: {
        key: "hero",
        title: "Hero slides",
        singular: "slide",
        description: "Images that rotate at the top of the home page.",
        sort: { order: 1, createdAt: -1 },
        canCreate: true,
        fields: [
            { name: "image", label: "Image", type: "image", required: true, full: true },
            { name: "title", label: "Title", type: "text", max: 80 },
            { name: "caption", label: "Caption", type: "text", max: 140 },
            { name: "order", label: "Order (smaller shows first)", type: "number" },
            { name: "active", label: "Show on website", type: "toggle" },
        ],
        columns: [
            { name: "image", label: "Image", type: "image" },
            { name: "title", label: "Title" },
            { name: "order", label: "Order" },
            { name: "active", label: "Visible", type: "toggle" },
        ],
    },
    events: {
        key: "events",
        title: "Events & projects",
        singular: "event",
        description: "Events, service projects, meetings and campaigns.",
        sort: { date: -1, createdAt: -1 },
        canCreate: true,
        fields: [
            { name: "title", label: "Title", type: "text", required: true, max: 160, full: true },
            { name: "category", label: "Type", type: "select", options: EVENT_CATEGORIES.map((c) => ({ value: c, label: c })) },
            { name: "slug", label: "Web address (optional)", type: "text", max: 160, help: "Made from the title automatically if empty." },
            { name: "date", label: "Date", type: "date" },
            { name: "time", label: "Time", type: "text", max: 60, placeholder: "10:00 AM – 2:00 PM" },
            { name: "location", label: "Location", type: "text", max: 160, full: true },
            { name: "coverImage", label: "Cover image", type: "image", full: true },
            { name: "summary", label: "Short summary", type: "textarea", max: 400, full: true, help: "Shown on cards and on Google." },
            { name: "content", label: "Full story", type: "longtext", max: 20000, full: true, help: "Leave an empty line between paragraphs." },
            { name: "images", label: "Photo gallery", type: "images", full: true },
            { name: "collaborators", label: "Partners / collaborators", type: "text", max: 300, full: true },
            { name: "featured", label: "Feature on home page", type: "toggle" },
            { name: "published", label: "Published", type: "toggle" },
        ],
        columns: [
            { name: "coverImage", label: "Image", type: "image" },
            { name: "title", label: "Title" },
            { name: "category", label: "Type" },
            { name: "date", label: "Date", type: "date" },
            { name: "published", label: "Published", type: "toggle" },
        ],
    },
    team: {
        key: "team",
        title: "Team & leaders",
        singular: "member",
        description: "Current board members and past presidents.",
        sort: { group: 1, year: -1, order: 1, name: 1 },
        canCreate: true,
        fields: [
            { name: "name", label: "Full name", type: "text", required: true, max: 100 },
            { name: "role", label: "Role", type: "text", required: true, max: 100, suggestions: [...BOARD_ROLES, "Charter President"] },
            {
                name: "group",
                label: "List",
                type: "select",
                options: [
                    { value: "board", label: "Current team" },
                    { value: "leader", label: "Past leaders" },
                ],
            },
            { name: "year", label: "Rotary year", type: "text", max: 20, placeholder: "2026–27" },
            { name: "photo", label: "Photo", type: "image", full: true },
            { name: "bio", label: "Short bio", type: "textarea", max: 500, full: true },
            { name: "email", label: "Email", type: "email", max: 120 },
            { name: "phone", label: "Phone", type: "tel", max: 40 },
            { name: "facebook", label: "Facebook", type: "url", max: 300 },
            { name: "instagram", label: "Instagram", type: "url", max: 300 },
            { name: "linkedin", label: "LinkedIn", type: "url", max: 300 },
            { name: "order", label: "Order (smaller shows first)", type: "number" },
            { name: "active", label: "Show on website", type: "toggle" },
        ],
        columns: [
            { name: "photo", label: "Photo", type: "image" },
            { name: "name", label: "Name" },
            { name: "role", label: "Role" },
            { name: "group", label: "List" },
            { name: "year", label: "Year" },
            { name: "active", label: "Visible", type: "toggle" },
        ],
    },
    gallery: {
        key: "gallery",
        title: "Gallery",
        singular: "photo",
        description: "Photos for the gallery page. You can upload many at once.",
        sort: { order: 1, createdAt: -1 },
        canCreate: true,
        bulkImages: true,
        fields: [
            { name: "image", label: "Photo", type: "image", required: true, full: true },
            { name: "caption", label: "Caption", type: "text", max: 200, full: true },
            { name: "album", label: "Album", type: "text", max: 80, placeholder: "CYBOK 2026" },
            { name: "order", label: "Order", type: "number" },
        ],
        columns: [
            { name: "image", label: "Photo", type: "image" },
            { name: "caption", label: "Caption" },
            { name: "album", label: "Album" },
        ],
    },
    partners: {
        key: "partners",
        title: "Partners",
        singular: "partner",
        description: "Organisations you work with. Shown on the home page.",
        sort: { order: 1, name: 1 },
        canCreate: true,
        fields: [
            { name: "name", label: "Name", type: "text", required: true, max: 120 },
            { name: "url", label: "Website", type: "url", max: 300 },
            { name: "logo", label: "Logo", type: "image", full: true },
            { name: "order", label: "Order", type: "number" },
        ],
        columns: [
            { name: "logo", label: "Logo", type: "image" },
            { name: "name", label: "Name" },
            { name: "url", label: "Website" },
        ],
    },
    messages: {
        key: "messages",
        title: "Messages",
        singular: "message",
        description: "Messages sent from the contact form.",
        sort: { createdAt: -1 },
        canCreate: false,
        fields: [{ name: "read", label: "Read", type: "toggle" }],
        columns: [
            { name: "name", label: "From" },
            { name: "subject", label: "Subject" },
            { name: "createdAt", label: "Received", type: "date" },
        ],
    },
};
/** Read a nested value by dot path. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPath(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
/** Set a nested value by dot path (returns a new object). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setPath(obj, path, value) {
    const [k, ...rest] = path.split(".");
    const base = obj && typeof obj === "object" ? obj : {};
    if (!rest.length)
        return { ...base, [k]: value };
    return { ...base, [k]: setPath(base[k], rest.join("."), value) };
}
