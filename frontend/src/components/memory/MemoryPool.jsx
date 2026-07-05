import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Collapse,
} from '@mui/material';
import { useTheme } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from '@mui/icons-material/Add';
import { useMemoryStore } from '../../store/memoryStore.js';

// 记忆池：完整功能
export default function MemoryPool() {
  const theme = useTheme();
  const t = theme.palette._;
  const { memories, persona, addMemory, updateMemory, deleteMemory, toggleLongTerm, setPersona } = useMemoryStore();
  const [tab, setTab] = useState(0); // 0=全部, 1=长期
  const [expanded, setExpanded] = useState(null); // 展开的记忆 id
  const [menuEl, setMenuEl] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [editMem, setEditMem] = useState(null); // 编辑中的记忆
  const [deleteConfirm, setDeleteConfirm] = useState(null); // 待删除的记忆
  const [addOpen, setAddOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);
  const [personaDraft, setPersonaDraft] = useState(persona);

  // 过滤
  const list = tab === 1 ? memories.filter((m) => m.type === 'long') : memories;
  // 排序：长期优先 + 时间倒序
  const sorted = [...list].sort((a, b) => {
    if (a.type === 'long' && b.type !== 'long') return -1;
    if (a.type !== 'long' && b.type === 'long') return 1;
    return b.createdAt - a.createdAt;
  });

  const handleMenuOpen = (e, id) => {
    e.stopPropagation();
    setMenuEl(e.currentTarget);
    setMenuId(id);
  };
  const handleMenuClose = () => { setMenuEl(null); setMenuId(null); };

  const startEdit = (mem) => {
    setEditMem({ ...mem });
    handleMenuClose();
  };
  const saveEdit = () => {
    if (editMem) {
      updateMemory(editMem.id, { title: editMem.title, detail: editMem.detail, fullDetail: editMem.fullDetail });
    }
    setEditMem(null);
  };

  const subtitle = persona.split('\n')[0].slice(0, 40) || '每一滴水都是我关于你的珍贵瞬间';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 顶部标题 */}
      <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: t.text }}>
          我们的记忆池
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', color: t.muted, mt: 0.3, fontStyle: 'italic' }}>
          {subtitle}
        </Typography>
      </Box>

      {/* Tab 切换 */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          minHeight: 36,
          px: 2,
          '& .MuiTab-root': {
            minHeight: 36,
            fontSize: '0.85rem',
            fontWeight: 600,
            color: t.muted,
            textTransform: 'none',
            minWidth: 80,
          },
          '& .MuiTab-root.Mui-selected': { color: t.accent },
          '& .MuiTabs-indicator': { bgcolor: t.accent, height: 2 },
        }}
      >
        <Tab label="全部记忆" />
        <Tab label="长期记忆" />
      </Tabs>

      {/* 记忆列表 */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
        {sorted.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: t.muted }}>
            <Typography sx={{ fontSize: '0.85rem' }}>
              {tab === 1 ? '还没有长期记忆' : '记忆池是空的'}
            </Typography>
          </Box>
        ) : (
          sorted.map((mem) => (
            <MemoryCard
              key={mem.id}
              mem={mem}
              t={t}
              expanded={expanded === mem.id}
              onToggle={() => setExpanded(expanded === mem.id ? null : mem.id)}
              onMenu={handleMenuOpen}
            />
          ))
        )}
      </Box>

      {/* 底部：新增记忆 + 关于 Caleb */}
      <Box sx={{ px: 2, py: 1.5, borderTop: `1px solid ${t.border}`, display: 'flex', gap: 1 }}>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ color: t.accent, textTransform: 'none', fontSize: '0.8rem' }}
        >
          新增记忆
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          size="small"
          onClick={() => { setPersonaDraft(persona); setPersonaOpen(true); }}
          sx={{ color: t.muted, textTransform: 'none', fontSize: '0.8rem' }}
        >
          关于 Caleb
        </Button>
      </Box>

      {/* 管理菜单 */}
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{ sx: { bgcolor: t.surface, border: `1px solid ${t.border}`, borderRadius: 2, boxShadow: 3 } }}
      >
        <MenuItem onClick={() => { const m = memories.find((x) => x.id === menuId); if (m) startEdit(m); }} sx={{ fontSize: '0.82rem', color: t.text }}>
          <ListItemIcon sx={{ minWidth: 32, color: t.muted }}><EditIcon sx={{ fontSize: 18 }} /></ListItemIcon>
          编辑
        </MenuItem>
        <MenuItem onClick={() => { toggleLongTerm(menuId); handleMenuClose(); }} sx={{ fontSize: '0.82rem', color: t.text }}>
          <ListItemIcon sx={{ minWidth: 32, color: t.accent }}>
            {memories.find((x) => x.id === menuId)?.type === 'long' ? <StarBorderIcon sx={{ fontSize: 18 }} /> : <StarIcon sx={{ fontSize: 18 }} />}
          </ListItemIcon>
          {memories.find((x) => x.id === menuId)?.type === 'long' ? '取消长期' : '设为长期'}
        </MenuItem>
        <MenuItem onClick={() => { setDeleteConfirm(menuId); handleMenuClose(); }} sx={{ fontSize: '0.82rem', color: '#ef4444' }}>
          <ListItemIcon sx={{ minWidth: 32, color: '#ef4444' }}><DeleteIcon sx={{ fontSize: 18 }} /></ListItemIcon>
          删除
        </MenuItem>
      </Menu>

      {/* 编辑/新增对话框 */}
      {(editMem || addOpen) && (
        <EditDialog
          mem={editMem}
          t={t}
          onClose={() => { setEditMem(null); setAddOpen(false); }}
          onSave={(data) => {
            if (editMem) {
              updateMemory(editMem.id, data);
              setEditMem(null);
            } else {
              addMemory(data);
              setAddOpen(false);
            }
          }}
        />
      )}

      {/* 删除确认 */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} PaperProps={{ sx: { bgcolor: t.surface, borderRadius: 3 } }}>
        <DialogTitle sx={{ color: t.text, fontSize: '1rem' }}>删除这条记忆？</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: t.muted, fontSize: '0.85rem' }}>
            删除后无法恢复，Caleb 会忘记这件事。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ color: t.muted }}>取消</Button>
          <Button
            onClick={() => { deleteMemory(deleteConfirm); setDeleteConfirm(null); }}
            sx={{ color: '#ef4444', fontWeight: 600 }}
          >
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 关于 Caleb 人设编辑 */}
      <Dialog open={personaOpen} onClose={() => setPersonaOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: t.surface, borderRadius: 3 } }}>
        <DialogTitle sx={{ color: t.text, fontSize: '1rem' }}>关于 Caleb</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: t.muted, fontSize: '0.78rem', mb: 1.5 }}>
            这就是 Caleb 的本质。AI 会以此人设与你对话，修改后立即生效。
          </Typography>
          <TextField
            value={personaDraft}
            onChange={(e) => setPersonaDraft(e.target.value)}
            multiline
            rows={8}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: t.subtle, color: t.text, fontSize: '0.85rem', lineHeight: 1.7,
                '& fieldset': { borderColor: t.border },
                '&:hover fieldset': { borderColor: t.accent },
                '&.Mui-focused fieldset': { borderColor: t.accent },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPersonaOpen(false)} sx={{ color: t.muted }}>取消</Button>
          <Button
            onClick={() => { setPersona(personaDraft); setPersonaOpen(false); }}
            sx={{ color: t.accent, fontWeight: 600 }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// 单条记忆卡片
function MemoryCard({ mem, t, expanded, onToggle, onMenu }) {
  const isLong = mem.type === 'long';
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex',
        gap: 1.5,
        p: 1.75,
        mb: 1.25,
        borderRadius: 2,
        bgcolor: t.surface,
        border: `1px solid ${t.border}`,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        '&:hover': { borderColor: t.accent },
      }}
    >
      {/* 左侧：类型标记 */}
      <Box sx={{ pt: 0.5 }}>
        {isLong ? (
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: t.accent, boxShadow: `0 0 6px ${t.accentSoft}` }} />
        ) : (
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', border: `1.5px solid ${t.muted}` }} />
        )}
      </Box>

      {/* 右侧主体 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: t.text, lineHeight: 1.4 }}>
            {mem.title}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => onMenu(e, mem.id)}
            sx={{ color: t.muted, p: 0.25, '&:hover': { bgcolor: t.subtle } }}
          >
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Typography sx={{ fontSize: '0.8rem', color: t.muted, mt: 0.5, lineHeight: 1.5 }}>
          {mem.detail}
        </Typography>

        {/* 标签行 */}
        <Box sx={{ display: 'flex', gap: 0.75, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label={mem.source}
            size="small"
            sx={{
              height: 20, fontSize: '0.68rem',
              bgcolor: t.subtle, color: t.muted,
              '& .MuiChip-label': { px: 1 },
            }}
          />
          {isLong && (
            <Chip
              label="长期"
              size="small"
              sx={{
                height: 20, fontSize: '0.68rem', fontWeight: 600,
                bgcolor: t.accentSoft, color: t.accent,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
          <Typography sx={{ fontSize: '0.68rem', color: t.muted, opacity: 0.7 }}>
            {formatRelative(mem.createdAt)}
          </Typography>
        </Box>

        {/* 展开详情 */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${t.border}` }}>
            {mem.fullDetail && (
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.5, fontWeight: 600 }}>完整详情</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: t.text, lineHeight: 1.6 }}>
                  {mem.fullDetail}
                </Typography>
              </Box>
            )}
            {mem.originDialog && (
              <Box sx={{ mb: 1.5, pl: 1.5, borderLeft: `2px solid ${t.accent}` }}>
                <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.5, fontWeight: 600 }}>原始对话</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: t.muted, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {mem.originDialog}
                </Typography>
              </Box>
            )}
            {mem.history && mem.history.length > 0 && (
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.5, fontWeight: 600 }}>
                  演变记录（{mem.history.length} 次更新）
                </Typography>
                {mem.history.map((h, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.25 }}>
                    <Typography sx={{ fontSize: '0.7rem', color: t.accent, fontWeight: 600, minWidth: 50 }}>
                      {h.action}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: t.muted }}>
                      {formatRelative(h.time)} · {h.detail}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}

// 编辑/新增对话框
function EditDialog({ mem, t, onClose, onSave }) {
  const [title, setTitle] = useState(mem?.title || '');
  const [detail, setDetail] = useState(mem?.detail || '');
  const [fullDetail, setFullDetail] = useState(mem?.fullDetail || '');
  const isEdit = Boolean(mem);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: t.surface, borderRadius: 3 } }}>
      <DialogTitle sx={{ color: t.text, fontSize: '1rem' }}>{isEdit ? '编辑记忆' : '新增记忆'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 0.5 }}>
          <TextField label="标题" value={title} onChange={(e) => setTitle(e.target.value)} size="small" fullWidth
            sx={fieldSx(t)} />
          <TextField label="详情" value={detail} onChange={(e) => setDetail(e.target.value)} multiline rows={2} size="small" fullWidth
            sx={fieldSx(t)} />
          <TextField label="完整详情（可选）" value={fullDetail} onChange={(e) => setFullDetail(e.target.value)} multiline rows={3} size="small" fullWidth
            sx={fieldSx(t)} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: t.muted }}>取消</Button>
        <Button
          onClick={() => onSave({ title: title.trim() || '未命名', detail, fullDetail })}
          disabled={!title.trim()}
          sx={{ color: t.accent, fontWeight: 600 }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const fieldSx = (t) => ({
  '& .MuiOutlinedInput-root': {
    bgcolor: t.subtle, color: t.text, fontSize: '0.85rem',
    '& fieldset': { borderColor: t.border },
    '&:hover fieldset': { borderColor: t.accent },
    '&.Mui-focused fieldset': { borderColor: t.accent },
  },
  '& .MuiInputLabel-root': { color: t.muted, fontSize: '0.8rem' },
});

// 相对时间
function formatRelative(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const min = 60 * 1000, hour = 60 * min, day = 24 * hour;
  if (diff < min) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / min)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`;
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
