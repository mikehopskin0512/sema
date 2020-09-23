import FileSaver from 'file-saver';

const PDFSaver = (fileData, fileName) => FileSaver.saveAs(fileData, fileName);
export default PDFSaver;
