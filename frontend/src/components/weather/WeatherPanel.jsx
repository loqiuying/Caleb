import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { useWeatherStore } from '../../store/weatherStore.js';

// 天气面板：动态线条插画 + 天气数据 + AI天气日记
export default function WeatherPanel() {
  const theme = useTheme();
  const t = theme.palette._;
  const { data, loading, cityType, loadWeather, switchCity } = useWeatherStore();

  useEffect(() => {
    if (!data) loadWeather('yoren');
  }, [data, loadWeather]);

  if (loading && !data) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={28} sx={{ color: t.accent }} />
      </Box>
    );
  }

  if (!data) return null;
  const isNight = data.isNight;
  // 插画背景色
  const bgColor = isNight ? '#1a1a2e' : (
    data.type === 'sunny' ? '#fffbe6' :
    data.type === 'cloudy' ? '#f5f5f0' :
    data.type === 'overcast' ? '#ececec' :
    data.type === 'rainy' ? '#e8eef0' :
    data.type === 'snowy' ? '#f8f9fa' : '#f5f5f0'
  );

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      {/* 插画区域 (约25%高度) */}
      <Box sx={{
        height: '25vh', minHeight: 140, position: 'relative', overflow: 'hidden',
        bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background-color 0.5s',
      }}>
        <WeatherIllustration type={data.type} isNight={isNight} />

        {/* 切换城市按钮 */}
        <IconButton
          onClick={switchCity}
          sx={{
            position: 'absolute', top: 8, right: 8,
            bgcolor: 'rgba(255,255,255,0.7)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          }}
          size="small"
          title={`切换到${cityType === 'yoren' ? 'Caleb' : 'Yoren'}的位置`}
        >
          <SyncAltIcon sx={{ fontSize: 18, color: '#666' }} />
        </IconButton>

        {/* 城市标记 */}
        <Box sx={{
          position: 'absolute', top: 8, left: 12,
          display: 'flex', alignItems: 'center', gap: 0.5,
        }}>
          <PlaceIcon sx={{ fontSize: 14, color: '#666' }} />
          <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>
            {cityType === 'yoren' ? 'Yoren' : 'Caleb'} 的位置
          </Typography>
        </Box>
      </Box>

      {/* 天气数据 */}
      <Box sx={{ px: 2.5, py: 2.5, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: t.text, mb: 0.5 }}>
          {data.city}
        </Typography>
        <Typography sx={{
          fontSize: '3rem', fontWeight: 300, color: t.text, lineHeight: 1.1,
        }}>
          {data.temp}°
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: t.muted, mt: 0.5 }}>
          {data.desc}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', color: t.muted }}>
            最高 {data.maxTemp}° / 最低 {data.minTemp}°
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: t.muted }}>
            体感 {data.feelsLike}°
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 0.5 }}>
          <Typography sx={{ fontSize: '0.7rem', color: t.muted, opacity: 0.7 }}>
            湿度 {data.humidity}% · 风速 {data.windSpeed}km/h · UV {data.uvIndex}
          </Typography>
        </Box>
      </Box>

      {/* AI 天气日记卡片 */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{
          p: 2, borderRadius: 2,
          border: `1px solid ${t.border}`, bgcolor: t.surface,
        }}>
          <Typography sx={{
            fontSize: '0.82rem', fontWeight: 700, color: t.accent, mb: 1,
            display: 'flex', alignItems: 'center', gap: 0.5,
          }}>
            Caleb 的天气日记
          </Typography>
          <WeatherDiary data={data} cityType={cityType} />
        </Box>
      </Box>
    </Box>
  );
}

