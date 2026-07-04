import { useRef, useEffect } from 'react';

// 自动滚动到底部的 hook
// deps：依赖项数组，变化时滚动到底部
export function useAutoScroll(deps = []) {
  const scrollRef = useRef(null); // 滚动容器
  const bottomRef = useRef(null); // 底部锚点

  useEffect(() => {
    const bottom = bottomRef.current;
    if (bottom) {
      // 使用 scrollIntoView 平滑滚动到底部
      bottom.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { scrollRef, bottomRef };
}
