import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Trash2, Palette } from 'lucide-react';
import { ThemeId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DoodleCanvasProps {
  theme: ThemeId;
  onSaveDoodle: (dataUrl: string | null) => void;
  initialDoodle?: string;
}

export const DoodleCanvas: React.FC<DoodleCanvasProps> = ({
  theme,
  onSaveDoodle,
  initialDoodle,
}) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState(
    theme === 'wizard_academy' ? '#D4AF37' : '#10B981'
  );
  const [history, setHistory] = useState<ImageData[]>([]);

  const colors =
    theme === 'wizard_academy'
      ? ['#D4AF37', '#701A28', '#3B82F6', '#8B5CF6', '#1E293B', '#F59E0B']
      : ['#10B981', '#06B6D4', '#EF4444', '#F59E0B', '#111827', '#E2E8F0'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white/parchment background initially
    if (initialDoodle) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveState();
      };
      img.src = initialDoodle;
    } else {
      ctx.fillStyle = theme === 'wizard_academy' ? '#FDFBF7' : '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  }, [theme]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), imageData]);
  };

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
        y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height),
      };
    }
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = isEraser
      ? theme === 'wizard_academy'
        ? '#FDFBF7'
        : '#0F172A'
      : strokeColor;

    setIsDrawing(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();

    const canvas = canvasRef.current;
    if (canvas) {
      onSaveDoodle(canvas.toDataURL('image/png'));
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = history.slice(0, -1);
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
    onSaveDoodle(canvas.toDataURL('image/png'));
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme === 'wizard_academy' ? '#FDFBF7' : '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    onSaveDoodle(null);
  };

  return (
    <div className="space-y-3">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-neutral-900/90 border border-neutral-700/80 rounded-xl text-xs">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-neutral-400 mr-1" />
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setStrokeColor(c);
                setIsEraser(false);
              }}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                !isEraser && strokeColor === c
                  ? 'scale-110 border-white ring-2 ring-white/50'
                  : 'border-black/30 hover:scale-105'
              }`}
            />
          ))}
        </div>

        {/* Thickness & Tools */}
        <div className="flex items-center gap-2">
          {/* Thickness */}
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="text-[10px] text-neutral-400">{t('doodleThickness')}</span>
            <input
              type="range"
              min={1}
              max={16}
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 h-1.5 accent-amber-500 bg-neutral-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Eraser */}
          <button
            type="button"
            onClick={() => setIsEraser(!isEraser)}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
              isEraser
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            {t('doodleEraser')}
          </button>

          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 transition-colors cursor-pointer"
            title={t('doodleUndo')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-900/60 hover:bg-red-900/50 transition-colors cursor-pointer"
            title={t('doodleClear')}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative rounded-xl overflow-hidden border border-neutral-700 shadow-inner bg-neutral-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={260}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-48 md:h-56 touch-none cursor-crosshair block"
        />
        <div className="absolute bottom-2 right-2 text-[10px] text-neutral-400/80 bg-neutral-900/80 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
          {t('doodlePadWatermark')}
        </div>
      </div>
    </div>
  );
};
