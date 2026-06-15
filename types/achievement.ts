export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  imageUrl: string; // Google Drive share link
  driveLink: string; // Original Drive link
  createdAt: string;
  updatedAt: string;
}

export interface AchievementFormData {
  title: string;
  issuer: string;
  date: string;
  description: string;
  driveLink: string; // Google Drive share link for the certificate image
}

export interface ResumeConfig {
  driveLink: string;
  updatedAt: string;
}
