import React from "react";

export interface VirtueScrollProps<T> {
  items: T[];
  itemsCount: number;
  buffer?: number;
  itemHeight: number;
  renderItem: (data: T, index: number) => React.ReactNode;
}

export interface IndexVisible {
  start: number;
  end: number;
}