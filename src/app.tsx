import { Button } from './components/button'

export function App() {
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-[#161616]'>
      <div className='w-[320px] flex flex-col justify-start items-center space-y-3'>
        <div className='w-full aspect-video bg-white rounded-[12px]'>

        </div>

        <Button
          onClick={() => {}}
          className='w-full h-[50px] before:bg-[#49C1F8] before:shadow-[0_4px_0_#189AD6]'
        >
          Download
        </Button>
      </div>
    </div>
  )
}
