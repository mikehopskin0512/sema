const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

export const isExtensionInstalled = async () => {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(EXTENSION_ID, 'version', (response) => {
        if (!response) {
          resolve(false);
        }
        resolve(true);
      });
    } catch (e) {
      // extension is disabled
      console.error(e);
      resolve(false);
    }
  });
};
