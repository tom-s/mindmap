import get from 'lodash/fp/get'

let zoomLevel = 1
let zoomListener = null

export const addZoomListener = cb => {
  zoomListener = (e) => {
    const updatedZoomLevel = onZoom(e)
    cb(updatedZoomLevel)
  }
  window && window.addEventListener('wheel', zoomListener)
}

export const removeZoomListener = () => {
  window && window.removeEventListener('wheel', zoomListener)
}

const onZoom = e => {
  const deltaY = get('deltaY', e)
  return Math.max(
    0.5,
    zoomLevel + (deltaY < 0 ? 0.1 : -0.1)
  )
}
