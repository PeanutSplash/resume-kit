import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import type { Education, GlobalSettings } from '../types/resume'

/**
 * @element rk-education-section
 */
@customElement('rk-education-section')
export class EducationSectionElement extends LitElement {
  @property({ type: Array })
  data: Education[] = []

  @property({ type: Object })
  globalSettings?: GlobalSettings

  @property({ type: String, attribute: 'template-id' })
  templateId: 'classic' | 'modern' | 'left-right' | 'timeline' = 'classic'

  @property({ type: Boolean, attribute: 'show-title' })
  showTitle = true

  createRenderRoot() {
    return this
  }

  private formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN')
    } catch (e) {
      return dateStr
    }
  }

  private renderEducationItem(edu: Education) {
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
          <div class="font-bold" style="font-size: ${this.globalSettings?.subheaderSize || 16}px">
            <span>${edu.school}</span>
          </div>

          ${centerSubtitle
            ? html` <div class="text-subtitleFont">${[edu.major, edu.degree].filter(Boolean).join(' · ')} ${edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div> `
            : ''}

          <span class="text-subtitleFont shrink-0"> ${`${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}`} </span>
        </div>

        ${!centerSubtitle
          ? html` <div class="text-subtitleFont mt-1">${[edu.major, edu.degree].filter(Boolean).join(' · ')} ${edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div> `
          : ''}
        ${edu.description
          ? html`
              <div
                class="mt-2 text-baseFont"
                style="font-size: ${this.globalSettings?.baseFontSize || 14}px; line-height: ${this.globalSettings?.lineHeight || 1.6}"
              >
                ${unsafeHTML(edu.description)}
              </div>
            `
          : ''}
      </div>
    `
  }

  render() {
    if (!this.data || this.data.length === 0) return null

    const visibleEducation = this.data.filter(edu => edu.visible !== false)

    if (visibleEducation.length === 0) return null

    return html`
      <div
        class="hover:cursor-pointer hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
        style="margin-top: ${this.globalSettings?.sectionSpacing || 24}px"
      >
        ${this.showTitle
          ? html` <rk-section-title title="教育背景" .globalSettings=${this.globalSettings} template-id=${this.templateId}></rk-section-title> `
          : ''}
        <div>${visibleEducation.map(edu => this.renderEducationItem(edu))}</div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-education-section': EducationSectionElement
  }
}
