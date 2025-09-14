"use client";
import { useEffect, useRef, useState } from "react";

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: { r: number; g: number; b: number };
}

interface BackColor {
  r: number;
  g: number;
  b: number;
}

interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: BackColor;
  TRANSPARENT?: boolean;
  DISABLE_ON_INTERACTIVE?: boolean;
}

interface WebGLExtensions {
  formatRGBA: { internalFormat: number; format: number };
  formatRG: { internalFormat: number; format: number };
  formatR: { internalFormat: number; format: number };
  halfFloatTexType: number;
  supportLinearFiltering: boolean;
}

interface WebGLContext {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  ext: WebGLExtensions;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

interface Material {
  setKeywords: (keywords: string[]) => void;
  bind: () => void;
  uniforms: { [key: string]: WebGLUniformLocation | null };
}

interface Program {
  bind: () => void;
  uniforms: { [key: string]: WebGLUniformLocation | null };
}

function SplashCursor({
                        SIM_RESOLUTION = 128,
                        DYE_RESOLUTION = 1024,
                        CAPTURE_RESOLUTION = 512,
                        DENSITY_DISSIPATION = 2.5,
                        VELOCITY_DISSIPATION = 1.5,
                        PRESSURE = 0.05,
                        PRESSURE_ITERATIONS = 15,
                        CURL = 2,
                        SPLAT_RADIUS = 0.15,
                        SPLAT_FORCE = 3000,
                        SHADING = true,
                        COLOR_UPDATE_SPEED = 5,
                        BACK_COLOR = { r: 0, g: 0, b: 0 },
                        TRANSPARENT = true,
                        DISABLE_ON_INTERACTIVE = true,
                      }: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInteractiveHover, setIsInteractiveHover] = useState(false);

  useEffect(() => {
    const isInteractiveElement = (element: EventTarget | null): boolean => {
      if (!element || !(element instanceof Element)) return false;

      const tagName = element.tagName.toLowerCase();
      const role = element.getAttribute('role');
      const isClickable =
          tagName === 'button' ||
          tagName === 'a' ||
          tagName === 'input' ||
          tagName === 'select' ||
          tagName === 'textarea' ||
          role === 'button' ||
          element.hasAttribute('onclick') ||
          element.classList.contains('cursor-pointer');

      return isClickable;
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (isInteractiveElement(e.target)) {
        setIsInteractiveHover(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (isInteractiveElement(e.target)) {
        setIsInteractiveHover(false);
      }
    };

    if (DISABLE_ON_INTERACTIVE) {
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);

      return () => {
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [DISABLE_ON_INTERACTIVE]);

  useEffect(() => {
    if (isInteractiveHover) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const hashCode = (s: string): number => {
      if (s.length === 0) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    };

    const getResolution = (resolution: number): { width: number; height: number } => {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;

      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);

      if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
        return { width: max, height: min };
      } else {
        return { width: min, height: max };
      }
    };

    function pointerPrototype(): Pointer {
      return {
        id: -1,
        texcoordX: 0,
        texcoordY: 0,
        prevTexcoordX: 0,
        prevTexcoordY: 0,
        deltaX: 0,
        deltaY: 0,
        down: false,
        moved: false,
        color: { r: 0, g: 0, b: 0 }
      };
    }

    const config = {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      PAUSED: false,
      BACK_COLOR,
      TRANSPARENT,
    };

    const pointers: Pointer[] = [pointerPrototype()];

    const getWebGLContext = (canvas: HTMLCanvasElement): WebGLContext => {
      const params: WebGLContextAttributes = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };

      let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext;
      const isWebGL2 = !!gl;

      if (!isWebGL2) {
        gl = (canvas.getContext("webgl", params) ||
            canvas.getContext("experimental-webgl", params)) as WebGLRenderingContext;
      }

      if (!gl) {
        throw new Error("WebGL not supported");
      }

      let halfFloat: any;
      let supportLinearFiltering: any;

      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat && halfFloat.HALF_FLOAT_OES);

      let formatRGBA: { internalFormat: number; format: number };
      let formatRG: { internalFormat: number; format: number };
      let formatR: { internalFormat: number; format: number };

      const getSupportedFormat = (
          gl: WebGLRenderingContext | WebGL2RenderingContext,
          internalFormat: number,
          format: number,
          type: number
      ): { internalFormat: number; format: number } | null => {
        if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
          switch (internalFormat) {
            case (gl as WebGL2RenderingContext).R16F:
              return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, type);
            case (gl as WebGL2RenderingContext).RG16F:
              return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RGBA16F, (gl as WebGL2RenderingContext).RGBA, type);
            default:
              return null;
          }
        }
        return { internalFormat, format };
      };

