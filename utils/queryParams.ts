class QueryParams {
  urlParams: URLSearchParams
  constructor() {
    this.urlParams = new URLSearchParams(window.location.search);
  }
  get(param: string, list?: string[]) {
    if (list)
      list.includes(param) ? this.urlParams.get(param) : null
    return this.urlParams.get(param);
  }
  set(param: string, value: string) {
    this.urlParams.set(param, value)
    this.reflect_url() // reflect the url to the address bar
    return this.urlParams.get(param);
  }
  reflect_url() {
    history.replaceState(null, "", "?" + this.urlParams.toString());
  }

}
export default QueryParams
