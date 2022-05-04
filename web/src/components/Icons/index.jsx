import React from 'react';
import { ReactComponent as ActivityLogSvg } from './img/activity-log.svg';
import { ReactComponent as AlertFilledSvg } from './img/alert-filled.svg';
import { ReactComponent as AlertOutlineSvg } from './img/alert-outline.svg';
import { ReactComponent as AlertTriangleSvg } from './img/alert-triangle.svg';
import { ReactComponent as ArrowAscSvg } from './img/arrow-ascending.svg';
import { ReactComponent as ArrowDescSvg } from './img/arrow-descending.svg';
import { ReactComponent as ArrowDownSvg } from './img/arrow-down.svg';
import { ReactComponent as ArrowDrowdownSvg } from './img/arrow-drowdown.svg';
import { ReactComponent as ArrowLeftSvg } from './img/arrow-left.svg';
import { ReactComponent as ArrowRightSvg } from './img/arrow-right.svg';
import { ReactComponent as ArrowUpSvg } from './img/arrow-up.svg';
import { ReactComponent as AuthorSvg } from './img/author.svg';
import { ReactComponent as BroomSvg } from './img/broom.svg';
import { ReactComponent as BugsSvg } from './img/bugs.svg';
import { ReactComponent as CalendarOutlineSvg } from './img/calendar-outline.svg';
import { ReactComponent as CalendarFilledSvg } from './img/calendar-filled.svg';
import { ReactComponent as CheckFilledSvg } from './img/check-filled.svg';
import { ReactComponent as CheckOnlineSvg } from './img/check-online.svg';
import { ReactComponent as ChevronDownSvg } from './img/chevron-down.svg';
import { ReactComponent as ChevronLeftSvg } from './img/chevron-left.svg';
import { ReactComponent as ChevronRightSvg } from './img/chevron-right.svg';
import { ReactComponent as ChevronUpSvg } from './img/chevron-up.svg';
import { ReactComponent as ClockSvg } from './img/clock.svg';
import { ReactComponent as CloseSvg } from './img/close.svg';
import { ReactComponent as CodeSvg } from './img/code.svg';
import { ReactComponent as CodeStatsSvg } from './img/code-stats.svg';
import { ReactComponent as CommentsSvg } from './img/comments.svg';
import { ReactComponent as CompassSvg } from './img/compass.svg';
import { ReactComponent as CustomerSvg } from './img/customer.svg';
import { ReactComponent as DeleteSvg } from './img/delete.svg';
import { ReactComponent as DeveloperSvg } from './img/developer.svg';
import { ReactComponent as DotSvg } from './img/dot.svg';
import { ReactComponent as DotsSvg } from './img/dots.svg';
import { ReactComponent as DownloadSvg } from './img/download.svg';
import { ReactComponent as DuplicateSvg } from './img/duplicate.svg';
import { ReactComponent as EditSvg } from './img/edit.svg';
import { ReactComponent as ExternalLinkSvg } from './img/external-link.svg';
import { ReactComponent as EyeSvg } from './img/eye.svg';
import { ReactComponent as EyeOffSvg } from './img/eye-off.svg';
import { ReactComponent as FacebookSvg } from './img/facebook.svg';
import { ReactComponent as FileSvg } from './img/file.svg';
import { ReactComponent as FilterSvg } from './img/filter.svg';
import { ReactComponent as GithubSvg } from './img/github.svg';
import { ReactComponent as GridSvg } from './img/grid.svg';
import { ReactComponent as HeartFilledSvg } from './img/heart-filled.svg';
import { ReactComponent as HeartOutlineSvg } from './img/heart-outline.svg';
import { ReactComponent as InfoFilledSvg } from './img/info-filled.svg';
import { ReactComponent as InfoOutlineSvg } from './img/info-outline.svg';
import { ReactComponent as InstagramSvg } from './img/instagram.svg';
import { ReactComponent as LinkedinSvg } from './img/linkedin.svg';
import { ReactComponent as ListSvg } from './img/list.svg';
import { ReactComponent as LoadingBlackSvg } from './img/loading-black.svg';
import { ReactComponent as LoadingBlueSvg } from './img/loading-blue.svg';
import { ReactComponent as LoadingGreenSvg } from './img/loading-green.svg';
import { ReactComponent as LoadingRedSvg } from './img/loading-red.svg';
import { ReactComponent as MailSvg } from './img/mail.svg';
import { ReactComponent as MinusSvg } from './img/minus.svg';
import { ReactComponent as OptionsSvg } from './img/options.svg';
import { ReactComponent as OverviewSvg } from './img/overview.svg';
import { ReactComponent as PdfSvg } from './img/PDF.svg';
import { ReactComponent as PhotoSvg } from './img/photo.svg';
import { ReactComponent as PlaySvg } from './img/play.svg';
import { ReactComponent as PlusSvg } from './img/plus.svg';
import { ReactComponent as ProductSvg } from './img/product.svg';
import { ReactComponent as RefreshSvg } from './img/refresh.svg';
import { ReactComponent as ResendSvg } from './img/resend.svg';
import { ReactComponent as SaveSvg } from './img/save.svg';
import { ReactComponent as SearchSvg } from './img/search.svg';
import { ReactComponent as SemaSvg } from './img/sema.svg';
import { ReactComponent as SeparatorSvg } from './img/separator.svg';
import { ReactComponent as SettingsSvg } from './img/settings.svg';
import { ReactComponent as SignOutSvg } from './img/sign-out.svg';
import { ReactComponent as ShareSvg } from './img/share.svg';
import { ReactComponent as SourceSvg } from './img/source.svg';
import { ReactComponent as StarFilledSvg } from './img/star-filled.svg';
import { ReactComponent as StarOutlineSvg } from './img/star-outline.svg';
import { ReactComponent as SwipeSvg } from './img/swipe.svg';
import { ReactComponent as TrashSvg } from './img/trash.svg';
import { ReactComponent as TwitterSvg } from './img/twitter.svg';
import { ReactComponent as UndoSvg } from './img/undo.svg';
import { ReactComponent as UploadSvg } from './img/upload.svg';
import { ReactComponent as VerifiedFilledSvg } from './img/verified-filled.svg';
import { ReactComponent as VerifiedOutlineSvg } from './img/verified-outline.svg';
import { ReactComponent as WarningFilledSvg } from './img/warning-filled.svg';
import { ReactComponent as WarningOutlineSvg } from './img/warning-outline.svg';
import { ReactComponent as CameraSvg } from './img/camera.svg';
import { ReactComponent as TeamSvg } from './img/team.svg';
import { ReactComponent as LinkSvg } from './img/link.svg';
import { ReactComponent as TagSvg } from './img/tag.svg';
import { ReactComponent as InviteSvg } from './img/invite.svg';
import { ReactComponent as Trophy2Svg } from './img/trophy2.svg';
import { ReactComponent as FilterBarsSvg } from './img/filter-bars.svg';
import { ReactComponent as DragTrigger } from './img/drag-trigger.svg';
import { ReactComponent as CopyIcon } from './img/copy.svg';

