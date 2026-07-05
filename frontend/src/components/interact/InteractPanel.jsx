import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RefreshIcon from '@mui/icons-material/Refresh';
import QuizIcon from '@mui/icons-material/Quiz';
import BrushIcon from '@mui/icons-material/Brush';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import {
  useInteractStore,
  SONG_POOL,
  QUIZ_POOL,
  pickInteractComment,
} from '../../store/interactStore.js';

export default function InteractPanel() {
  const theme = useTheme();
  const t = theme.palette._;
  const [active, setActive] = useState(null); // 'song' | 'quiz' | 'draw' | null

  if (active === 'song') return <SongPanel t={t} onBack={() => setActive(null)} />;
  if (active === 'quiz') return <QuizPanel t={t} onBack={() => setActive(null)} />;
  if (active === 'draw') return <DrawPanel t={t} onBack={() => setActive(null)} />;

  const cards = [
    { id: 'song', name: '一起听歌',   desc: '我推荐一首，你决定换还是收藏', icon: <MusicNoteIcon /> },
    { id: 'quiz', name: '默契问答',   desc: '看看你有多懂我',                icon: <QuizIcon /> },
    { id: 'draw', name: '共同画板',   desc: '画一笔，留下我们的小宇宙',      icon: <BrushIcon /> },
  ];

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <GroupIcon sx={{ color: t.accent, fontSize: 22 }} />
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: t.text }}>一起互动</Typography>
      </Box>
      <Typography sx={{ fontSize: '0.78rem', color: t.muted, mb: 2 }}>
        选一个方式，我们一起度过这一刻。
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
        {cards.map((c) => (
          <Box
            key={c.id}
            onClick={() => setActive(c.id)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              p: 1.5, borderRadius: 2,
              border: `1px solid ${t.border}`, bgcolor: t.surface,
              cursor: 'pointer', transition: 'all 0.18s',
              '&:hover': { borderColor: t.accent, bgcolor: t.accentSoft, transform: 'translateY(-2px)' },
            }}
          >
            <Box sx={{
              width: 40, height: 40, borderRadius: 1.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: t.accentSoft, color: t.accent,
              '& svg': { fontSize: 22 },
            }}>
              {c.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: t.text }}>{c.name}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: t.muted, mt: 0.25 }}>{c.desc}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SubHeader({ t, title, onBack, right }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <IconButton size="small" onClick={onBack} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}>
        <ArrowBackIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: t.text, flex: 1 }}>{title}</Typography>
      {right}
    </Box>
  );
}

function CommentBubble({ t, text }) {
  if (!text) return null;
  return (
    <Box sx={{ mt: 2, p: 1.25, borderRadius: 2, bgcolor: t.accentSoft, border: `1px solid ${t.accent}` }}>
      <Typography sx={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600, mb: 0.25 }}>Caleb</Typography>
      <Typography sx={{ fontSize: '0.8rem', color: t.text, lineHeight: 1.6 }}>{text}</Typography>
    </Box>
  );
}

function pickFromPool(pool, exclude) {
  const candidates = pool.filter((x) => !exclude || x.name !== exclude.name);
  return candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
}

