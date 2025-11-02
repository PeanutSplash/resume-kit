import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import type { GlobalSettings, ResumeData } from '../types/resume'

/**
 * @element mr-resume-preview
 */
@customElement('mr-resume-preview')
export class ResumePreviewElement extends LitElement {
  @property({ type: Object })
  value!: ResumeData

  @property({ type: String, attribute: 'template-id' })
  templateId: 'classic' | 'modern' | 'left-right' | 'timeline' = 'classic'

  createRenderRoot() {
    return this
  }

  private get globalSettings(): GlobalSettings | undefined {
    return this.value?.globalSettings
  }

  private get baseFontSize() {
    return this.globalSettings?.baseFontSize || 14
  }

  private get lineHeight() {
    return this.globalSettings?.lineHeight || 1.6
  }

  private get themeColor() {
    return this.globalSettings?.themeColor || '#000000'
  }

  private get colorScheme() {
    return {
      primary: this.themeColor,
      background: '#ffffff',
      text: '#212529',
    }
  }

  private get sortedSections() {
    const enabledSections = this.value.menuSections?.filter(section => section.enabled) || []
    return [...enabledSections].sort((a, b) => a.order - b.order)
  }

  private renderSection(sectionId: string, showTitle: boolean = true) {
    const gs = this.globalSettings

    switch (sectionId) {
      case 'basic':
        return html` <mr-base-info .data=${this.value.basic} .globalSettings=${gs} template-id=${this.templateId}></mr-base-info> `

      case 'experience':
        return html`
          <mr-experience-section
            .data=${this.value.experience}
            .globalSettings=${gs}
            template-id=${this.templateId}
            ?show-title=${showTitle}
          ></mr-experience-section>
        `

      case 'education':
        return html`
          <mr-education-section
            .data=${this.value.education}
            .globalSettings=${gs}
            template-id=${this.templateId}
            ?show-title=${showTitle}
          ></mr-education-section>
        `

      case 'skills':
        return this.value.skillContent
          ? html`
              <mr-skill-section
                .data=${this.value.skillContent}
                .globalSettings=${gs}
                template-id=${this.templateId}
                ?show-title=${showTitle}
              ></mr-skill-section>
            `
          : ''

      case 'projects':
        return html`
          <mr-project-section .data=${this.value.projects} .globalSettings=${gs} template-id=${this.templateId} ?show-title=${showTitle}></mr-project-section>
        `

      default:
        if (sectionId in (this.value.customData || {})) {
          const sectionTitle = this.value.menuSections?.find(s => s.id === sectionId)?.title || sectionId
          return html`
            <mr-custom-section
              section-id=${sectionId}
              .title=${sectionTitle}
              .items=${this.value.customData[sectionId]}
              .globalSettings=${gs}
              template-id=${this.templateId}
              ?show-title=${showTitle}
            ></mr-custom-section>
          `
        }
        return ''
    }
  }

  private renderClassicLayout() {
    return html`
      <div
        class=${classMap({
          'flex flex-col w-full min-h-screen': true,
          'font-sans': !this.globalSettings?.fontFamily,
        })}
        style=${styleMap({
          fontSize: `${this.baseFontSize}px`,
          lineHeight: String(this.lineHeight),
          backgroundColor: this.colorScheme.background,
          color: this.colorScheme.text,
          fontFamily: this.globalSettings?.fontFamily || undefined,
        })}
      >
        ${this.sortedSections.map(section => html` <div key=${section.id}>${this.renderSection(section.id)}</div> `)}
      </div>
    `
  }

  private renderModernLayout() {
    const basicSection = this.sortedSections.find(section => section.id === 'basic')
    const otherSections = this.sortedSections.filter(section => section.id !== 'basic')

    return html`
      <div
        class=${classMap({
          'grid grid-cols-3 w-full': true,
          'font-sans': !this.globalSettings?.fontFamily,
        })}
        style=${styleMap({
          fontSize: `${this.baseFontSize}px`,
          lineHeight: String(this.lineHeight),
          fontFamily: this.globalSettings?.fontFamily || undefined,
        })}
      >
        <div
          class="col-span-1 p-4"
          style=${styleMap({
            backgroundColor: this.themeColor,
            color: '#ffffff',
            paddingTop: `${this.globalSettings?.sectionSpacing}px`,
          })}
        >
          ${basicSection ? this.renderSection(basicSection.id) : ''}
        </div>

        <div
          class="col-span-2 p-4 pt-0"
          style=${styleMap({
            backgroundColor: this.colorScheme.background,
            color: this.colorScheme.text,
          })}
        >
          ${otherSections.map(section => html` <div key=${section.id}>${this.renderSection(section.id)}</div> `)}
        </div>
      </div>
    `
  }

  private renderTimelineItem(content: any, title: string) {
    return html`
      <div class="relative pl-6">
        <div class="absolute left-0 top-2 h-full w-0.5" style="background-color: #e5e7eb"></div>
        <div class="absolute left-[-6px] top-2 w-3 h-3 rounded-full" style="background-color: ${this.colorScheme.primary}"></div>
        <div
          class="text-xl font-bold mb-4"
          style=${styleMap({
            color: this.themeColor,
            fontSize: `${this.globalSettings?.headerSize || 20}px`,
          })}
        >
          ${title}
        </div>
        <div>${content}</div>
      </div>
    `
  }

  private renderTimelineLayout() {
    return html`
      <div
        class=${classMap({
          'flex flex-col w-full min-h-screen pl-[6px]': true,
          'font-sans': !this.globalSettings?.fontFamily,
        })}
        style=${styleMap({
          fontSize: `${this.baseFontSize}px`,
          lineHeight: String(this.lineHeight),
          backgroundColor: this.colorScheme.background,
          color: this.colorScheme.text,
          fontFamily: this.globalSettings?.fontFamily || undefined,
        })}
      >
        ${this.sortedSections.map(section => {
          const sectionTitle = this.value.menuSections?.find(s => s.id === section.id)?.title || section.id

          if (section.id === 'basic') {
            return html`<div key=${section.id}>${this.renderSection(section.id)}</div>`
          }

          return html`
            <div key=${section.id} class="mb-4 timeline-section">${this.renderTimelineItem(this.renderSection(section.id, false), sectionTitle)}</div>
          `
        })}
      </div>
    `
  }

  render() {
    if (!this.value) return ''

    switch (this.templateId) {
      case 'modern':
        return this.renderModernLayout()
      case 'timeline':
        return this.renderTimelineLayout()
      case 'classic':
      case 'left-right':
      default:
        return this.renderClassicLayout()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mr-resume-preview': ResumePreviewElement
  }
}
