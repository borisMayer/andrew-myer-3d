/**
 * LiveBook3D — "Libro Vivo" con animación de paso de página realista
 * Usa Three.js con @react-three/fiber + shaders custom para el efecto flip
 * Iluminación tipo vela/luz dorada, márgenes amplios tipo manuscrito
 */
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import gsap from 'gsap';

// ─── Page data ──────────────────────────────────────────────────────────────
interface PageData {
  pageNum: number;
  chapter: string;
  text:    string;
}

const PAGES_ENTRE_DOS_MUNDOS: PageData[] = [
  { pageNum: 1,  chapter: 'Prólogo',      text: 'Hay un momento en que el cuerpo deja de obedecer. No es dramático, al menos no como uno imagina. No hay oscuridad repentina ni cortina que caiga. Es más parecido a cuando el sonido de una habitación llena se apaga de golpe: un instante todo está ahí, y al siguiente ya no queda nada que sostener.' },
  { pageNum: 2,  chapter: 'Prólogo',      text: 'Yo estaba en una cama de hospital. El médico me miraba a través del vidrio con los ojos de alguien que ya ha visto demasiadas veces este final. Sus labios se movían, pero lo que yo escuchaba era otra cosa: el silencio que viene antes. Firmé un papel. Con ese gesto, entregué lo que quedaba de mi voluntad.' },
  { pageNum: 3,  chapter: 'Prefacio',     text: 'Lo que mis ojos vieron tras el velo —las jerarquías que gobiernan las sombras, la luz extraordinaria que emana del trono de Adonay, la naturaleza real de lo que habita las dimensiones invisibles de nuestra realidad— me parecía demasiado vasto para el lenguaje humano. Y también demasiado pesado para ponerlo en manos de quienes no habían estado allí.' },
  { pageNum: 4,  chapter: 'Prefacio',     text: 'Sin embargo, el silencio se volvió una carga insoportable ante una verdad que no pude seguir ignorando: estas experiencias no me fueron concedidas para mi beneficio personal, sino para servir como testimonio vivo de la realidad espiritual que nos rodea. Retener un testimonio cuando se te ha ordenado darlo no es discreción. Es desobediencia.' },
  { pageNum: 5,  chapter: 'I — El umbral',text: 'Lo que ocurrió después de ese instante, lo que mi alma vivió mientras mi cuerpo permanecía inmóvil en esa cama, conectado a una máquina que respiraba por mí, es la razón por la que este libro existe. Pero eso vendrá más adelante, en el momento en que el relato pueda sostener el peso de lo que hay que contar. Por ahora, basta con saber que crucé un umbral.' },
  { pageNum: 6,  chapter: 'I — El umbral',text: 'No fue un gesto heroico ni dramático. Fue pequeño, casi imperceptible. Pero en ese movimiento mínimo estaba todo: la renuncia a la renuncia, la decisión de dejar que otros lucharan por mí aunque yo mismo hubiera dejado de hacerlo. Un sí que costó más que cualquier no que haya pronunciado en mi vida.' },
  { pageNum: 7,  chapter: 'II — El testimonio', text: 'Porque lo que había vivido al otro lado del umbral no era una experiencia privada que uno guarda para sí como se guarda un sueño hermoso. Era un testimonio. Era información sobre la naturaleza del mundo espiritual, sobre el mal que opera en la tierra, sobre la gloria del Reino de Cristo, sobre el poder liberador de una oración que yo ni siquiera conocía.' },
  { pageNum: 8,  chapter: 'II — El testimonio', text: 'Escuché, en la quietud de esa mañana de rehabilitación, algo que ya había aprendido a reconocer a lo largo de toda mi vida: la voz del Espíritu de Adonay, que acariciaba mi mente con la suavidad firme de quien no está pidiendo sino instruyendo. No era una elección. Era un deber. Este libro no nació de mi deseo de contar. Nació de la obediencia.' },
  { pageNum: 9,  chapter: 'III — El regreso', text: 'Una mezcla de tristeza y alegría invadía mi ser en esas mañanas de recuperación: el anhelo de la eternidad que había probado, mezclado con la conciencia de que todavía tenía algo que hacer en este lado del velo. Con cada día que pasaba, la melancolía de este mundo se intensificaba. Pero también se intensificaba la certeza de para qué había regresado.' },
  { pageNum: 10, chapter: 'III — El regreso', text: 'Había aprendido, en el umbral entre la vida y la muerte, que el dolor del cuerpo y la paz del alma pueden coexistir. No como una contradicción que se resuelve, sino como una paradoja que se habita. Eso es exactamente lo que estaba ocurriendo: el cuerpo luchaba por reconstruirse mientras el alma ya sabía adónde pertenecía.' },
  { pageNum: 11, chapter: 'IV — Los orígenes', text: 'Hay cosas que solo se comprenden mirando hacia atrás. Hay una promesa hecha antes de mi nacimiento que mi madre guardó en silencio durante años. Hay una infancia marcada por una dualidad espiritual que yo tampoco elegí. Hay una formación que Adonay fue tejiendo pacientemente, sin que yo supiera que me estaba preparando para algo.' },
  { pageNum: 12, chapter: 'IV — Los orígenes', text: 'Se asentaron en un lugar donde la naturaleza es tan majestuosa como implacable: una tierra de montañas imponentes, glaciares milenarios, fiordos misteriosos, bosques encantados, ríos serpenteantes y lagos cristalinos. Una zona que se destaca por su naturaleza salvaje e inmaculada, con una diversidad de paisajes que en cualquier otro contexto sería simplemente paraíso.' },
  { pageNum: 13, chapter: 'V — La formación', text: 'La oscuridad forja. La capacidad para amar y perdonar no nació de una vida fácil, sino de un crisol de dolor que forjó el espíritu desde niña. Eso es exactamente lo que estaba ocurriendo: El Eterno, con Su soberana voluntad, dirigía los pasos de quienes me antecedían, preparando el terreno de lo que yo sería.' },
  { pageNum: 14, chapter: 'V — La formación', text: 'Mi madre, en medio de su desesperación más absoluta, en el punto más bajo que puede alcanzar un ser humano, elevó un clamor a Adonay que no venía de ningún libro de oraciones sino del fondo más hondo del ser, de ese lugar donde ya no quedan fórmulas ni rituales, solo el grito desnudo del alma ante su Creador.' },
  { pageNum: 15, chapter: 'VI — La promesa', text: 'La respuesta llegó no como un argumento que yo pudiera rebatir o aceptar según mi criterio, sino como una certeza que se instaló en mí con la misma autoridad con que todas las certezas verdaderas llegan: desde adentro, desde ese lugar donde el Espíritu habla sin necesidad de palabras pero con una claridad que excede a cualquier palabra.' },
];

