export interface Experience {
  company: string
  role: string
  summary: string
  website?: string
}

export interface MentorBridgeExp {
  company: string
  role: string
  summary: string
  website?: string
}

export interface ISocialLinks {
  linkedIn: string
  gitHub: string
  website?: string
}

export interface ProfileData {
  id: string
  name: string
  picture: string
  role: string
  company?: string
  summary?: string
  email: string
  mediumUsername?: string
  experience?: Experience[]
  mentorBridgeExp?: MentorBridgeExp
  skillSets?: string[]
  inspirations?: string[]
  socialLinks?: ISocialLinks
  resumeLink?: string
  batch: string
  cohortId?: string
  fatherGuardianDetails?: string
  motherDetails?: string
  gender?: string
  selfIntro?: string
  serialNo?: number
}
