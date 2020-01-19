import React from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../helpers';
// this component makes it so you do not have to list every individual fish in the app component, makes it more reusbale and cleaner
class Fish extends React.Component {
	// since this is a regular react component, can add the proptype inside the component directly like here
	// N.B. It is a good idea to define proptypes as soon as you create a new prop to avoid complications later down the line once all code is written 
	// static means we are declaring the proptypes for all of the fish, so that every single time we make a new fish we are not duplicating these propTypes unecessarily
	static propTypes = {
		// technically we could refer to details as simply propTypes.object, but to be on the safer side we should use shape() to specify exactly what to place inside that object, as simply object is too generic as it could refer to any object
		// if we used .object it would fail if we were not passing exactly what this object should be. Shape() therefore allows us to be a lot more specific
		details: PropTypes.shape({
			image: PropTypes.string,
			name: PropTypes.string,
			desc: PropTypes.string,
			status: PropTypes.string,
			price: PropTypes.number
		}),
		addToOrder: PropTypes.func
	};
	// this function, when added to the button below will add fishes to the order state based on the custom 'index' key defined in APP component
	handleClick = () => {
		this.props.addToOrder(this.props.index)
	};

	render() {
		// you can use ES6 destructuring to set multiple variables that have same main value at the same time, e.g. if they all have this.props.details in common
		const {image,name,price,desc,status} = this.props.details;
		// create a boolean variable to then attach it to button below, so that when it is no longer available the button is disabled
		const isAvailable = status === 'available';

// so thanks to the shortcut above, now if you reference image below or name, it's actually this.props.details.image, or this.props.details.name
		return (
			<li className="menu-fish">
				<img src={image} alt={name} />
				<h3 className="fish-name">
					{name}
					<span className="price">{formatPrice(price)}</span>
				</h3>
				<p>{desc}</p>
				{/*In order to apply a condition to the button, can include a conditional statement using ? as 'then' and : as 'else. So if isAvaialble is true then Add To Order otherwise Sold out*/}
				{/*instead of defining a separate handleclick function etc to import addToOrder, can also directly reference it in shorthand with () => this.props.addToOrder(this.props.index) */}
				<button disabled={!isAvailable} onClick={this.handleClick}>
					{isAvailable ? 'Add To Order' : 'Sold Out'}
				</button>	
			</li>
		);
	}
}


export default Fish;