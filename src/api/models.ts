export interface Tag {
  id:   number
  name: string
}

export interface Media {
  id:            number
  source_id:     string
  source_type:   string
  title:         string
  artist:        string | null
  description:   string | null
  url:           string
  thumbnail_url: string | null
  duration:      number
  created_at:    string
}

export interface MediaTag {
  id:         number
  tg_id:      number
  media_id:   number
  tag_id:     number
  created_at: string
}


/* ---------- агрегаты ---------- */
export interface MediaWithTags extends Media {
  tags: Tag[]
}

/* ---------- resolve ---------- */
export interface ResolveMediaResponse {
  id:            number
  source_id:     string
  source_type:   string
  title:         string
  artist:       string
  description:  string
  duration:      number
  thumbnail_url:string
  audio_url:     string
}
