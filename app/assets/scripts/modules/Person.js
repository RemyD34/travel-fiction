class Person {
  constructor(fullName, favoriteColor) {
    this.name = fullName;
    this.favColor = favoriteColor;
  }
  greet() {
    console.log("Hi there, my name is " + this.name + " and my favorite color is " + this.favColor + ".");
  }
}

export default Person;
