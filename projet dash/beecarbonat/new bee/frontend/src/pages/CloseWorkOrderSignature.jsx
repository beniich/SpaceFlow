import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CloseWorkOrderSignature() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const placeholderRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        ctx.strokeStyle = '#c0c1ff';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let clientX, clientY;
    if (e.type.includes('touch')) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPos({ x, y });
    
    if (placeholderRef.current && placeholderRef.current.style.opacity !== '0') {
        placeholderRef.current.style.opacity = '0';
    }
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.type.includes('touch')) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    setLastPos({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (placeholderRef.current) {
      placeholderRef.current.style.opacity = '0.5';
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      <header className="bg-surface-container-low text-primary fixed top-0 w-full z-50 h-16 border-b border-border-muted flex items-center justify-between px-margin-page w-full shadow-none hover:bg-surface-container-highest transition-colors active:scale-95 duration-100">
        <button onClick={() => navigate(-1)} aria-label="Back" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant text-primary">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm text-on-surface truncate px-4">Close Work Order</h1>
        <button aria-label="More options" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant text-primary">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>
      
      <main className="flex-grow pt-[calc(theme('spacing.header-height')+theme('spacing.margin-page'))] px-margin-page pb-margin-page overflow-y-auto">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 h-full">
          <section className="bg-surface-card border border-border-muted rounded-xl p-4 relative overflow-hidden flex-shrink-0">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-success"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-success/5 to-transparent pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <h2 className="font-label-md text-label-md uppercase text-on-surface-variant tracking-wider">Work Summary</h2>
              <div className="bg-success/10 text-success font-label-sm text-label-sm px-2 py-1 rounded-full border border-success/20 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Completed
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Task ID</span>
                <span className="font-body-md text-body-md text-on-surface">WO-2023-8942A</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Asset</span>
                <span className="font-body-md text-body-md text-on-surface">Cooling Tower B</span>
              </div>
              <div className="flex flex-col gap-1 col-span-2 border-t border-border-muted pt-3 mt-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Resolution Notes</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Replaced faulty thermal sensor array. Recalibrated baseline metrics. System now operating within nominal parameters.</p>
              </div>
            </div>
          </section>
          
          <section className="flex-grow flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-label-md text-label-md uppercase text-on-surface-variant tracking-wider">Client Authorization</h3>
              <span className="font-label-sm text-label-sm text-warning flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">info</span>
                Required
              </span>
            </div>
            <div className="flex-grow relative bg-surface-lowest border border-border-muted rounded-xl overflow-hidden group hover:border-border-active transition-colors">
              <div ref={placeholderRef} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 transition-opacity duration-200">
                <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined">draw</span>
                  Sign here
                </span>
              </div>
              <canvas 
                ref={canvasRef}
                className="cursor-crosshair w-full h-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
                onTouchMove={(e) => { e.preventDefault(); draw(e); }}
                onTouchEnd={stopDrawing}
              ></canvas>
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-on-surface-variant/30 pointer-events-none"></div>
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-on-surface-variant/30 pointer-events-none"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-on-surface-variant/30 pointer-events-none"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-on-surface-variant/30 pointer-events-none"></div>
            </div>
          </section>
          
          <div className="grid grid-cols-3 gap-3 flex-shrink-0 pt-2 pb-6">
            <button onClick={clearCanvas} className="col-span-1 bg-surface-container border border-border-muted hover:border-border-active text-on-surface font-body-md text-body-md font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition-all active:scale-95">
              <span className="material-symbols-outlined text-[18px]">ink_eraser</span>
              Clear
            </button>
            <button onClick={() => navigate('/sre-work-orders')} className="col-span-2 bg-primary-container text-on-primary-fixed font-body-md text-body-md font-semibold rounded-lg py-3 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(192,193,255,0.15)] hover:shadow-[0_0_20px_rgba(192,193,255,0.25)] transition-all active:scale-95">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              Submit Closure
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
