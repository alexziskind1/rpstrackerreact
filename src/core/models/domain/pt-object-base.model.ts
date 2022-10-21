export type PtObjectBase = {
    id: number;
    title?: string;
    dateCreated: Date;
    dateModified: Date;
    dateDeleted?: Date;
}

export type PtObjectBaseServer = Omit<PtObjectBase, 'dateCreated' | 'dateModified' | 'dateDeleted'> & {
    dateCreated: string;
    dateModified: string;
    dateDeleted?: string;
  };
