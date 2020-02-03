import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder ,Validators } from '@angular/forms';
import { PersonService } from './person.service';
import { IPerson } from './IPerson';
import { Router, ActivatedRoute, ParamMap } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-create-person',
  templateUrl: './create-person.component.html',
  styleUrls: ['./create-person.component.css']
})
export class CreatePersonComponent implements OnInit {
  personForm : FormGroup;
  displayMessage: string;
  isEditFlow:boolean;
  buttonName: string;
  editPerson: IPerson;
  constructor(private fb: FormBuilder,private _personService: PersonService,
    private router: Router, private route: ActivatedRoute) { 
    this.isEditFlow = false;
    this.buttonName = "Create Person";
    console.log("Entered CreatePersonComponent");
  }

  ngOnInit() {
    this.displayMessage = "";
    this.buttonName = "Create Person";
    this.personForm =  this.fb.group({
      first_name : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      last_name : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      age : ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      favourite_colour : ['', [Validators.required, Validators.minLength(2)]],
      hobby : ['']
    });
    console.log("Before Form Value Setup = ", this.personForm.value);
    this.route.paramMap.subscribe((params: ParamMap) => {
      if(params.get('person') != null ) {
        console.log("personLoad1 : "+params.get('person'));
        let personLoad:IPerson= JSON.parse(params.get('person'));
        this.editPerson = personLoad;
        this.personForm.patchValue({
          first_name :personLoad.first_name,
          last_name :personLoad.last_name,
          age :personLoad.age,
          favourite_colour:personLoad.favourite_colour,
          hobby:personLoad.hobby
        });
        this.isEditFlow=true;
        this.buttonName = "Save Person";
        console.log("FOrm Value = ", this.personForm.value);
      }
      
    });
  }

  onSubmit(): void {
    console.log("FOrm Value = ", this.personForm.value);
    
    this.personData['first_name']=this.personForm.value['first_name'];
    this.personData['last_name']=this.personForm.value['last_name'];
    this.personData['age']=this.personForm.value['age'];
    this.personData['favourite_colour']=this.personForm.value['favourite_colour'];
    
    console.log("hobbies= "+this.personData);
    if(this.isEditFlow) {
      this.personData['hobby']=this.personForm.value['hobby'];
      this.personData['personId'] =''+this.editPerson.personId;
      this._personService.updatePerson(this.personData).subscribe(
        (response)=> {
          this.displayMessage ="Person Information Updated Successfully"
          this.router.navigate(['/getAllPerson', {message:this.displayMessage}]);
        },
        (err) => console.log(err) );
    }else {
      var hobbies = this.personForm.value['hobby'].split(',');
      this.personData['hobby']=hobbies;
      this._personService.addPerson(this.personData).subscribe(
        (response)=> {
          this.displayMessage ="Person Created Successfully"
          this.router.navigate(['/getAllPerson', {message:this.displayMessage}]);
        },
        (err) => console.log(err) );
    }
   }

 
   personData = {
    'personId' : '', 
   'first_name' : '',
    'last_name' : '',
    'age' : '',
    'favourite_colour':'',
    'hobby':''
  } 

   formErrors = {
    'first_name' : '',
    'last_name' : '',
    'age' : '',
    'favourite_colour':''
  }

  validationMessgaes = {
    'first_name' : {
      'required' : 'First Name is required',
      'minlength' : 'First Name minimum length should be greater than 2',
      'maxlength' : 'First Name max length should be less than 20'
    },
    'last_name' : {
      'required' : 'Last Name is required',
      'minlength' : 'Last Name minimum length should be greater than 2',
      'maxlength' : 'Last Name max length should be less than 20'
    },
    'age' : {
      'required' : 'Age is required',
      'pattern' : 'Only Numeric number allowed'
    },
    'favourite_colour' : {
      'required' : 'Favourite colour is required',
      'minlength' : 'Favourite colour should be mininmum 2'
    }
  }

  logValidationErrors(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if(abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key]="";
        if( abstractControl && !abstractControl.valid && abstractControl.touched){
          const messages = this.validationMessgaes[key];
          for(const errorKey in abstractControl.errors) {
            if(errorKey) {
              //console.log("key -->"+key+", errorKey-->"+errorKey);
              this.formErrors[key]+= messages[errorKey] + ' ';
            }
          }
           
        }
      }
    });
  }

  onLoadData() : void {
    console.log("Tested = "+this.personForm);
    this.logValidationErrors(this.personForm);
    console.log(this.formErrors);
  }
}
