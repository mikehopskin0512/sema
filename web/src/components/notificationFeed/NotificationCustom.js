import React, { SyntheticEvent } from 'react';
import Dayjs from 'dayjs';
// import {
//   EnrichedActivity,
//   EnrichedUser,
//   NotificationActivityEnriched,
//   UR
// } from 'getstream';
// import { TFunction } from 'i18next';
import {
  Avatar,
  AvatarGroup,
  AttachedActivity,
  Dropdown,
  Link
} from 'react-activity-feed';
import { NOTIFICATION_TYPE } from '../../utils/constants';
import { useOnClickUser, humanizeTimestamp } from './copied_library/utils';
// import {
// humanizeTimestamp,
//   useOnClickUser,
//   userOrDefault,
//   OnClickUserHandler,
//   PropsWithElementAttributes
// } from '../utils';
import { TranslationContext } from './copied_library/context';

let format = require('string-template');

const getUsers = activities => activities.map(item => item.actor);

const getHeaderText = (t, activitiesLen, verb, actorName, activityVerb) => {
  if (activitiesLen === 1) {
    switch (verb) {
      case 'follow':
      case NOTIFICATION_TYPE.JOINED_SEMA:
        return t('{actorName} has joined Sema.', {
          actorName
        });
      default:
        console.warn(
          'No notification styling found for your verb, please create your own custom Notification group.'
        );
        return '';
    }
  }

  if (activitiesLen > 1 && activitiesLen < 3) {
    switch (verb) {
      case 'follow':
      case NOTIFICATION_TYPE.JOINED_SEMA:
        return t('{actorName} and 1 other has joined Sema.', {
          actorName
        });
      default:
        console.warn(
          'No notification styling found for your verb, please create your own custom Notification group.'
        );
        return '';
    }
  }

  const countOtherActors = activitiesLen - 1;
  switch (verb) {
    case 'follow':
    case NOTIFICATION_TYPE.JOINED_SEMA:
      return t('{actorName} and {countOtherActors} others has joined Sema.', {
        actorName,
        countOtherActors
      });
    default:
      console.warn(
        'No notification styling found for your verb, please create your own custom Notification group.'
      );
      return '';
  }
};

export const NotificationCustom = ({
  activityGroup,
  onMarkAsRead,
  onClickUser,
  onClickNotification,
  className,
  style
}) => {
  // console.log('\n\n\nactivityGroup', activityGroup);

  const t = (template, params) => format(template, params);
  const { tDateTimeParser } = TranslationContext;
  const { activities } = activityGroup;
  console.log('activities', activities);
  const [latestActivity, ...restOfActivities] = activities;

  let lastObject = {};
  try {
    if (typeof latestActivity.object === 'string') {
      lastObject = JSON.parse(latestActivity.object);
    } else {
      lastObject = latestActivity.object;
    }
  } catch (e) {
    return null;
  }

  console.log('lastObject', lastObject);
  const lastActor = latestActivity.actor; // userOrDefault
  const headerText = getHeaderText(
    t,
    activities.length,
    latestActivity.verb,
    lastActor.data.name,
    lastObject.verb
  );

  const handleUserClick = useOnClickUser(onClickUser);
  const handleNotificationClick = onClickNotification
    ? e => {
        e.stopPropagation();
        onClickNotification(activityGroup);
      }
    : undefined;

  return (
    <div
      onClick={handleNotificationClick}
      className={
        className ??
        `raf-notification ${
          activityGroup.is_read ? 'raf-notification--read' : ''
        }`
      }
      style={style}
    >
      <Avatar
        onClick={handleUserClick?.(lastActor)}
        image={lastActor.data.profileImage}
        circle
        size={30}
      />

      <div className="raf-notification__content">
        <div className="raf-notification__header">
          <strong>{headerText}</strong>
          {!activityGroup.is_read && onMarkAsRead && (
            <Dropdown>
              <div>
                <Link
                  onClick={e => {
                    e.stopPropagation();
                    onMarkAsRead(activityGroup);
                  }}
                >
                  Mark&nbsp;as&nbsp;read
                </Link>
              </div>
            </Dropdown>
          )}
        </div>
        <div>
          <small>
            {humanizeTimestamp(latestActivity.time, tDateTimeParser)}
          </small>
        </div>
        {/* TODO add logic for different types by AvatarGroup or AttachedActivity */}
        {/* {latestActivity.verb !== 'follow' && (
          <AttachedActivity activity={latestActivity.object} />
        )} */}
      </div>

      <div className="raf-notification__extra">
        {activities.length > 1 /*&& latestActivity.verb === 'follow'*/ && (
          <AvatarGroup
            onClickUser={onClickUser}
            avatarSize={30}
            users={getUsers(restOfActivities)}
          />
        )}
      </div>
    </div>
  );
};

export const NotificationCustom2 = group =>
  console.log(group) || <div>{group.activityGroup.group}</div>;
