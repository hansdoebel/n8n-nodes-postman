import type { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import * as api from './api';
import * as collection from './collection';
import * as collectionFolder from './collectionFolder';
import * as collectionRequest from './collectionRequest';
import * as collectionResponse from './collectionResponse';
import * as comment from './comment';
import * as environment from './environment';
import * as fork from './fork';
import * as mock from './mock';
import * as monitor from './monitor';
import * as privateApiNetwork from './privateApiNetwork';
import * as pullRequest from './pullRequest';
import * as spec from './spec';
import * as tag from './tag';
import * as user from './user';
import * as workspace from './workspace';
import * as workspaceVariable from './workspaceVariable';

type ResourceModule = {
	operations: INodeProperties[];
	fields: INodeProperties[];
	execute: (this: IExecuteFunctions, operation: string, i: number) => Promise<INodeExecutionData>;
};

const defs: Array<[name: string, value: string, mod: ResourceModule]> = [
	['API', 'api', api],
	['Collection', 'collection', collection],
	['Collection Folder', 'collectionFolder', collectionFolder],
	['Collection Request', 'collectionRequest', collectionRequest],
	['Collection Response', 'collectionResponse', collectionResponse],
	['Comment', 'comment', comment],
	['Environment', 'environment', environment],
	['Fork', 'fork', fork],
	['Mock', 'mock', mock],
	['Monitor', 'monitor', monitor],
	['Private API Network', 'privateApiNetwork', privateApiNetwork],
	['Pull Request', 'pullRequest', pullRequest],
	['Spec', 'spec', spec],
	['Tag', 'tag', tag],
	['User', 'user', user],
	['Workspace', 'workspace', workspace],
	['Workspace Variable', 'workspaceVariable', workspaceVariable],
];

export const resourceOptions = defs.map(([name, value]) => ({ name, value }));

export const resourceProperties = defs.flatMap(([,, m]) => [...m.operations, ...m.fields]);

export const executorMap: Record<string, ResourceModule['execute']> = Object.fromEntries(
	defs.map(([, value, m]) => [value, m.execute]),
);
