import React, { useEffect, useRef, useState } from 'react'
import eraser from "../assets/simple-er.svg"
import pensvg from '../assets/simple-pen.svg'

const Board = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [status, setStatus] = useState(false)
  const pixelRatio = window.devicePixelRatio || 1
  const [color, setColor] = useState('black')
  const [thickness, setThickness] = useState()
  const cap = useRef(null)
  const [erstat, setErstat] = useState(false)
  const [dimen, setDimen] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })



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
    const canva = canvasRef.current
    const ctx = contextRef.current
    const handleresize = () => {
      const offscreen = document.createElement('canvas')
      offscreen.width = contextRef.current.width
      offscreen.height = contextRef.current.height
      const octx = offscreen.getContext('2d')
      octx.drawImage(canva, 0, 0)

      ctx.drawImage(offscreen, 0 ,0, offscreen.width, offscreen.height, 0, 0, canva.width, canva.height)

      setDimen({width: window.innerWidth, height: window.innerHeight})    
    }


    window.addEventListener('resize', handleresize);
    return () => window.removeEventListener('resize', handleresize)
  }, [])

  useEffect(() => {
    setcanvas()
    canvasRef.current.style.touchAction = "none";
  }, [dimen])

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
    setErstat(false)
    contextRef.current.strokeStyle = color
    contextRef.current.lineWidth = thickness
  }
  return (
    <>

      <section className="toolbox">

        <input type="color" className='colorpicker' value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="number" ref={cap} placeholder='enter the thickness' value={thickness} onChange={(e) => setThickness(Number(e.target.value))} />
        <span className={`tool-ico ${erstat ? 'active' : ''}`} onClick={eron}>
          <img src={eraser} alt="eraser" />

        </span>
        <span className={`tool-ico ${erstat ? '' : 'active'}`} onClick={pen}>
          <img src={pensvg} alt="pen" />

        </span>

      </section>

      <canvas className="canvas" ref={canvasRef}
        onPointerDown={start}
        onPointerMove={draw}
        onPointerUp={finish}

      >
      </canvas>
      <button className="btn" onClick={clear}>Clear</button>
    </>

  )
}

export default Board