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
      value: [],
      cursorPos: 0,
    };
  }

  componentDidMount() {
    this.input.addEventListener('keyboard-btn', this.handleChange);
    this.input.addEventListener('keyboard-delete', this.handleDelete);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      const length = this.state.value.length;
      this.state.input.focus();
      this.state.input.select();
      this.state.input.setSelectionRange(length, length);
    }
  }

  handleChange(e) {
    const { cursorPos } = this.state;
    const pos = cursorPos + 1;
    if (e.type === 'keyboard-btn') {
      this.input.focus();
      this.setState((prevState) => {
        const nextValue = prevState.value;
        nextValue.splice(cursorPos, 0, e.detail);
        return ({
          input: e.target,
          value: nextValue,
          cursorPos: e.target.selectionStart >= 0 ? pos : e.target.selectionStart,
        });
      });
    }
  }

  handleClick(e) {
    this.setState({
      cursorPos: e.target.selectionStart,
    });
  }

  handleDelete() {
    const { cursorPos } = this.state;
    const pos = cursorPos - 1;
    this.setState((prevState) => {
      const nextValue = prevState.value;
      nextValue.splice(pos, 1);
      return ({
        value: nextValue,
        cursorPos: cursorPos > 0 ? pos : 0,
      });
    });
  }

  handleFocus() {
    // Prevent blinking of the keyboard if opaque
    setTimeout(() => {
      if (this.state.input) {
        this.input.scrollLeft = this.input.scrollWidth;
      }
      this.setState({ showKeyboard: true });
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
          value={this.state.value.join('')}
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
