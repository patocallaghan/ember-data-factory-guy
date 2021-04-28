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
      return this._tryMatchParams(
        request,
        this.someQueryParams,
        isPartOf,
        'withSomeParams'
      );
    }

    if (!isEmptyObject(this.queryParams)) {
      return this._tryMatchParams(
        request,
        this.queryParams,
        isEquivalent,
        'withParams'
      );
    }

    return true;
  }

  _tryMatchParams(request, handlerParams, comparisonFunction, matchType) {
    let requestParams = request.queryParams;

    if (/POST|PUT|PATCH/.test(this.type)) {
      requestParams = paramsFromRequestBody(request.requestBody);
    }

    let isMatch = comparisonFunction(
      toParams(requestParams),
      toParams(handlerParams)
    );

    if (FactoryGuy.logLevel > 0) {
      const name = this.constructor.name.replace('Request', ''),
        type = this.getType(),
        status = `[${this.status}]`,
        url = this.getUrl();
      console.log(
        `[factory-guy] ${matchType} match? ${isMatch}`,
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
}
