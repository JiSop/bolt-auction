import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';

import CategoriesContainer from '../containers/CategoriesContainer';

import { Container, Row, Col, Hidden } from 'react-awesome-styled-grid';
import Colors from '../styles/Colors';
import Typography from '../styles/Typography';
import { IconContext } from 'react-icons';
import { FiMenu } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import boltAuctionLogo from '../lib/images/boltAuctionLogo.png';

const HeaderBlock = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 12px 0 rgba(69, 88, 115, 0.2);
  background-color: ${Colors.surface};
  z-index: 20;

  .my-store,
  .notice,
  .logout,
  .login {
    ${Typography.button};
    color: ${Colors.onSurfaceMedium};
    cursor: pointer;

    :hover {
      color: ${Colors.primary};
    }
  }

  .logo-img {
    max-height: 72px;
    ${Typography.headline4};
    color: ${Colors.onSurfaceMedium};
    font-size: 2em;
  }

  .search {
    height: 48px;
    position: relative;

    & > input,
    & > input:focus {
      ${Typography.Subtitle1};
      color: ${Colors.onSurfaceMedium};
      height: 48px;
      width: 100%;
      padding: 5px 12px;
      border: 2px solid ${Colors.primary};
      border-radius: 5px;
    }
  }

  .sell-button {
    min-height: 36px;
    min-width: 64px;
    border-radius: 28px;
    background-color: ${Colors.primary};
    color: ${Colors.surface};

    a {
      ${Typography.Button};
      color: ${Colors.surface};
      font-weight: 500;
      width: 100%;
      height: 100%;
      /* padding: 8px 24px; */
      cursor: pointer;
    }
  }

  .category-list {
    ${Typography.button};
    color: ${Colors.onSurfaceMedium};
    position: relative;

    .menu-icon {
      height: 24px;
      width: 24px;
      display: flex;
      align-items: center;
    }

    .category,
    .sub-category {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    :hover {
      border: solid 1px rgba(0, 0, 0, 0.12);
      .category > span,
      .sub-category > span {
        color: ${Colors.primary};
      }
    }
  }
`;

const HeaderMarginBlock = styled.div`
  height: 108px;
`;

const Menu = styled.div`
  position: absolute;
  display: none;
  /* display: block; */
  top: 34px;
  left: -1px;
  background-color: ${Colors.surface};
  border: solid 1px rgba(0, 0, 0, 0.12);
  box-shadow: 0 8px 10px 0 rgba(0, 0, 0, 0.2), 0 16px 24px 0 rgba(0, 0, 0, 0.14);
`;

const LogOutButton = styled.button`
  /* font-size: 0.75em; */
  background: none;
`;

const Header = withRouter(({ history, user, signout }) => {
  const [keyword, setKeyword] = useState('');
  const [size, setSize] = useState(1024);
  const $input = useRef(null);
  const $menu = useRef(null);
  const $header = useRef(null);

  const onChange = () => {
    setKeyword($input.current.value);
  };
  const onSubmit = e => {
    e.preventDefault();
    if (!keyword.length) return;
    history.push(`/search?keyword=${keyword}&order=bidCount,asc`);
    $input.current.value = '';
  };

  window.addEventListener('resize', () => setSize($header.current.offsetWidth));

  return (
    <>
      <HeaderBlock ref={$header}>
        <Container style={{ maxWidth: 1024 }}>
          <Row style={{ height: 72 }} justify="space-between">
            <Hidden xs>
              <Col sm={1} md={2} lg={2} align="center" justify="center">
                <Link to="/">
                  <img
                    className="logo-img"
                    src={boltAuctionLogo}
                    alt="번개옥션"
                  />
                </Link>
              </Col>
            </Hidden>

            <Col xs={3} sm={4} md={6} lg={6} justify="center">
              <form className="search" onSubmit={onSubmit}>
                <input
                  ref={$input}
                  onChange={onChange}
                  placeholder="상품명으로 검색해보세요."
                />
                <IconContext.Provider
                  value={{
                    style: {
                      position: 'absolute',
                      color: Colors.primary,
                      right: '12px',
                      top: '24px',
                      transform: 'translateY(-50%)',
                    },
                  }}
                >
                  <GoSearch />
                </IconContext.Provider>
              </form>
            </Col>

            <Col xs={1} sm={1} md={2} lg={2} justify="center">
              <button className="sell-button">
                <Link to="/sell">판매하기</Link>
              </button>
            </Col>
          </Row>
          <Row style={{ height: 36 }}>
            <Col
              className="category-list"
              noGutter
              md={2}
              justify="center"
              align="center"
              onMouseOver={() => {
                $menu.current.style.display = 'block';
              }}
              onMouseLeave={() => {
                $menu.current.style.display = 'none';
              }}
            >
              <div className="category">
                <span className="menu-icon">
                  <FiMenu />
                </span>
                <span>카테고리</span>
              </div>
              <Menu ref={$menu}>
                <CategoriesContainer
                  menu={$menu}
                  // size={size}
                />
              </Menu>
            </Col>

            {/* <Col
              md={1}
              offset={{ md: 6 }}
              justify="center"
              align={{ md: 'center', lg: 'flex-end' }}
            >
              <div className="notice">알림</div>
            </Col> */}

            <Col
              xs={1}
              sm={1}
              md={1}
              lg={1}
              offset={{ xs: 1, sm: 4, md: 7 }}
              justify="center"
              align="flex-end"
            >
              <div className="my-store">
                <Link to={`/store/${user?.id}`}>내 상점</Link>
              </div>
            </Col>

            <Col xs={1} sm={1} md={2} lg={2} justify="center" align="flex-end">
              {user ? (
                <LogOutButton className="logout" onClick={signout}>
                  로그아웃
                </LogOutButton>
              ) : (
                <LogOutButton className="login" to="/signin">
                  로그인
                </LogOutButton>
              )}
            </Col>
          </Row>
        </Container>
      </HeaderBlock>
      <HeaderMarginBlock />
    </>
  );
});

export default Header;
