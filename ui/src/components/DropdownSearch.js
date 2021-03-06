import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDebounce } from '../hooks';
import { Input, Dropdown } from './index';

const DropdownSearch = ({ suggestionsCallback, onSearch, debounceTime, showImage, ...other }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const alreadyRan = useRef(false);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceTime);

  useEffect(() => {
    let mounted = true;

    async function populateSuggestions() {
      const suggestionsData = await suggestionsCallback(debouncedSearchTerm);
      const suggestionComponents = suggestionsData?.map((suggestion) => (
        <Link to={suggestion.link} data-testid="suggestion" key={suggestion.id} className="w-auto">
          <div className="flex border-b border-orange">
            {showImage && (
              <img
                data-testid="suggestion-img"
                alt={suggestion.imgUrl}
                src={suggestion.imgUrl}
                className="h-16 m-4 rounded-lg"
              />
            )}
            <div className="flex items-center m-4 ml-0 suggestiontitle">{suggestion.text}</div>
          </div>
        </Link>
      ));
      if (mounted) {
        setSuggestions(suggestionComponents);
      }
    }

    if (alreadyRan.current) {
      if (!debouncedSearchTerm || !/\S/.test(debouncedSearchTerm)) return;
      populateSuggestions();
    } else {
      alreadyRan.current = true;
    }

    return () => (mounted = false);
  }, [suggestionsCallback, debouncedSearchTerm, showImage]);

  return (
    <div data-testid="dropdown">
      <Dropdown
        content={suggestions}
        footer={`Results for "${searchTerm}"`}
        visible={searchTerm && /\S/.test(searchTerm)}
        data-testid="suggestions"
      >
        <Input
          type="text"
          data-testid="searchbar"
          {...other}
          onChange={(e) => {
            e.preventDefault();
            setSearchTerm(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
              onSearch(searchTerm);
              e.target.blur();
            }
          }}
        />
      </Dropdown>
    </div>
  );
};

DropdownSearch.propTypes = {
  // Callback used to fetch data for the suggestions
  // Returned data should be in this format:
  // {
  //   link: string - link to redirect to on click
  //   text: string - text to display for each suggestion
  //   imgUrl: string - url to image icon
  // }
  suggestionsCallback: PropTypes.func.isRequired,
  // function called when search is invoked by enter key
  onSearch: PropTypes.func,
  // time interval to wait between calls to suggestionsCallback
  debounceTime: PropTypes.number,
  // should images be shown for each suggestion
  showImage: PropTypes.bool,
};

export default DropdownSearch;
