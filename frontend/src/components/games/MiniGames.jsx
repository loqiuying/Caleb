import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import NumbersIcon from '@mui/icons-material/Numbers';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GridOnIcon from '@mui/icons-material/GridOn';
import { useGameStore, pickComment } from '../../store/gameStore.js';

// 成语接龙预设词库（不需要完整词典，做简单匹配）
const IDIOM_POOL = [
  '一帆风顺', '一路平安', '一鸣惊人', '一心一意', '一举两得',
  '二话不说', '三心二意', '四面八方', '五湖四海', '六六大顺',
  '七上八下', '八面玲珑', '九牛一毛', '十全十美', '百发百中',
  '千军万马', '万事如意', '画蛇添足', '守株待兔', '亡羊补牢',
  '狐假虎威', '井底之蛙', '胸有成竹', '对牛弹琴', '刻舟求剑',
  '掩耳盗铃', '叶公好龙', '邯郸学步', '滥竽充数', '自相矛盾',
  '顺其自然', '然糠照薪', '薪尽火传', '传为美谈', '谈笑风生',
  '生龙活虎', '虎头蛇尾', '尾大不掉', '掉以轻心', '心想事成',
  '马到成功', '功成名就', '就事论事', '事半功倍', '倍道而行',
];

export default function MiniGames() {
  const theme = useTheme();
  const t = theme.palette._;
  const [active, setActive] = useState(null); // 'guess' | 'idiom' | '2048' | null

  if (active === 'guess') return <GuessGame t={t} onBack={() => setActive(null)} />;
  if (active === 'idiom') return <IdiomGame t={t} onBack={() => setActive(null)} />;
  if (active === '2048') return <Game2048 t={t} onBack={() => setActive(null)} />;

  const cards = [
    { id: 'guess',  name: '猜数字',   desc: '1-100 之间，看几次能猜中', icon: <NumbersIcon /> },
    { id: 'idiom',  name: '成语接龙', desc: '首字匹配，看谁接得多',     icon: <MenuBookIcon /> },
    { id: '2048',   name: '2048',     desc: '方向键合并，冲击最高分',   icon: <GridOnIcon /> },
  ];

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SportsEsportsIcon sx={{ color: t.accent, fontSize: 22 }} />
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: t.text }}>
          小游戏
        </Typography>
      </Box>
      <Typography sx={{ fontSize: '0.78rem', color: t.muted, mb: 2 }}>
        选一个游戏开始吧，记录会自动保存。
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
        {cards.map((c) => (
          <Box
            key={c.id}
            onClick={() => setActive(c.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              border: `1px solid ${t.border}`,
              bgcolor: t.surface,
              cursor: 'pointer',
              transition: 'all 0.18s',
              '&:hover': { borderColor: t.accent, bgcolor: t.accentSoft, transform: 'translateY(-2px)' },
            }}
          >
            <Box
              sx={{
                width: 40, height: 40, borderRadius: 1.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: t.accentSoft, color: t.accent,
                '& svg': { fontSize: 22 },
              }}
            >
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

/* ============ 顶部栏 ============ */
function SubHeader({ t, title, onBack, right }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <IconButton
        size="small"
        onClick={onBack}
        sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: t.text, flex: 1 }}>{title}</Typography>
      {right}
    </Box>
  );
}

/* ============ 评语气泡 ============ */
function CommentBubble({ t, text }) {
  if (!text) return null;
  return (
    <Box
      sx={{
        mt: 2, p: 1.25, borderRadius: 2,
        bgcolor: t.accentSoft, border: `1px solid ${t.accent}`,
      }}
    >
      <Typography sx={{ fontSize: '0.78rem', color: t.accent, fontWeight: 600, mb: 0.25 }}>Caleb</Typography>
      <Typography sx={{ fontSize: '0.8rem', color: t.text, lineHeight: 1.6 }}>{text}</Typography>
    </Box>
  );
}

