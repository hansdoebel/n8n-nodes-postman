import type { IDataObject, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { postmanApiRequest } from '../transport';

function filterResults<T>(
	items: T[],
	filter: string | undefined,
	label: (item: T) => string,
): T[] {
	if (!filter) return items;
	const lower = filter.toLowerCase();
	return items.filter((item) => label(item).toLowerCase().includes(lower));
}

export async function searchWorkspaces(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const response = await postmanApiRequest.call(this, 'GET', '/workspaces');
		const workspaces = (response.workspaces as IDataObject[]) ?? [];
		const items = filterResults(workspaces, filter, (w) => (w.name as string) ?? '');
		return {
			results: items.map((w) => ({
				name: w.name as string,
				value: w.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchCollections(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const response = await postmanApiRequest.call(this, 'GET', '/collections');
		const collections = (response.collections as IDataObject[]) ?? [];
		const items = filterResults(collections, filter, (c) => (c.name as string) ?? '');
		return {
			results: items.map((c) => ({
				name: c.name as string,
				value: c.uid as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchEnvironments(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const response = await postmanApiRequest.call(this, 'GET', '/environments');
		const environments = (response.environments as IDataObject[]) ?? [];
		const items = filterResults(environments, filter, (e) => (e.name as string) ?? '');
		return {
			results: items.map((e) => ({
				name: e.name as string,
				value: e.uid as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchApis(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const response = await postmanApiRequest.call(this, 'GET', '/apis');
		const apis = (response.apis as IDataObject[]) ?? [];
		const items = filterResults(apis, filter, (a) => (a.name as string) ?? '');
		return {
			results: items.map((a) => ({
				name: a.name as string,
				value: a.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchMocks(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const response = await postmanApiRequest.call(this, 'GET', '/mocks');
		const mocks = (response.mocks as IDataObject[]) ?? [];
		const items = filterResults(mocks, filter, (m) => (m.name as string) ?? '');
		return {
			results: items.map((m) => ({
				name: m.name as string,
				value: m.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}

export async function searchMonitors(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		const response = await postmanApiRequest.call(this, 'GET', '/monitors');
		const monitors = (response.monitors as IDataObject[]) ?? [];
		const items = filterResults(monitors, filter, (m) => (m.name as string) ?? '');
		return {
			results: items.map((m) => ({
				name: m.name as string,
				value: m.id as string,
			})),
		};
	} catch {
		return { results: [] };
	}
}
