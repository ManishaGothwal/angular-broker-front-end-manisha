import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Capacity } from '../models/capacity.model';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit {

//  @Input() supplierId : string;
  loggedUser: User;
  userSubscription: Subscription;
  capacities: Capacity[];
  capaSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    if(this.authService.getActualUser()){
      //console.log(this.authService.getActualUser());
      this.userSubscription = this.authService.userSubject.subscribe(
        (user: User) => {
          this.loggedUser = user;
        }
      );
      this.authService.emitUserSubject();
    };
    this.authService.getUserCapacities();
    if(this.authService.getActualUserCapacities()){
      this.capaSubscription = this.authService.capacitiesSubject.subscribe(
        (capa: Capacity[]) => {
          this.capacities = capa;
      });
      
      this.authService.emitCapaSubject();
    };
    console.log('capa: ',this.capacities);
    
  }

  ngOnDestroy(){
    this.capacities.splice(0,this.capacities.length);
  }

  goToPriceManagement(){
    this.router.navigate(['/price-management'])
  }

  onSignOut() {
    this.authService.signOut();
  /*  location.reload();*/
  
  }

}