import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  Heart, MapPin, Smile, MessageCircle, Lock, ExternalLink, Globe, Film, PlaneTakeoff, Sparkles, CheckSquare, PlusCircle, FerrisWheel, RotateCcw, Camera, X, Upload, Music, Play, Trash2, Disc, Key, Home, Skull, Flag, Terminal, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- GÖRSELLER (WEBP VE PNG) ---
import KurdeleliKalpGorseli from './assets/kurdeleli_kalp.png';
import SenNormal from './assets/sen_normal.webp'; 
import SenYakala from './assets/sen_yakala.webp';
import DusenKafa from './assets/dusen_kafa.webp';
// Resimlerini bu şekilde dosyanın başına import et
import resim1 from './assets/resim1.jpeg';
import resim2 from './assets/resim2.jpeg';
import resim3 from './assets/resim3.jpeg';
import resim4 from './assets/resim4.jpeg';
import resim5 from './assets/resim5.jpeg';
import resim6 from './assets/resim6.jpeg';
import resim7 from './assets/resim7.jpeg';
import resim8 from './assets/resim8.jpeg';
import myImage from './assets/resim.jpeg';

// Diziyi artık bu değişkenlerle oluşturuyoruz
const placeholderImages = [
  resim1, resim2, resim3, resim4, 
  resim5, resim6, resim7, resim8
];
// --- SUNUCU ADRESİ ---
const API_BASE_URL = "https://your-render-app.onrender.com";

const HafizaOyunu = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const isGameFinished = cards.length > 0 && matchedPairs.length === cards.length;

  const setupGame = useCallback(() => {
    // 8 resimden 16 kartlık dizi oluşturur
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
            confetti({
              particleCount: 200,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#ff4d4d', '#ffc1cc', '#ffffff']
            });
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
    <div style={{ 
      textAlign: 'center', 
      maxWidth: '850px', 
      margin: '0 auto', 
      padding: '30px 20px',
      minHeight: '70vh',
      position: 'relative'
    }}>
      
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          color: '#ff4d4d', 
          fontFamily: "'Georgia', serif", 
          fontStyle: 'italic',
          marginBottom: '20px',
          fontSize: '2rem'
        }}
      >
        "Hafızamda sadece sen varsın..."
      </motion.h2>

      <button 
        onClick={setupGame} 
        style={{ 
          marginBottom: '25px', 
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: 'none', 
          background: '#fff0f3', 
          color: '#ff4d4d', 
          fontWeight: 'bold', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          margin: '0 auto 25px',
          boxShadow: '0 4px 10px rgba(255, 193, 204, 0.4)'
        }}
      >
        <RotateCcw size={16}/> Sıfırla
      </button>

      <AnimatePresence>
  {isGameFinished && (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        position: 'fixed', // 'absolute' yerine 'fixed' yaparak ekranın görünür alanına sabitledik
        top: '50%',
        left: '38%',
        transform: 'translate(-50%, -50%)', // Tam orta noktayı bulması için kritik satır
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.98)',
        padding: '30px',
        borderRadius: '30px',
        boxShadow: '0 10px 50px rgba(255, 77, 77, 0.5)',
        border: '3px solid #ffc1cc',
        width: '90%', // Mobilde taşmaması için genişliği yüzdesel verdik
        maxWidth: '450px', // Çok büyük ekranlarda devasa olmaması için
        pointerEvents: 'none' // Altındaki butonlara basmaya engel olmasın istersen
      }}
    >
      <h1 style={{ color: '#ff4d4d', marginBottom: '10px', fontSize: '1.8rem' }}>
        Hepsini Hatırlıyorum! ❤️
      </h1>
      <p style={{ color: '#555', fontSize: '1.1rem', margin: 0 }}>
        Seninle olan her anım benim en değerli hazinem.
      </p>
    </motion.div>
  )}
