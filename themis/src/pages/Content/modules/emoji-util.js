import $ from 'cash-dom';

export function onCollapsedEmojiSelection(event) {
  event.preventDefault();
  const target = event.target;
  const topParent = $(target).parentsUntil('.sema');
  const emojiContainer = topParent.get(topParent.length - 1);
  const selectedEmoji = $(emojiContainer).find('.selectedEmoji')[0];
  const expandedEmojis = $(emojiContainer).find('.expandedEmojis')[0];

  $(selectedEmoji).hide();
  $(expandedEmojis).show();
}

export function onExpandedEmojiSelected(event) {
  event.preventDefault();
  const target = event.target;
  const topParent = $(target).parentsUntil('.sema');
  const emojiContainer = topParent.get(topParent.length - 1);
  const selectedEmoji = $(emojiContainer).find('.selectedEmoji')[0];
  const expandedEmojis = $(emojiContainer).find('.expandedEmojis')[0];

  let eventParentCollection = $(target).parentsUntil('.expandedEmojis');

  if (!eventParentCollection.length) {
    eventParentCollection = [target];
  }

  const eventButton = eventParentCollection[eventParentCollection.length - 1];
  const eventImg = $(eventButton).find('img')[0];
  const eventImgSrc = $(eventImg).attr('src');
  const eventButtonTitle = $(eventButton).attr('title');

  const updatedEmojiButton = $(selectedEmoji).find('button');
  const updatedEmojiIcon = $(updatedEmojiButton).find('img');
  const updatedEmojiText = $(updatedEmojiButton).find('span');

  $(updatedEmojiButton).attr('title', eventButtonTitle);
  $(updatedEmojiIcon).attr('src', eventImgSrc);
  $(updatedEmojiText).text(eventButtonTitle);

  $(expandedEmojis).hide();
  $(selectedEmoji).show();
}
