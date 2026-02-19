import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
import { BASE_URL } from './utils/constants';

export async function postmanApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const options: {
		method: IHttpRequestMethods;
		baseURL: string;
		url: string;
		qs?: IDataObject;
		body?: IDataObject;
		json: boolean;
	} = {
		method,
		baseURL: BASE_URL,
		url: endpoint,
		json: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	return this.helpers.httpRequestWithAuthentication.call(this, 'postmanApi', options) as Promise<IDataObject>;
}