</AnimatePresence>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', // 16 kart için 4x4 düzeni en iyisidir
        gap: '15px',
        filter: isGameFinished ? 'blur(4px)' : 'none',
        transition: 'filter 0.5s'
      }}>
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(index);
          return (
            <div 
              key={card.id} 
              onClick={() => handleCardClick(index)} 
              style={{ cursor: 'pointer', perspective: '1000px', aspectRatio: '3/4' }}
            >
              <motion.div 
                animate={{ rotateY: isFlipped ? 180 : 0 }} 
                transition={{ duration: 0.5 }} 
                style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
              >
                <div style={{ 
                  position: 'absolute', width: '100%', height: '100%', 
                  backfaceVisibility: 'hidden', 
                  background: 'linear-gradient(135deg, #ffc1cc, #ffecf0)', 
                  borderRadius: '15px', 
                  display: 'grid', placeItems: 'center', 
                  border: '3px solid white'
                }}>
                  <Heart size={32} color="#ff4d4d" fill="#ff4d4d" />
                </div>

                <div style={{ 
                  position: 'absolute', width: '100%', height: '100%', 
                  backfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)', 
                  borderRadius: '15px', 
                  overflow: 'hidden', 
                  border: '3px solid white' 
                }}>
                  <img 
                    src={card.img} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt="anı" 
                  />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Yapboz = ({ onComplete }) => {
  const size = 4;
  // Ekranın %80'ini geçmeyecek şekilde genişliği ayarlıyoruz
  const [pieces, setPieces] = useState([]);
  const [imgDim, setImgDim] = useState({ width: 0, height: 0, ratio: 1 });

  useEffect(() => {
    const img = new Image();
    img.src = myImage;
    img.onload = () => {
      const ratio = img.width / img.height;
      // Parça boyutlarını ekranın genişliğine göre dinamik hesapla (örneğin parça başı 120-150px)
      setImgDim({ width: 100 * ratio, height: 100, ratio });
      
      const initialPieces = Array.from({ length: size * size }, (_, i) => i);
      setPieces([...initialPieces].sort(() => Math.random() - 0.5));
    };
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
        confetti({ particleCount: 150, spread: 70 });
        if (onComplete) onComplete();
      }
    }
  };

  if (!imgDim.width) return null;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '10px',
      overflow: 'hidden' // Kayma çubuklarını engeller
    }}>
      
      {/* Kısa ve Öz Not */}
      <div style={{ marginBottom: '15px', textAlign: 'center' }}>
        <h3 style={{ color: '#d63384', margin: '0 0 5px 0' }}>Tamamlanıyoruz ❤️</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
          Biz, birbirini tamamlayan en güzel manzarayız. Bu resimdeki her bir parça gibi, ruhumun her köşesi de senin sevginle yerini buluyor.❤️
        </p>
      </div>

      {/* Yapboz Alanı */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${size}, ${imgDim.width}px)`, 
        gap: '4px', 
        padding: '10px',
        background: '#fff',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        border: '3px solid #ffc1cc'
      }}>
        {pieces.map((p, i) => (
          <div key={i} onClick={() => movePiece(i)} style={{ 
            width: `${imgDim.width}px`, 
            height: `${imgDim.height}px`, 
            cursor: 'pointer', 
            overflow: 'hidden',
            borderRadius: '6px',
            backgroundColor: p === size * size - 1 ? '#fff5f7' : '#eee'
          }}>
            {p !== size * size - 1 && (
              <div style={{ 
                width: `${imgDim.width * size}px`, 
                height: `${imgDim.height * size}px`, 
                backgroundImage: `url(${myImage})`, 
                backgroundPosition: `${-(p % size) * imgDim.width}px ${-Math.floor(p / size) * imgDim.height}px`, 
                backgroundSize: `${imgDim.width * size}px ${imgDim.height * size}px`
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


// --- OPTİMİZE EDİLMİŞ KALP YAKALA OYUNU ---
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
        if (keysPressed.current["ArrowLeft"]) {
          setPlayerPosition(p => Math.max(-15, p - 1.8));
        }
        if (keysPressed.current["ArrowRight"]) {
          setPlayerPosition(p => Math.min(60, p + 1.8));
        }
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
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };
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
      setItems(prev => [...prev, { 
        id: Date.now() + Math.random(), 
        x: Math.random() * 80 + 5, 
        y: -10, 
        speed: 1.5 + (score * 0.2) 
      }]);
    }, 1000);

    const moveItems = setInterval(() => {
      setItems(prev => {
        const currentItems = [];
        let hitFound = false;

        for (let item of prev) {
          const nextY = item.y + item.speed;
          const dist = Math.abs(item.x - playerPosition);
          
          if (isCatching && nextY > 60 && nextY < 75 && dist < 20) {
            hitFound = true;
            continue;
          }
          
          if (nextY < 110) {
            currentItems.push({ ...item, y: nextY });
          }
        }

        if (hitFound) {
          setScore(s => {
            const ns = s + 1;
            if (ns >= 30) {
              setGameEnded(true);
              confetti({ particleCount: 150 });
              if (onComplete) onComplete() ;
            }
            return ns;
          });
        }
        return currentItems;
      });
    }, 30);

    return () => {
      clearInterval(interval);
      clearInterval(moveItems);
    };
  }, [gameEnded, score, isCatching, playerPosition]);

  return (
    <div style={{height: '850px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #fff9fb, #ffe0e6)', borderRadius: '30px', border: '4px solid #ffc1cc' }}>
      <div style={{ position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', color: '#ff4d4d', zIndex: 20, background: 'rgba(255,255,255,0.9)', padding: '8px 15px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', whiteSpace: 'nowrap', fontSize: '13px' }}>
        Puan: {score} / 30 | Ok Tuşları: Hareket, Space: Yakala!
      </div>

      {!gameEnded ? (
        <>
          {Array.isArray(items) && items.map(item => (
            <div key={item.id} style={{ position: 'absolute', left: `${item.x}%`, top: `${item.y}%`, zIndex: 10 }}>
               <img src={DusenKafa} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid white' }} alt="kafa" />
            </div>
          ))}

          <div style={{ position: 'absolute', bottom: '0px', left: `${playerPosition}%`, width: '300px', height: '300px', zIndex: 15 }}>
            <img 
              src={isCatching ? SenYakala : SenNormal} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              alt="karakter" 
            />
          </div>
        </>
      ) : (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Heart fill="#ff4d4d" color="#ff4d4d" size={70} />
          <h2 style={{ color: '#ff4d4d', fontFamily: 'Dancing Script', fontSize: '2.2rem', marginTop: '15px' }}>Hepsini Yakaladın!</h2>
          <p style={{ color: '#f82f8d', fontWeight: 'bold' }}>Kalbimi yakaladığın gibi... ❤️</p>
        </div>
      )}
    </div>
  );
};
// --- AYSUN TARLASI (MAYIN TARLASI) ---
const [SEVGILININ_ADI]_CONFIG = \{
  EASY: { 
    size: 8, mines: 8, label: "Sakin Aysun", 
    messages: ["Peki...", "Anladım.", "Sen bilirsin.", "Hmm.", "Tamam."] 
  },
  MEDIUM: { 
    size: 12, mines: 18, label: "Ciddi İlişki", 
    messages: ["Neden geç yazdın?", "Telefonu neden açmadın?", "Yine mi oyun oynuyosun?", "İyi çık Tunahan!", "Böyle devam et!😒"] 
  },
  HARD: { 
    size: 16, mines: 35, label: "Sinirli Aysun", 
    messages: ["BİTTİ!","İSTEMİYORUM, GİT! ", "Engellendiniz.", "Yazma bana bir daha!", "Seninle uğraşamam!"] 
  }
};

const AysunTarlasi = ({ onComplete }) => {
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
    const { size, mines } = AYSUN_CONFIG[difficulty];
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
    setGameOver(false);
    setWin(false);
    setFlagsUsed(0);
    setLogs([]);
    addLog(`[SYSTEM]: ${AYSUN_CONFIG[difficulty].label} modu aktif.`, "success");
    addLog("[INFO]: Duygusal veri seti parse ediliyor...");
  }, [difficulty, addLog]);

  useEffect(() => { initBoard(); }, [initBoard]);
  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const handleReveal = (r, c) => {
    if (gameOver || win || board[r][c].revealed || board[r][c].flagged) return;
    
    let newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (newBoard[r][c].isMine) {
      setGameOver(true);
      const currentMessages = AYSUN_CONFIG[difficulty].messages;
      const randomTrip = currentMessages[Math.floor(Math.random() * currentMessages.length)];
      addLog(`[CRITICAL]: ${randomTrip}`, "error");
      
      // Tüm mayınları göster
      newBoard.forEach(row => row.forEach(cell => { if (cell.isMine) cell.revealed = true; }));
      setBoard(newBoard);
      return;
    }

    const floodFill = (row, col) => {
      if (row < 0 || row >= AYSUN_CONFIG[difficulty].size || col < 0 || col >= AYSUN_CONFIG[difficulty].size) return;
      if (newBoard[row][col].revealed || newBoard[row][col].isMine || newBoard[row][col].flagged) return;
      
      newBoard[row][col].revealed = true;
      if (newBoard[row][col].neighborCount === 0) {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            floodFill(row + x, col + y);
          }
        }
      }
    };

    floodFill(r, c);
    setBoard(newBoard);
    addLog(`[DEBUG]: (${r},${c}) bölgesi optimize edildi.`);
    checkWin(newBoard);
  };

  const handleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || win || board[r][c].revealed) return;

    let newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const isAddingFlag = !newBoard[r][c].flagged;
    
    newBoard[r][c].flagged = isAddingFlag;
    setBoard(newBoard);
    setFlagsUsed(prev => isAddingFlag ? prev + 1 : prev - 1);
    addLog(isAddingFlag ? `[HEART]: (${r},${c}) hücresine sevgi mühürü basıldı.` : `[HEART]: Kalp geri çekildi... :(`, "info");
  };

  const checkWin = (currentBoard) => {
    const { size, mines } = AYSUN_CONFIG[difficulty];
    let revealedCount = 0;
    currentBoard.forEach(row => row.forEach(cell => { if (cell.revealed) revealedCount++; }));
    
    if (revealedCount === (size * size) - mines) {
      setWin(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      addLog("[SUCCESS]: Global Optimum! Aysun'un kalbi %100 güvende.", "success");
      if (onComplete) onComplete();
    }
  };

  const cellSize = difficulty === 'HARD' ? 28 : difficulty === 'MEDIUM' ? 32 : 35;

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', flexWrap: 'wrap', backgroundColor: '#fff5f7', borderRadius: '20px' }}>
      
      {/* SOL: LOG TERMİNALİ */}
      <div style={{ width: '250px', background: '#1a1b26', borderRadius: '15px', padding: '15px', border: '2px solid #f82f8d', fontFamily: "'Fira Code', monospace", fontSize: '11px' }}>
        <div style={{ color: '#f82f8d', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
          <Terminal size={14} style={{ marginRight: '5px' }} /> Trip_Tarlası
        </div>
        <div style={{ height: '320px', overflowY: 'auto', color: '#a9b1d6' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '4px', color: log.type === "error" ? "#ff5c77" : log.type === "success" ? "#4ade80" : "#a9b1d6" }}>
              <span style={{ opacity: 0.5 }}>{log.time}</span> {log.msg}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* ORTA: OYUN ALANI */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {Object.keys(AYSUN_CONFIG).map(lvl => (
            <button key={lvl} onClick={() => setDifficulty(lvl)} 
              style={{ 
                padding: '8px 15px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: difficulty === lvl ? '#f82f8d' : '#white',
                color: difficulty === lvl ? 'white' : '#f82f8d',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontWeight: 'bold'
              }}>
              {AYSUN_CONFIG[lvl].label}
            </button>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${AYSUN_CONFIG[difficulty].size}, ${cellSize}px)`, 
          gap: '4px', background: '#ffd1dc', padding: '10px', borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(248,47,141,0.2)'
        }}>
          {board.map((row, r) => row.map((cell, c) => (
            <motion.div
              key={`${r}-${c}`}
              whileHover={{ scale: 1.08 }}
              onClick={() => handleReveal(r, c)}
              onContextMenu={(e) => handleFlag(e, r, c)}
              style={{
                width: `${cellSize}px`, height: `${cellSize}px`, borderRadius: '6px', cursor: 'pointer',
                display: 'grid', placeItems: 'center', fontWeight: 'bold',
                background: cell.revealed ? (cell.isMine ? '#ff4d4d' : '#ffffff') : (cell.flagged ? '#fff' : '#f82f8d44'),
                border: '1px solid #f82f8d22'
              }}
            >
              {cell.revealed ? (
               cell.isMine ? "😒" : (cell.neighborCount > 0 ? cell.neighborCount : "")
              ) : (
                cell.flagged ? <Heart size={cellSize - 14} fill="#f82f8d" color="#f82f8d" /> : ""
              )}
            </motion.div>
          )))}
        </div>

        <button onClick={initBoard} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '30px', border: 'none', background: '#f82f8d', color: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: '20px auto' }}>
          <RotateCcw size={16} /> Sistemi Yeniden Başlat
        </button>
      </div>

      {/* SAĞ: DURUM PANELİ */}
      <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#f82f8d', fontSize: '14px', textAlign: 'center' }}>ANALİZ PANELİ</h3>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Durum:</span>
              <b style={{ color: gameOver ? '#ff4d4d' : win ? '#4ade80' : '#f82f8d' }}>
                {gameOver ? 'ERROR' : win ? 'STABLE' : 'RUNNING'}
              </b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Kalp Sayısı:</span>
              <b>{flagsUsed} / {AYSUN_CONFIG[difficulty].mines}</b>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {(gameOver || win) && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ padding: '15px', borderRadius: '20px', background: win ? '#dcfce7' : '#fee2e2', border: `2px solid ${win ? '#22c55e' : '#ef4444'}`, textAlign: 'center' }}>
              {win ? <ShieldCheck color="#15803d" size={40} /> : <AlertTriangle color="#b91c1c" size={40} />}
              <p style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '10px', color: win ? '#15803d' : '#b91c1c' }}>
                {win ? "Aysun'u mutlu etmeyi başardın!" : "Aysun'un sitemiyle karşılaştın! "}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
