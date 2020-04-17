import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoalsGraphsComponent} from './goals-graphs/goals-graphs.component';


const routes: Routes = [
  {path: '', component: GoalsGraphsComponent},
  {path: 'goals-graphs', component: GoalsGraphsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

