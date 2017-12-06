class repoListController {
    constructor(RepositoryService) {
        this.RepositoryService = RepositoryService;

        this.repositories = [];
        this.pages = null;
        this.searchQuery = '';
        this.isResponseFinalized = false;
    }

    getRepositories(query, page) {
        this.RepositoryService.getRepositories(query, page)
            .then(data => {
                this.repositories = data.repositories;
                this.pages = data.pages;
                this.isResponseFinalized = true;
            })
    }
}

repoListController.$inject = ['RepositoryService'];

export default repoListController;