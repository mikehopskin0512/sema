import React from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from "../header.module.scss";
import { PATHS } from '../../../utils/constants';

function OrganizationHeaderNav({ organizationId = '', type = 'desktop' }) {
  const { pathname } = useRouter();

  const renderDesktopNav = () => {
    if (organizationId) {
      return (
        <>
          <Link href={`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.DASHBOARD}`}>
            <a
              aria-hidden="true"
              className={`navbar-item has-text-black-950 mr-10 ${pathname === `${PATHS.ORGANIZATIONS._}/[organizationId]${PATHS.DASHBOARD}` && 'has-text-weight-semibold'}`}
            >
              Dashboard
            </a>
          </Link>
          <Link href={`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.REPOS}`}>
            <a
              aria-hidden="true"
              className={`navbar-item has-text-black-950 mr-10 ${pathname === `${PATHS.ORGANIZATIONS._}/[organizationId]${PATHS.REPOS}` && 'has-text-weight-semibold'}`}
            >
              Repos
            </a>
          </Link>
          <Link href={`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.ORGANIZATION_INSIGHTS}`}>
            <a
              aria-hidden="true"
              className={`navbar-item has-text-black-950 mr-10 ${pathname === `${PATHS.ORGANIZATIONS._}/[organizationId]${PATHS.ORGANIZATION_INSIGHTS}` && 'has-text-weight-semibold'}`}
            >
              Organization Insights
            </a>
          </Link>
        </>
      )
    }
  }

  const renderMobileNav = () => {
    if (organizationId) {
      return (
        <>
          <Link href={`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.DASHBOARD}`}>
            <a
              aria-hidden="true"
              className="navbar-item has-text-weight-semibold is-uppercase"
            >
              Dashboard
            </a>
          </Link>
          <Link href={`${PATHS.ORGANIZATIONS._}/${organizationId}${PATHS.REPOS}`}>
            <a
              aria-hidden="true"
              className="navbar-item has-text-weight-semibold is-uppercase"
            >
              Repos
            </a>
          </Link>
        </>
      )
    }
  };

  return (
    <>
      {
        type === 'desktop' ? renderDesktopNav() : renderMobileNav()
      }
    </>
  )
}

export default OrganizationHeaderNav
