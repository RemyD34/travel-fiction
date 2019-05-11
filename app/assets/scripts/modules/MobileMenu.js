// import jquery. $ stands for jquery.
import $ from "jquery";

// Using class is the ES6 way of Javascript.
class MobileMenu {
  constructor() {
    // Selecting elements from the DOM with jquery.
    // Then activate events().
    this.siteHeader = $(".site-header");
    this.menuIcon = $(".site-header__menu-icon");
    this.menuContent = $(".site-header__menu-content");
    this.events();
  }
  // Event handling. menuIcon is waiting to be clicked.
  // When (the) menuIcon is clicked, do toggleTheMenu.
  events() {
    this.menuIcon.click(this.toggleTheMenu.bind(this));
  }
  // Defining functionality.
  // Toggling a class.
  toggleTheMenu() {
    this.menuContent.toggleClass("site-header__menu-content--is-visible");
    this.siteHeader.toggleClass("site-header--is-expanded");
    this.menuIcon.toggleClass("site-header__menu-icon--close-x");
  }
}

export default MobileMenu;
