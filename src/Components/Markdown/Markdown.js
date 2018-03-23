// should probably convert md with script and just render html here
// can still use this to style markdown
import {h, render, Component} from 'preact';
import markIt from 'markdown-it';
import styles from './Markdown.css';

class Markdown extends Component {
  md() {
    return new markIt();
  }

  render(props) {
    const md = this.md().render(props.markdown);
    return <div class={styles.Markdown} dangerouslySetInnerHTML={{__html: md}}></div>
  }
}

export default Markdown;
