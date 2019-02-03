import React, { Component, createRef } from 'react'
import codemirror from 'codemirror'

class Editor extends Component {
  textarea = createRef()
  editor = undefined
  state = {
    value: ''
  }

  componentDidMount() {
    this.editor = codemirror.fromTextArea(
      this.textarea.current,
      {
        lineNumbers: true,
        indentWithTabs: true
      }
    )
    this.editor.on('change', (cm) => {
      this.props.onChange(cm.getValue())
    })
  }

  render() {
    const { value } = this.state
    return (
    <div style={{height: 330, width: '100%'}}>
      <textarea
        ref={this.textarea}
        value={value}/>
    </div>
    )
  }
}

export default Editor