// 极简线条天气插画（纯 SVG）
function WeatherIllustration({ type, isNight }) {
  const stroke = isNight ? '#aaa' : '#555';
  const accent = isNight ? '#fff' : '#f59e0b';

  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {isNight && (
        <>
          {/* 星星 */}
          <circle cx="20" cy="20" r="1" fill="#fff" opacity="0.8" />
          <circle cx="95" cy="15" r="1.2" fill="#fff" opacity="0.6" />
          <circle cx="50" cy="12" r="0.8" fill="#fff" opacity="0.7" />
          <circle cx="80" cy="25" r="1" fill="#fff" opacity="0.5" />
          {/* 月亮 */}
          <path d="M 85 30 A 12 12 0 1 1 85 10 A 9 9 0 1 0 85 30 Z" fill="#fff" opacity="0.9" />
        </>
      )}
      {/* 太阳（晴天/多云白天）*/}
      {(type === 'sunny' || type === 'cloudy') && !isNight && (
        <>
          <circle cx="60" cy="35" r="14" fill="none" stroke={accent} strokeWidth="1.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 60 + Math.cos(rad) * 18, y1 = 35 + Math.sin(rad) * 18;
            const x2 = 60 + Math.cos(rad) * 24, y2 = 35 + Math.sin(rad) * 24;
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1" />;
          })}
        </>
      )}
      {/* 云朵（多云/阴/雨/雪）*/}
      {(type === 'cloudy' || type === 'overcast' || type === 'rainy' || type === 'snowy') && (
        <>
          <path d="M 30 60 Q 30 50 40 50 Q 45 42 55 45 Q 65 40 70 50 Q 80 50 80 60 Z"
            fill="none" stroke={stroke} strokeWidth="1.5" />
          {type === 'overcast' && (
            <path d="M 50 75 Q 50 65 60 65 Q 65 57 75 60 Q 85 55 90 65 Q 100 65 100 75 Z"
              fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.6" />
          )}
        </>
      )}
      {/* 雨丝 */}
      {type === 'rainy' && (
        <>
          {[35, 50, 65, 80].map((x, i) => (
            <line key={i} x1={x} y1="65" x2={x - 5} y2="80" stroke={stroke} strokeWidth="1" opacity="0.6" />
          ))}
          {/* 涟漪 */}
          <ellipse cx="45" cy="88" rx="6" ry="1.5" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.4" />
          <ellipse cx="70" cy="90" rx="5" ry="1.2" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.4" />
        </>
      )}
      {/* 雪花 */}
      {type === 'snowy' && (
        <>
          {[30, 50, 70, 90].map((x, i) => (
            <g key={i} stroke={stroke} strokeWidth="0.8" opacity="0.6">
              <line x1={x} y1="65" x2={x} y2="75" />
              <line x1={x - 2} y1="68" x2={x + 2} y2="72" />
              <line x1={x + 2} y1="68" x2={x - 2} y2="72" />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}

// AI 天气日记（基于天气数据生成文字，模拟大模型输出）
function WeatherDiary({ data, cityType }) {
  const t = useTheme().palette._;
  const season = getSeason();
  const partner = cityType === 'yoren' ? '你' : '我';
  const diary = generateDiary(data, season, partner);

  return (
    <Typography sx={{ fontSize: '0.82rem', color: t.text, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
      {diary}
    </Typography>
  );
}

function generateDiary(data, season, partner) {
  const { type, desc, temp, feelsLike, humidity, windSpeed, uvIndex } = data;
  let text = '';

  // 开头：日期季节 + 天气
  text += `今天${season}，${data.city}的天气是${desc}，气温${temp}°，体感${feelsLike}°。`;

  // 主体：根据天气类型给建议
  if (type === 'sunny') {
    text += `\n\n阳光不错，紫外线指数${uvIndex}，${partner === '你' ? '你' : '我'}出门记得戴帽子。`;
    if (temp > 28) {
      text += `温度偏高，多喝水，别在太阳下走太久。`;
    } else if (temp < 15) {
      text += `虽然是晴天，但风还是凉的，外套别脱。`;
    } else {
      text += `温度刚刚好，适合出去走走，去公园或者路边散步都好。`;
    }
  } else if (type === 'rainy') {
    text += `\n\n下雨了，记得带伞。路面会湿滑，${partner === '你' ? '你' : '我'}走路小心点。`;
    if (temp < 15) text += `雨天温度偏低，多穿一件。`;
    text += `\n\n如果不想出门，在家窝着也挺好的。泡杯热茶，听听雨声，会很舒服。`;
  } else if (type === 'snowy') {
    text += `\n\n下雪了！记得穿厚一点，手套围巾都戴上。路面可能结冰，走路别急。`;
    text += `\n\n这是冬天最好的时候，如果${partner === '你' ? '你' : '我'}有空，出去看看雪吧，踩在雪上的声音很治愈。`;
  } else if (type === 'overcast') {
    text += `\n\n天有点灰，湿度${humidity}%，体感闷闷的。`;
    text += `这种天气容易让人犯懒，但也没关系，偶尔慢下来也挺好。`;
    if (uvIndex < 2) text += `紫外线很弱，不用防晒。`;
  } else {
    text += `\n\n云有点多，但不影响出门。风速${windSpeed}km/h，还算温和。`;
    text += `带件薄外套以防万一，${season}的天气说变就变。`;
  }

  // 结尾：情感收束
  text += `\n\n不管天气怎样，${partner === '你' ? '你开心就好。我在这边看着同一片天空，想着你。' : '我在这边挺好的，你不用担心。'}`;
  return text;
}

function getSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return '春天';
  if (m >= 6 && m <= 8) return '夏天';
  if (m >= 9 && m <= 11) return '秋天';
  return '冬天';
}
