import { Link } from 'react-router-dom'

export const NoteFound = () => {
  return (
    <>
      <h1 className='font-black text-center text-4xl text-slate-700'>Página No Encontrada</h1>
      <p className='mt-10 text-center text-white'>
        Tal vez quieras volver a {' '}

        <Link className='text-gradient' to={'/'}>Proyectos</Link>
      </p>
    </>
  )
}
