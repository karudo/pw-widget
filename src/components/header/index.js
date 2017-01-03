import { h, Component } from 'preact';
import style from './style';

export default class Header extends Component {
  render() {
    return (
      <header class={style.header}>
        <h1>Preact App</h1>
        <nav>tesy!</nav>
      </header>
    );
  }
}
