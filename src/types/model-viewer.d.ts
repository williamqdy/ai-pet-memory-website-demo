import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        alt?: string
        'auto-rotate'?: string
        'camera-controls'?: string
        'camera-orbit'?: string
        class?: string
        'disable-pan'?: string
        'disable-zoom'?: string
        'environment-image'?: string
        exposure?: string
        'field-of-view'?: string
        'interaction-prompt'?: string
        loading?: 'auto' | 'eager' | 'lazy'
        'max-camera-orbit'?: string
        'min-camera-orbit'?: string
        'orbit-sensitivity'?: string
        reveal?: 'auto' | 'interaction' | 'manual'
        'shadow-intensity'?: string
        src?: string
        style?: CSSProperties & Record<string, string>
      }
    }
  }
}
