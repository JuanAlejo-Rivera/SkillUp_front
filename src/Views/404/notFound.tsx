import { Link } from 'react-router-dom'

export const NoteFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-2xl">
        <h1 className='font-black text-8xl text-blue-400 mb-6'>404</h1>
        <h2 className='font-bold text-4xl text-white mb-4'>Página No Encontrada</h2>
        <p className='text-lg text-gray-300 mb-8'>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link 
          className='inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105' 
          to={'/'}
        >
          Volver a Cursos
        </Link>
      </div>
    </div>
  )
}
