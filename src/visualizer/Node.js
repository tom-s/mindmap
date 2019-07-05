import React from 'react'
import { setAlphaTarget } from '../utils/simulation/index'
const DRAG_IMG = new Image()

const buildStyle = ({ node }) => ({
  position: 'absolute',
  top:0,
  left:0,
  //transition: 'transform 0.1s linear',
  transform: `translate3d(${Math.round(node.x)}px, ${Math.round(node.y)}px, 0)`
})

class Node extends React.Component {
  onDragStartNode = e => {
    e.dataTransfer.setDragImage(DRAG_IMG, 0, 0)
    e.dataTransfer.effectAllowed = 'none'
    e.dataTransfer.dropEffect = 'none'
    setAlphaTarget(0.3)
  }

  onDragEndNode = (e, node) => {
    this.updateNodePosition({
      node,
      fx: null,
      fy: null
    })
    setAlphaTarget(0)
  }

  onDragNode = (e, node) => {
    const { top, left } = this.props
    const fx = e.clientX - left
    const fy =  e.clientY - top
    this.updateNodePosition({
      node,
      fx,
      fy
    })
  }


  updateNodePosition({
    node,
    fx,
    fy
  }) {
    // This is a bit hackish to update props directly
    // But d3-force.simulation.nodes() is too costly to run it every time, better mutate them directly
    node.fx = fx
    node.fy = fy
  }


  render() {
    const { node } = this.props
    return (
      <div draggable={true} key={node.id} style={buildStyle({
        node
      })} onDragStart={this.onDragStartNode} onDragEnd={e => this.onDragEndNode(e, node)} onDrag={e => this.onDragNode(e, node)} >
        <div dangerouslySetInnerHTML={{__html: node.html}} />
      </div>
    )
  }
}

export default Node
