// Starting content, taken from https://rotract-synergy.vercel.app/
// Everything here can be changed later from the admin panel (/adminlogin).

const R = "https://rotract-synergy.vercel.app";
export const REF_IMAGES = {
  logo: `${R}/logofor%20nav.png`,
  hero: `${R}/hero%20image.jpg`,
  president: `${R}/presidebnt-message.jpg`,
  theme: `${R}/herologo.png`,
  cybok1: `${R}/cybok%201.jpeg`,
  cybok2: `${R}/cybok.jpeg`,
};

export type Img = { url: string; publicId?: string };
export type Pair = { label: string; value: string };

export type SiteSettings = {
  siteName: string;
  shortName: string;
  tagline: string;
  motto: string;
  district: string;
  logo: Img;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroText: string;
  heroImage: Img;
  heroPrimaryLabel: string;
  heroPrimaryLink: string;
  heroSecondaryLabel: string;
  heroSecondaryLink: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutImage: Img;
  mission: string;
  vision: string;
  officialInfo: Pair[];
  stats: Pair[];
  pillars: { title: string; text: string }[];
  president: { name: string; role: string; year: string; photo: Img; greeting: string; message: string; signoff: string };
  theme: { title: string; text: string; districtTheme: string; riTheme: string; image: Img };
  contact: { email: string; phone: string; address: string; meetingInfo: string; mapUrl: string };
  socials: { facebook: string; instagram: string; linkedin: string; youtube: string; tiktok: string; x: string };
  ctaTitle: string;
  ctaText: string;
  footerText: string;
  seo: { title: string; description: string; keywords: string; ogImage: Img };
  show: { stats: boolean; president: boolean; theme: boolean; team: boolean; events: boolean; gallery: boolean; partners: boolean };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Rotaract Club of Butwal Synergy",
  shortName: "RAC Butwal Synergy",
  tagline: "Empowering youth, inspiring leadership, and creating meaningful change through fellowship and service.",
  motto: "Service Above Self",
  district: "Rotaract District 3292 · Nepal–Bhutan",
  logo: { url: REF_IMAGES.logo },

  heroEyebrow: "Rotaract District 3292 · Nepal–Bhutan",
  heroTitle: "Rotaract Club of",
  heroHighlight: "Butwal Synergy",
  heroText:
    "Together, we see a world where people unite and take action to create lasting change — across the globe, in our communities, and in ourselves.",
  heroImage: { url: REF_IMAGES.hero },
  heroPrimaryLabel: "Discover our story",
  heroPrimaryLink: "/about",
  heroSecondaryLabel: "See our events",
  heroSecondaryLink: "/events",

  aboutTitle: "Young people. Real action. Lasting impact.",
  aboutIntro:
    "The Rotaract Club of Butwal Synergy is a youth-led service organization dedicated to developing young leaders, building fellowship, and driving positive change in society. Sponsored by the Rotary Club of Butwal Downtown, we are proud members of Rotaract District 3292 (Nepal & Bhutan) and the global family of Rotary International.",
  aboutImage: { url: REF_IMAGES.hero },
  mission:
    "To provide opportunities for young people to enhance their leadership and professional skills, build lasting friendships, and address the needs of their communities through service.",
  vision:
    "To develop responsible, compassionate and empowered young leaders who strengthen communities and promote global understanding.",
  officialInfo: [
    { label: "Club ID", value: "215519" },
    { label: "Sponsor Club", value: "Rotary Club of Butwal Downtown" },
    { label: "Rotary Zone", value: "Zone 19" },
    { label: "Rotary District", value: "RID 3292" },
    { label: "Region", value: "Nepal & Bhutan" },
  ],
  stats: [
    { label: "Years of Service", value: "" },
    { label: "Total Members", value: "" },
    { label: "Total Projects", value: "" },
  ],
  pillars: [
    { title: "Fellowship", text: "Lifelong friendships built while learning, laughing and serving together." },
    { title: "Leadership", text: "Real responsibility that turns young people into confident leaders." },
    { title: "Community Service", text: "Hands-on projects that meet real needs in Butwal and beyond." },
    { title: "Professional Development", text: "Skills, mentors and networks that grow your career." },
  ],

  president: {
    name: "Rtr. Kalpit Nepal",
    role: "President",
    year: "RY 2026–27",
    photo: { url: REF_IMAGES.president },
    greeting: "Dear Fellow Rotaractors, Blissful Rotaract Greetings!",
    message:
      "It is a great honor to serve as the President of the Rotaract Club of Butwal Synergy for the Rotary Year 2026–27. I sincerely thank every member for the trust and support you have placed in me.\n\nTogether, we will continue to strengthen fellowship, promote leadership, and serve our community with dedication and passion. Guided by our District Theme “Integrity, Vision, Leadership” and the Rotary International Theme “Create Lasting Impact”, let us turn ideas into action and action into meaningful change.\n\nI would also like to thank our Immediate Past President Rtr. Deepak Neupane and his team for their dedication and leadership during their tenure.",
    signoff: "Rotaract Club of Butwal Synergy · Rotaract District 3292 Nepal–Bhutan",
  },

  theme: {
    title: "Presidential Theme",
    text: "The themes that guide our service, our projects and our fellowship this Rotary year.",
    districtTheme: "Integrity, Vision, Leadership",
    riTheme: "Create Lasting Impact",
    image: { url: REF_IMAGES.theme },
  },

  contact: {
    email: "",
    phone: "",
    address: "Butwal, Rupandehi, Lumbini Province, Nepal",
    meetingInfo: "",
    mapUrl: "https://maps.google.com/maps?q=Butwal%2C%20Rupandehi%2C%20Nepal&z=13&output=embed",
  },
  socials: { facebook: "", instagram: "", linkedin: "", youtube: "", tiktok: "", x: "" },

  ctaTitle: "Let’s create lasting impact together",
  ctaText: "Have an idea for a project, want to partner with us, or just want to say hello? We would love to hear from you.",
  footerText: "Empowering youth, inspiring leadership, and creating meaningful change through fellowship and service.",

  seo: {
    title: "Rotaract Club of Butwal Synergy | Rotaract District 3292 Nepal–Bhutan",
    description:
      "Rotaract Club of Butwal Synergy (Club ID 215519) is a youth-led service club in Butwal, Nepal, sponsored by the Rotary Club of Butwal Downtown — building young leaders through fellowship, service and professional development.",
    keywords:
      "Rotaract, Rotaract Club of Butwal Synergy, Butwal, Rupandehi, Nepal, Rotaract District 3292, Rotary Club of Butwal Downtown, youth leadership, community service",
    ogImage: { url: REF_IMAGES.hero },
  },
  show: { stats: true, president: true, theme: true, team: true, events: true, gallery: true, partners: true },
};

