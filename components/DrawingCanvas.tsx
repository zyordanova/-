import React, { useRef, useState, useEffect } from 'react';

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563EB'); // Default Blue
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set actual canvas size to match display size for sharpness
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 250; // Fixed height
      }
      
      // Initial context setup
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between bg-gray-100 p-2 rounded-t-xl border border-gray-300">
        <div className="flex gap-2">
          {/* Colors */}
          <button 
            onClick={() => { setColor('#2563EB'); setTool('pen'); }}
            className={`w-8 h-8 rounded-full bg-blue-600 border-2 ${color === '#2563EB' && tool === 'pen' ? 'border-gray-800 scale-110' : 'border-white'}`}
            aria-label="Blue"
          />
          <button 
            onClick={() => { setColor('#DC2626'); setTool('pen'); }}
            className={`w-8 h-8 rounded-full bg-red-600 border-2 ${color === '#DC2626' && tool === 'pen' ? 'border-gray-800 scale-110' : 'border-white'}`}
            aria-label="Red"
          />
          <button 
            onClick={() => { setColor('#16A34A'); setTool('pen'); }}
            className={`w-8 h-8 rounded-full bg-green-600 border-2 ${color === '#16A34A' && tool === 'pen' ? 'border-gray-800 scale-110' : 'border-white'}`}
            aria-label="Green"
          />
          <button 
            onClick={() => { setColor('#000000'); setTool('pen'); }}
            className={`w-8 h-8 rounded-full bg-black border-2 ${color === '#000000' && tool === 'pen' ? 'border-gray-800 scale-110' : 'border-white'}`}
            aria-label="Black"
          />
        </div>

        <div className="flex gap-2">
           {/* Tools */}
           <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${tool === 'eraser' ? 'bg-gray-300 shadow-inner' : 'bg-white shadow-sm'}`}
          >
            🧼 Гума
          </button>
          <button
            onClick={clearCanvas}
            className="px-3 py-1 rounded-lg bg-white text-rose-600 text-sm font-bold shadow-sm hover:bg-rose-50 border border-rose-200"
          >
            🗑️ Изчисти
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[250px] bg-white rounded-b-xl border-x border-b border-gray-300 shadow-inner overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="absolute bottom-2 right-2 text-gray-300 text-xs pointer-events-none select-none">
           Поле за рисуване
        </div>
      </div>
    </div>
  );
};