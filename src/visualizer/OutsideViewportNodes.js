import React from 'react'
import styled from 'styled-components'

const NodeContainer = styled.div`
  display: inline-block;
`
class Node extends React.Component {
  onNodeRef = ref => {
    const { node, onNodeRef } = this.props
    onNodeRef(node, ref)
  }
  render () {
    const { node } = this.props
    return (
      <NodeContainer ref={this.onNodeRef} key={node.id} dangerouslySetInnerHTML={{__html: node.name}} />
    )
  }
}


const NodesContainer = styled.div`
  position: absolute;
  top: -9999999px;
  left: -9999999px;
  opacity: 0;
`
/*  Render nodes outside the viewport so that we can retrieve their size */
const OutsideViewportNodes = ({ nodes, onNodeRef}) =>
  <NodesContainer>
    {nodes.map(node => <Node node={node} onNodeRef={onNodeRef} />)}
  </NodesContainer>

export default OutsideViewportNodes
