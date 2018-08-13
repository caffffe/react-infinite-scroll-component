import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

export default class ListOf extends React.Component {
  constructor(props) {
    super(props);
    this.elementHeight = this.props.elementHeight;
    this.containerHeight = this.props.containerHeight;

    this.state = {
      // loading: this.props.isLoading,
      displayIndexStart: 0,
      displayIndexEnd: 15,
    };
  }
  componentDidMount() {
    if (this.props.displayBottomUpwards) {
      this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.containerHeight !== nextProps.containerHeight) {
      this.containerHeight = nextProps.containerHeight;
    }
  }
  shouldComponentUpdate(newProps, newState) {
    return true;
  }
  // shouldComponentUpdate(nextProps, newState) {
  //   return newState.displayIndexStart !== this.state.displayIndexStart;
  // }
  onScroll = (event) => {
    if (!event || event.target !== this.scrollContainer) {
      return;
    }
    if (this.props.isLoading && this.shouldLoad()) {
      return;
    }
    let indexStart = Math.floor(this.getScrollTop() / this.elementHeight);
    if (this.shouldLoad() && !this.props.isLoading) {
      this.props.onLoad();
      this.timeout = setTimeout(() => {
        if (this.props.displayBottomUpwards) {
          this.scrollContainer.scrollTop = 48 * this.elementHeight;
          indexStart = Math.floor(this.getScrollTop() / this.elementHeight);
          console.log(`indexStart${indexStart}`);
        }
        this.setState({
          displayIndexStart: indexStart,
          displayIndexEnd: indexStart + 15
        });
        clearTimeout(this.timeout);
      }, 1000);
    } else {
      this.setState({
        displayIndexStart: indexStart,
        displayIndexEnd: indexStart + 15
      });
    }
  }
  getScrollTop() {
    return this.scrollContainer.scrollTop;
  }
  getScrollBottom() {
    return this.scrollContainer.scrollHeight - this.scrollContainer.scrollTop;
  }
  getTopSpaceStyles() {
    const numberOfElements = React.Children.count(this.props.children);
    return this.computeSpacerStyles(Math.min(this.state.displayIndexStart, numberOfElements));
  }
  getBottomSpaceStyles() {
    const numberOfElements = React.Children.count(this.props.children);
    return this.computeSpacerStyles(Math.max(0, numberOfElements - this.state.displayIndexEnd - 1));
  }
  computeSpacerStyles(index = 0) {
    return {
      width: '100%',
      height: Math.ceil(index * this.elementHeight)
    };
  }
  shouldLoad = () => {
    const numberOfElements = React.Children.count(this.props.children);
    if (this.props.displayBottomUpwards) {
      return (this.scrollContainer.scrollTop <= 0);
    }
    return (this.scrollContainer.scrollTop
      >= this.elementHeight * numberOfElements - this.containerHeight);
  }
  render() {
    const numberOfElements = React.Children.count(this.props.children);
    const displayables = numberOfElements > 0 ? this.props.children.slice(
      this.state.displayIndexStart,
      this.state.displayIndexEnd
    ) : this.props.children;
    const loadingStyle = {
      height: `${this.elementHeight}px`
    };
    const containerStyle = {
      height: `${this.containerHeight}px`
    };
    const loadingSpinner = this.props.isLoading ? (
      <div className={styles.loading} height={loadingStyle}>
        loading...
      </div>) : null;
    const topSpacerStyles = this.getTopSpaceStyles();
    const bottomSpacerStyles = this.getBottomSpaceStyles();
    return (
      <div
        className={styles.infiniteContainer}
        style={containerStyle}
        ref={(el) => { this.scrollContainer = el; }}
        onScroll={this.onScroll}
      >
        <div className={styles.infiniteContent}>
          <div
            ref={(el) => { this.topSpacer = el; }}
            style={topSpacerStyles}
          />
          {this.props.displayBottomUpwards && loadingSpinner}
          {displayables}
          {!this.props.displayBottomUpwards && loadingSpinner}
          <div
            ref={(el) => { this.bottomSpacer = el; }}
            style={bottomSpacerStyles}
          />
        </div>
      </div>
    );
  }
}

ListOf.propTypes = {
  elementHeight: PropTypes.number,
  containerHeight: PropTypes.number,
  isLoading: PropTypes.bool,
  displayBottomUpwards: PropTypes.bool,
  children: PropTypes.node,
  onLoad: PropTypes.func.isRequired,
};
ListOf.defaultProps = {
  elementHeight: 50,
  containerHeight: 250,
  isLoading: false,
  displayBottomUpwards: false,
  children: []
};
