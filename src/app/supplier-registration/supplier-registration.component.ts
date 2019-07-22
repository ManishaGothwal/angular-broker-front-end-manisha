import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Address } from '../models/address.model';
import { Subscription } from 'rxjs/Subscription';
import { UserNameValidator} from '../validators/username.validator';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-supplier-registration',
  templateUrl: './supplier-registration.component.html',
  styleUrls: ['./supplier-registration.component.css']
})
export class SupplierRegistrationComponent implements OnInit {
  registrationForm;
  
  username: FormControl;
  password: FormControl;
  company_name: FormControl;
  qualifications: FormArray;
  role: FormControl;
  machines: FormArray;
  abilities: FormControl;
  company_address: FormGroup;
  street: FormControl;
  nb: FormControl;
  postal_code: FormControl;
  city: FormControl; 


  qualifications_arr = [
    { id: 1, quali: 'ISO 9001' }, 
    { id: 2, quali: 'ISO 14001' },
    { id: 3, quali: 'ISO 10303' } 
  ];

  machines_arr = [
    { id: 'SMALL_SIMPLEX', type: 'Kleiner 3D-Drucker, Einfarbig'},
    { id: 'SMALL_DUPLEX', type: 'Kleiner 3D-Drucker, Zweifarbig'},
    { id: 'SMALL_SUPPORT', type: 'Kleiner 3D-Drucker, Mit Stützmaterial'},
    { id: 'LARGE_SIMPLEX', type: 'Großer  3D-Drucker, Einfarbig'},
    { id: 'LARGE_DUPLEX', type: 'Großer  3D-Drucker, Zweifarbig'},
    { id: 'LARGE_SUPPORT', type: 'Großer  3D-Drucker, Mit Stützmaterial'},
  ];

  capability_arr = [
    { id: 'ASSEMBLY_ASSISTANT', item: 'Montageassistent vorhanden'},
    { id: 'TRANSPORT_COOLING', item: 'Transportkühlung vorhanden'},
  ];

 

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private httpClient: HttpClient,
    ) {}

  

  ngOnInit() {
    this.userService.getUsersFromServer();

    const formControlsQ = this.qualifications_arr.map(control => new FormControl(false));
    const formControlsM = this.machines_arr.map(control => new FormControl(false));

    this.username = new FormControl('', [Validators.required, UserNameValidator(this.userService.getUsers())]);
    this.password = new FormControl('', Validators.required);
    this.company_name = new FormControl('', Validators.required);
    this.street = new FormControl('', Validators.required);
    this.nb = new FormControl('', Validators.required);
    this.postal_code = new FormControl('', Validators.required);
    this.city = new FormControl('', Validators.required);
    this.company_address = new FormGroup(
      {
        'street': this.street,
        'number': this.nb,
        'postal_code': this.postal_code,
        'city': this.city,
      }
    );
    this.qualifications = new FormArray(formControlsQ);
    this.role = new FormControl('', Validators.required);
    this.abilities = new FormControl('');
      
    this.registrationForm = this.formBuilder.group({
      'username': this.username,
      'password': this.password,
      'company_name': this.company_name,
      'company_address': this.company_address,
      'qualifications': this.qualifications,
      'role': this.role,
      machines: new FormArray(formControlsM),
      'abilities': '',
    });
  }

  onSubmit(supplierData){
    const newSupplier = new User(
      '',
      supplierData['username'],
      supplierData['password'],
      supplierData['company_name'],
      new Address(
        supplierData['company_address']['street'],
        supplierData['company_address']['number'],
        supplierData['company_address']['postal_code'],
        supplierData['company_address']['city'],
      ),
      this.convertMachine(supplierData),
      this.convertQualif(supplierData),
      supplierData['role'],
      this.convertCapa(supplierData),
    );
    console.warn('Your data have been submitted', newSupplier);
    this.userService.saveOneUserToServer(newSupplier);
    setTimeout(
      () => {
        this.authService.signIn(newSupplier);
        this.registrationForm.reset();
      }, 1000
    );
  }

convertMachine(supplierData) : string[] {
  let res = [];
  let initMach = supplierData['machines'] ? supplierData['machines'] : [];
  let i = 0;
  while (i<initMach.length){
    if (initMach[i]===true){
      res.push(this.machines_arr[i].id);
    };
    i++;
  }
  return res;
}

convertQualif(supplierData) : string[] {
  let res = [];
  let initQualif = supplierData['qualifications'] ? supplierData['qualifications'] : [];
  let i = 0;
  while (i<initQualif.length){
    if (initQualif[i]===true){
      res.push(this.qualifications_arr[i].quali);
    };
    i++;
  }
  return res;
}

convertCapa(supplierData) : string[] {
  let res = [];
  let initCapa = supplierData['abilities'] ;
  if (initCapa===true){
    if(supplierData['role']==='production'){
      res.push(this.capability_arr[0].id);
    }
    else{
       res.push(this.capability_arr[1].id);
    }
  }
  return res;
}


getQualifications() : FormArray {
  return this.registrationForm.get('qualifications') as FormArray;
}

getMachines() : FormArray {
  return this.registrationForm.get('machines') as FormArray;
}

goToAuth(){
  this.router.navigate(['/auth'])
}


}