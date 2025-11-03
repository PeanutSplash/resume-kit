import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import type { BasicFieldType, BasicInfo, CustomFieldType, GlobalSettings } from '../types/resume'
import { getBorderRadiusValue } from '../types/resume'

/**
 * @element rk-base-info
 */
@customElement('rk-base-info')
export class BaseInfoElement extends LitElement {
  @property({ type: Object })
  data!: BasicInfo

  @property({ type: Object })
  globalSettings?: GlobalSettings

  @property({ type: String, attribute: 'template-id' })
  templateId: 'classic' | 'modern' | 'left-right' | 'timeline' = 'classic'

  @state()
  private isHovered = false

  createRenderRoot() {
    return this
  }

  private get baseFontSize() {
    return this.globalSettings?.baseFontSize || 14
  }

  private get layout() {
    return this.data?.layout || 'left'
  }

  private get useIconMode() {
    return this.globalSettings?.useIconMode ?? false
  }

  private get isModernTemplate() {
    return this.templateId === 'modern'
  }

  private getOrderedFields() {
    if (!this.data.fieldOrder) {
      return [
        {
          key: 'email',
          value: this.data.email,
          icon: this.data.icons?.email || 'Mail',
          label: '电子邮箱',
          visible: true,
          custom: false,
        },
        {
          key: 'phone',
          value: this.data.phone,
          icon: this.data.icons?.phone || 'Phone',
          label: '电话',
          visible: true,
          custom: false,
        },
        {
          key: 'location',
          value: this.data.location,
          icon: this.data.icons?.location || 'MapPin',
          label: '地址',
          visible: true,
          custom: false,
        },
        {
          key: 'website',
          value: this.data.website,
          icon: this.data.icons?.website || 'Globe',
          label: '网站',
          visible: true,
          custom: false,
        },
      ].filter(item => Boolean(item.value && item.visible))
    }

    return this.data.fieldOrder
      .filter((field: BasicFieldType) => field.visible !== false && field.key !== 'name' && field.key !== 'title')
      .map((field: BasicFieldType) => {
        let value = this.data[field.key] as string

        if (field.key === 'birthDate' && value) {
          try {
            value = new Date(value).toLocaleDateString('zh-CN')
          } catch (e) {
            // Ignore date parsing errors
          }
        }

        return {
          key: field.key,
          value,
          icon: this.data.icons?.[field.key] || 'User',
          label: field.label,
          visible: field.visible,
          custom: field.custom || false,
        }
      })
      .filter(item => Boolean(item.value))
  }

  private get allFields() {
    return [
      ...this.getOrderedFields(),
      ...(this.data.customFields
        ?.filter((field: CustomFieldType) => field.visible !== false)
        .map((field: CustomFieldType) => ({
          key: field.id,
          value: field.value,
          icon: field.icon,
          label: field.label,
          visible: true,
          custom: true,
        })) || []),
    ]
  }

  private getNameField() {
    const nameField = this.data.fieldOrder?.find(field => field.key === 'name') || {
      key: 'name',
      label: '姓名',
      visible: true,
    }
    return nameField.visible !== false ? nameField : null
  }

  private getTitleField() {
    const titleField = this.data.fieldOrder?.find(field => field.key === 'title') || {
      key: 'title',
      label: '职位',
      visible: true,
    }
    return titleField.visible !== false ? titleField : null
  }

  private renderPhoto() {
    if (!this.data.photo || !this.data.photoConfig?.visible) return ''

    return html`
      <div
        style=${styleMap({
          width: `${this.data.photoConfig?.width || 100}px`,
          height: `${this.data.photoConfig?.height || 100}px`,
          borderRadius: this.data.photoConfig ? getBorderRadiusValue(this.data.photoConfig) : '0',
          overflow: 'hidden',
          flexShrink: '0',
        })}
      >
        <img src=${this.data.photo} alt="${this.data.name}'s photo" style="width: 100%; height: 100%; object-fit: cover" />
      </div>
    `
  }

