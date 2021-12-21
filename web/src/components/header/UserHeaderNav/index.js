import React from 'react'
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';
import styles from "../header.module.scss";
import { PATHS, SEMA_CORPORATE_TEAM_NAME } from '../../../utils/constants';
import usePermission from '../../../hooks/usePermission';
import { ViewAdmin } from '../../../data/permissions';


const UserHeaderNav = ({ toggleHamburger, type = 'desktop', inviteCount = 0 }) => {
  const { pathname } = useRouter();
  const { isSemaAdmin } = usePermission();

  const renderDesktopNav = () => {
    return (
      <>
        <Link href="/">
          <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 ${pathname === PATHS.DASHBOARD && 'has-text-weight-semibold'}`}>
            Repos
          </a>
        </Link>
        <Link href={PATHS.PERSONAL_INSIGHTS}>
          <a aria-hidden="true" className={`navbar-item has-text-black-950 mx-10 ${pathname === PATHS.PERSONAL_INSIGHTS && 'has-text-weight-semibold'}`}>
            Personal Insights
          </a>
        </Link>
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
              <div className={clsx("ml-3 has-background-success is-size-9 has-text-white has-text-centered has-text-weight-semibold border-radius-4px", styles.badge)}>{isSemaAdmin() ? 'ꝏ' : inviteCount}</div>
            </div>
          </a>
        </Link>
        <Link href={PATHS.SUPPORT}>
          <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 ${pathname === PATHS.SUPPORT && 'has-text-weight-semibold'}`}>
            Support
          </a>
        </Link>
        {
          isSemaAdmin() && (
            <Link href={PATHS.LABELS_MANAGEMENT}>
              <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 ${pathname === PATHS.LABELS_MANAGEMENT && 'has-text-weight-semibold'}`}>
                Labels Management
              </a>
            </Link>
          )
        }
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
        <Link href="/">
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Repos
          </a>
        </Link>
        <Link href={PATHS.PERSONAL_INSIGHTS}>
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Personal Insights
          </a>
        </Link>
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
            <span className="badge mr-50 is-right is-success is-flex is-justify-content-center is-align-items-center has-text-white has-text-weight-semibold border-radius-4px">{isSemaAdmin() ? 'ꝏ' : inviteCount}</span>
          </a>
        </Link>
        <Link href={PATHS.SUPPORT}>
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Support
          </a>
        </Link>
        {
          isSemaAdmin() && (
            <Link href={PATHS.LABELS_MANAGEMENT}>
              <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase">
                Labels Management
              </a>
            </Link>
          )
        }
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
