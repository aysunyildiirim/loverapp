import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Smile, MessageCircle, Lock, ExternalLink, Globe, Film, PlaneTakeoff, Sparkles, CheckSquare, PlusCircle, FerrisWheel, RotateCcw, Camera, X, Upload, Music, Play, Trash2, Disc, Key, Home, Terminal, Skull, ShieldCheck, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- GÖRSELLER (WEBP VE PNG) ---
import KurdeleliKalpGorseli from './assets/kurdeleli_kalp.png';
import SenNormal from './assets/sen_normal.webp'; 
import SenYakala from './assets/sen_yakala.webp';
import DusenKafa from './assets/dusen_kafa.webp';

// --- SUNUCU ADRESİ ---
const API_BASE_URL = "http://localhost:3000";

// *****************************************************************************
// --- AYSUN TARLASI (ENGINEER EDITION - FULL DETAILED) ---
// *****************************************************************************
const CONFIG_AT = {
    EASY: { size: 8, mines: 8, label: "Yeni Tanışmışız" },
    MEDIUM: { size: 10, mines: 18, label: "Ciddi İlişki" },
    HARD: { size: 12, mines: 35, label: "Sınav Haftasındaki Aysun" }
};

const SITEM_MESAJLARI_AT = [
    "Peki... (En tehlikeli kelime!)",
    "Mesajıma neden 2 dakika geç cevap verdin? 😒",
    "O kızı neden beğendin? (Şaka şaka ama basmasaydın iyiydi)",
    "Yine mi oyun oynuyorsun sen?",
    "Anladım, öyle olsun...",
    "Kendi bilirsin."
];