const getIconUrl = (name) => `/img/icons/svg/${name}.svg`;

const Icon = ({
  size = 'medium',
  color = 'currentColor',
  style,
  children,
  ...props
}) => {
  const sizes = {
    tiny: '8px',
    small: '16px',
    medium: '24px',
    large: '32px',
  };

  return React.cloneElement(children, {
    width: sizes[size],
    height: sizes[size],
    color,
    style,
    ...props,
  });
};

export const ActivityLogIcon = (props) => (
  <Icon {...props}>
    <ActivityLogSvg />
  </Icon>
);

export const ShareIcon = (props) => (
  <Icon {...props}>
    <ShareSvg />
  </Icon>
);

export const CameraIcon = (props) => (
  <Icon {...props}>
    <CameraSvg />
  </Icon>
);

export const AlertFilledIcon = (props) => (
  <Icon {...props}>
    <AlertFilledSvg />
  </Icon>
);

export const AlertTriangleIcon = (props) => (
  <Icon {...props}>
    <AlertTriangleSvg />
  </Icon>
);

export const AlertOutlineIcon = (props) => (
  <Icon {...props}>
    <AlertOutlineSvg />
  </Icon>
);

export const ArrowAscIcon = (props) => (
  <Icon {...props}>
    <ArrowAscSvg />
  </Icon>
);

