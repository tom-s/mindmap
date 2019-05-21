let frame = null

export const loop = cb => {
  frame = window.requestAnimationFrame(() => {
    cb()
    loop(cb)
  })
}

export const stopLoop = () => {
  window.cancelAnimationFrame(frame)
}
