export const BASIC_INFO_ICONS = {
  email: 'Mail',
  phone: 'Phone',
  location: 'MapPin',
  website: 'Globe',
  birthDate: 'Calendar',
  employementStatus: 'Briefcase',
  github: 'Github',
  linkedin: 'Linkedin',
  twitter: 'Twitter',
} as const

export const MENU_ICONS = {
  basic: 'User',
  experience: 'Briefcase',
  education: 'GraduationCap',
  projects: 'FolderOpen',
  skills: 'Code',
  custom: 'FileText',
} as const

export const ICON_CATEGORIES = {
  contact: [
    { name: 'Mail', label: '邮箱' },
    { name: 'Phone', label: '电话' },
    { name: 'MapPin', label: '地址' },
    { name: 'Globe', label: '网站' },
    { name: 'MessageSquare', label: '消息' },
  ],
  social: [
    { name: 'Github', label: 'GitHub' },
    { name: 'Linkedin', label: 'LinkedIn' },
    { name: 'Twitter', label: 'Twitter' },
    { name: 'Facebook', label: 'Facebook' },
    { name: 'Instagram', label: 'Instagram' },
  ],
  datetime: [
    { name: 'Calendar', label: '日历' },
    { name: 'CalendarRange', label: '日期范围' },
    { name: 'Clock', label: '时钟' },
  ],
  work: [
    { name: 'Briefcase', label: '公文包' },
    { name: 'Building', label: '建筑' },
    { name: 'Users', label: '团队' },
    { name: 'Award', label: '奖项' },
  ],
  education: [
    { name: 'GraduationCap', label: '学位帽' },
    { name: 'BookOpen', label: '书本' },
    { name: 'School', label: '学校' },
  ],
  skills: [
    { name: 'Code', label: '代码' },
    { name: 'Cpu', label: '处理器' },
    { name: 'Zap', label: '闪电' },
    { name: 'Wrench', label: '工具' },
  ],
  projects: [
    { name: 'FolderOpen', label: '文件夹' },
    { name: 'Rocket', label: '火箭' },
    { name: 'Package', label: '包裹' },
    { name: 'Layers', label: '图层' },
  ],
  general: [
    { name: 'User', label: '用户' },
    { name: 'FileText', label: '文件' },
    { name: 'Link', label: '链接' },
    { name: 'Star', label: '星标' },
    { name: 'Heart', label: '喜欢' },
    { name: 'Info', label: '信息' },
  ],
} as const

export const AVAILABLE_ICONS = Object.values(ICON_CATEGORIES)
  .flat()
  .map(icon => icon.name)

export function getIconLabel(iconName: string): string {
  for (const category of Object.values(ICON_CATEGORIES)) {
    const icon = category.find(i => i.name === iconName)
    if (icon) return icon.label
  }
  return iconName
}

export function getIconCategory(iconName: string): keyof typeof ICON_CATEGORIES | null {
  for (const [categoryName, icons] of Object.entries(ICON_CATEGORIES)) {
    if (icons.some(icon => icon.name === iconName)) {
      return categoryName as keyof typeof ICON_CATEGORIES
    }
  }
  return null
}
