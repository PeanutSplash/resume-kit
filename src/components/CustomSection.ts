import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import type { CustomItem, GlobalSettings } from '../types/resume'

/**
 * @element rk-custom-section
 */
@customElement('rk-custom-section')
export class CustomSectionElement extends LitElement {
  @property({ type: String, attribute: 'section-id' })
  sectionId = ''

  @property({ type: String })
  title = ''

  @property({ type: Array })
  items: CustomItem[] = []

  @property({ type: Object })
  globalSettings?: GlobalSettings

  @property({ type: String, attribute: 'template-id' })
  templateId: 'classic' | 'modern' | 'left-right' | 'timeline' = 'classic'

  @property({ type: Boolean, attribute: 'show-title' })
  showTitle = true

  createRenderRoot() {
    return this
  }

  private renderCustomItem(item: CustomItem) {
    const centerSubtitle = this.globalSettings?.centerSubtitle
    const gridColumns = centerSubtitle ? 3 : 2

    return html`
      <div style="margin-top: ${this.globalSettings?.paragraphSpacing}px">
        <div
          class=${classMap({
            [`grid grid-cols-${gridColumns} gap-2 items-center justify-items-start`]: true,
            '[&>*:last-child]:justify-self-end': true,
          })}
        >
          <div class="flex items-center gap-2">
            <h4 class="font-bold" style="font-size: ${this.globalSettings?.subheaderSize || 16}px">${item.title}</h4>
          </div>

          ${centerSubtitle ? html`<div class="text-subtitleFont">${item.subtitle}</div>` : ''}

          <span class="text-subtitleFont shrink-0">${item.dateRange}</span>
        </div>

        ${!centerSubtitle && item.subtitle ? html`<div class="text-subtitleFont mt-1">${item.subtitle}</div>` : ''}
        ${item.description
          ? html`
              <div
                class="mt-2 text-baseFont"
                style="font-size: ${this.globalSettings?.baseFontSize || 14}px; line-height: ${this.globalSettings?.lineHeight || 1.6}"
              >
                ${unsafeHTML(item.description)}
              </div>
            `
          : ''}
      </div>
    `
  }

  render() {
    if (!this.items || this.items.length === 0) return null

    const visibleItems = this.items.filter(item => {
      return item.visible && (item.title || item.description)
    })

    if (visibleItems.length === 0) return null

    return html`
      <div
        class="hover:cursor-pointer hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
        style="margin-top: ${this.globalSettings?.sectionSpacing || 24}px"
      >
        ${this.showTitle
          ? html` <rk-section-title .title=${this.title} .globalSettings=${this.globalSettings} template-id=${this.templateId}></rk-section-title> `
          : ''}
        <div>${visibleItems.map(item => this.renderCustomItem(item))}</div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-custom-section': CustomSectionElement
  }
}
