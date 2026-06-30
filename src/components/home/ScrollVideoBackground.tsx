import { useEffect, useRef } from 'react';
import { HERO_SCROLL_VIDEO_URL } from '../../lib/homeScroll';

function getScrollBounds() {
  const vh = window.innerHeight;
  return {
    start: vh * 0.5,
    end: document.documentElement.scrollHeight - vh,
  };
}

function getProgress() {
  const { start, end } = getScrollBounds();
  const range = end - start;
  if (range <= 0) return 0;
  return Math.max(0, Math.min(1, (window.scrollY - start) / range));
}

export function ScrollVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const videoEl = videoRef.current;
    if (!canvas || !videoEl) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frames: ImageBitmap[] = [];
    let framesReady = false;
    let lastFrameIndex = -1;
    let videoSeeking = false;
    let raf = 0;
    let cancelled = false;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastFrameIndex = -1;
    };

    const drawFrame = (frame: ImageBitmap) => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const s = Math.max(cw / frame.width, ch / frame.height);
      const dw = frame.width * s;
      const dh = frame.height * s;
      ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const extractFrames = async () => {
      if (reducedMotion) return;
      try {
        const response = await fetch(HERO_SCROLL_VIDEO_URL, { mode: 'cors' });
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.preload = 'auto';
        video.src = objectUrl;

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject();
          setTimeout(() => reject(new Error('timeout')), 15000);
        });

        const scale = Math.min(1, 1280 / video.videoWidth);
        const scaledWidth = Math.round(video.videoWidth * scale);
        const scaledHeight = Math.round(video.videoHeight * scale);
        const frameCount = Math.max(30, Math.min(120, Math.round(video.duration * 24)));

        for (let i = 0; i < frameCount; i++) {
          if (cancelled) break;
          const time = (i / (frameCount - 1)) * (video.duration - 0.05);
          video.currentTime = time;
          await new Promise<void>((resolve, reject) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              resolve();
            };
            video.addEventListener('seeked', onSeeked);
            setTimeout(() => {
              video.removeEventListener('seeked', onSeeked);
              reject(new Error('seek timeout'));
            }, 3000);
          });
          const bitmap = await createImageBitmap(video, {
            resizeWidth: scaledWidth,
            resizeHeight: scaledHeight,
          });
          frames.push(bitmap);
        }

        if (!cancelled && frames.length > 0) {
          framesReady = true;
          canvas.style.visibility = 'visible';
          videoEl.style.display = 'none';
        }
        URL.revokeObjectURL(objectUrl);
      } catch {
        /* fallback to video seek */
      }
    };

    const tick = () => {
      const progress = reducedMotion ? 0 : getProgress();

      if (framesReady && frames.length > 0) {
        const idx = Math.round(progress * (frames.length - 1));
        if (idx !== lastFrameIndex && frames[idx]) {
          lastFrameIndex = idx;
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
          drawFrame(frames[idx]!);
        }
      } else if (
        videoEl.duration &&
        Number.isFinite(videoEl.duration) &&
        videoEl.readyState >= 1 &&
        !reducedMotion
      ) {
        const target = progress * videoEl.duration;
        if (!videoSeeking && Math.abs(videoEl.currentTime - target) > 0.001) {
          videoSeeking = true;
          videoEl.currentTime = target;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const onSeeked = () => {
      videoSeeking = false;
    };
    const onStalled = () => {
      videoSeeking = false;
    };

    videoEl.addEventListener('seeked', onSeeked);
    videoEl.addEventListener('stalled', onStalled);
    canvas.style.visibility = 'hidden';
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    raf = requestAnimationFrame(tick);
    extractFrames();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resizeCanvas);
      videoEl.removeEventListener('seeked', onSeeked);
      videoEl.removeEventListener('stalled', onStalled);
      frames.forEach((f) => f.close());
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -top-[20%] z-[-10] bg-[#0a0a0a]"
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        src={HERO_SCROLL_VIDEO_URL}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
