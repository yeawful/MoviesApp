import { Component } from 'react';
import { Pagination, Alert } from 'antd';
import { debounce } from 'lodash';
import 'antd/dist/reset.css';

import './App.scss';
import Header from '../Header/Header.jsx';
import CardList from '../CardList/CardList.jsx';
import GenresContext from '../GenresContext/GenresContext';
import MoviesService from '../../services/MoviesService.jsx';

export default class App extends Component {
    constructor() {
        super();
        const savedSearchQuery = localStorage.getItem('searchQuery') || '';
        const savedActiveTab = localStorage.getItem('activeTab') || 'search';
        const savedRatings = JSON.parse(localStorage.getItem('ratingsCache') || '{}');
        const savedSessionId = localStorage.getItem('guestSessionId') || '';
        
        this.state = {
            pageNumber: 1,
            totalResults: 0,
            isOnline: navigator.onLine,
            searchQuery: savedSearchQuery,
            activeTab: savedActiveTab,
            guestSessionId: savedSessionId,
            genres: [],
            ratingsCache: savedRatings,
        };
        
        this.moviesService = new MoviesService();
        this.debouncedSearch = debounce(this.handleSearch, 100);
        this.handleNetworkChange = this.handleNetworkChange.bind(this);
    }

    componentDidMount() {
        this.abortController = new AbortController();
        
        const loadData = async () => {
            try {
                const [sessionData, genresData, popularMovies] = await Promise.all([
                    this.state.guestSessionId ? { guest_session_id: this.state.guestSessionId } : this.moviesService.createGuestSession({ signal: this.abortController.signal }),
                    this.moviesService.getGenres({ signal: this.abortController.signal }),
                    this.moviesService.getPopularMovies(1)
                ]);
    
                localStorage.setItem('guestSessionId', sessionData.guest_session_id);
                this.setState({ 
                    guestSessionId: sessionData.guest_session_id,
                    genres: genresData,
                    totalResults: popularMovies.totalResults
                });
            
                
                if (!this.state.searchQuery) {
                    this.setState({ movies: popularMovies.movies });
                }
            } catch (error) {
                this.abortController.abort();
                if (error.name !== 'AbortError') {
                    console.error('Initialization error:', error);
                    this.setState({ isError: true });
                }
            }
        };
    
        loadData();
        window.addEventListener('online', this.handleNetworkChange);
        window.addEventListener('offline', this.handleNetworkChange);
    }

    componentWillUnmount() {
        this.abortController.abort();
        this.debouncedSearch.cancel();
        window.removeEventListener('online', this.handleNetworkChange);
        window.removeEventListener('offline', this.handleNetworkChange);
    }

    handleSearch = (query) => {
        localStorage.setItem('searchQuery', query);
        this.setState({ searchQuery: query, pageNumber: 1 });
    };

    handleNetworkChange = () => {
        this.setState({ isOnline: navigator.onLine });
    };

    handlePageChange = (pageNumber) => {
        this.setState({ pageNumber });
    };

    setTotalResults = (count) => {
        this.setState({ totalResults: count });
    };

    handleTabChange = (tab) => {
        localStorage.setItem('activeTab', tab.key);
        this.setState({ activeTab: tab.key, pageNumber: 1 });
    };

    updateRatingsCache = (movieId, rating) => {
        this.setState((prev) => {
            const newRatingsCache = {
                ...prev.ratingsCache,
                [movieId]: rating,
            };
            localStorage.setItem('ratingsCache', JSON.stringify(newRatingsCache));
            return {
                ratingsCache: newRatingsCache,
            };
        });
    };

    handleRateMovie = async (movieId, rating) => {
        const { guestSessionId, ratingsCache } = this.state;
        try {
            await this.moviesService.rateMovie(movieId, rating, guestSessionId);
            
            const newRatingsCache = { ...ratingsCache };
            if (rating === 0) {
                delete newRatingsCache[movieId];
            } else {
                newRatingsCache[movieId] = rating;
            }
            
            localStorage.setItem('ratingsCache', JSON.stringify(newRatingsCache));
            
            this.setState({ 
                ratingsCache: newRatingsCache,
                pageNumber: this.state.activeTab === 'rated' ? 1 : this.state.pageNumber
            });
        } catch (error) {
            console.error('Error rating movie:', error);
        }
    };

    render() {
        const { pageNumber, totalResults, isOnline, searchQuery, activeTab, guestSessionId, genres } = this.state;

        return (
            <GenresContext.Provider value={genres}>
                <main className="app">
                    <Header
                        inputHandler={this.debouncedSearch}
                        inputValue={searchQuery}
                        activeTab={activeTab}
                        onTabChange={this.handleTabChange}
                        showSearch={activeTab === 'search'}
                    />

                    {!isOnline && (
                        <Alert
                            type="warning"
                            message="No internet connection"
                            description="Please check your network settings."
                            showIcon
                            closable
                            className="offline-alert"
                        />
                    )}

                    <CardList
                        moviesService={this.moviesService}
                        pageNumber={pageNumber}
                        searchQuery={searchQuery}
                        handlePageChange={this.handlePageChange}
                        setTotalResults={this.setTotalResults}
                        activeTab={activeTab}
                        guestSessionId={guestSessionId}
                        onRateMovie={this.handleRateMovie}
                        ratingsCache={this.state.ratingsCache}
                    />

                    <Pagination
                        className="pagination"
                        current={pageNumber}
                        onChange={this.handlePageChange}
                        total={Math.min(totalResults, 500 * 20)}
                        hideOnSinglePage
                        pageSize={20}
                        showSizeChanger={false}
                    />
                </main>
            </GenresContext.Provider>
        );
    }
}