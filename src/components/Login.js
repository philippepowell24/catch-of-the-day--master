import React from 'react';
import PropTypes from 'prop-types';

// because this is a stateless functional component, there is no this.props, just props, and make sure to remember to pass it into the function as well
const Login = (props) => (
	<nav className="login">
		<h2>Inventory Login</h2>
		<p>Sign in to manage your store's inventory.</p>
		<button className="facebook" onClick={() => props.authenticate('Facebook')}>Log In with Facebook</button>
	</nav>
);


// although we did not specify .isRequired in other proptype declarations of our APP, it is better practice to do so unless you know you have a default input to fall back on if the user does not pass in correct data
Login.propTypes = {
	authenticate: PropTypes.func.isRequired
}

export default Login;