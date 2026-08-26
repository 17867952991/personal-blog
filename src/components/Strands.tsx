import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import "./Strands.css";

type StrandsProps = {
  colors: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  className?: string;
};

const vertex = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uCount;
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform float uWaviness;
  uniform float uThickness;
  uniform float uGlow;

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
    float edge = pow(max(cos(uv.x * 1.5), 0.0), 2.8);
    float time = uTime * uSpeed;
    vec3 color = vec3(0.0);

    for (int i = 0; i < 5; i++) {
      if (float(i) >= uCount) break;
      float strand = float(i);
      float wave = sin(uv.x * (2.2 + strand * 0.36) * uWaviness + time * (1.2 + strand * 0.24) + strand * 2.1) * 0.12;
      wave += sin(uv.x * 4.0 - time * 0.72 + strand) * 0.035;
      float distanceToLine = abs(uv.y - wave * uAmplitude);
      float width = 0.005 + uThickness * 0.012;
      float glow = pow(width / (distanceToLine + width), 2.2) * edge;
      vec3 strandColor = mix(uColorA, uColorB, fract(strand * 0.5 + uv.x * 0.12));
      strandColor = mix(strandColor, uColorC, fract(strand * 0.31 + time * 0.04));
      color += strandColor * glow;
    }

    color = 1.0 - exp(-color * uGlow);
    gl_FragColor = vec4(color, clamp(max(max(color.r, color.g), color.b), 0.0, 0.9));
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((character) => character + character).join("")
    : value;
  const numeric = Number.parseInt(normalized, 16);

  if (Number.isNaN(numeric)) return [1, 1, 1];

  return [
    ((numeric >> 16) & 255) / 255,
    ((numeric >> 8) & 255) / 255,
    (numeric & 255) / 255
  ];
}

export function Strands({
  colors,
  count = 3,
  speed = 0.48,
  amplitude = 1.05,
  waviness = 1.1,
  thickness = 0.72,
  glow = 2.4,
  className = ""
}: StrandsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (
      !container ||
      (typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) return;

    try {
      const renderer = new Renderer({ alpha: true, antialias: true });
      const gl = renderer.gl;
      const palette = [colors[0] ?? "#D3A84C", colors[1] ?? "#9B7BFF", colors[2] ?? "#4AA7B8"];
      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [container.offsetWidth, container.offsetHeight] },
          uColorA: { value: hexToRgb(palette[0]) },
          uColorB: { value: hexToRgb(palette[1]) },
          uColorC: { value: hexToRgb(palette[2]) },
          uCount: { value: Math.min(Math.max(count, 1), 5) },
          uSpeed: { value: speed },
          uAmplitude: { value: amplitude },
          uWaviness: { value: waviness },
          uThickness: { value: thickness },
          uGlow: { value: glow }
        }
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
      let animationFrame = 0;

      const resize = () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [width, height];
      };
      const render = (time: number) => {
        animationFrame = window.requestAnimationFrame(render);
        program.uniforms.uTime.value = time * 0.001;
        renderer.render({ scene: mesh });
      };

      container.appendChild(gl.canvas);
      window.addEventListener("resize", resize);
      resize();
      animationFrame = window.requestAnimationFrame(render);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", resize);
        if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch {
      return;
    }
  }, [amplitude, colors, count, glow, speed, thickness, waviness]);

  return <div className={`strands-container ${className}`} aria-hidden="true" ref={containerRef} />;
}
