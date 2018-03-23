import { h, render, Component } from 'preact';
import App from './App';

const renderInto = document.getElementById('container');

render((
    <App />
  ),
  renderInto,
  renderInto.lastChild
);
