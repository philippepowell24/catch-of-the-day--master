import React from 'react';
import PropTypes from 'prop-types';
// in order for this data to be passed to inventory and order it must live at a higher level, because state can only be passed down from high to low level. Therefore need to reference it in App.js. 
class AddFishForm extends React.Component {
	
	nameRef = React.createRef(); 
	
	priceRef = React.createRef();
	
	statusRef = React.createRef();
	
	descRef = React.createRef();
	
	imageRef = React.createRef(); 

	static propTypes = {
		addFish: PropTypes.func
	};

	createFish = (event) => {
		// stop the form from submitting and page from refreshing
		event.preventDefault();

		const fish = {
			name: this.nameRef.current.value,
			price: parseFloat(this.priceRef.current.value),
			status: this.statusRef.current.value,
			desc: this.descRef.current.value,
			image: this.imageRef.current.value
		};
		// this function has been passed down from App.js component in order to grab the data being passed into the addfishform
		this.props.addFish(fish);
		// refresh the form after submit
		event.currentTarget.reset();
	};
// this is the logic to create the form structure and characteristics that can be found on inventory section
// in order to pull the values out of these inputs to be then used for e.g. state, can create references which is what is done above then attribute a key to the inputs to then mirror it to state
	render() {
		return (
			<form className="fish-edit" onSubmit={this.createFish}>
				<input name="name" ref={this.nameRef} type="text" placeholder="Name" />
				<input name="price" ref={this.priceRef} type="text" placeholder="Price" />
				<select name="status" ref={this.statusRef}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold out!</option>
				</select>
				<textarea name="desc" ref={this.descRef} placeholder="Desc" />
				<input name="image" ref={this.imageRef} type="text" placeholder="Image" />
				<button type="submit">+ Add Fish</button>
			</form>
		);
	}
}


export default AddFishForm;