import React from 'react';
import { render } from 'react-dom';
import './css/style.css';
import Router from './components/Router';


render(<Router />, document.querySelector('#main'));





// N.B. State is an object that stores data within a component that stores all the data that the component and its children need. State is the home of the data, props is the way to transport it from one place to another