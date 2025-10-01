import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppLayout } from "@/Layouts/AppLayout"
import { DashboardView } from "@/Views/DashboardView"
import { CreateCourseView } from "./Views/courses/CreateCourseView"
import { SectionsView } from "./Views/courses/SectionsView"
import EditCourseView from "./Views/courses/EditCourseView"

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardView/>} index/>
                    <Route path="/courses-create" element={<CreateCourseView/>}/>
                    <Route path="/courses/:courseId/edit" element={<EditCourseView/>}/>
                    <Route path="/sections/view" element={<SectionsView/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}