export type {
  BasicFieldType,
  BasicInfo,
  CustomFieldType,
  CustomItem,
  Education,
  Experience,
  GlobalSettings,
  MenuSection,
  PhotoConfig,
  Project,
  ResumeData,
  Skill,
} from './types/resume'

export type { CreateInitialResumeOptions } from './utils/createInitialResumeData'

export { THEME_COLORS, getBorderRadiusValue } from './types/resume'

export { AVAILABLE_ICONS, BASIC_INFO_ICONS, ICON_CATEGORIES, MENU_ICONS, getIconCategory, getIconLabel } from './constants/icons'

export { createInitialResumeData } from './utils/createInitialResumeData'

export { generateId } from './utils/id'

export { BaseInfoElement } from './components/BaseInfo'
export { CustomSectionElement } from './components/CustomSection'
export { EducationSectionElement } from './components/EducationSection'
export { ExperienceSectionElement } from './components/ExperienceSection'
export { IconElement, getIconSVG, hasIcon } from './components/Icon'
export { ProjectSectionElement } from './components/ProjectSection'
export { ResumePreviewElement } from './components/ResumePreview'
export { SectionTitleElement } from './components/SectionTitle'
export { SkillSectionElement } from './components/SkillSection'

declare global {
  interface HTMLElementTagNameMap {
    'mr-icon': InstanceType<typeof import('./components/Icon').IconElement>
    'mr-section-title': InstanceType<typeof import('./components/SectionTitle').SectionTitleElement>
    'mr-base-info': InstanceType<typeof import('./components/BaseInfo').BaseInfoElement>
    'mr-education-section': InstanceType<typeof import('./components/EducationSection').EducationSectionElement>
    'mr-experience-section': InstanceType<typeof import('./components/ExperienceSection').ExperienceSectionElement>
    'mr-project-section': InstanceType<typeof import('./components/ProjectSection').ProjectSectionElement>
    'mr-skill-section': InstanceType<typeof import('./components/SkillSection').SkillSectionElement>
    'mr-custom-section': InstanceType<typeof import('./components/CustomSection').CustomSectionElement>
    'mr-resume-preview': InstanceType<typeof import('./components/ResumePreview').ResumePreviewElement>
  }
}
