import { Box, Typography, IconButton, Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import PlaceIcon from '@mui/icons-material/Place';
import { useCompanionStore } from '../../store/companionStore.js';

// Caleb 的状态：此刻状态 + 心情 + 设备使用 + 位置
export default function CompanionStatus() {
  const theme = useTheme();
  const t = theme.palette._;
  const { status, prevStatus, refresh } = useCompanionStore();

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      {/* 此刻状态 */}
      <SectionLabel t={t}>此刻状态</SectionLabel>
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: '0.9rem', color: t.text, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {status.current}
        </Typography>
      </Box>

      {/* 心情标签 */}
      <SectionLabel t={t}>心情</SectionLabel>
      <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
        <Chip t={t}>{status.moodEmoji} {status.mood}</Chip>
      </Box>

      <Divider sx={{ borderColor: t.border, mb: 2 }} />

      {/* 位置 */}
      <SectionLabel t={t}>位置</SectionLabel>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2.5 }}>
        <PlaceIcon sx={{ fontSize: 16, color: t.accent }} />
        <Typography sx={{ fontSize: '0.82rem', color: t.text }}>{status.location}</Typography>
      </Box>

      <Divider sx={{ borderColor: t.border, mb: 2 }} />

      {/* 手机使用记录 */}
      <DeviceSection t={t} icon={<SmartphoneIcon />} title="手机" battery={status.phoneBattery} records={status.phone} />
      {/* 平板使用记录 */}
      <DeviceSection t={t} icon={<TabletIcon />} title="平板" battery={status.tabletBattery} records={status.tablet} />
      {/* 电脑使用记录 */}
      <DeviceSection t={t} icon={<LaptopIcon />} title="电脑" battery={status.computerBattery} records={status.computer} />

      {/* 前一次状态 */}
      {prevStatus && (
        <>
          <Divider sx={{ borderColor: t.border, mb: 2, mt: 1 }} />
          <SectionLabel t={t}>上一次状态</SectionLabel>
          <Typography sx={{ fontSize: '0.8rem', color: t.muted, lineHeight: 1.6, mb: 0.5 }}>
            {prevStatus.moodEmoji} {prevStatus.mood}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: t.muted, lineHeight: 1.6, opacity: 0.8 }}>
            {prevStatus.current}
          </Typography>
        </>
      )}

      {/* 刷新按钮 */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={refresh}
          sx={{ color: t.accent, textTransform: 'none', fontSize: '0.82rem' }}
        >
          刷新状态
        </Button>
      </Box>
    </Box>
  );
}

// 设备使用记录区块
function DeviceSection({ t, icon, title, battery, records }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
        <Box sx={{ color: t.muted, display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: t.text }}>{title}</Typography>
        <Typography sx={{ fontSize: '0.7rem', color: t.muted, ml: 'auto' }}>电量 {battery}</Typography>
      </Box>
      <Box sx={{ pl: 0.5 }}>
        {records.map((r, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'baseline' }}>
            <Typography sx={{ fontSize: '0.72rem', color: t.muted, minWidth: 64, flexShrink: 0 }}>
              {r.time}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: t.text, lineHeight: 1.5 }}>
              <Box component="span" sx={{ color: t.accent, fontWeight: 600 }}>{r.app}</Box>
              {' · '}
              {r.detail}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SectionLabel({ t, children }) {
  return (
    <Typography sx={{ fontSize: '0.7rem', color: t.muted, mb: 1, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>
      {children}
    </Typography>
  );
}

function Chip({ t, children }) {
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center',
      px: 1.25, py: 0.4, borderRadius: 5,
      bgcolor: t.subtle, fontSize: '0.78rem', color: t.text,
    }}>
      {children}
    </Box>
  );
}
