import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/Menu'; // 三横线图标

/**
 * 可排序的工具入口列表
 *
 * props:
 *   tools  - 工具对象数组（已按当前顺序排好）
 *   onReorder - 拖拽完成回调 (newOrderIds: string[]) => void
 *   onSelect - 点击入口回调 (toolId: string) => void
 */
export default function SortableToolList({ tools, onReorder, onSelect }) {
  const sensors = useSensors(
    // PointerSensor：桌面鼠标拖拽
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // TouchSensor：移动端触摸拖拽（关键！手机上靠这个）
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = tools.findIndex((t) => t.id === active.id);
    const newIdx = tools.findIndex((t) => t.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const newOrder = arrayMove(tools, oldIdx, newIdx).map((t) => t.id);
    onReorder(newOrder);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tools.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ p: 0.5 }}>
          {tools.map((tool) => (
            <SortableToolItem key={tool.id} tool={tool} onSelect={onSelect} />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}

// 单个可拖拽工具项
function SortableToolItem({ tool, onSelect }) {
  const theme = useTheme();
  const t = theme.palette._;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tool.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    // 拖拽时抬高层级 + 阴影
    zIndex: isDragging ? 10 : 'auto',
    boxShadow: isDragging ? theme.shadows[6] : 'none',
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 2,
        mx: 0.5,
        my: 0.25,
        bgcolor: isDragging ? t.subtle : 'transparent',
        transition: 'background-color 0.15s',
        '&:hover': { bgcolor: t.subtle },
      }}
    >
      {/* 点击主体 */}
      <ListItemButton
        onClick={() => onSelect(tool.id)}
        sx={{ borderRadius: 2, py: 1.25, flex: 1 }}
      >
        <ListItemIcon sx={{ minWidth: 40, color: t.accent, '& svg': { fontSize: 22 } }}>
          {tool.icon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 500, color: t.text }}>
              {tool.name}
            </Typography>
          }
          secondary={
            <Typography sx={{ fontSize: '0.72rem', color: t.muted }}>{tool.desc}</Typography>
          }
        />
      </ListItemButton>

      {/* 拖拽手柄：右侧，只有按住这里才能拖（避免误触影响点击） */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'grab',
          px: 1.25,
          py: 1.5,
          color: t.muted,
          '&:active': { cursor: 'grabbing', color: t.accent },
          touchAction: 'none', // 关键：让触摸拖拽不被浏览器滚动拦截
        }}
      >
        <DragHandleIcon sx={{ fontSize: 20 }} />
      </Box>
    </Box>
  );
}
