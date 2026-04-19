// src/lib/core/domain/user-profile.type.ts

export interface UserProfile {
  name: string;
  avatarSeed: string;
  age: string;
  financialGoal: string;
  riskTolerance: 'low' | 'medium' | 'high';
  themeColor?: string;
  hasAcceptedDecalogo?: boolean;
}
