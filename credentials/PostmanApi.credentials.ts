import type {
  Icon,
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';
import { BASE_URL, DOCS_URL, ENDPOINTS } from '../nodes/Postman/utils/constants';

// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-missing
export class PostmanApi implements ICredentialType {
	name = 'postmanApi';

	displayName = 'Postman API';

	icon: Icon = "file:../icons/postman.svg";

	documentationUrl = DOCS_URL;

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: BASE_URL,
			url: ENDPOINTS.ME,
		},
	};
}
