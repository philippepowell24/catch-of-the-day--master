import React from 'react';

// when passing such an application to someone else to use, it may be difficult for them to know exactly what kinda data is expected from the application when using the props in the app
// in this case for example, we know props.tagline is expecting to be passed a string, but how can we inform someone else using it that it is a string without them having to test it
// we can use propTypes, which basically act as a primary form of data validation in which we can notify the user what a specific component expects to be passed inside it
// if the user does not pass the proptypes we can warn them via for example a console.log
import PropTypes from 'prop-types';



// if your component just gets passed in data and returns some JSX, then you can turn it into a stateless component, which is just a function with a return statement 
const Header = (props) => {
	return (
			<header className="top">
				<h1>
					Catch 
					<span className="ofThe">
						<span className="of">Of</span>
						<span className="the">The</span>
					</span> 
					Day
				</h1>
				<h3 className="tagline">
			{/* Before when this was a component, had to use this.props.tagline, but when its a function you just have to pass it props, and refer to it as props.tagline */}
					<span>{props.tagline}</span>
				
				</h3>
			</header>		
	);
};

// this therefore now defines that tagline must be passed a string, and it is required in order for the app to function
// therefore if someone were to alter or delete the tagline prop in the APP.js component (see where tagline is defined under the render() ) such that it is no longer a string, the console will throw an error
// when defining proptypes in a component, if the component is just composed of a stateless functional component (const Header), we can define proptypes outside of it underneath, like here
Header.propTypes = {
	tagline: PropTypes.string.isRequired
};


export default Header;