// --- NASA GÖKYÜZÜ ---
const StarMap = () => {
  const [glitters, setGlitters] = useState([]);

  useEffect(() => {
    const newGlitters = Array.from({ length: 45 }).map((_, i) => ({ 
      id: i, 
      x: Math.random() * 100, 
      y: Math.random() * 100, 
      size: Math.random() * 3 + 1, 
      delay: Math.random() * 5 
    }));
    setGlitters(newGlitters);
  }, []);

  return (
    <div style={{ width: '100%', height: '280px', backgroundColor: '#020617', borderRadius: '35px', position: 'relative', overflow: 'hidden', border: '6px solid #ffc1cc', boxShadow: '0 15px 40px rgba(255,193,204,0.3)', zIndex: 1 }}>
      <motion.img 
        src="/nasa-gokyuzu.jpg" 
        animate={{ scale: [1.1, 1.25, 1.1], x: [-15, 15, -15], rotate: [0, 2, -2, 0] }} 
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
        style={{ width: '130%', height: '130%', objectFit: 'cover', position: 'absolute', top: '-15%', left: '-15%', opacity: 0.8 }} 
        alt="nasa" 
      />
      {Array.isArray(glitters) && glitters.map(glitter => (
        <motion.div 
          key={glitter.id} 
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} 
          transition={{ duration: 3, delay: glitter.delay, repeat: Infinity }} 
          style={{ position: 'absolute', left: `${glitter.x}%`, top: `${glitter.y}%`, width: `${glitter.size}px`, height: `${glitter.size}px`, backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 0 12px 3px rgba(255,255,255,0.9)', zIndex: 2, pointerEvents: 'none' }} 
        />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent, rgba(255,193,204,0.1))', zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: 'white', fontWeight: 'bold', zIndex: 4, textShadow: '0 2px 10px rgba(0,0,0,0.8)', fontFamily: 'Quicksand, sans-serif' }}>
        21 Nisan Gecesi Evren... ✨
      </div>
    </div>
  );
};

// --- AŞK ÇARKI ---
const AskCarki = ({ memories }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [canSpin, setCanSpin] = useState(true);

  const dailyMemory = useMemo(() => {
    if (!Array.isArray(memories) || memories.length === 0) return null;
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return memories[dateSeed % memories.length];
  }, [memories]);
  
  const colors = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF", "#FFB5E8", "#D5AAFF"];
  const rewards = ["Dilediğin Yemek 🍝", "Masaj 💆‍♂️","En Sevdiğin Tatlı 🍰", "1 Gün 'Evet' ✅", "Sınırsız Sarılma 🤗","Sabah Kahvaltısı Benden 🍳","Tunahan'dan Online Alışveriş Sepeti Onayı 🛒","Tunahan'dan yemek şov 🍰","Tunahan'a 1000 tl para cezası 🤗 ","Tunahan'dan masaj💆‍♂️","Dilediğin Yemek 🍝", "Masaj 💆‍♂️", "Komik Dans 💃","En Sevdiğin Tatlı 🍰", "1 Gün 'Evet' ✅", "Sınırsız Sarılma 🤗","Sabah Kahvaltısı Benden 🍳","Tunahan'dan Online Alışveriş Sepeti Onayı 🛒","Tunahan'dan yemek şov 🍰","Tunahan'dan masaj💆‍♂️"];
  const conicGradient = rewards.map((_, i) => `${colors[i % colors.length]} ${i * 18}deg ${(i + 1) * 18}deg`).join(', ');

  const checkSpinLimit = useCallback(() => {
    const lastSpin = localStorage.getItem('lastSpinDate');
    if (lastSpin) {
      const diff = Date.now() - parseInt(lastSpin);
      const aWeek =60 * 1000;
      if (diff < aWeek) {
        setCanSpin(false);
        const ms = aWeek - diff;
        const d = Math.floor(ms / (24 * 60 * 60 * 1000));
        const h = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const m = Math.floor((ms % (60 * 60 * 1000)) / (1000 * 60));
        setTimeLeft(`${d}g ${h}sa ${m}dk`);
      } else { setCanSpin(true); }
    } else { setCanSpin(true); }
  }, []);

  useEffect(() => { 
    // Bunu geçici olarak useEffect içine veya dosyanın en üstüne (importların altına) yapıştır:
    checkSpinLimit(); 
    const interval = setInterval(checkSpinLimit, 1000); 
    return () => clearInterval(interval); 
  }, [checkSpinLimit]);

  const spinWheel = () => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setResult(null);
    const newRotation = rotation + 2880 + Math.random() * 360; 
    setRotation(newRotation);
    setTimeout(() => {
      setSpinning(false);
      const actualDegree = newRotation % 360;
      const index = Math.floor((360 - actualDegree) / 18) % 20;
      setResult(rewards[index]);
      localStorage.setItem('lastSpinDate', Date.now().toString());
      setCanSpin(false);
      confetti({ particleCount: 120, spread: 80, colors: ['#ffc1cc', '#ffd700', '#ffffff'] });
    }, 4000);
  };

  return (
    <div style={{ position: 'absolute', top: '55%', left: '-200px', zIndex: 100, transition: 'all 0.5s ease-in-out' }}>
      <AnimatePresence>
        {dailyMemory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{ position: 'absolute', top: '-490px', left: '0%', transform: 'translateX(-50%)', width: '450px', padding: '12px', background: 'white', boxShadow: '0 15px 35px rgba(248,47,141,0.2)', borderRadius: '25px', zIndex: 110, border: '8px solid #ffcad4', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ position: 'absolute', top: '-18px', background: 'linear-gradient(45deg, #f82f8d, #ffc1cc)', color: 'white', padding: '4px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', zIndex: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>❤️❤️❤️</div>
            <img src={dailyMemory.img} alt="Anı" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '5px' }} />
            <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#f82f8d', fontWeight: '700', fontFamily: 'Dancing Script', textAlign: 'center' }}>{dailyMemory.note}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', width: '450px', height: '450px' }}>
        <div style={{ position: 'absolute', top: '2%', right: '190px', zIndex: 110, width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderTop: '25px solid #f82f8d', filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,0.2))' }} />
        <motion.div animate={{ rotate: rotation }} transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }} style={{ width: '100%', height: '100%', borderRadius: '50%', background: `conic-gradient(${conicGradient})`, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '10px solid white' }} />
      </div>

      <div style={{ position: 'absolute', top: '50%', left: '350px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.95)', padding: '20px', borderRadius: '35px', backdropFilter: 'blur(10px)', border: '2px solid #ffcad4', minWidth: '160px', boxShadow: '0 10px 30px rgba(248,47,141,0.15)', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px', color: '#f82f8d', fontFamily: 'Dancing Script', fontSize: '1.2rem' }}>Haftalık Şans</h4>
          {canSpin ? (
            <button onClick={spinWheel} disabled={spinning} style={{ background: 'linear-gradient(45deg, #f82f8d, #ffc1cc)', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 5px 15px rgba(248,47,141,0.3)' }}>{spinning ? "DÖNÜYOR..." : "ÇEVİR ✨"}</button>
          ) : (
            <div style={{ fontSize: '11px', color: '#888', background: '#fff0f3', padding: '8px', borderRadius: '15px' }}>Bekleme Süresi:<br/><b style={{color: '#f82f8d'}}>{timeLeft}</b></div>
          )}
          <AnimatePresence>{result && ( <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '15px', fontSize: '13px', color: '#f82f8d', fontWeight: 'bold', background: 'white', padding: '10px', borderRadius: '15px', border: '2px dashed #ffc1cc' }}>{result}</motion.div> )}</AnimatePresence>
      </div>
    </div>
  );
};

// --- RADYO ---
const MuzikKutusu = () => {
  const [songs, setSongs] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");

  useEffect(() => { 
    fetch(`${API_BASE_URL}/api/songs`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSongs(data);
        else setSongs([]);
      })
      .catch(() => setSongs([]));
  }, []);

  const addSong = async (e) => { 
    e.preventDefault(); 
    if (newTitle.trim() && newArtist.trim()) { 
      try {
        const res = await fetch(`${API_BASE_URL}/api/songs`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title: newTitle, artist: newArtist })
        });
        const data = await res.json();
        setSongs(prev => [...prev, data]); 
        setNewTitle(""); 
        setNewArtist(""); 
        confetti({ particleCount: 30 }); 
      } catch (err) { console.error(err); }
    } 
  };

  const deleteSong = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/songs/${id}`, { method: 'DELETE' });
      setSongs(prev => prev.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #ffecf2, #ffcad4)', padding: '15px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(255,182,193,0.4)', textAlign: 'center', width: '220px', border: '4px solid white', position: 'relative', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
        <Disc size={20} className="spin-slow" style={{color: '#f82f8d'}} />
        <span style={{ color: '#f82f8d', fontWeight: 'bold', fontSize: '20px', fontFamily: 'Dancing Script' }}>Aşkımızın Melodisi </span>
      </div>
      <div style={{ height: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', scrollbarWidth: 'none' }}>
        {Array.isArray(songs) && songs.map((song, i) => (
          <div key={song.id || i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px', background: 'rgba(255,255,255,0.6)', borderRadius: '15px', border: '1px solid rgba(248,47,141,0.1)' }}>
            <a href={`https://music.youtube.com/search?q=${encodeURIComponent(song.title + ' ' + song.artist)}`} target="_blank" rel="noreferrer" style={{ background: '#f82f8d', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'grid', placeItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <Play size={10} fill="white" />
            </a>
            <div style={{ textAlign: 'left', overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#444' }}>{song.title}</div>
              <div style={{ fontSize: '9px', color: '#f82f8d', opacity: 0.8 }}>{song.artist}</div>
            </div>
            <Trash2 size={12} onClick={() => deleteSong(song.id)} style={{ color: '#ff8a8a', cursor: 'pointer' }} />
          </div>
        ))}
      </div>
      <form onSubmit={addSong} style={{ background: 'rgba(255,255,255,0.4)', padding: '10px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Şarkı..." style={{ fontSize: '10px', padding: '6px', borderRadius: '8px', border: 'none' }} />
        <input value={newArtist} onChange={e => setNewArtist(e.target.value)} placeholder="Sanatçı..." style={{ fontSize: '10px', padding: '6px', borderRadius: '8px', border: 'none' }} />
        <button type="submit" style={{ background: '#f82f8d', color: 'white', border: 'none', borderRadius: '8px', padding: '6px', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer' }}>Ekle ✨</button>
      </form>
    </div>
  );
};

// --- YUVA ANAHTARLIK ---
const AlinacaklarListesi = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Verileri çek
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/todos`)
      .then(r => r.json())
      .then(data => setItems(data))
      .catch(err => console.error("Liste çekilemedi:", err));
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const res = await fetch(`${API_BASE_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newItem.trim() })
    });
    const data = await res.json();
    setItems([...items, data]);
    setNewItem("");
    confetti({ particleCount: 45 });
  };

  const toggleItem = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: newStatus })
      });

      if (res.ok) {
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === id ? { ...item, done: newStatus } : item
          )
        );
      }
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  const deleteItem = async (id) => {
    await fetch(`${API_BASE_URL}/api/todos/${id}`, { method: 'DELETE' });
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div style={{ position: 'relative', marginTop: '40px', width: '220px' }}>
      <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '0', height: '0', borderLeft: '120px solid transparent', borderRight: '120px solid transparent', borderBottom: '25px solid #150757' }} />
      <div style={{ background: '#b2ddfa', padding: '15px', borderRadius: '0 0 25px 25px', border: '4px solid #140566', borderTop: 'none' }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <Home size={24} style={{ color: '#031d44' }} />
          <h4 style={{ margin: '5px 0 0', color: '#6b6394', fontSize: '14px', fontWeight: '700' }}>Gelecek Anahtarımız</h4>
        </div>
        <div style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '10px', scrollbarWidth: 'none' }}>
          {Array.isArray(items) && items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px dashed #ffe5ec' }}>
              <div onClick={() => toggleItem(item.id, item.done)} style={{ cursor: 'pointer', color: item.done ? '#0a054b' : '#ffd700' }}>
                <Key size={16} fill={item.done ? 'none' : '#ffd700'} />
              </div>
              <span style={{ fontSize: '12px', flex: 1, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? '#150344' : '#555' }}>
                {item.text}
              </span>
              <Trash2 size={12} onClick={() => deleteItem(item.id)} style={{ color: '#160446', cursor: 'pointer' }} />
            </div>
          ))}
        </div>
        <form onSubmit={addItem} style={{ display: 'flex', gap: '5px' }}>
          <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Yeni hayal..." style={{ flex: 1, fontSize: '11px', padding: '8px', border: '1px solid #30067c', borderRadius: '12px' }} />
          <button type="submit" style={{ background: '#110235', border: 'none', borderRadius: '20px', padding: '5px' }}><PlusCircle size={16} color="white" /></button>
        </form>
      </div>
    </div>
  );
};

