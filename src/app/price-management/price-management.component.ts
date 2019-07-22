import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../models/user.model';
import { Capacity } from '../models/capacity.model';
import { Discount } from '../models/discount.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-price-management',
  templateUrl: './price-management.component.html',
  styleUrls: ['./price-management.component.css']
})
export class PriceManagementComponent implements OnInit {
  loggedUser: User;
  userSubscription: Subscription;
  public priceManagementForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private httpClient: HttpClient,
    private router: Router,
  ) {}
  
  addDiscounts(){
    const control = <FormArray>this.priceManagementForm.controls['discounts'];
    control.push(this.formBuilder.group({
        date: [''],
        percentage: ['']
      }));
  }


  ngOnInit() {
    if(this.authService.getActualUser()){
      this.userSubscription = this.authService.userSubject.subscribe(
        (user: User) => {
          this.loggedUser = user;
        }
      );
      this.authService.emitUserSubject();
    }
    this.priceManagementForm = this.formBuilder.group({
     // default_price: [''],
      discounts: this.formBuilder.array([
        this.formBuilder.group({
          date: [''],
          percentage: [''],
          availability : ['']
        }),
        
      ])
    });
  }

  ngOnDestroy() {
   if(this.authService.getActualUser()){
    this.userSubscription.unsubscribe();
  }
  }

  onSubmitDiscounts(priceData){
    
    const newDiscounts = {
      discounts: this.getDiscounts(priceData),
    };
    const id = this.loggedUser['id'];
    this.httpClient
      .post('https://dpnb-broker.firebaseio.com/capacities/'+id+'.json', newDiscounts)
      .subscribe(
        (val) => {
          console.warn('Your data have been submitted', newDiscounts);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      );    

    setTimeout(
      ()=>{
        this.priceManagementForm.reset();
        this.router.navigate(['/user-stats']);
      }, 2000
    )
  }

  onSubmitPrice(preis){
    const price=preis.value;
    const id = this.loggedUser['id'];
    this.httpClient
      .put('https://dpnb-broker.firebaseio.com/capacities/'+id+'/default_price.json', price)
      .subscribe(
        (val) => {
          console.warn('Your data have been submitted', price);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      ); 
    setTimeout(
      ()=>{
        this.router.navigate(['/user-stats']);
      }, 2000
    )
  }

  onSubmitMinPrice(minpreis){
    const minprice= minpreis.value;
    const id = this.loggedUser['id'];
    this.httpClient
      .put('https://dpnb-broker.firebaseio.com/capacities/'+id+'/minimumprice.json', minprice)
      .subscribe(
        (val) => {
          console.warn('Your data have been submitted', minprice);
        },
        error => {
          console.log('Erreur ! : ' + error);
        },
        () =>{
          console.log('Data saved');
        },
      ); 
    setTimeout(
      ()=>{
        this.router.navigate(['/user-stats']);
      }, 2000
    )

  }

  getDiscounts(priceData){
    let res = [];
    
    for (let a in priceData['discounts']){
      if((priceData['discounts'][a]['availability'])===false){
        let  perc= priceData['discounts'][a]['percentage']}
      else{
        let perc =999;
      }
        res.push({
          date: priceData['discounts'][a]['date'], 
          percentage: perc,
        })
    }
    return res;
  }

  goToUserStats(){
    this.router.navigate(['/user-stats'])
  }

}