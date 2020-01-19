import React from 'react';
import PropTypes from 'prop-types';
import AddFishForm from './AddFishForm';
import EditFishForm from './EditFishForm';
import Login from './Login';
import firebase from 'firebase';
// in order to pass in the reference (all the subobjects after the store name in the database) to the database for our authhandler, we need to import both the default and named import from base.js
import base, {firebaseApp} from '../base';
class Inventory extends React.Component {

	static propTypes = {
		fishes: PropTypes.object, 
		updateFish: PropTypes.func,
		deleteFish: PropTypes.func,
		loadSampleFishes: PropTypes.func
	};

	// in this case we can set them both to null on page load
	// in order to persist the state to the app we need to set it also inside the render() method
	state = {
		uid: null,
		owner: null
	};


	// this allows us to check if a user has already logged into the app when we refresh it, so that if the user has already logged in it will immediately log back in automatically without having to trigger the login button
	// every time we load the page firebase will see if we are already authenticated and logged in, and it will return a user that we can pass into our authHandler method
	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			console.log(user);
			if(user) {
				this.authHandler({ user });
			}
		});
	};

	// async function that takes data from authenticate function
	authHandler = async (authData) => {
		console.log(authData)
		// look up the current store in the firebase database
		// if we want the fetch() output (or promise) to store the "store" variable and not the promise variable, need to put an await in front of it
		// in order to access the storeId, we must define it in the App.js and pass it down via props
		// {context : this } just gives the fetch function some info on how to best fetch the data
		const store = await base.fetch(this.props.storeId, { context : this });
		//console.log(store);
		// claim it if there is no owner (this is with the idea that there should be only one owner per store visited that can manage the inventory)
		if(!store.owner){
			//save it as our own, we are posting it to the owner field in the database, if there is none it will create it
			await base.post(`${this.props.storeId}/owner`, {
				// this refers to the unique identifier returned by the authData payload which gives us a unique identifier code for that user in the form of a hashed string
				// you can see it when authData is console.logged under user>uid>"c42bahBbuXMTPHZ8pU1rpl3LSwH3" (for examples)
				// with this in firebase itself we can see an ownser tab gets added underneath the fish with the above generated key
				data: authData.user.uid
			});
		};
		// set the state of the inventory component to reflect the current user
		// whenever anyone logs into a store, we need to figure out who is the current owner of the store and who is the the logged in user, and if they are the same people then we are going to allow them to make changes to the inventory otherwise we will display an error saying they are not owner
		// we have just setState on inventory, and this is only recommended when we have no intention of exporting any of the state data defined in this component, and therefore we can simply define it locally within the component
		// therefore we can also set the initial state above as we did in the App.js component as a state variable
		this.setState({
			uid: authData.user.uid,
			owner: store.owner || authData.user.uid
		});
	};
	// this function allows to pass in the parameters for authentication that are defined in Login.js
	// normally if this were a single auth provider, could just write firebase.auth.FacebookAuthProvider(), but since we have multiple providers we need to make it dyanmic
	// so can use square brackets to ref provider and dynamically looking up function 
	authenticate = (provider) => {
		//dynamically assign provider to authprovider function
		// we create a new authprovider based on what user wants to sign in with
		// square brackets reference the specific provider, and () to call the function
		const authProvider = new firebase.auth[`${provider}AuthProvider`]();
		console.log(authProvider);
		// take that firebaseApp and redirect it to the auth() function, add on the sign in with popup function and pass in the provider, then (if we do not do this we are not doing anything with the data we are receiving from .auth()) pass it to another function called authHabdler defined above
		// once we receive data from authprovider then authHandler will run
		firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
	};

	// will make this an async method as we first need to wait for user to be logged out of firebase
	logout = async () => {
		//console.log("logging out!")
		await firebase.auth().signOut();
		//clearing out the state by setting it to null 
		this.setState({ uid : null});

	};

	render() {
		const logout = <button onClick={this.logout}>Log Out!</button>;
		// check if user is logged in
		if(!this.state.uid) {
			return <Login  authenticate={this.authenticate}/>
		};
		// check if user is owner of the store
		if(this.state.uid !== this.state.owner) {
			return 	(
					<div>
						<p>Sorry you are not the owner!</p>
						{logout}
					</div>
				);
		};
		// they must be the owner, the just render the inventory
		return (
			<div className="inventory">
				<h2>Inventory</h2>
				{logout}
			{/*The addFish function is now being passed down from App to Inventory using .props, must then pass it down one more level to AddFishForm*/}
			{/*This line below will pass all the fish 1-9 as props on the EditFishForm empty forms, must then define the value of each of these fishes inside the actual editFishForm component (to see go to React, EditFishForm, and check the props of each of the EditFishForm components that were created) */}
			{/*Must pass updateFish via this.props.updateFish + in order for editfishForm to access key one component below, need to pass additional key as index*/}	
				{Object.keys(this.props.fishes).map(key => <EditFishForm key={key} index={key} fish={this.props.fishes[key]} updateFish={this.props.updateFish} deleteFish={this.props.deleteFish} />)}
				<AddFishForm addFish={this.props.addFish} />
				
			{/*When clicked, this button will trigger the function loadsamplefishes in the App component, which will set the fishes state to the sample-fishes available in the predefined fish file from the course*/}
				<button onClick={this.props.loadSampleFishes}>Load Sample Fishes</button>
			</div>
		);
	}
}


export default Inventory;