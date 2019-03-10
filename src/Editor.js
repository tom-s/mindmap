import React, { Component, createRef } from 'react'
import codemirror from 'codemirror'

class Editor extends Component {
  textarea = createRef()
  editor = undefined
  state = {
    value: `<b>Champ lexical des animaux</b>\n\t<div><img width="50px" height="50px" src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg" id="external-flamingo" crossorigin="anonymous"/>flamant rose</div>\n\t<div><img width="50px" height="40px" src="https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg" id="external-flamingo" crossorigin="anonymous"/>chat blanc</div>\n\tchien`
  }

  componentDidMount() {
    this.editor = codemirror.fromTextArea(
      this.textarea.current,
      {
        lineNumbers: true,
        indentWithTabs: true
      }
    )
    this.editor.setSize("100%", "100%")
    this.editor.on('change', (cm) => {
      this.props.onChange(cm.getValue())
    })
  }

  render() {
    const { value } = this.state
    return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <textarea
        ref={this.textarea}
        value={value}/>
    </div>
    )
  }
}

export default Editor