export const ArrowDescIcon = (props) => (
  <Icon {...props}>
    <ArrowDescSvg />
  </Icon>
);

export const ArrowDownIcon = (props) => (
  <Icon {...props}>
    <ArrowDownSvg />
  </Icon>
);

export const ArrowDropdownIcon = (props) => (
  <Icon {...props}>
    <ArrowDrowdownSvg />
  </Icon>
);

export const ArrowLeftIcon = (props) => (
  <Icon {...props}>
    <ArrowLeftSvg />
  </Icon>
);

export const ArrowRightIcon = (props) => (
  <Icon {...props}>
    <ArrowRightSvg />
  </Icon>
);

export const ArrowUpIcon = (props) => (
  <Icon {...props}>
    <ArrowUpSvg />
  </Icon>
);

export const AuthorIcon = (props) => (
  <Icon {...props}>
    <AuthorSvg />
  </Icon>
);

export const BroomIcon = (props) => (
  <Icon {...props}>
    <BroomSvg />
  </Icon>
);

export const BugsIcon = (props) => (
  <Icon {...props}>
    <BugsSvg />
  </Icon>
);

export const CalendarFilledIcon = (props) => (
  <Icon {...props}>
    <CalendarFilledSvg />
  </Icon>
);

export const CalendarOutlineIcon = (props) => (
  <Icon {...props}>
    <CalendarOutlineSvg />
  </Icon>
);

export const CheckFilledIcon = (props) => (
  <Icon {...props}>
    <CheckFilledSvg />
  </Icon>
);

export const CheckOnlineIcon = (props) => (
  <Icon {...props}>
    <CheckOnlineSvg />
  </Icon>
);

export const ChevronDownIcon = (props) => (
  <Icon {...props}>
    <ChevronDownSvg />
  </Icon>
);

export const ChevronLeftIcon = (props) => (
  <Icon {...props}>
    <ChevronLeftSvg />
  </Icon>
);

export const ChevronRightIcon = (props) => (
  <Icon {...props}>
    <ChevronRightSvg />
  </Icon>
);

export const ChevronUpIcon = (props) => (
  <Icon {...props}>
    <ChevronUpSvg />
  </Icon>
);

export const ClockIcon = (props) => (
  <Icon {...props}>
    <ClockSvg />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <CloseSvg />
  </Icon>
);

export const CodeIcon = (props) => (
  <Icon {...props}>
    <CodeSvg />
  </Icon>
);

export const CodeStatsIcon = (props) => (
  <Icon {...props}>
    <CodeStatsSvg />
  </Icon>
);

export const CommentsIcon = (props) => (
  <Icon {...props}>
    <CommentsSvg />
  </Icon>
);

export const PlayIcon = (props) => (
  <Icon {...props}>
    <PlaySvg />
  </Icon>
);

export const CompassIcon = (props) => (
  <Icon {...props}>
    <CompassSvg />
  </Icon>
);

export const CustomerIcon = (props) => (
  <Icon {...props}>
    <CustomerSvg />
  </Icon>
);

export const DeleteIcon = (props) => (
  <Icon {...props}>
    <DeleteSvg />
  </Icon>
);

export const DeveloperIcon = (props) => (
  <Icon {...props}>
    <DeveloperSvg />
  </Icon>
);

export const DotIcon = (props) => (
  <Icon {...props}>
    <DotSvg />
  </Icon>
);

export const DotsIcon = (props) => (
  <Icon {...props}>
    <DotsSvg />
  </Icon>
);

