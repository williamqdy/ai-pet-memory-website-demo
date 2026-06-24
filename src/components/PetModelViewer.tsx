import '@google/model-viewer'

type PetModelViewerProps = {
  alt: string
  className?: string
  modelUrl: string
  viewerClassName?: string
}

const PetModelViewer = ({
  alt,
  className = '',
  modelUrl,
  viewerClassName = '',
}: PetModelViewerProps) => (
  <div
    className={`select-none ${className}`}
    style={{ filter: 'drop-shadow(0 22px 28px rgba(82, 56, 30, 0.18))' }}
  >
    <style>
      {`
        model-viewer.pet-model-viewer::part(default-progress-bar) {
          display: none;
          opacity: 0;
        }
        model-viewer.pet-model-viewer::part(default-progress-mask) {
          display: none;
          opacity: 0;
        }
        model-viewer.pet-model-viewer {
          cursor: grab;
          touch-action: none;
          --progress-bar-height: 0px;
        }
        model-viewer.pet-model-viewer:active {
          cursor: grabbing;
        }
      `}
    </style>
    <model-viewer
      alt={alt}
      camera-controls=""
      camera-orbit="0deg 75deg 105%"
      class={`pet-model-viewer h-full w-full ${viewerClassName}`}
      disable-pan=""
      disable-zoom=""
      environment-image="neutral"
      exposure="0.95"
      field-of-view="30deg"
      interaction-prompt="none"
      loading="eager"
      max-camera-orbit="auto 100deg auto"
      min-camera-orbit="auto 50deg auto"
      orbit-sensitivity="0.85"
      reveal="auto"
      shadow-intensity="0.45"
      src={modelUrl}
      style={{
        '--poster-color': 'transparent',
        '--progress-bar-color': 'transparent',
        '--progress-bar-height': '0px',
        '--progress-mask': 'transparent',
      }}
    />
  </div>
)

export default PetModelViewer
