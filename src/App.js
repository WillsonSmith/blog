import {h, render, Component} from 'preact';
import * as entries from './blog/entries';
import Markdown from './Components/Markdown';

class App {
  render() {
    return (
      <div>
        { Object.values(entries).map((entry, index) => <div key="index"><Markdown markdown={entry}/></div>) }
      </div>
    )
  }
}

export default App;
