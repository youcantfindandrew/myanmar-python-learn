// Offline AI hint fallback — pattern-matches common Python errors and returns
// bilingual kid-friendly guidance without needing any API call.

interface HintResult {
	en: string;
	mm: string;
}

export function offlineHint(code: string, error: string | null, locale: string): string {
	const h = getHintForError(code, error ?? '');
	return locale === 'en' ? h.en : h.mm;
}

function getHintForError(code: string, error: string): HintResult {
	const e = error.toLowerCase();

	if (e.includes('syntaxerror') || e.includes('invalid syntax')) {
		if (e.includes('eof') || e.includes('end of file')) {
			return {
				en: '💡 Python expected more code but found nothing! Check that every `if`, `for`, `while`, `def`, or `class` has a body indented below it.',
				mm: '💡 Python က code ပိုမျှော်လင့်နေပေမဲ့ မတွေ့ဘူး! `if`, `for`, `while`, `def` တိုင်း အောက်မှာ indent လုပ်ထားတဲ့ code ရှိရမယ်ဆိုတာ စစ်ဆေးပါ။'
			};
		}
		if (code.includes('def ') && !code.includes(':')) {
			return {
				en: '💡 Every `def` line needs a colon `:` at the end! Like: `def my_function():`',
				mm: '💡 `def` line တိုင်း နောက်မှာ colon `:` ထည့်ရမယ်! ဥပမာ: `def my_function():`'
			};
		}
		if (code.includes('if ') && !/:/.test(code.split('\n').find(l => l.trim().startsWith('if ')) ?? '')) {
			return {
				en: '💡 Every `if` needs a colon `:` at the end! Like: `if x > 5:`',
				mm: '💡 `if` တိုင်း နောက်မှာ colon `:` ထည့်ရမယ်! ဥပမာ: `if x > 5:`'
			};
		}
		return {
			en: '💡 There\'s a syntax error — Python can\'t understand your code. Check for: missing colons `:` after `if`/`for`/`def`, mismatched quotes `"` `\'`, or missing brackets `()` `[]`.',
			mm: '💡 Syntax error ဖြစ်နေတယ် — Python က code ကို နားမလည်ဘူး။ စစ်ဆေးပါ: `if`/`for`/`def` နောက် colon `:` မပါဘူးလား၊ quotes `"` `\'` မပိတ်ဘူးလား၊ brackets `()` `[]` မပြည့်ဘူးလား။'
		};
	}

	if (e.includes('indentationerror') || e.includes('unexpected indent')) {
		return {
			en: '💡 Indentation problem! In Python, code inside `if`, `for`, `def` must be indented with **4 spaces** (or 1 Tab). Make sure all lines inside a block line up.',
			mm: '💡 Indentation ပြဿနာ! Python မှာ `if`, `for`, `def` ထဲမှာ code ကို **4 spaces** (သို့ Tab 1) ခြားပြီး ရေးရမယ်။ Block ထဲမှာ lines တွေ တန်းတူပါတော့လားဆိုတာ စစ်ဆေးပါ။'
		};
	}

	if (e.includes('nameerror') || e.includes('name') && e.includes('is not defined')) {
		const match = error.match(/name '(\w+)' is not defined/i);
		const varName = match?.[1] ?? 'variable';
		return {
			en: `💡 Python doesn't know what \`${varName}\` is! Did you forget to: define it with \`${varName} = ...\` before using it, or spell it correctly? Variable names are case-sensitive: \`Name\` ≠ \`name\`.`,
			mm: `💡 Python က \`${varName}\` ဘာကိုဆိုလိုတာလဲ မသိဘူး! မမေ့ဘူးလား: သုံးခင်မှာ \`${varName} = ...\` ဆိုပြီး define လုပ်ဖို့? စာလုံးပေါင်း မှန်ဘူးလား? Variable names က case-sensitive ပါ: \`Name\` ≠ \`name\`။`
		};
	}

	if (e.includes('typeerror')) {
		if (e.includes('str') && e.includes('int')) {
			return {
				en: '💡 You\'re mixing text and numbers! Python can\'t add a string to an integer. Use `int()` to convert text to a number, or `str()` to convert a number to text.',
				mm: '💡 စာသားနဲ့ ဂဏန်းကို ရောနှောနေတာ! Python က string ကို integer နဲ့ ပေါင်းမပေးဘူး။ `int()` ကို သုံးပြီး text ကို number ပြောင်းပါ၊ ဒါမှမဟုတ် `str()` ကို သုံးပြီး number ကို text ပြောင်းပါ။'
			};
		}
		if (e.includes('not callable')) {
			return {
				en: '💡 You\'re trying to call something that isn\'t a function. Did you accidentally put `()` after a variable, or forget to put `()` when calling a function?',
				mm: '💡 Function မဟုတ်တာကို call လုပ်ဖို့ ကြိုးစားနေတာ။ Variable နောက်မှာ `()` မတော်တဆ ထည့်မိဘူးလား၊ ဒါမှမဟုတ် function ခေါ်ရင် `()` ထည့်ဖို့ မမေ့ဘူးလား?'
			};
		}
		return {
			en: '💡 Type error — you\'re using a value in a way that doesn\'t match its type. For example, calling `len()` on a number, or doing math with text.',
			mm: '💡 Type error — value ကို မမှန်ကန်သည့် နည်းဖြင့် သုံးနေတာ။ ဥပမာ `len()` ကို ဂဏန်းပေါ် ခေါ်ခြင်း၊ ဒါမှမဟုတ် text ကို math လုပ်ခြင်း။'
		};
	}

	if (e.includes('zerodivisionerror')) {
		return {
			en: '💡 You divided by zero! In math and in Python, dividing by 0 is impossible. Check that your denominator (the bottom number) is never 0.',
			mm: '💡 သုည (0) ဖြင့် စားနေတာ! သင်္ချာမှာနဲ့ Python မှာ 0 နဲ့ စားဖို့ မဖြစ်နိုင်ဘူး။ ခြေနာမ (အောက်ကဂဏန်း) က ဘယ်တော့မှ 0 မဖြစ်ဘူးဆိုတာ စစ်ဆေးပါ။'
		};
	}

	if (e.includes('indexerror') || e.includes('list index out of range')) {
		return {
			en: '💡 Index out of range! You\'re trying to access an item that doesn\'t exist. If your list has 3 items, valid indexes are 0, 1, 2. Remember: Python lists start at index 0, not 1!',
			mm: '💡 Index out of range! မရှိတဲ့ item ကို ဝင်ယူဖို့ ကြိုးစားနေတာ။ List မှာ item 3 ခု ရှိရင် valid indexes တွေက 0, 1, 2 ပဲ။ မမေ့ပါနဲ့: Python lists တွေ index 0 ကစပြီး ရေတွက်တာ၊ 1 ကမဟုတ်ဘူး!'
		};
	}

	if (e.includes('keyerror')) {
		const match = error.match(/KeyError: '?([^'\n]+)'?/i);
		const key = match?.[1] ?? 'key';
		return {
			en: `💡 Key not found! The dictionary doesn't have a key named \`${key}\`. Use \`.get(key)\` for a safe lookup, or check the key's spelling.`,
			mm: `💡 Key မတွေ့ဘူး! Dictionary မှာ \`${key}\` ဆိုတဲ့ key မရှိဘူး။ \`.get(key)\` ကို သုံးပြီး safe lookup လုပ်ပါ၊ ဒါမှမဟုတ် key ၏ စာလုံးပေါင်း စစ်ဆေးပါ။`
		};
	}

	if (e.includes('valueerror')) {
		return {
			en: '💡 Value error! You\'re passing the wrong kind of value to a function. Common cause: `int("hello")` — you can\'t convert text that isn\'t a number.',
			mm: '💡 Value error! Function ကို မှားယွင်းတဲ့ value ပေးနေတာ။ အဖြစ်များတဲ့ အကြောင်းအရင်း: `int("hello")` — ဂဏန်းမဟုတ်တဲ့ text ကို ပြောင်းမရဘူး။'
		};
	}

	if (e.includes('attributeerror')) {
		return {
			en: '💡 Attribute error! You\'re trying to use a method or property that doesn\'t exist on this type of value. Double-check the method name and the type of your variable.',
			mm: '💡 Attribute error! ဒီ value type ပေါ်မှာ မရှိတဲ့ method ဒါမှမဟုတ် property ကို သုံးဖို့ ကြိုးစားနေတာ။ Method နာမည်နဲ့ variable type ကို နှစ်ဆစစ်ဆေးပါ။'
		};
	}

	if (e.includes('recursionerror') || e.includes('maximum recursion')) {
		return {
			en: '💡 Infinite recursion! Your function is calling itself forever. Make sure you have a **base case** — a condition that stops the recursion.',
			mm: '💡 Infinite recursion! Function က ကိုယ့်ကိုယ်ကိုယ် အဆုံးမသတ်ဘဲ ဆက်ခေါ်နေတာ။ **Base case** ရှိတာ သေချာပါစေ — recursion ကို ရပ်ရန် condition တစ်ခု ထည့်ပါ။'
		};
	}

	// No output produced
	if (!error && code && !code.includes('print')) {
		return {
			en: '💡 No output! Did you forget to use `print()` to show your result? In Python, you must explicitly print values to see them.',
			mm: '💡 Output မရှိဘူး! ရလဒ်ကို ပြဖို့ `print()` သုံးဖို့ မမေ့ဘူးလား? Python မှာ values တွေကို မြင်ဖို့ print ထုတ်ပေးရမယ်။'
		};
	}

	// Generic fallback
	return {
		en: '💡 Take it step by step! Try running just a small part of your code first to find where the problem is. Read the error message carefully — it tells you which line has the issue.',
		mm: '💡 တစ်ဆင့်ချင်း လုပ်ကြည့်ပါ! ပြဿနာ ဘယ်မှာဆိုတာ ရှာဖို့ code ၏ တစ်စိတ်တစ်ပိုင်းကိုသာ ဦးစွာ run ကြည့်ပါ။ Error message ကို သေချာဖတ်ပါ — ဘယ် line မှာ ပြဿနာဆိုတာ ပြောပြပါတယ်။'
	};
}
