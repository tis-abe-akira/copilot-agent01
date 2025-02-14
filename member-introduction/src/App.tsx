import { useState } from 'react';
import { Box, Fab, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Member, Tag, CreateMemberInput, UpdateMemberInput } from './types/member';
import { MemberList } from './components/MemberList';
import { MemberDetailDialog } from './components/MemberDetailDialog';
import { MemberEditDialog } from './components/MemberEditDialog';
import { DropResult } from '@hello-pangea/dnd';

// サンプルデータ
const sampleTags: Tag[] = [
  { id: '1', name: '部長', color: '#FFB6C1' },
  { id: '2', name: '副部長', color: '#87CEEB' },
  { id: '3', name: '会計', color: '#98FB98' },
  { id: '4', name: 'プログラミング', color: '#DDA0DD' },
  { id: '5', name: 'デザイン', color: '#F0E68C' },
];

const sampleMembers: Member[] = [
  {
    id: '1',
    name: '山田太郎',
    iconUrl: 'https://i.pravatar.cc/150?img=1',
    introduction: 'プログラミング部の部長です！みんなで楽しくコードを書いていきましょう！',
    tags: [sampleTags[0], sampleTags[3]],
    isEditable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: '鈴木花子',
    iconUrl: 'https://i.pravatar.cc/150?img=2',
    introduction: 'デザインが大好きです。UIデザインを担当しています。',
    tags: [sampleTags[1], sampleTags[4]],
    isEditable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function App() {
  const [members, setMembers] = useState<Member[]>(sampleMembers);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | undefined>();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(members);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMembers(items);
  };

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const handleDelete = (member: Member) => {
    if (window.confirm('本当に削除しますか？')) {
      setMembers(members.filter(m => m.id !== member.id));
      setIsDetailOpen(false);
    }
  };

  const handleSave = (data: CreateMemberInput | UpdateMemberInput) => {
    if ('id' in data) {
      // 更新
      setMembers(members.map(member =>
        member.id === data.id
          ? {
              ...member,
              name: data.name ?? member.name,
              introduction: data.introduction ?? member.introduction,
              iconUrl: data.iconFile ? URL.createObjectURL(data.iconFile) : member.iconUrl,
              tags: data.tags ? data.tags.map(tagId => sampleTags.find(t => t.id === tagId)!).filter(Boolean) : member.tags,
              updatedAt: new Date(),
            }
          : member
      ));
    } else {
      // 新規作成
      const newMember: Member = {
        id: String(Date.now()),
        name: data.name,
        introduction: data.introduction,
        iconUrl: data.iconFile ? URL.createObjectURL(data.iconFile) : 'https://i.pravatar.cc/150',
        tags: data.tags.map(tagId => sampleTags.find(t => t.id === tagId)!).filter(Boolean),
        isEditable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMembers([...members, newMember]);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <MemberList
        members={members}
        onMemberClick={handleMemberClick}
        onDragEnd={handleDragEnd}
      />

      <MemberDetailDialog
        member={selectedMember}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MemberEditDialog
        open={isEditOpen}
        member={editingMember}
        tags={sampleTags}
        onClose={() => {
          setIsEditOpen(false);
          setEditingMember(undefined);
        }}
        onSave={handleSave}
      />

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => {
          setEditingMember(undefined);
          setIsEditOpen(true);
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default App;
