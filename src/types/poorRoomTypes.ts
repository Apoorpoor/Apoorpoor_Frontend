export type Badge = {
  badgeImage: string;
  badgeNum: number;
  badgeTitle: string;
  createdAt: string;
  id: number;
  modifiedAt: string;
};

export type BadgeDes = {
  title: string;
  name: string;
  description: string;
  sub_description: string;
  n_description: string;
};

export type RecoilBadge = {
  title: string;
  name: string;
  n_description: string;
};

export interface MyData {
  beggarId: string;
  userId: string;
  nickname: string;
  exp: number;
  point: number;
  level: number;
  description: string;
  age: number;
  gender: string;
  topImage: string;
  bottomImage: string;
  shoesImage: string;
  accImage: string;
  customImage: string;
  badgeList: Badge[];
}

export interface MyPointData {
  point_id: number;
  pointDescription: string;
  earnedPoint: number | null;
  usedPoints: number | null;
  beggar_id: number;
  createdAt: string;
}

export interface MyPoorData {
  beggarId: string;
  userId: string;
  nickname: string;
  exp: number;
  point: number;
  level: number;
  description: string;
  age: number;
  gender: string;
  topImage: string;
  bottomImage: string;
  accImage: string;
  customImage: string;
}

export interface PoorItem {
  itemNum: number;
  itemName: string;
  itemPrice: number;
  itemState: string;
  itemType: string;
  levelLimit: number;
  itemImage: string;
}