export const DownloadIcon = (props) => (
  <Icon {...props}>
    <DownloadSvg />
  </Icon>
);

export const DuplicateIcon = (props) => (
  <Icon {...props}>
    <DuplicateSvg />
  </Icon>
);

export const EditIcon = (props) => (
  <Icon {...props}>
    <EditSvg />
  </Icon>
);

export const TwitterIcon = (props) => (
  <Icon {...props}>
    <TwitterSvg />
  </Icon>
);

export const LinkedinIcon = (props) => (
  <Icon {...props}>
    <LinkedinSvg />
  </Icon>
);

export const InstagramIcon = (props) => (
  <Icon {...props}>
    <InstagramSvg />
  </Icon>
);

export const FacebookIcon = (props) => (
  <Icon {...props}>
    <FacebookSvg />
  </Icon>
);

export const ExternalLinkIcon = (props) => (
  <Icon {...props}>
    <ExternalLinkSvg />
  </Icon>
);

export const EyeIcon = (props) => (
  <Icon {...props}>
    <EyeSvg />
  </Icon>
);

export const EyeOffIcon = (props) => (
  <Icon {...props}>
    <EyeOffSvg />
  </Icon>
);

export const RefreshIcon = (props) => (
  <Icon {...props}>
    <RefreshSvg />
  </Icon>
);

export const FileIcon = (props) => (
  <Icon {...props}>
    <FileSvg />
  </Icon>
);

export const FilterIcon = (props) => (
  <Icon {...props}>
    <FilterSvg />
  </Icon>
);

export const GithubIcon = (props) => (
  <Icon {...props}>
    <GithubSvg />
  </Icon>
);

export const GridIcon = (props) => (
  <Icon {...props}>
    <GridSvg />
  </Icon>
);

export const HeartFilledIcon = (props) => (
  <Icon {...props}>
    <HeartFilledSvg />
  </Icon>
);

export const HeartOutlineIcon = (props) => (
  <Icon {...props}>
    <HeartOutlineSvg />
  </Icon>
);

export const InfoFilledIcon = (props) => (
  <Icon {...props}>
    <InfoFilledSvg />
  </Icon>
);

export const InfoOutlineIcon = (props) => (
  <Icon {...props}>
    <InfoOutlineSvg />
  </Icon>
);

export const ListIcon = (props) => (
  <Icon {...props}>
    <ListSvg />
  </Icon>
);

export const LoadingBlackIcon = (props) => (
  <Icon {...props}>
    <LoadingBlackSvg />
  </Icon>
);

export const LoadingBlueIcon = (props) => (
  <Icon {...props}>
    <LoadingBlueSvg />
  </Icon>
);
export const LoadingGreenIcon = (props) => (
  <Icon {...props}>
    <LoadingGreenSvg />
  </Icon>
);

export const LoadingRedIcon = (props) => (
  <Icon {...props}>
    <LoadingRedSvg />
  </Icon>
);

export const MailIcon = (props) => (
  <Icon {...props}>
    <MailSvg />
  </Icon>
);

export const MinusIcon = (props) => (
  <Icon {...props}>
    <MinusSvg />
  </Icon>
);

export const NoReactionIcon = (props) => (
  <Icon {...props}>
    <img src={getIconUrl('noreaction')} alt="no reaction icon" />
  </Icon>
);

export const OkIcon = (props) => (
  <Icon {...props}>
    <img src={getIconUrl('ok')} alt="ok icon" />
  </Icon>
);

export const OptionsIcon = (props) => (
  <Icon {...props}>
    <OptionsSvg />
  </Icon>
);

export const OverviewIcon = (props) => (
  <Icon {...props}>
    <OverviewSvg />
  </Icon>
);

export const PdfIcon = (props) => (
  <Icon {...props}>
    <PdfSvg />
  </Icon>
);

export const PhotoIcon = (props) => (
  <Icon {...props}>
    <PhotoSvg />
  </Icon>
);

