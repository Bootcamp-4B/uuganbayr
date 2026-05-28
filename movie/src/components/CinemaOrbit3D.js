"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clapperboard, Play, RotateCcw } from "lucide-react";
import * as THREE from "three";
import { getWebglPosterSource } from "@/lib/webgl-poster-source";

const ACCENTS = ["#14b8a6", "#f59e0b", "#ef476f", "#38bdf8", "#f97316", "#22c55e"];
const MAX_ORBIT_MOVIES = 10;

function wrapTitle(context, title, maxWidth) {
  const words = title.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }
    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, 3);
}

function createFallbackPosterTexture(movie, index) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;

  const context = canvas.getContext("2d");
  const accent = ACCENTS[index % ACCENTS.length];

  context.fillStyle = "#111318";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, `${accent}ee`);
  gradient.addColorStop(0.45, "#1f2937");
  gradient.addColorStop(1, "#07090d");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(255, 255, 255, 0.1)";
  for (let y = 58; y < canvas.height - 56; y += 84) {
    context.fillRect(36, y, 24, 36);
    context.fillRect(canvas.width - 60, y, 24, 36);
  }

  context.fillStyle = "rgba(255, 255, 255, 0.18)";
  context.fillRect(82, 86, 348, 4);
  context.fillRect(82, canvas.height - 116, 348, 4);

  context.fillStyle = "#ffffff";
  context.font = "700 58px Arial";
  context.textBaseline = "top";

  const lines = wrapTitle(context, movie.title, 350);
  lines.forEach((line, lineIndex) => {
    context.fillText(line, 82, 172 + lineIndex * 66);
  });

  context.fillStyle = "rgba(255, 255, 255, 0.82)";
  context.font = "700 24px Arial";
  context.fillText(movie.genre || "Featured", 82, 94);

  context.fillStyle = "#ffffff";
  context.font = "700 28px Arial";
  context.fillText(`${movie.year || "Now"}  /  ${movie.rating || "NR"}`, 82, 628);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export default function CinemaOrbit3D({ movies }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const selectedRef = useRef(0);
  const hoverRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);

  const movieItems = useMemo(() => movies.slice(0, MAX_ORBIT_MOVIES), [movies]);
  const selectedMovie = movieItems[selectedIndex] || movieItems[0];

  useEffect(() => {
    selectedRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    hoverRef.current = hoverIndex;
  }, [hoverIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapRef.current;

    if (!canvas || !wrapper || movieItems.length === 0) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#0a0d12", 5, 12);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.66, 6.8);
    camera.lookAt(0, -0.06, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const ambientLight = new THREE.AmbientLight("#ffffff", 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight("#ffffff", 2.6, 10);
    keyLight.position.set(1.8, 3, 3.2);
    scene.add(keyLight);

    const sideLight = new THREE.PointLight("#14b8a6", 1.9, 8);
    sideLight.position.set(-3.2, 1.2, 2.4);
    scene.add(sideLight);

    const rig = new THREE.Group();
    scene.add(rig);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
    const posterMeshes = [];
    const textures = [];
    const count = movieItems.length;

    const baseRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.45, 0.012, 12, 180),
      new THREE.MeshBasicMaterial({ color: "#334155", transparent: true, opacity: 0.74 }),
    );
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -0.86;
    rig.add(baseRing);

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.18, 0.01, 12, 160),
      new THREE.MeshBasicMaterial({ color: "#14b8a6", transparent: true, opacity: 0.36 }),
    );
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = -0.88;
    rig.add(innerRing);

    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.58, 0.2, 64),
      new THREE.MeshStandardMaterial({
        color: "#1f2937",
        metalness: 0.55,
        roughness: 0.24,
      }),
    );
    core.position.y = -0.89;
    rig.add(core);

    movieItems.forEach((movie, index) => {
      const fallbackTexture = createFallbackPosterTexture(movie, index);
      textures.push(fallbackTexture);

      const frontMaterial = new THREE.MeshBasicMaterial({
        map: fallbackTexture,
        side: THREE.DoubleSide,
      });
      const backMaterial = new THREE.MeshBasicMaterial({
        map: fallbackTexture,
        side: THREE.DoubleSide,
      });

      const posterSource = getWebglPosterSource(movie.image || movie.cover);

      if (posterSource) {
        textureLoader.load(
          posterSource,
          (posterTexture) => {
            posterTexture.colorSpace = THREE.SRGBColorSpace;
            posterTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            textures.push(posterTexture);
            frontMaterial.map = posterTexture;
            backMaterial.map = posterTexture;
            frontMaterial.needsUpdate = true;
            backMaterial.needsUpdate = true;
          },
          undefined,
          () => undefined,
        );
      }

      const angle = (index / count) * Math.PI * 2;
      const radiusX = Math.max(2.72, count * 0.36);
      const radiusZ = Math.max(1.48, count * 0.2);
      const x = Math.sin(angle) * radiusX;
      const z = Math.cos(angle) * radiusZ;

      const card = new THREE.Group();
      card.position.set(x, 0.02, z);
      card.lookAt(0, 0.02, 0);

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.12, 1.7, 0.08),
        new THREE.MeshStandardMaterial({
          color: "#0f172a",
          metalness: 0.34,
          roughness: 0.28,
        }),
      );
      frame.position.z = -0.045;
      card.add(frame);

      const poster = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.5), frontMaterial);
      poster.position.z = 0.09;
      poster.userData.index = index;
      card.add(poster);
      posterMeshes.push(poster);

      const backPoster = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.5), backMaterial);
      backPoster.position.z = -0.09;
      backPoster.rotation.y = Math.PI;
      backPoster.userData.index = index;
      card.add(backPoster);
      posterMeshes.push(backPoster);

      const accentBar = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.02, 0.04),
        new THREE.MeshBasicMaterial({ color: ACCENTS[index % ACCENTS.length] }),
      );
      accentBar.position.set(0, -0.85, 0.05);
      card.add(accentBar);

      card.userData.baseY = card.position.y;
      card.userData.index = index;
      rig.add(card);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let rafId = 0;
    let pointerX = 0;
    let pointerY = 0;
    let autoRotation = 0;
    let previousTime = 0;

    function resize() {
      const { width, height } = wrapper.getBoundingClientRect();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function handlePointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointerX = pointer.x;
      pointerY = pointer.y;

      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(posterMeshes, false)[0];
      const nextHover = hit ? hit.object.userData.index : null;

      if (hoverRef.current !== nextHover) {
        hoverRef.current = nextHover;
        setHoverIndex(nextHover);
      }

      canvas.style.cursor = nextHover === null ? "grab" : "pointer";
    }

    function handlePointerLeave() {
      pointerX = 0;
      pointerY = 0;
      hoverRef.current = null;
      setHoverIndex(null);
      canvas.style.cursor = "grab";
    }

    function handlePointerDown() {
      if (hoverRef.current !== null) {
        setSelectedIndex(hoverRef.current);
      }
    }

    function animate(time) {
      const seconds = time * 0.001;
      const delta = previousTime ? Math.min((time - previousTime) * 0.001, 0.04) : 0;
      previousTime = time;
      const orbitSpeed = hoverRef.current === null ? 0.28 : 0.08;
      autoRotation += delta * orbitSpeed;

      const targetRotation = -selectedRef.current * ((Math.PI * 2) / count) + autoRotation;
      rig.rotation.y += (targetRotation + pointerX * 0.13 - rig.rotation.y) * 0.06;
      rig.rotation.x += (pointerY * -0.06 - rig.rotation.x) * 0.06;

      rig.children.forEach((child) => {
        if (child.userData.index === undefined) {
          return;
        }

        const isSelected = child.userData.index === selectedRef.current;
        const isHovered = child.userData.index === hoverRef.current;
        const targetScale = isSelected ? 1.22 : isHovered ? 1.1 : 0.93;
        child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        child.position.y =
          child.userData.baseY + Math.sin(seconds * 1.4 + child.userData.index) * 0.045;
      });

      baseRing.rotation.z = seconds * 0.08;
      innerRing.rotation.z = -seconds * 0.12;
      core.rotation.y = seconds * 0.34;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    resize();
    rafId = requestAnimationFrame(animate);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointerdown", handlePointerDown);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointerdown", handlePointerDown);

      textures.forEach((texture) => texture.dispose());
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, [movieItems]);

  if (!selectedMovie) {
    return null;
  }

  return (
    <section className="cinema-orbit" aria-label="Interactive 3D movie browser">
      <div className="cinema-orbit-copy">
        <div className="cinema-orbit-kicker">
          <Clapperboard size={16} />
          <span> movie deck</span>
        </div>
        <h2>Movie posters in orbit.</h2>
        <p>
          Browse featured movies through a floating cinema deck. Hover or tap a poster
          to focus it, then open the movie details from the side panel.
        </p>
      </div>

      <div className="cinema-orbit-stage" ref={wrapRef}>
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>

      <aside className="cinema-orbit-panel" aria-live="polite">
        <p className="cinema-orbit-label">Now focused</p>
        <h3>{selectedMovie.title}</h3>
        <div className="cinema-orbit-stats">
          <span>{selectedMovie.year || "Now"}</span>
          <span>{selectedMovie.rating || "NR"} rating</span>
          <span>{selectedMovie.genre || "Movie"}</span>
        </div>
        <div className="cinema-orbit-actions" aria-label="Featured movies">
          {movieItems.map((movie, index) => (
            <button
              className={index === selectedIndex ? "active-cinema-chip" : ""}
              key={movie.id}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="cinema-orbit-controls">
          <a
            href={`/movies/${selectedMovie.id}`}
            className="cinema-icon-button"
            aria-label="Open movie details"
          >
            <Play size={17} />
          </a>
          <button
            className="cinema-icon-button"
            onClick={() => setSelectedIndex(0)}
            type="button"
            aria-label="Reset 3D orbit"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </aside>
    </section>
  );
}
