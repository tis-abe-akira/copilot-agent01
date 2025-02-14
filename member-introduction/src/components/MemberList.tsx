import { FC } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { Member } from '../types/member';

interface Props {
  members: Member[];
  onMemberClick: (member: Member) => void;
  onDragEnd: (result: DropResult) => void;
}

export const MemberList: FC<Props> = ({ members, onMemberClick, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="members">
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ width: '100%', maxWidth: 800, margin: '0 auto' }}
          >
            {members.map((member, index) => (
              <Draggable key={member.id} draggableId={member.id} index={index}>
                {(provided) => (
                  <Card
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    sx={{ 
                      mb: 2, 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 6 }
                    }}
                    onClick={() => onMemberClick(member)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
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
                        <Box flex={1}>
                          <Typography variant="h6" component="div">
                            {member.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {member.introduction}
                          </Typography>
                          <Stack direction="row" spacing={1} mt={1}>
                            {member.tags.map((tag) => (
                              <Chip
                                key={tag.id}
                                label={tag.name}
                                size="small"
                                sx={{ backgroundColor: tag.color }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};