      const supportRenderTextureFormat = (
          gl: WebGLRenderingContext | WebGL2RenderingContext,
          internalFormat: number,
          format: number,
          type: number
      ): boolean => {
        const texture = gl.createTexture();
        if (!texture) return false;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            internalFormat,
            4,
            4,
            0,
            format,
            type,
            null
        );

        const fbo = gl.createFramebuffer();
        if (!fbo) return false;

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            texture,
            0
        );

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        return status === gl.FRAMEBUFFER_COMPLETE;
      };

      if (isWebGL2) {
        const gl2 = gl as WebGL2RenderingContext;
        formatRGBA = getSupportedFormat(gl, gl2.RGBA16F, gl2.RGBA, halfFloatTexType) || { internalFormat: gl.RGBA, format: gl.RGBA };
        formatRG = getSupportedFormat(gl, gl2.RG16F, gl2.RG, halfFloatTexType) || { internalFormat: gl.RGBA, format: gl.RGBA };
        formatR = getSupportedFormat(gl, gl2.R16F, gl2.RED, halfFloatTexType) || { internalFormat: gl.RGBA, format: gl.RGBA };
      } else {
        formatRGBA = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatRG = { internalFormat: gl.RGBA, format: gl.RGBA };
        formatR = { internalFormat: gl.RGBA, format: gl.RGBA };
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering: !!supportLinearFiltering,
        },
      };
    };

    const { gl, ext } = getWebGLContext(canvas);
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    class Material {
      vertexShader: WebGLShader;
      fragmentShaderSource: string;
      programs: { [key: number]: WebGLProgram };
      activeProgram: WebGLProgram | null;
      uniforms: { [key: string]: WebGLUniformLocation | null };

      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = [];
        this.activeProgram = null;
        this.uniforms = [];
      }

      setKeywords(keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);

        let program = this.programs[hash];
        if (program == null) {
          let fragmentShader = compileShader(
              gl.FRAGMENT_SHADER,
              this.fragmentShaderSource,
              keywords
          );
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }

        if (program === this.activeProgram) return;

        this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }

      bind() {
        if (this.activeProgram) {
          gl.useProgram(this.activeProgram);
        }
      }
    }

    class Program {
      program: WebGLProgram;
      uniforms: { [key: string]: WebGLUniformLocation | null };

      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.uniforms = {};
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
      }

      bind() {
        gl.useProgram(this.program);
      }
    }

    const createProgram = (vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram => {
      let program = gl.createProgram();
      if (!program) throw new Error("Could not create WebGL program");

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.trace(gl.getProgramInfoLog(program));
      }

      return program;
    };

    const getUniforms = (program: WebGLProgram): { [key: string]: WebGLUniformLocation | null } => {
      let uniforms: { [key: string]: WebGLUniformLocation | null } = {};
      let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

      for (let i = 0; i < uniformCount; i++) {
        let uniformInfo = gl.getActiveUniform(program, i);
        if (uniformInfo) {
          uniforms[uniformInfo.name] = gl.getUniformLocation(program, uniformInfo.name);
        }
      }

      return uniforms;
    };

    const compileShader = (type: number, source: string, keywords?: string[]): WebGLShader => {
      source = addKeywords(source, keywords);

      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create WebGL shader");

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.trace(gl.getShaderInfoLog(shader));
      }

      return shader;
    };

    const addKeywords = (source: string, keywords?: string[]): string => {
      if (!keywords) return source;

      let keywordsString = "";
      keywords.forEach((keyword) => {
        keywordsString += "#define " + keyword + "\n";
      });

      return keywordsString + source;
    };

    const baseVertexShader = compileShader(
        gl.VERTEX_SHADER,
        `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `
    );

    const copyShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `
    );

    const clearShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
     `
    );

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `;

    const splatShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `
    );

    const advectionShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,
        ext.supportLinearFiltering ? undefined : ["MANUAL_FILTERING"]
    );

    const divergenceShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `
    );

    const curlShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `
    );

    const vorticityShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    const pressureShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `
    );

    const gradientSubtractShader = compileShader(
        gl.FRAGMENT_SHADER,
        `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    const blit = (() => {
      const buffer = gl.createBuffer();
      if (!buffer) throw new Error("Could not create buffer");

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
          gl.STATIC_DRAW
      );

      const indexBuffer = gl.createBuffer();
      if (!indexBuffer) throw new Error("Could not create index buffer");

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array([0, 1, 2, 0, 2, 3]),
          gl.STATIC_DRAW
      );

      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      return (target: FBO | null, clear = false) => {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }

        if (clear) {
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(
        baseVertexShader,
        gradientSubtractShader
    );
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    const createFBO = (w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO => {
      gl.activeTexture(gl.TEXTURE0);
      let texture = gl.createTexture();
      if (!texture) throw new Error("Could not create texture");

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          internalFormat,
          w,
          h,
          0,
          format,
          type,
          null
      );

      let fbo = gl.createFramebuffer();
      if (!fbo) throw new Error("Could not create framebuffer");

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          texture,
          0
      );

      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      let texelSizeX = 1.0 / w;
      let texelSizeY = 1.0 / h;

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const createDoubleFBO = (w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO => {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);

      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value: FBO) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value: FBO) {
          fbo2 = value;
        },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    };

    const resizeFBO = (target: FBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO => {
      let newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture as unknown as number, target.attach(0));
      blit(newFBO);
      return newFBO;
    };

    const resizeDoubleFBO = (
        target: DoubleFBO,
        w: number,
        h: number,
        internalFormat: number,
        format: number,
        type: number,
        param: number
    ): DoubleFBO => {
      if (target.width === w && target.height === h) return target;

      target.read = resizeFBO(
          target.read,
          w,
          h,
          internalFormat,
          format,
          type,
          param
      );

      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;

      return target;
    };

    const initFramebuffers = () => {
      let simRes = getResolution(config.SIM_RESOLUTION);
      let dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

      gl.disable(gl.BLEND);

      if (!dye) {
        dye = createDoubleFBO(
            dyeRes.width,
            dyeRes.height,
            rgba.internalFormat,
            rgba.format,
            texType,
            filtering
        );
      } else {
        dye = resizeDoubleFBO(
            dye,
            dyeRes.width,
            dyeRes.height,
            rgba.internalFormat,
            rgba.format,
            texType,
            filtering
        );
      }

      if (!velocity) {
        velocity = createDoubleFBO(
            simRes.width,
            simRes.height,
            rg.internalFormat,
            rg.format,
            texType,
            filtering
        );
      } else {
        velocity = resizeDoubleFBO(
            velocity,
            simRes.width,
            simRes.height,
            rg.internalFormat,
            rg.format,
            texType,
            filtering
        );
      }

      divergence = createFBO(
          simRes.width,
          simRes.height,
          r.internalFormat,
          r.format,
          texType,
          gl.NEAREST
      );

      curl = createFBO(
          simRes.width,
          simRes.height,
          r.internalFormat,
          r.format,
          texType,
          gl.NEAREST
      );

      pressure = createDoubleFBO(
          simRes.width,
          simRes.height,
          r.internalFormat,
          r.format,
          texType,
          gl.NEAREST
      );
    };

    const updateKeywords = () => {
      let displayKeywords: string[] = [];
      if (config.SHADING) displayKeywords.push("SHADING");
      displayMaterial.setKeywords(displayKeywords);
    };

    updateKeywords();
    initFramebuffers();
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    const updateFrame = () => {
      if (isInteractiveHover) return;

      const dt = calcDeltaTime();
      if (resizeCanvas()) initFramebuffers();
      updateColors(dt);
      applyInputs();
      step(dt);
      render(null);
      requestAnimationFrame(updateFrame);
    };

    const calcDeltaTime = (): number => {
      let now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    };

    const resizeCanvas = (): boolean => {
      let width = scaleByPixelRatio(canvas.clientWidth);
      let height = scaleByPixelRatio(canvas.clientHeight);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }

      return false;
    };

    const updateColors = (dt: number) => {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;

      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach((p) => {
          p.color = generateColor();
        });
      }
    };

    const applyInputs = () => {
      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      });
    };

    const step = (dt: number) => {
      gl.disable(gl.BLEND);

      // Curl
      curlProgram.bind();
      gl.uniform2f(
          curlProgram.uniforms.texelSize as unknown as WebGLUniformLocation,
          velocity.texelSizeX,
          velocity.texelSizeY
      );
      gl.uniform1i(
          curlProgram.uniforms.uVelocity as unknown as number,
          velocity.read.attach(0)
      );
      blit(curl);

      // Vorticity
      vorticityProgram.bind();
      gl.uniform2f(
          vorticityProgram.uniforms.texelSize as unknown as WebGLUniformLocation,
          velocity.texelSizeX,
          velocity.texelSizeY
      );
      gl.uniform1i(
          vorticityProgram.uniforms.uVelocity as unknown as number,
          velocity.read.attach(0)
      );
      gl.uniform1i(
          vorticityProgram.uniforms.uCurl as unknown as number,
          curl.attach(1)
      );
      gl.uniform1f(
          vorticityProgram.uniforms.curl as unknown as WebGLUniformLocation,
          config.CURL
      );
      gl.uniform1f(
          vorticityProgram.uniforms.dt as unknown as WebGLUniformLocation,
          dt
      );
      blit(velocity.write);
      velocity.swap();

      // Divergence
      divergenceProgram.bind();
      gl.uniform2f(
          divergenceProgram.uniforms.texelSize as unknown as WebGLUniformLocation,
          velocity.texelSizeX,
          velocity.texelSizeY
      );
      gl.uniform1i(
          divergenceProgram.uniforms.uVelocity as unknown as number,
          velocity.read.attach(0)
      );
      blit(divergence);

      // Clear pressure
      clearProgram.bind();
      gl.uniform1i(
          clearProgram.uniforms.uTexture as unknown as number,
          pressure.read.attach(0)
      );
      gl.uniform1f(
          clearProgram.uniforms.value as unknown as WebGLUniformLocation,
          config.PRESSURE
      );
      blit(pressure.write);
      pressure.swap();

      // Pressure
      pressureProgram.bind();
      gl.uniform2f(
          pressureProgram.uniforms.texelSize as unknown as WebGLUniformLocation,
          velocity.texelSizeX,
          velocity.texelSizeY
      );
      gl.uniform1i(
          pressureProgram.uniforms.uDivergence as unknown as number,
          divergence.attach(0)
      );

      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(
            pressureProgram.uniforms.uPressure as unknown as number,
            pressure.read.attach(1)
        );
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient Subtract
      gradienSubtractProgram.bind();
      gl.uniform2f(
          gradienSubtractProgram.uniforms.texelSize as unknown as WebGLUniformLocation,
          velocity.texelSizeX,
          velocity.texelSizeY
      );
      gl.uniform1i(
          gradienSubtractProgram.uniforms.uPressure as unknown as number,
          pressure.read.attach(0)
      );
      gl.uniform1i(
          gradienSubtractProgram.uniforms.uVelocity as unknown as number,
          velocity.read.attach(1)
      );
      blit(velocity.write);
      velocity.swap();

      // Advection
      advectionProgram.bind();
      gl.uniform2f(
          advectionProgram.uniforms.texelSize as unknown as WebGLUniformLocation,
          velocity.texelSizeX,
          velocity.texelSizeY
      );

      if (!ext.supportLinearFiltering) {
        gl.uniform2f(
            advectionProgram.uniforms.dyeTexelSize as unknown as WebGLUniformLocation,
            velocity.texelSizeX,
            velocity.texelSizeY
        );
      }

      let velocityId = velocity.read.attach(0);
      gl.uniform1i(
          advectionProgram.uniforms.uVelocity as unknown as number,
          velocityId
      );
      gl.uniform1i(
          advectionProgram.uniforms.uSource as unknown as number,
          velocityId
      );
      gl.uniform1f(
          advectionProgram.uniforms.dt as unknown as WebGLUniformLocation,
          dt
      );
      gl.uniform1f(
          advectionProgram.uniforms.dissipation as unknown as WebGLUniformLocation,
          config.VELOCITY_DISSIPATION
      );
      blit(velocity.write);
      velocity.swap();

      if (!ext.supportLinearFiltering) {
        gl.uniform2f(
            advectionProgram.uniforms.dyeTexelSize as unknown as WebGLUniformLocation,
            dye.texelSizeX,
            dye.texelSizeY
        );
      }

      gl.uniform1i(
          advectionProgram.uniforms.uVelocity as unknown as number,
          velocity.read.attach(0)
      );
      gl.uniform1i(
          advectionProgram.uniforms.uSource as unknown as number,
          dye.read.attach(1)
      );
      gl.uniform1f(
          advectionProgram.uniforms.dissipation as unknown as WebGLUniformLocation,
          config.DENSITY_DISSIPATION
      );
      blit(dye.write);
      dye.swap();
    };

    const render = (target: FBO | null) => {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      drawDisplay(target);
    };

    const drawDisplay = (target: FBO | null) => {
      let width = target == null ? gl.drawingBufferWidth : target.width;
      let height = target == null ? gl.drawingBufferHeight : target.height;

      displayMaterial.bind();

      if (config.SHADING) {
        gl.uniform2f(
            displayMaterial.uniforms.texelSize as unknown as WebGLUniformLocation,
            1.0 / width,
            1.0 / height
        );
      }

      gl.uniform1i(
          displayMaterial.uniforms.uTexture as unknown as number,
          dye.read.attach(0)
      );
      blit(target);
    };

    const splatPointer = (pointer: Pointer) => {
      let dx = pointer.deltaX * config.SPLAT_FORCE;
      let dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    };

    const clickSplat = (pointer: Pointer) => {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      let dx = 10 * (Math.random() - 0.5);
      let dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    };

    const splat = (x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) => {
      splatProgram.bind();
      gl.uniform1i(
          splatProgram.uniforms.uTarget as unknown as number,
          velocity.read.attach(0)
      );
      gl.uniform1f(
          splatProgram.uniforms.aspectRatio as unknown as WebGLUniformLocation,
          canvas.width / canvas.height
      );
      gl.uniform2f(
          splatProgram.uniforms.point as unknown as WebGLUniformLocation,
          x,
          y
      );
      gl.uniform3f(
          splatProgram.uniforms.color as unknown as WebGLUniformLocation,
          dx,
          dy,
          0.0
      );
      gl.uniform1f(
          splatProgram.uniforms.radius as unknown as WebGLUniformLocation,
          correctRadius(config.SPLAT_RADIUS / 100.0)
      );
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(
          splatProgram.uniforms.uTarget as unknown as number,
          dye.read.attach(0)
      );
      gl.uniform3f(
          splatProgram.uniforms.color as unknown as WebGLUniformLocation,
          color.r,
          color.g,
          color.b
      );
      blit(dye.write);
      dye.swap();
    };

    const correctRadius = (radius: number): number => {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    };

    const updatePointerDownData = (pointer: Pointer, id: number, posX: number, posY: number) => {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    };

    const updatePointerMoveData = (pointer: Pointer, posX: number, posY: number, color: { r: number; g: number; b: number }) => {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved =
          Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    };

    const updatePointerUpData = (pointer: Pointer) => {
      pointer.down = false;
    };

    const correctDeltaX = (delta: number): number => {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    };

    const correctDeltaY = (delta: number): number => {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    };

    const generateColor = (): { r: number; g: number; b: number } => {
      let c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r *= 0.15;
      c.g *= 0.15;
      c.b *= 0.15;
      return c;
    };

    const HSVtoRGB = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
      let r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
        default:
          r = 0;
          g = 0;
          b = 0;
          break;
      }

      return { r, g, b };
    };

    const wrap = (value: number, min: number, max: number): number => {
      const range = max - min;
      if (range === 0) return min;
      return ((value - min) % range) + min;
    };

    const scaleByPixelRatio = (input: number): number => {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    };

    window.addEventListener("mousedown", (e) => {
      let pointer = pointers[0];
      let posX = scaleByPixelRatio(e.clientX);
      let posY = scaleByPixelRatio(e.clientY);
      updatePointerDownData(pointer, -1, posX, posY);
      clickSplat(pointer);
    });

    document.body.addEventListener(
        "mousemove",
        function handleFirstMouseMove(e) {
          let pointer = pointers[0];
          let posX = scaleByPixelRatio(e.clientX);
          let posY = scaleByPixelRatio(e.clientY);
          let color = generateColor();
          updateFrame(); // start animation loop
          updatePointerMoveData(pointer, posX, posY, color);
          document.body.removeEventListener("mousemove", handleFirstMouseMove);
        }
    );

    window.addEventListener("mousemove", (e) => {
      let pointer = pointers[0];
      let posX = scaleByPixelRatio(e.clientX);
      let posY = scaleByPixelRatio(e.clientY);
      let color = pointer.color;
      updatePointerMoveData(pointer, posX, posY, color);
    });

    document.body.addEventListener(
        "touchstart",
        function handleFirstTouchStart(e) {
          const touches = e.targetTouches;
          let pointer = pointers[0];
          for (let i = 0; i < touches.length; i++) {
            let posX = scaleByPixelRatio(touches[i].clientX);
            let posY = scaleByPixelRatio(touches[i].clientY);
            updateFrame(); // start animation loop
            updatePointerDownData(pointer, touches[i].identifier, posX, posY);
          }
          document.body.removeEventListener("touchstart", handleFirstTouchStart);
        }
    );

    window.addEventListener("touchstart", (e) => {
      const touches = e.targetTouches;
      let pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        let posX = scaleByPixelRatio(touches[i].clientX);
        let posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerDownData(pointer, touches[i].identifier, posX, posY);
      }
    });

    window.addEventListener(
        "touchmove",
        (e) => {
          const touches = e.targetTouches;
          let pointer = pointers[0];
          for (let i = 0; i < touches.length; i++) {
            let posX = scaleByPixelRatio(touches[i].clientX);
            let posY = scaleByPixelRatio(touches[i].clientY);
            updatePointerMoveData(pointer, posX, posY, pointer.color);
          }
        },
        false
    );

    window.addEventListener("touchend", (e) => {
      const touches = e.changedTouches;
      let pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        updatePointerUpData(pointer);
      }
    });

    updateFrame();

    return () => {
      // Cleanup if needed
    };
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
    isInteractiveHover,
  ]);

  return (
      <div
          className="fixed top-0 left-0 z-10 pointer-events-none"
          style={{ opacity: isInteractiveHover ? 0 : 1, transition: 'opacity 0.2s' }}
      >
        <canvas ref={canvasRef} id="fluid" className="w-screen h-screen z-0" />
      </div>
  );
}

export { SplashCursor };