import type { IExecuteFunctions } from 'n8n-workflow';

export function rlcValue(ctx: IExecuteFunctions, name: string, itemIndex: number): string {
	const raw = ctx.getNodeParameter(name, itemIndex, { extractValue: true });
	if (typeof raw === 'string') return raw;
	if (raw && typeof raw === 'object' && 'value' in raw) {
		return (raw as { value: string }).value;
	}
	return String(raw ?? '');
}
