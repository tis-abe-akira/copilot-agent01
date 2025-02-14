import { FC, useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stack,
  Autocomplete,
  Chip
} from '@mui/material';
import { Member, CreateMemberInput, UpdateMemberInput, Tag } from '../types/member';

interface Props {
  open: boolean;
  member?: Member;
  tags: Tag[];
  onClose: () => void;
  onSave: (data: CreateMemberInput | UpdateMemberInput) => void;
}

export const MemberEditDialog: FC<Props> = ({
  open,
  member,
  tags,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    // ダイアログが開かれたときに初期値をセット
    if (open) {
      setName(member?.name ?? '');
      setIntroduction(member?.introduction ?? '');
      setSelectedTags(member?.tags ?? []);
      setPreviewUrl(member?.iconUrl ?? '');
    }
  }, [open, member]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const data: CreateMemberInput | UpdateMemberInput = {
      ...(member ? { id: member.id } : {}),
      name,
      introduction,
      tags: selectedTags.map(tag => tag.id),
      ...(fileInputRef.current?.files?.[0] ? { iconFile: fileInputRef.current.files[0] } : {})
    };
    onSave(data);
    onClose();
  };

  const handleClose = () => {
    // フォームの状態をリセット
    setName('');
    setIntroduction('');
    setSelectedTags([]);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{member ? 'メンバー情報編集' : '新規メンバー登録'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box textAlign="center">
            <Box
              component="img"
              src={previewUrl || '/default-avatar.png'}
              alt="アイコン"
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                objectFit: 'cover',
                mb: 1
              }}
            />
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              画像を選択
            </Button>
          </Box>

          <TextField
            label="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="自己紹介"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
          />

          <Autocomplete
            multiple
            value={selectedTags}
            onChange={(_, newValue) => setSelectedTags(newValue)}
            options={tags}
            getOptionLabel={(option) => option.name}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                  sx={{ backgroundColor: option.color }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="タグ" placeholder="タグを選択" />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button onClick={handleSave} variant="contained" disabled={!name || !introduction}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};