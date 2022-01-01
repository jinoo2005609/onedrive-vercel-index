import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { ReactReader } from 'react-reader'
import type { Rendition } from 'epubjs'

import Loading from '../Loading'
import DownloadButtonGroup from '../DownloadBtnGtoup'

const EPUBPreview: FunctionComponent<{file: any}> = ({ file }) => {
  const [epubContainerWidth, setEpubContainerWidth] = useState(400)
  const epubContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEpubContainerWidth(epubContainer.current ? epubContainer.current.offsetWidth : 400)
  }, [])

  const [location, setLocation] = useState<string>()
  const onLocationChange = (cfiStr: string) => setLocation(cfiStr)

  // Fix for not valid epub files according to
  // https://github.com/gerhardsletten/react-reader/issues/33#issuecomment-673964947
  const fixEpub = (rendition: Rendition) => {
    const spineGet = rendition.book.spine.get.bind(rendition.book.spine)
    rendition.book.spine.get = function (target) {
      const targetStr = target as string
      let t = spineGet(target)
      while (t == null && targetStr.startsWith('../')) {
        target = targetStr.substring(3)
        t = spineGet(target)
      }
      return t
    }
  }

  return (
    <div>
      <div
        className="dark:bg-gray-900 md:p-3 no-scrollbar flex flex-col w-full overflow-scroll bg-white rounded"
        style={{ maxHeight: '90vh' }}
      >
        <div className="no-scrollbar flex-1 w-full overflow-scroll" ref={epubContainer} style={{ minHeight: '70vh' }}>
          <div style={{ position: 'absolute', width: epubContainerWidth, height: '70vh' }}>
            <ReactReader
              url={file['@microsoft.graph.downloadUrl']}
              getRendition={(rendition) => fixEpub(rendition)}
              loadingView={<Loading loadingText="EPUB를 불러오는 중..." />}
              location={location}
              locationChanged={onLocationChange}
              epubInitOptions={{ openAs: 'epub' }}
              epubOptions={{ flow: 'scrolled' }}
            />
          </div>
        </div>
      </div>
      <div className="border-t-gray-200 dark:border-t-gray-700 border-t p-2 sticky bottom-0 left-0 right-0 z-10 bg-white bg-opacity-80 backdrop-blur-md dark:bg-gray-900">
        <DownloadButtonGroup downloadUrl={file['@microsoft.graph.downloadUrl']} />
      </div>
    </div>
  )
}

export default EPUBPreview
