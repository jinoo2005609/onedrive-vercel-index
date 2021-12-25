import Image from 'next/image'
import { FunctionComponent } from 'react'

const FourOhFour: FunctionComponent<{ errorMsg: string }> = ({ errorMsg }) => {
  return (
    <div className="my-20">
      <div className="md:w-1/3 w-1/2 mx-auto">
        <Image src={'/images/empty.png'} alt="404" width={912} height={912} />
      </div>
      <div className="mt-6 text-gray-500 max-w-xl mx-auto">
        <div className="text-2xl font-bold mb-8">
          이런, &apos;s a <span className="underline decoration-wavy decoration-red-500">404</span> 오류예요.
        </div>
        <div className="font-mono border border-gray-400/20 rounded p-2 mb-4 text-sm bg-gray-50 dark:bg-gray-800">
          {errorMsg}
        </div>
        <div>
          더 자세한 사항을 보려면{' '}
          <kbd className="border-opacity-20 font-mono text-sm p-1 bg-gray-100 dark:bg-gray-800 border rounded">F12</kbd>{' '}
          키를 누르세요.
        </div>
      </div>
    </div>
  )
}

export default FourOhFour
