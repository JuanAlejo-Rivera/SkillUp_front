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

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardView/>} index/>
                    <Route path="/courses-create" element={<CreateCourseView/>}/>
                    <Route path="/courses/:courseId/edit" element={<EditCourseView/>}/>
                    <Route path="/courses/:courseId/sections" element={<SectionsView/>}/>
                    <Route path="/create-section" element={<CreateSectionView/>}/>
                    <Route path="/courses/:courseId/sections/:sectionId/edit" element={<EditSectionView/>}/>
                    <Route path="/courses/:courseId/sections/:sectionId/edit/lessons" element={<LessonsView/>}/>
                    <Route path="/courses/:courseId/sections/:sectionId/lesson/:lessonId/edit" element={<EditLessonView/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}