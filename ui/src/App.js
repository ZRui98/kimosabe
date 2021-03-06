import React from 'react';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { HomePage, LoginPage, RegisterPage, SearchPage, UserProfilePage, Error404Page } from './pages';
import VerifyPage from './pages/verify';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const query = useQuery();

  return (
    <Switch>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/register">
        <RegisterPage />
      </Route>
      <Route exact path="/user/:username">
        <UserProfilePage />
      </Route>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/search">
        <SearchPage searchTerm={query.get('term')} pageNum={query.get('page')} />
      </Route>
      <Route path="/verify">
        <VerifyPage token={query.get('token')} />
      </Route>
      <Route path="/404" component={Error404Page} />
      <Redirect path="*" to="/404" />
    </Switch>
  );
}

export default App;
