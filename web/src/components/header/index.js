/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './header.module.scss';
import HeaderMenu from './HeaderMenu';
import TeamMenuItem from './TeamMenuItem';
import { authOperations } from '../../state/features/auth';
import useOutsideClick from '../../utils/useOutsideClick';
import SupportForm from '../supportForm';
import SignOutModal from '../signOutModal';
import usePermission from '../../hooks/usePermission';
import { ViewAdmin } from '../../data/permissions';
import { teamsOperations } from '../../state/features/teams';

const { getTeams } = teamsOperations;

const Header = () => {
  const dispatch = useDispatch();
  const { deauthenticate } = authOperations;
  const [bgColor, setBgColor] = useState('');
  const [supportForm, setSupportForm] = useState(false);
  const [signOutModal, setSignOutModal] = useState(false);
  const { checkAccess } = usePermission();

  // Create REFs for menus
  const burger = useRef(null);
  const menu = useRef(null);
  const userMenu = useRef(null);

  // Get auth state
  const auth = useSelector((state) => state.authState);
  const { teams } = useSelector((state) => state.teamsState);
  const { user, token } = auth;
  const {
    isVerified = false,
    organizations = [],
    isWaitlist = true,
    isSemaAdmin = false,
    inviteCount = 0,
    roles = [],
  } = user;
  // Initials replaced by react-avatar
  // const userInitials = (user) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : '';

  // Use 1st org (for now) and get isAdmin
  // const [currentOrg = { isAdmin: false }] = organizations;
  // const isAdmin = currentOrg.isAdmin || isSemaAdmin;

  const openSupportForm = () => setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

  const { pathname } = useRouter();

  const orgMenuList = organizations.map((org) => (
    <Link href="/">
      <a className="navbar-item">{org.orgName}</a>
    </Link>
  ));

  useEffect(() => {
    if (window.location.pathname === '/login' || window.location.pathname === '/support') {
      setBgColor('has-background-white');
    }
    dispatch(getTeams(token));
  }, [dispatch, token]);

  const toggleHamburger = () => {
    if (menu.current && burger.current) {
      if (menu.current.classList.contains('is-active')) {
        menu.current.classList.remove('is-active');
      } else {
        menu.current.classList.add('is-active');
      }

      if (burger.current.classList.contains('is-active')) {
        burger.current.classList.remove('is-active');
      } else {
        burger.current.classList.add('is-active');
      }
    }
  };

  const toggleUserMenu = (status) => {
    if (userMenu.current) {
      if (
        userMenu.current.classList.contains('is-active') ||
        status === false
      ) {
        userMenu.current.classList.remove('is-active');
      } else {
        userMenu.current.classList.add('is-active');
      }
    }
  };

  const handleLogout = () => {
    setSignOutModal(true);
  };

  const onClickOutside = () => {
    toggleUserMenu(false);
  };

  // Check for clicks outside of userMenu
  useOutsideClick(userMenu, onClickOutside);

  const onCloseSignOutModal = () => setSignOutModal(false);

  return (
    <header className={bgColor}>
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <SignOutModal active={signOutModal} onClose={onCloseSignOutModal} />
      <nav
        className="navbar is-transparent container"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link href="/">
            <a>
              <img src="/img/sema-logo.png" alt="sema-logo" width="100" className="mt-15" />
            </a>
          </Link>
          {token && isVerified && !isWaitlist && (
            <button
              onClick={toggleHamburger}
              type="button"
              className="navbar-burger burger button is-white"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              ref={burger}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          )}
        </div>
        {
          token && isVerified && !isWaitlist ? (
            <div className="navbar-menu" ref={menu}>
              {/* Desktop menu */}
              <div
                className="navbar-start is-hidden-mobile is-hidden-tablet-only is-flex-grow-1 mx-30"
              >
                <Link href="/">
                  <a aria-hidden="true" className={`navbar-item has-text-deep-black mr-10 ${pathname === '/dashboard' && 'has-text-weight-semibold'}`}>
                    Repos
                  </a>
                </Link>
                <Link href="/personal-insights">
                  <a aria-hidden="true" className={`navbar-item has-text-deep-black mx-10 ${pathname === '/personal-insights' && 'has-text-weight-semibold'}`}>
                    Personal Insights
                  </a>
                </Link>
                <Link href="/suggested-snippets">
                  <a aria-hidden="true" className={`navbar-item has-text-deep-black mr-10 ${pathname.includes('/suggested-snippets') || pathname.includes('/comments') ? 'has-text-weight-semibold' : ''}`} onClick={toggleHamburger}>
                    Suggested Snippets
                  </a>
                </Link>
                {/* <Link href="/guides">
                  <a aria-hidden="true" className={`navbar-item has-text-deep-black mr-10 ${pathname.includes('/guides') ? 'has-text-weight-semibold' : ''}`} onClick={toggleHamburger}>
                    Community Eng Guides
                  </a>
                </Link> */}
                <Link href="/invitations">
                  <a aria-hidden="true" className={`navbar-item has-text-deep-black mr-10 pr-20 ${pathname === '/invitations' && 'has-text-weight-semibold'}`}>
                    <div className="is-flex is-flex-wrap-wrap">
                      Invitations
                      <div className={clsx("ml-3 has-background-success is-size-9 has-text-white has-text-centered has-text-weight-semibold border-radius-4px", styles.badge)}>{isSemaAdmin ? 'ꝏ' : inviteCount}</div>
                    </div>
                  </a>
                </Link>
                <Link href="/support">
                  <a aria-hidden="true" className={`navbar-item has-text-deep-black mr-10 ${pathname === '/support' && 'has-text-weight-semibold'}`}>
                    Support
                  </a>
                </Link>
                {/* <div aria-hidden="true" onClick={openSupportForm} className="is-flex is-align-items-center">
                  <a aria-hidden="true" className="navbar-item has-text-deep-black mr-15" onClick={toggleHamburger}>
                    Support
                  </a>
                </div> */}
              </div>
              {/* Hamburger menu (mobile & tablet) */}
              <div className="navbar-start is-hidden-desktop">
                <Link href="/">
                  <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                    Repos
                  </a>
                </Link>
                <Link href="/suggested-snippets">
                  <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                    Suggested Snippets
                  </a>
                </Link>
                {/* <Link href="/guides">
                  <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                    Community Engineering Guides
                  </a>
                </Link> */}
                <Link href="/invitations">
                  <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                    Invitations
                    <span className="badge mr-50 is-right is-success is-flex is-justify-content-center is-align-items-center has-text-white has-text-weight-semibold border-radius-4px">{isSemaAdmin ? 'ꝏ' : inviteCount}</span>
                  </a>
                </Link>
                
                <Link href="/support">
                  <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                    Support
                  </a>
                </Link>
                {/* <div aria-hidden="true" onClick={openSupportForm} className="is-flex is-align-items-center">
                  <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                    Support
                  </a>
                </div> */}
                <hr className="navbar-divider" />
                {checkAccess({name: 'Sema Super Team'}, ViewAdmin) && (
                  <Link href="/sema-admin/users">
                    <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                      Admin Panel
                    </a>
                  </Link>
                )}
                <Link href="/team">
                  <a
                    aria-hidden="true"
                    type="button"
                    className="navbar-item has-text-weight-semibold is-uppercase"
                    onClick={toggleUserMenu}
                  >
                    <span>Create a Team</span>
                    <span className="is-line-height-1 is-size-8 has-text-weight-semibold has-text-primary ml-3">(NEW)</span>
                  </a>
                </Link>
                <Link href="/profile">
                  <a
                    aria-hidden="true"
                    type="button"
                    className="navbar-item has-text-weight-semibold is-uppercase"
                    onClick={toggleUserMenu}
                  >
                    Your Profile
                  </a>
                </Link>
                <Link href="/support">
                  <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                    Support
                  </a>
                </Link>
                <hr className="navbar-divider" />
                { roles.map((role, item) => (
                  <TeamMenuItem role={role} toggleUserMenu={toggleUserMenu} key={`team-${item}`} />
                )) }
                <span
                  aria-hidden="true"
                  role="button"
                  className="navbar-item is-hidden-desktop"
                  style={{ cursor: 'pointer' }}
                  onClick={handleLogout}
                  tabIndex={0}
                >
                  Sign out
                </span>
              </div>
              <div className="navbar-end is-hidden-mobile is-hidden-tablet-only is-flex is-align-items-center">
                {/* Right icon menu - desktop */}
                {!isWaitlist ? (
                  <HeaderMenu
                    handleLogout={handleLogout}
                    user={user}
                  />
                )
                  : null}
                {/* TODO We will enable this again when team mgmt feature is fully implemented  */}
                {/*{*/}
                {/*  (teams && teams.length) ? (*/}
                {/*    <div className="navbar-item">*/}
                {/*      <div className="is-flex">*/}
                {/*        <img src="/img/team.png" className="mr-10" alt="" />*/}
                {/*        <div>*/}
                {/*          <div className="is-size-7 has-text-weight-semibold">{teams[0].name}</div>*/}
                {/*          <div className="is-size-8 has-text-weight-semibold has-text-gray-dark is-uppercase my-5">Team Account</div>*/}
                {/*          <Link href="/teams">*/}
                {/*            <a className="is-line-height-1 is-size-6 has-text-weight-semibold has-text-primary mt-5">*/}
                {/*              <span className="mr-10">Manage</span><span>Team</span>*/}
                {/*            </a>*/}
                {/*          </Link>*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  ) : (<></>)*/}
                {/*}*/}
                {/* TODO We will enable this again when team mgmt feature is fully implemented  */}
                {/*<Link href="/teams/add">*/}
                {/*  <a*/}
                {/*    aria-hidden="true"*/}
                {/*    type="button"*/}
                {/*    className="navbar-item"*/}
                {/*    onClick={toggleUserMenu}*/}
                {/*  >*/}
                {/*    <span>Create a Team</span>*/}
                {/*    {*/}
                {/*      (teams && teams.length) ? (*/}
                {/*        <span className="is-line-height-1 is-size-8 has-text-weight-semibold has-text-primary ml-3">(NEW)</span>*/}
                {/*      ) : ''*/}
                {/*    }*/}
                {/*  </a>*/}
                {/*</Link>*/}
              </div>
            </div>
          ) : (
            <div className="navbar-menu" ref={menu}>
              {/* Desktop menu */}
              {/* <div
                className="navbar-start is-hidden-mobile is-hidden-tablet-only is-flex-grow-1"
              >
                <Link href="/guides">
                  <a aria-hidden="true" className={`navbar-item has-text-deep-black mx-25 ${pathname.includes('/engineering') ? 'has-text-weight-semibold' : ''}`} onClick={toggleHamburger}>
                    Community Eng Guides
                  </a>
                </Link>
              </div> */}
              {/* Hamburger menu (mobile & tablet) */}
              {/* <div className="navbar-start is-hidden-desktop">
                <Link href="/guides">
                  <a className="navbar-item has-text-weight-semibold is-uppercase" aria-hidden="true" onClick={toggleHamburger}>
                    Community Engineering Guides
                  </a>
                </Link>
                <hr className="navbar-divider" />
              </div> */}
            </div>
          )
        }
      </nav>
    </header>
  );
};

export default Header;
