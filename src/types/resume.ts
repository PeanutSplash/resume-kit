export interface PhotoConfig {
  width: number
  height: number
  aspectRatio: '1:1' | '4:3' | '3:4' | '16:9' | 'custom'
  borderRadius: 'none' | 'medium' | 'full' | 'custom'
  customBorderRadius: number
  visible?: boolean
}

export interface BasicFieldType {
  id: string
  key: string
  label: string
  type?: 'date' | 'textarea' | 'text' | 'editor'
  visible: boolean
  custom?: boolean
}

export interface CustomFieldType {
  id: string
  label: string
  value: string
  icon?: string
  visible?: boolean
  custom?: boolean
}

export function getBorderRadiusValue(config: PhotoConfig): string {
  switch (config.borderRadius) {
    case 'none':
      return '0'
    case 'medium':
      return '8px'
    case 'full':
      return '50%'
    case 'custom':
      return `${config.customBorderRadius}px`
    default:
      return '0'
  }
}

export interface BasicInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  birthDate: string
  employementStatus: string
  icons: Record<string, string>
  photo: string
  photoConfig: PhotoConfig
  fieldOrder?: BasicFieldType[]
  customFields: CustomFieldType[]
  githubKey: string
  githubUseName: string
  githubContributionsVisible: boolean
  layout?: 'left' | 'center' | 'right'
  [key: string]: any
}

export interface Education {
  id: string
  school: string
  major: string
  degree: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
  visible?: boolean
}

export interface Experience {
  id: string
  company: string
  position: string
  date: string
  details: string
  visible?: boolean
}

export interface Project {
  id: string
  name: string
  role: string
  date: string
  description: string
  visible: boolean
  link?: string
}

export interface Skill {
  id: string
  name: string
  level: number
}

export interface CustomItem {
  id: string
  title: string
  subtitle: string
  dateRange: string
  description: string
  visible: boolean
}

export interface GlobalSettings {
  themeColor?: string
  fontFamily?: string
  baseFontSize?: number
  pagePadding?: number
  paragraphSpacing?: number
  lineHeight?: number
  sectionSpacing?: number
  headerSize?: number
  subheaderSize?: number
  useIconMode?: boolean
  centerSubtitle?: boolean
}

export interface MenuSection {
  id: string
  title: string
  icon: string
  enabled: boolean
  order: number
}

export interface ResumeData {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  templateId: string | null | undefined
  basic: BasicInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  customData: Record<string, CustomItem[]>
  skillContent: string
  activeSection: string
  draggingProjectId: string | null
  menuSections: MenuSection[]
  globalSettings: GlobalSettings
}

export const THEME_COLORS = ['#000000', '#1A1A1A', '#333333', '#4D4D4D', '#666666', '#808080', '#999999', '#0047AB', '#8B0000', '#FF4500', '#4B0082', '#2E8B57']