const AysunTarlasi = () => {
    const [difficulty, setDifficulty] = useState('EASY');
    const [board, setBoard] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [logs, setLogs] = useState([]);
    const [flagsUsed, setFlagsUsed] = useState(0);
    const logEndRef = useRef(null);

    const addLog = useCallback((msg, type = "info") => {
        const time = new Date().toLocaleTimeString().split(' ')[0];
        setLogs(prev => [...prev.slice(-15), { msg, type, time }]);
    }, []);

    const initBoard = useCallback(() => {
        const { size, mines } = CONFIG_AT[difficulty];
        let newBoard = Array(size).fill(null).map(() => 
            Array(size).fill(null).map(() => ({
                isMine: false, revealed: false, flagged: false, neighborCount: 0
            }))
        );

        let placedMines = 0;
        while (placedMines < mines) {
            const r = Math.floor(Math.random() * size);
            const c = Math.floor(Math.random() * size);
            if (!newBoard[r][c].isMine) {
                newBoard[r][c].isMine = true;
                placedMines++;
            }
        }

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (newBoard[r][c].isMine) continue;
                let count = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const nr = r + x, nc = c + y;
                        if (nr >= 0 && nr < size && nc >= 0 && nc < size && newBoard[nr][nc].isMine) count++;
                    }
                }
                newBoard[r][c].neighborCount = count;
            }
        }
        setBoard(newBoard);
        setGameOver(false); setWin(false); setFlagsUsed(0); setLogs([]);
        addLog(`[SYSTEM]: ${CONFIG_AT[difficulty].label} modu yüklendi.`, "success");
        addLog("[INFO]: Duygusal veri seti parse ediliyor...");
        addLog("[INFO]: Model Accuracy: %99.99 (Güzellik parametresi)");
    }, [difficulty, addLog]);

    useEffect(() => { initBoard(); }, [initBoard]);
    useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

    const handleReveal = (r, c) => {
        if (gameOver || win || board[r][c].revealed || board[r][c].flagged) return;
        let newBoard = [...board.map(row => [...row])];
        if (newBoard[r][c].isMine) {
            setGameOver(true);
            addLog(`[CRITICAL]: Hata! Sitem patladı: "${SITEM_MESAJLARI_AT[Math.floor(Math.random() * SITEM_MESAJLARI_AT.length)]}"`, "error");
            return;
        }
        const floodFill = (row, col) => {
            if (row < 0 || row >= CONFIG_AT[difficulty].size || col < 0 || col >= CONFIG_AT[difficulty].size) return;
            if (newBoard[row][col].revealed || newBoard[row][col].isMine) return;
            newBoard[row][col].revealed = true;
            if (newBoard[row][col].neighborCount === 0) {
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) floodFill(row + x, col + y);
                }
            }
        };
        floodFill(r, c);
        setBoard(newBoard);
        addLog(`[DEBUG]: (${r},${c}) hücresi analiz edildi. Latent space güvenli.`);
        
        let unrevealedCount = 0;
        newBoard.forEach(row => row.forEach(cell => { if (!cell.revealed) unrevealedCount++; }));
        if (unrevealedCount === CONFIG_AT[difficulty].mines) {
            setWin(true);
            confetti({ particleCount: 200, spread: 70 });
            addLog("[SUCCESS]: Global Optimum bulundu! Kalp fethedildi.", "success");
        }
    };

    const handleFlag = (e, r, c) => {
        e.preventDefault();
        if (gameOver || win || board[r][c].revealed) return;
        let newBoard = [...board.map(row => [...row])];
        newBoard[r][c].flagged = !newBoard[r][c].flagged;
        setBoard(newBoard);
        setFlagsUsed(prev => newBoard[r][c].flagged ? prev + 1 : prev - 1);
        addLog(`[WARNING]: (${r},${c}) hücresine kalp yerleştirildi.`);
    };

    return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ width: '250px', background: '#0d1117', borderRadius: '15px', padding: '10px', height: '350px', overflowY: 'auto', border: '1px solid #333', fontFamily: 'monospace', fontSize: '10px', color: '#d1d5da', textAlign: 'left' }}>
                <div style={{borderBottom: '1px solid #333', marginBottom: '5px', paddingBottom: '3px', color: '#8b949e'}}><Terminal size={12} style={{verticalAlign:'middle'}}/> AYSUN_LOG_SYSTEM</div>
                {logs.map((log, i) => <div key={i} style={{color: log.type === "error" ? "#ff7b72" : log.type === "success" ? "#7ee787" : "#d1d5da"}}>[{log.time}] {log.msg}</div>)}
                <div ref={logEndRef} />
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', justifyContent: 'center' }}>
                    {Object.keys(CONFIG_AT).map(lvl => <button key={lvl} onClick={() => setDifficulty(lvl)} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: difficulty === lvl ? '#f82f8d' : '#eee', color: difficulty === lvl ? 'white' : '#666', fontSize: '11px', cursor: 'pointer' }}>{lvl}</button>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${CONFIG_AT[difficulty].size}, 30px)`, gap: '4px', background: 'white', padding: '10px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    {board.map((row, r) => row.map((cell, c) => (
                        <div key={`${r}-${c}`} onClick={() => handleReveal(r, c)} onContextMenu={(e) => handleFlag(e, r, c)} style={{ width: '30px', height: '30px', borderRadius: '4px', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 'bold', background: cell.revealed ? (cell.isMine ? '#ff7b72' : '#f0f0f0') : (cell.flagged ? '#fff0f3' : '#e0e0e0'), color: cell.neighborCount === 1 ? '#0969da' : cell.neighborCount === 2 ? '#1a7f37' : '#cf222e' }}>
                            {cell.revealed ? (cell.isMine ? <Skull size={16} color="white" /> : (cell.neighborCount > 0 ? cell.neighborCount : "")) : (cell.flagged ? <Heart size={14} fill="#f82f8d" color="#f82f8d" /> : "")}
                        </div>
                    )))}
                </div>
                <button onClick={initBoard} style={{ marginTop: '15px', background: '#f82f8d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}><RotateCcw size={14} /> Yeniden Eğit</button>
            </div>
            <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '20px', fontSize: '12px', textAlign: 'left' }}>
                    <div style={{color:'#f82f8d', fontWeight:'bold', marginBottom:'5px'}}>MODEL STATUS</div>
                    <div>Gönül: <b>{win ? '∞' : '0'}</b></div>
                    <div>Trip: <b>{flagsUsed}/{CONFIG_AT[difficulty].mines}</b></div>
                </div>
                { (gameOver || win) && (
                    <div style={{ padding: '10px', borderRadius: '15px', background: win ? '#7ee78722' : '#ff7b7222', border: `1px dashed ${win ? '#7ee787' : '#ff7b72'}`, fontSize: '10px', color: win ? '#1a7f37' : '#cf222e' }}>
                        {win ? <ShieldCheck size={20}/> : <AlertTriangle size={20}/>}
                        <div style={{marginTop:'5px'}}>{win ? "Model Doğrulandı!" : "Kritik Hata: Overfitting!"}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- HAFIZA OYUNU ---
const placeholderImages = [
  'https://picsum.photos/id/10/200/200', 
  'https://picsum.photos/id/20/200/200', 
  'https://picsum.photos/id/30/200/200', 
  'https://picsum.photos/id/40/200/200', 
  'https://picsum.photos/id/50/200/200', 
  'https://picsum.photos/id/60/200/200'
];

const HafizaOyunu = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const setupGame = useCallback(() => {
    const duplicated = [...placeholderImages, ...placeholderImages]
      .map((img, index) => ({ id: index, img }))
      .sort(() => Math.random() - 0.5);
    setCards(duplicated);
    setFlippedIndices([]);
    setMatchedPairs([]);
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(index)) return;
    
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].img === cards[second].img) {
        setMatchedPairs(prev => {
          const updated = [...prev, first, second];
          if (updated.length === cards.length) {
            confetti({ particleCount: 150 });
            if (onComplete) onComplete();
          }
          return updated;
        });
        setFlippedIndices([]);
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button 
        onClick={setupGame} 
        style={{ 
          marginBottom: '15px', 
          padding: '8px 15px', 
          borderRadius: '15px', 
          border: 'none', 
          background: '#fff0f3', 
          color: '#ff4d4d', 
          fontWeight: 'bold', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px', 
          margin: '0 auto 15px', 
          boxShadow: '0 4px 10px rgba(255, 193, 204, 0.4)' 
        }}
      >
        <RotateCcw size={14}/> Sıfırla
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {Array.isArray(cards) && cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(index);
          return (
            <div key={card.id} onClick={() => handleCardClick(index)} style={{ cursor: 'pointer', perspective: '1000px', width: '100%', aspectRatio: '1/1' }}>
              <motion.div 
                animate={{ rotateY: isFlipped ? 180 : 0 }} 
                transition={{ duration: 0.4 }} 
                style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
              >
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #ffc1cc, #ffecf0)', borderRadius: '12px', display: 'grid', placeItems: 'center', border: '2px solid white' }}>
                  <Heart size={20} color="#ff4d4d" fill="#ff4d4d" />
                </div>
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: '12px', overflow: 'hidden', border: '2px solid white' }}>
                  <img src={card.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="anı" />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- YAPBOZ OYUNU ---
const Yapboz = ({ onComplete }) => {
  const size = 3;
  const imgUrl = "https://picsum.photos/id/102/300/300"; 
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const initialPieces = Array.from({ length: size * size }, (_, i) => i);
    setPieces([...initialPieces].sort(() => Math.random() - 0.5));
  }, []);

  const movePiece = (index) => {
    const emptyIndex = pieces.indexOf(size * size - 1);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
      const newPieces = [...pieces];
      [newPieces[index], newPieces[emptyIndex]] = [newPieces[emptyIndex], newPieces[index]];
      setPieces(newPieces);
      if (newPieces.every((p, i) => p === i)) {
        confetti({ particleCount: 150 });
        if (onComplete) onComplete();
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: '5px', width: '240px', margin: '0 auto', border: '4px solid #ffc1cc', borderRadius: '15px', padding: '5px', background: 'white' }}>
        {Array.isArray(pieces) && pieces.map((p, i) => (
          <div key={i} onClick={() => movePiece(i)} style={{ width: '74px', height: '74px', borderRadius: '8px', cursor: 'pointer', overflow: 'hidden', backgroundColor: p === size * size - 1 ? '#fff5f7' : 'white' }}>
            {p !== size * size - 1 && (
              <div style={{ 
                width: '222px', 
                height: '222px', 
                backgroundImage: `url(${imgUrl})`, 
                backgroundPosition: `${-(p % size) * 74}px ${-Math.floor(p / size) * 74}px`, 
                backgroundSize: '222px 222px' 
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- KALP YAKALA OYUNU ---
const KalpYakala = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(40);
  const [isCatching, setIsCatching] = useState(false);
  const keysPressed = useRef({});

  useEffect(() => {
    let animationFrame;
    const updatePosition = () => {
      if (!gameEnded) {
        if (keysPressed.current["ArrowLeft"]) setPlayerPosition(p => Math.max(0, p - 1.8));
        if (keysPressed.current["ArrowRight"]) setPlayerPosition(p => Math.min(85, p + 1.8));
        animationFrame = requestAnimationFrame(updatePosition);
      }
    };
    animationFrame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameEnded]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setIsCatching(true);
        setTimeout(() => setIsCatching(false), 200);
      }
    };
    const handleKeyUp = (e) => { keysPressed.current[e.key] = false; };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameEnded) return;
    const interval = setInterval(() => {
      setItems(prev => [...prev, { id: Date.now() + Math.random(), x: Math.random() * 80 + 5, y: -10, speed: 1.5 + (score * 0.25) }]);
    }, 1000);

    const moveItems = setInterval(() => {
      setItems(prev => {
        const currentItems = [];
        let hitFound = false;
        for (let item of prev) {
          const nextY = item.y + item.speed;
          const dist = Math.abs(item.x - playerPosition);
          if (isCatching && nextY > 60 && nextY < 85 && dist < 18) {
            hitFound = true;
            continue;
          }
          if (nextY < 110) currentItems.push({ ...item, y: nextY });
        }
        if (hitFound) {
          setScore(s => {
            const ns = s + 1;
            if (ns >= 10) {
              setGameEnded(true);
              confetti({ particleCount: 150 });
              if (onComplete) onComplete();
            }
            return ns;
          });
        }
        return currentItems;
      });
    }, 30);
    return () => { clearInterval(interval); clearInterval(moveItems); };
  }, [gameEnded, score, isCatching, playerPosition]);

  return (
    <div style={{ height: '450px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #fff9fb, #ffe0e6)', borderRadius: '30px', border: '4px solid #ffc1cc' }}>
      <div style={{ position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', color: '#ff4d4d', zIndex: 20, background: 'rgba(255,255,255,0.9)', padding: '8px 15px', borderRadius: '20px', fontSize: '13px' }}>Puan: {score} / 10 | Space: Yakala!</div>
      {!gameEnded ? ( <>
        {Array.isArray(items) && items.map(item => <div key={item.id} style={{ position: 'absolute', left: `${item.x}%`, top: `${item.y}%`, zIndex: 10 }}><img src={DusenKafa} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid white' }} alt="kafa" /></div>)}
        <div style={{ position: 'absolute', bottom: '10px', left: `${playerPosition}%`, width: '120px', height: '160px', zIndex: 15 }}><img src={isCatching ? SenYakala : SenNormal} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="karakter" /></div>
      </>) : ( <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><Heart fill="#ff4d4d" size={70} /><h2 style={{ color: '#ff4d4d', fontFamily: 'Dancing Script' }}>Harika! ❤️</h2></div> )}
    </div>
  );
};

// --- NASA GÖKYÜZÜ ---
const StarMap = () => {
    const [glitters, setGlitters] = useState([]);
    useEffect(() => { setGlitters(Array.from({ length: 45 }).map((_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 3 + 1, delay: Math.random() * 5 }))); }, []);
    return (
        <div style={{ width: '100%', height: '280px', backgroundColor: '#020617', borderRadius: '35px', position: 'relative', overflow: 'hidden', border: '6px solid #ffc1cc', boxShadow: '0 15px 40px rgba(255,193,204,0.3)', zIndex: 1 }}>
            <motion.img src="/nasa-gokyuzu.jpg" animate={{ scale: [1.1, 1.25, 1.1], x: [-15, 15, -15], rotate: [0, 2, -2, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ width: '130%', height: '130%', objectFit: 'cover', position: 'absolute', top: '-15%', left: '-15%', opacity: 0.8 }} alt="nasa" />
            {Array.isArray(glitters) && glitters.map(glitter => (
                <motion.div key={glitter.id} animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 3, delay: glitter.delay, repeat: Infinity }} style={{ position: 'absolute', left: `${glitter.x}%`, top: `${glitter.y}%`, width: `${glitter.size}px`, height: `${glitter.size}px`, backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 0 12px 3px rgba(255,255,255,0.9)', zIndex: 2 }} />
            ))}
            <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: 'white', fontWeight: 'bold', zIndex: 4, textShadow: '0 2px 10px black' }}>21 Nisan Gecesi Kozmos... ✨</div>
        </div>
    );
};

// --- RADYO ---
const MuzikKutusu = () => {
    const [songs, setSongs] = useState([]); const [newTitle, setNewTitle] = useState(""); const [newArtist, setNewArtist] = useState("");
    useEffect(() => { fetch(`${API_BASE_URL}/api/songs`).then(r => r.json()).then(data => setSongs(Array.isArray(data) ? data : [])); }, []);
    const addSong = async (e) => {
        e.preventDefault(); if (newTitle.trim() && newArtist.trim()) {
            const res = await fetch(`${API_BASE_URL}/api/songs`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ title: newTitle, artist: newArtist }) });
            const data = await res.json(); setSongs(prev => [...prev, data]); setNewTitle(""); setNewArtist("");
        }
    };
    const deleteSong = async (id) => { await fetch(`${API_BASE_URL}/api/songs/${id}`, { method: 'DELETE' }); setSongs(prev => prev.filter(s => s.id !== id)); };
    return (
        <div style={{ background: 'linear-gradient(135deg, #ffecf2, #ffcad4)', padding: '15px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(255,182,193,0.4)', textAlign: 'center', width: '220px', border: '4px solid white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}><Disc size={20} className="spin-slow" style={{color: '#f82f8d'}} /><strong>Aşk Radyosu</strong></div>
            <div style={{ height: '100px', overflowY: 'auto' }}>{songs.map((song, i) => <div key={song.id || i} style={{fontSize: '10px', display: 'flex', justifyContent: 'space-between', padding:'5px', borderBottom:'1px solid #eee'}}>{song.title} <Trash2 size={10} style={{cursor:'pointer', color:'#ff8a8a'}} onClick={()=>deleteSong(song.id)} /></div>)}</div>
            <form onSubmit={addSong} style={{display:'flex', flexDirection:'column', gap:'5px', marginTop:'10px'}}><input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Şarkı..." style={{fontSize:'10px', padding:'5px', borderRadius:'5px', border:'1px solid #eee'}}/><input value={newArtist} onChange={e=>setNewArtist(e.target.value)} placeholder="Sanatçı..." style={{fontSize:'10px', padding:'5px', borderRadius:'5px', border:'1px solid #eee'}}/><button type="submit" style={{background:'#f82f8d', color:'white', border:'none', borderRadius:'5px', padding:'5px', cursor:'pointer'}}>Ekle</button></form>
        </div>
    );
};

// --- LİSTE ---
const AlinacaklarListesi = () => {
    const [items, setItems] = useState([]); const [newItem, setNewItem] = useState("");
    useEffect(() => { fetch(`${API_BASE_URL}/api/todos`).then(r => r.json()).then(data => setItems(Array.isArray(data) ? data : [])); }, []);
    const addItem = async (e) => { e.preventDefault(); if (newItem.trim()) { const res = await fetch(`${API_BASE_URL}/api/todos`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ text: newItem.trim() }) }); const data = await res.json(); setItems([...items, data]); setNewItem(""); } };
    const toggleItem = async (id, status) => { await fetch(`${API_BASE_URL}/api/todos/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ done: !status }) }); setItems(prev => prev.map(i => i.id === id ? {...i, done: !status} : i)); };
    return (
        <div style={{ background: '#b2ddfa', padding: '15px', borderRadius: '25px', width: '220px', border: '4px solid #140566', marginTop: '20px' }}>
            <div style={{ textAlign: 'center' }}><Home size={24} /><h4>Ortak Yuva</h4></div>
            <div style={{ maxHeight: '100px', overflowY: 'auto', marginBottom:'10px' }}>{items.map((item, i) => <div key={i} onClick={()=>toggleItem(item.id, item.done)} style={{fontSize: '12px', textDecoration: item.done ? 'line-through' : 'none', cursor:'pointer', padding:'3px'}}><Key size={14} style={{verticalAlign:'middle'}}/> {item.text}</div>)}</div>
            <form onSubmit={addItem} style={{display:'flex', gap:'5px'}}><input value={newItem} onChange={e=>setNewItem(e.target.value)} style={{flex:1, fontSize:'10px', padding:'5px', borderRadius:'5px'}}/><button type="submit" style={{background:'#140566', color:'white', border:'none', borderRadius:'5px', padding:'0 10px'}}>+</button></form>
        </div>
    );
};