/* ============ 一起听歌 ============ */
function SongPanel({ t, onBack }) {
  const { addFavorite, favorites } = useInteractStore();
  const [song, setSong] = useState(() => pickFromPool(SONG_POOL));
  const [comment, setComment] = useState('');
  const [favorited, setFavorited] = useState(false);

  const change = () => {
    setSong(pickFromPool(SONG_POOL, song));
    setFavorited(false);
    setComment('');
  };

  const favorite = () => {
    if (favorited) return;
    addFavorite(song);
    setFavorited(true);
    setComment(pickInteractComment('song'));
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      <SubHeader t={t} title="一起听歌" onBack={onBack} />

      <Box
        sx={{
          p: 2, borderRadius: 3,
          border: `1px solid ${t.border}`, bgcolor: t.surface,
          position: 'relative',
        }}
      >
        <Box sx={{
          width: 64, height: 64, borderRadius: 2,
          bgcolor: t.accentSoft, color: t.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 1.5,
          '& svg': { fontSize: 32 },
        }}>
          <MusicNoteIcon />
        </Box>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: t.text }}>{song.name}</Typography>
        <Typography sx={{ fontSize: '0.8rem', color: t.muted, mb: 1.5 }}>{song.artist}</Typography>
        <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: t.subtle }}>
          <Typography sx={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600, mb: 0.25 }}>Caleb 推荐理由</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: t.text, lineHeight: 1.6 }}>{song.reason}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        <Button
          fullWidth
          variant={favorited ? 'outlined' : 'contained'}
          startIcon={<FavoriteIcon sx={{ fontSize: 16 }} />}
          disabled={favorited}
          onClick={favorite}
          sx={{
            bgcolor: favorited ? 'transparent' : t.accent,
            color: favorited ? t.accent : '#fff',
            borderColor: favorited ? t.accent : 'transparent',
            textTransform: 'none', boxShadow: 'none',
            '&:hover': { bgcolor: favorited ? t.accentSoft : t.accentHover },
          }}
        >
          {favorited ? '已收藏' : '收藏'}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
          onClick={change}
          sx={{ borderColor: t.border, color: t.text, textTransform: 'none', '&:hover': { borderColor: t.accent, color: t.accent, bgcolor: t.accentSoft } }}
        >
          换一首
        </Button>
      </Box>

      <CommentBubble t={t} text={comment} />

      {favorites.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 1 }}>
            已收藏 {favorites.length} 首
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {favorites.slice(0, 6).map((s, i) => (
              <Chip
                key={i}
                size="small"
                label={`${s.name} · ${s.artist}`}
                sx={{
                  fontSize: '0.7rem',
                  bgcolor: t.subtle, color: t.text,
                  border: `1px solid ${t.border}`,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

/* ============ 默契问答 ============ */
function QuizPanel({ t, onBack }) {
  const { addQuizLog } = useInteractStore();
  // 随机抽 5 题
  const [questions] = useState(() => {
    const arr = [...QUIZ_POOL].sort(() => Math.random() - 0.5).slice(0, 5);
    return arr;
  });
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [comment, setComment] = useState('');

  const q = questions[idx];

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.answer;
    if (correct) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setDone(true);
      const finalCorrect = correctCount + (selected === q.answer && idx + 1 >= questions.length ? 0 : 0);
      addQuizLog({ total: questions.length, correct: correctCount });
      setComment(pickInteractComment('quiz'));
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
    }
  };

  if (done) {
    const ratio = correctCount / questions.length;
    const level = ratio >= 0.8 ? '默契满分' : ratio >= 0.6 ? '相当有默契' : ratio >= 0.4 ? '还不错' : '还要多了解我哦';
    return (
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
        <SubHeader t={t} title="默契问答" onBack={onBack} />
        <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${t.accent}`, bgcolor: t.accentSoft, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600 }}>本轮结果</Typography>
          <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: t.text, my: 1 }}>
            {correctCount} / {questions.length}
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: t.accent, fontWeight: 600 }}>{level}</Typography>
        </Box>
        <CommentBubble t={t} text={comment} />
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 2, borderColor: t.border, color: t.text, textTransform: 'none', '&:hover': { borderColor: t.accent, color: t.accent } }}
          onClick={onBack}
        >
          返回互动
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      <SubHeader t={t} title="默契问答" onBack={onBack} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.72rem', color: t.muted }}>第 {idx + 1} / {questions.length} 题</Typography>
        <Typography sx={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600 }}>已答对 {correctCount}</Typography>
      </Box>

      <Box sx={{ p: 1.5, borderRadius: 2, border: `1px solid ${t.border}`, bgcolor: t.surface, mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.95rem', color: t.text, fontWeight: 600, lineHeight: 1.5 }}>
          {q.q}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        {q.options.map((opt, i) => {
          let style = {
            p: 1.25, borderRadius: 2, cursor: 'pointer',
            border: `1px solid ${t.border}`, bgcolor: t.surface,
            transition: 'all 0.15s',
            textAlign: 'center',
          };
          if (selected !== null) {
            if (i === q.answer) {
              style = { ...style, borderColor: t.accent, bgcolor: t.accentSoft, cursor: 'default' };
            } else if (i === selected) {
              style = { ...style, borderColor: t.muted, bgcolor: t.subtle, opacity: 0.6, cursor: 'default' };
            } else {
              style = { ...style, opacity: 0.5, cursor: 'default' };
            }
          } else {
            style = { ...style, '&:hover': { borderColor: t.accent, bgcolor: t.accentSoft } };
          }
          return (
            <Box key={i} onClick={() => choose(i)} sx={style}>
              <Typography sx={{ fontSize: '0.85rem', color: i === q.answer && selected !== null ? t.accent : t.text, fontWeight: 500 }}>
                {opt}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {selected !== null && (
        <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 2, bgcolor: t.subtle }}>
          <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.25 }}>
            {selected === q.answer ? '答对了！' : `答错了，正确答案是「${q.options[q.answer]}」`}
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: t.text, opacity: 0.85, fontStyle: 'italic' }}>
            {q.hint}
          </Typography>
        </Box>
      )}

      {selected !== null && (
        <Button
          fullWidth
          variant="contained"
          onClick={next}
          sx={{ mt: 1.5, bgcolor: t.accent, color: '#fff', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: t.accentHover } }}
        >
          {idx + 1 >= questions.length ? '查看结果' : '下一题'}
        </Button>
      )}
    </Box>
  );
}

/* ============ 共同画板 ============ */
function DrawPanel({ t, onBack }) {
  const { addDrawing, drawings } = useInteractStore();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);

  // 初始化 canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // 高分屏适配
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 2.5;
    ctxRef.current = ctx;
    // 背景
    ctx.fillStyle = t.surface;
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, [t.surface, t.accent]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  };

  const start = (e) => {
    e.preventDefault();
    setDrawing(true);
    const ctx = ctxRef.current;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = ctxRef.current;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = (e) => {
    if (!drawing) return;
    e.preventDefault();
    setDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = t.surface;
    ctx.fillRect(0, 0, rect.width, rect.height);
    setSaved(false);
    setComment('');
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    addDrawing(dataUrl);
    setSaved(true);
    setComment(pickInteractComment('draw'));
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      <SubHeader t={t} title="共同画板" onBack={onBack} />

      <Typography sx={{ fontSize: '0.78rem', color: t.muted, mb: 1.5 }}>
        在画板上随心画一笔，保存后我们的小宇宙就留下了。
      </Typography>

      <Box
        sx={{
          borderRadius: 2,
          border: `1px solid ${t.border}`,
          overflow: 'hidden',
          bgcolor: t.surface,
          position: 'relative',
          touchAction: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
          style={{ width: '100%', height: 280, display: 'block', cursor: 'crosshair' }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
          onClick={clear}
          sx={{ borderColor: t.border, color: t.muted, textTransform: 'none', '&:hover': { borderColor: t.accent, color: t.accent, bgcolor: t.accentSoft } }}
        >
          清空
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<SaveIcon sx={{ fontSize: 16 }} />}
          onClick={save}
          sx={{ bgcolor: t.accent, color: '#fff', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: t.accentHover } }}
        >
          保存
        </Button>
      </Box>

      {saved && (
        <Typography sx={{ fontSize: '0.72rem', color: t.accent, mt: 1, textAlign: 'center' }}>
          已保存到本地，共 {drawings.length} 幅画作
        </Typography>
      )}

      <CommentBubble t={t} text={comment} />
    </Box>
  );
}
