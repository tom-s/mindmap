import React, { Component } from 'react'
import debounce from 'lodash/fp/debounce'

import Editor from './editor/index'
import Visualizer from './visualizer/index'
import { buildData } from './utils/data'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
`

const StyledEditor = styled.div`
  width: 30%;
`

const StyledVisualizer = styled.div`
  width: 70%;
`

class App extends Component {
  state = {
    data: {
      nodes: [],
      links: []
    }
  }
  onChange = debounce(1000, value => {
    const newData = buildData(value)
    this.setState({
      data: newData
    })
  })

  render() {
    const { data } = this.state
    return (
      <Container>
        <StyledEditor>
          <Editor onChange={this.onChange} />
        </StyledEditor>
        <StyledVisualizer>
          <Visualizer data={data} />
        </StyledVisualizer>
      </Container>
    )
  }
}

export default App;
