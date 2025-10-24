import { useCallback, useEffect } from 'react';
import { useCategoriesStore } from '../store/categories.store';

export const useCategories = () => {
  const { categories, loading, error, fetchCategories } = useCategoriesStore();

  const loadCategories = useCallback(async () => {
    if (categories === null || categories.length === 0) {
      await fetchCategories();
    }
  }, [fetchCategories]);

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, loading, error, loadCategories, fetchCategories };
};
