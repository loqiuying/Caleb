import { useState, useMemo } from 'react';
import { Box, Typography, IconButton, Button, Collapse, TextField, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TodayIcon from '@mui/icons-material/Today';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useCalendarStore, RECORD_TYPES } from '../../store/calendarStore.js';

const WEEK_HEADERS = ['日', '一', '二', '三', '四', '五', '六'];
const TYPE_COLOR = {
  interact: '#ec4899',
  study:    '#6366f1',
  game:     '#f97316',
  photo:    '#10b981',
  other:    '#64748b',
};

function pad(n) { return String(n).padStart(2, '0'); }
function fmtDate(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

export default function Calendar() {
  const theme = useTheme();
  const t = theme.palette._;
  const { records, addRecord, deleteRecord, monthlySummaries, updateMonthlySummary } = useCalendarStore();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(fmtDate(today.getFullYear(), today.getMonth(), today.getDate()));
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);

  // 新增记录表单状态
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState('interact');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAiComment, setNewAiComment] = useState('');

  // 删除二次确认
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // 月度总结编辑
  const monthKey = `${viewYear}-${pad(viewMonth + 1)}`;
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState('');

  const todayStr = fmtDate(today.getFullYear(), today.getMonth(), today.getDate());

  // 当月日历网格：6 行 x 7 列，包含前后的填充天
  const grid = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startDay = first.getDay(); // 0=日
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
    const cells = [];
    // 上月填充
    for (let i = startDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrev - i, inMonth: false, dateStr: null });
    }
    // 当月
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, inMonth: true, dateStr: fmtDate(viewYear, viewMonth, d) });
    }
    // 下月填充至 42 格
    let nextDay = 1;
    while (cells.length < 42) {
      cells.push({ day: nextDay++, inMonth: false, dateStr: null });
    }
    return cells;
  }, [viewYear, viewMonth]);

  // 当月每天对应的记录类型集合
  const recordsByDate = useMemo(() => {
    const map = {};
    for (const r of records) {
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(r);
    }
    return map;
  }, [records]);

  const selectedRecords = recordsByDate[selectedDate] || [];

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(todayStr);
  };

  // 月度统计
  const monthStats = useMemo(() => {
    const monthPrefix = `${viewYear}-${pad(viewMonth + 1)}`;
    const monthRecs = records.filter((r) => r.date.startsWith(monthPrefix));
    const days = new Set(monthRecs.map((r) => r.date)).size;
    const countBy = (type) => monthRecs.filter((r) => r.type === type).length;
    return {
      days,
      interact: countBy('interact'),
      study: countBy('study'),
      game: countBy('game'),
      photo: countBy('photo'),
      total: monthRecs.length,
    };
  }, [records, viewYear, viewMonth]);

  const monthSummary = useMemo(() => {
    const saved = monthlySummaries[monthKey];
    if (typeof saved === 'string' && saved.trim()) return saved;
    if (monthStats.total === 0) return '本月还没有记录，开始记下今天的点滴吧。';
    const parts = [];
    if (monthStats.days) parts.push(`一起度过了 ${monthStats.days} 天`);
    if (monthStats.study) parts.push(`学习打卡 ${monthStats.study} 次`);
    if (monthStats.interact) parts.push(`互动 ${monthStats.interact} 次`);
    if (monthStats.game) parts.push(`玩游戏 ${monthStats.game} 局`);
    if (monthStats.photo) parts.push(`拍了 ${monthStats.photo} 张照片`);
    return parts.length ? `${parts.join('，')}。继续保持，每一个瞬间都值得被记住。` : '本月还没有记录。';
  }, [monthStats, monthlySummaries, monthKey]);

  const handleAddRecord = () => {
    if (!newTitle.trim() && !newDesc.trim()) return;
    addRecord({
      date: selectedDate,
      timestamp: Date.now(),
      type: newType,
      title: newTitle.trim() || RECORD_TYPES[newType].label,
      description: newDesc.trim(),
      aiComment: newAiComment.trim(),
    });
    setNewType('interact');
    setNewTitle('');
    setNewDesc('');
    setNewAiComment('');
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewType('interact');
    setNewTitle('');
    setNewDesc('');
    setNewAiComment('');
  };

  const handleDeleteRecord = (id) => {
    deleteRecord(id);
    setConfirmDeleteId(null);
  };

  const startEditSummary = () => {
    setSummaryDraft(monthSummary);
    setEditingSummary(true);
  };

  const saveSummary = () => {
    updateMonthlySummary(monthKey, summaryDraft.trim() || monthSummary);
    setEditingSummary(false);
  };

  const cancelEditSummary = () => {
    setEditingSummary(false);
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      {/* 顶部月份切换 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton size="small" onClick={goPrevMonth} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.accentSoft } }}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: t.text }}>
          {viewYear}年{viewMonth + 1}月
        </Typography>
        <IconButton size="small" onClick={goNextMonth} sx={{ color: t.muted, '&:hover': { color: t.accent, bgcolor: t.accentSoft } }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* 星期标题 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
        {WEEK_HEADERS.map((w) => (
          <Box key={w} sx={{ textAlign: 'center', py: 0.5 }}>
            <Typography sx={{ fontSize: '0.72rem', color: t.muted, fontWeight: 600 }}>{w}</Typography>
          </Box>
        ))}
      </Box>

      {/* 日历网格 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 2 }}>
        {grid.map((cell, idx) => {
          if (!cell.inMonth) {
            return <Box key={idx} sx={{ aspectRatio: '1', borderRadius: 1.5 }} />;
          }
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;
          const dayRecs = recordsByDate[cell.dateStr] || [];
          const typeSet = new Set(dayRecs.map((r) => r.type));
          return (
            <Box
              key={idx}
              onClick={() => { setSelectedDate(cell.dateStr); setExpandedRecord(null); }}
              sx={{
                aspectRatio: '1',
                borderRadius: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                border: isSelected ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
                bgcolor: isSelected ? t.accentSoft : 'transparent',
                transition: 'all 0.15s',
                '&:hover': { borderColor: t.accent, bgcolor: t.accentSoft },
              }}
            >
              <Box
                sx={{
                  width: 22, height: 22, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: isToday ? t.accent : 'transparent',
                  color: isToday ? '#fff' : t.text,
                }}
              >
                <Typography sx={{ fontSize: '0.78rem', fontWeight: isToday ? 700 : 500 }}>
                  {cell.day}
                </Typography>
              </Box>
              {/* 类型小圆点 */}
              {dayRecs.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.25, mt: 0.25, height: 6 }}>
                  {Array.from(typeSet).slice(0, 4).map((tp) => (
                    <Box key={tp} sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: TYPE_COLOR[tp] || t.muted }} />
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* 回到今天 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          size="small" startIcon={<TodayIcon sx={{ fontSize: 16 }} />}
          onClick={goToday}
          sx={{ color: t.accent, textTransform: 'none', fontSize: '0.78rem', border: `1px solid ${t.border}`, borderRadius: 2, px: 1.5 }}
        >
          回到今天
        </Button>
      </Box>

      {/* 当日记录列表 */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: t.text }}>
            {selectedDate} 的记录 {selectedRecords.length > 0 && `（${selectedRecords.length}）`}
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => setShowAddForm((v) => !v)}
            sx={{
              color: t.accent, textTransform: 'none', fontSize: '0.75rem',
              border: `1px solid ${t.border}`, borderRadius: 2, px: 1, py: 0.25,
              '&:hover': { borderColor: t.accent, bgcolor: t.accentSoft },
            }}
          >
            添加记录
          </Button>
        </Box>

        {showAddForm && (
          <Box sx={{ mb: 1.5, p: 1.5, borderRadius: 2, border: `1px solid ${t.accent}`, bgcolor: t.surface }}>
            <TextField
              select
              size="small"
              fullWidth
              label="类型"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              sx={{ mb: 1 }}
            >
              {Object.values(RECORD_TYPES).map((rt) => (
                <MenuItem key={rt.id} value={rt.id}>{rt.icon} {rt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              fullWidth
              label="标题"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="给这条记录起个名字"
              sx={{ mb: 1 }}
            />
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={2}
              label="描述"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="发生了什么？"
              sx={{ mb: 1 }}
            />
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={2}
              label="Caleb 的评价"
              value={newAiComment}
              onChange={(e) => setNewAiComment(e.target.value)}
              placeholder="AI 评价（可留空）"
              sx={{ mb: 1.5 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button size="small" onClick={handleCancelAdd} sx={{ color: t.muted, textTransform: 'none' }}>
                取消
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<CheckIcon sx={{ fontSize: 16 }} />}
                onClick={handleAddRecord}
                sx={{ bgcolor: t.accent, color: '#fff', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: t.accentHover } }}
              >
                保存
              </Button>
            </Box>
          </Box>
        )}

        {selectedRecords.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center', borderRadius: 2, border: `1px dashed ${t.border}` }}>
            <Typography sx={{ fontSize: '0.78rem', color: t.muted }}>这一天还没有记录</Typography>
          </Box>
        ) : (
          selectedRecords.map((r) => {
            const typeObj = RECORD_TYPES[r.type] || RECORD_TYPES.other;
            const expanded = expandedRecord === r.id;
            const isConfirming = confirmDeleteId === r.id;
            return (
              <Box
                key={r.id}
                onClick={() => setExpandedRecord(expanded ? null : r.id)}
                sx={{
                  mb: 1, p: 1.5, borderRadius: 2, cursor: 'pointer',
                  border: `1px solid ${expanded ? t.accent : t.border}`,
                  bgcolor: t.surface,
                  '&:hover': { borderColor: t.accent },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1rem' }}>{typeObj.icon}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: t.muted, fontWeight: 600 }}>
                    {new Date(r.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: TYPE_COLOR[r.type] || t.muted, fontWeight: 600 }}>
                    · {typeObj.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: t.text, fontWeight: 600, ml: 'auto' }}>{r.title}</Typography>
                  {/* 删除按钮 */}
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isConfirming) handleDeleteRecord(r.id);
                      else setConfirmDeleteId(r.id);
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24, height: 24, borderRadius: 1,
                      cursor: 'pointer',
                      color: isConfirming ? '#fff' : t.muted,
                      bgcolor: isConfirming ? t.error || '#FA5151' : 'transparent',
                      transition: 'all 0.15s',
                      ml: 0.5,
                      '&:hover': { color: t.error || '#FA5151', bgcolor: isConfirming ? 'transparent' : t.accentSoft },
                    }}
                    title={isConfirming ? '再次点击确认删除' : '删除'}
                  >
                    {isConfirming
                      ? <Typography sx={{ fontSize: '0.66rem', fontWeight: 700 }}>确认</Typography>
                      : <DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                  </Box>
                  {isConfirming && (
                    <Box
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 24, height: 24, borderRadius: 1, cursor: 'pointer',
                        color: t.muted,
                        '&:hover': { color: t.text, bgcolor: t.subtle },
                      }}
                      title="取消"
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </Box>
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.78rem', color: t.text, opacity: 0.85, mt: 0.5, lineHeight: 1.6 }}>
                  {r.description}
                </Typography>
                <Collapse in={expanded}>
                  <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${t.border}` }}>
                    <Typography sx={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600, mb: 0.25 }}>Caleb 的评价</Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: t.text, lineHeight: 1.6 }}>
                      {r.aiComment || '（暂无评价）'}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            );
          })
        )}
      </Box>

      {/* 月度统计（可折叠） */}
      <Box sx={{ borderRadius: 2, border: `1px solid ${t.border}`, bgcolor: t.surface, overflow: 'hidden' }}>
        <Box
          onClick={() => setStatsOpen(!statsOpen)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1.25, cursor: 'pointer', '&:hover': { bgcolor: t.subtle } }}
        >
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: t.text }}>
            月度统计 · {viewMonth + 1}月
          </Typography>
          <ExpandMoreIcon sx={{ fontSize: 18, color: t.muted, transform: statsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </Box>
        <Collapse in={statsOpen}>
          <Box sx={{ px: 1.5, pb: 1.5, pt: 0.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, mb: 1.5 }}>
              <StatCell label="互动天数" value={monthStats.days} t={t} />
              <StatCell label="学习打卡" value={monthStats.study} t={t} />
              <StatCell label="一起互动" value={monthStats.interact} t={t} />
              <StatCell label="小游戏" value={monthStats.game} t={t} />
              <StatCell label="照片数" value={monthStats.photo} t={t} />
            </Box>
            <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: t.accentSoft, border: `1px solid ${t.accent}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.72rem', color: t.accent, fontWeight: 600 }}>AI 月度总结</Typography>
                {!editingSummary ? (
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); startEditSummary(); }}
                    aria-label="编辑总结"
                    sx={{ color: t.accent, p: 0.25, '&:hover': { bgcolor: t.surface } }}
                  >
                    <EditIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                ) : (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); saveSummary(); }}
                      aria-label="保存"
                      sx={{ color: t.accent, p: 0.25, '&:hover': { bgcolor: t.surface } }}
                    >
                      <CheckIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); cancelEditSummary(); }}
                      aria-label="取消"
                      sx={{ color: t.muted, p: 0.25, '&:hover': { bgcolor: t.surface } }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
              {editingSummary ? (
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  value={summaryDraft}
                  onChange={(e) => setSummaryDraft(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={saveSummary}
                  sx={{
                    bgcolor: t.surface, borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      border: 'none',
                      fontSize: '0.78rem',
                      lineHeight: 1.6,
                      color: t.text,
                      '& fieldset': { border: 'none' },
                    },
                  }}
                />
              ) : (
                <Typography
                  onClick={(e) => { e.stopPropagation(); startEditSummary(); }}
                  sx={{
                    fontSize: '0.78rem', color: t.text, lineHeight: 1.6,
                    cursor: 'text',
                    '&:hover': { textDecoration: 'underline', textDecorationColor: t.accent, textDecorationStyle: 'dotted' },
                  }}
                >
                  {monthSummary}
                </Typography>
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}

function StatCell({ label, value, t }) {
  return (
    <Box sx={{ textAlign: 'center', p: 0.75, borderRadius: 1.5, bgcolor: t.subtle }}>
      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: t.accent }}>{value}</Typography>
      <Typography sx={{ fontSize: '0.66rem', color: t.muted, mt: 0.25 }}>{label}</Typography>
    </Box>
  );
}
