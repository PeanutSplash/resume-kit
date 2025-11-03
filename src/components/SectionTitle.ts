import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import type { GlobalSettings } from '../types/resume'

/**
 * @element rk-section-title
 */
@customElement('rk-section-title')
export class SectionTitleElement extends LitElement {
  @property({ type: String })
  title = ''

  @property({ type: Object })
  globalSettings?: GlobalSettings

  @property({ type: String, attribute: 'template-id' })
  templateId: 'classic' | 'modern' | 'left-right' | 'timeline' = 'classic'

  createRenderRoot() {
    return this
  }

  private get themeColor() {
    return this.globalSettings?.themeColor || '#000000'
  }

  private get headerSize() {
    return this.globalSettings?.headerSize || 18
  }

  private get paragraphSpacing() {
    return this.globalSettings?.paragraphSpacing || 8
  }

  private get baseStyles() {
    return {
      fontSize: `${this.headerSize}px`,
      fontWeight: 'bold',
      color: this.themeColor,
      marginBottom: `${this.paragraphSpacing / 2}px`,
    }
  }

  render() {
    switch (this.templateId) {
      case 'modern':
        return html`
          <h3
            class="border-b pb-2 uppercase tracking-wider"
            style=${styleMap({
              ...this.baseStyles,
              borderColor: this.themeColor,
            })}
          >
            ${this.title}
          </h3>
        `

      case 'left-right':
        return html`
          <div class="relative">
            <div
              class="absolute inset-0"
              style=${styleMap({
                backgroundColor: this.themeColor,
                opacity: '0.1',
              })}
            ></div>
            <h3
              class="pl-4 py-1 flex items-center relative"
              style=${styleMap({
                ...this.baseStyles,
                borderLeft: `3px solid ${this.themeColor}`,
              })}
            >
              ${this.title}
            </h3>
          </div>
        `

      case 'classic':
      default:
        return html`
          <h3
            class="pb-2 border-b"
            style=${styleMap({
              ...this.baseStyles,
              borderColor: this.themeColor,
            })}
          >
            ${this.title}
          </h3>
        `
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-section-title': SectionTitleElement
  }
}
