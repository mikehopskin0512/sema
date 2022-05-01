import { jsPDF } from "jspdf";
import domtoimage from 'dom-to-image';

export const A4_PAGE = {
  NAME: 'a4',
  HEIGHT: 300,
  WIDTH: 205,
};

export const DEFAULT_PDF_OPTIONS = {
  IMAGE_FORMAT: 'PNG',
  IMAGE_COMPRESSION: 'FAST',
  IMAGE_ALIAS: 'print',
  FILENAME: 'portfolio.pdf',
  ORIENTATION: 'p',
  UNIT: 'mm',
};

export const savePdfDocument = async (ref) => {
  const pngData = await domtoimage.toPng(ref.current, { quality: 0.6 });
    
  const imgHeight = (ref.current.clientHeight * A4_PAGE.WIDTH) / ref.current.clientWidth;
  let heightLeft = imgHeight;
    
  const pdf = new jsPDF(DEFAULT_PDF_OPTIONS.ORIENTATION, DEFAULT_PDF_OPTIONS.UNIT, A4_PAGE.NAME, true);
  let position = 0;
    
  pdf.addImage(
    pngData,
    DEFAULT_PDF_OPTIONS.IMAGE_FORMAT,
    0,
    position,
    A4_PAGE.WIDTH,
    imgHeight,
    DEFAULT_PDF_OPTIONS.IMAGE_ALIAS,
    DEFAULT_PDF_OPTIONS.IMAGE_COMPRESSION,
  ); 
  heightLeft -= A4_PAGE.HEIGHT;
    
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(
      pngData,
      0,
      position,
      A4_PAGE.WIDTH,
      imgHeight,
      DEFAULT_PDF_OPTIONS.IMAGE_ALIAS,
      DEFAULT_PDF_OPTIONS.IMAGE_COMPRESSION,
    );
    heightLeft -= A4_PAGE.HEIGHT;
  }
    
  pdf.save(DEFAULT_PDF_OPTIONS.FILENAME);
};
