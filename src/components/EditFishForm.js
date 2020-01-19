// this component is to edit fish state directly in the app which will also sync to Firebase
// need to add it to inventory and app component
import React from "react";
import PropTypes from 'prop-types';



class EditFishForm extends React.Component {

	static propTypes = {
		updateFish: PropTypes.func,
		deleteFish: PropTypes.func,
		fish: PropTypes.shape({
			image: PropTypes.string,
			name: PropTypes.string,
			desc: PropTypes.string,
			status: PropTypes.string,
			price: PropTypes.number
		}),
		index: PropTypes.string

	};

// need to add a separate handleChange method that will listen to an 'edit' event, more specifically event.currentTarget which is the part the event got triggered on
// need to create an updated fish object that we can then push back upstream first through inventory then APP and then into the APP state
	handleChange = event => {
		// update that fish
		//take a copy of the current fish (...this.props.fish)
		// then, can use computed property names (this is the reason we specificed a name property in the form code underneath) 
		// so instead of having to specify a name, price, status, etc property with a value of event.currentTarget.value
		// can just dynamically allocate it using [event.currentTarget.name] : event.currentTarget.value
		//now can go refer it back in the App using a method called updateFish (see App.js)
		const updatedFish = {...this.props.fish, [event.currentTarget.name]: event.currentTarget.value};
		// updateFish function has been passed down through App and Inventory 
		this.props.updateFish(this.props.index,updatedFish);
	};

	render() {
		// because React does not like it when put state in an editable area, without necessarily having a plan to edit it, it does not like it because state will now live in two different places which could potentially cause problems. Therefore to prevent this it will make the input fields as read-only and will not allow them to edit state. One way to solve this is by adding onChange={this.handleChange}
		return <div className="fish-edit">
			<input type="text" name="name" onChange={this.handleChange} value={this.props.fish.name}/>		
			<input type="text" name="price" onChange={this.handleChange} value={this.props.fish.price}/>
			<select type="text" name="status" onChange={this.handleChange} value={this.props.fish.status}>
				<option value="available">Fresh!</option>
				<option value="unavailable">Sold Out!</option>
			</select>
			<textarea name="desc" onChange={this.handleChange} value={this.props.fish.desc}/>
			<input type="text" name="image" onChange={this.handleChange} value={this.props.fish.image}/> 
			{/*Since this is a simple function, we can pass it directly on the onClick event, but we could also define it separately just like we did for the handleClick function in Fish.js. this.props.index represents the fish key coming from the inventory component*/}
			<button onClick={() => this.props.deleteFish(this.props.index)}>Remove Fish</button>
		</div>;
	}
}


export default EditFishForm;