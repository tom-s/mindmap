import {
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
} from 'd3-force'

export const createLinkForce = links => forceLink(links).strength(2)

export const createChargeForce = () => forceManyBody().strength(-30)//.distanceMin(-1).distanceMax(2000)

export const createCenterForce = () => window
  ? forceCenter(window.innerWidth / 2, window.innerHeight / 2)
  : forceCenter()

export const createCollideForce = findNode => forceCollide(d => {
  const node = findNode(d.id)
  const w = node.offsetWidth
  const h = node.offsetHeight
  const radius = Math.max(w, h) / 2
  return radius
}).strength(0.7).iterations(1)

