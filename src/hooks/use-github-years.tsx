import { useMemo } from 'react';

/**
 *
 * @description An array of github years since its founding: 2008
 */
const useGitHubYears = () => {
  const years = useMemo(() => {
    let currentYear = new Date().getFullYear();
    const _years = [currentYear];

    while (currentYear !== 2008) {
      _years.push(--currentYear);
    }

    return _years;
  }, []);

  return years;
};

export default useGitHubYears;
