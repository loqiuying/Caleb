import { useState, useEffect } from 'react';
import { Box, Typography, Button, Tabs, Tab, TextField, IconButton, Collapse } from '@mui/material';
import { useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import CreateIcon from '@mui/icons-material/Create';
import { useDiaryStore } from '../../store/diaryStore.js';
import { useMemoryStore } from '../../store/memoryStore.js';

const WEATHERS = [
  { id: 'sunny', label: '晴', icon: '☀️' },
  { id: 'cloudy', label: '多云', icon: '⛅' },
  { id: 'overcast', label: '阴', icon: '☁️' },
  { id: 'rainy', label: '雨', icon: '🌧️' },
  { id: 'snowy', label: '雪', icon: '❄️' },
  { id: 'windy', label: '风', icon: '💨' },
];
const MOODS = [
  { id: 'happy', label: '开心', icon: '😊' },
  { id: 'calm', label: '平静', icon: '😌' },
  { id: 'down', label: '有点丧', icon: '😔' },
  { id: 'sad', label: '难过', icon: '😢' },
  { id: 'angry', label: '生气', icon: '😠' },
];

export default function Diary() {
  const theme = useTheme();
  const t = theme.palette._;
  const { diaries, addDiary, generateCalebDiary } = useDiaryStore();
  const persona = useMemoryStore((s) => s.persona);
  const [tab, setTab] = useState(0); // 0=Caleb, 1=Yoren
  const [writing, setWriting] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // 启动时生成 Caleb 日记（如果今天还没生成）
  useEffect(() => { generateCalebDiary(); }, [generateCalebDiary]);

  const subtitle = persona.split('\n')[0].slice(0, 30) || '你的每一天，我都想好好收藏';
  const calebDiaries = diaries.filter((d) => d.author === 'caleb').sort((a, b) => b.date - a.date);
  const yorenDiaries = diaries.filter((d) => d.author === 'yoren').sort((a, b) => b.date - a.date);
  const list = tab === 0 ? calebDiaries : yorenDiaries;

  // 写日记界面
  if (writing) {
    return <WriteDiary t={t} onClose={() => setWriting(false)} onSave={(data) => { addDiary(data); setWriting(false); }} />;
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      {/* 标题 */}
      <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: t.text }}>我们的日记</Typography>
      <Typography sx={{ fontSize: '0.78rem', color: t.muted, mt: 0.3, mb: 2, fontStyle: 'italic' }}>{subtitle}</Typography>

      {/* Tab */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
        minHeight: 36, mb: 2,
        '& .MuiTab-root': { minHeight: 36, fontSize: '0.85rem', fontWeight: 600, color: t.muted, textTransform: 'none', minWidth: 90 },
        '& .MuiTab-root.Mui-selected': { color: t.accent },
        '& .MuiTabs-indicator': { bgcolor: t.accent, height: 2 },
      }}>
        <Tab label="Caleb的日记" />
        <Tab label="Yoren的日记" />
      </Tabs>

      {/* Yoren tab 显示写日记按钮 */}
      {tab === 1 && (
        <Button
          size="small" startIcon={<EditIcon />}
          onClick={() => setWriting(true)}
          sx={{
            color: t.accent, textTransform: 'none', fontSize: '0.82rem',
            border: `1px solid ${t.border}`, borderRadius: 2, px: 1.5, mb: 2,
          }}
        >
          写日记
        </Button>
      )}

      {/* 日记列表 */}
      {list.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontSize: '0.85rem', color: t.muted }}>
            {tab === 0 ? 'Caleb 还没写日记' : '你还没写日记，点击上方按钮开始吧'}
          </Typography>
        </Box>
      ) : (
        list.map((d) => (
          <DiaryCard key={d.id} d={d} t={t} expanded={expanded === d.id} onToggle={() => setExpanded(expanded === d.id ? null : d.id)} />
        ))
      )}
    </Box>
  );
}

