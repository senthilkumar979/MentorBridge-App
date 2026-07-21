export const CLOUDINARY_FOLDERS = [
  'Tamilpreneur',
  'technical_training_2025',
  'batch_2025',
  'product_dev_center',
  'alamaram_demo',
  'internal_demo',
] as const

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[number]

const FOLDER_META: Record<
  CloudinaryFolder,
  { title: string; tagline: string }
> = {
  Tamilpreneur: {
    title: 'Tamilpreneur Startup event',
    tagline: 'Grand Sangamam — June 2025',
  },
  technical_training_2025: {
    title: 'Technical Training Sessions',
    tagline: 'MentorBridge technical sessions 2025',
  },
  batch_2025: {
    title: 'Batch 2025',
    tagline: 'Students of MentorBridge Batch 2025',
  },
  product_dev_center: {
    title: 'Product Dev Center',
    tagline: 'SSM Institute of Engineering and Technology, Dindigul',
  },
  alamaram_demo: {
    title: 'Alamaram Demo Day',
    tagline: 'Hosted by GoZen, Coimbatore — June 2025',
  },
  internal_demo: {
    title: 'Internal Demo 2025',
    tagline: 'SecuroSphere, StubLab, StuPro — March 2025',
  },
}

export function getFolderTitle(folder: string) {
  return FOLDER_META[folder as CloudinaryFolder]?.title ?? folder
}

export function getFolderTagline(folder: string) {
  return FOLDER_META[folder as CloudinaryFolder]?.tagline ?? 'MentorBridge moments'
}
