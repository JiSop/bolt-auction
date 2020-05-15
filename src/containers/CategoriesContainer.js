import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getCats,
  selectCategory,
  activateSub,
  deactivateSub,
} from '../modules/category';
import Categories from '../components/Categories';

const CategoriesContainer = ({
  menu,
  // size,
}) => {
  const dispatch = useDispatch();
  const { categories, error, activeCategory } = useSelector(({ category }) => ({
    categories: category.categories,
    error: category.categoryLoadError,
    activeCategory: category.activeSupCategory,
  }));

  useEffect(() => {
    if (categories?.length === 0) dispatch(getCats());
  }, [categories, dispatch]);

  const onCategoryClick = (id, name) => {
    menu.current.style.display = 'none';
    dispatch(selectCategory(id, name));
  };

  const onCategoryEnter = (e, id) => {
    e.persist();
    dispatch(activateSub(id));
  };

  const onCategoryLeave = e => {
    e.persist();
    dispatch(deactivateSub());
  };

  return (
    <Categories
      // width={size} // 이걸 왜 사용하는지 모르겠다 ㅠㅠ
      error={error}
      categories={categories}
      activeId={activeCategory}
      onCategoryEnter={onCategoryEnter}
      onCategoryLeave={onCategoryLeave}
      onCategoryClick={onCategoryClick}
    />
  );
};

export default CategoriesContainer;
