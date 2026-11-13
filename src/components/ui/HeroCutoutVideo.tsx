import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

const VERT_SRC = `#version 300 es
in vec2 a_pos;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
out vec2 v_uv;

void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  vec2 rawUv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  v_uv = rawUv * u_uvScale + u_uvOffset;
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;

in vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_texel;
out vec4 outColor;

void main() {
  vec4 tex = texture(u_tex, v_uv);
  float alpha = tex.a;
  if (alpha <= 0.005) {
    outColor = vec4(0.0);
    return;
  }

  vec4 up    = texture(u_tex, v_uv + vec2(0.0, -u_texel.y));
  vec4 down  = texture(u_tex, v_uv + vec2(0.0,  u_texel.y));
  vec4 left  = texture(u_tex, v_uv + vec2(-u_texel.x, 0.0));
  vec4 right = texture(u_tex, v_uv + vec2( u_texel.x, 0.0));

  // Real-time unsharp mask sharpening + subtle clarity contrast
  vec3 blur = (up.rgb + down.rgb + left.rgb + right.rgb) * 0.25;
  vec3 detail = clamp(tex.rgb - blur, -0.12, 0.12);
  vec3 sharp = clamp(tex.rgb + detail * 0.48, 0.0, 1.0);
  sharp = clamp((sharp - 0.5) * 1.04 + 0.5, 0.0, 1.0);

  // Soft exterior edge cleanup: suppress only stray compression noise
  // strictly outside the subject where alpha is low and surrounded by empty pixels.
  // Never erode solid clothing or body pixels.
  float minNb = min(min(up.a, down.a), min(left.a, right.a));
  if (alpha < 0.40 && minNb < 0.05) {
    alpha = smoothstep(0.06, 0.40, alpha);
  }

  if (alpha <= 0.005) {
    outColor = vec4(0.0);
    return;
  }

  outColor = vec4(sharp * alpha, alpha);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroCutoutVideo({
  videoRef,
  primarySrc,
  fallbackSrc,
  autoPlay,
  isMuted = true,
  onClick,
  onTimeUpdate,
  onEnded,
  cursor,
  title,
  ariaLabel,
}: {
  videoRef: RefObject<HTMLVideoElement>;
  primarySrc: string;
  fallbackSrc?: string;
  autoPlay: boolean;
  isMuted?: boolean;
  onClick: () => void;
  onTimeUpdate?: () => void;
  onEnded: () => void;
  cursor?: string;
  title: string;
  ariaLabel: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = Boolean(isMuted);
    }
  }, [isMuted, videoRef]);

  const glStateRef = useRef<{
    gl: WebGL2RenderingContext;
    tex: WebGLTexture;
    uUvScale: WebGLUniformLocation | null;
    uUvOffset: WebGLUniformLocation | null;
    uTexel: WebGLUniformLocation | null;
  } | null>(null);

  const drawFrame = useCallback(() => {
    const state = glStateRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!state || !canvas || !video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      return;
    }

    const { gl, tex, uUvScale, uUvOffset, uTexel } = state;
    const cw = canvas.width;
    const ch = canvas.height;
    if (!cw || !ch) return;

    const canvasAspect = cw / ch;
    const videoAspect = video.videoWidth / video.videoHeight;

    let scaleX = 1;
    let scaleY = 1;
    let offsetX = 0;

    if (canvasAspect > videoAspect) {
      scaleY = videoAspect / canvasAspect;
    } else {
      scaleX = canvasAspect / videoAspect;
      offsetX = (1 - scaleX) * 0.5;
    }

    gl.viewport(0, 0, cw, ch);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

    gl.uniform2f(uUvScale, scaleX, scaleY);
    gl.uniform2f(uUvOffset, offsetX, 0);
    gl.uniform2f(uTexel, 1.25 / video.videoWidth, 1.25 / video.videoHeight);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [videoRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    if (!tex) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    glStateRef.current = {
      gl,
      tex,
      uUvScale: gl.getUniformLocation(prog, 'u_uvScale'),
      uUvOffset: gl.getUniformLocation(prog, 'u_uvOffset'),
      uTexel: gl.getUniformLocation(prog, 'u_texel'),
    };
    setWebglReady(true);

    const syncCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.max(1, Math.round(rect.width * dpr));
      const nextH = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
        drawFrame();
      }
    };

    syncCanvasSize();
    const ro = new ResizeObserver(syncCanvasSize);
    ro.observe(canvas);

    let cancelCurrentLoop: (() => void) | null = null;

    const stopLoop = () => {
      if (cancelCurrentLoop) {
        cancelCurrentLoop();
        cancelCurrentLoop = null;
      }
    };

    const startLoop = () => {
      stopLoop();
      let active = true;

      const hasRvfc =
        'requestVideoFrameCallback' in video &&
        typeof (video as HTMLVideoElement & { requestVideoFrameCallback?: unknown }).requestVideoFrameCallback === 'function';

      if (hasRvfc) {
        const v = video as HTMLVideoElement & {
          requestVideoFrameCallback: (callback: () => void) => number;
          cancelVideoFrameCallback: (handle: number) => void;
        };
        let handle = 0;
        const onFrame = () => {
          if (!active) return;
          drawFrame();
          if (!video.paused && !video.ended) {
            handle = v.requestVideoFrameCallback(onFrame);
          }
        };
        handle = v.requestVideoFrameCallback(onFrame);
        cancelCurrentLoop = () => {
          active = false;
          if (handle) v.cancelVideoFrameCallback(handle);
        };
      } else {
        let rafId = 0;
        const tick = () => {
          if (!active) return;
          drawFrame();
          if (!video.paused && !video.ended) {
            rafId = window.requestAnimationFrame(tick);
          }
        };
        rafId = window.requestAnimationFrame(tick);
        cancelCurrentLoop = () => {
          active = false;
          if (rafId) window.cancelAnimationFrame(rafId);
        };
      }
    };

    const renderOnce = () => {
      drawFrame();
    };

    video.addEventListener('play', startLoop);
    video.addEventListener('loadeddata', renderOnce);
    video.addEventListener('canplay', renderOnce);
    video.addEventListener('seeked', renderOnce);
    video.addEventListener('ended', stopLoop);
    video.addEventListener('pause', stopLoop);

    if (!video.paused && !video.ended) {
      startLoop();
    } else if (video.readyState >= 2) {
      renderOnce();
    }

    return () => {
      stopLoop();
      ro.disconnect();
      video.removeEventListener('play', startLoop);
      video.removeEventListener('loadeddata', renderOnce);
      video.removeEventListener('canplay', renderOnce);
      video.removeEventListener('seeked', renderOnce);
      video.removeEventListener('ended', stopLoop);
      video.removeEventListener('pause', stopLoop);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      glStateRef.current = null;
    };
  }, [drawFrame, videoRef]);

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        muted={isMuted}
        playsInline
        preload="auto"
        onClick={webglReady ? undefined : onClick}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        data-cursor={webglReady ? undefined : cursor}
        title={webglReady ? undefined : title}
        aria-label={ariaLabel}
        style={
          webglReady
            ? undefined
            : { filter: 'contrast(1.04) drop-shadow(0 0 20px rgba(229, 19, 43, 0.28))' }
        }
        className={`h-full w-full object-cover object-top ${
          webglReady ? 'pointer-events-none opacity-0' : 'cursor-pointer opacity-100'
        }`}
      >
        <source src={primarySrc} type="video/webm" />
        {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
      </video>

      <canvas
        ref={canvasRef}
        onClick={onClick}
        data-cursor={cursor}
        title={title}
        aria-hidden={!webglReady}
        style={{ filter: 'drop-shadow(0 0 20px rgba(229, 19, 43, 0.26))' }}
        className={`absolute inset-0 h-full w-full cursor-pointer ${
          webglReady ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
    </div>
  );
}

