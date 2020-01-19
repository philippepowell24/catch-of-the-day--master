import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import StorePicker from './StorePicker';
import App from './App';
import NotFound from './NotFound';



const Router = () => {
	return (
		<BrowserRouter>
			{/* Switch will try first route, if it doesnt find it it will try second, etc, until it reaches NotFound if it cannot find any of the before routes*/}
			<Switch>
				<Route exact path="/" component={StorePicker} />
				<Route exact path="/store/:storeId" component={App} />
				<Route component={NotFound} />
			</Switch>
		</BrowserRouter>
	);
};


export default Router;