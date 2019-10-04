import React from "react";
import { NavLink } from "react-router-dom";

import SignOut from "./auth/SignOut";

const NavbarUnAuth = () => (
  <ul>
    <li><NavLink to='/'>Home</NavLink></li>
    <li>
      <NavLink to='/search'>Search</NavLink>
    </li>
    <li>
      <NavLink to='signin'>Sign In</NavLink>
    </li>
    <li>
      <NavLink to='signup'>Sign up</NavLink>
    </li>
    </ul>
);

const NavbarAuth = ({ session }) => (
  <>
    <ul>
      <li><NavLink to='/'>Home</NavLink></li>
      <li>
        <NavLink to='/search'>Search</NavLink>
      </li>
      <li>
        <NavLink to='/recipe/add'>Add recipe</NavLink>
      </li>
      <li>
        <NavLink to='/profile'>Profile</NavLink>
      </li>
      <li>
        <SignOut />
      </li>
      </ul>
    <h2>hello { session.getCurrentUser.username }</h2>
  </>
);

const Navbar = ({ session }) => {
  return (
    <nav>
      { session && session.getCurrentUser ?
        <NavbarAuth  { ...{ session } } /> :
        <NavbarUnAuth /> }
    </nav>
  );
};

export default Navbar;
