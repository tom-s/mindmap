import {
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
} from 'd3-force'

export const createLinkForce = links => forceLink(links).distance(100)

export const createChargeForce = () => forceManyBody().strength(-200)//.distanceMin(0).distanceMax(300)

export const createCenterForce = (x, y) => forceCenter(x, y)

export const createCollideForce = findNode => forceCollide(d => {
  const node = findNode(d.id)
  const w = node.offsetWidth
  const h = node.offsetHeight
  const radius = Math.max(w, h) / 2
  return radius
}).strength(0.7).iterations(1)

