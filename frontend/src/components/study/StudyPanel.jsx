import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FlipIcon from '@mui/icons-material/Flip';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StyleIcon from '@mui/icons-material/Style';
import { useStudyStore, pickEncourage } from '../../store/studyStore.js';

const WEEK_HEADERS = ['日', '一', '二', '三', '四', '五', '六'];

function pad(n) { return String(n).padStart(2, '0'); }
function fmtDate(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function todayStr() {
  const d = new Date();
  return fmtDate(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function StudyPanel() {
  const theme = useTheme();
  const t = theme.palette._;
  const [tab, setTab] = useState('words'); // 'words' | 'checkin'

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Tab 切换 */}
      <Box sx={{ display: 'flex', px: 2, pt: 1.5, gap: 0.5, borderBottom: `1px solid ${t.border}` }}>
        <TabBtn t={t} active={tab === 'words'} onClick={() => setTab('words')} icon={<StyleIcon sx={{ fontSize: 16 }} />} label="单词卡" />
        <TabBtn t={t} active={tab === 'checkin'} onClick={() => setTab('checkin')} icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />} label="打卡日历" />
      </Box>

      {tab === 'words' ? <WordsTab t={t} /> : <CheckInTab t={t} />}
    </Box>
  );
}

function TabBtn({ t, active, onClick, icon, label }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 0.5,
        px: 1.5, py: 1, cursor: 'pointer',
        color: active ? t.accent : t.muted,
        borderBottom: active ? `2px solid ${t.accent}` : '2px solid transparent',
        fontWeight: active ? 700 : 500,
        fontSize: '0.85rem',
        transition: 'all 0.15s',
        '&:hover': { color: t.accent },
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

/* ============ 单词卡 ============ */
function WordsTab({ t }) {
  const { words, addWord, deleteWord } = useStudyStore();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  // 表单
  const [form, setForm] = useState({ word: '', pos: '', meaning: '', example: '' });

  const current = words[idx];

  const goPrev = () => {
    setFlipped(false);
    setIdx((i) => (i - 1 + words.length) % Math.max(1, words.length));
  };
  const goNext = () => {
    setFlipped(false);
    setIdx((i) => (i + 1) % Math.max(1, words.length));
  };

  const handleAdd = () => {
    if (!form.word.trim()) return;
    addWord(form);
    setForm({ word: '', pos: '', meaning: '', example: '' });
    setOpenAdd(false);
    setIdx(0);
    setFlipped(false);
  };

  const handleDelete = () => {
    if (!current) return;
    deleteWord(current.id);
    setIdx(0);
    setFlipped(false);
  };

  if (!current) {
    return (
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.85rem', color: t.muted, mb: 2 }}>还没有单词卡，添加一张吧。</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{ bgcolor: t.accent, color: '#fff', textTransform: 'none', '&:hover': { bgcolor: t.accentHover } }}
        >
          添加单词
        </Button>
        <AddWordDialog t={t} open={openAdd} form={form} setForm={setForm} onClose={() => setOpenAdd(false)} onSave={handleAdd} />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2, display: 'flex', flexDirection: 'column' }}>
      {/* 翻转卡片 */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Box
          onClick={() => setFlipped((f) => !f)}
          sx={{
            width: '100%',
            maxWidth: 360,
            minHeight: 200,
            borderRadius: 3,
            border: `1px solid ${flipped ? t.accent : t.border}`,
            bgcolor: t.surface,
            p: 2.5,
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.25s',
            '&:hover': { borderColor: t.accent, transform: 'translateY(-2px)' },
          }}
        >
          <Box sx={{ position: 'absolute', top: 8, right: 8, color: t.muted }}>
            <FlipIcon sx={{ fontSize: 16 }} />
          </Box>
          {!flipped ? (
            // 正面
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: t.text, mb: 1, letterSpacing: 0.5 }}>
                {current.word}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: t.accent, fontStyle: 'italic' }}>
                {current.pos}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: t.muted, mt: 2 }}>
                点击卡片查看释义
              </Typography>
            </Box>
          ) : (
            // 背面
            <Box sx={{ py: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.5 }}>中文释义</Typography>
              <Typography sx={{ fontSize: '0.95rem', color: t.text, fontWeight: 600, mb: 1.5 }}>
                {current.meaning}
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.5 }}>例句</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: t.text, opacity: 0.85, lineHeight: 1.6, fontStyle: 'italic' }}>
                {current.example}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* 切换按钮 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <IconButton size="small" onClick={goPrev} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ fontSize: '0.75rem', color: t.muted }}>
          {idx + 1} / {words.length}
        </Typography>
        <IconButton size="small" onClick={goNext} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* 底部操作 */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
          onClick={handleDelete}
          sx={{
            borderColor: t.border, color: t.muted, textTransform: 'none', fontSize: '0.78rem',
            '&:hover': { borderColor: t.accent, color: t.accent, bgcolor: t.accentSoft },
          }}
        >
          删除
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => setOpenAdd(true)}
          sx={{ bgcolor: t.accent, color: '#fff', textTransform: 'none', fontSize: '0.78rem', boxShadow: 'none', '&:hover': { bgcolor: t.accentHover } }}
        >
          添加单词
        </Button>
      </Box>

      <AddWordDialog t={t} open={openAdd} form={form} setForm={setForm} onClose={() => setOpenAdd(false)} onSave={handleAdd} />
    </Box>
  );
}