  private renderNameTitle() {
    const nameField = this.getNameField()
    const titleField = this.getTitleField()

    const layoutStyles = this.getLayoutStyles()

    return html`
      <div
        class=${classMap({
          'flex flex-col': true,
          [layoutStyles.nameTitle]: true,
        })}
      >
        ${nameField && this.data[nameField.key]
          ? html`
              <h1
                class="font-bold"
                style=${styleMap({
                  fontSize: '30px',
                  color: this.isModernTemplate ? '#ffffff' : undefined,
                })}
              >
                ${this.data[nameField.key] as string}
              </h1>
            `
          : ''}
        ${titleField && this.data[titleField.key]
          ? html`
              <h2
                style=${styleMap({
                  fontSize: '18px',
                  color: this.isModernTemplate ? '#ffffff' : undefined,
                })}
              >
                ${this.data[titleField.key] as string}
              </h2>
            `
          : ''}
      </div>
    `
  }

  private renderFields() {
    const layoutStyles = this.getLayoutStyles()

    return html`
      <div
        class=${classMap({
          [layoutStyles.fields]: true,
        })}
        style=${styleMap({
          fontSize: `${this.baseFontSize}px`,
          color: this.isModernTemplate ? '#ffffff' : 'rgb(75, 85, 99)',
          maxWidth: this.layout === 'center' ? 'none' : '600px',
        })}
      >
        ${this.allFields.map(
          item => html`
            <div
              key=${item.key}
              class=${classMap({
                'flex items-center whitespace-nowrap overflow-hidden text-baseFont': true,
                'text-white': this.isModernTemplate,
              })}
              style=${styleMap({
                width: this.isModernTemplate ? '100%' : '',
              })}
            >
              ${this.useIconMode
                ? html`
                    <div class="flex items-center gap-1">
                      ${item.icon ? html` <rk-icon name=${item.icon} size="16" color=${this.isModernTemplate ? '#ffffff' : 'rgb(75, 85, 99)'}></rk-icon> ` : ''}
                      ${item.key === 'email'
                        ? html`
                            <a
                              href="mailto:${item.value}"
                              class="underline"
                              style=${styleMap({
                                color: this.isModernTemplate ? '#ffffff' : undefined,
                              })}
                            >
                              ${item.value}
                            </a>
                          `
                        : html`<span>${item.value}</span>`}
                    </div>
                  `
                : html`
                    <div class="flex items-center gap-2 overflow-hidden">
                      ${!item.custom ? html`<span>${item.label}:</span>` : ''} ${item.custom ? html`<span>${item.label}:</span>` : ''}
                      <span class="truncate">${item.value}</span>
                    </div>
                  `}
            </div>
          `,
        )}
      </div>
    `
  }

  private getLayoutStyles() {
    switch (this.layout) {
      case 'right':
        return {
          container: 'flex items-center justify-between gap-6 flex-row-reverse',
          leftContent: 'flex justify-end items-center gap-6',
          fields: 'grid grid-cols-2 gap-x-8 gap-y-2 justify-start',
          nameTitle: 'text-right',
        }
      case 'center':
        return {
          container: 'flex flex-col items-center gap-3',
          leftContent: 'flex flex-col items-center gap-4',
          fields: 'w-full flex justify-start items-center flex-wrap gap-3',
          nameTitle: 'text-center',
        }
      default:
        return {
          container: 'flex items-center justify-between gap-6',
          leftContent: 'flex items-center gap-6',
          fields: 'grid grid-cols-2 gap-x-8 gap-y-2 justify-start',
          nameTitle: 'text-left',
        }
    }
  }

  render() {
    const layoutStyles = this.getLayoutStyles()

    return html`
      <div
        class=${classMap({
          'hover:cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:shadow-md': true,
          'hover:bg-gray-100': !this.isModernTemplate,
          [layoutStyles.container]: true,
        })}
        style=${styleMap({
          transition: this.isModernTemplate ? 'background-color 0.3s ease-in-out' : undefined,
          backgroundColor: this.isModernTemplate && this.isHovered ? 'rgba(255, 255, 255, 0.1)' : undefined,
        })}
        @mouseenter=${() => {
          this.isHovered = true
        }}
        @mouseleave=${() => {
          this.isHovered = false
        }}
      >
        <div class=${layoutStyles.leftContent}>${this.renderPhoto()} ${this.renderNameTitle()}</div>
        ${this.renderFields()}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-base-info': BaseInfoElement
  }
}
