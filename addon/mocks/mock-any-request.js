import MockRequest from './mock-request';
import {
  isEmptyObject,
  isEquivalent,
  isPartOf,
  paramsFromRequestBody,
  toParams,
} from '../utils/helper-functions';
import FactoryGuy from '../factory-guy';

export default class MockAnyRequest extends MockRequest {
  constructor({ type = 'GET', url, responseText, status = 200 }) {
    super();
    this.responseJson = responseText;
    if (this.isErrorStatus(status)) this.errorResponse = responseText;
    this.url = url;
    this.type = type;
    this.status = status;
    this.setupHandler();
  }

  getUrl() {
    return this.url;
  }

  getType() {
    return this.type;
  }

  /**
   * Return some form of object
   *
   * @param json
   * @returns {*}
   */
  returns(json) {
    this.responseJson = json;
    return this;
  }

  paramsMatch(request) {
    if (!isEmptyObject(this.someQueryParams)) {
      let isMatch = this._tryMatchParams(
        request,
        this.someQueryParams,
        isPartOf
      );
      if (FactoryGuy.logLevel > 0) {
        const name = this.constructor.name.replace('Request', ''),
          type = this.getType(),
          status = `[${this.status}]`,
          url = this.getUrl();
        console.log(
          `[factory-guy] someQueryParams match? ${isMatch}`,
          name,
          type,
          status,
          url,
          'request params',
          toParams(request.queryParams),
          'handler params',
          toParams(this.queryParams)
        );
      }
      return isMatch;
    }

    if (!isEmptyObject(this.queryParams)) {
      let isMatch = this._tryMatchParams(
        request,
        this.queryParams,
        isEquivalent
      );
      if (FactoryGuy.logLevel > 0) {
        const name = this.constructor.name.replace('Request', ''),
          type = this.getType(),
          status = `[${this.status}]`,
          url = this.getUrl();
        console.log(
          `[factory-guy] queryParams match? ${isMatch}`,
          name,
          type,
          status,
          url,
          'request params',
          toParams(request.queryParams),
          'handler params',
          toParams(this.queryParams)
        );
      }
      return isMatch;
    }

    return true;
  }

  _tryMatchParams(request, handlerParams, comparisonFunction) {
    let requestParams = request.queryParams;

    if (/POST|PUT|PATCH/.test(this.type)) {
      requestParams = paramsFromRequestBody(request.requestBody);
    }
    return comparisonFunction(toParams(requestParams), toParams(handlerParams));
  }
}
