import React from 'react';

export interface StatCardProps {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  difference?: number;
  positive?: boolean;
  color?: string;
  img: any;
}