export const PlusIcon = (props) => (
  <Icon {...props}>
    <PlusSvg />
  </Icon>
);
export const ProductIcon = (props) => (
  <Icon {...props}>
    <ProductSvg />
  </Icon>
);
export const QuestionIcon = (props) => (
  <Icon {...props}>
    <img src={getIconUrl('question')} alt='question icon' />
  </Icon>
);

export const ResendIcon = (props) => (
  <Icon {...props}>
    <ResendSvg />
  </Icon>
);
export const SaveIcon = (props) => (
  <Icon {...props}>
    <SaveSvg />
  </Icon>
);
export const SearchIcon = (props) => (
  <Icon {...props}>
    <SearchSvg />
  </Icon>
);
export const SemaIcon = (props) => (
  <Icon {...props}>
    <SemaSvg />
  </Icon>
);
export const SeparatorIcon = (props) => (
  <Icon {...props}>
    <SeparatorSvg />
  </Icon>
);
export const SettingsIcon = (props) => (
  <Icon {...props}>
    <SettingsSvg />
  </Icon>
);

export const SignOutIcon = (props) => (
  <Icon {...props}>
    <SignOutSvg />
  </Icon>
);

export const SourceIcon = (props) => (
  <Icon {...props}>
    <SourceSvg />
  </Icon>
);
export const StarFilledIcon = (props) => (
  <Icon {...props}>
    <StarFilledSvg />
  </Icon>
);

export const StarOutlineScg = (props) => (
  <Icon {...props}>
    <StarOutlineScg />
  </Icon>
);

export const SwipeIcon = (props) => (
  <Icon {...props}>
    <SwipeSvg />
  </Icon>
);

export const Trophy2Icon = (props) => (
  <Icon {...props}>
    <Trophy2Svg />
  </Icon>
);

export const ToolIcon = (props) => (
  <Icon {...props}>
    <img src={getIconUrl('tool')} alt='fix icon' />
  </Icon>
);

export const TrashIcon = (props) => (
  <Icon {...props}>
    <TrashSvg />
  </Icon>
);

export const TrophyIcon = (props) => (
  <Icon {...props}>
    <img src={getIconUrl('trophy')} alt="trophy" />
  </Icon>
);

export const UndoIcon = (props) => (
  <Icon {...props}>
    <UndoSvg />
  </Icon>
);

export const UploadIcon = (props) => (
  <Icon {...props}>
    <UploadSvg />
  </Icon>
);

export const VerifiedFilledIcon = (props) => (
  <Icon {...props}>
    <VerifiedFilledSvg />
  </Icon>
);

export const VerifiedOutlineIcon = (props) => (
  <Icon {...props}>
    <VerifiedOutlineSvg />
  </Icon>
);

export const WarningFilledIcon = (props) => (
  <Icon {...props}>
    <WarningFilledSvg />
  </Icon>
);

export const WarningOutlineIcon = (props) => (
  <Icon {...props}>
    <WarningOutlineSvg />
  </Icon>
);

export const StarOutlineIcon = (props) => (
  <Icon {...props}>
    <StarOutlineSvg />
  </Icon>
);

export const TeamIcon = (props) => (
  <Icon {...props}>
    <TeamSvg />
  </Icon>
);

export const LinkIcon = (props) => (
  <Icon {...props}>
    <LinkSvg />
  </Icon>
);

export const TagIcon = (props) => (
  <Icon {...props}>
    <TagSvg />
  </Icon>
);

export const InviteIcon = (props) => (
  <Icon {...props}>
    <InviteSvg />
  </Icon>
);

export const FilterBarsIcon = (props) => (
  <Icon {...props}>
    <FilterBarsSvg fill="" />
  </Icon>
);

export const DragTriggerIcon = (props) => (
  <Icon {...props}>
    <DragTrigger />
  </Icon>
);

export const CopyButtonIcon = (props) => (
  <Icon {...props}>
    <CopyIcon />
  </Icon>
);
