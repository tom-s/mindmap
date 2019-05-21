import getOr from 'lodash/fp/getOr'
import {
  forceSimulation,
} from 'd3-force'
import {
  createLinkForce,
  createChargeForce,
  createCollideForce,
  createCenterForce
} from './forces'
import {
  loop,
  stopLoop
} from '../loop'

let simulation = null

export const createSimulation = (data, findNode, onTick) => {
  const nodes = getOr([], 'nodes', data)
  const links = getOr([], 'links', data)
  simulation = forceSimulation(nodes)
    .force('link', createLinkForce(links))
    .force('charge', createChargeForce())
    .force('collide', createCollideForce(findNode))
    .force('center', createCenterForce())
  loop(() => onTick(tickSimulation()))
  return simulation
}

export const stopSimulation = () => {
  simulation && simulation.stop()
  stopLoop()
}

const tickSimulation = () => {
  simulation && simulation.tick()
  return ({
    nodes: getSimulationNodes(),
    links: getSimulationLinks()
  })
}

const getSimulationLinks = () => simulation
  ? simulation.force('link').links()
  : []

const getSimulationNodes = () => simulation
  ? simulation.nodes()
  : []
