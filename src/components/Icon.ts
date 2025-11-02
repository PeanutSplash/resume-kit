import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import * as LucideIcons from 'lucide'

/**
 * @element mr-icon
 */
@customElement('mr-icon')
export class IconElement extends LitElement {
  @property({ type: String })
  name = 'Circle'

  @property({ type: Number })
  size = 16

  @property({ type: Number, attribute: 'stroke-width' })
  strokeWidth = 2

  @property({ type: String })
  color = 'currentColor'

  createRenderRoot() {
    return this
  }

  private getIconSVG(): string {
    // @ts-ignore
    const icon = LucideIcons[this.name] || LucideIcons.Circle

    if (typeof icon === 'function') {
      return icon.toSvg({
        width: this.size,
        height: this.size,
        color: this.color,
        strokeWidth: this.strokeWidth,
        class: 'inline-block',
      })
    }

    return ''
  }

  render() {
    return html`${unsafeHTML(this.getIconSVG())}`
  }
}

export function hasIcon(iconName: string): boolean {
  return iconName in LucideIcons
}

export function getIconSVG(
  name: string,
  options: {
    size?: number
    color?: string
    strokeWidth?: number
    className?: string
  } = {},
): string {
  const { size = 16, color = 'currentColor', strokeWidth = 2, className = '' } = options

  // @ts-ignore
  const icon = LucideIcons[name] || LucideIcons.Circle

  if (typeof icon === 'function') {
    return icon.toSvg({
      width: size,
      height: size,
      color,
      strokeWidth,
      class: className,
    })
  }

  return ''
}

declare global {
  interface HTMLElementTagNameMap {
    'mr-icon': IconElement
  }
}
