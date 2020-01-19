import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {

// before setting state, must first set initial state
// a.k.a what the component looks like when it initially mounts
// in order to do this can set state to an object
	state = {
		fishes: {},
		order: {}
	};

	static propTypes = {
		match: PropTypes.object
	};

// in order to mirror state to the database, must use the lifecycle method componentDidMount which is a hook into the very first second that the component loads onto the page
// the following code block will directly sync the state of the app component with firebase, specifically only with the name of the store
// can do this by accessing the props of the Router component that gives us storeId	
// syncState also requires an object with a context and state to mirror
	componentDidMount() {
		const { params } = this.props.match;
		// first reinstate our localStorage
		const localStorageRef = localStorage.getItem(params.storeId);
		// sometimes will be visiting brand new store which doesnt require us loading localStorage
		if(localStorageRef) {
			///update the order to be localSorageRef, but since it is a string, must turn it back into an object using the opposite of JSON.stringify, which is JSON.parse
			this.setState({ order : JSON.parse(localStorageRef)});
		}
		this.ref = base.syncState(`${params.storeId}/fishes`, {
			context: this,
			state: 'fishes'
		});
	};

// using this method allows us to persist data to the local storage rather than the database which in turn lets us keep for example order state saved without losing it if the page refreshes, or if they navigate on website etc.
// to do this can use localStorage.setItem which takes in a (key,value) as parameters
// BUT if you run this, it will only return [object Object] because whenever you pass an object wherever a string is required (a.k.a function alert()), then it will return [object Object]
// so, use JSON.stringify, which converts the contents of the object into a string representation of the object on the value parameter
// in order to persist the changes, must add a localstorage reference inside componentDidMount()
	componentDidUpdate() {
		localStorage.setItem(this.props.match.params.storeId, JSON.stringify(this.state.order))	
	};


// if you only provide a componentDidMount it can risk in a memory leak in database as it will always be listening to new data, and not being told to stop listening when the application unmounts
// so basically if youre never unlistening for changes then it can cause app to crash, therefore can use another lifecycle method called componentWillUnmount()
	componentWillUnmount() {
		base.removeBinding(this.ref);
	};

// in order to grab the data from the createfish form into state, cannot directly grab it from the form itself as the method that updates state lives in the APP component, not the ADDFISHFORM component. Therefore, all methods that update state must live in the same component. In this case, must create a method that in turn references the data in the createfish form
// in order to get to AddFishForm, must first pass it to Inventory and then to AddFishForm. To pass it from inventory to AddfishForm must use props
	addFish = (fish) => {
		// in order to update state, must use setState
		// 1. take a copy of existing state
		const fishes = {...this.state.fishes};
		// 2. add our new fish to that fishes variable
		fishes[`fish${Date.now()}`] = fish;
		// 3. set the new fishes object to state 
		this.setState({
			fishes: fishes
		});
	};

	// this method reflects the changes made in the EditFishForm
	// this method takes in a key and an updated fish
	updateFish = (key, updatedFish) => {
		// take a copy of the current state
		// N.B not use props as this is the component in which state lives
		const fishes = {...this.state.fishes};
		// update that state
		fishes[key] = updatedFish;
		// set that to state
		this.setState({fishes: fishes});
	};


	// the following function allows us to delete a fish from state
	deleteFish = (key) => {
		// in comparison to removing an array which would be a lot simpler, because this is an object we must first take a copy of it  as state
		const fishes = {...this.state.fishes};
		// update the state (since we want Firebase to also remove the fish, we must first set it to null. Therefore we can pass through key the fish we want to remove)
		fishes[key] = null;
		// update state
		this.setState({fishes: fishes});


	};

	loadSampleFishes = () => {
		this.setState({fishes: sampleFishes});
	};


// since state of order lives in APP component, must define anything changing state of the order here
	addToOrder = (key) => {
		// take a copy of the initial state
		const order = {...this.state.order};

		// either add to the order or update the number in our order
		order[key] = order[key] + 1 || 1;
		//call setstate to update our state object
		this.setState({
			order: order
		});
	};

	// function to remove a fish from the order 
	removeFromOrder = (key) => {
		// take copy of the initial state
		const order = {...this.state.order};

		// delete the order key directly since we are not mirroring order state to firebase
		delete order[key];

		// call setState to update the order state
		this.setState({ 
			order : order 
		});
	};



	// next, how to get an item into state?
	// since we cannot update it directly from the AddFishForm component, must create an individual method inside the App component
	// this is because the methods that update state and the actual state itself always need to live in the exact same component 
	// in order to render out the fishes to the header component, you need to transport data using a made up prop called "details" which can then be used in Fish.js
	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market"/> 
						<ul className="fishes">
					{/*In order to avoid having to reference fish component several times, can use javascript loop functionality, in this case .map, or .forEach in an array (because JSX cannot process any functional logic aka conditionals, looping etc)*/}
					{/*Since our initial data is an object, can only use .map function on an array, so must use object.keys in order to convert the object to an array so can then use .map*/}
					{/*In order for react to be efficient, must give a unique identifier to every single fish by adding a "key" property (in this case key={key}, but the latter can be anything, not necessarily key)*/}
					{/*in order to access the fish KEY, or any other object key in state, you have to pass it a second time with a prop that is something other than key, in this case using a made up prop called 'index' which gives access to the key value*/}		
							{Object.keys(this.state.fishes).map(key => 
								(<Fish 
											key={key} 
											index={key}
											details={this.state.fishes[key]} 
											addToOrder={this.addToOrder}
										/>
									))}
						</ul>
				</div>
					<Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
					{/*the storeId must be defined so we can pass it down to inventory, to then be used in the authHandler function*/}
					<Inventory addFish={this.addFish} updateFish={this.updateFish} deleteFish={this.deleteFish} loadSampleFishes={this.loadSampleFishes} fishes={this.state.fishes} storeId={this.props.match.params.storeId} />
								
			</div>
		);
	}
}


export default App;