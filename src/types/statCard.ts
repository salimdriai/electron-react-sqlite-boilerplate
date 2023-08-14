import React from 'react';

export interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  difference?: number;
  positive?: boolean;
  color?: string;
}
