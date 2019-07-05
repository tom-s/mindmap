import getOr from 'lodash/fp/getOr'
import get from 'lodash/fp/get'
import React, { Component } from 'react'
import { createSimulation, stopSimulation } from '../utils/simulation/index'
import { addZoomListener, removeZoomListener } from '../utils/zoom'
import Links from './Links'
import Nodes from './Nodes'
import OutsideViewportNodes from './OutsideViewportNodes'
import styled from 'styled-components'

class Visualizer extends Component {
  containerRef = React.createRef()
  nodesRefs = {}
  state = {
    links: [],
    nodes: [],
    zoomLevel: 1
  }

  componentDidMount() {
    this.simulation()
    addZoomListener(this.onZoom)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.data !== this.props.data) {
      this.simulation()
    }
  }

  simulation = () => {
    const { data } = this.props
    const { top, left, width, height } = this.containerRef.current.getBoundingClientRect()
    createSimulation({
      data,
      findNode:  this.findNode,
      onTick: this.onTick,
      center: {
        x: width / 2,
        y: top + (height / 2)
      }
    })
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
        {/* todo: manage to center this content */}
        <div ref={this.containerRef} style={{position: 'relative', width: '100%', height: '100%', transform: `scale(${zoomLevel})`}} >
          <Links links={links} nodesRefs={this.nodesRefs} />
          <Nodes nodes={nodes} />
        </div>
        <OutsideViewportNodes nodes={originalNodes} onNodeRef={this.onNodeRef} />
      </>
    )
  }
}

export default Visualizer
