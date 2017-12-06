class RepositoryService {
    constructor($http) {
        this.$http = $http;
        this.repositoryUrl = `https://api.github.com/search/repositories?q=`;
    }

    getRepositories(query, page) {
        let url = page
            ? `${this.repositoryUrl}${query}in:name&per_page=10&page=${page}`
            : `${this.repositoryUrl}${query}in:name&per_page=10`;

        return this.$http.get(url)
            .then(response => {
                const links = response.headers().link;

                return {
                    repositories: response.data.items,
                    pages: links ? this.getPages(RepositoryService.linkParser(links)) : null
                }
            })
    }

    getPages(pages) {
        const getCurrentPage = obj => obj.next ? Number(obj.next) - 1 : Number(obj.prev) + 1;
        const createArrayFromCount = obj => {
            let arr = [];
            const count = Number(obj.last) || Number(obj.prev) + 1;
            for (let i = 1; i <= count; i++) {
                arr.push(i);
            }
            return arr;
        };

        return {
            pagesArray: createArrayFromCount(pages),
            pagesNavigation: Object.assign(pages, {currentPage: getCurrentPage(pages)})
        };
    }

    static linkParser(linkStr) {
        return linkStr.split(',').map(rel => {
            return rel.split(';').map((curr, idx) => {
                if (idx === 0) return /[^_]page=(\d+)/.exec(curr)[1];
                if (idx === 1) return /rel="(.+)"/.exec(curr)[1];
            })
        }).reduce((obj, curr) => {
            obj[curr[1]] = curr[0];
            return obj;
        }, {});
    }
}

RepositoryService.$inject = ['$http'];

export default RepositoryService;