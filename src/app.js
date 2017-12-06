import angular from 'angular';

import RepositoryService from './services/repository.service';

import RepoListComponent from './components/repoList/repoList.component';

const app = angular.module('app', ['templatesCache']);

app.service('RepositoryService', RepositoryService);

app.component('repoList', RepoListComponent);