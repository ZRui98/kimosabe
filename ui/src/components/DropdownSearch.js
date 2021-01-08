import React, {
  useRef,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDebounce } from '../utils/helpers';
import '../styles/dropdownsearch.css';

const DropdownSearch = ({
  suggestionsCallback,
  onSearch,
  debounceTime,
  showImage,
  ...other
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inFocus, setFocus] = useState(false);
  const alreadyRan = useRef(false);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceTime);

  useEffect(() => {
    let mounted = true;

    if (alreadyRan.current) {
      if (!debouncedSearchTerm || !/\S/.test(debouncedSearchTerm)) return;
      const promise = suggestionsCallback(debouncedSearchTerm);
      promise.then((suggestionsData) => {
        if (mounted) {
          const suggestionComponents = suggestionsData.map((suggestion) => (
            <Link
              to={suggestion.link}
              key={suggestion.id}
              className="suggestion-container"
            >
              <div className="suggestion">
                { showImage &&
                  <img
                    data-testid="suggestion-img"
                    alt={suggestion.imgUrl}
                    src={suggestion.imgUrl}
                  />
                }
                <div className="suggestiontitle">
                  {suggestion.text}
                </div>
              </div>
            </Link>
          ));
          setSuggestions(suggestionComponents);
        }
      });
    } else {
      alreadyRan.current = true;
    }
    return () => mounted = false;
  }, [suggestionsCallback, debouncedSearchTerm, showImage]);

  return (
    <div
      onFocus={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocus(true);
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocus(false);
        }
      }}
      className="dropdown"
      data-testid="dropdown"
    >
      <input
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
          }
        }}
      />
      { inFocus && searchTerm && /\S/.test(searchTerm) &&
        (<div className="suggestions" data-testid="suggestions">
          {suggestions}
          <div className="suggestfooter">
            results for &quot;{searchTerm}&quot;
          </div>
        </div>)
      }
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