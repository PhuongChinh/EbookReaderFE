import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppAuthorizationGuard } from "./app-authorization-guard";

const routes: Routes = [
  { path: "", redirectTo: "ui/landing", pathMatch: "full" },
  { path: "", loadChildren: () => import("./public/public.module").then(m => m.PublicModule) },
  {
    path: "",
    loadChildren: () => import("./home/home.module").then(m => m.HomeModule),
    canActivate: [AppAuthorizationGuard],
  },
  {
    path: "",
    loadChildren: () => import("./managers/managers.module").then(m => m.ManagersModule),
    canActivate: [AppAuthorizationGuard],
  },
  {
    path: "",
    loadChildren: () => import("./teachers/teachers.module").then(m => m.TeachersModule),
    canActivate: [AppAuthorizationGuard],
  },
  {
    path: "",
    loadChildren: () => import("./students/students.module").then(m => m.StudentsModule),
    canActivate: [AppAuthorizationGuard],
  },
  {
    path: "",
    loadChildren: () => import("./parents/parents.module").then(m => m.ParentsModule),
    canActivate: [AppAuthorizationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
