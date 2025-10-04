import React, { use, useEffect, useRef, useState } from 'react'


const Board = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [status, setStatus] = useState(false)
  const pixelRatio = window.devicePixelRatio || 1
  const [color, setColor] = useState('black')
  const [thickness, setThickness] = useState(0)
  const cap = useRef(null)
  const [erstat, setErstat] = useState(false)
  const setcanvas = () => {
    const canva = canvasRef.current
    canva.width = window.innerWidth * pixelRatio / 1.2;
    canva.height = window.innerHeight * pixelRatio / 1.2;

    canva.style.width = `${window.innerWidth / 1.2}px`
    canva.style.height = `${window.innerHeight / 1.2}px`

    const context = canva.getContext('2d')

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(pixelRatio, pixelRatio);
    context.lineCap = 'round'
    context.strokeStyle = color
    context.lineWidth = thickness
    contextRef.current = context

  }

  useEffect(() => {
    setcanvas()
  }, [])

  useEffect(() => {
    contextRef.current.lineWidth = thickness
  }, [thickness])

  useEffect(() => {
    if (!erstat && contextRef.current) {
      contextRef.current.strokeStyle = color

    }
  }, [color, erstat])

  const clear = () => {
    const canva = canvasRef.current
    const ctx = contextRef.current
    ctx.clearRect(0, 0, canva.width / pixelRatio, canva.height / pixelRatio)
  }
  const finish = () => {
    setStatus(false)
    contextRef.current.closePath()

  }

  const start = ({ nativeEvent }) => {
    setStatus(true)
    const { offsetX, offsetY } = nativeEvent

    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
  }
  const draw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!status) return;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }

  const eron = () => {
    setErstat(true)
    contextRef.current.strokeStyle = 'white'
    contextRef.current.lineWidth = thickness * 3

  }
  const pen = () => {
    contextRef.current.strokeStyle = color
    contextRef.current.lineWidth = thickness
  }
  return (
    <>

      <div className="toolbox">
        <input type="color" className='colorpicker' value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="number" ref={cap} placeholder='enter the thickness' value={thickness} onChange={(e) => setThickness(e.target.value)} />
        <span className="eraser" onClick={eron}>Eraser ico </span>
        <span className="pen" onClick={pen}>pen ico </span>

      </div>

      <canvas className="canvas" ref={canvasRef}
        onMouseUp={finish}
        onMouseDown={start}
        onMouseMove={draw}
      >
      </canvas>
      <button className="btn" onClick={clear}>Clear</button>
    </>

  )
}

export default Board