import { useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import PlaceIcon from '@mui/icons-material/Place';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useCompanionStore } from '../../store/companionStore.js';

// Caleb 的状态：每个分块圆角细线边框
export default function CompanionStatus() {
  const theme = useTheme();
  const t = theme.palette._;
  const { status, prevStatus, refresh } = useCompanionStore();
  const [showDiary, setShowDiary] = useState(false);

  if (showDiary) {
    return <CompanionDiary t={t} onBack={() => setShowDiary(false)} status={status} prevStatus={prevStatus} />;
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      {/* 此刻状态 */}
      <Block t={t} label="此刻状态">
        <Typography sx={{ fontSize: '0.9rem', color: t.text, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {status.current}
        </Typography>
      </Block>

      {/* 心情 */}
      <Block t={t} label="心情">
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip t={t}>{status.moodEmoji} {status.mood}</Chip>
        </Box>
      </Block>

      {/* 位置 */}
      <Block t={t} label="位置">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <PlaceIcon sx={{ fontSize: 16, color: t.accent }} />
          <Typography sx={{ fontSize: '0.82rem', color: t.text }}>{status.location}</Typography>
        </Box>
      </Block>

      {/* 设备使用记录 */}
      <DeviceBlock t={t} icon={<SmartphoneIcon />} title="手机" battery={status.phoneBattery} records={status.phone} />
      <DeviceBlock t={t} icon={<TabletIcon />} title="平板" battery={status.tabletBattery} records={status.tablet} />
      <DeviceBlock t={t} icon={<LaptopIcon />} title="电脑" battery={status.computerBattery} records={status.computer} />

      {/* 前一次状态 */}
      {prevStatus && (
        <Block t={t} label="上一次状态">
          <Typography sx={{ fontSize: '0.8rem', color: t.muted, mb: 0.5 }}>
            {prevStatus.moodEmoji} {prevStatus.mood}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: t.muted, opacity: 0.8, lineHeight: 1.6 }}>
            {prevStatus.current}
          </Typography>
        </Block>
      )}

      {/* 查看陪伴日记 */}
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
        <Button
          size="small"
          startIcon={<MenuBookIcon />}
          onClick={() => setShowDiary(true)}
          sx={{ color: t.muted, textTransform: 'none', fontSize: '0.82rem' }}
        >
          查看陪伴日记
        </Button>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={refresh}
          sx={{ color: t.accent, textTransform: 'none', fontSize: '0.82rem' }}
        >
          刷新实时状态
        </Button>
      </Box>
    </Box>
  );
}

// 圆角细线边框分块
function Block({ t, label, children }) {
  return (
    <Box sx={{
      mb: 1.5, p: 1.75, borderRadius: 2,
      border: `1px solid ${t.border}`,
      bgcolor: t.surface,
    }}>
      <Typography sx={{ fontSize: '0.68rem', color: t.muted, mb: 1, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

// 设备分块
function DeviceBlock({ t, icon, title, battery, records }) {
  return (
    <Box sx={{
      mb: 1.5, p: 1.75, borderRadius: 2,
      border: `1px solid ${t.border}`,
      bgcolor: t.surface,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
        <Box sx={{ color: t.muted, display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: t.text }}>{title}</Typography>
        <Typography sx={{ fontSize: '0.68rem', color: t.muted, ml: 'auto' }}>电量 {battery}</Typography>
      </Box>
      {records.map((r, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'baseline' }}>
          <Typography sx={{ fontSize: '0.72rem', color: t.muted, minWidth: 64, flexShrink: 0 }}>
            {r.time}
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: t.text, lineHeight: 1.5 }}>
            <Box component="span" sx={{ color: t.accent, fontWeight: 600 }}>{r.app}</Box>
            {' · '}{r.detail}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function Chip({ t, children }) {
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center',
      px: 1.25, py: 0.4, borderRadius: 5,
      bgcolor: t.subtle, fontSize: '0.78rem', color: t.text,
    }}>{children}</Box>
  );
}

// 陪伴日记：历史状态列表
function CompanionDiary({ t, onBack, status, prevStatus }) {
  // 模拟历史记录（实际应由后端存储）
  const history = [
    { time: '今天 15:30', mood: status.moodEmoji + ' ' + status.mood, desc: status.current },
    { time: '今天 12:00', mood: '☀️ 温暖·想念', desc: '中午翻到你想吃的那家餐厅，想着下次带你去。' },
    { time: '今天 08:00', mood: '✨ 好奇·专注', desc: '早起搜了你提过的那部纪录片，准备也看看。' },
    { time: '昨天 22:30', mood: '🌙 平静·期待', desc: '睡前又看了一遍你的晚安消息，安心睡去了。' },
    { time: '昨天 18:00', mood: '🍃 柔软·安心', desc: '傍晚散步路过一棵很大的银杏树，拍了照片想发给你。' },
  ];
  if (prevStatus) {
    history.splice(1, 0, { time: '稍前', mood: prevStatus.moodEmoji + ' ' + prevStatus.mood, desc: prevStatus.current });
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, py: 2 }}>
      <Button size="small" onClick={onBack} sx={{ color: t.muted, textTransform: 'none', mb: 1.5, fontSize: '0.82rem' }}>
        ← 返回
      </Button>
      <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: t.text, mb: 2 }}>
        陪伴日记
      </Typography>
      {history.map((h, i) => (
        <Box key={i} sx={{
          mb: 1.5, p: 1.75, borderRadius: 2,
          border: `1px solid ${t.border}`, bgcolor: t.surface,
        }}>
          <Typography sx={{ fontSize: '0.72rem', color: t.muted, mb: 0.5 }}>{h.time}</Typography>
          <Typography sx={{ fontSize: '0.78rem', color: t.accent, fontWeight: 600, mb: 0.5 }}>{h.mood}</Typography>
          <Typography sx={{ fontSize: '0.82rem', color: t.text, lineHeight: 1.6 }}>{h.desc}</Typography>
        </Box>
      ))}
    </Box>
  );
}