// --- ANA UYGULAMA ---
function App() {
    const [started, setStarted] = useState(false); const [timePassed, setTimePassed] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    const [showStressModal, setShowStressModal] = useState(false); const [showMapModal, setShowMapModal] = useState(false); const [showGameModal, setShowGameModal] = useState(false);
    const [activeGame, setActiveGame] = useState('menu'); const [showAniTreni, setShowAniTreni] = useState(false); const [showPassModal, setShowPassModal] = useState(false);
    const [showLetter, setShowLetter] = useState(false); const [activeCategory, setActiveCategory] = useState("filmler");
    const [memories, setMemories] = useState([]); const [dreams, setDreams] = useState({ filmler: [], yerler: [], aktiviteler: [] });
    const [password, setPassword] = useState("");
    const anniversaryDate = new Date(2017, 3, 21, 15, 30);

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = new Date() - anniversaryDate;
            setTimePassed({ days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), mins: Math.floor((diff / 60000) % 60), secs: Math.floor((diff / 1000) % 60) });
        }, 1000); return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/memories`).then(r => r.json()).then(data => { if(Array.isArray(data)) setMemories(data.map(m => ({ id: m.id, img: `${API_BASE_URL}/uploads/${m.resim_adi}`, note: m.aciklama }))); });
        fetch(`${API_BASE_URL}/api/dreams`).then(r => r.json()).then(data => { const dObj = { filmler: [], yerler: [], aktiviteler: [] }; if (Array.isArray(data)) data.forEach(d => { if(dObj[d.category]) dObj[d.category].push({ id: d.id, text: d.text }); }); setDreams(dObj); });
    }, []);

    const gardenFlowers = useMemo(() => Array.from({ length: 200 }).map((_, i) => ({ id: i, left: Math.random() * 90 + 5, top: Math.random() * 60 + 25, emoji: ["🌸", "🌹", "🌷", "🌺", "🌻"][i % 5], size: Math.random() * 10 + 18, delay: Math.random() * 2 })), []);

    return (
        <div style={{ backgroundColor: '#fff5f7', minHeight: '100vh', width: '100%', position: 'relative', fontFamily: "'Quicksand', sans-serif", overflow: 'hidden' }}>
            <AnimatePresence>
                {!started ? (
                    <motion.div key="entry" style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                        <button onClick={() => { setStarted(true); confetti({ particleCount: 300 }); }} style={{ padding: '22px 60px', fontSize: '26px', background: 'linear-gradient(45deg, #ff4d4d, #f82f8d)', color: 'white', border: 'none', borderRadius: '60px', cursor: 'pointer', fontFamily: 'Dancing Script' }}>Hikayemizi Başlat ❤️</button>
                    </motion.div>
                ) : (
                    <>
                        {/* KAR TANESİ KALPLER */}
                        {Array.from({ length: 50 }).map((_, i) => {
                            const xStart = Math.random() * 100;
                            return (
                                <motion.div key={i} initial={{ y: -50, x: `${xStart}%`, opacity: 0 }} animate={{ y: '110vh', x: `${xStart + (Math.random()*20-10)}%`, opacity: [0, 0.7, 0.7, 0], rotate: [0, 45, -45, 0] }} transition={{ duration: Math.random()*10+10, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', color: '#f82f8d', zIndex: 0, pointerEvents: 'none' }}><Heart fill="#f82f8d" size={Math.random()*15+10} /></motion.div>
                            );
                        })}

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', gap: '35px', position: 'relative', zIndex: 5, alignItems: 'flex-start', filter: (showAniTreni || showMapModal || showGameModal || showStressModal || showPassModal || showLetter) ? 'blur(15px)' : 'none', transition: 'filter 0.4s' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flexShrink: 0, marginLeft: '320px' }}> 
                                <MuzikKutusu />
                                <AlinacaklarListesi />
                                <div onClick={() => setShowPassModal(true)} style={{fontSize: '200px', cursor: 'pointer', textAlign: 'center'}}>🚪</div>
                            </div>

                            <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '30px', minWidth: 0 }}>
                                <header style={{textAlign: 'center'}}><h1 style={{fontSize: '4.5rem', fontFamily: 'Dancing Script', color: '#ff4d4d'}}>aystun</h1><p style={{color:'#f82f8d', fontWeight:'bold'}}>HER SANİYE, İYİ Kİ SEN...</p></header>
                                <StarMap />
                                <div style={{ background: 'white', padding: '30px', borderRadius: '35px', textAlign: 'center', boxShadow: '0 15px 45px rgba(255,193,204,0.25)' }}><h2>{timePassed.days} Gün {timePassed.hours} Saat {timePassed.mins} Dakika {timePassed.secs} Saniye</h2></div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <button onClick={() => setShowMapModal(true)} className="nav-btn-fix">📍 İlk Yerimiz</button>
                                    <button onClick={() => setShowStressModal(true)} className="nav-btn-fix">😊 Huzur Butonu</button>
                                    <button onClick={() => { setShowGameModal(true); setActiveGame('hafiza'); }} className="nav-btn-fix">🎡 Lunapark</button>
                                </div>
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px', minWidth: 0 }}>
                                <div style={{ background: 'white', padding: '30px', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.04)' }}>
                                    <h3>Hayaller Bahçesi 🌸</h3>
                                    <div style={{ display: 'flex', gap: '6px', marginBottom:'10px' }}>{['filmler', 'yerler', 'aktiviteler'].map(c => <button key={c} onClick={()=>setActiveCategory(c)} style={{flex: 1, padding:'8px', borderRadius:'10px', border:'none', background: activeCategory===c ? '#f82f8d':'#eee', color: activeCategory===c?'white':'#666', cursor:'pointer'}}>{c.toUpperCase()}</button>)}</div>
                                    <div style={{height:'150px', overflowY:'auto'}}>{dreams[activeCategory]?.map(d => <div key={d.id} style={{padding:'5px', borderBottom:'1px solid #f9f9f9'}}><CheckSquare size={14} style={{verticalAlign:'middle', color:'#f82f8d'}}/> {d.text}</div>)}</div>
                                </div>
                                <div style={{ background: 'linear-gradient(135deg, #87ee68, #93e451)', padding: '20px', borderRadius: '35px', height: '130px', position: 'relative', overflow: 'hidden' }}>
                                    {gardenFlowers.slice(0, 100).map(f => <motion.div key={f.id} animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 3, repeat: Infinity }} style={{ position: 'absolute', left: `${f.left}%`, top: `${f.top}%`, fontSize: `${f.size}px` }}>{f.emoji}</motion.div>)}
                                </div>
                                <div onClick={() => setShowAniTreni(true)} style={{textAlign: 'center', cursor: 'pointer'}}><motion.img whileHover={{scale:1.1}} src={KurdeleliKalpGorseli} style={{width: '220px'}} /><p style={{fontFamily:'Dancing Script', color:'#f82f8d', fontWeight:'bold'}}>Anılar ✨</p></div>
                            </div>
                        </motion.div>

                        {/* MODALLAR */}
                        {showGameModal && (
                            <div className="modal-fix-overlay" onClick={()=>setShowGameModal(false)}>
                                <div className="modal-fix-content" style={{maxWidth: '900px'}} onClick={e=>e.stopPropagation()}>
                                    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px'}}>
                                        {['hafiza', 'yapboz', 'yakala', 'aysunField'].map(g => <button key={g} onClick={()=>setActiveGame(g)} style={{background: activeGame === g ? '#f82f8d' : '#fff0f3', color: activeGame === g ? 'white' : '#f82f8d', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor:'pointer'}}>{g.toUpperCase()}</button>)}
                                    </div>
                                    {activeGame === 'hafiza' && <HafizaOyunu onComplete={()=>confetti()} />}
                                    {activeGame === 'yapboz' && <Yapboz onComplete={()=>confetti()} />}
                                    {activeGame === 'yakala' && <KalpYakala onComplete={()=>confetti()} />}
                                    {activeGame === 'aysunField' && <AysunTarlasi />}
                                    <X style={{position: 'absolute', top: '20px', right: '20px', cursor:'pointer'}} onClick={()=>setShowGameModal(false)} />
                                </div>
                            </div>
                        )}
                        {showMapModal && <div className="modal-fix-overlay" onClick={()=>setShowMapModal(false)}><div className="modal-fix-content" onClick={e=>e.stopPropagation()}><h2>İlk Yerimiz</h2><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.4475484838495!2d32.8538!3d39.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzlCsDU2JzAwLjAiTiAzMsKwNTEnMTMuNyJF!5e0!3m2!1str!2str!4v1619000000000!5m2!1str!2str" width="100%" height="300px" style={{border:0, borderRadius:'20px'}}></iframe><X style={{position:'absolute', top:'20px', right:'20px', cursor:'pointer'}} onClick={()=>setShowMapModal(false)} /></div></div>}
                        {showStressModal && <div className="modal-fix-overlay" onClick={()=>setShowStressModal(false)}><div className="modal-fix-content" onClick={e=>e.stopPropagation()}><Smile size={50} color="#f82f8d" /><h2>Huzur Butonu</h2><p>Her şey yolunda, yanındayım ❤️</p><button onClick={()=>setShowStressModal(false)} style={{background:'#f82f8d', color:'white', border:'none', padding:'10px 20px', borderRadius:'20px', cursor:'pointer'}}>Rahatladım</button></div></div>}
                        {showAniTreni && <div className="modal-fix-overlay" onClick={()=>setShowAniTreni(false)}><div className="modal-fix-content" style={{maxWidth: '800px'}} onClick={e=>e.stopPropagation()}><h2>Anılarımız</h2><div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:'10px'}}>{memories.map(m => <div key={m.id} style={{padding:'5px', background:'#eee', borderRadius:'10px'}}><img src={m.img} style={{width:'100%', borderRadius:'5px'}} /><p style={{fontSize:'10px'}}>{m.note}</p></div>)}</div><X style={{position:'absolute', top:'20px', right:'20px', cursor:'pointer'}} onClick={()=>setShowAniTreni(false)} /></div></div>}
                        {showPassModal && <div className="modal-fix-overlay" onClick={()=>setShowPassModal(false)}><div className="modal-fix-content" onClick={e=>e.stopPropagation()}><h2>Gizli Oda</h2><Lock size={40} color="#f82f8d"/><br/><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter' && e.target.value==='2104'){setShowLetter(true); setShowPassModal(false); setPassword("");}}} placeholder="****" style={{textAlign:'center', padding:'10px', borderRadius:'10px', border:'1px solid #ddd'}}/></div></div>}
                        {showLetter && <div className="modal-fix-overlay" onClick={()=>setShowLetter(false)}><div className="modal-fix-content" style={{background:'#fdfcf0'}} onClick={e=>e.stopPropagation()}><h2>Sevgilim...</h2><p>Seninle geçen her gün bir hediye. ❤️</p><p style={{textAlign:'right'}}>Aysun.</p><X style={{position:'absolute', top:'20px', right:'20px', cursor:'pointer'}} onClick={()=>setShowLetter(false)} /></div></div>}
                    </>
                )}
            </AnimatePresence>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Quicksand:wght@400;600;700&display=swap');
                .nav-btn-fix { padding: 22px; border: none; background: white; border-radius: 30px; cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.05); color: #f82f8d; font-weight: bold; transition: 0.3s; }
                .nav-btn-fix:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(248,47,141,0.2); }
                .modal-fix-overlay { position: fixed; inset: 0; background: rgba(255,245,247,0.85); z-index: 2000; display: grid; place-items: center; backdrop-filter: blur(12px); }
                .modal-fix-content { background: white; padding: 45px; border-radius: 50px; position: relative; width: 90%; max-width: 800px; box-shadow: 0 40px 100px rgba(248,47,141,0.15); overflow-y: auto; max-height: 90vh; }
                .spin-slow { animation: spin 8s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default App;