import { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Member } from '../types/member';

interface Props {
  member: Member | null;
  open: boolean;
  onClose: () => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export const MemberDetailDialog: FC<Props> = ({
  member,
  open,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!member) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          src={member.iconUrl}
          alt={member.name}
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        <Typography variant="h6">{member.name}</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">{member.introduction}</Typography>
          <Stack direction="row" spacing={1}>
            {member.tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                sx={{ backgroundColor: tag.color }}
              />
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      {member.isEditable && (
        <DialogActions>
          <Button
            startIcon={<EditIcon />}
            onClick={() => onEdit(member)}
            color="primary"
          >
            編集
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(member)}
            color="error"
          >
            削除
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};