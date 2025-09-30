import CourseForm from "@/components/courses/courseForm"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"

export const CreateCourseView = () => {


    const initialValues = {
        courseName: "",
        description: "",
        department: ""
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const handleForm = (data: any) => {
        console.log(data)
    }


    return (
        <>
            <div className="max-w-3xl mx-auto">

                <h1 className="text-5-xl font-black">Crear nuevo curso</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un curso</p>

                <nav className="my-5 ">
                    <Link
                        to={"/"}
                        className="bg-sky-700 hover:bg-sky-800 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
                    >
                        Volver a cursos
                    </Link>

                    <Link
                        to={"/crear-departamento"}
                        className="bg-sky-700 hover:bg-sky-800 ml-10 py-3 px-10 rounded-lg text-white text-xl font-bold cursor-pointer transition-colors"
                    >
                        Crear nuevo departamento
                    </Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <CourseForm
                        register={register}
                        errors={errors}
                    />

                    <input
                        type="submit"
                        value='Crear Curso'
                        className="bg-sky-700 hover:bg-sky-800 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                </form>


            </div>
        </>
    )
}
