import React from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../helpers';
// in order to animate the orders by making slide in and out of order component, need to import these from this package
import {TransitionGroup, CSSTransition} from 'react-transition-group';


class Order extends React.Component {

	static propTypes = {
		fishes: PropTypes.object,
		order: PropTypes.object,
		removeFromOrder: PropTypes.func
	};
// if there is too much code in your render function, sometimes better to make either a separate component or a separate render functions, in this case renderOrder
	renderOrder = (key) => {
		const fish = this.props.fishes[key];
		const count = this.props.order[key];
		// must add in fish && in this expression as otherwise the localstorage will crash due to the syncstate of firebase function to render out all the fishes being slower than the localstorage render of the order state.
		const isAvailable = fish && fish.status === 'available';
		// in order to avoid repeating same lines of code several times, can simply put all the CSS options in one variable when they are identical
		const transitionOptions = {
			classNames : "order",
			key : key,
			timeout : {enter : 500, exit : 500}
		};
		// since there is a small delay in syncState rendering out fishes, this avoids any problems with the order component as it will render nothing until the fishes have been loaded onto the page
		if(!fish) return null;
		if(!isAvailable) {
		return (
				// since we have defined transitionOptions above in its own variable can just replace and mirror them using ...transitionOptions inside of a {}
				<CSSTransition {...transitionOptions}>
					<li key={key}>
						Sorry {fish ? fish.name : 'fish'} is no longer available
						<button onClick={() => this.props.removeFromOrder(key)}>&times;</button>
					</li>
				</CSSTransition>
			);
		}
		return (
			// this is to render out the CSS, wrap it in CSSTransition tags, give it a classNameS, key, and a timeout, which is an object that defines how long the animation takes to start and finish.
			// for counting numbers, to animate it with CSS its a little different as we are not mounting and unmounting, but replacing a old div with a new div
			// wrap the {count} in some <span> tags
			// wrap everything inside of the li in another span
			// wrap the count with a CSSTransitionGroup, then a TransitionGroup
			// add in the properties, in this case key is count as that is what we are animating 
			// the double {{}} means that, the first one is telling React that we are adding in javascript, and the second is simply the brackets to represent the object 

			<CSSTransition {...transitionOptions}>
				<li key={key}>
					<span>
						<TransitionGroup component="span" className="count">
								<CSSTransition classNames="count" key={count} timeout={{enter:500,exit:500}}>
									<span>{count}</span>
								</CSSTransition>
						</TransitionGroup> 
						lbs {fish.name}
						{" " + formatPrice(count * fish.price)}
						{/*this passes the removefromorder function from app,js. &times; makes button like a small cross. Can directly pass it the key from 2 lines above*/}
					<button onClick={() => this.props.removeFromOrder(key)}>&times;</button>
					</span>
				</li>
			</CSSTransition>

	);
};
	render() {
		// before we can add anything to order need to add an array of all the order IDs
		const orderIds = Object.keys(this.props.order);
		const total = orderIds.reduce((prevTotal,key) => {
			console.log(this.props);
			const fish = this.props.fishes[key];
			const count = this.props.order[key];
			const isAvailable = fish && fish.status === 'available';
			if(isAvailable) {
				return prevTotal + (count * fish.price);
			}
			return prevTotal;
		}, 0);
		return (
			<div className="order-wrap">
					<h2>Order</h2>
				{/*In order to add CSS to this, need to replace the UL tag with TransitionGroup tag, and give it a component property of "ul"*/}
					<TransitionGroup component="ul" className="order">
						{orderIds.map(this.renderOrder)}
					</TransitionGroup>
					<div className="total">
						Total: 
						<strong> {formatPrice(total)}</strong>
					</div>
			</div>
		);
	}
}


export default Order;