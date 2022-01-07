import FourOhFour from '../FourOhFour'
import Loading from '../Loading'
import DownloadButtonGroup from '../DownloadBtnGtoup'
import useFileContent from '../../utils/fetchOnMount'
import { DownloadBtnContainer, PreviewContainer } from './Containers'

const TextPreview = ({ file }) => {
  const { content, error, validating } = useFileContent(file['@microsoft.graph.downloadUrl'])
  if (error) {
    return (
      <PreviewContainer>
        <FourOhFour errorMsg={error} />
      </PreviewContainer>
    )
  }

  if (validating) {
    return (
      <PreviewContainer>
        <Loading loadingText="파일 내용 불러오는 중..." />
      </PreviewContainer>
    )
  }

  if (!content) {
    return (
      <PreviewContainer>
        <FourOhFour errorMsg="파일이 비어 있어요." />
      </PreviewContainer>
    )
  }

  return (
    <div>
      <PreviewContainer>
        <pre className="md:p-3 p-0 overflow-x-scroll text-sm">{content}</pre>
      </PreviewContainer>
      <DownloadBtnContainer>
        <DownloadButtonGroup downloadUrl={file['@microsoft.graph.downloadUrl']} />
      </DownloadBtnContainer>
    </div>
  )
}

export default TextPreview
