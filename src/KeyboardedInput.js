import React from 'react';
import PropTypes from 'prop-types';
import Keyboard from './Keyboard';

class KeyboardedInput extends React.Component {
  static propTypes = {
    name: PropTypes.any,
    inputClassName: PropTypes.any,
    keyboardClassName: PropTypes.any,
    placeholder: PropTypes.any,
    type: PropTypes.any,
    min: PropTypes.any,
    max: PropTypes.any,
    step: PropTypes.any,
    pattern: PropTypes.any,
    readOnly: PropTypes.any,
    enabled: PropTypes.any,
    defaultKeyboard: PropTypes.any,
    secondaryKeyboard: PropTypes.any,
    opacity: PropTypes.any,
    isFirstLetterUppercase: PropTypes.any,
    uppercaseAfterSpace: PropTypes.any,
    dataset: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleFocusLost = this.handleFocusLost.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.hideKeyboard = this.hideKeyboard.bind(this);

    this.state = {
      showKeyboard: false,
      input: null,
      value: '',
      cursorPos: 0,
    };
  }

  componentDidMount() {
    this.input.addEventListener('keyboard-btn', this.handleChange);
    this.input.addEventListener('keyboard-delete', this.handleDelete);
    // console.log(this.input.selectionStart)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      const length = this.state.value.length;
      this.state.input.focus();
      this.state.input.select();
      this.state.input.setSelectionRange(length, length);
    }
  }

  componentWillUnmount() {
    this.input.addEventListener('keyboard-btn', this.handleChange);
  }

  handleChange(e) {
    // if (e.type === 'keyboard-btn') {
    const { value } = this.state;
    const nextValue = value.slice(0, e.target.selectionStart) + e.detail + value.slice(e.target.selectionStart);
    this.setState({
      input: e.target,
      value: nextValue,
      cursorPos: e.target.selectionStart + 1,
    });
      // console.log(value.slice(0, e.target.selectionStart), e.detail, value.slice(e.target.selectionStart));
      setTimeout(() => {
        console.log('change', this.state, e.target.selectionStart);
      }, 0);
    // }
  }

  handleClick(e) {
    e.persist();
    this.setState({
      cursorPos: this.state.value.length ? e.target.selectionStart : 0,
    });
    setTimeout(() => {
      console.log('click', this.state, e.target.selectionStart);
    }, 0);
  }

  handleDelete(e) {
    console.log(this.state.cursorPos)
    const { value, cursorPos } = this.state;
    const nextValue = value.replace(value.substring(cursorPos - 1, cursorPos), '');
    const nextPosition = value.indexOf(cursorPos);
    this.setState({
      value: nextValue,
      cursorPos: e.target.selectionStart > 0 ? cursorPos - 1 : 0,
    });
    setTimeout(() => {
      console.log('delete', this.state, e.target.selectionStart);
    }, 0);
  }

  handleFocus() {
    // Prevent blinking of the keyboard if opaque
    setTimeout(() => {
      if (typeof (this.state.value) !== 'undefined') {
        if (this.state.input) this.state.input.scrollLeft = this.state.input.scrollWidth;
        this.setState({ showKeyboard: true });
      }
    }, 0);
  }

  handleFocusLost() {
    const that = this;
    setTimeout(() => {
      if (!document.activeElement.classList.contains('keyboard-button') && !document.activeElement.classList.contains('keyboard') && !document.activeElement.classList.contains('keyboard-row')) {
        that.setState({ ...that.state, showKeyboard: false });
      }
    }, 0);
  }

  hideKeyboard() {
    this.setState({ ...this.state, showKeyboard: false });
  }

  render() {
    return (
      <div>
        <input
          name={this.props.name}
          className={this.props.inputClassName}
          placeholder={this.props.placeholder}
          value={this.state.value}
          type={this.props.type}
          onFocus={this.handleFocus}
          onBlur={this.handleFocusLost}
          onClick={this.handleClick}
          onChange={this.handleChange}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          pattern={this.props.pattern}
          readOnly={this.props.readOnly === true}
          ref={(e) => { this.input = e; }}
        />
        {this.state.showKeyboard && this.props.enabled && this.props.readOnly !== true &&
        <Keyboard
          hideKeyboard={this.hideKeyboard}
          defaultKeyboard={this.props.defaultKeyboard}
          secondaryKeyboard={this.props.secondaryKeyboard}
          inputNode={this.input}
          dataset={this.props.dataset}
          opacity={this.props.opacity}
          isFirstLetterUppercase={this.props.isFirstLetterUppercase}
          uppercaseAfterSpace={this.props.uppercaseAfterSpace}
          keyboardClassName={this.props.keyboardClassName}
        />
        }
      </div>
    );
  }
}

export default KeyboardedInput;
