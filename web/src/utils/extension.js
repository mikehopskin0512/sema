const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

export const isExtensionInstalled = async () => {
  const isChrome = typeof chrome !== 'undefined';
  if (!isChrome)
    return false;

  try {
    return await new Promise(resolve => {
      chrome.runtime?.sendMessage(EXTENSION_ID, 'version', (response) => {
        resolve(!!response);
      });
    });
  } catch (e) {
    // extension is disabled
    console.error(e);
    return false;
  }
};
