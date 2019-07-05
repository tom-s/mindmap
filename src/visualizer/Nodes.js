import React, { createRef } from 'react'
import map from 'lodash/fp/map'
import Node from './Node'

class Nodes extends React.Component {
  ref = createRef()
  state = {
    top: 0,
    left: 0
  }
  componentDidMount() {
    const { top, left } = this.ref.current.getBoundingClientRect()
    this.setState({
      top,
      left
    })
  }
  render() {
    const { nodes } = this.props
    const { top, left } = this.state
    return (
      <div ref={this.ref}>
        {map(node => <Node key={node.id} node={node} top={top} left={left} />, nodes)}
      </div>
    )
  }
}

export default Nodes
