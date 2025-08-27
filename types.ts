// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Youth House interface
export interface YouthHouse extends CosmicObject {
  type: 'youth-houses';
  metadata: {
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    description?: string;
    activities?: string;
    opening_hours?: string;
    phone?: string;
    email?: string;
    website?: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    gallery?: Array<{
      url: string;
      imgix_url: string;
    }>;
    neighborhood?: string;
    age_range?: string;
  };
}

// Project interface
export interface Project extends CosmicObject {
  type: 'projects';
  metadata: {
    title: string;
    short_description: string;
    full_description?: string;
    status?: {
      key: string;
      value: string;
    };
    category?: {
      key: string;
      value: string;
    };
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    start_date?: string;
    end_date?: string;
    youth_houses_involved?: YouthHouse[];
    featured_homepage?: boolean;
  };
}

// Page interface
export interface Page extends CosmicObject {
  type: 'pages';
  metadata: {
    title: string;
    content?: string;
    seo_description?: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    show_in_nav?: boolean;
    nav_order?: number;
  };
}

// Site Settings interface
export interface SiteSettings extends CosmicObject {
  type: 'site-settings';
  metadata: {
    site_title: string;
    site_description?: string;
    hero_title?: string;
    hero_subtitle?: string;
    contact_email?: string;
    contact_phone?: string;
    social_media?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
    brand_colors?: {
      primary: string;
      secondary: string;
      accent: string;
      dark: string;
      light: string;
    };
    map_center_lat?: string;
    map_center_lng?: string;
    map_zoom?: number;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guards
export function isYouthHouse(obj: CosmicObject): obj is YouthHouse {
  return obj.type === 'youth-houses';
}

export function isProject(obj: CosmicObject): obj is Project {
  return obj.type === 'projects';
}

export function isPage(obj: CosmicObject): obj is Page {
  return obj.type === 'pages';
}

export function isSiteSettings(obj: CosmicObject): obj is SiteSettings {
  return obj.type === 'site-settings';
}