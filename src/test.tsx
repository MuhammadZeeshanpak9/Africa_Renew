import React from 'react';

const iconMap: Record<string, React.ElementType> = {
  Home: () => <div />
};

export function Test() {
  const Icon = iconMap['Home'];
  return <Icon className="w-8 h-8" />;
}
