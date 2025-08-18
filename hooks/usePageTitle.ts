
import React, { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | TECH-NEST`;
  }, [title]);
};
