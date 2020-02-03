import { Component, OnInit } from '@angular/core';
import { IPerson } from './IPerson';
import { PersonService } from './person.service';
import { ActivatedRoute, ParamMap, Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-list-person',
  templateUrl: './list-person.component.html',
  styleUrls: ['./list-person.component.css']
})
export class ListPersonComponent implements OnInit {
  persons:IPerson[];
  displayMessage:string;
  constructor(private _personService: PersonService, private route: ActivatedRoute,private router: Router) { 
    console.log("Entered List Person");
    this.displayMessage="";
  }

  ngOnInit() {
 
    this._personService.getPersons().subscribe(
      (personList) =>{
        console.log("personList : "+personList['person']);
        this.persons = personList['person'];
        console.log("this.displayMessage :"+this.displayMessage );
        this.route.paramMap.subscribe((params: ParamMap) => {
          let message = params.get('message');
          console.log("Enter message section : "+message);
          this.displayMessage = message;
        });
      },
      (err) => console.log(err)
    );

  }

  deletePersonById(person: IPerson) {
    this._personService.deletePerson(person.personId).subscribe(
      (response) => {
        this.displayMessage = "Person Deleted Successfully";
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
        this.router.navigate(['/getAllPerson', {message:this.displayMessage}]);
      },
      (err) => console.log(err)
    );

  }
  getPersonById(person: IPerson) {
    console.log("getPersonById");
    this._personService.getPerson(person.personId).subscribe(
      (response) => {
        let personStr = JSON.stringify(response['person'][0])
        this.router.navigate(['/createPerson', {person:personStr}]);
      },
      (err) => console.log(err)
    );
  }

}