/* ============ 猜数字 ============ */
function GuessGame({ t, onBack }) {
  const { addRecord, bestOf } = useGameStore();
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]); // [{guess, hint}]
  const [done, setDone] = useState(false);
  const [comment, setComment] = useState('');

  const best = bestOf('guess');

  const restart = useCallback(() => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setInput('');
    setHistory([]);
    setDone(false);
    setComment('');
  }, []);

  const submit = () => {
    if (done) return;
    const n = parseInt(input, 10);
    if (!Number.isFinite(n) || n < 1 || n > 100) return;
    let hint = '';
    if (n === target) hint = 'correct';
    else if (n < target) hint = 'small';
    else hint = 'big';
    const next = [...history, { guess: n, hint }];
    setHistory(next);
    setInput('');
    if (hint === 'correct') {
      setDone(true);
      addRecord({ game: 'guess', score: next.length, detail: `${next.length} 次猜中 ${target}` });
      setComment(pickComment('guess'));
    }
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      <SubHeader
        t={t}
        title="猜数字"
        onBack={onBack}
        right={
          <IconButton size="small" onClick={restart} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}>
            <ReplayIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
      />

      <Typography sx={{ fontSize: '0.8rem', color: t.muted, mb: 1.5 }}>
        我心里想了一个 1-100 的数字，看你能几次猜中。
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
        <TextField
          size="small"
          fullWidth
          type="number"
          value={input}
          disabled={done}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="输入 1-100"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: t.surface,
              fontSize: '0.85rem',
            },
          }}
        />
        <Button
          variant="contained"
          disabled={done || !input}
          onClick={submit}
          sx={{ bgcolor: t.accent, color: '#fff', textTransform: 'none', px: 2, '&:hover': { bgcolor: t.accentHover }, boxShadow: 'none' }}
        >
          猜
        </Button>
      </Box>

      {history.length > 0 && (
        <Box sx={{ mb: 1.5 }}>
          {history.map((h, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
              <Typography sx={{ fontSize: '0.72rem', color: t.muted, width: 28 }}>#{i + 1}</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: t.text, fontWeight: 600, width: 36 }}>{h.guess}</Typography>
              <Typography sx={{
                fontSize: '0.75rem',
                color: h.hint === 'correct' ? t.accent : t.muted,
                fontWeight: 600,
              }}>
                {h.hint === 'correct' ? '猜中！' : h.hint === 'small' ? '小了，往大猜' : '大了，往小猜'}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {done && (
        <Box sx={{ p: 1.5, borderRadius: 2, border: `1px solid ${t.accent}`, bgcolor: t.accentSoft }}>
          <Typography sx={{ fontSize: '0.88rem', color: t.accent, fontWeight: 700 }}>
            猜中了！用了 {history.length} 次。
          </Typography>
        </Box>
      )}

      <CommentBubble t={t} text={comment} />

      <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.72rem', color: t.muted }}>
          历史最少次数：{best ? `${best.score} 次` : '尚无记录'}
        </Typography>
      </Box>
    </Box>
  );
}

/* ============ 成语接龙 ============ */
function IdiomGame({ t, onBack }) {
  const { addRecord } = useGameStore();
  const [current, setCurrent] = useState(() => IDIOM_POOL[Math.floor(Math.random() * IDIOM_POOL.length)]);
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState('');
  const [streak, setStreak] = useState(0);
  const [comment, setComment] = useState('');

  const nextIdiomStartingWith = (ch) => {
    const pool = IDIOM_POOL.filter((x) => x[0] === ch && x !== current);
    if (!pool.length) {
      // 找不到就随机一个，给个友好提示
      return IDIOM_POOL[Math.floor(Math.random() * IDIOM_POOL.length)];
    }
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const submit = () => {
    const v = input.trim();
    if (!v) return;
    if (v.length < 2) {
      setMsg('成语至少两个字哦。');
      return;
    }
    if (v[0] !== current[current.length - 1]) {
      setMsg(`首字要接「${current[current.length - 1]}」哦。`);
      setInput('');
      return;
    }
    if (!IDIOM_POOL.includes(v)) {
      setMsg('词库里没有这个词，换个试试？（小提示：可以猜常见成语）');
      setInput('');
      return;
    }
    // 接对了
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setMsg('接得漂亮！');
    addRecord({ game: 'idiom', score: nextStreak, detail: `连续接龙 ${nextStreak} 次` });
    setComment(pickComment('idiom'));
    setCurrent(nextIdiomStartingWith(v[v.length - 1]));
    setInput('');
  };

  const restart = () => {
    setCurrent(IDIOM_POOL[Math.floor(Math.random() * IDIOM_POOL.length)]);
    setInput('');
    setMsg('');
    setStreak(0);
    setComment('');
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      <SubHeader
        t={t}
        title="成语接龙"
        onBack={onBack}
        right={
          <IconButton size="small" onClick={restart} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}>
            <ReplayIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
      />

      <Typography sx={{ fontSize: '0.8rem', color: t.muted, mb: 1.5 }}>
        我出一个成语，你接下一个，首字要和上一成语尾字相同。
      </Typography>

      <Box sx={{ p: 1.5, borderRadius: 2, border: `1px solid ${t.border}`, bgcolor: t.surface, mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.5 }}>Caleb 出题</Typography>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: t.accent, letterSpacing: 2 }}>
          {current}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: t.muted, mt: 0.5 }}>
          请接以「{current[current.length - 1]}」开头的成语
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          size="small"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="输入下一个成语"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography sx={{ fontSize: '0.7rem', color: t.muted }}>连击 {streak}</Typography>
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: t.surface, fontSize: '0.85rem' } }}
        />
        <Button
          variant="contained"
          onClick={submit}
          sx={{ bgcolor: t.accent, color: '#fff', textTransform: 'none', px: 2, '&:hover': { bgcolor: t.accentHover }, boxShadow: 'none' }}
        >
          接龙
        </Button>
      </Box>

      {msg && (
        <Typography sx={{ fontSize: '0.78rem', color: msg.includes('漂亮') ? t.accent : t.muted, mb: 1 }}>
          {msg}
        </Typography>
      )}

      <CommentBubble t={t} text={comment} />

      <Box sx={{ mt: 2, p: 1.25, borderRadius: 2, bgcolor: t.subtle }}>
        <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.5 }}>词库提示</Typography>
        <Typography sx={{ fontSize: '0.72rem', color: t.text, opacity: 0.7, lineHeight: 1.6 }}>
          含常见成语：{IDIOM_POOL.slice(0, 12).join('、')} …（共 {IDIOM_POOL.length} 个）
        </Typography>
      </Box>
    </Box>
  );
}

