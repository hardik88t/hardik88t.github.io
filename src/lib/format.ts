const TZ = 'Asia/Kolkata';

const timeFmt = new Intl.DateTimeFormat('en-GB', {
	timeZone: TZ,
	hour: '2-digit',
	minute: '2-digit',
	hour12: false
});

const dateFmt = new Intl.DateTimeFormat('en-GB', {
	timeZone: TZ,
	weekday: 'short',
	day: 'numeric',
	month: 'short'
});

const longDateFmt = new Intl.DateTimeFormat('en-GB', {
	timeZone: TZ,
	weekday: 'long',
	day: 'numeric',
	month: 'long'
});

/** Clock in the owner's timezone (IST), e.g. "14:32". */
export function istTime(d: Date = new Date()): string {
	return timeFmt.format(d);
}

/** e.g. "Wed 14 Oct". */
export function istDate(d: Date = new Date()): string {
	return dateFmt.format(d);
}

/** e.g. "Wednesday 14 October". */
export function istLongDate(d: Date = new Date()): string {
	return longDateFmt.format(d);
}

/** Copy text to the clipboard. Resolves false when the browser refuses. */
export async function copyText(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch {
		// fall through to the legacy path
	}
	try {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.position = 'fixed';
		ta.style.opacity = '0';
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand('copy');
		ta.remove();
		return ok;
	} catch {
		return false;
	}
}
