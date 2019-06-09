import React, { createRef } from 'react'

const DRAG_IMG = new Image()

const buildStyle = ({ node }) => ({
  position: 'absolute',
  top:0,
  left:0,
  transition: 'transform 0.05s linear',
  transform: `translate3d(${Math.round(node.x)}px, ${Math.round(node.y)}px, 0)`
})

class Nodes extends React.Component {
  ref = createRef()
  onDragStartNode = e => {
    e.dataTransfer.setDragImage(DRAG_IMG, 0, 0)
    e.dataTransfer.effectAllowed = 'none'
    e.dataTransfer.dropEffect = 'none'
  }

  onDragNode = (e, node) => {
    this.updateNodePosition({
      node,
      x: e.x,
      y: e.y,
      clientX: e.clientX,
      clientY: e.clientY
    })
  }

  updateNodePosition({
    node,
    clientX,
    clientY
  }) {
    if(clientX && clientY) {
      const { top, left } = this.ref.current.getBoundingClientRect()
      // This is a bit hackish to update props directly
      // But d3-force.simulation.nodes() is too costly to run it every time, better mutate them directly
      node.fx = clientX - left
      node.fy = clientY - top
    }
  }

  render() {
    const { nodes } = this.props
    return (
      <div ref={this.ref}>
      {nodes.map(node => (
        <div draggable={true} key={node.id} style={buildStyle({
          node
        })} onDragStart={this.onDragStartNode} onDrag={e => this.onDragNode(e, node)} >
          <div dangerouslySetInnerHTML={{__html: node.name}} />
        </div>
      ))}
      </div>
    )
  }
}

export default Nodes
