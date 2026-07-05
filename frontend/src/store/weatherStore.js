import { create } from 'zustand';
import { useCompanionStore } from './companionStore.js';

// wttr.in 免费 API：?format=j1 返回 JSON
// 转换城市名为拼音/英文（wttr.in 不支持中文）
const CITY_MAP = {
  '上海·徐汇区': 'Shanghai', '上海·浦东新区': 'Shanghai', '上海': 'Shanghai',
  '北京': 'Beijing', '北京·朝阳区': 'Beijing',
  '广州': 'Guangzhou', '深圳': 'Shenzhen', '杭州': 'Hangzhou',
  '成都': 'Chengdu', '武汉': 'Wuhan', '南京': 'Nanjing',
  '西安': 'Xian', '重庆': 'Chongqing', '苏州': 'Suzhou',
  '天津': 'Tianjin', '长沙': 'Changsha', '青岛': 'Qingdao',
};

function toQuery(city) {
  for (const key of Object.keys(CITY_MAP)) {
    if (city.includes(key) || city === key) return CITY_MAP[key];
  }
  // 默认用原名（英文城市名直接可用）
  return city.replace(/[\u4e00-\u9fa5·]/g, '').trim() || 'Shanghai';
}

// wttr.in 天气码转中文描述 + 类型
function parseWeather(code) {
  const c = parseInt(code);
  if (c === 113) return { desc: '晴', type: 'sunny' };
  if (c === 116) return { desc: '多云', type: 'cloudy' };
  if (c >= 119 && c <= 122) return { desc: '阴', type: 'overcast' };
  if (c >= 143 && c <= 260) return { desc: '雾', type: 'overcast' };
  if (c >= 263 && c <= 308) return { desc: '雨', type: 'rainy' };
  if (c >= 311 && c <= 320) return { desc: '大雨', type: 'rainy' };
  if (c >= 321 && c <= 350) return { desc: '阵雨', type: 'rainy' };
  if (c >= 362) return { desc: '雪', type: 'snowy' };
  return { desc: '多云', type: 'cloudy' };
}

export const useWeatherStore = create((set, get) => ({
  data: null,      // 当前天气数据
  loading: false,
  error: null,
  currentCity: '', // 当前查询的城市名（中文）
  cityType: 'yoren', // 'yoren' or 'caleb'

  // 加载天气（cityType: 'yoren' | 'caleb'）
  loadWeather: async (cityType) => {
    const { addresses } = useCompanionStore.getState();
    const city = cityType === 'caleb' ? addresses.caleb : addresses.yoren;
    const query = toQuery(city);
    set({ loading: true, error: null, currentCity: city, cityType });
    try {
      const res = await fetch(`https://wttr.in/${query}?format=j1`);
      if (!res.ok) throw new Error('天气查询失败');
      const json = await res.json();
      const cur = json.current_condition?.[0] || {};
      const today = json.weather?.[0] || {};
      const weather = parseWeather(cur.weatherCode);
      // 判断夜晚（18:00-06:00）
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;
      set({
        loading: false,
        data: {
          city,
          temp: cur.temp_C ? parseInt(cur.temp_C) : null,
          feelsLike: cur.FeelsLikeC ? parseInt(cur.FeelsLikeC) : null,
          desc: weather.desc,
          type: weather.type,
          isNight,
          maxTemp: today.maxtempC ? parseInt(today.maxtempC) : null,
          minTemp: today.mintempC ? parseInt(today.mintempC) : null,
          humidity: cur.humidity || '',
          windSpeed: cur.windspeedKmph || '',
          uvIndex: cur.uvIndex || '',
          visibility: cur.visibility || '',
        },
      });
    } catch (error) {
      set({ loading: false, error: error.message });
      // 失败时用模拟数据兜底
      set({
        data: {
          city, temp: 22, feelsLike: 21, desc: '多云', type: 'cloudy',
          isNight: new Date().getHours() >= 18 || new Date().getHours() < 6,
          maxTemp: 25, minTemp: 15, humidity: '65', windSpeed: '12', uvIndex: '3', visibility: '10',
        },
        error: null,
      });
    }
  },

  // 切换城市
  switchCity: () => {
    const next = get().cityType === 'yoren' ? 'caleb' : 'yoren';
    get().loadWeather(next);
  },
}));
