import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import type { GlobalSettings, Project } from '../types/resume'

/**
 * @element rk-project-section
 */
@customElement('rk-project-section')
export class ProjectSectionElement extends LitElement {
  @property({ type: Array })
  data: Project[] = []

  @property({ type: Object })
  globalSettings?: GlobalSettings

  @property({ type: String, attribute: 'template-id' })
  templateId: 'classic' | 'modern' | 'left-right' | 'timeline' = 'classic'

  @property({ type: Boolean, attribute: 'show-title' })
  showTitle = true

  createRenderRoot() {
    return this
  }

  private formatLink(link: string): string {
    try {
      const url = new URL(link.startsWith('http') ? link : `https://${link}`)
      return url.hostname.replace(/^www\./, '')
    } catch (e) {
      return link
    }
  }

  private renderProjectItem(project: Project) {
    const centerSubtitle = this.globalSettings?.centerSubtitle

    return html`
      <div style="margin-top: ${this.globalSettings?.paragraphSpacing}px">
        <div
          class=${classMap({
            'grid grid-cols-3 gap-2 items-center justify-items-start': true,
            '[&>*:last-child]:justify-self-end': true,
          })}
        >
          <div class="flex items-center gap-2">
            <h3 class="font-bold" style="font-size: ${this.globalSettings?.subheaderSize || 16}px">${project.name}</h3>
          </div>

          ${project.link && !centerSubtitle
            ? html`
                <a
                  href=${project.link.startsWith('http') ? project.link : `https://${project.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline"
                  title=${project.link}
                >
                  ${this.formatLink(project.link)}
                </a>
              `
            : !project.link && !centerSubtitle
              ? html`<div></div>`
              : ''}
          ${centerSubtitle ? html`<div class="text-subtitleFont">${project.role}</div>` : ''}
          <div class="text-subtitleFont">${project.date}</div>
        </div>
        ${project.role && !centerSubtitle ? html`<div class="text-subtitleFont">${project.role}</div>` : ''}
        ${project.link && centerSubtitle
          ? html`
              <a
                href=${project.link.startsWith('http') ? project.link : `https://${project.link}`}
                target="_blank"
                rel="noopener noreferrer"
                class="underline"
                title=${project.link}
              >
                ${project.link}
              </a>
            `
          : ''}
        ${project.description
          ? html`
              <div
                class="mt-2 text-baseFont"
                style="font-size: ${this.globalSettings?.baseFontSize || 14}px; line-height: ${this.globalSettings?.lineHeight || 1.6}"
              >
                ${unsafeHTML(project.description)}
              </div>
            `
          : html`<div></div>`}
      </div>
    `
  }

  render() {
    if (!this.data || this.data.length === 0) return null

    const visibleProjects = this.data.filter(project => project.visible !== false)

    if (visibleProjects.length === 0) return null

    return html`
      <div
        class="hover:cursor-pointer hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
        style="margin-top: ${this.globalSettings?.sectionSpacing || 24}px"
      >
        ${this.showTitle
          ? html` <rk-section-title title="项目经验" .globalSettings=${this.globalSettings} template-id=${this.templateId}></rk-section-title> `
          : ''}
        <div>${visibleProjects.map(project => this.renderProjectItem(project))}</div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-project-section': ProjectSectionElement
  }
}
