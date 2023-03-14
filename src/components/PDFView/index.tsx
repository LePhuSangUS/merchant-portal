import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './index.less';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface PDFViewProps {
  file: any;
  onLoadError?: (err: any) => void;
  onLoadSuccess?: (resp: any) => void;
}

const PDFView: React.FC<PDFViewProps> = (
  {
    file = '',
    onLoadError,
    onLoadSuccess
  }
) => {
  return (
    <Document
      file={file || ''}
      onLoadError={onLoadError}
      onLoadSuccess={onLoadSuccess}
      className={styles.pdfDocument}
    >
      <Page
        pageNumber={1}
        className={styles.pdfPage}
      />
    </Document>
  )
}

export default PDFView
