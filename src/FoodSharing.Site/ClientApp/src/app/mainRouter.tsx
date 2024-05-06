import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnnouncementLinks, AuthLinks, InfrastructureLinks, ProfileLinks, UsersLinks } from "../tools/constants/links";
import { AnnouncementEditPage } from "./announcement/announcementEditPage";
import { AnnouncementPage } from "./announcement/announcementPage";
import { LoginPage } from "./auth/loginPage";
import { RegisterPage } from "./auth/registerPage";
import { ResetPasswordPage } from "./auth/resetPasswordPage";
import { HomePage } from "./home/homePage";
import { ProfilePage } from "./profile/profilePage";
import { UserPage } from "./users/userPage";

export function MainRouter() {
    return (
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path={InfrastructureLinks.home} element={<HomePage />} />
                    <Route path={AnnouncementLinks.search} element={<HomePage />} />

                    <Route path={AuthLinks.login} element={<LoginPage />} />
                    <Route path={AuthLinks.register} element={<RegisterPage />} />
                    <Route path={AuthLinks.resetPassword} element={<ResetPasswordPage />} />

                    <Route path={`${ProfileLinks.main}/*`} element={<ProfilePage />} />

                    <Route path={AnnouncementLinks.announcement} element={<AnnouncementPage />} />
                    <Route path={AnnouncementLinks.create} element={<AnnouncementEditPage />} />
                    <Route path={AnnouncementLinks.edit} element={<AnnouncementEditPage />} />

                    <Route path={UsersLinks.user} element={<UserPage />} />

                </Routes>
            </BrowserRouter>
        </StrictMode>
    )
}
