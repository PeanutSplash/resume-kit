import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import type { Experience, GlobalSettings } from '../types/resume'

/**
 * @element mr-experience-section
 */
@customElement('mr-experience-section')
export class ExperienceSectionElement extends LitElement {
  @property({ type: Array })
  data: Experience[] = []

  @property({ type: Object })
  globalSettings?: GlobalSettings

  @property({ type: String, attribute: 'template-id' })
  templateId: 'classic' | 'modern' | 'left-right' | 'timeline' = 'classic'

  @property({ type: Boolean, attribute: 'show-title' })
  showTitle = true

  createRenderRoot() {
    return this
  }

  private renderExperienceItem(experience: Experience) {
    const centerSubtitle = this.globalSettings?.centerSubtitle

    return html`
      <div style="margin-top: ${this.globalSettings?.paragraphSpacing}px">
        <div
          class=${classMap({
            'grid gap-2 items-center justify-items-start': true,
            '[&>*:last-child]:justify-self-end': true,
          })}
          style="grid-template-columns: ${centerSubtitle ? '1fr 1fr auto' : '1fr auto'}"
        >
          <div class="font-bold" style="font-size: ${this.globalSettings?.subheaderSize || 16}px">${experience.company}</div>
          ${centerSubtitle ? html`<div class="text-subtitleFont">${experience.position}</div>` : ''}
          <div class="text-subtitleFont">${experience.date}</div>
        </div>
        ${experience.position && !centerSubtitle ? html`<div class="text-subtitleFont">${experience.position}</div>` : ''}
        ${experience.details
          ? html`
              <div
                class="mt-2 text-baseFont"
                style="font-size: ${this.globalSettings?.baseFontSize || 14}px; line-height: ${this.globalSettings?.lineHeight || 1.6}"
              >
                ${unsafeHTML(experience.details)}
              </div>
            `
          : ''}
      </div>
    `
  }

  render() {
    if (!this.data || this.data.length === 0) return null

    const visibleExperiences = this.data.filter(experience => experience.visible !== false)

    if (visibleExperiences.length === 0) return null

    return html`
      <div
        class="hover:cursor-pointer hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
        style="margin-top: ${this.globalSettings?.sectionSpacing || 24}px"
      >
        ${this.showTitle
          ? html` <mr-section-title title="工作经验" .globalSettings=${this.globalSettings} template-id=${this.templateId}></mr-section-title> `
          : ''}
        <div>${visibleExperiences.map(experience => this.renderExperienceItem(experience))}</div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mr-experience-section': ExperienceSectionElement
  }
}
