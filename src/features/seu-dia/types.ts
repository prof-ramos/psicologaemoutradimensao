export interface WikiPage {
  title: string
  extract: string
  thumbnail?: { source: string; width: number; height: number }
  content_urls?: { desktop: { page: string } }
}

export interface WikiEvent {
  year: number
  text: string
  pages: WikiPage[]
}

export interface OnThisDayResult {
  events: WikiEvent[]
  births: WikiEvent[]
  deaths: WikiEvent[]
  exactDayEvents: WikiEvent[]
}

export interface ValidSeuDiaParams {
  month: number
  day: number
  year: number
  display: string
}
