import { PureComponent } from 'react';
import { Spin } from 'antd';
import PDFJS from 'pdfjs-dist'; //@2.0.943
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';

PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';
let container: any;
let pageDiv;

interface ViewPdf {
  state: {
    loadings: boolean;
  }
}

interface PdfPreviewProps {
  pdfUrl: string;
}

/**
 * 查看PDF的组件
 * @param props
 * @constructor
 */
class ViewPdf extends PureComponent<PdfPreviewProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      loadings: true
    };
  }

  componentDidMount() {
    if (this.props.pdfUrl) {
      this.getPDF(this.props.pdfUrl);
    }
  }

  getPDF = async (url: string) => {
    this.setState({ loadings: true })
    await PDFJS.getDocument(url).then(async (pdf: any) => {
      container = document.getElementById('container');
      for (let i = 1; i <= pdf.numPages; i++) {
        await this.renderPDF(pdf, i);
      }
    });
    this.setState({ loadings: false })
  };
  renderPDF = (pdf: any, num: any) => {
    pdf.getPage(num).then((page: any) => {
      const scale = 1.5;
      const viewport = page.getViewport(scale);
      pageDiv = document.createElement('div');
      pageDiv.setAttribute('id', 'page-' + (page.pageIndex + 1));
      pageDiv.setAttribute('style', 'position: relative;margin-bottom:12px');
      container.appendChild(pageDiv);
      const canvas = document.createElement('canvas');
      pageDiv.appendChild(canvas);
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // page.render(renderContext);
      page
        .render(renderContext)
        .then(() => {
          return page.getTextContent();
        })
        .then((textContent: any) => {
          // 创建文本图层div
          const textLayerDiv = document.createElement('div');
          textLayerDiv.setAttribute('class', 'textLayer');
          // 将文本图层div添加至每页pdf的div中
          document.getElementById('page-' + (page.pageIndex + 1))?.appendChild(textLayerDiv);

          // 创建新的TextLayerBuilder实例
          const textLayer = new TextLayerBuilder({
            textLayerDiv: textLayerDiv,
            pageIndex: page.pageIndex,
            viewport: viewport,
          });

          textLayer.setTextContent(textContent);

          textLayer.render();
        });
    });
  };

  render() {
    return (
      <>
        <Spin tip="正在加载文件，请稍后......" spinning={this.state.loadings}>
          <div style={{ height: "100%", overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
              <div id="container"></div>
            </div>
          </div>
        </Spin>
      </>
    );
  }
}

export default ViewPdf;
