export default function ToolboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen flex flex-col items-center py-12 px-6'>
      <div className='w-full max-w-2xl'>{children}</div>
    </div>
  )
}
