import getOr from 'lodash/fp/getOr'
import get from 'lodash/fp/get'
import React, { Component } from 'react'
import { createSimulation, stopSimulation } from '../utils/simulation/index'
import { addZoomListener, removeZoomListener } from '../utils/zoom'
import Links from './Links'
import Nodes from './Nodes'
import OutsideViewportNodes from './OutsideViewportNodes'
import styled from 'styled-components'

const Container = styled.div`
`

class Visualizer extends Component {
  nodesRefs = {}
  state = {
    links: [],
    nodes: [],
    zoomLevel: 1
  }

  componentDidMount() {
    createSimulation(this.props.data, this.findNode, this.onTick)
    addZoomListener(this.onZoom)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.data !== this.props.data) {
      createSimulation(this.props.data, this.findNode, this.onTick)
    }
  }

  componentWillUnmount() {
    stopSimulation()
    removeZoomListener()
  }

  onTick = ({ links, nodes } ) => {
    this.setState({
      links,
      nodes
    })
  }

  onZoom = zoomLevel => {
    this.setState({
      zoomLevel
    })
  }

  findNode = id => get([id], this.nodesRefs)

  onNodeRef = (node, ref) => {
    this.nodesRefs[node.id] = ref
  }

  render() {
    const originalNodes = getOr([], ['data', 'nodes'], this.props)
    const { zoomLevel, links, nodes } = this.state
    return (
      <>
        <Container>
          {/* todo: manage to center this content */}
          <div style={{position: 'relative', width: 400, height: 400, transform: `scale(${zoomLevel})`}} >
            <Links links={links} nodesRefs={this.nodesRefs} />
            <Nodes nodes={nodes} />
          </div>
        </Container>
        <OutsideViewportNodes nodes={originalNodes} onNodeRef={this.onNodeRef} />
      </>
    )
  }
}

export default Visualizer