function AddWordDialog({ t, open, form, setForm, onClose, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontSize: '0.95rem', color: t.text, bgcolor: t.surface }}>添加单词</DialogTitle>
      <DialogContent sx={{ bgcolor: t.surface, pt: '16px !important' }}>
        <TextField
          autoFocus size="small" fullWidth label="单词"
          value={form.word}
          onChange={(e) => setForm({ ...form, word: e.target.value })}
          sx={{ mb: 1.5 }}
        />
        <TextField
          size="small" fullWidth label="词性 (如 n. / v.)"
          value={form.pos}
          onChange={(e) => setForm({ ...form, pos: e.target.value })}
          sx={{ mb: 1.5 }}
        />
        <TextField
          size="small" fullWidth label="中文释义"
          value={form.meaning}
          onChange={(e) => setForm({ ...form, meaning: e.target.value })}
          sx={{ mb: 1.5 }}
        />
        <TextField
          size="small" fullWidth multiline minRows={2} label="例句"
          value={form.example}
          onChange={(e) => setForm({ ...form, example: e.target.value })}
        />
      </DialogContent>
      <DialogActions sx={{ bgcolor: t.surface, p: 1.5 }}>
        <Button onClick={onClose} sx={{ color: t.muted, textTransform: 'none' }}>取消</Button>
        <Button
          onClick={onSave}
          variant="contained"
          startIcon={<CheckIcon sx={{ fontSize: 16 }} />}
          sx={{ bgcolor: t.accent, color: '#fff', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: t.accentHover } }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ============ 打卡日历 ============ */
function CheckInTab({ t }) {
  const { checkIn, toggleCheckIn, isTodayCheckedIn, streak } = useStudyStore();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [encourage] = useState(() => pickEncourage());

  const todayS = todayStr();
  const checkedToday = isTodayCheckedIn();
  const streakDays = streak();

  const grid = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
    const cells = [];
    for (let i = startDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrev - i, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, inMonth: true, dateStr: fmtDate(viewYear, viewMonth, d) });
    }
    let nd = 1;
    while (cells.length < 42) cells.push({ day: nd++, inMonth: false });
    return cells;
  }, [viewYear, viewMonth]);

  const checkInSet = useMemo(() => new Set(checkIn), [checkIn]);

  const goPrev = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };
  const goNext = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      {/* 连续打卡 + 今日按钮 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: '0.7rem', color: t.muted }}>连续打卡</Typography>
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: t.accent }}>
            {streakDays} <Box component="span" sx={{ fontSize: '0.78rem', color: t.muted, fontWeight: 500 }}>天</Box>
          </Typography>
        </Box>
        <Button
          variant={checkedToday ? 'outlined' : 'contained'}
          startIcon={checkedToday ? <CheckIcon sx={{ fontSize: 16 }} /> : null}
          disabled={checkedToday}
          onClick={() => toggleCheckIn()}
          sx={{
            bgcolor: checkedToday ? 'transparent' : t.accent,
            color: checkedToday ? t.accent : '#fff',
            borderColor: checkedToday ? t.accent : 'transparent',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { bgcolor: checkedToday ? t.accentSoft : t.accentHover },
          }}
        >
          {checkedToday ? '今日已打卡' : '今日打卡'}
        </Button>
      </Box>

      {/* 月份切换 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton size="small" onClick={goPrev} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}>
          <ChevronLeftIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: t.text }}>
          {viewYear}年{viewMonth + 1}月
        </Typography>
        <IconButton size="small" onClick={goNext} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.subtle } }}>
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* 星期 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 0.5 }}>
        {WEEK_HEADERS.map((w) => (
          <Box key={w} sx={{ textAlign: 'center', py: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', color: t.muted, fontWeight: 600 }}>{w}</Typography>
          </Box>
        ))}
      </Box>

      {/* 日历 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 2 }}>
        {grid.map((cell, i) => {
          if (!cell.inMonth) return <Box key={i} sx={{ aspectRatio: '1' }} />;
          const checked = checkInSet.has(cell.dateStr);
          const isToday = cell.dateStr === todayS;
          return (
            <Box
              key={i}
              sx={{
                aspectRatio: '1',
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: checked ? `1px solid ${t.accent}` : `1px solid ${t.border}`,
                bgcolor: checked ? t.accentSoft : 'transparent',
                color: checked ? t.accent : t.text,
                fontWeight: isToday ? 700 : 500,
                fontSize: '0.78rem',
                position: 'relative',
              }}
            >
              {cell.day}
              {checked && (
                <CheckIcon sx={{ position: 'absolute', top: 2, right: 2, fontSize: 10, color: t.accent }} />
              )}
            </Box>
          );
        })}
      </Box>

      {/* 鼓励语 */}
      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: t.accentSoft, border: `1px solid ${t.accent}` }}>
        <Typography sx={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600, mb: 0.5 }}>Caleb</Typography>
        <Typography sx={{ fontSize: '0.8rem', color: t.text, lineHeight: 1.6 }}>
          {encourage}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: '0.7rem', color: t.muted, mt: 1.5, textAlign: 'center' }}>
        本月已打卡 {checkIn.filter((d) => d.startsWith(`${viewYear}-${pad(viewMonth + 1)}`)).length} 天
      </Typography>
    </Box>
  );
}
