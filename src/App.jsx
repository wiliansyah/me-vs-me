import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Baby, Ghost, Brain, Zap, Clock, Anchor, AlertTriangle, 
  Globe, Sparkles, Rocket, Coffee, Lock, Unlock,
  PlayCircle, PauseCircle, ChevronRight, ChevronLeft,
  Smile, Frown, Skull, Heart, CloudRain, Sun,
  TrendingUp, MousePointer2, XCircle, Search, Hash,
  LayoutGrid, BookOpen, Star, AlertOctagon,
  ArrowRight, RefreshCw, CheckCircle2, Wind, Hammer, Map, Feather,
  Shield, Flame, Fingerprint, Bug
} from 'lucide-react';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // --- INTERACTIVE STATES ---
  const [distractionCount, setDistractionCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0); // 0, 25, 50, 75, 100
  const [entropyLevel, setEntropyLevel] = useState(false); // false = Order, true = Chaos
  const [nihilismMode, setNihilismMode] = useState('dread');
  
  // Slide Specific States
  const [confessionRevealed, setConfessionRevealed] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [timelineActive, setTimelineActive] = useState(false);
  const [matrixFocus, setMatrixFocus] = useState(null); 
  const [lifeViewMode, setLifeViewMode] = useState('simple');
  const [steeringControl, setSteeringControl] = useState(10);
  const [revealedFigures, setRevealedFigures] = useState({});
  const [wuweiState, setWuweiState] = useState('force');
  const [kintsugiRepaired, setKintsugiRepaired] = useState(false);
  
  // Toolkit State
  const [contractSigned, setContractSigned] = useState(false);

  // --- NAVIGATION ---
  const nextSlide = () => {
    setCurrentSlide(c => Math.min(c + 1, slides.length - 1));
    // Reset slide-specific states
    setTimelineProgress(0);
    setTimelineActive(false);
    setConfessionRevealed(false);
    setMatrixFocus(null);
    setKintsugiRepaired(false);
    setContractSigned(false);
  };
  
  const prevSlide = () => setCurrentSlide(c => Math.max(c - 1, 0));

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSlide]);

  // Timeline Animation Loop
  useEffect(() => {
    let interval;
    if (timelineActive && timelineProgress < 100) {
      interval = setInterval(() => {
        setTimelineProgress(prev => {
          if (prev >= 100) {
            setTimelineActive(false);
            return 100;
          }
          const increment = prev > 80 ? 1.5 : 0.2; 
          return prev + increment;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [timelineActive, timelineProgress]);

  // --- SUB-COMPONENTS ---

  // 1. STEERING WHEEL
  const SteeringWheelSim = () => {
    return (
      <div className="w-full max-w-5xl flex flex-col items-center z-10">
        <h2 className="text-6xl font-black mb-16">{slides[currentSlide].title}</h2>
        <div 
          className="relative w-full h-32 bg-slate-200 rounded-full flex overflow-hidden shadow-inner cursor-pointer group"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            setSteeringControl(Math.max(5, Math.min(95, percent)));
          }}
          onMouseLeave={() => setSteeringControl(10)}
        >
           <div className="bg-blue-500 h-full flex items-center justify-center text-white font-bold text-xs transition-all duration-300 ease-out border-r-4 border-white relative" style={{ width: `${steeringControl}%` }}>
             <span className="absolute left-4 text-lg">YOU</span>
           </div>
           <div className="bg-orange-500 h-full flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ease-out relative" style={{ width: `${100 - steeringControl}%` }}>
             <span className="absolute right-8 text-2xl animate-wiggle">MONKEY</span>
           </div>
           
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">Drag to Fight</div>
           </div>
        </div>
        <p className="mt-8 text-2xl opacity-60">{steeringControl > 50 ? "Fighting for control..." : "The Monkey has the wheel."}</p>
     </div>
    );
  };

  // 2. COSMIC ZOOM (Clickable Stages + Constant Slow Speed)
  const CosmicZoom = () => {
    const canvasRef = useRef(null);
    const requestRef = useRef();

    const stages = [
        { label: "MICRO", val: 0, icon: <User size={40}/>, desc: "Room" },
        { label: "LOCAL", val: 25, icon: <TrendingUp size={40}/>, desc: "City" },
        { label: "PLANET", val: 50, icon: <Globe size={40}/>, desc: "Earth" },
        { label: "STELLAR", val: 75, icon: <Sun size={40}/>, desc: "System" },
        { label: "COSMIC", val: 100, icon: <Sparkles size={40}/>, desc: "Universe" }
    ];

    const currentStage = stages.find(s => s.val === zoomLevel) || stages[0];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Handle DPI for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        let width = rect.width;
        let height = rect.height;
        
        // Star initialization
        const stars = Array.from({ length: 800 }).map(() => ({
            x: Math.random() * width - width / 2,
            y: Math.random() * height - height / 2,
            z: Math.random() * width // Depth from 0 to width
        }));

        const render = () => {
            // CONSTANT SLOW SPEED
            // Stars move AWAY (Z increases), converging to center
            const speed = 1.5; 
            
            // Clear screen
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, width, height);

            stars.forEach(star => {
                // Move star deeper into space
                star.z += speed;
                
                // Reset if too far (passed the "far plane")
                if (star.z > width) {
                    star.z = 1; // Bring back to front (near plane)
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                }

                // Perspective Projection
                // k = fov / z. 
                // As z gets bigger, k gets smaller -> point moves towards center (0,0)
                const k = 250.0 / star.z;
                const px = star.x * k + width / 2;
                const py = star.y * k + height / 2;

                // Only draw if within bounds
                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    // Visual tricks for depth:
                    // 1. Size: closer (small z) = bigger. Further (large z) = smaller.
                    const size = Math.max(0.2, (1 - star.z / width) * 3);
                    
                    // 2. Opacity: Fade out as they go far away
                    const opacity = 1 - (star.z / width);
                    const shade = parseInt(opacity * 255);
                    
                    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            requestRef.current = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            width = rect.width;
            height = rect.height;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(requestRef.current);
        };
    }, []); // Run once. No dependency on zoomLevel for the loop itself.

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-black text-white">
         <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" style={{width:'100%', height:'100%'}}/>
         
         <div className="relative z-10 text-center p-12 backdrop-blur-sm bg-black/60 rounded-3xl border border-white/10 shadow-2xl transition-all duration-500 pointer-events-auto max-w-4xl w-full">
            <div className="flex justify-center items-center gap-4 md:gap-12 mb-12 flex-wrap">
               {stages.map((stage) => (
                   <button 
                     key={stage.val}
                     onClick={() => setZoomLevel(stage.val)}
                     className={`flex flex-col items-center gap-4 transition-all duration-300 group ${zoomLevel === stage.val ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-70'}`}
                   >
                      <div className={`p-4 rounded-full border-2 transition-colors ${zoomLevel === stage.val ? 'bg-white text-black border-white' : 'border-white text-white'}`}>
                         {stage.icon}
                      </div>
                      <span className="font-mono text-xs tracking-widest uppercase hidden md:block">{stage.desc}</span>
                   </button>
               ))}
            </div>

            <div className="h-32 flex flex-col items-center justify-center animate-fade-in">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-white" key={currentStage.label}>
                {currentStage.label}
                </h2>
                <p className="text-lg md:text-xl text-blue-200 font-serif italic opacity-80 max-w-2xl">
                    {zoomLevel === 0 && "Your messy room. The center of your anxiety."}
                    {zoomLevel === 25 && "Your city. Millions of lives ignoring you."}
                    {zoomLevel === 50 && "Earth. A wet rock spinning in the dark."}
                    {zoomLevel === 75 && "The Solar System. Mostly empty space."}
                    {zoomLevel === 100 && "The Universe. You are not even a pixel here."}
                </p>
            </div>
         </div>
      </div>
    );
  };

  // 3. BASKET CASES
  const HistoricalBasketCases = () => {
    const figures = [
      { id: 'vangogh', name: "Van Gogh", suffering: "Severe Depression", desc: "Ate yellow paint to feel happy.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg/440px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg" },
      { id: 'nietzsche', name: "Nietzsche", suffering: "Existential Dread", desc: "Went mad seeing a horse beaten.", img: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Nietzsche187a.jpg" },
      { id: 'lincoln', name: "A. Lincoln", suffering: "Melancholy", desc: "Suicidal depression.", img: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg" },
      { id: 'you', name: "You", suffering: "Modern Anxiety", desc: "Afraid of emails. Still worthy.", icon: <Smile size={80} className="text-yellow-400 bg-black rounded-full"/> },
    ];

    const toggleReveal = (id) => {
      setRevealedFigures(prev => ({...prev, [id]: !prev[id]}));
    };

    return (
      <div className="w-full max-w-6xl z-10">
         <h2 className="text-5xl font-serif font-bold text-amber-50 mb-4 text-center">Historical Basket Cases</h2>
         <p className="text-slate-400 text-center mb-12 font-serif italic">Click to reveal the human beneath the genius.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {figures.map((fig) => {
               const isRevealed = revealedFigures[fig.id];
               return (
                 <div 
                   key={fig.id} 
                   onClick={() => toggleReveal(fig.id)}
                   className={`
                     h-80 cursor-pointer rounded-xl overflow-hidden relative flex flex-col items-center justify-center text-center transition-all duration-500 border border-white/10
                     ${isRevealed ? 'bg-white/10 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'bg-black hover:bg-white/5'}
                   `}
                 >
                    {!isRevealed ? (
                      <div className="animate-pulse p-4">
                        <AlertOctagon size={48} className="text-red-900 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-red-800 uppercase tracking-widest mb-2">Diagnosis</h3>
                        <p className="text-red-900/60 font-serif text-lg">"{fig.suffering}"</p>
                        <p className="mt-8 text-xs text-slate-600 uppercase font-bold tracking-widest border border-slate-800 px-3 py-1 inline-block rounded-full">Tap to Diagnose</p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center animate-fade-in w-full h-full bg-slate-900">
                        {fig.img ? (
                            <div className="w-full h-full relative">
                                <img src={fig.img} alt={fig.name} className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center opacity-100 p-8">{fig.icon}</div>
                        )}
                        <div className="p-4 absolute bottom-0 w-full text-center">
                            <h3 className="text-xl font-bold text-amber-200 mb-1">{fig.name}</h3>
                            <p className="text-slate-300 font-serif leading-tight text-sm">{fig.desc}</p>
                        </div>
                      </div>
                    )}
                 </div>
               );
            })}
         </div>
      </div>
    );
  };

  // 4. ENTROPY SIMULATOR (Physics Burst)
  const EntropySimulator = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const frameRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = 320 * dpr;
        ctx.scale(dpr, dpr);
        const width = rect.width;
        const height = 320;

        // Initialize particles
        const cols = 10;
        const rows = 8;
        const cellW = width / cols;
        const cellH = height / rows;

        if (particlesRef.current.length === 0) {
            for(let i=0; i<80; i++) {
                const targetX = (i % cols) * cellW + cellW/2;
                const targetY = Math.floor(i / cols) * cellH + cellH/2;
                particlesRef.current.push({
                    x: targetX,
                    y: targetY,
                    targetX: targetX,
                    targetY: targetY,
                    vx: (Math.random()-0.5)*2,
                    vy: (Math.random()-0.5)*2
                });
            }
        }

        // SCATTER LOGIC: When switching to Order, give a random kick first
        if (!entropyLevel) {
            particlesRef.current.forEach(p => {
                // Random burst to simulate "shuffling" before organizing
                p.vx = (Math.random() - 0.5) * 20; 
                p.vy = (Math.random() - 0.5) * 20; 
            });
        }

        const render = () => {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, width, height);

            // Label
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.font = '900 60px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(entropyLevel ? "CHAOS" : "ORDER", width/2, height/2);

            particlesRef.current.forEach(p => {
                if (entropyLevel) {
                    // CHAOS: Random velocities, bounce off walls
                    p.vx += (Math.random() - 0.5) * 0.5;
                    p.vy += (Math.random() - 0.5) * 0.5;
                    
                    // Cap speed
                    const speedLimit = 8;
                    p.vx = Math.max(-speedLimit, Math.min(speedLimit, p.vx));
                    p.vy = Math.max(-speedLimit, Math.min(speedLimit, p.vy));

                    // Bounce
                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;

                } else {
                    // ORDER: Organic steering towards home
                    const dx = p.targetX - p.x;
                    const dy = p.targetY - p.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist > 0) {
                        // Spring/Magnet force proportional to distance but capped
                        const force = 0.02; // Strength of pull
                        p.vx += dx * force;
                        p.vy += dy * force;
                        
                        // Damping (Friction) to stop them from orbiting forever
                        p.vx *= 0.90;
                        p.vy *= 0.90;
                    }
                }

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = entropyLevel ? '#f87171' : '#fcd34d'; // Red for chaos, Amber for order
                ctx.fill();
            });

            frameRef.current = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frameRef.current);
    }, [entropyLevel]);
    
    return (
       <div className="w-full max-w-3xl mx-auto">
          <div className="relative h-80 bg-black border border-white/10 rounded-2xl overflow-hidden mb-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{width:'100%', height:'100%'}}/>
          </div>
          <div className="flex justify-center gap-6">
             <button onClick={() => setEntropyLevel(true)} className={`px-8 py-3 rounded-full font-serif italic transition-all border ${entropyLevel ? 'bg-white text-black border-white' : 'bg-transparent text-slate-500 border-slate-700'}`}>Release Control</button>
             <button onClick={() => setEntropyLevel(false)} className={`px-8 py-3 rounded-full font-serif italic transition-all border ${!entropyLevel ? 'bg-white text-black border-white' : 'bg-transparent text-slate-500 border-slate-700'}`}>Attempt Organize</button>
          </div>
       </div>
    );
  }

  // 5. RIVER OF LIFE (Unified Boat)
  const WuWeiBoat = () => {
    const canvasRef = useRef(null);
    const frameRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        let width = rect.width;
        let height = rect.height;

        let time = 0;

        const drawPaperBoat = (x, y, color, direction) => {
            ctx.save();
            ctx.translate(x, y);
            // Flip for direction (1 = right, -1 = left)
            ctx.scale(direction, 1); 
            
            // Hull
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(30, 0);
            ctx.lineTo(15, 20);
            ctx.lineTo(-15, 20);
            ctx.closePath();
            ctx.fill();
            
            // Sail
            ctx.fillStyle = '#ffffff'; 
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -40);
            ctx.lineTo(25, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        const render = () => {
            time += 0.05;
            
            // Clear Background
            ctx.fillStyle = wuweiState === 'force' ? '#450a0a' : '#020617'; 
            ctx.fillRect(0, 0, width, height);
            
            ctx.lineWidth = 3;
            
            // Draw Waves
            for (let y = 0; y < height; y += 30) {
                ctx.beginPath();
                if (wuweiState === 'force') {
                    // FORCE: Red, Turbulent
                    ctx.strokeStyle = `rgba(239, 68, 68, ${0.1 + Math.random()*0.2})`;
                    for (let x = 0; x <= width; x += 20) {
                        const yOff = Math.sin(x * 0.05 + time * 8) * 15 + (Math.random() * 5);
                        if (x===0) ctx.moveTo(x, y + yOff);
                        else ctx.lineTo(x, y + yOff);
                    }
                } else {
                    // FLOW: Blue, Smooth
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 + Math.sin(y+time)*0.1})`;
                    for (let x = 0; x <= width; x += 10) {
                        const yOff = Math.sin(x * 0.02 + time) * 15;
                        if (x===0) ctx.moveTo(x, y + yOff);
                        else ctx.lineTo(x, y + yOff);
                    }
                }
                ctx.stroke();
            }

            // Draw Boat
            if (wuweiState === 'force') {
                // FORCE: Left facing, struggling, Red
                const boatX = width * 0.3;
                const shakeX = Math.random() * 4 - 2;
                const shakeY = Math.sin(time * 10) * 5 + (Math.random() * 4 - 2);
                const rotation = -0.1 + Math.sin(time * 15) * 0.1;
                
                ctx.save();
                ctx.translate(boatX + shakeX, height/2 + shakeY);
                ctx.rotate(rotation);
                drawPaperBoat(0, 0, '#ef4444', -1); // -1 = Face Left
                ctx.restore();

            } else {
                // FLOW: Right facing, smooth, Blue
                const boatX = (time * 60) % (width + 200) - 100; 
                const bobY = Math.sin(time * 2) * 8;
                const rotation = Math.sin(time) * 0.05;

                ctx.save();
                ctx.translate(boatX, height/2 + bobY);
                ctx.rotate(rotation);
                drawPaperBoat(0, 0, '#3b82f6', 1); // 1 = Face Right
                ctx.restore();
            }

            frameRef.current = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frameRef.current);
    }, [wuweiState]);

    return (
      <div className="w-full max-w-5xl bg-white p-12 rounded-[3rem] border-8 border-slate-900 shadow-2xl text-center overflow-hidden relative">
         <h3 className="text-4xl font-serif font-bold text-slate-800 mb-8 relative z-10">The River of Life</h3>
         
         <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-8 border-4 border-slate-900 bg-black">
            <canvas ref={canvasRef} className="w-full h-full block" style={{width: '100%', height: '100%'}} />
            
            <div className={`absolute top-4 left-4 px-3 py-1 rounded font-bold text-xs uppercase tracking-widest text-white transition-opacity duration-500 ${wuweiState === 'force' ? 'bg-red-600 opacity-100' : 'opacity-0'}`}>
                 Resistance (Upstream)
            </div>
            <div className={`absolute top-4 right-4 px-3 py-1 rounded font-bold text-xs uppercase tracking-widest text-white transition-opacity duration-500 ${wuweiState === 'flow' ? 'bg-blue-600 opacity-100' : 'opacity-0'}`}>
                 Flow (Downstream)
            </div>
         </div>

         <div className="flex justify-center gap-8 relative z-10">
            <button onClick={() => setWuweiState('force')} className={`group px-8 py-4 rounded-xl font-bold border-4 transition-all ${wuweiState === 'force' ? 'bg-red-100 border-red-600 text-red-900 scale-105' : 'border-slate-200 text-slate-400 hover:border-red-200'}`}>
              <div className="text-2xl mb-1">🔥 FORCE</div>
              <div className="text-xs font-normal">Fight against the current.</div>
            </button>
            <button onClick={() => setWuweiState('flow')} className={`group px-8 py-4 rounded-xl font-bold border-4 transition-all ${wuweiState === 'flow' ? 'bg-blue-100 border-blue-600 text-blue-900 scale-105' : 'border-slate-200 text-slate-400 hover:border-blue-200'}`}>
              <div className="text-2xl mb-1">🌊 FLOW</div>
              <div className="text-xs font-normal">Navigate with the current.</div>
            </button>
         </div>
      </div>
    )
  }

  // 6. GLORIOUS MESS (Improved Kintsugi)
  const KintsugiRepair = () => {
    return (
       <div className="w-full max-w-4xl text-center">
          <h2 className="text-6xl font-black mb-12 text-slate-800">The Glorious Mess</h2>
          <div 
             className="relative w-80 h-80 mx-auto cursor-pointer group"
             onClick={() => setKintsugiRepaired(true)}
          >
             {/* Broken Vessel Parts */}
             <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${kintsugiRepaired ? 'scale-100 rotate-0 gap-0' : 'scale-110 rotate-3 gap-2'}`}>
                {/* Left Half */}
                <div className={`absolute left-0 top-0 w-1/2 h-full bg-slate-200 rounded-l-full overflow-hidden transition-all duration-1000 ${kintsugiRepaired ? 'translate-x-0 translate-y-0 rotate-0' : '-translate-x-4 -translate-y-2 -rotate-6'}`}>
                    <div className="absolute inset-0 bg-slate-300 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                </div>
                {/* Right Half */}
                <div className={`absolute right-0 top-0 w-1/2 h-full bg-slate-200 rounded-r-full overflow-hidden transition-all duration-1000 ${kintsugiRepaired ? 'translate-x-0 translate-y-0 rotate-0' : 'translate-x-4 translate-y-2 rotate-6'}`}>
                    <div className="absolute inset-0 bg-slate-300 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                </div>
                
                {/* The Crack/Gold Seam */}
                <div className={`absolute left-1/2 top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_15px_gold] transition-all duration-1000 delay-500 z-10 ${kintsugiRepaired ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}></div>
                <div className={`absolute left-1/2 top-1/4 w-8 h-1 bg-amber-400 shadow-[0_0_15px_gold] -translate-x-1/2 rotate-45 transition-all duration-1000 delay-700 ${kintsugiRepaired ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute left-1/2 top-3/4 w-12 h-1 bg-amber-400 shadow-[0_0_15px_gold] -translate-x-1/2 -rotate-12 transition-all duration-1000 delay-800 ${kintsugiRepaired ? 'opacity-100' : 'opacity-0'}`}></div>
             </div>
             
             {/* Icon Overlay */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Heart size={120} className={`transition-all duration-1000 ${kintsugiRepaired ? 'text-red-500 scale-100' : 'text-slate-400/50 scale-75'}`} fill="currentColor" />
             </div>

             {!kintsugiRepaired && (
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white px-6 py-2 rounded-full font-bold animate-bounce shadow-xl">
                   Tap to Repair
                </div>
             )}
          </div>
          
          <div className={`mt-16 transition-all duration-1000 ${kintsugiRepaired ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <h3 className="text-3xl font-serif text-amber-600 mb-2 font-bold">Kintsugi (金継ぎ)</h3>
             <p className="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">"To repair with gold."<br/>The flaw becomes part of the history. It becomes the most beautiful part.</p>
          </div>
       </div>
    )
  }

  // 7. TOOLKIT GAMIFICATION (Contract)
  const ToolkitEquip = () => {
    const [equipped, setEquipped] = useState([]);
    const tools = [
      { id: 'aware', name: "Meta-Awareness", icon: "👁️", desc: "Watch the Monkey. Don't fight him. Just notice him." },
      { id: 'start', name: "The 5-Min Rule", icon: "⏱️", desc: "Commit to 5 minutes. That's it. Usually you'll keep going." },
      { id: 'forgive', name: "Self-Compassion", icon: "❤️", desc: "Guilt fuels the procrastination loop. Forgive yourself." },
      { id: 'dead', name: "Memento Mori", icon: "💀", desc: "You are going to die. Might as well write the book." }
    ];

    const toggleTool = (id) => {
      setEquipped(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
      <div className="w-full max-w-5xl z-10 text-center">
         {!contractSigned ? (
            <>
                <h2 className="text-6xl font-bold text-emerald-900 mb-4">Choose Your Loadout</h2>
                <p className="text-emerald-700/60 mb-8 uppercase tracking-widest font-bold">Select all strategies to proceed</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {tools.map((tool) => {
                    const isEquipped = equipped.includes(tool.id);
                    return (
                        <div 
                            key={tool.id}
                            onClick={() => toggleTool(tool.id)}
                            className={`
                            cursor-pointer p-8 rounded-2xl border-4 transition-all duration-300 flex items-center gap-6 text-left group
                            ${isEquipped ? 'bg-emerald-600 border-emerald-800 text-white shadow-xl scale-105' : 'bg-white border-emerald-100 hover:border-emerald-300'}
                            `}
                        >
                            <div className="text-5xl group-hover:scale-110 transition-transform">{tool.icon}</div>
                            <div className="flex-1">
                                <h3 className={`text-2xl font-bold ${isEquipped ? 'text-white' : 'text-emerald-900'}`}>{tool.name}</h3>
                                <p className={`text-sm mt-1 leading-snug ${isEquipped ? 'text-emerald-100' : 'text-slate-500'}`}>{tool.desc}</p>
                            </div>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isEquipped ? 'bg-white border-white' : 'border-slate-300'}`}>
                                {isEquipped && <CheckCircle2 className="text-emerald-600" size={20} />}
                            </div>
                        </div>
                    );
                    })}
                </div>
                
                {equipped.length === 4 && (
                    <button 
                        onClick={() => setContractSigned(true)}
                        className="bg-emerald-900 text-white text-2xl font-black py-6 px-12 rounded-full shadow-2xl hover:scale-105 hover:bg-black transition-all animate-pop-in"
                    >
                        SIGN CONTRACT WITH SELF
                    </button>
                )}
            </>
         ) : (
            <div className="bg-white p-16 rounded-[2rem] shadow-2xl border-8 border-emerald-900 animate-scale-in max-w-3xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Shield size={200} />
                </div>
                <h2 className="text-5xl font-black text-emerald-900 mb-6 uppercase">Protocol Activated</h2>
                <p className="text-2xl text-slate-600 mb-8 leading-relaxed">
                    I acknowledge that I am a Monkey-brained, anxiety-ridden primate. 
                    I will not try to be perfect. I will just try to be <span className="font-bold text-emerald-700">present</span>.
                </p>
                <div className="flex items-center justify-center gap-4 text-emerald-800 font-bold border-t-2 border-emerald-100 pt-8">
                    <Fingerprint size={48} />
                    <div className="text-left">
                        <div className="text-xs uppercase opacity-50">Signed By</div>
                        <div className="text-xl">Future You</div>
                    </div>
                </div>
            </div>
         )}
      </div>
    )
  }

  // --- SUB-COMPONENTS FROM PREVIOUS (RETAINED) ---
  const DistractionBrowser = () => {
    const distractions = ["Wikipedia: Emu War", "YouTube: Hydraulic Press", "Reddit: r/aww", "Zillow: Castles", "Email"];
    const addDistraction = () => setDistractionCount(prev => Math.min(prev + 1, 15));
    return (
      <div className="bg-white border-4 border-slate-900 rounded-xl overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] max-w-3xl mx-auto font-sans text-slate-900 transform transition-all hover:translate-y-[-2px]">
        <div className="bg-slate-200 p-3 flex gap-2 border-b-2 border-slate-300 items-center">
           <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
           <div className="bg-white flex-1 rounded px-3 py-1 text-xs text-slate-400 flex items-center shadow-inner"><Lock size={10} className="mr-2"/> procrastination_hub.exe</div>
        </div>
        <div className="p-8 h-80 relative overflow-hidden bg-white">
           {distractionCount === 0 ? (
             <div className="text-center h-full flex flex-col items-center justify-center space-y-6">
               <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-2 animate-bounce-slow"><LayoutGrid size={40} className="text-blue-500" /></div>
               <div><h3 className="text-2xl font-bold mb-2">The Plan</h3><button onClick={addDistraction} className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1">Start Working</button></div>
             </div>
           ) : (
             <div className="absolute inset-0">
               {Array.from({ length: distractionCount }).map((_, i) => (
                 <div key={i} className="absolute bg-white border-2 border-slate-900 p-3 shadow-xl rounded-lg w-64 animate-pop-in" style={{ top: `${Math.random() * 60}%`, left: `${Math.random() * 60}%`, zIndex: i }}>
                   <div className="flex justify-between items-center text-[10px] font-bold mb-2 border-b border-gray-100 pb-1 uppercase"><span className="text-slate-400">Tab {i+1}</span><XCircle size={12} className="text-red-400"/></div>
                   <div className="text-sm font-bold text-slate-800">{distractions[i % distractions.length]}</div>
                 </div>
               ))}
               <button onClick={addDistraction} className="absolute bottom-6 right-6 bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-110 transition z-50 flex items-center gap-2 border-4 border-white animate-bounce"><Baby size={20} /> MORE!</button>
             </div>
           )}
        </div>
      </div>
    );
  };

  const LifeCalendar = () => {
    const totalDots = 900; 
    const consumed = Math.floor(300);
    const getDotColor = (index) => {
      if (lifeViewMode === 'stages') {
        if (index < 200) return 'bg-emerald-400';
        if (index < 650) return 'bg-blue-500';
        return 'bg-amber-400';
      }
      return index < consumed ? 'bg-slate-800' : 'bg-slate-200';
    };
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(8px,1fr))] gap-1 w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg border border-slate-200">
           {Array.from({ length: totalDots }).map((_, i) => (
             <div key={i} className={`aspect-square rounded-[1px] transition-all duration-500 ${i === consumed ? 'bg-red-600 scale-150 shadow-sm z-10 animate-pulse' : getDotColor(i)}`} />
           ))}
        </div>
        <button onClick={() => setLifeViewMode(prev => prev === 'simple' ? 'stages' : 'simple')} className="mt-8 px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 text-sm font-bold flex items-center gap-2"><RefreshCw size={14} /> Toggle Perspective</button>
      </div>
    );
  };

  // --- DATA: 33 SLIDES ---
  const slides = [
    // ACT I
    { type: "title", title: "THE PROCRASTINATION", sub: "PARADOX", style: "urban_title", note: "Wait But Why x Exurb1a" },
    { type: "confession", title: "A CONFESSION", text: "I assume you are all functioning adults.", sub: "I, however, am effectively three toddlers in a trench coat trying to buy a movie ticket.", style: "urban_paper" },
    { type: "split_brain", title: "THE BRAIN AT WAR", text: "Inside your head, there isn't one pilot. There are two.", style: "urban_clean" },
    { type: "card_profile", char: "Rational Decision Maker", role: "The Adult", desc: "Wants to be healthy. Has 5-year plans. Files taxes early.", quote: "\"Let's finish this by 5 PM!\"", icon: <User size={60} className="text-blue-600"/>, color: "blue", style: "urban_card_blue" },
    { type: "card_profile", char: "Instant Gratification Monkey", role: "The Saboteur", desc: "Cares about two things: Easy and Fun.", quote: "\"Or... let's watch deep sea squids.\"", icon: <Baby size={60} className="text-orange-500"/>, color: "orange", style: "urban_card_orange" },
    { type: "steering_wheel", title: "THE STEERING WHEEL", style: "urban_conflict" }, 
    { type: "interactive_sim", title: "SIMULATION: TUESDAY", style: "urban_sim" },
    { type: "dark_playground", title: "THE DARK PLAYGROUND", text: "This isn't fun. It's an escape.", style: "urban_dark" },
    { type: "matrix_chart", title: "THE MATRIX", style: "urban_grid" },
    { type: "panic_monster", title: "THE PANIC MONSTER", desc: "The only thing the Monkey fears.", sub: "Wakes up only when the deadline is imminent.", style: "urban_panic" },
    { type: "timeline_graph", title: "THE DEADLINE EFFECT", style: "urban_graph" },
    { type: "big_question", text: "But what happens when there is no deadline?", style: "urban_grey" },
    
    // ACT II
    { type: "list_sad", title: "THE SILENT KILLER", items: ["Your Health", "Your Relationships", "Your Art", "Your Career"], footer: "No deadline = No Panic Monster = No Action.", style: "urban_grey_list" },
    { type: "glitch_transition", text: "ZOOM OUT", sub: "Let's stop looking at the calendar.", style: "transition_glitch" },
    
    // ACT III
    { type: "intro_cosmic", title: "THE HUMAN DISASTER CLUB", text: "You think you're broken? You're just a primate with anxiety on a rock spinning at 67,000 mph.", style: "exurbia_start" },
    { type: "mask_visual", title: "THE PERFORMANCE", text: "Society is a costume party where everyone is pretending not to be terrified.", style: "exurbia_simple" },
    { type: "interactive_zoom", title: "PERSPECTIVE", style: "exurbia_deep" }, 
    { type: "history_cards", title: "HISTORICAL BASKET CASES", style: "exurbia_cards" }, 
    { type: "brain_storm", title: "YOUR BRAIN ON SADNESS", text: "Sadness is just a biological weather system. It rains, it passes.", style: "exurbia_weather" },
    { type: "entropy_text", title: "ENTROPY", text: "The universe leans towards chaos. Your messy room is just physics.", style: "exurbia_text" },
    { type: "interactive_entropy", title: "CHAOS SIMULATOR", style: "exurbia_interactive" }, 
    { type: "nihilism_intro", title: "OPTIMISTIC NIHILISM", text: "If nothing matters...", sub: "...then your mistakes don't matter either.", style: "exurbia_void" },
    { type: "toggle_nihilism", title: "CHOOSE YOUR DREAD", style: "exurbia_interactive_2" },
    { type: "stardust_text", title: "YOU ARE NUCLEAR WASTE", text: "Every atom in your body was forged in the heart of a dying star.", sub: "Stardust that is afraid of sending emails.", style: "exurbia_gold" },
    
    // ACT IV
    { type: "synthesis_duo", title: "THE PARADOX", text: "The Monkey wants 'Easy'. The Universe offers 'Hard'.", style: "hybrid_light" },
    { type: "philosophy_wuwei", title: "WU WEI", style: "hybrid_paper" }, 
    { type: "acceptance_text", title: "THE GLORIOUS MESS", style: "hybrid_simple" }, 
    { type: "life_calendar_visual", title: "MEMENTO MORI", style: "hybrid_grid" },
    { type: "perspective_final", title: "4,000 WEEKS", text: "That's all you get. Most of them are just Tuesdays.", style: "hybrid_text" },
    { type: "toolkit_cards", title: "THE TOOLKIT", style: "hybrid_cards" }, 
    { type: "call_to_action", title: "GRAB THE WHEEL", text: "Not forever. Just for today.", style: "final_white" },
    { type: "end_credits", title: "FIN", text: "Go do the thing.", style: "final_black" },
  ];

  // --- RENDERERS ---
  const renderBackground = (style) => {
    if (style.startsWith('urban')) return <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>;
    if (style.startsWith('exurbia')) return <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>;
    return null;
  };

  const getSlideClasses = (style) => {
    const base = "relative w-full h-full flex flex-col items-center justify-center p-8 transition-colors duration-700 ease-in-out overflow-hidden ";
    const styles = {
      urban_title: "bg-white text-slate-900 font-sans",
      urban_paper: "bg-[#f8f9fa] text-slate-800 font-sans",
      urban_clean: "bg-white text-slate-900 font-sans",
      urban_card_blue: "bg-blue-50 text-slate-900 font-sans",
      urban_card_orange: "bg-orange-50 text-slate-900 font-sans",
      urban_conflict: "bg-slate-100 text-slate-900 font-sans",
      urban_sim: "bg-slate-200 text-slate-900 font-sans",
      urban_dark: "bg-slate-900 text-white font-sans",
      urban_grid: "bg-white text-slate-900 font-sans",
      urban_panic: "bg-red-50 text-red-900 font-sans border-8 border-red-500",
      urban_graph: "bg-white text-slate-900 font-sans",
      urban_grey: "bg-slate-200 text-slate-600 font-sans",
      urban_grey_list: "bg-slate-200 text-slate-700 font-sans",
      transition_glitch: "bg-black text-green-400 font-mono",
      exurbia_start: "bg-[#0a0a0a] text-amber-50 font-serif",
      exurbia_simple: "bg-black text-slate-300 font-serif",
      exurbia_deep: "bg-black text-white font-serif",
      exurbia_cards: "bg-[#111] text-amber-50 font-serif",
      exurbia_weather: "bg-slate-900 text-blue-200 font-serif",
      exurbia_text: "bg-black text-slate-400 font-serif",
      exurbia_interactive: "bg-[#050505] text-white font-serif",
      exurbia_void: "bg-black text-slate-500 font-serif",
      exurbia_interactive_2: "bg-[#0a0a0a] text-white font-serif",
      exurbia_gold: "bg-black text-amber-200 font-serif border-y-4 border-amber-900/30",
      hybrid_light: "bg-slate-50 text-slate-900 font-sans",
      hybrid_paper: "bg-[#fffdf5] text-slate-800 font-serif",
      hybrid_simple: "bg-white text-slate-600 font-sans",
      hybrid_grid: "bg-white text-black font-mono",
      hybrid_text: "bg-slate-100 text-slate-900 font-sans",
      hybrid_cards: "bg-emerald-50 text-emerald-900 font-sans",
      final_white: "bg-white text-black font-black tracking-tighter",
      final_black: "bg-black text-white font-mono",
    };
    return base + (styles[style] || "bg-white text-black");
  };

  const slide = slides[currentSlide];

  return (
    <div className="w-full h-screen relative select-none">
      {renderBackground(slide.style)}
      <div className={getSlideClasses(slide.style)}>
        
        {/* === TITLE & TEXT === */}
        {slide.type === 'title' && (
          <div className="text-center z-10 animate-fade-in-up max-w-5xl w-full px-4">
            <div className="mb-6 inline-block bg-black text-white px-4 py-1 text-xs font-bold tracking-[0.3em] uppercase transform -rotate-2">The Interactive Presentation</div>
            <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-black mb-2 leading-[0.9] tracking-tighter break-words max-w-full">{slide.title}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">{slide.sub}</span></h1>
            <div className="mt-8 flex items-center justify-center gap-4 opacity-60"><Brain size={24} /> <span>x</span> <Globe size={24} /></div>
            <p className="mt-2 font-mono text-sm">{slide.note}</p>
          </div>
        )}

        {(slide.type === 'confession' || slide.type === 'big_question' || slide.type === 'mask_visual' || slide.type === 'synthesis_duo' || slide.type === 'perspective_final') && (
          <div className="max-w-3xl text-center z-10 animate-fade-in">
             {slide.type === 'confession' && (
                <>
                  <div className="text-8xl mb-8 animate-bounce cursor-pointer hover:scale-110 transition-transform" onClick={() => setConfessionRevealed(!confessionRevealed)}>{confessionRevealed ? '👶👶👶' : '🕵️‍♂️'}</div>
                  <h2 className="text-5xl font-bold mb-8 uppercase tracking-tight">{slide.title}</h2>
                  <p className="text-4xl font-light leading-relaxed">{slide.text}</p>
                  <div className={`transition-all duration-700 overflow-hidden ${confessionRevealed ? 'max-h-40 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}><p className="text-xl font-serif italic text-red-500 border-l-4 border-red-500 pl-4">{slide.sub}</p></div>
                  {!confessionRevealed && <p className="text-sm mt-8 text-slate-400 animate-pulse">(Click the detective)</p>}
                </>
             )}
             {slide.type !== 'confession' && (
               <>
                 {slide.type === 'mask_visual' && <div className="text-8xl mb-8 opacity-50 flex justify-center gap-4"><Smile size={80} /><Frown size={80} /></div>}
                 {slide.title && <h2 className="text-5xl font-bold mb-8 uppercase tracking-tight">{slide.title}</h2>}
                 <p className="text-4xl font-light leading-relaxed">{slide.text}</p>
                 {slide.sub && <p className="text-xl mt-6 opacity-60 font-serif italic">{slide.sub}</p>}
               </>
             )}
          </div>
        )}

        {/* === MODULES === */}
        {slide.type === 'split_brain' && <div className="flex flex-col items-center z-10"><div className="flex gap-1 mb-12 relative group cursor-pointer"><div className="w-32 h-64 bg-blue-100 rounded-l-full border-r-2 border-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-[-10px] group-hover:bg-blue-200"><User size={40} className="text-blue-400"/></div><div className="w-32 h-64 bg-orange-100 rounded-r-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-[10px] group-hover:bg-orange-200"><Baby size={40} className="text-orange-400 animate-wiggle"/></div></div><h2 className="text-5xl font-black mb-4">{slide.title}</h2><p className="text-2xl text-slate-500">{slide.text}</p></div>}
        
        {slide.type === 'card_profile' && <div className="bg-white p-12 rounded-[2rem] shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center gap-12 z-10 border-b-8 animate-pop-in transition-transform hover:scale-[1.02]" style={{borderColor: slide.color === 'blue' ? '#3b82f6' : '#f97316'}}><div className={`p-8 rounded-full ${slide.color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'} flex-shrink-0`}>{slide.icon}</div><div className="text-left"><div className={`text-sm font-bold uppercase tracking-wider mb-2 ${slide.color === 'blue' ? 'text-blue-500' : 'text-orange-500'}`}>{slide.role}</div><h2 className="text-5xl font-black mb-6 text-slate-800">{slide.char}</h2><p className="text-2xl font-medium text-slate-600 mb-6">{slide.desc}</p><div className="bg-slate-100 p-4 rounded-xl border-l-4 border-slate-400 italic text-slate-500">{slide.quote}</div></div></div>}
        
        {slide.type === 'steering_wheel' && <SteeringWheelSim />}

        {slide.type === 'interactive_sim' && <div className="w-full z-10"><h2 className="text-4xl font-black mb-8 text-slate-800 opacity-20 text-center uppercase tracking-widest">{slide.title}</h2><DistractionBrowser /></div>}

        {slide.type === 'dark_playground' && <div className="max-w-4xl z-10 relative"><div className="absolute -top-20 -left-20 opacity-10 animate-spin-slow"><AlertTriangle size={300} /></div><h2 className="text-7xl font-black mb-6 text-red-400 relative">{slide.title}</h2><div className="h-1 w-24 bg-red-500 mb-8 mx-auto"></div><p className="text-3xl mb-8 font-medium">{slide.text}</p><div className="grid grid-cols-3 gap-6 opacity-60 mt-12"><div className="flex flex-col items-center gap-2"><CloudRain size={40} /><span className="text-sm uppercase font-bold">Guilt</span></div><div className="flex flex-col items-center gap-2"><AlertOctagon size={40} /><span className="text-sm uppercase font-bold">Dread</span></div><div className="flex flex-col items-center gap-2"><Clock size={40} /><span className="text-sm uppercase font-bold">Regret</span></div></div></div>}

        {slide.type === 'matrix_chart' && <div className="w-full max-w-4xl z-10"><h2 className="text-4xl font-bold mb-8 text-center">{slide.title}</h2><div className="grid grid-cols-2 gap-4 h-[400px] text-lg font-bold text-white perspective-1000"><div onClick={() => setMatrixFocus(matrixFocus === 'urgent' ? null : 'urgent')} className={`rounded-tl-3xl flex items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 ${matrixFocus === 'urgent' ? 'bg-blue-600 scale-105 z-20 shadow-xl opacity-100' : 'bg-blue-400 opacity-40 hover:opacity-80'}`}><div>IMPORTANT<br/>& URGENT<br/>{matrixFocus === 'urgent' && <span className="text-sm font-normal text-blue-100 mt-2 block">(Do it now)</span>}</div></div><div onClick={() => setMatrixFocus(matrixFocus === 'plan' ? null : 'plan')} className={`rounded-tr-3xl flex items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 ${matrixFocus === 'plan' ? 'bg-green-600 scale-105 z-20 shadow-xl opacity-100' : 'bg-green-400 opacity-40 hover:opacity-80'}`}><div>IMPORTANT<br/>NOT URGENT<br/>{matrixFocus === 'plan' && <span className="text-sm font-normal text-green-100 mt-2 block">(Schedule it)</span>}</div></div><div onClick={() => setMatrixFocus(matrixFocus === 'delegate' ? null : 'delegate')} className={`rounded-bl-3xl flex items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 ${matrixFocus === 'delegate' ? 'bg-yellow-500 scale-105 z-20 shadow-xl opacity-100' : 'bg-yellow-400 opacity-40 hover:opacity-80'}`}><div>NOT IMPORTANT<br/>URGENT<br/>{matrixFocus === 'delegate' && <span className="text-sm font-normal text-yellow-100 mt-2 block">(Delegate)</span>}</div></div><div onClick={() => setMatrixFocus(matrixFocus === 'waste' ? null : 'waste')} className={`rounded-br-3xl flex items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 relative ${matrixFocus === 'waste' || matrixFocus === null ? 'bg-red-500 scale-105 z-10 shadow-2xl opacity-100' : 'bg-red-400 opacity-40'}`}><div className="absolute top-4 left-4 bg-white text-red-500 px-2 py-1 text-xs rounded uppercase font-bold">You are here</div><div>NOT IMPORTANT<br/>NOT URGENT<br/><span className="text-sm font-normal mt-2 block opacity-80">(The Dark Playground)</span></div></div></div><p className="text-center mt-6 text-slate-400 text-sm">(Tap quadrants to explore)</p></div>}

        {slide.type === 'panic_monster' && <div className="flex flex-col items-center z-10 animate-shake"><div className="bg-red-600 text-white p-12 rounded-full mb-8 shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-pulse"><Ghost size={120} /></div><h2 className="text-8xl font-black uppercase text-red-600 mb-4">{slide.title}</h2><p className="text-3xl font-bold text-red-900 max-w-2xl text-center">{slide.desc}</p><p className="text-xl mt-4 text-red-800/60 italic">{slide.sub}</p></div>}

        {slide.type === 'timeline_graph' && <div className="w-full max-w-5xl z-10"><h2 className="text-4xl font-bold mb-12 text-left">Productivity over Time</h2><div className="relative h-64 border-l-4 border-b-4 border-slate-800 flex items-end bg-slate-50"><div className="w-full h-full flex items-end px-2 gap-1 relative"><div className="absolute bottom-0 left-0 bg-blue-200/50 h-full transition-all duration-75" style={{width: `${timelineProgress}%`}}></div>{Array.from({length: 20}).map((_, i) => <div key={i} className={`flex-1 transition-all duration-300 ${(i > 16 && timelineProgress > (i/20)*100) ? 'bg-red-500' : (timelineProgress > (i/20)*100 ? 'bg-slate-300' : 'bg-slate-200')}`} style={{ height: (i > 16 && timelineProgress > (i/20)*100) ? `${(i-15)*25}%` : '5%' }}></div>)}</div><div className="absolute -bottom-8 left-0 text-slate-500 font-bold">Start</div><div className="absolute -bottom-8 right-0 text-red-600 font-bold">DEADLINE</div></div><div className="mt-8 flex justify-between items-center"><button onClick={() => { setTimelineProgress(0); setTimelineActive(true); }} className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition"><PlayCircle size={20} /> Simulate Panic</button>{timelineProgress > 80 && <div className="text-red-600 font-bold text-xl animate-pulse flex items-center"><ArrowRight className="mr-2"/> THE PANIC ZONE</div>}</div></div>}

        {slide.type === 'list_sad' && <div className="max-w-4xl z-10 w-full"><h2 className="text-6xl font-black mb-12 text-slate-800">{slide.title}</h2><div className="grid gap-6">{slide.items.map((item, i) => <div key={i} className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity cursor-default"><span className="text-2xl font-bold text-slate-500 hover:text-slate-800 transition-colors">{item}</span><span className="text-xs uppercase bg-slate-200 px-2 py-1 rounded text-slate-500">Ignored</span></div>)}</div><p className="mt-12 text-2xl font-bold text-red-500 text-center">{slide.footer}</p></div>}

        {slide.type === 'glitch_transition' && <div className="z-10 text-center"><h2 className="text-9xl font-black glitch-text mb-4" data-text={slide.text}>{slide.text}</h2><p className="text-xl font-mono text-green-500 animate-pulse">&gt; {slide.sub}</p></div>}

        {slide.type === 'intro_cosmic' && <div className="max-w-4xl z-10 text-center"><div className="mb-12 flex justify-center opacity-80 animate-float"><Globe size={100} /></div><h2 className="text-6xl font-serif font-bold text-amber-50 mb-8">{slide.title}</h2><p className="text-3xl font-serif leading-relaxed text-slate-300 font-light">{slide.text}</p></div>}

        {slide.type === 'interactive_zoom' && <CosmicZoom />}

        {slide.type === 'history_cards' && <HistoricalBasketCases />}

        {slide.type === 'brain_storm' && <div className="max-w-4xl z-10 relative"><div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none"><CloudRain size={400} /></div><h2 className="text-6xl font-serif font-bold text-blue-100 mb-6 relative">{slide.title}</h2><p className="text-3xl font-serif text-blue-200/80 leading-relaxed relative">{slide.text}</p></div>}

        {(slide.type === 'entropy_text' || slide.type === 'stardust_text') && <div className="max-w-4xl z-10 text-center"><h2 className="text-6xl font-serif font-bold text-amber-50 mb-8">{slide.title}</h2><p className="text-3xl text-slate-300 font-serif font-light leading-relaxed mb-6">{slide.text}</p>{slide.sub && <p className="text-xl text-amber-500/80 italic font-serif">{slide.sub}</p>}</div>}

        {slide.type === 'interactive_entropy' && <EntropySimulator />}

        {(slide.type === 'nihilism_intro' || slide.type === 'toggle_nihilism') && <div className="z-10 w-full max-w-4xl text-center">{slide.type === 'nihilism_intro' ? (<><h2 className="text-6xl font-serif font-bold text-white mb-6">{slide.title}</h2><p className="text-4xl text-slate-400 font-serif mb-4">{slide.text}</p><p className="text-4xl text-white font-serif font-bold">{slide.sub}</p></>) : (<div className="bg-white/5 border border-white/10 p-12 rounded-[3rem] backdrop-blur-md"><h2 className="text-3xl font-serif text-slate-300 mb-8 uppercase tracking-widest">{slide.title}</h2><div className="flex justify-center gap-8"><button onClick={() => setNihilismMode('dread')} className={`p-6 rounded-2xl transition-all w-64 ${nihilismMode === 'dread' ? 'bg-slate-800 ring-2 ring-slate-500 shadow-[0_0_30px_rgba(100,116,139,0.3)]' : 'bg-transparent hover:bg-white/5'}`}><Skull size={40} className="mx-auto mb-4 text-slate-400" /><div className="font-bold text-white">Nothing Matters</div><div className="text-xs text-slate-500 mt-2">(Sad)</div></button><button onClick={() => setNihilismMode('party')} className={`p-6 rounded-2xl transition-all w-64 ${nihilismMode === 'party' ? 'bg-pink-900/50 ring-2 ring-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]' : 'bg-transparent hover:bg-white/5'}`}><Smile size={40} className="mx-auto mb-4 text-pink-400" /><div className="font-bold text-white">Nothing Matters!</div><div className="text-xs text-slate-500 mt-2">(Happy)</div></button></div><div className="mt-8 h-20 flex items-center justify-center"><p key={nihilismMode} className="text-2xl font-serif italic text-slate-300 animate-fade-in-up">{nihilismMode === 'dread' ? "\"I am just dust in a cold void.\"" : "\"I can eat cake for breakfast because time is a construct!\""}</p></div></div>)}</div>}

        {slide.type === 'philosophy_wuwei' && <WuWeiBoat />}

        {slide.type === 'acceptance_text' && <KintsugiRepair />}

        {slide.type === 'life_calendar_visual' && <div className="z-10 w-full animate-fade-in"><h2 className="text-4xl font-mono font-bold text-center mb-6 uppercase tracking-widest">{slide.title}</h2><LifeCalendar /></div>}

        {slide.type === 'toolkit_cards' && <ToolkitEquip />}

        {slide.type === 'call_to_action' && <div className="z-10 text-center animate-scale-in"><h2 className="text-9xl font-black uppercase tracking-tighter mb-4">{slide.title}</h2><p className="text-4xl font-serif italic text-slate-500">{slide.text}</p></div>}

        {slide.type === 'end_credits' && <div className="z-10 text-center"><div className="text-6xl mb-8 animate-bounce">👋</div><h2 className="text-4xl font-mono text-white mb-2">{slide.title}</h2><p className="text-xl text-slate-500">{slide.text}</p><button onClick={() => setCurrentSlide(0)} className="mt-12 px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors text-sm uppercase tracking-widest">Restart Simulation</button></div>}

      </div>

      {/* --- FOOTER UI --- */}
      <div className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-end pointer-events-none z-50">
         <div className="text-xs font-mono font-bold uppercase mix-blend-difference text-white opacity-50">{currentSlide + 1} / {slides.length}</div>
         <div className="flex gap-4 pointer-events-auto mix-blend-difference text-white">
            <button onClick={prevSlide} disabled={currentSlide === 0} className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black hover:border-transparent transition-all disabled:opacity-0"><ChevronLeft size={20} /></button>
            <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black hover:border-transparent transition-all disabled:opacity-0"><ChevronRight size={20} /></button>
         </div>
      </div>
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200/10 z-50"><div className={`h-full transition-all duration-300 ${slide.style.includes('urban') ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}/></div>
    </div>
  );
};

export default Presentation;