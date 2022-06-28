import React from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import { isEmpty } from 'lodash';
import { useFlags } from '../../launchDarkly';

const UserHeaderNav = ({ toggleHamburger, type = 'desktop', selectedOrganization }) => {
  const { pathname } = useRouter();

  const { personalDashboard } = useFlags();

  const renderDesktopNav = () => {
    return (
      <>
        {personalDashboard && isEmpty(selectedOrganization) && <Link href={PATHS.PERSONAL}>
          <a aria-hidden="true" className={`navbar-item has-text-black-950 mr-10 ${pathname === PATHS.PERSONAL && 'has-text-weight-semibold'}`} onClick={toggleHamburger}>
            Dashboard
          </a>
        </Link>}
        {
          !isEmpty(selectedOrganization) ? (
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedOrganization.organization._id}${PATHS.DASHBOARD}`}>
              <a
                aria-hidden="true"
                className={`navbar-item has-text-black-950 mr-10 ${pathname === `${PATHS.ORGANIZATIONS._}/[organizationId]${PATHS.DASHBOARD}` && 'has-text-weight-semibold'}`}
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
          !isEmpty(selectedOrganization) ? (
          <>
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedOrganization.organization._id}${PATHS.REPOS}`}>
            <a
              aria-hidden="true"
              className={`navbar-item has-text-black-950 mr-10 ${pathname === `${PATHS.ORGANIZATIONS._}/[organizationId]${PATHS.REPOS}` && 'has-text-weight-semibold'}`}
            >
              Repos
            </a>
            </Link>
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedOrganization.organization._id}${PATHS.ORGANIZATION_INSIGHTS}`}>
              <a
                aria-hidden="true"
                className={`navbar-item has-text-black-950 mr-10 ${pathname === `${PATHS.ORGANIZATIONS._}/[organizationId]${PATHS.ORGANIZATION_INSIGHTS}` && 'has-text-weight-semibold'}`}
              >
              Organization Insights
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
          !isEmpty(selectedOrganization) ? (
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedOrganization.organization._id}${PATHS.DASHBOARD}`}>
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
          !isEmpty(selectedOrganization) && (
            <Link href={`${PATHS.ORGANIZATIONS._}/${selectedOrganization.organization._id}${PATHS.REPOS}`}>
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
