import { useEffect } from 'react';
import { useCategoriesStore } from '../store/categories.store';

export const useCategories = () => {
  const { categories, loading, error, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    if (categories === null) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  return { categories, loading, error, fetchCategories };
};