// --- ANA UYGULAMA ---
function App() {
  // GÜNCELLEME: Global Giriş Şifresi State'i
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [entryPass, setEntryPass] = useState("");
  const globalPassword = "210417";

  const [started, setStarted] = useState(false);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [showReason, setShowReason] = useState(false);
  const [stressStatus, setStressStatus] = useState(null);
  const [timePassed, setTimePassed] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [showStressModal, setShowStressModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [activeGame, setActiveGame] = useState('menu');
  const [showAniTreni, setShowAniTreni] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showLetter, setShowLetter] = useState(false);
  const correctPassword = "şeftali"; 

  const [memories, setMemories] = useState([]);
  const [newNote, setNewNote] = useState("");
  const fileInputRef = useRef(null);
  const [dreams, setDreams] = useState({ filmler: [], yerler: [], aktiviteler: [] });
  const [newDream, setNewDream] = useState("");
  const [activeCategory, setActiveCategory] = useState("filmler");
  
  const anniversaryDate = new Date(2017, 3, 21, 15, 30);
  const loveReasons = [
  "Gülüşündeki o eşsiz huzur.",
  "Dünyayı daha güzel bir yer yapma gücün.",
  "Bana kendimi en değerli hissettiren bakışın.",
  "İçimde çiçekler açtıran kokun...",
  "Çinli Yazılımcı olman..",
  "Benim tatlı öğretmenim olman...",
  "Karmaşık bir kodu çözerken takındığın o aşırı odaklı yüz ifaden.",
  "Başkalarına karşı ördüğün duvarların, benim yanımda şeffaflaşması.",
  "Dünyayı kurtaracakmışız gibi ciddiyetle yaptığımız o uzun sohbetler.",
  "En huysuz olduğum anlarda bile 'gel buraya' diyen sakinliğin.",
  "Benim bile kendime inanmadığım anlarda bana olan sarsılmaz inancın.",
  "'Hallederiz' dediğinde gerçekten halledeceğini bilmenin verdiği o güven.",
  "Zayıf yanlarımı sana emanet edebilecek kadar seni kendimden saymam.",
  "Kalbinin atışını kulağımda duyduğum o tarifsiz anlar.",
  "Zorluklar karşısında 'biz bir ekibiz' diyen o duruşun.",
  "Sadece sevgilim değil, aynı zamanda en güvenilir sırdaşım olman.",
  "Varlığın, en büyük şükür sebebim.",
  "Beni ben olduğum için, her şeyimle sevmen.",
  "Ruhumun eksik parçasını sende tamamlamış olmam.",
  "Karanlık çöktüğünde gökyüzümdeki tek yıldız olman.",
  "Her 'günaydın' mesajında içimde çiçekler açtırman.",
  "Hayatımın en güzel hikayesinin seninle başlaması.",
  "Sadece yanımda olman bile her şeye yetiyor.",
  "Ve sadece... Sen olduğun için. Başka hiçbir şeye gerek duymadan.",
  "Paylaştığımız her anın paha biçilemez olması.",
  "Benim en iyi arkadaşım ve en büyük aşkım olman.",
  "Ruhuma dokunan tek insan olman.",
  "Kalbinin kapılarını sonuna kadar bana açman.",
  "Sabrın, anlayışın ve şefkatin.",
  "Birlikte keşfettiğimiz her sokak.",
  "Gece sisli havada seninle yolumu kaybettiğimde bile korkmayacak kadar güvende hissettiğim için.",
  "Başarılarımla benden daha çok gurur duyman.",
  "Beraber söylediğimiz şarkılar...",
  "Beraber izlediğimiz filmlerdeki yorumların.",
  "İzlediğimiz filmlerin sonunu hemen tahmin etmen :D",
  "Bana kendimi dünyanın en şanslı insanı gibi hissettirmen.",
  "Başımı omzuna koyduğumda zamanın durması.",
  "Bana 'biz' olmanın 'ben' olmaktan çok daha güzel olduğunu öğretmen.",
  "Kusurlarımı bile sevilecek bir şeye dönüştürmen.",
  "En yorgun günümde bile beni tek bir cümlenle dinlendirebilmen."
]
  const flowerEmojis = ["🌸", "🌹", "🌷", "🌺", "🌻"];
  const totalFlowerCount = (dreams?.filmler?.length || 0) + (dreams?.yerler?.length || 0) + (dreams?.aktiviteler?.length || 0);
  const gardenFlowers = useMemo(() => Array.from({ length: 200 }).map((_, i) => ({ id: i, left: Math.random() * 90 + 5, top: Math.random() * 60 + 25, emoji: flowerEmojis[i % 5], size: Math.random() * 10 + 18, delay: Math.random() * 2 })), []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/memories`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMemories(data.map(m => ({
            id: m.id,
            img: `${API_BASE_URL}/uploads/${m.resim_adi}`,
            note: m.aciklama
          })));
        } else setMemories([]);
      }).catch(() => setMemories([]));

    fetch(`${API_BASE_URL}/api/dreams`)
      .then(r => r.json())
      .then(data => {
        const dObj = { filmler: [], yerler: [], aktiviteler: [] };
        if (Array.isArray(data)) {
          data.forEach(d => { if(dObj[d.category]) dObj[d.category].push({ id: d.id, text: d.text }); });
        }
        setDreams(dObj);
      }).catch(() => setDreams({ filmler: [], yerler: [], aktiviteler: [] }));
  }, []);

  useEffect(() => { 
    const timer = setInterval(() => { 
      const now = new Date(); 
      const diff = now - anniversaryDate; 
      setTimePassed({ 
        days: Math.floor(diff / (1000 * 60 * 60 * 24)), 
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24), 
        mins: Math.floor((diff / 1000 / 60) % 60), 
        secs: Math.floor((diff / 1000) % 60) 
      }); 
    }, 1000); 
    return () => clearInterval(timer); 
  }, []);
  
  const handleStart = () => { 
    setStarted(true); 
    confetti({ particleCount: 300, spread: 100, colors: ['#f82f8d', '#ff4d4d', '#ffcad4', '#ffd700'] }); 
  };

  const addDream = async () => { 
    if (newDream.trim()) { 
      try {
        const res = await fetch(`${API_BASE_URL}/api/dreams`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ category: activeCategory, text: newDream })
        });
        const data = await res.json();
        setDreams(prev => ({ ...prev, [activeCategory]: [...(prev[activeCategory] || []), { id: data.id, text: data.text }] })); 
        setNewDream(""); 
        confetti({ particleCount: 40 }); 
      } catch (err) { console.error(err); }
    } 
  };

  const deleteDream = async (category, id) => {
    try {
      await fetch(`${API_BASE_URL}/api/dreams/${id}`, {
        method: 'DELETE'
      });

      setDreams(prev => ({
        ...prev,
        [category]: prev[category].filter(d => d.id !== id)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMemory = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/memories/${id}`, {
        method: 'DELETE'
      });

      setMemories(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAni = async (e) => { 
    e.preventDefault(); 
    const file = fileInputRef.current?.files?.[0]; 
    if (!file) return; 

    const formData = new FormData();
    formData.append('resim', file);
    formData.append('baslik', 'Anı');
    formData.append('aciklama', newNote || "Unutulmaz...");

    try {
      const res = await fetch(`${API_BASE_URL}/api/memories`, {
          method: 'POST',
          body: formData
      });
      if (res.ok) {
          const data = await res.json();
          setMemories(prev => [...prev, { 
              id: data.id, 
              img: `${API_BASE_URL}/uploads/${data.resim_adi}`, 
              note: data.aciklama 
          }]);
          setNewNote(""); 
          confetti({ particleCount: 60 }); 
      }
    } catch (err) { console.error(err); }
  };

  // GÜNCELLEME: Şifre Giriş Ekranı Render Mantığı
  if (!isAuthorized) {
    return (
      <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: '#fff5f7', fontFamily: "'Quicksand', sans-serif" }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '40px', boxShadow: '0 20px 60px rgba(248,47,141,0.15)', border: '3px solid #ffcad4' }}>
          <Lock size={50} color="#f82f8d" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontFamily: 'Dancing Script', color: '#f82f8d', fontSize: '2.5rem', marginBottom: '10px' }}>Bizim Dünyamız</h2>
          <p style={{ color: '#ffb3c1', fontWeight: '600', marginBottom: '20px' }}>Giriş için özel tarihimizi yaz...</p>
          <input 
            type="password" 
            placeholder="******" 
            value={entryPass}
            onChange={(e) => {
              setEntryPass(e.target.value);
              if(e.target.value === globalPassword) {
                setIsAuthorized(true);
                confetti({ particleCount: 150 });
              }
            }}
            style={{ padding: '15px 25px', borderRadius: '20px', border: '2px solid #ffcad4', textAlign: 'center', fontSize: '24px', outline: 'none', color: '#f82f8d', letterSpacing: '5px' }}
          />
        </motion.div>
      </div>
    );
  }
   const gameMenuItems = [
    { key: 'hafiza', label: 'Hafıza' },
    { key: 'yapboz',  label: 'Yapboz' },
    { key: 'yakala',  label: 'Yakala' },
    { key: 'tarlasi', label: 'Trip Tarlası' },
  ];
 
  return (
    <div style={{ backgroundColor: '#fff5f7', minHeight: '100vh', width: '100%', position: 'relative', fontFamily: "'Quicksand', sans-serif", overflow: 'hidden' }}>
      <div className="sparkle-background" />
      {started && Array.from({ length: 100 }).map((_, i) => ( <motion.div key={i} initial={{ y: -50, opacity: 0 }} animate={{ y: '110vh', opacity: [0, 0.8, 0.8, 0] }} transition={{ duration: Math.random() * 5 + 10, repeat: Infinity, ease: "linear" }} style={{ left: `${Math.random() * 100}%`, position: 'absolute', color: '#f82f8d', zIndex: 0, pointerEvents: 'none' }}> <Heart fill="#f82f8d" size={Math.random() * 25 + 15} /> </motion.div> ))}

      <AnimatePresence>
        {!started ? (
          <motion.div key="entry" exit={{ opacity: 0, scale: 1.1 }} style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
            <div style={{textAlign: 'center'}}><motion.div animate={{ y: [0, -15, 0] }} transition={{repeat: Infinity, duration: 3}} style={{marginBottom: '30px'}}><Heart size={80} fill="#ff4d4d" color="#ff4d4d" /></motion.div><button onClick={handleStart} style={{ padding: '22px 60px', fontSize: '26px', background: 'linear-gradient(45deg, #ff4d4d, #f82f8d)', color: 'white', border: 'none', borderRadius: '60px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Dancing Script' }}>Hikayemizi Başlat ❤️</button></div>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', gap: '35px', position: 'relative', zIndex: 5, alignItems: 'flex-start', filter: (showAniTreni || showMapModal || showReason || showGameModal || showStressModal || showPassModal || showLetter) ? 'blur(15px)' : 'none', transition: 'filter 0.4s' }}>
              
              <AskCarki memories={memories} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flexShrink: 0, marginLeft: '320px' }}> 
                <MuzikKutusu />
                <AlinacaklarListesi />
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.7 }} onClick={() => setShowPassModal(true)} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '200px', lineHeight: '1' }}>🚪</div>
                  <span style={{ color: '#856404', fontWeight: '800', fontSize: '16px' }}>GİZLİ ODA</span>
                </motion.div>
              </div>

              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '30px', minWidth: 0 }}>
                <header style={{textAlign: 'center'}}><h1 style={{ fontSize: '4.5rem', color: '#ff4d4d', margin: 0, fontFamily: 'Dancing Script' }}>aystun</h1><p style={{ color: '#f82f8d', fontWeight: 'bold', letterSpacing: '2px' }}>HER SANİYE, İYİ Kİ SEN...</p></header>
                <StarMap />
                <div style={{ background: 'white', padding: '30px', borderRadius: '35px', textAlign: 'center', boxShadow: '0 15px 45px rgba(255,193,204,0.25)' }}><p style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffb3c1', letterSpacing: '3px' }}>KALBİMİN RİTMİ</p><h2 style={{ color: '#ff4d4d', fontSize: '2rem', margin: 0 }}>{timePassed.days} Gün {timePassed.hours} Saat {timePassed.mins} Dakika {timePassed.secs} Saniye</h2></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <button onClick={() => setShowMapModal(true)} className="nav-btn-fix"><MapPin size={18} /> İlk Yerimiz</button>
                  <button onClick={() => setShowReason(true)} className="nav-btn-fix"><MessageCircle size={18} /> Neden Sen?</button>
                  <button onClick={() => setShowStressModal(true)} className="nav-btn-fix"><Smile size={18} /> Huzur Butonu</button>
                  <button onClick={() => { setShowGameModal(true); setActiveGame('hafiza'); }} className="nav-btn-fix"><FerrisWheel size={18} /> Lunapark</button>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px', minWidth: 0 }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ color: '#f82f8d', textAlign: 'center', fontFamily: 'Dancing Script' }}>Hayaller Bahçesi 🌸</h3>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', background: '#fff0f3', padding: '5px', borderRadius: '18px' }}>{['filmler', 'yerler', 'aktiviteler'].map(cat => <button key={cat} onClick={() => setActiveCategory(cat)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '14px', background: activeCategory === cat ? 'white' : 'transparent', color: activeCategory === cat ? '#f82f8d' : '#ffb3c1', fontWeight: 'bold' }}>{cat.toUpperCase()}</button>)}</div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}><input value={newDream} onChange={(e) => setNewDream(e.target.value)} placeholder="Hayal..." style={{ flex: 1, padding: '12px', border: '1px solid #fff0f3', borderRadius: '15px' }} /><button onClick={addDream} style={{ background: '#f82f8d', color: 'white', border: 'none', borderRadius: '15px', padding: '12px' }}><PlusCircle size={20}/></button></div>
                  <div style={{ height: '180px', overflowY: 'auto' }}>{(dreams && dreams[activeCategory] || []).map((d) => <div key={d.id} style={{ padding: '12px', borderBottom: '1px solid #fff9fa', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare size={16} color="#f82f8d" /><span style={{ flex: 1 }}>{d.text}</span><Trash2 size={14} onClick={() => deleteDream(activeCategory, d.id)} style={{ color: '#ff8a8a', cursor: 'pointer' }} /></div>)}</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #87ee68, #93e451)', padding: '20px', borderRadius: '35px', height: '130px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 12, left: 20, color: 'white', fontWeight: 'bold', zIndex: 10 }}>Sevgi Bahçemiz: {totalFlowerCount} Çiçek</div>
                  {gardenFlowers.slice(0, totalFlowerCount).map((f) => ( <motion.div key={f.id} animate={{ rotate: [ -8, 8, -8 ], scale: [1, 1.15, 1] }} transition={{ duration: 3 + f.delay, repeat: Infinity }} style={{ position: 'absolute', left: `${f.left}%`, top: `${f.top}%`, fontSize: `${f.size}px` }}>{f.emoji}</motion.div> ))}
                </div>
                <div style={{ textAlign: 'center' }}><motion.div whileHover={{ scale: 1.05 }} onClick={() => setShowAniTreni(true)}><img src={KurdeleliKalpGorseli} style={{ width: '220px', cursor: 'pointer' }} alt="Defter"/><p style={{ color: '#f82f8d', fontWeight: 'bold', fontFamily: 'Dancing Script' }}>Anılarımız ✨</p></motion.div></div>
              </div>
            </motion.div>

            {/* MODALLAR */}
            {showReason && ( <div className="modal-fix-overlay" onClick={() => setShowReason(false)}><motion.div className="modal-fix-content" onClick={e => e.stopPropagation()}><h2 style={{ fontFamily: 'Dancing Script', color: '#f82f8d' }}>Neden Sen?</h2><p>{loveReasons[reasonIndex]}</p><button onClick={() => setReasonIndex((reasonIndex + 1) % loveReasons.length)} style={{ background: '#f82f8d', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '25px', marginTop: '20px' }}>Başka Bir Neden ✨</button><X onClick={() => setShowReason(false)} style={{ position: 'absolute', top: '20px', right: '20px' }} /></motion.div></div> )}
{showMapModal && (
  <div className="modal-fix-overlay" onClick={() => setShowMapModal(false)}>
    <motion.div 
      className="modal-fix-content" 
      onClick={e => e.stopPropagation()}
      style={{ 
        maxWidth: '800px', 
        width: '95%', 
        padding: '40px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <h2 style={{ 
        fontFamily: 'Dancing Script', 
        color: '#f82f8d', 
        fontSize: '42px', 
        marginBottom: '30px' 
      }}>
        İlk Buluştuğumuz Yer
      </h2>
      
      {/* Görseller Alanı - Başlangıçta görünür, butona basınca gizlenecek */}
      <div id="modal-gorsel-alani" style={{ 
        display: 'flex', 
        gap: '25px', 
        marginBottom: '35px', 
        justifyContent: 'center',
        flexWrap: 'wrap' 
      }}>
        <img 
          src="/first-meet.jpeg" 
          alt="Anı 1" 
          style={{ 
            width: '350px', 
            height: '350px', 
            borderRadius: '25px', 
            objectFit: 'cover', 
            boxShadow: '0 10px 25px rgba(248, 47, 141, 0.2)' 
          }} 
        />
        <img 
          src="/tea-sahlep.png"
          alt="Anı 2" 
          style={{ 
            width: '350px', 
            height: '350px', 
            borderRadius: '25px', 
            objectFit: 'cover', 
            boxShadow: '0 10px 25px rgba(248, 47, 141, 0.2)' 
          }} 
        />
      </div>

      {/* Harita ve Adres Bölümü - Başlangıçta gizli */}
      <div id="gizli-lokasyon-alani" style={{ display: 'none', width: '100%' }}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.4475484838495!2d32.8538!3d39.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzlCsDU2JzAwLjAiTiAzMsKwNTEnMTMuNyJF!5e0!3m2!1str!2str!4v1619000000000!5m2!1str!2strhttps://maps.app.goo.gl/y4woJAdodErcfUCy8" 
          width="100%" 
          height="450px" 
          style={{ border: 0, borderRadius: '30px', marginBottom: '20px' }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
        <p style={{ 
          fontSize: '20px', 
          color: '#f82f8d', 
          fontWeight: '600',
          fontStyle: 'italic',
          marginBottom: '20px' 
        }}>
          📍 İlk an... O günkü heyecanımız hala taze. ❤️
        </p>
      </div>

      {/* Buton Alanı */}
      <div style={{ marginTop: '15px' }}>
        <button 
          id="harita-goster-btn"
          type="button" // Şifre formunu tetiklemesin diye type ekledik
          onClick={(e) => {
            e.preventDefault();
            const gorselAlani = document.getElementById('modal-gorsel-alani');
            const haritaAlani = document.getElementById('gizli-lokasyon-alani');
            const btn = e.currentTarget;

            if (haritaAlani.style.display === 'none') {
              haritaAlani.style.display = 'block';
              gorselAlani.style.display = 'none';
              btn.innerText = "Fotoğraflara Dön ✨";
            } else {
              haritaAlani.style.display = 'none';
              gorselAlani.style.display = 'flex';
              btn.innerText = "Haydi Oraya Gidelim ✨";
            }
          }}
          style={{ 
            background: 'linear-gradient(45deg, #f82f8d, #ff6bad)', 
            color: 'white', 
            border: 'none', 
            padding: '18px 45px', 
            borderRadius: '35px', 
            cursor: 'pointer', 
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 8px 25px rgba(248, 47, 141, 0.4)',
            transition: '0.3s'
          }}
        >
          Haydi Oraya Gidelim ✨
        </button>
      </div>

      <X 
        onClick={() => setShowMapModal(false)} 
        style={{ position: 'absolute', top: '25px', right: '25px', cursor: 'pointer', scale: '1.5' }} 
      />
    </motion.div>
  </div>
)}
{showStressModal && (
  <div className="modal-fix-overlay" onClick={() => { setShowStressModal(false); setStressStatus(null); }}>
    <motion.div 
      className="modal-fix-content" 
      onClick={e => e.stopPropagation()}
      style={{ maxWidth: '500px', padding: '40px', borderRadius: '40px' }}
    >
      {!stressStatus ? (
        <>
          {/* Gülücük yerine gelen GIF */}
          <video
            src="/huzur.mp4" 
            autoPlay 
            loop 
            muted
            playsInline 
            style={{ width: '150px', borderRadius: '20px', marginBottom: '20px' }}
/>
          
          <h2 style={{ fontFamily: 'Dancing Script', fontSize: '32px', color: '#f82f8d' }}>
            Nasıl hissediyorsun aşkım?
          </h2>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button 
              onClick={() => setStressStatus('uzgun')}
              style={{ background: '#fff0f3', color: '#f82f8d', border: '2px solid #f82f8d', padding: '12px 25px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Biraz Modum Düşük 😔
            </button>
            <button 
              onClick={() => setStressStatus('mutlu')}
              style={{ background: '#f82f8d', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Gayet İyiyim! 😊
            </button>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          {stressStatus === 'uzgun' ? (
            <>
              <img src="/uzgun.jpeg" alt="Yanındayım" style={{ width: '100%', borderRadius: '25px', marginBottom: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
              <p style={{ fontSize: '18px', color: '#444', lineHeight: '1.7', fontFamily: 'Quicksand' }}>
                Dünyanın yükü bazen ağır gelebilir ama unutma ki senin güvenli yuvan benim, benim yanım... 
                Gözlerini kapat, derin bir nefes al ve benim her zaman senin arkanda, 
                her zaman senin yanında olduğumu hatırla. Sen benim güçlü tunişimsin ve 
                biz seninle birlikte her şeyi hallederiz. Seni çok seviyorum sevgilim. ❤️
              </p>
            </>
          ) : (
            <>
              <img src="/mutlu.jpeg" alt="Mutluluğumuz" style={{ width: '100%', borderRadius: '25px', marginBottom: '20px', boxShadow: '0 10px 20px rgba(248, 47, 141, 0.2)' }} />
              <p style={{ fontSize: '18px', color: '#444', lineHeight: '1.7', fontFamily: 'Quicksand' }}>
                Senin o güzel enerjin ve gülüşün benim en büyük huzur kaynağım...
                Sen mutlu olduğunda benim içimde çiçekler açıyor. Mutluluğun asla bitmesin. 
                Sen gülümsediğinde benim dünyam çok daha güzel bir yer oluyor herşeyimm .❤️
              </p>
            </>
          )}
          
          <button 
            onClick={() => { 
              confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } }); 
              setShowStressModal(false); 
              setStressStatus(null); 
            }} 
            style={{ 
              background: 'linear-gradient(45deg, #f82f8d, #ff6bad)', 
              color: 'white', 
              border: 'none', 
              padding: '15px 40px', 
              borderRadius: '30px', 
              marginTop: '25px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(248, 47, 141, 0.3)'
            }}
          >
            Seni Çok Seviyorum ❤️
          </button>
        </motion.div>
      )}

      <X 
        onClick={() => { setShowStressModal(false); setStressStatus(null); }} 
        style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }} 
      />
    </motion.div>
  </div>
)}
            {showGameModal && (
              <div className="modal-fix-overlay" onClick={() => setShowGameModal(false)}>
                <motion.div
                  className="modal-fix-content"
                  onClick={e => e.stopPropagation()}
                  style={{
                    maxWidth: activeGame === 'tarlasi' ? '900px' : '520px',
                    width: '95vw',
                    overflowY: 'auto',
                    maxHeight: '90vh'
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {gameMenuItems.map(g => (
                      <button
                        key={g.key}
                        onClick={() => setActiveGame(g.key)}
                        style={{
                          padding: '8px 14px',
                          border: 'none',
                          borderRadius: '12px',
                          background: activeGame === g.key ? '#f82f8d' : '#fff0f3',
                          color: activeGame === g.key ? 'white' : '#f82f8d',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: '0.2s'
                        }}
                      >
                        {g.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
 
                  {activeGame === 'hafiza'  && <HafizaOyunu  onComplete={() => confetti({ particleCount: 200, spread: 70 })} />}
                  {activeGame === 'yapboz'  && <Yapboz        onComplete={() => confetti({ particleCount: 200, spread: 70 })} />}
                  {activeGame === 'yakala'  && <KalpYakala    onComplete={() => confetti()} />}
                  {activeGame === 'tarlasi' && <AysunTarlasi  onComplete={() => confetti({ particleCount: 200, spread: 70 })} />}
 
                  <X onClick={() => setShowGameModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }} />
                </motion.div>
              </div>
            )}
 
            {showAniTreni && ( <div className="modal-fix-overlay" style={{ background: 'rgba(255, 255, 255, 0.98)' }} onClick={() => setShowAniTreni(false)}><motion.div className="modal-fix-content" style={{ maxWidth: '800px', height: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}><h2>Anı Defterimiz</h2><form onSubmit={handleAddAni} style={{ marginBottom: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}><input type="file" ref={fileInputRef} style={{ display: 'none' }} /><button type="button" onClick={() => fileInputRef.current.click()}><Camera color="#f82f8d" /></button><input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Not..." style={{ padding: '10px', borderRadius: '15px' }} /><button type="submit" style={{ background: '#f82f8d', color: 'white', border: 'none', borderRadius: '15px', padding: '0 20px' }}>Ekle</button></form><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>{Array.isArray(memories) && memories.map(ani => (<div key={ani.id} style={{ background: 'white', padding: '10px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', position: 'relative' }}><Trash2 size={16} onClick={() => deleteMemory(ani.id)} style={{ position: 'absolute', top: '10px', right: '10px', color: '#ff8a8a', cursor: 'pointer', background: 'white', borderRadius: '50%', padding: '4px' }} /><img src={ani.img} style={{ width: '100%', borderRadius: '5px' }} alt="anı"/><p style={{ marginTop: '10px' }}>{ani.note}</p></div>))}</div><X onClick={() => setShowAniTreni(false)} style={{ position: 'absolute', top: '30px', right: '30px' }} /></motion.div></div> )}
            {showPassModal && ( <div className="modal-fix-overlay" onClick={() => setShowPassModal(false)}><motion.div className="modal-fix-content" onClick={e => e.stopPropagation()}><Lock size={40} color="#e2d9a2" /><h2 style={{ fontFamily: 'Dancing Script', color: '#856404' }}>Bu Kapı Kilitli...</h2><input type="password" value={password} onChange={(e) => { setPassword(e.target.value); if(e.target.value === correctPassword) { setShowLetter(true); setShowPassModal(false); setPassword(""); confetti(); } }} placeholder="****" style={{ padding: '15px', borderRadius: '15px', border: '2px solid #f0e4a5', textAlign: 'center', fontSize: '20px', width: '120px', marginTop: '20px' }} /><X onClick={() => setShowPassModal(false)} style={{ position: 'absolute', top: '20px', right: '20px' }} /></motion.div></div> )}
            {showLetter && (
  <div className="modal-fix-overlay" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowLetter(false)}>
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      className="modal-fix-content" 
      style={{ 
        maxWidth: '550px', 
        background: '#fdfcf0', 
        padding: '40px', 
        borderRadius: '35px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 70px rgba(0,0,0,0.3)'
      }} 
      onClick={e => e.stopPropagation()}
    >
      <Heart size={40} fill="#f82f8d" color="#f82f8d" style={{ marginBottom: '20px' }} />
      
      {/* Mektubun Üstündeki Video Bölümü */}
      <div style={{ width: '100%', borderRadius: '20px', overflow: 'hidden', marginBottom: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <video 
          src="/gizli-oda-video.mp4" // Public klasöründeki videonun adı (isim farklıysa değiştir)
          autoPlay 
          loop 
          playsInline 
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      <h2 style={{ fontFamily: 'Dancing Script', color: '#f82f8d', fontSize: '32px', marginBottom: '20px' }}>
        Canım Sevgilim, Her Şeyim...
      </h2>

      <div style={{ textAlign: 'left', lineHeight: '1.8', fontFamily: 'Quicksand', color: '#444', fontSize: '16px' }}>
        <p> 
          Sana olan hislerimi kelimelere dökmek her zaman zor ama hatırlatmak istiyorum ki; sen benim hayatımın en değerli varlığı ve en huzurlu limanısın.
        </p>
        <p> 
          Zorlandığımda arkamdaki o koca dağ, güldüğümde çocuksu sevincimsin.
        </p>
        <p>
          Hayat bazen karmaşık, bazen yorucu olabilir ama senin ellerini tuttuğum sürece her şeyi halledebileceğimizi biliyorum. 
          İyi ki benimlesin, iyi ki biz olduk...
        </p>
        <br />
        <p style={{ textAlign: 'right', fontWeight: 'bold', color: '#f82f8d', fontSize: '18px', fontFamily: 'Dancing Script' }}>
          Seni ruhunun her zerresine kadar çok seven,<br />
          Aysun. ❤️
        </p>
      </div>

      <X 
        onClick={() => setShowLetter(false)} 
        style={{ position: 'absolute', top: '25px', right: '25px', cursor: 'pointer', color: '#f82f8d' }} 
      />
    </motion.div>
  </div>
)}
          </>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Quicksand:wght@400;600;700&display=swap');
        body, html { margin: 0; padding: 0; overflow-x: hidden; scroll-behavior: smooth; }
        .sparkle-background { position: fixed; inset: 0; background-image: radial-gradient(circle at 20% 30%, rgba(255, 193, 204, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(248, 47, 141, 0.1) 0%, transparent 40%); z-index: 0; pointer-events: none; }
        .nav-btn-fix { padding: 22px; border: none; background: white; border-radius: 30px; cursor: pointer; box-shadow: 0 8px 20px rgba(255,182,193,0.15); display: flex; flex-direction: column; align-items: center; gap: 10px; font-weight: bold; color: #f82f8d; transition: 0.4s; font-family: 'Quicksand'; }
        .nav-btn-fix:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(248,47,141,0.2); }
        .modal-fix-overlay { position: fixed; inset: 0; background: rgba(255, 245, 247, 0.85); display: grid; place-items: center; z-index: 2000; backdrop-filter: blur(12px); }
        .modal-fix-content { background: white; padding: 45px; border-radius: 50px; text-align: center; width: 100%; max-width: 480px; position: relative; box-shadow: 0 40px 100px rgba(248,47,141,0.15); }
        .spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
