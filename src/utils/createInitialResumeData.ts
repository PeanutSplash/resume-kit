import type {
  BasicFieldType,
  BasicInfo,
  CustomItem,
  Education,
  Experience,
  GlobalSettings,
  MenuSection,
  PhotoConfig,
  Project,
  ResumeData,
} from '../types/resume'
import { generateId } from './id'

const DEFAULT_PHOTO_CONFIG: PhotoConfig = {
  width: 90,
  height: 120,
  aspectRatio: '1:1',
  borderRadius: 'none',
  customBorderRadius: 0,
  visible: true,
}

const DEFAULT_FIELD_ORDER: BasicFieldType[] = [
  { id: '1', key: 'name', label: '姓名', type: 'text', visible: true },
  { id: '2', key: 'title', label: '职位', type: 'text', visible: true },
  { id: '3', key: 'email', label: '邮箱', type: 'text', visible: true },
  { id: '4', key: 'phone', label: '电话', type: 'text', visible: true },
  { id: '5', key: 'location', label: '地址', type: 'text', visible: true },
  { id: '6', key: 'birthDate', label: '出生日期', type: 'date', visible: true },
  { id: '7', key: 'employementStatus', label: '在职状态', type: 'text', visible: true },
  { id: '8', key: 'website', label: '网站', type: 'text', visible: true },
]

const EMPTY_BASIC_INFO: BasicInfo = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  birthDate: '',
  employementStatus: '',
  icons: {},
  photo: '',
  photoConfig: DEFAULT_PHOTO_CONFIG,
  customFields: [],
  githubKey: '',
  githubUseName: '',
  githubContributionsVisible: false,
  layout: 'left',
  fieldOrder: DEFAULT_FIELD_ORDER,
}

const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  themeColor: '#000000',
  fontFamily: undefined,
  baseFontSize: 14,
  pagePadding: 32,
  paragraphSpacing: 8,
  lineHeight: 1.6,
  sectionSpacing: 24,
  headerSize: 18,
  subheaderSize: 16,
  useIconMode: false,
  centerSubtitle: true,
}

const DEFAULT_MENU_SECTIONS: MenuSection[] = [
  { id: 'basic', title: '基本信息', icon: 'User', enabled: true, order: 0 },
  { id: 'experience', title: '工作经验', icon: 'Briefcase', enabled: true, order: 1 },
  { id: 'education', title: '教育背景', icon: 'GraduationCap', enabled: true, order: 2 },
  { id: 'projects', title: '项目经验', icon: 'FolderOpen', enabled: true, order: 3 },
  { id: 'skills', title: '技能', icon: 'Code', enabled: true, order: 4 },
]

export interface CreateInitialResumeOptions {
  title?: string
  templateId?: string | null
  basicInfo?: Partial<BasicInfo>
  education?: Education[]
  experience?: Experience[]
  projects?: Project[]
  skillContent?: string
  customData?: Record<string, CustomItem[]>
  globalSettings?: Partial<GlobalSettings>
  menuSections?: MenuSection[]
}

export function createInitialResumeData(options: CreateInitialResumeOptions = {}): ResumeData {
  const now = new Date().toISOString()

  return {
    id: generateId('resume'),
    title: options.title ?? 'Untitled Resume',
    createdAt: now,
    updatedAt: now,
    templateId: options.templateId ?? null,
    basic: { ...EMPTY_BASIC_INFO, ...options.basicInfo },
    education: options.education ?? [],
    experience: options.experience ?? [],
    projects: options.projects ?? [],
    customData: options.customData ?? {},
    skillContent: options.skillContent ?? '',
    activeSection: 'basic',
    draggingProjectId: null,
    menuSections: options.menuSections ?? DEFAULT_MENU_SECTIONS,
    globalSettings: { ...DEFAULT_GLOBAL_SETTINGS, ...options.globalSettings },
  }
}
