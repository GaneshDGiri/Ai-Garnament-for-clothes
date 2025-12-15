/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import redDressPic from '../assets/clothes/redDressPic.jpeg';
import Denimjacketpic from '../assets/clothes/Denimjacketpic.jpeg';


// --- 1. NEW EXPANDED WARDROBE ---
const INITIAL_CLOTHES = [
 
{ 
    id: 1, 
    name: "Red Evening Dress", 
    type: "dress", 
    img: redDressPic // <--- Use variable here
  },
  { 
    id: 2, 
    name: "Blue Denim Jacket", 
    type: "jacket", 
    img: Denimjacketpic 
  },
 
  
];

// --- HELPER: SMOOTHING ---
const lerp = (start, end, factor) => start + (end - start) * factor;

const AiTryOn = () => {
  const location = useLocation();

  // --- STATE ---
  const [clothes, setClothes] = useState(() => {
    const saved = localStorage.getItem('ai-wardrobe');
    // If saved data exists but is small/old, force update to new list
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length < 5) return INITIAL_CLOTHES; 
        return parsed;
    }
    return INITIAL_CLOTHES;
  });

  const [active, setActive] = useState(false);
  const [aiStatus, setAiStatus] = useState("Initializing...");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAiMode, setIsAiMode] = useState(true); 
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });

  // --- REFS ---
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const poseModelRef = useRef(null);
  const cameraRef = useRef(null);
  const imgRef = useRef(new Image());
  const fileInputRef = useRef(null);
  
  // Bridge Refs
  const aiModeRef = useRef(isAiMode);
  const itemRef = useRef(selectedItem);
  const transformRef = useRef(transform);
  const prevPoseRef = useRef({ x: 0, y: 0, w: 0, h: 0, rotation: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // --- PERSISTENCE & SYNC ---
  useEffect(() => { localStorage.setItem('ai-wardrobe', JSON.stringify(clothes)); }, [clothes]);
  useEffect(() => { aiModeRef.current = isAiMode; }, [isAiMode]);
  useEffect(() => { itemRef.current = selectedItem; }, [selectedItem]);
  useEffect(() => { transformRef.current = transform; }, [transform]);

  useEffect(() => {
    if (location.state && location.state.tryOnItem) {
        const newItem = location.state.tryOnItem;
        setClothes(prev => {
            const exists = prev.find(item => item.id === newItem.id);
            if (exists) return prev;
            return [newItem, ...prev];
        });
        selectItem(newItem);
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  // --- SETUP MEDIAPIPE ---
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);
    poseModelRef.current = pose;

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (poseModelRef.current) poseModelRef.current.close();
    };
  }, []);

  const startCamera = async () => {
    if (webcamRef.current && webcamRef.current.video) {
        const videoElement = webcamRef.current.video;
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                if (poseModelRef.current) {
                    await poseModelRef.current.send({ image: videoElement });
                }
            },
            width: 1280,
            height: 720,
        });
        cameraRef.current = camera;
        await camera.start();
        setActive(true);
        setAiStatus("Ready");
    }
  };

  const stopCamera = () => {
    if (cameraRef.current) cameraRef.current.stop();
    setActive(false);
    setAiStatus("Stopped");
  };

  // --- RENDER LOGIC ---
  const onResults = (results) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 1. Draw Video
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 2. Draw Clothing
    const currentItem = itemRef.current;
    const currentAiMode = aiModeRef.current;
    const currentTransform = transformRef.current;

    if (currentItem && imgRef.current.complete && imgRef.current.src) {
        let { x: cx, y: cy, w: cw, h: ch, rotation: cr } = prevPoseRef.current;
        let aiSuccess = false;

        if (currentAiMode && results.poseLandmarks) {
            const landmarks = results.poseLandmarks;
            const leftShoulder = landmarks[11];
            const rightShoulder = landmarks[12];

            if (leftShoulder && rightShoulder && leftShoulder.visibility > 0.6) {
                const W = canvas.width;
                const H = canvas.height;

                const shoulderDist = Math.hypot(
                    (leftShoulder.x - rightShoulder.x) * W,
                    (leftShoulder.y - rightShoulder.y) * H
                );

                let fitMultiplier = 2.2; 
                if (currentItem.type === 'jacket') fitMultiplier = 2.5; 
                if (currentItem.type === 'top') fitMultiplier = 2.1;    
                if (currentItem.type === 'dress') fitMultiplier = 2.3;  

                const targetW = shoulderDist * fitMultiplier * currentTransform.scale;
                const targetH = targetW * (imgRef.current.height / imgRef.current.width);

                const shoulderCenterX = ((leftShoulder.x + rightShoulder.x) / 2) * W;
                const shoulderCenterY = ((leftShoulder.y + rightShoulder.y) / 2) * H;
                
                const targetX = (W - shoulderCenterX) - (targetW / 2) + currentTransform.x;
                const imageNeckOffset = targetH * 0.15; 
                const targetY = shoulderCenterY - imageNeckOffset + currentTransform.y;

                const aiAngle = Math.atan2(
                    (rightShoulder.y * H) - (leftShoulder.y * H), 
                    (rightShoulder.x * W) - (leftShoulder.x * W)
                ) * -1;
                
                const manualRotRad = currentTransform.rotation * (Math.PI / 180);
                const targetAngle = aiAngle + manualRotRad;

                const smooth = 0.25;
                cx = lerp(cx, targetX, smooth);
                cy = lerp(cy, targetY, smooth);
                cw = lerp(cw, targetW, smooth);
                ch = lerp(ch, targetH, smooth);
                cr = lerp(cr, targetAngle, smooth);

                aiSuccess = true;
                prevPoseRef.current = { x: cx, y: cy, w: cw, h: ch, rotation: cr };
            }
        }

        if (!currentAiMode || !aiSuccess) {
            const targetW = 300 * currentTransform.scale;
            const targetH = targetW * (imgRef.current.height / imgRef.current.width);
            
            if (cx === 0) { cx = (canvas.width / 2) - (targetW / 2); cy = canvas.height / 3; }

            cw = lerp(cw, targetW, 0.2);
            ch = lerp(ch, targetH, 0.2);
            cr = lerp(cr, currentTransform.rotation * (Math.PI / 180), 0.2);
            
            prevPoseRef.current = { x: cx, y: cy, w: cw, h: ch, rotation: cr };
        }

        ctx.save();
        const centerX = cx + cw / 2;
        const centerY = cy + ch / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(cr);
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(imgRef.current, cx, cy, cw, ch);
        ctx.restore();
    }
  };

  // --- HANDLERS ---
  const selectItem = (item) => {
    setSelectedItem(item);
    setTransform({ x: 0, y: 0, scale: 1.0, rotation: 0 }); 
    imgRef.current.crossOrigin = "anonymous";
    imgRef.current.src = item.img;
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const localImageUrl = URL.createObjectURL(file);
        const newProduct = { id: Date.now(), name: "My Upload", type: 'top', img: localImageUrl };
        setClothes(prev => [newProduct, ...prev]);
        selectItem(newProduct);
    }
  };

  const removeItem = (e, id) => {
    e.stopPropagation();
    setClothes(prev => prev.filter(item => item.id !== id));
    if (selectedItem?.id === id) {
        setSelectedItem(null);
        imgRef.current.src = "";
    }
  };

  const updateTransform = (key, val) => {
    setTransform(prev => ({ ...prev, [key]: parseFloat(val) }));
  };

  const adjustRotation = (degree) => {
    setTransform(prev => ({ ...prev, rotation: prev.rotation + degree }));
  };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastPos.current = { x: e.touches ? e.touches[0].clientX : e.clientX, y: e.touches ? e.touches[0].clientY : e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;

    if (isAiMode) {
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    } else {
        prevPoseRef.current.x += dx;
        prevPoseRef.current.y += dy;
    }
    lastPos.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => { isDragging.current = false; };

  return (
    <div className="studio-container">
      <div 
        className="stage-area"
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchEnd={handlePointerUp}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
      >
        <div className="monitor-frame">
           <Webcam ref={webcamRef} style={{ display: 'none' }} width={1280} height={720} mirrored />
           <canvas ref={canvasRef} width={1280} height={720} className={`studio-canvas ${active ? 'visible' : ''}`} />

           {active && (
             <div className={`status-badge ${isAiMode ? 'ai-on' : 'manual-on'}`}>
                {isAiMode ? `SMART FIT: ON` : 'MANUAL MODE'}
             </div>
           )}

           {!active && (
             <div className="standby-screen">
                <div className="lens-icon">📸</div>
                <h2>AI Virtual Mirror</h2>
                <p>{aiStatus}</p>
                <button onClick={startCamera} className="power-btn">Start Camera</button>
             </div>
           )}

           {active && (
             <div className="overlay-controls">
                <div style={{display:'flex', gap:'10px', width: '100%'}}>
                    <button onClick={stopCamera} className="stop-btn">Stop</button>
                    <button onClick={() => setIsAiMode(!isAiMode)} className="mode-btn">
                        {isAiMode ? "Disable AI" : "Enable AI"}
                    </button>
                </div>
                
                <div className="controls-row">
                    <div className="control-group">
                        <label>Size</label>
                        <input type="range" min="0.5" max="2.0" step="0.1" value={transform.scale} onChange={(e) => updateTransform('scale', e.target.value)} />
                    </div>
                    <div className="control-group">
                        <label>Tilt</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="icon-btn" onClick={() => adjustRotation(-5)}>↺</button>
                            <button className="icon-btn" onClick={() => adjustRotation(5)}>↻</button>
                        </div>
                    </div>
                    <div className="control-group">
                        <label>Up/Down</label>
                        <input type="range" min="-200" max="200" step="10" value={transform.y} onChange={(e) => updateTransform('y', e.target.value)} />
                    </div>
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="wardrobe-panel">
         <div className="panel-header">
            <h3>Wardrobe ({clothes.length})</h3>
            <div className="upload-wrapper">
                <input type="file" accept="image/*" ref={fileInputRef} style={{display: 'none'}} onChange={handleUpload} />
                <button className="upload-btn" onClick={() => fileInputRef.current.click()}>+ Upload</button>
            </div>
         </div>
         <div className="grid">
            {clothes.map(item => (
                <div key={item.id} className={`item-card ${selectedItem?.id === item.id ? 'selected' : ''}`} onClick={() => selectItem(item)}>
                    <button className="remove-btn" onClick={(e) => removeItem(e, item.id)}>×</button>
                    <div className="img-box"><img src={item.img} alt={item.name} /></div>
                    <span>{item.name}</span>
                </div>
            ))}
         </div>
      </div>

      <style>{`
        .studio-container { display: flex; height: calc(100vh - 60px); background: #1e1e1e; color: white; font-family: 'Segoe UI', sans-serif; overflow: hidden; }
        .stage-area { flex: 3; display: flex; justify-content: center; align-items: center; padding: 20px; background: radial-gradient(circle at center, #2d3436 0%, #000000 100%); position: relative; }
        .monitor-frame { position: relative; width: 100%; max-width: 800px; aspect-ratio: 16/9; background: #000; border-radius: 20px; border: 8px solid #444; box-shadow: 0 0 50px rgba(0,0,0,0.7); overflow: hidden; }
        .studio-canvas { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s; touch-action: none; }
        .studio-canvas.visible { opacity: 1; }
        .standby-screen { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; }
        .lens-icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.8; }
        .status-badge { position: absolute; top: 20px; left: 20px; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 0.8rem; z-index: 20; letter-spacing: 1px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        .status-badge.ai-on { background: #00b894; color: white; border: 1px solid #55efc4; }
        .status-badge.manual-on { background: #e17055; color: white; }
        .overlay-controls { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; gap: 10px; align-items: center; background: rgba(0,0,0,0.6); padding: 15px 25px; border-radius: 30px; backdrop-filter: blur(5px); min-width: 320px; border: 1px solid rgba(255,255,255,0.1); }
        .controls-row { display: flex; gap: 20px; width: 100%; justify-content: center; align-items: center; }
        .control-group { display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .control-group label { font-size: 0.7rem; color: #aaa; text-transform: uppercase; letter-spacing: 1px; }
        .stop-btn { background: #d63031; color: white; border: none; padding: 10px; border-radius: 10px; cursor: pointer; font-weight: bold; flex: 1; }
        .mode-btn { background: #0984e3; color: white; border: none; padding: 10px; border-radius: 10px; cursor: pointer; font-weight: bold; flex: 1; }
        .slider-group input { width: 80px; cursor: pointer; }
        .icon-btn { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.2s; }
        .icon-btn:hover { background: rgba(255,255,255,0.4); transform: scale(1.1); }
        .power-btn { margin-top: 20px; padding: 15px 40px; background: #00b894; color: white; border: none; border-radius: 50px; font-size: 1.2rem; font-weight: bold; cursor: pointer; }
        .wardrobe-panel { flex: 1; min-width: 300px; background: #2d3436; border-left: 1px solid #444; display: flex; flex-direction: column; }
        .panel-header { padding: 20px; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        .upload-btn { background: #0984e3; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9rem; }
        .grid { padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; overflow-y: auto; }
        .item-card { position: relative; background: #353b48; border-radius: 15px; padding: 10px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
        .item-card.selected { border-color: #00b894; background: #2f3640; box-shadow: 0 0 15px rgba(0, 184, 148, 0.2); }
        .remove-btn { position: absolute; top: -8px; right: -8px; width: 24px; height: 24px; background: #ff7675; color: white; border: none; border-radius: 50%; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .img-box { height: 100px; background: white; border-radius: 10px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .img-box img { max-width: 80%; max-height: 90%; object-fit: contain; }
        @media (max-width: 768px) {
            .studio-container { flex-direction: column; }
            .stage-area { flex: 2; padding: 10px; }
            .monitor-frame { width: 100%; height: auto; aspect-ratio: 3/4; }
            .wardrobe-panel { flex: 1; border-top: 2px solid #444; }
            .grid { display: flex; overflow-x: auto; gap: 15px; }
            .item-card { min-width: 120px; }
        }
      `}</style>
    </div>
  );
};

export default AiTryOn;