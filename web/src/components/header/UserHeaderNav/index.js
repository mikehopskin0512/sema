import React from 'react'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Link from 'next/link';
import styles from "../header.module.scss";
import { PATHS } from '../../../utils/constants';
import { isEmpty } from 'lodash';
import { useFlags } from '../../launchDarkly';

const UserHeaderNav = ({ toggleHamburger, type = 'desktop', inviteCount = 0, selectedTeam }) => {
  const { pathname } = useRouter();
  const { auth } = useSelector((state) => ({
    auth: state.authState,
  }));
  const { user: { isSemaAdmin } } = auth;

  const { personalDashboard } = useFlags();

  const renderDesktopNav = () => {
    return (
      <>
        {personalDashboard && isEmpty(selectedTeam) && <Link href={PATHS.PERSONAL}>
          <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 ${pathname === PATHS.PERSONAL && 'has-text-weight-semibold'}`} onClick={toggleHamburger}>
            Dashboard
          </a>
        </Link>}
        {
          !isEmpty(selectedTeam) ? (
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedTeam.team._id}${PATHS.DASHBOARD}`}>
              <a
                aria-hidden="true"
                className={`navbar-item has-text-black-950 mr-10 ${pathname === `${PATHS.ORGANIZATIONS._}/[teamId]${PATHS.DASHBOARD}` && 'has-text-weight-semibold'}`}
              >
                Dashboard
              </a>
            </Link>
          ) : (
            <Link href={PATHS.DASHBOARD}>
              <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 ${pathname === PATHS.DASHBOARD && 'has-text-weight-semibold'}`}>
                Repos
              </a>
            </Link>
          )
        }
        {
          !isEmpty(selectedTeam) ? (
          <>
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedTeam.team._id}${PATHS.REPOS}`}>
            <a
              aria-hidden="true"
              className={`navbar-item has-text-black-950 mr-10 ${pathname === `${PATHS.ORGANIZATIONS._}/[teamId]${PATHS.REPOS}` && 'has-text-weight-semibold'}`}
            >
              Repos
            </a>
            </Link>
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedTeam.team._id}${PATHS.ORGANIZATION_INSIGHTS}`}>
              <a
                aria-hidden="true"
                className={`navbar-item has-text-black-950 mr-10 ${pathname === `${PATHS.ORGANIZATIONS._}/[teamId]${PATHS.ORGANIZATION_INSIGHTS}` && 'has-text-weight-semibold'}`}
              >
              Team Insights
              </a>
            </Link>
          </>
          ) : (
            <Link href={PATHS.PERSONAL_INSIGHTS}>
              <a aria-hidden="true" className={`navbar-item has-text-black-950 mx-10 ${pathname === PATHS.PERSONAL_INSIGHTS && 'has-text-weight-semibold'}`}>
                Personal Insights
              </a>
            </Link>
          )
        }
        <Link href={PATHS.SNIPPETS._}>
          <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 ${pathname.includes(PATHS.SNIPPETS._) || pathname.includes('/comments') ? 'has-text-weight-semibold' : ''}`} onClick={toggleHamburger}>
            Snippets
          </a>
        </Link>
        {/* TODO: Activate if we ever need Community Engineering Guides again */}
        {/*
        <Link href="/guides">
          <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 ${pathname.includes('/guides') ? 'has-text-weight-semibold' : ''}`} onClick={toggleHamburger}>
            Community Eng Guides
          </a>
        </Link>
        */}
        <Link href={PATHS.INVITATIONS}>
          <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 pr-20 ${pathname === PATHS.INVITATIONS && 'has-text-weight-semibold'}`}>
            <div className="is-flex is-flex-wrap-wrap">
              Invitations
              <div className={clsx("ml-3 has-background-blue-700 is-size-9 has-text-white has-text-centered has-text-weight-semibold border-radius-8px", styles.badge)}>{isSemaAdmin ? 'ꝏ' : inviteCount}</div>
            </div>
          </a>
        </Link>
        <Link href={PATHS.SUPPORT}>
          <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 ${pathname === PATHS.SUPPORT && 'has-text-weight-semibold'}`}>
            Support
          </a>
        </Link>
        {/* TODO: Activate if we ever need Support form */}
        {/*
        <div aria-hidden="true" onClick={openSupportForm} className="is-flex is-align-items-center">
          <a aria-hidden="true" className="navbar-item has-text-black-950 mr-15" onClick={toggleHamburger}>
            Support
          </a>
        </div>
        */}
      </>
    )
  }

  const renderMobileNav = () => {
    return (
      <>
        {
          !isEmpty(selectedTeam) ? (
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedTeam.team._id}${PATHS.DASHBOARD}`}>
              <a
                aria-hidden="true"
                className="navbar-item has-text-weight-semibold is-uppercase"
              >
                Dashboard
              </a>
            </Link>
          ) : (
            <Link href={PATHS.DASHBOARD}>
              <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                Repos
              </a>
            </Link>
          )
        }
        <Link href={PATHS.PERSONAL_INSIGHTS}>
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Personal Insights
          </a>
        </Link>
        {
          !isEmpty(selectedTeam) && (
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedTeam.team._id}${PATHS.REPOS}`}>
              <a
                aria-hidden="true"
                className="navbar-item has-text-weight-semibold is-uppercase"
              >
                Repos
              </a>
            </Link>
          )
        }
        <Link href={PATHS.SNIPPETS._}>
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Snippets
          </a>
        </Link>
        {/* TODO: Activate if we ever need Community Engineering Guides again */}
        {/*
        <Link href="/guides">
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Community Engineering Guides
          </a>
        </Link>
        */}
        <Link href={PATHS.INVITATIONS}>
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Invitations
            <span className="badge mr-50 is-right is-success is-flex is-justify-content-center is-align-items-center has-text-white has-text-weight-semibold border-radius-4px">{isSemaAdmin ? 'ꝏ' : inviteCount}</span>
          </a>
        </Link>
        <Link href={PATHS.SUPPORT}>
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Support
          </a>
        </Link>
        {/* TODO: Activate if we ever need Support Forms */}
        {/*
        <div aria-hidden="true" onClick={openSupportForm} className="is-flex is-align-items-center">
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Support
          </a>
        </div>
        */}
      </>
    )
  };

  return (
    <>
      {
        type === 'desktop' ? renderDesktopNav() : renderMobileNav()
      }
    </>
  )
}

export default UserHeaderNav
