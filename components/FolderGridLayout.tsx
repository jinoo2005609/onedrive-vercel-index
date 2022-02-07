import type { OdFolderChildren } from '../types'

import Link from 'next/link'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useClipboard } from 'use-clipboard-copy'

import { getBaseUrl } from '../utils/getBaseUrl'
import { formatModifiedDateTime } from '../utils/fileDetails'
import { Checkbox, ChildIcon, Downloading, formatChildName } from './FileListing'

const GridItem = ({ c }: { c: OdFolderChildren }) => {
  // We use the generated medium thumbnail for rendering preview images
  const thumbnail = c.thumbnails && c.thumbnails.length > 0 ? c.thumbnails[0].medium : null

  // Some thumbnails are broken, so we check for onerror event in the image component
  const [brokenThumbnail, setBrokenThumbnail] = useState(false)

  return (
    <div className="space-y-2">
      <div className="h-32 overflow-hidden rounded border border-gray-900/10 dark:border-gray-500/30">
        {thumbnail && !brokenThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="h-full w-full object-cover object-top"
            src={thumbnail.url}
            alt={c.name}
            onError={() => setBrokenThumbnail(true)}
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center rounded-lg">
            <ChildIcon child={c} />
            <span className="absolute bottom-0 right-0 m-1 font-medium text-gray-700 dark:text-gray-500">
              {c.folder?.childCount}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-center space-x-2">
        <span className="w-5 flex-shrink-0 text-center">
          <ChildIcon child={c} />
        </span>
        <span className="overflow-hidden truncate">{formatChildName(c.name)}</span>
      </div>
      <div className="truncate text-center font-mono text-xs text-gray-700 dark:text-gray-500">
        {formatModifiedDateTime(c.lastModifiedDateTime)}
      </div>
    </div>
  )
}

const FolderGridLayout = ({
  path,
  folderChildren,
  selected,
  toggleItemSelected,
  totalSelected,
  toggleTotalSelected,
  totalGenerating,
  handleSelectedDownload,
  folderGenerating,
  handleFolderDownload,
  toast,
}) => {
  const clipboard = useClipboard()

  return (
    <div className="rounded bg-white dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center border-b border-gray-900/10 px-3 text-xs font-bold uppercase tracking-widest text-gray-600 dark:border-gray-500/30 dark:text-gray-400">
        <div className="flex-1">{folderChildren.length}개 항목</div>
        <div className="flex p-1.5 text-gray-700 dark:text-gray-400">
          <Checkbox
            checked={totalSelected}
            onChange={toggleTotalSelected}
            indeterminate={true}
            title={'모든 파일 선택'}
          />
          {totalGenerating ? (
            <Downloading title="선택된 파일을 다운로드하는 중이에요. 취소하려면 새로고침하세요." />
          ) : (
            <button
              title="선택된 파일 다운로드"
              className="cursor-pointer rounded p-1.5 hover:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white dark:hover:bg-gray-600 disabled:dark:text-gray-600 disabled:hover:dark:bg-gray-900"
              disabled={totalSelected === 0}
              onClick={handleSelectedDownload}
            >
              <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} size="lg" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4">
        {folderChildren.map((c: OdFolderChildren) => (
          <div
            key={c.id}
            className="group relative overflow-hidden rounded transition-all duration-100 hover:bg-gray-100 dark:hover:bg-gray-850"
          >
            <div className="absolute top-0 right-0 z-10 m-1 rounded bg-white/50 py-0.5 opacity-0 transition-all duration-100 group-hover:opacity-100 dark:bg-gray-900/50">
              {c.folder ? (
                <div>
                  <span
                    title="폴더 링크 복사"
                    className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => {
                      clipboard.copy(`${getBaseUrl()}${path === '/' ? '' : path}/${encodeURIComponent(c.name)}`)
                      toast('폴더 링크를 복사했어요.', { icon: '👌' })
                    }}
                  >
                    <FontAwesomeIcon icon={['far', 'copy']} />
                  </span>
                  {folderGenerating[c.id] ? (
                    <Downloading title="폴더를 다운로드하는 중이에요. 취소하려면 새로고침하세요." />
                  ) : (
                    <span
                      title="폴더 다운로드"
                      className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                      onClick={() => {
                        const p = `${path === '/' ? '' : path}/${encodeURIComponent(c.name)}`
                        handleFolderDownload(p, c.id, c.name)()
                      }}
                    >
                      <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} />
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <span
                    title="RAW 파일 링크 복사"
                    className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => {
                      clipboard.copy(
                        `${getBaseUrl()}/api?path=${path === '/' ? '' : path}/${encodeURIComponent(c.name)}&raw=true`
                      )
                      toast.success('RAW 파일 링크를 복사했어요.')
                    }}
                  >
                    <FontAwesomeIcon icon={['far', 'copy']} />
                  </span>
                  <a
                    title="파일 다운로드"
                    className="cursor-pointer rounded px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                    href={c['@microsoft.graph.downloadUrl']}
                  >
                    <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} />
                  </a>
                </div>
              )}
            </div>

            <div
              className={`${
                selected[c.id] ? 'opacity-100' : 'opacity-0'
              } absolute top-0 left-0 z-10 m-1 rounded bg-white/50 py-0.5 group-hover:opacity-100 dark:bg-gray-900/50`}
            >
              {!c.folder && !(c.name === '.password') && (
                <Checkbox
                  checked={selected[c.id] ? 2 : 0}
                  onChange={() => toggleItemSelected(c.id)}
                  title="파일 선택"
                />
              )}
            </div>

            <Link href={`${path === '/' ? '' : path}/${encodeURIComponent(c.name)}`} passHref>
              <a>
                <GridItem c={c} />
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FolderGridLayout
