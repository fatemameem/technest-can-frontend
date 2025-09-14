// Types for your data structures
export interface Podcast {
  id: string
  title: string
  description: string
  thumbnail: string
  socialLinks: {
    linkedin?: string
    instagram?: string
    facebook?: string
  }
  driveLink: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  topic: string
  description: string
  eventDetails: {
    date: string
    time: string
    location: string
  }
  links: {
    lumaLink?: string
    zoomLink?: string
  }
  sponsors: string
  published: boolean
  createdAt: string
  updatedAt: string
}