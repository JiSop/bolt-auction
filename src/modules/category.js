import { createAction, handleActions } from 'redux-actions';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import * as API from '../lib/api';
import createRequestSaga from '../lib/createRequestSaga';

// Action Types
// 카테고리 받아오기
const GET_CATS = 'category/GET_CATS';
const GET_CATS_SUCCESS = 'category/GET_CATS_SUCCESS';
const GET_CATS_FAILURE = 'category/GET_CATS_FAILURE';

// Sub 카테고리 활성화
const ACTIVATE_SUB = 'category/ACTIVE_SUB';
const DEACTIVATE_SUB = 'category/DEACTIVATE_SUB';

// 카테고리 선택
const SELECT_CATEGORY = 'category/SELECT_CATEGORY';

// 카테고리 선택으로 아이템 조회
const GET_CATEGORY_ITEM = 'item/GET_CATEGORY_ITEM';
const GET_CATEGORY_ITEM_SUCCESS = 'item/GET_CATEGORY_ITEM_SUCCESS';

const INITIALIZE_CATEGORY_ITEMS = 'category/INITIALIZE_CATEGORY_ITEMS';

// Action Creators
export const getCats = createAction(GET_CATS);
export const activateSub = createAction(ACTIVATE_SUB, id => id);
export const deactivateSub = createAction(DEACTIVATE_SUB);
export const selectCategory = createAction(SELECT_CATEGORY, (id, name) => ({
  id,
  name,
}));
export const getCategoryItems = createAction(
  GET_CATEGORY_ITEM,
  (id, filter = null) => ({ id, filter }),
);

export const initializeCategoryItems = createAction(INITIALIZE_CATEGORY_ITEMS);

// Action Saga
const getCatsSaga = createRequestSaga(GET_CATS, API.getCategories);
const getCategoryItemSaga = createRequestSaga(
  GET_CATEGORY_ITEM,
  API.getCategoryItems,
);

// rootSaga에 전달할 Saga
export function* categorySaga() {
  yield takeEvery(GET_CATS, getCatsSaga);
  yield takeLatest(GET_CATEGORY_ITEM, getCategoryItemSaga);
}

// Initial State
const initialState = {
  categories: [],
  categoryLoadError: false,
  activeSupCategory: null,
  selectedCategory: null,
  categoryItems: [],
};

// Reducer
const category = handleActions(
  {
    [GET_CATS_SUCCESS]: (state, action) => ({
      ...state,
      categories: action.payload,
      categoryLoadError: false,
    }),
    [GET_CATS_FAILURE]: (state, action) => ({
      ...state,
      categoryLoadError: true,
    }),
    [ACTIVATE_SUB]: (state, action) => ({
      ...state,
      activeSupCategory: action.payload,
    }),
    [DEACTIVATE_SUB]: (state, action) => ({
      ...state,
      activeSupCategory: null,
    }),
    [SELECT_CATEGORY]: (state, action) => ({
      ...state,
      selectedCategory: { id: action.payload.id, name: action.payload.name },
    }),
    [GET_CATEGORY_ITEM_SUCCESS]: (state, action) => ({
      ...state,
      categoryItems: action.payload,
    }),
    [INITIALIZE_CATEGORY_ITEMS]: state => ({
      ...state,
      categoryItems: [],
    }),
  },
  initialState,
);

export default category;
