export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Member {
  id: string;
  name: string;
  iconUrl: string;
  introduction: string;
  tags: Tag[];
  isEditable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberInput {
  name: string;
  introduction: string;
  iconFile?: File;
  tags: string[];
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
  id: string;
}