// ─── 3D Page mesh ────────────────────────────────────────────────────────────
function BookPage({
  coverUrl, isOpen, isCover, isBack,
  flipProgress, side,
}: {
  coverUrl?: string; isOpen: boolean; isCover: boolean; isBack: boolean;
  flipProgress: number; side: 'left' | 'right';
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const tex  = coverUrl ? useTexture(coverUrl) : null;

  const W = 2.6, H = 3.6;

  const mat = useMemo(() => {
    if (tex) {
      return new THREE.MeshStandardMaterial({
        map: tex, roughness: 0.5, metalness: 0.0, side: THREE.DoubleSide,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f8f4ec'),
      roughness: 0.85, metalness: 0.0, side: THREE.DoubleSide,
    });
  }, [tex]);

  return (
    <mesh ref={mesh} material={mat}>
      <planeGeometry args={[W, H, 12, 1]} />
    </mesh>
  );
}

// ─── Full 3D Book ─────────────────────────────────────────────────────────────
function Book3D({
  currentPage, targetPage, isFlipping, onFlipDone, coverSrc,
}: {
  currentPage: number; targetPage: number; isFlipping: boolean;
  onFlipDone: () => void; coverSrc: string;
}) {
  const bookGroup = useRef<THREE.Group>(null);
  const pageRef   = useRef<THREE.Mesh>(null);
  const flipRef   = useRef(0);

  const coverTex = useTexture(coverSrc);
  const pagePaperColor = new THREE.Color('#f5f0e8');
  const coverMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: coverTex, roughness: 0.4, metalness: 0.05, side: THREE.DoubleSide,
  }), [coverTex]);
  const paperMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: pagePaperColor, roughness: 0.9, metalness: 0.0, side: THREE.DoubleSide,
  }), []);
  const spineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a1412'), roughness: 0.6, metalness: 0.1,
  }), []);

  // Gentle breathing animation
  useFrame((state) => {
    if (!bookGroup.current) return;
    const t = state.clock.elapsedTime;
    bookGroup.current.rotation.y = Math.sin(t * 0.2) * 0.04;
    bookGroup.current.position.y = Math.sin(t * 0.35) * 0.03;

    // Flip animation
    if (isFlipping && pageRef.current) {
      flipRef.current += 0.06;
      if (flipRef.current >= 1) {
        flipRef.current = 0;
        onFlipDone();
      }
      // Fold along Y axis — left half flips right
      const angle = -(flipRef.current * Math.PI);
      pageRef.current.rotation.y = angle;
      pageRef.current.position.x = Math.sin(flipRef.current * Math.PI) * 0.2;
      pageRef.current.position.z = Math.sin(flipRef.current * Math.PI) * 0.25;
    }
  });

  const W = 2.5, H = 3.6, D = 0.06;
  const totalW = W * 2 + D;

  return (
    <group ref={bookGroup} position={[0, 0, 0]}>
      {/* Left cover */}
      <mesh material={coverMat} position={[-W/2 - D/2, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[W, H, 0.02]} />
      </mesh>

      {/* Right cover (back) */}
      <mesh material={spineMat} position={[W/2 + D/2, 0, 0]}>
        <boxGeometry args={[W, H, 0.02]} />
      </mesh>

      {/* Spine */}
      <mesh material={spineMat} position={[0, 0, 0]}>
        <boxGeometry args={[D, H, W * 0.5]} />
      </mesh>

      {/* Pages block (left side) */}
      <mesh material={paperMat} position={[-W/2 - D/2, 0, 0.01]}>
        <boxGeometry args={[W - 0.1, H - 0.1, 0.15]} />
      </mesh>

      {/* Pages block (right side) */}
      <mesh material={paperMat} position={[W/2 + D/2, 0, 0.01]}>
        <boxGeometry args={[W - 0.1, H - 0.1, 0.15]} />
      </mesh>

      {/* Flipping page */}
      {isFlipping && (
        <group position={[0, 0, 0.12]}>
          <mesh ref={pageRef} material={paperMat}>
            <planeGeometry args={[W, H, 8, 1]} />
          </mesh>
        </group>
      )}

      {/* Page edge gold detail */}
      <mesh position={[totalW/2 - 0.01, 0, 0.01]}>
        <boxGeometry args={[0.02, H, 0.18]} />
        <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Bottom/Top edge details */}
      {[-H/2, H/2].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[totalW, 0.03, 0.25]} />
          <meshStandardMaterial color="#d4b558" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────
function BookScene({ currentPage, targetPage, isFlipping, onFlipDone, coverSrc }: {
  currentPage: number; targetPage: number; isFlipping: boolean;
  onFlipDone: () => void; coverSrc: string;
}) {
  return (
    <>
      {/* Warm candlelight atmosphere */}
      <ambientLight intensity={0.15} color="#e8d9bc" />
      <pointLight position={[3, 4, 3]}   intensity={1.8} color="#f5e8c0" distance={12} decay={2} />
      <pointLight position={[-2, 2, 2]}  intensity={0.6} color="#e8c87a" distance={8}  decay={2} />
      <pointLight position={[0, -2, 3]}  intensity={0.3} color="#d4aa60" distance={6}  decay={2} />
      {/* Cool fill from back */}
      <pointLight position={[0, 3, -4]}  intensity={0.2} color="#c8d0e0" distance={10} decay={2} />

      <Book3D
        currentPage={currentPage} targetPage={targetPage}
        isFlipping={isFlipping} onFlipDone={onFlipDone} coverSrc={coverSrc}
      />

      <OrbitControls
        enablePan={false} enableZoom={false}
        minPolarAngle={Math.PI * 0.3} maxPolarAngle={Math.PI * 0.65}
        minAzimuthAngle={-Math.PI * 0.3} maxAzimuthAngle={Math.PI * 0.3}
        autoRotate={false} dampingFactor={0.08} enableDamping
      />

      <EffectComposer>
        <Bloom intensity={0.35} luminanceThreshold={0.6} mipmapBlur radius={0.4} />
      </EffectComposer>
    </>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────
interface LiveBookProps {
  bookId:  string;
  coverSrc: string;
  title:   string;
  onClose: () => void;
}

export default function LiveBook({ bookId, coverSrc, title, onClose }: LiveBookProps) {
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover
  const [isFlipping,  setIsFlipping]  = useState(false);
  const [targetPage,  setTargetPage]  = useState(0);
  const [showText,    setShowText]    = useState(true);
  const textPanelRef = useRef<HTMLDivElement>(null);
  const pages = PAGES_ENTRE_DOS_MUNDOS;

  const isCover = currentPage === 0;
  const pageData = isCover ? null : pages[Math.min(currentPage - 1, pages.length - 1)];

  const flipTo = useCallback((next: number) => {
    if (isFlipping) return;
    // Fade out text
    gsap.to(textPanelRef.current, { opacity: 0, y: -8, duration: 0.2, onComplete: () => {
      setTargetPage(next);
      setIsFlipping(true);
    }});
  }, [isFlipping]);

  const handleFlipDone = useCallback(() => {
    setIsFlipping(false);
    setCurrentPage(targetPage);
    gsap.fromTo(textPanelRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 });
  }, [targetPage]);

  const nextPage = () => { if (currentPage < pages.length) flipTo(currentPage + 1); };
  const prevPage = () => { if (currentPage > 0) flipTo(currentPage - 1); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft')  prevPage();
      if (e.key === 'Escape')     onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [currentPage, isFlipping]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: '#05040a',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.9rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
        background: 'rgba(5,4,10,0.95)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(180,155,90,0.5)' }}>
            Libro Vivo
          </span>
          <span style={{ width:'1px', height:'14px', background:'rgba(255,255,255,0.1)', display:'inline-block' }} />
          <span style={{ fontFamily:'var(--font-serif)', fontSize:'0.9rem', fontStyle:'italic', color:'rgba(220,215,205,0.75)' }}>
            {title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Page indicator */}
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.12em', color:'rgba(160,155,145,0.45)' }}>
            {isCover ? 'Portada' : `${currentPage} / ${pages.length}`}
          </span>
          {/* Close */}
          <button onClick={onClose} style={{
            background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
            color:'rgba(155,160,170,0.5)', borderRadius:'2px',
            width:'30px', height:'30px', cursor:'pointer', fontSize:'12px',
            display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color='rgba(220,215,205,0.8)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='rgba(155,160,170,0.5)'; }}>
            ✕
          </button>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* 3D Book viewport */}
        <div style={{ flex: '0 0 55%', position: 'relative' }}>
          <Canvas
            camera={{ position: [0, 0.5, 6.5], fov: 42 }}
            gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            style={{ background: 'radial-gradient(ellipse at 40% 40%, #1a1208 0%, #08060f 50%, #020108 100%)' }}
          >
            <BookScene
              currentPage={currentPage} targetPage={targetPage}
              isFlipping={isFlipping} onFlipDone={handleFlipDone}
              coverSrc={coverSrc}
            />
          </Canvas>

          {/* Prev / Next overlay arrows */}
          <button onClick={prevPage} disabled={currentPage === 0 || isFlipping}
            style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', background:'rgba(10,8,16,0.7)', border:'1px solid rgba(255,255,255,0.08)', color: currentPage === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(180,155,90,0.65)', borderRadius:'2px', width:'36px', height:'48px', cursor: currentPage === 0 ? 'default' : 'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', backdropFilter:'blur(8px)' }}
            onMouseEnter={e => { if (currentPage > 0) e.currentTarget.style.background='rgba(20,15,30,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(10,8,16,0.7)'; }}>
            ‹
          </button>

          <button onClick={nextPage} disabled={currentPage >= pages.length || isFlipping}
            style={{ position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', background:'rgba(10,8,16,0.7)', border:'1px solid rgba(255,255,255,0.08)', color: currentPage >= pages.length ? 'rgba(255,255,255,0.12)' : 'rgba(180,155,90,0.65)', borderRadius:'2px', width:'36px', height:'48px', cursor: currentPage >= pages.length ? 'default' : 'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s', backdropFilter:'blur(8px)' }}
            onMouseEnter={e => { if (currentPage < pages.length) e.currentTarget.style.background='rgba(20,15,30,0.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(10,8,16,0.7)'; }}>
            ›
          </button>

          {/* Keyboard hint */}
          <p style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)', fontFamily:'var(--font-mono)', fontSize:'7.5px', letterSpacing:'0.12em', color:'rgba(155,150,140,0.25)', textTransform:'uppercase', whiteSpace:'nowrap' }}>
            ← → para navegar · arrastra para rotar
          </p>
        </div>

        {/* ── Text panel ─────────────────────────────────────── */}
        <div style={{
          flex: '0 0 45%',
          background: 'rgba(8,7,12,0.95)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>
          {/* Warm top gradient */}
          <div style={{ height: '3px', background: 'linear-gradient(to right, transparent, rgba(180,155,90,0.35), transparent)', flexShrink: 0 }} />

          <div ref={textPanelRef} style={{
            padding: '3rem 2.5rem 3rem',
            flex: 1, display: 'flex', flexDirection: 'column',
          }}>
            {isCover ? (
              /* Cover page content */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(180,155,90,0.5)', marginBottom:'1.5rem' }}>
                  Andrew Myer
                </p>
                <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(1.6rem,2.8vw,2.4rem)', fontWeight:400, color:'rgba(238,232,220,0.95)', lineHeight:1.15, marginBottom:'1rem' }}>
                  {title}
                </h2>
                <div style={{ width:'40px', height:'1px', background:'rgba(180,155,90,0.4)', marginBottom:'1.5rem' }} />
                <p style={{ fontFamily:'var(--font-serif)', fontStyle:'italic', fontSize:'1rem', color:'rgba(185,178,165,0.65)', lineHeight:1.75, marginBottom:'2.5rem' }}>
                  «Este libro es el intento de contar lo que ocurrió al otro lado del umbral.
                  No espero que lo crean. Solo pido que lo lean.»
                </p>
                <p style={{ fontFamily:'var(--font-sans)', fontSize:'0.8rem', color:'rgba(140,145,155,0.5)', lineHeight:1.7, fontWeight:300, marginBottom:'2rem' }}>
                  Puedes leer las primeras 15 páginas de esta obra. Utiliza las flechas o las teclas ← → para navegar.
                </p>
                <button onClick={nextPage} style={{
                  alignSelf:'flex-start', padding:'0.7rem 1.5rem',
                  background:'rgba(180,155,90,0.1)', border:'1px solid rgba(180,155,90,0.35)',
                  color:'rgba(190,165,75,0.85)', borderRadius:'2px', cursor:'pointer',
                  fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.14em', textTransform:'uppercase',
                  transition:'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(180,155,90,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(180,155,90,0.1)'; }}>
                  Comenzar lectura →
                </button>
              </div>
            ) : (
              /* Interior pages */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Chapter header */}
                <div style={{ marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(180,155,90,0.4)', marginBottom:'0.35rem' }}>
                    {pageData?.chapter}
                  </p>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.12em', color:'rgba(120,125,135,0.4)' }}>
                    Página {pageData?.pageNum}
                  </p>
                </div>

                {/* Drop cap + text */}
                <div style={{ flex: 1, position: 'relative' }}>
                  {/* Large drop cap */}
                  <span style={{
                    float: 'left', fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(3.5rem,6vw,5rem)', lineHeight: 0.82,
                    color: 'rgba(180,155,90,0.22)', marginRight: '0.08em',
                    marginTop: '0.1em', fontWeight: 400,
                  }}>
                    {pageData?.text.charAt(0)}
                  </span>

                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1rem,1.6vw,1.15rem)',
                    lineHeight: 1.95,
                    color: 'rgba(215,208,198,0.88)',
                    fontWeight: 400,
                    margin: 0,
                    letterSpacing: '0.01em',
                    textAlign: 'justify',
                  }}>
                    {pageData?.text}
                  </p>
                </div>

                {/* Page bottom */}
                <div style={{ marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', letterSpacing:'0.12em', color:'rgba(120,125,135,0.35)', textTransform:'uppercase' }}>
                    Entre Dos Mundos, Vol. I
                  </span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'rgba(180,155,90,0.3)' }}>
                    {pageData?.pageNum}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom progress bar ──────────────────────────────── */}
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.04)', flexShrink: 0 }}>
        <div style={{
          height: '100%', transition: 'width 0.4s ease',
          background: 'linear-gradient(to right, rgba(180,155,90,0.5), rgba(200,175,90,0.3))',
          width: `${(currentPage / pages.length) * 100}%`,
        }} />
      </div>
    </div>
  );
}