export const DEFAULT_HERO_SLIDES = [
  { image: { url: REF_IMAGES.hero }, title: "Service Above Self", caption: "Rotaract Club of Butwal Synergy", order: 0, active: true },
  { image: { url: REF_IMAGES.cybok1 }, title: "CYBOK 2026", caption: "Cybersecurity Unfiltered", order: 1, active: true },
];

export const DEFAULT_EVENTS = [
  {
    title: "CYBOK 2026: Cybersecurity Unfiltered",
    slug: "cybok-2026-cybersecurity-unfiltered",
    category: "Event",
    date: null,
    time: "",
    location: "Rupandehi, Nepal",
    summary:
      "CYBOK 2026 brought together real-world stories, expert insights, and engaging discussions for a memorable day of learning and exploring cybersecurity.",
    content:
      "CYBOK 2026 brought together real-world stories, expert insights, and engaging discussions for a memorable day of learning and exploring cybersecurity.\n\nThank you to everyone who participated and helped make the event meaningful.\n\nRotaract Club of Butwal Synergy was proud to help CSIT Association of Nepal–Rupandehi organize the event, together with Rotaract Tinau City.",
    coverImage: { url: REF_IMAGES.cybok1 },
    images: [{ url: REF_IMAGES.cybok1 }, { url: REF_IMAGES.cybok2 }],
    collaborators: "CSIT Association of Nepal–Rupandehi, Rotaract Tinau City",
    featured: true,
    published: true,
  },
];

export const DEFAULT_TEAM = [
  { name: "Rtr. Kalpit Nepal", role: "President", group: "board", year: "2026–27", photo: { url: REF_IMAGES.president }, order: 1, active: true },
  { name: "Rtr. Deepak Neupane", role: "Immediate Past President", group: "board", year: "2026–27", photo: { url: "" }, order: 4, active: true },
  { name: "Rtr. Deepak Neupane", role: "President", group: "leader", year: "2025–26", photo: { url: "" }, order: 1, active: true },
];

export const DEFAULT_GALLERY = [
  { image: { url: REF_IMAGES.cybok1 }, caption: "Participants and organizers at CYBOK 2026", album: "CYBOK 2026", order: 0 },
  { image: { url: REF_IMAGES.cybok2 }, caption: "Guests and attendees at the CYBOK 2026 cybersecurity event", album: "CYBOK 2026", order: 1 },
  { image: { url: REF_IMAGES.hero }, caption: "Rotaract Club of Butwal Synergy", album: "Club", order: 2 },
];

export const EVENT_CATEGORIES = ["Event", "Project", "Meeting", "Fellowship", "Training", "Campaign", "Other"];

export const BOARD_ROLES = [
  "President",
  "Secretary",
  "Treasurer",
  "Immediate Past President",
  "Vice President I",
  "Vice President II",
  "Club Service Director",
  "Community Service Director",
  "International Service Director",
  "Professional Development Director",
  "Membership Chair",
  "Public Image Chair",
  "Sergeant-at-Arms",
];
