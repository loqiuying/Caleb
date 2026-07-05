import { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { useCompanionStore } from '../../store/companionStore.js';

// 地址编辑：Caleb 位置 + Yoren 位置
export default function AddressEditor() {
  const theme = useTheme();
  const t = theme.palette._;
  const { addresses, setAddresses } = useCompanionStore();
  const [caleb, setCaleb] = useState(addresses.caleb);
  const [yoren, setYoren] = useState(addresses.yoren);

  const handleSave = () => {
    setAddresses({ caleb: caleb.trim() || '未设置', yoren: yoren.trim() || '未设置' });
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2.5, py: 2 }}>
      <Typography sx={{ fontSize: '0.82rem', color: t.muted, mb: 2.5, lineHeight: 1.6 }}>
        设置你和 Caleb 的位置，状态里会模拟你们附近的活动范围。
      </Typography>

      {/* Caleb 位置 */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
          <PlaceIcon sx={{ fontSize: 16, color: t.accent }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: t.text }}>
            Caleb 的当前位置
          </Typography>
        </Box>
        <TextField
          value={caleb}
          onChange={(e) => setCaleb(e.target.value)}
          size="small"
          fullWidth
          placeholder="如：上海·徐汇区"
          sx={fieldSx(t)}
        />
      </Box>

      {/* Yoren 位置 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
          <PlaceIcon sx={{ fontSize: 16, color: t.muted }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: t.text }}>
            Yoren 的当前位置
          </Typography>
        </Box>
        <TextField
          value={yoren}
          onChange={(e) => setYoren(e.target.value)}
          size="small"
          fullWidth
          placeholder="如：上海·浦东新区"
          sx={fieldSx(t)}
        />
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={handleSave}
        sx={{
          bgcolor: t.accent, color: '#fff', textTransform: 'none', fontWeight: 600,
          borderRadius: 2, py: 1,
          '&:hover': { bgcolor: t.accentHover },
        }}
      >
        保存
      </Button>
    </Box>
  );
}

const fieldSx = (t) => ({
  '& .MuiOutlinedInput-root': {
    bgcolor: t.subtle, color: t.text, fontSize: '0.85rem',
    '& fieldset': { borderColor: t.border },
    '&:hover fieldset': { borderColor: t.accent },
    '&.Mui-focused fieldset': { borderColor: t.accent },
  },
});
