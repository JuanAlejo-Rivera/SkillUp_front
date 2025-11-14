import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppLayout } from "@/Layouts/AppLayout"
import { DashboardView } from "@/Views/DashboardView"
import { CreateCourseView } from "./Views/courses/CreateCourseView"
import { SectionsView } from "./Views/courses/SectionsView"
import EditCourseView from "./Views/courses/EditCourseView"
import { CreateSectionView } from "./Views/courses/CreateSectionView"
import { LessonsView } from "./Views/courses/LessonsView"
import { EditSectionView } from "./Views/courses/EditSectionView"
import { EditLessonView } from "./Views/courses/EditLessonView"
import { NoteFound } from "./Views/404/notFound"
import { CreateDepartmentView } from "./Views/departments/CreateDepartmentView"
import LoginView from "./Views/auth/LoginView"
import { AuthLayout } from "./Layouts/AuthLayout"
import RegisterView from "./Views/auth/RegisterView"
import ConfirmAccountView from "./Views/auth/confirmAccountView"

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardView />} index />
                    <Route path="/courses-create" element={<CreateCourseView />} />
                    <Route path="/courses/:courseId/edit" element={<EditCourseView />} />
                    <Route path="/courses/:courseId/sections" element={<SectionsView />} />
                    <Route path="/create-section" element={<CreateSectionView />} />
                    <Route path="/courses/:courseId/sections/:sectionId/edit" element={<EditSectionView />} />
                    <Route path="/courses/:courseId/sections/:sectionId/lessons" element={<LessonsView />} />
                    <Route path="/courses/:courseId/sections/:sectionId/lesson/:lessonId/edit" element={<EditLessonView />} />
                </Route>

                <Route element={<AppLayout />}>
                    <Route path="/create-deparment" element={<CreateDepartmentView />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/auth/login" element={<LoginView/>} />
                    <Route path="/auth/register" element={<RegisterView/>} />
                    <Route path="/auth/confirm-account" element={<ConfirmAccountView/>} />
                </Route>

                <Route element={<AppLayout />}>
                    <Route path="*" element={<NoteFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}