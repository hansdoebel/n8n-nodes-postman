export const BASE_URL = 'https://api.getpostman.com';
export const DOCS_URL = 'https://learning.postman.com/docs/developer/postman-api/authentication/';

export const ENDPOINTS = {
	ME: '/me',

	APIS: '/apis',
	API: (apiId: string) => `/apis/${apiId}`,
	API_SCHEMAS: (apiId: string) => `/apis/${apiId}/schemas`,
	API_SCHEMA: (apiId: string, schemaId: string) => `/apis/${apiId}/schemas/${schemaId}`,

	COLLECTIONS: '/collections',
	COLLECTION: (collectionId: string) => `/collections/${collectionId}`,
	COLLECTION_FORKS: (collectionId: string) => `/collections/${collectionId}/forks`,
	COLLECTION_COPY: (collectionId: string) => `/collections/${collectionId}/copy`,
	COLLECTION_RUN: (collectionId: string) => `/collections/${collectionId}/run`,
	COLLECTION_FOLDERS: (collectionId: string) => `/collections/${collectionId}/folders`,
	COLLECTION_FOLDER: (collectionId: string, folderId: string) =>
		`/collections/${collectionId}/folders/${folderId}`,
	COLLECTION_REQUESTS: (collectionId: string) => `/collections/${collectionId}/requests`,
	COLLECTION_REQUEST: (collectionId: string, requestId: string) =>
		`/collections/${collectionId}/requests/${requestId}`,
	COLLECTION_RESPONSES: (collectionId: string) => `/collections/${collectionId}/responses`,
	COLLECTION_RESPONSE: (collectionId: string, responseId: string) =>
		`/collections/${collectionId}/responses/${responseId}`,
	COLLECTION_COMMENTS: (collectionId: string) => `/collections/${collectionId}/comments`,
	COLLECTION_COMMENT: (collectionId: string, commentId: string | number) =>
		`/collections/${collectionId}/comments/${commentId}`,
	COLLECTION_TAGS: (collectionId: string) => `/collections/${collectionId}/tags`,
	COLLECTION_PULL_REQUESTS: (collectionId: string) =>
		`/collections/${collectionId}/pull-requests`,
	COLLECTION_SOURCE_STATUS: (collectionId: string) =>
		`/collections/${collectionId}/source-status`,

	COLLECTION_FORKS_MERGE: '/collections/forks',
	COLLECTION_MERGES: '/collection-merges',
	PULL_REQUEST: (pullRequestId: string) => `/collection-pull-requests/${pullRequestId}`,
	PULL_REQUEST_MERGE: (pullRequestId: string) =>
		`/collection-pull-requests/${pullRequestId}/merge`,

	ENVIRONMENTS: '/environments',
	ENVIRONMENT: (environmentId: string) => `/environments/${environmentId}`,

	MOCKS: '/mocks',
	MOCK: (mockId: string) => `/mocks/${mockId}`,
	MOCK_PUBLISH: (mockId: string) => `/mocks/${mockId}/publish`,
	MOCK_UNPUBLISH: (mockId: string) => `/mocks/${mockId}/unpublish`,

	MONITORS: '/monitors',
	MONITOR: (monitorId: string) => `/monitors/${monitorId}`,
	MONITOR_RUN: (monitorId: string) => `/monitors/${monitorId}/run`,

	NETWORK_PRIVATE: '/network/private',
	NETWORK_PRIVATE_REQUEST_ALL: '/network/private/network-entity/request/all',
	NETWORK_PRIVATE_ELEMENT: (elementType: string, elementId: string) =>
		`/network/private/${elementType}/${elementId}`,

	TAGS_ENTITIES: (tagSlug: string) => `/tags/${tagSlug}/entities`,
	WORKSPACE_TAGS: (workspaceId: string) => `/workspaces/${workspaceId}/tags`,

	WORKSPACES: '/workspaces',
	WORKSPACE: (workspaceId: string) => `/workspaces/${workspaceId}`,
	WORKSPACE_GLOBAL_VARIABLES: (workspaceId: string) =>
		`/workspaces/${workspaceId}/global-variables`,
	WORKSPACE_ROLES: (workspaceId: string) => `/workspaces/${workspaceId}/roles`,

	WORKSPACE_ROLE_TYPES: '/workspace-roles',

	COLLECTION_ROLES: (collectionId: string) => `/collections/${collectionId}/roles`,

	TEAMS: '/teams',
	TEAM: (teamId: string) => `/teams/${teamId}`,
	TEAM_ACCESS_REQUESTS: (teamId: string) => `/teams/${teamId}/access-requests`,
	TEAM_ACCESS_REQUEST: (teamId: string, requestId: string) =>
		`/teams/${teamId}/access-requests/${requestId}`,
	TEAM_BULK_MEMBERS: (teamId: string) => `/teams/${teamId}/bulk-members`,
	TEAM_SETTINGS: (teamId: string) => `/teams/${teamId}/settings`,
};