function DiaryCard({ d, t, expanded, onToggle }) {
  const date = new Date(d.date);
  const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
  const weatherObj = WEATHERS.find((w) => w.id === d.weather);
  const moodObj = MOODS.find((m) => m.id === d.mood);
  const preview = d.title || (d.content ? d.content.slice(0, 20) + '...' : '');

  return (
    <Box onClick={onToggle} sx={{
      mb: 1.5, p: 1.75, borderRadius: 2,
      border: `1px solid ${t.border}`, bgcolor: t.surface, cursor: 'pointer',
      '&:hover': { borderColor: t.accent },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: t.text }}>{dateStr}</Typography>
        {weatherObj && <Typography sx={{ fontSize: '0.85rem' }}>{weatherObj.icon}</Typography>}
        {moodObj && <Typography sx={{ fontSize: '0.75rem', color: t.muted }}>{moodObj.icon} {moodObj.label}</Typography>}
        {d.mood && !moodObj && <Typography sx={{ fontSize: '0.75rem', color: t.muted }}>{d.mood}</Typography>}
      </Box>
      <Typography sx={{ fontSize: '0.82rem', color: t.text, opacity: 0.85 }}>{preview}</Typography>
      {d.photos?.length > 0 && <Typography sx={{ fontSize: '0.7rem', color: t.muted, mt: 0.5 }}>📷 {d.photos.length}张照片</Typography>}

      <Collapse in={expanded}>
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${t.border}` }}>
          {d.title && <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: t.text, mb: 1 }}>{d.title}</Typography>}
          <Typography sx={{ fontSize: '0.82rem', color: t.text, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {d.content}
          </Typography>

          {/* AI 回应（Yoren 的日记） */}
          {d.author === 'yoren' && d.aiResponse && (
            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 2, bgcolor: t.subtle, border: `1px solid ${t.border}` }}>
              <Typography sx={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600, mb: 0.5 }}>Caleb 的回应</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: t.text, lineHeight: 1.7 }}>{d.aiResponse}</Typography>
            </Box>
          )}

          {/* Yoren 回复区（Caleb 的日记） */}
          {d.author === 'caleb' && (
            <Box sx={{ mt: 1.5 }}>
              {d.calebReply ? (
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: t.subtle, border: `1px solid ${t.border}` }}>
                  <Typography sx={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600, mb: 0.5 }}>Yoren 的回复</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: t.text, lineHeight: 1.7 }}>{d.calebReply}</Typography>
                </Box>
              ) : (
                <Typography sx={{ fontSize: '0.72rem', color: t.muted, fontStyle: 'italic' }}>
                  点击回复 Caleb 的日记（预留）
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

function WriteDiary({ t, onClose, onSave }) {
  const [weather, setWeather] = useState('');
  const [mood, setMood] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState([]);

  const today = new Date();
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 ${weekDays[today.getDay()]}`;

  const handleSave = () => {
    if (!content.trim()) return;
    onSave({ weather, mood, title: title.trim(), content: content.trim(), photos });
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button size="small" onClick={onClose} sx={{ color: t.muted, textTransform: 'none', fontSize: '0.82rem' }}>← 返回</Button>
        <Button size="small" onClick={handleSave} disabled={!content.trim()}
          sx={{ color: t.accent, textTransform: 'none', fontWeight: 600, fontSize: '0.82rem' }}>保存</Button>
      </Box>

      {/* 日期 */}
      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: t.text, mb: 1.5 }}>{dateStr}</Typography>

      {/* 天气选择 */}
      <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.75, fontWeight: 600 }}>天气</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {WEATHERS.map((w) => (
          <Box key={w.id} onClick={() => setWeather(weather === w.id ? '' : w.id)} sx={{
            width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '1.1rem',
            border: weather === w.id ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
            bgcolor: weather === w.id ? t.accentSoft : 'transparent',
          }}>{w.icon}</Box>
        ))}
      </Box>

      {/* 心情选择 */}
      <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.75, fontWeight: 600 }}>心情</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {MOODS.map((m) => (
          <Box key={m.id} onClick={() => setMood(mood === m.id ? '' : m.id)} sx={{
            px: 1.5, py: 0.75, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 0.5,
            cursor: 'pointer', fontSize: '0.75rem',
            border: mood === m.id ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
            bgcolor: mood === m.id ? t.accentSoft : 'transparent',
            color: mood === m.id ? t.accent : t.muted,
          }}>
            <span style={{ fontSize: '1rem' }}>{m.icon}</span>{m.label}
          </Box>
        ))}
      </Box>

      {/* 标题 */}
      <TextField value={title} onChange={(e) => setTitle(e.target.value)}
        size="small" fullWidth placeholder="标题（选填）"
        sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { bgcolor: t.subtle, color: t.text, fontSize: '0.85rem', '& fieldset': { borderColor: t.border } } }}
      />

      {/* 正文 */}
      <TextField value={content} onChange={(e) => setContent(e.target.value)}
        multiline minRows={6} fullWidth placeholder="今天发生了什么..."
        sx={{ '& .MuiOutlinedInput-root': { bgcolor: t.subtle, color: t.text, fontSize: '0.85rem', lineHeight: 1.8, '& fieldset': { borderColor: t.border } } }}
      />
    </Box>
  );
}