/* ============ 2048 ============ */
const SIZE = 4;
function emptyBoard() {
  return Array.from({ length: SIZE * SIZE }, () => 0);
}
function addRandomTile(board) {
  const empties = board.map((v, i) => (v === 0 ? i : -1)).filter((i) => i >= 0);
  if (!empties.length) return board;
  const idx = empties[Math.floor(Math.random() * empties.length)];
  const next = board.slice();
  next[idx] = Math.random() < 0.9 ? 2 : 4;
  return next;
}
function rotateCW(board) {
  const next = emptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      next[c * SIZE + (SIZE - 1 - r)] = board[r * SIZE + c];
    }
  }
  return next;
}
function slideLeft(board) {
  let score = 0;
  let moved = false;
  const next = [];
  for (let r = 0; r < SIZE; r++) {
    const row = board.slice(r * SIZE, r * SIZE + SIZE).filter((v) => v !== 0);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        row.splice(i + 1, 1);
      }
    }
    while (row.length < SIZE) row.push(0);
    for (let c = 0; c < SIZE; c++) {
      if (board[r * SIZE + c] !== row[c]) moved = true;
      next.push(row[c]);
    }
  }
  return { board: next, score, moved };
}
function move(board, dir) {
  let b = board.slice();
  let rotations = 0;
  if (dir === 'up') rotations = 3;
  else if (dir === 'right') rotations = 2;
  else if (dir === 'down') rotations = 1;
  for (let i = 0; i < rotations; i++) b = rotateCW(b);
  let res = slideLeft(b);
  let out = res.board;
  for (let i = 0; i < (4 - rotations) % 4; i++) out = rotateCW(out);
  return { board: out, score: res.score, moved: res.moved };
}
function canMove(board) {
  if (board.includes(0)) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r * SIZE + c];
      if (c < SIZE - 1 && board[r * SIZE + c + 1] === v) return true;
      if (r < SIZE - 1 && board[(r + 1) * SIZE + c] === v) return true;
    }
  }
  return false;
}

