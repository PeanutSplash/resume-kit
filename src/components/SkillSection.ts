import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import type { GlobalSettings } from '../types/resume'

/**
 * @element rk-skill-section
 */
@customElement('rk-skill-section')
export class SkillSectionElement extends LitElement {
  @property({ type: String })
  data = ''

  @property({ type: Object })
  globalSettings?: GlobalSettings

  @property({ type: String, attribute: 'template-id' })
  templateId: 'classic' | 'modern' | 'left-right' | 'timeline' = 'classic'

  @property({ type: Boolean, attribute: 'show-title' })
  showTitle = true

  createRenderRoot() {
    return this
  }

  render() {
    if (!this.data) return null

    return html`
      <div
        class="hover:cursor-pointer hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
        style="margin-top: ${this.globalSettings?.sectionSpacing || 24}px"
      >
        ${this.showTitle
          ? html` <rk-section-title title="技能" .globalSettings=${this.globalSettings} template-id=${this.templateId}></rk-section-title> `
          : ''}
        <div style="margin-top: ${this.globalSettings?.paragraphSpacing}px">
          <div class="text-baseFont" style="font-size: ${this.globalSettings?.baseFontSize || 14}px; line-height: ${this.globalSettings?.lineHeight || 1.6}">
            ${unsafeHTML(this.data)}
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-skill-section': SkillSectionElement
  }
}
