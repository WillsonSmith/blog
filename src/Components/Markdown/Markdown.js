// should probably convert md with script and just render html here
// can still use this to style markdown
import {h, render, Component} from 'preact';
import styles from './Markdown.css';

class Markdown extends Component {

  render(props) {
    return <div class={styles.Markdown} dangerouslySetInnerHTML={{__html: md}}></div>
  }
}

export default Markdown;