function tileColor(v, t) {
  if (!v) return { bg: t.subtle, fg: t.text };
  const map = {
    2: t.accentSoft, 4: t.accentSoft,
    8: t.accent, 16: t.accent, 32: t.accent, 64: t.accent,
    128: t.accentHover, 256: t.accentHover, 512: t.accentHover,
    1024: t.accentHover, 2048: t.accentHover,
  };
  return {
    bg: map[v] || t.accentHover,
    fg: v <= 4 ? t.text : '#ffffff',
  };
}

function Game2048({ t, onBack }) {
  const { addRecord, bestOf } = useGameStore();
  const [board, setBoard] = useState(() => addRandomTile(addRandomTile(emptyBoard())));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [comment, setComment] = useState('');
  const best = bestOf('2048');

  const handleKey = useCallback((e) => {
    if (over) return;
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();
    setBoard((prev) => {
      const res = move(prev, dir);
      if (!res.moved) return prev;
      const withTile = addRandomTile(res.board);
      setScore((s) => {
        const ns = s + res.score;
        return ns;
      });
      if (!canMove(withTile)) {
        setOver(true);
        setScore((s) => {
          const final = s + res.score;
          addRecord({ game: '2048', score: final, detail: `本局得分 ${final}` });
          setComment(pickComment('2048'));
          return final;
        });
      }
      return withTile;
    });
  }, [over, addRecord]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const restart = () => {
    setBoard(addRandomTile(addRandomTile(emptyBoard())));
    setScore(0);
    setOver(false);
    setComment('');
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }} tabIndex={0}>
      <SubHeader
        t={t}
        title="2048"
        onBack={onBack}
        right={
          <IconButton size="small" onClick={restart} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}>
            <ReplayIcon sx={{ fontSize: 18 }} />
          </IconButton>
        }
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, border: `1px solid ${t.border}`, bgcolor: t.surface }}>
          <Typography sx={{ fontSize: '0.66rem', color: t.muted }}>本局</Typography>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: t.text }}>{score}</Typography>
        </Box>
        <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, border: `1px solid ${t.border}`, bgcolor: t.surface }}>
          <Typography sx={{ fontSize: '0.66rem', color: t.muted }}>最高分</Typography>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: t.accent }}>{best ? best.score : 0}</Typography>
        </Box>
      </Box>

      <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 1 }}>
        用方向键 ↑ ↓ ← → 控制方块移动合并。
      </Typography>

      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          border: `1px solid ${t.border}`,
          bgcolor: t.subtle,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0.75,
          aspectRatio: '1',
          maxWidth: 320,
          margin: '0 auto',
        }}
      >
        {board.map((v, i) => {
          const c = tileColor(v, t);
          return (
            <Box
              key={i}
              sx={{
                borderRadius: 1.5,
                bgcolor: c.bg,
                color: c.fg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: v >= 1024 ? '1rem' : v >= 128 ? '1.2rem' : '1.4rem',
                fontWeight: 700,
                transition: 'all 0.12s',
                border: v ? `1px solid ${t.border}` : 'none',
              }}
            >
              {v || ''}
            </Box>
          );
        })}
      </Box>

      {over && (
        <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, border: `1px solid ${t.accent}`, bgcolor: t.accentSoft, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.88rem', color: t.accent, fontWeight: 700 }}>
            游戏结束，本局得分 {score}
          </Typography>
        </Box>
      )}

      <CommentBubble t={t} text={comment} />

      {/* 移动端方向按钮 */}
      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0.5, maxWidth: 220, margin: '16px auto 0' }}>
        <Box />
        <Button variant="outlined" onClick={() => handleKey({ key: 'ArrowUp', preventDefault: () => {} })} sx={{ borderColor: t.border, color: t.text, minWidth: 0, py: 0.5 }}>↑</Button>
        <Box />
        <Button variant="outlined" onClick={() => handleKey({ key: 'ArrowLeft', preventDefault: () => {} })} sx={{ borderColor: t.border, color: t.text, minWidth: 0, py: 0.5 }}>←</Button>
        <Button variant="outlined" onClick={() => handleKey({ key: 'ArrowDown', preventDefault: () => {} })} sx={{ borderColor: t.border, color: t.text, minWidth: 0, py: 0.5 }}>↓</Button>
        <Button variant="outlined" onClick={() => handleKey({ key: 'ArrowRight', preventDefault: () => {} })} sx={{ borderColor: t.border, color: t.text, minWidth: 0, py: 0.5 }}>→</Button>
      </Box>
    </Box>
  );
}
