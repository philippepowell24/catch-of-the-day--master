import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { getFunName } from '../helpers';


class StorePicker extends React.Component {

	static propTypes = {
		history: PropTypes.object
	};

	// create the ref here
	myInput = React.createRef();
	// if you need to access 'this' inside of a custom method, must use syntax below
	// set gotostore to arrow function in order to make 'this' take the storepicker value and not remain undefined
	goToStore = (event) => {
		// stop the form from submitting
		event.preventDefault();
		// get the text from that . REF allows us in react to reference a DOM node on the page. One golden rule in React is DO NOT TOUCH DOM
		const storeName = this.myInput.current.value;
		// change the page to /store/whatever they entered
		this.props.history.push(`/store/${storeName}`);
	};
	render() {
		return (
		<form className="store-selector" onSubmit={this.goToStore}>
			<h2>Please enter a store</h2>
			<input 
				type="text"
				ref={this.myInput}
				required placeholder="Store Name" 
				defaultValue={getFunName()} 
			/>
			<button type="submit">Visit Store</button>
		</form>
		);
	}
}


export default StorePicker;