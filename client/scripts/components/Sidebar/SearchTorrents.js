import {formatMessage, injectIntl} from 'react-intl';
import classnames from 'classnames';
import React from'react';

import Close from '../Icons/Close';
import EventTypes from '../../constants/EventTypes';
import Search from '../Icons/Search';
import TorrentFilterStore from '../../stores/TorrentFilterStore';
import UIActions from '../../actions/UIActions';

const METHODS_TO_BIND = [
  'handleExternalSearchChange',
  'handleSearchChange',
  'resetSearch'
];

class SearchBox extends React.Component {
  constructor() {
    super();

    this.state = {
      searchValue: ''
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    TorrentFilterStore.listen(EventTypes.UI_TORRENTS_FILTER_SEARCH_CHANGE,
      this.handleExternalSearchChange);
  }

  componentWillUnmount() {
    TorrentFilterStore.unlisten(EventTypes.UI_TORRENTS_FILTER_SEARCH_CHANGE,
      this.handleExternalSearchChange);
  }

  handleExternalSearchChange() {
    this.setState({searchValue: TorrentFilterStore.getSearchFilter()});
  }

  handleSearchChange(event) {
    let searchValue = event.target.value;
    this.setState({searchValue});
    UIActions.setTorrentsSearchFilter(searchValue);
  }

  isSearchActive() {
    return this.state.searchValue !== '';
  }

  resetSearch() {
    this.setState({searchValue: ''});
    UIActions.setTorrentsSearchFilter('');
  }

  render() {
    let clearSearchButton = null;
    let classes = classnames({
      'sidebar__item': true,
      'search': true,
      'is-in-use': this.isSearchActive()
    });

    if (this.isSearchActive()) {
      clearSearchButton = (
        <div className="button search__reset-button" onClick={this.resetSearch}>
          <Close />
        </div>
      );
    }

    return (
      <div className={classes}>
        {clearSearchButton}
        <Search />
        <input className="textbox"
          type="text"
          placeholder={this.props.intl.formatMessage({
            id: 'searchbox.placeholder',
            defaultMessage: 'Search torrents'
          })}
          onChange={this.handleSearchChange}
          value={this.state.searchValue} />
      </div>
    );
  }
}

export default injectIntl(SearchBox);
