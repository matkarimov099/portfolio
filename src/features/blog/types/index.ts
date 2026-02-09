export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  slug: string;
  url: string;
  cover_image: string | null;
  social_image: string | null;
  published_at: string;
  published_timestamp: string;
  tag_list: string[];
  tags: string;
  readable_publish_date: string;
  reading_time_minutes: number;
  public_reactions_count: number;
  comments_count: number;
  positive_reactions_count: number;
  canonical_url: string;
  user: DevToUser;
}

export interface DevToUser {
  name: string;
  username: string;
  profile_image: string;
  profile_image_90: string;
}
