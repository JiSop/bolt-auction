import { createAction, handleActions } from 'redux-actions';
import createRequestSaga from '../lib/createRequestSaga';
import { takeLatest } from 'redux-saga/effects';
import produce from 'immer';
import * as API from '../lib/api';

// SECTION : Action Types
const CHANGE_FIELD = 'sell/CHANGE_FIELD';
const CHANGE_FILE = 'sell/HANDLE_FILE';
const INITIALIZE_FORM = 'sell/INITIALIZE_FORM'; // 모든 내용 초기화

const SELL_PRODUCT = 'sell/SELL_PRODUCT';
const SELL_PRODUCT_SUCCESS = 'sell/SELL_PRODUCT_SUCCESS';
const SELL_PRODUCT_FAILURE = 'sell/SELL_PRODUCT_FAILURE';

// SECTION : Action Creators
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));
// NOTE: changeField를 사용해서 반영해도 되지만 따로 액션을 분리하는게 가독성이 좋은것 같아 추가
export const changeFile = createAction(CHANGE_FILE, value => value);
export const initializeForm = createAction(INITIALIZE_FORM);

// FIXME: calEndTime() 어디서 실행 해야하는지 다시 고려하기
export const sellProduct = createAction(
  SELL_PRODUCT,
  ({
    categoryId,
    name,
    startPrice,
    quickPrice,
    minBidPrice,
    description,
    endDt,
    images,
  }) => ({
    categoryId,
    name,
    startPrice,
    quickPrice,
    minBidPrice,
    description,
    endDt,
    images,
  }),
);

// SECTION : 각 action에 대한 saga
const uploadProductSaga = createRequestSaga(SELL_PRODUCT, API.uploadProduct);

// SECTION : rootSaga에 전달할 각 action에 대한 saga
export function* sellSaga() {
  yield takeLatest(SELL_PRODUCT, uploadProductSaga);
}

// SECTION : Initial State
const initialState = {
  sellForm: {
    supCategoryId: '',
    categoryId: '',
    name: '',
    quickPrice: '',
    startPrice: '',
    minBidPrice: '',
    description: '',
    endDt: '',
    images: [],
  },
  itemId: null,
  error: null,
};

// SECTION : Reducer
const sell = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { key, value } }) =>
      produce(state, draft => {
        draft.sellForm[key] = value;
      }),
    [CHANGE_FILE]: (state, { payload: value }) =>
      produce(state, draft => {
        draft.sellForm.images = value;
      }),
    [INITIALIZE_FORM]: () => initialState,
    [SELL_PRODUCT_SUCCESS]: (state, { payload: { itemId } }) => ({
      ...state,
      itemId,
    }),
    [SELL_PRODUCT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState,
);

export default sell;
