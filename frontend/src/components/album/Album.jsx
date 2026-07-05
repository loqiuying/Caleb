import { useState, useRef } from 'react';
import { Box, Typography, Button, IconButton, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useAlbumStore } from '../../store/albumStore.js';

// 相册：手账本风格
export default function Album() {
  const theme = useTheme();
  const t = theme.palette._;
  const { photos, categories, addPhoto, deletePhoto, addCategory } = useAlbumStore();
  const [cat, setCat] = useState('全部');
  const [addOpen, setAddOpen] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newCat, setNewCat] = useState('');

  const list = cat === '全部' ? photos : photos.filter((p) => p.category === cat);

  const handleCreateCat = () => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setNewCat('');
    setCatDialogOpen(false);
    setCat(trimmed);
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      {/* 顶部 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: t.text }}>
          相册
        </Typography>
        <Button
          size="small"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={() => setAddOpen(true)}
          sx={{ color: t.accent, textTransform: 'none', fontSize: '0.82rem', border: `1px solid ${t.border}`, borderRadius: 2, px: 1.5 }}
        >
          添加照片
        </Button>
      </Box>

      {/* 分类标签 */}
      <Box sx={{ display: 'flex', gap: 0.75, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            size="small"
            onClick={() => setCat(c)}
            sx={{
              height: 26, fontSize: '0.75rem',
              bgcolor: cat === c ? t.accentSoft : t.subtle,
              color: cat === c ? t.accent : t.muted,
              border: cat === c ? `1px solid ${t.accent}` : `1px solid ${t.border}`,
              '&:hover': { bgcolor: t.accentSoft },
            }}
          />
        ))}
        {/* 新增分类按钮 */}
        <IconButton
          size="small"
          onClick={() => setCatDialogOpen(true)}
          aria-label="新增分类"
          title="新增分类"
          sx={{
            width: 26, height: 26, borderRadius: 1,
            border: `1px dashed ${t.border}`,
            color: t.muted,
            '&:hover': { color: t.accent, borderColor: t.accent, bgcolor: t.accentSoft },
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* 照片网格（手账本风格） */}
      {list.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontSize: '0.85rem', color: t.muted }}>
            还没有照片，点击右上角添加吧
          </Typography>
        </Box>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
        }}>
          {list.map((p) => (
            <Box
              key={p.id}
              onClick={() => setViewPhoto(p)}
              sx={{
                aspectRatio: '1',
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${t.border}`,
                cursor: 'pointer',
                bgcolor: t.subtle,
                position: 'relative',
                '&:hover': { borderColor: t.accent, transform: 'scale(1.02)' },
                transition: 'all 0.15s',
              }}
            >
              {p.src ? (
                <Box component="img" src={p.src} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: '1.5rem' }}>📷</Typography>
                </Box>
              )}
              {/* 分类标签 */}
              <Box sx={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                bgcolor: 'rgba(0,0,0,0.5)', px: 0.5, py: 0.25,
              }}>
                <Typography sx={{ fontSize: '0.6rem', color: '#fff', textAlign: 'center' }}>
                  {p.note || p.category}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* 添加照片对话框 */}
      {addOpen && (
        <AddPhotoDialog t={t} categories={categories} onClose={() => setAddOpen(false)} onSave={addPhoto} />
      )}

      {/* 新增分类对话框 */}
      <Dialog open={catDialogOpen} onClose={() => setCatDialogOpen(false)} fullWidth maxWidth="xs"
        PaperProps={{ sx: { bgcolor: t.surface, borderRadius: 3 } }}>
        <DialogTitle sx={{ fontSize: '0.95rem', color: t.text }}>新增分类</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateCat(); }}
            size="small" fullWidth placeholder="输入分类名"
            sx={{
              mt: 0.5,
              '& .MuiOutlinedInput-root': {
                bgcolor: t.subtle, color: t.text, fontSize: '0.85rem',
                '& fieldset': { borderColor: t.border },
                '&.Mui-focused fieldset': { borderColor: t.accent },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCatDialogOpen(false)} sx={{ color: t.muted, textTransform: 'none' }}>取消</Button>
          <Button onClick={handleCreateCat} disabled={!newCat.trim()}
            sx={{ color: t.accent, textTransform: 'none', fontWeight: 600 }}>创建</Button>
        </DialogActions>
      </Dialog>

      {/* 查看照片 */}
      {viewPhoto && (
        <Dialog open onClose={() => setViewPhoto(null)} fullWidth maxWidth="sm"
          PaperProps={{ sx: { bgcolor: t.surface, borderRadius: 3 } }}>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.9rem', color: t.text }}>{viewPhoto.note || '照片'}</Typography>
            <IconButton size="small" onClick={() => setViewPhoto(null)}><CloseIcon sx={{ fontSize: 18, color: t.muted }} /></IconButton>
          </DialogTitle>
          <DialogContent>
            {viewPhoto.src ? (
              <Box component="img" src={viewPhoto.src} sx={{ width: '100%', borderRadius: 2, mb: 1 }} />
            ) : (
              <Box sx={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: t.subtle, borderRadius: 2, mb: 1 }}>
                <Typography sx={{ fontSize: '3rem' }}>📷</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={viewPhoto.category} size="small" sx={{ bgcolor: t.accentSoft, color: t.accent, fontSize: '0.72rem' }} />
              <Typography sx={{ fontSize: '0.72rem', color: t.muted }}>
                {new Date(viewPhoto.date).toLocaleDateString('zh-CN')}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { deletePhoto(viewPhoto.id); setViewPhoto(null); }} sx={{ color: '#ef4444', textTransform: 'none' }}>
              <DeleteOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />删除
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

function AddPhotoDialog({ t, categories, onClose, onSave }) {
  const [src, setSrc] = useState('');
  const [category, setCategory] = useState('日常');
  const [note, setNote] = useState('');
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('图片不能超过 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { bgcolor: t.surface, borderRadius: 3 } }}>
      <DialogTitle sx={{ fontSize: '0.95rem', color: t.text }}>添加照片</DialogTitle>
      <DialogContent>
        {/* 上传区域 */}
        <Box
          onClick={() => fileRef.current?.click()}
          sx={{
            width: '100%', height: 150, borderRadius: 2,
            border: `2px dashed ${t.border}`, bgcolor: t.subtle,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', mb: 2, overflow: 'hidden',
            '&:hover': { borderColor: t.accent },
          }}
        >
          {src ? (
            <Box component="img" src={src} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <AddPhotoAlternateIcon sx={{ fontSize: 32, color: t.muted }} />
              <Typography sx={{ fontSize: '0.78rem', color: t.muted, mt: 0.5 }}>点击选择照片</Typography>
            </Box>
          )}
        </Box>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />

        {/* 分类 */}
        <Box sx={{ display: 'flex', gap: 0.75, mb: 2, flexWrap: 'wrap' }}>
          {categories.filter((c) => c !== '全部').map((c) => (
            <Chip key={c} label={c} size="small" onClick={() => setCategory(c)}
              sx={{
                height: 26, fontSize: '0.75rem',
                bgcolor: category === c ? t.accentSoft : t.subtle,
                color: category === c ? t.accent : t.muted,
                border: `1px solid ${category === c ? t.accent : t.border}`,
              }} />
          ))}
        </Box>

        <TextField
          value={note} onChange={(e) => setNote(e.target.value)}
          size="small" fullWidth placeholder="写一句话（选填）"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: t.subtle, color: t.text, fontSize: '0.85rem',
              '& fieldset': { borderColor: t.border },
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: t.muted, textTransform: 'none' }}>取消</Button>
        <Button
          onClick={() => { onSave({ src, category, note }); onClose(); }}
          disabled={!src}
          sx={{ color: t.accent, textTransform: 'none', fontWeight: 600 }}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
