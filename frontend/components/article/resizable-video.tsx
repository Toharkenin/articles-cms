'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';

export default function ResizableVideoComponent({ node, updateAttributes, selected }: any) {
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: node.attrs.width || null,
    height: node.attrs.height || null,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const resizeDirection = useRef<string>('');

  useEffect(() => {
    if (!isResizing && dimensions.width && dimensions.height) {
      updateAttributes({
        width: Math.round(dimensions.width),
        height: Math.round(dimensions.height),
      });
    }
  }, [isResizing, dimensions.width, dimensions.height]);

  const startResize = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeDirection.current = direction;

    const video = videoRef.current;
    if (video) {
      const rect = video.getBoundingClientRect();
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        width: dimensions.width || rect.width,
        height: dimensions.height || rect.height,
      };
    }
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      const direction = resizeDirection.current;

      let newWidth = startPos.current.width;
      let newHeight = startPos.current.height;
      const aspectRatio = startPos.current.width / startPos.current.height;

      if (direction.includes('e')) {
        newWidth = Math.max(100, startPos.current.width + deltaX);
      } else if (direction.includes('w')) {
        newWidth = Math.max(100, startPos.current.width - deltaX);
      }

      if (direction.includes('s')) {
        newHeight = Math.max(100, startPos.current.height + deltaY);
      } else if (direction.includes('n')) {
        newHeight = Math.max(100, startPos.current.height - deltaY);
      }

      // For corner resizing, maintain aspect ratio
      if (direction.length === 2) {
        if (direction.includes('e') || direction.includes('w')) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }

      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const currentWidth = dimensions.width || videoRef.current?.videoWidth || 640;
  const currentHeight = dimensions.height || videoRef.current?.videoHeight || 360;

  return (
    <NodeViewWrapper style={{ display: 'inline-block', position: 'relative', margin: '1em 0' }}>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%',
        }}
      >
        <video
          ref={videoRef}
          src={node.attrs.src}
          controls
          data-drag-handle
          style={{
            width: `${currentWidth}px`,
            height: `${currentHeight}px`,
            maxWidth: '100%',
            display: 'block',
            borderRadius: '12px',
            userSelect: 'none',
            cursor: selected ? 'move' : 'default',
          }}
        />

        {selected && !isResizing && (
          <>
            {/* Drag/Move handle */}
            <div
              data-drag-handle
              style={{
                position: 'absolute',
                top: '-32px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '6px 12px',
                background: '#8b5cf6',
                color: 'white',
                borderRadius: '8px',
                cursor: 'move',
                fontSize: '12px',
                fontWeight: '500',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 2L3 10M6 2L6 10M9 2L9 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Drag to move
            </div>

            {/* Corner handles */}
            <div
              onMouseDown={(e) => startResize(e, 'nw')}
              style={{
                position: 'absolute',
                top: '-5px',
                left: '-5px',
                width: '12px',
                height: '12px',
                background: '#8b5cf6',
                border: '2px solid white',
                borderRadius: '50%',
                cursor: 'nw-resize',
                zIndex: 10,
              }}
            />
            <div
              onMouseDown={(e) => startResize(e, 'ne')}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '12px',
                height: '12px',
                background: '#8b5cf6',
                border: '2px solid white',
                borderRadius: '50%',
                cursor: 'ne-resize',
                zIndex: 10,
              }}
            />
            <div
              onMouseDown={(e) => startResize(e, 'sw')}
              style={{
                position: 'absolute',
                bottom: '-5px',
                left: '-5px',
                width: '12px',
                height: '12px',
                background: '#8b5cf6',
                border: '2px solid white',
                borderRadius: '50%',
                cursor: 'sw-resize',
                zIndex: 10,
              }}
            />
            <div
              onMouseDown={(e) => startResize(e, 'se')}
              style={{
                position: 'absolute',
                bottom: '-5px',
                right: '-5px',
                width: '12px',
                height: '12px',
                background: '#8b5cf6',
                border: '2px solid white',
                borderRadius: '50%',
                cursor: 'se-resize',
                zIndex: 10,
              }}
            />

            {/* Edge handles */}
            <div
              onMouseDown={(e) => startResize(e, 'n')}
              style={{
                position: 'absolute',
                top: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '10px',
                background: '#8b5cf6',
                border: '2px solid white',
                borderRadius: '4px',
                cursor: 'n-resize',
                zIndex: 10,
              }}
            />
            <div
              onMouseDown={(e) => startResize(e, 's')}
              style={{
                position: 'absolute',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '10px',
                background: '#8b5cf6',
                border: '2px solid white',
                borderRadius: '4px',
                cursor: 's-resize',
                zIndex: 10,
              }}
            />
            <div
              onMouseDown={(e) => startResize(e, 'e')}
              style={{
                position: 'absolute',
                right: '-5px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '10px',
                height: '20px',
                background: '#8b5cf6',
                border: '2px solid white',
                borderRadius: '4px',
                cursor: 'e-resize',
                zIndex: 10,
              }}
            />
            <div
              onMouseDown={(e) => startResize(e, 'w')}
              style={{
                position: 'absolute',
                left: '-5px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '10px',
                height: '20px',
                background: '#8b5cf6',
                border: '2px solid white',
                borderRadius: '4px',
                cursor: 'w-resize',
                zIndex: 10,
              }}
            />
          </>
        )}

        {selected && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: '3px solid #8b5cf6',
              borderRadius: '12px',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}
