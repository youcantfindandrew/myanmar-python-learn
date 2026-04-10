<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, keymap, lineNumbers } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import { python } from '@codemirror/lang-python';
	import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';

	let {
		initialCode = '',
		readonly = false,
		onchange
	}: {
		initialCode?: string;
		readonly?: boolean;
		onchange?: (code: string) => void;
	} = $props();

	let editorContainer: HTMLDivElement;
	let view: EditorView;

	export function getCode(): string {
		return view?.state.doc.toString() ?? initialCode;
	}

	export function setCode(code: string): void {
		if (view) {
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: code }
			});
		}
	}

	onMount(() => {
		const extensions = [
			lineNumbers(),
			history(),
			keymap.of([...defaultKeymap, ...historyKeymap]),
			python(),
			EditorView.theme({
				'&': {
					fontSize: '14px',
					minHeight: '120px',
					maxHeight: '400px',
					border: '1px solid var(--color-border)',
					borderRadius: 'var(--radius)'
				},
				'.cm-scroller': {
					overflow: 'auto',
					fontFamily: 'var(--font-code)'
				},
				'.cm-content': {
					padding: '0.5rem 0',
					minHeight: '120px'
				},
				'.cm-gutters': {
					background: '#f8fafc',
					borderRight: '1px solid var(--color-border)',
					color: '#94a3b8'
				},
				'&.cm-focused': {
					outline: '2px solid var(--color-primary)',
					outlineOffset: '-1px'
				}
			}),
			EditorView.updateListener.of((update) => {
				if (update.docChanged && onchange) {
					onchange(update.state.doc.toString());
				}
			})
		];

		if (readonly) {
			extensions.push(EditorState.readOnly.of(true));
		}

		view = new EditorView({
			state: EditorState.create({
				doc: initialCode,
				extensions
			}),
			parent: editorContainer
		});
	});

	onDestroy(() => {
		view?.destroy();
	});
</script>

<div class="editor-wrap" bind:this={editorContainer}></div>

<style>
	.editor-wrap {
		width: 100%;
		overflow: hidden;
		border-radius: var(--radius);
	}

	.editor-wrap :global(.cm-editor) {
		background: white;
	}
</style>
