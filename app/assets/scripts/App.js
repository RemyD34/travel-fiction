import Person from "./modules/Person";

class Adult extends Person {
  payTaxes() {
    console.log(this.name + " now owes 0$ in taxes.");
  }
}

var John = new Person("John Doe", "Blue");
John.greet();

var Jane = new Adult("Jane Smith", "Orange");
Jane.greet();
Jane.payTaxes();
