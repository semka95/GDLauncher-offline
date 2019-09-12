// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { closeModal } from '../../../reducers/modals/actions';
import styles from './Modal.scss';

type Props = {
  history: any,
  style: {},
  header: boolean,
  title: string,
  backBtn: React.ReactNode,
  children: React.ReactNode
};

class Modal extends Component<Props> {
  render() {
    return (
      <div style={this.props.style}>
        {(this.props.header === undefined || this.props.header === true) && (
          <div className={styles.header}>
            <h3 style={{ display: 'inline-block' }}>
              {this.props.title || 'Modal'}
            </h3>
            <div className={styles.closeBtn} onClick={() => closeModal())}>
              <FontAwesomeIcon icon={faWindowClose} />
            </div>
          </div>
        )}
        <div
          className={styles.modalContent}
          style={{
            height:
              this.props.header === undefined || this.props.header === true
                ? 'calc(100% - 30px)'
                : '100%'
          }}
        >
          {this.props.backBtn !== undefined && this.props.backBtn}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { closeModal }
)(Modal);
