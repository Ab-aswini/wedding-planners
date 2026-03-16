export interface InviteData {
  id: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  templateId: string;

  // Couple
  groomName: string;
  brideName: string;
  groomFamily: string;
  brideFamily: string;
  weddingDate: string;
  hashtag: string;

  // Cultural
  religion: 'hindu' | 'muslim' | 'sikh' | 'christian' | 'universal';
  mantra: string;
  deityMotif: 'ganesha' | 'bismillah' | 'cross' | 'khanda' | 'none';

  // Story
  story: {
    how: string;
    proposal: string;
    motto: string;
  };

  // Events
  events: EventData[];

  // Media
  photos: string[];
  heroPhoto: string;
  musicUrl: string;

  // Styling
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };

  // Guest Info
  dressCode: string;
  parkingInfo: string;
  accommodation: string;
  additionalInfo: Record<string, string>;

  // Toggles
  showRsvp: boolean;
  showCountdown: boolean;
  showGallery: boolean;
  showStory: boolean;
  showMusic: boolean;

  // Analytics
  viewCount: number;
}

export interface EventData {
  id: string;
  name: string;
  date: string;
  timeText: string;
  venueName: string;
  venueCity: string;
  mapLink: string;
  accentColor: string;
  sortOrder: number;
  isPrivate: boolean;
  guestGroup: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'pro';
  planExpires: string | null;
  inviteLimit: number;
  brandColor: string;
  logoUrl: string | null;
}

export interface RSVPEntry {
  id: string;
  inviteId: string;
  guestName: string;
  attending: boolean;
  guestCount: number;
  message: string;
  eventIds: string[];
  phone: string;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  previewImg: string;
  previewImgs: string[];
  colorScheme: Record<string, string>;
  fonts: Record<string, string>;
  isPremium: boolean;
}
