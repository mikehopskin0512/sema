import domtoimage from 'dom-to-image';

export const onDownloadImage = (ref) => {
  domtoimage.toJpeg(ref.current, { quality: 0.95 })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'infographics.jpeg';
      link.href = dataUrl;
      link.click();
    });
};
