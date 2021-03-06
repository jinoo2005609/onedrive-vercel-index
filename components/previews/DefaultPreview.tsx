import type { OdFileObject } from '../../types'
import { FC } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getFileIcon } from '../../utils/getFileIcon'
import { formatModifiedDateTime, humanFileSize } from '../../utils/fileDetails'

import DownloadButtonGroup from '../DownloadBtnGtoup'
import { DownloadBtnContainer, PreviewContainer } from './Containers'

const DefaultPreview: FC<{ file: OdFileObject }> = ({ file }) => {
  return (
    <div>
      <PreviewContainer>
        <div className="items-center px-5 py-4 md:flex md:space-x-8">
          <div className="rounded-lg border border-gray-900/10 px-8 py-20 text-center dark:border-gray-500/30">
            <FontAwesomeIcon icon={getFileIcon(file.name, { video: Boolean(file.video) })} />
            <div className="mt-6 text-sm font-medium line-clamp-3 md:w-28">{file.name}</div>
          </div>

          <div className="flex flex-col space-y-2 py-4 md:flex-1">
            <div>
              <div className="py-2 text-xs font-medium uppercase opacity-80">수정한 날짜</div>
              <div>{formatModifiedDateTime(file.lastModifiedDateTime)}</div>
            </div>

            <div>
              <div className="py-2 text-xs font-medium uppercase opacity-80">파일 크기</div>
              <div>{humanFileSize(file.size)}</div>
            </div>

            <div>
              <div className="py-2 text-xs font-medium uppercase opacity-80">MIME 타입</div>
              <div>{file.file?.mimeType || '이용할 수 없음'}</div>
            </div>

            <div>
              <div className="py-2 text-xs font-medium uppercase opacity-80">해시</div>
              <table className="block w-full overflow-scroll whitespace-nowrap text-sm md:table">
                <tbody>
                  <tr className="border-y bg-white dark:border-gray-700 dark:bg-gray-900">
                    <td className="bg-gray-50 py-1 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      Quick XOR
                    </td>
                    <td className="whitespace-nowrap py-1 px-3 font-mono text-gray-500 dark:text-gray-400">
                      {file.file.hashes?.quickXorHash || '이용할 수 없음'}
                    </td>
                  </tr>
                  <tr className="border-y bg-white dark:border-gray-700 dark:bg-gray-900">
                    <td className="bg-gray-50 py-1 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      SHA1
                    </td>
                    <td className="whitespace-nowrap py-1 px-3 font-mono text-gray-500 dark:text-gray-400">
                      {file.file.hashes?.sha1Hash || '이용할 수 없음'}
                    </td>
                  </tr>
                  <tr className="border-y bg-white dark:border-gray-700 dark:bg-gray-900">
                    <td className="bg-gray-50 py-1 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      SHA256
                    </td>
                    <td className="whitespace-nowrap py-1 px-3 font-mono text-gray-500 dark:text-gray-400">
                      {file.file.hashes?.sha256Hash || '이용할 수 없음'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PreviewContainer>
      <DownloadBtnContainer>
        <DownloadButtonGroup downloadUrl={file['@microsoft.graph.downloadUrl']} />
      </DownloadBtnContainer>
    </div>
  )
}

export default DefaultPreview
