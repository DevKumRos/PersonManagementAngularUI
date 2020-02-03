import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePersonComponent } from './person/create-person.component';
import { ListPersonComponent } from './person/list-person.component';



const routes: Routes = [
  {path :'getAllPerson', component : ListPersonComponent},
  {path :'createPerson', component : CreatePersonComponent},
  {path :'', redirectTo: '/getAllPerson', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
