import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changeField, initializeForm, signup } from '../../modules/auth';
import { validation } from '../../lib/util';
import AuthForm from '../../components/auth/AuthForm';

const SignupForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, loading } = useSelector(
    ({ auth, loading }) => ({
      form: auth.signup,
      auth: auth.auth,
      authError: auth.authError,
      loading: loading['auth/SIGNUP'],
    }),
  );

  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    if (error) {
      setError(null);
    }
    dispatch(
      changeField({
        form: 'signup',
        key: name,
        value,
      }),
    );
  };

  // NOTE: 에러 핸들링 hook 알아보기
  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { uid, passwd, passwdConfirm, name } = form;
    if ([uid, passwd, passwdConfirm, name].includes('')) {
      setError('빈 칸을 모두 입력하세요.');
      return;
    }
    if (validation('email', uid)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (validation('password', passwd)) {
      setError('비밀번호는 문자 또는 숫자 6~12자리 이어야합니다.');
      dispatch(
        changeField({
          form: 'signup',
          key: 'passwd',
          value: '',
        }),
      );
      dispatch(
        changeField({
          form: 'signup',
          key: 'passwdConfirm',
          value: '',
        }),
      );
      return;
    }
    if (passwd !== passwdConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      dispatch(
        changeField({
          form: 'signup',
          key: 'passwd',
          value: '',
        }),
      );
      dispatch(
        changeField({
          form: 'signup',
          key: 'passwdConfirm',
          value: '',
        }),
      );
      return;
    }
    if (name.length < 3) {
      setError('닉네임은 세 자리 이상이어야 합니다.');
      dispatch(
        changeField({
          form: 'signup',
          key: 'name',
          value: '',
        }),
      );
      return;
    }
    setError(null);
    dispatch(
      signup({
        uid,
        passwd,
        name,
      }),
    );
  };

  // 컴포넌트가 처음 렌더링 될 때 form을 초기화함
  useEffect(() => {
    dispatch(initializeForm('signup'));
  }, [dispatch]);

  // TODO: []개인정보 이용 동의, 약관 동의 체크 버튼 추가 후 동의 여부 확인
  // TODO: []회원가입 성공 후 로그인 페이지로 이동하기 전 성공했다는 메시지 보여주기
  // NOTE: 회원가입 API response에 토큰이 없어 성공시에 로그인 페이지로 이동 시킴
  useEffect(() => {
    setError(null);
    if (authError) {
      if (authError.response.status === 403) {
        setError('이미 사용중인 이메일입니다.');
        return;
      }
      console.log(authError);
      setError('회원가입에 실패하였습니다.');
      return;
    }
    if (auth) {
      history.push('/signin');
    }
  }, [auth, authError, history]);

  return (
    <AuthForm
      type="signup"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
      loading={loading}
    />
  );
};

export default withRouter(SignupForm);
