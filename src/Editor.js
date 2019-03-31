import React, { Component, createRef } from 'react'
import codemirror from 'codemirror'

class Editor extends Component {
  textarea = createRef()
  editor = undefined
  state = {
    //value: `<b>Champ lexical des animaux</b>\n\t<div><img width="100px" height="100px" src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg" crossorigin="anonymous"/>flamant rose</div>\n\t<div><img width="100px" height="80px" src="https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg" crossorigin="anonymous"/>chat blanc</div>\n\tchien`
    value: `climate change\n\tenergy\n\toceans`
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
