import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteListOf from '../../src/components/InfiniteListOf';
import styles from './styles.scss';

function ListItem({ key, value}) {
  return (
    <div key={key} style={{ height: 50}} className={styles.item}>
      item {value}
    </div>
  )
}

export class InfiniteList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        elements: this.buildElements(0, 50)
      };
    }
    buildElements(start, end) {
      const elements = [];
      for (var i = start; i < end; i++) {
        elements.push(<ListItem key = {i} value = {i}/>);
      }
      return elements;
    }
    handleInfiniteLoad = () => {
      this.setState({
        isLoading: true
      });
      setTimeout(() => {
        const elemLength = this.state.elements.length;
        const newElements = this.buildElements(elemLength, elemLength + 50);
        this.setState({
          isLoading: false,
          elements: this.state.elements.concat(newElements)
        })
      }, 1000);
    }
    render(){ 
      return(
        <div>
          <InfiniteListOf
            elementHeight={50}
            containerHeight={200}
            onLoad={this.handleInfiniteLoad}
            isLoading={this.state.isLoading}
            className={styles.container}
          >
          {this.state.elements}
          </InfiniteListOf>
        </div>
      );
    }
  }
  ReactDOM.render(<InfiniteList />, document.getElementById('viewport'));
  