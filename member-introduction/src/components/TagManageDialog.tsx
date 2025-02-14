import { FC, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Tag } from '../types/member';

interface Props {
  open: boolean;
  tags: Tag[];
  onClose: () => void;
  onSave: (tags: Tag[]) => void;
}

export const TagManageDialog: FC<Props> = ({
  open,
  tags: initialTags,
  onClose,
  onSave,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#FFB6C1');

  useEffect(() => {
    if (open) {
      setTags(initialTags);
    }
  }, [open, initialTags]);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    if (editingTag) {
      // 編集モード
      setTags(tags.map(tag =>
        tag.id === editingTag.id
          ? { ...tag, name: newTagName, color: newTagColor }
          : tag
      ));
      setEditingTag(null);
    } else {
      // 新規追加モード
      const newTag: Tag = {
        id: String(Date.now()),
        name: newTagName,
        color: newTagColor,
      };
      setTags([...tags, newTag]);
    }

    setNewTagName('');
    setNewTagColor('#FFB6C1');
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
  };

  const handleDeleteTag = (tagId: string) => {
    if (window.confirm('本当にこのタグを削除しますか？')) {
      setTags(tags.filter(tag => tag.id !== tagId));
    }
  };

  const handleClose = () => {
    setNewTagName('');
    setNewTagColor('#FFB6C1');
    setEditingTag(null);
    onClose();
  };

  const handleSave = () => {
    onSave(tags);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>タグの管理</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="タグ名"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              fullWidth
            />
            <MuiColorInput
              value={newTagColor}
              onChange={(color) => setNewTagColor(color)}
              format="hex"
            />
            <Button
              variant="contained"
              onClick={handleAddTag}
              disabled={!newTagName.trim()}
            >
              {editingTag ? '更新' : '追加'}
            </Button>
          </Stack>

          <List>
            {tags.map((tag) => (
              <ListItem
                key={tag.id}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                }}
              >
                <ListItemText
                  primary={tag.name}
                  sx={{ flex: 1 }}
                />
                <div
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: tag.color,
                    borderRadius: '50%',
                    marginRight: 8,
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleEditTag(tag)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button onClick={handleSave} variant="contained">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};