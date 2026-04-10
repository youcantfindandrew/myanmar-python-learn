import { db, type LocalLesson, type LocalProblem } from './schema';

import intro01 from '$lib/content/lessons/intro-01.json';
import intro02 from '$lib/content/lessons/intro-02.json';
import variables01 from '$lib/content/lessons/variables-01.json';
import variables02 from '$lib/content/lessons/variables-02.json';
import print01 from '$lib/content/lessons/print-01.json';

const lessons: LocalLesson[] = [intro01, intro02, variables01, variables02, print01].map((l) => ({
	...l,
	version: 1,
	cachedAt: Date.now()
})) as LocalLesson[];

const problems: LocalProblem[] = [
	{
		id: 'intro-01-p1',
		lessonId: 'intro-01',
		titleEn: 'Say Hello',
		titleMm: 'Hello ပြောပါ',
		descriptionEn: 'Use print() to display "Hello, Python!" on the screen.',
		descriptionMm: 'print() ကို သုံးပြီး "Hello, Python!" ကို ဖန်သားပြင်ပေါ်မှာ ပြပါ။',
		starterCode: '# Print "Hello, Python!"\n',
		testCases: [
			{ input: '', expectedOutput: 'Hello, Python!', hidden: false }
		],
		hintsEn: ['Use print() with the text inside quotes', 'print("Hello, Python!")'],
		hintsMm: ['print() ကို quotes ထဲ စာသားနဲ့ သုံးပါ', 'print("Hello, Python!")'],
		difficulty: 1,
		orderIndex: 1,
		version: 1
	},
	{
		id: 'intro-01-p2',
		lessonId: 'intro-01',
		titleEn: 'Three Lines',
		titleMm: 'စာကြောင်း ၃ ကြောင်း',
		descriptionEn: 'Print three lines:\n1. Your name\n2. Your age\n3. Your city',
		descriptionMm: 'စာကြောင်း ၃ ကြောင်း print ထုတ်ပါ:\n1. သင့်နာမည်\n2. သင့်အသက်\n3. သင့်မြို့',
		starterCode: '# Print your name, age, and city on separate lines\n',
		testCases: [
			{ input: '', expectedOutput: '', hidden: true }
		],
		hintsEn: ['Use print() three times, one for each piece of information'],
		hintsMm: ['print() ကို သုံးကြိမ်သုံးပါ၊ အချက်အလက်တစ်ခုစီအတွက် တစ်ကြိမ်'],
		difficulty: 1,
		orderIndex: 2,
		version: 1
	},
	{
		id: 'intro-02-p1',
		lessonId: 'intro-02',
		titleEn: 'Python Calculator',
		titleMm: 'Python ဂဏန်းပေါင်းစက်',
		descriptionEn: 'Print the result of 15 + 27.',
		descriptionMm: '15 + 27 ရဲ့ ရလဒ်ကို print ထုတ်ပါ။',
		starterCode: '# Print the result of 15 + 27\n',
		testCases: [
			{ input: '', expectedOutput: '42', hidden: false }
		],
		hintsEn: ['Use print() with the math expression inside', 'print(15 + 27)'],
		hintsMm: ['print() ထဲမှာ math expression ထည့်ပါ', 'print(15 + 27)'],
		difficulty: 1,
		orderIndex: 1,
		version: 1
	},
	{
		id: 'intro-02-p2',
		lessonId: 'intro-02',
		titleEn: 'Math Operations',
		titleMm: 'သင်္ချာ လုပ်ဆောင်ချက်များ',
		descriptionEn: 'Print the results of:\n- 100 + 50\n- 100 - 50\n- 10 * 5\n- 100 / 4\nEach on a new line.',
		descriptionMm: 'အောက်ပါ ရလဒ်များကို print ထုတ်ပါ:\n- 100 + 50\n- 100 - 50\n- 10 * 5\n- 100 / 4\nတစ်ခုစီ စာကြောင်းအသစ်မှာ။',
		starterCode: '# Print four math results\n',
		testCases: [
			{ input: '', expectedOutput: '150\n50\n50\n25.0', hidden: false }
		],
		hintsEn: ['Use print() four times', 'print(100 + 50) for the first one'],
		hintsMm: ['print() ကို ၄ ကြိမ် သုံးပါ', 'ပထမတစ်ခုအတွက် print(100 + 50)'],
		difficulty: 1,
		orderIndex: 2,
		version: 1
	},
	{
		id: 'variables-01-p1',
		lessonId: 'variables-01',
		titleEn: 'Create and Print',
		titleMm: 'ဖန်တီးပြီး Print ထုတ်',
		descriptionEn: 'Create a variable called `animal` with the value "cat" and print it.',
		descriptionMm: '`animal` ဆိုတဲ့ variable ကို "cat" ဆိုတဲ့ value နဲ့ ဖန်တီးပြီး print ထုတ်ပါ။',
		starterCode: '# Create a variable and print it\n',
		testCases: [
			{ input: '', expectedOutput: 'cat', hidden: false }
		],
		hintsEn: ['First create the variable: animal = "cat"', 'Then print it: print(animal)'],
		hintsMm: ['အရင် variable ဖန်တီးပါ: animal = "cat"', 'ပြီးရင် print ထုတ်ပါ: print(animal)'],
		difficulty: 2,
		orderIndex: 1,
		version: 1
	},
	{
		id: 'variables-01-p2',
		lessonId: 'variables-01',
		titleEn: 'Swap Values',
		titleMm: 'Value တွေ ပြောင်းတပ်',
		descriptionEn: 'Create two variables `a = 5` and `b = 10`. Print a, then change a to 20, then print a again.',
		descriptionMm: '`a = 5` နဲ့ `b = 10` variable နှစ်ခု ဖန်တီးပါ။ a ကို print ထုတ်ပါ၊ ပြီးရင် a ကို 20 သို့ ပြောင်းပါ၊ ပြီးရင် a ကို ထပ်print ထုတ်ပါ။',
		starterCode: 'a = 5\nb = 10\n\n# Print a, change a to 20, print a again\n',
		testCases: [
			{ input: '', expectedOutput: '5\n20', hidden: false }
		],
		hintsEn: ['print(a) first, then a = 20, then print(a) again'],
		hintsMm: ['print(a) အရင်ရေးပါ၊ ပြီးရင် a = 20 ရေးပါ၊ ပြီးရင် print(a) ထပ်ရေးပါ'],
		difficulty: 2,
		orderIndex: 2,
		version: 1
	},
	{
		id: 'variables-01-p3',
		lessonId: 'variables-01',
		titleEn: 'Student Info',
		titleMm: 'ကျောင်းသား အချက်အလက်',
		descriptionEn: 'Create variables for name ("Aung"), age (12), and grade (7). Print each on its own line.',
		descriptionMm: 'name ("Aung"), age (12), grade (7) အတွက် variable တွေ ဖန်တီးပါ။ တစ်ခုစီကို သူ့စာကြောင်းနဲ့သူ print ထုတ်ပါ။',
		starterCode: '# Create three variables and print each\n',
		testCases: [
			{ input: '', expectedOutput: 'Aung\n12\n7', hidden: false }
		],
		hintsEn: ['Create: name = "Aung", age = 12, grade = 7', 'Then use three print() calls'],
		hintsMm: ['ဖန်တီးပါ: name = "Aung", age = 12, grade = 7', 'ပြီးရင် print() ၃ ကြိမ် သုံးပါ'],
		difficulty: 2,
		orderIndex: 3,
		version: 1
	},
	{
		id: 'variables-02-p1',
		lessonId: 'variables-02',
		titleEn: 'String Join',
		titleMm: 'String ဆက်',
		descriptionEn: 'Create first_name = "Aung" and last_name = "Thu". Print the full name by joining them with a space.',
		descriptionMm: 'first_name = "Aung" နဲ့ last_name = "Thu" ဖန်တီးပါ။ Space နဲ့ ဆက်ပြီး full name ကို print ထုတ်ပါ။',
		starterCode: 'first_name = "Aung"\nlast_name = "Thu"\n\n# Print full name\n',
		testCases: [
			{ input: '', expectedOutput: 'Aung Thu', hidden: false }
		],
		hintsEn: ['Use + to join strings: first_name + " " + last_name'],
		hintsMm: ['String ဆက်ဖို့ + ကို သုံးပါ: first_name + " " + last_name'],
		difficulty: 2,
		orderIndex: 1,
		version: 1
	},
	{
		id: 'variables-02-p2',
		lessonId: 'variables-02',
		titleEn: 'Number to Text',
		titleMm: 'ဂဏန်းကို စာသားပြောင်း',
		descriptionEn: 'Given score = 95, print "Score: 95" using str() to convert the number.',
		descriptionMm: 'score = 95 ပေးထားပါတယ်, str() ကိုသုံးပြီး "Score: 95" print ထုတ်ပါ။',
		starterCode: 'score = 95\n\n# Print "Score: 95"\n',
		testCases: [
			{ input: '', expectedOutput: 'Score: 95', hidden: false }
		],
		hintsEn: ['Use "Score: " + str(score)', 'Or use print("Score:", score) with comma'],
		hintsMm: ['"Score: " + str(score) ကို သုံးပါ', 'သို့ comma နဲ့ print("Score:", score) ကို သုံးပါ'],
		difficulty: 2,
		orderIndex: 2,
		version: 1
	},
	{
		id: 'print-01-p1',
		lessonId: 'print-01',
		titleEn: 'F-String Greeting',
		titleMm: 'F-String နှုတ်ခွန်းဆက်',
		descriptionEn: 'Create name = "Lin" and age = 10. Use an f-string to print: "Lin is 10 years old"',
		descriptionMm: 'name = "Lin" နဲ့ age = 10 ဖန်တီးပါ။ f-string ကိုသုံးပြီး "Lin is 10 years old" print ထုတ်ပါ။',
		starterCode: 'name = "Lin"\nage = 10\n\n# Use an f-string\n',
		testCases: [
			{ input: '', expectedOutput: 'Lin is 10 years old', hidden: false }
		],
		hintsEn: ['Use print(f"{name} is {age} years old")'],
		hintsMm: ['print(f"{name} is {age} years old") ကို သုံးပါ'],
		difficulty: 2,
		orderIndex: 1,
		version: 1
	},
	{
		id: 'print-01-p2',
		lessonId: 'print-01',
		titleEn: 'Math in F-Strings',
		titleMm: 'F-String ထဲ သင်္ချာ',
		descriptionEn: 'Given price = 500 and quantity = 3, use an f-string to print: "Total: 1500 kyat"',
		descriptionMm: 'price = 500 နဲ့ quantity = 3 ပေးထားပါတယ်, f-string ကိုသုံးပြီး "Total: 1500 kyat" print ထုတ်ပါ။',
		starterCode: 'price = 500\nquantity = 3\n\n# Use an f-string with math inside\n',
		testCases: [
			{ input: '', expectedOutput: 'Total: 1500 kyat', hidden: false }
		],
		hintsEn: ['You can do math inside f-string braces: {price * quantity}'],
		hintsMm: ['f-string ကွင်းထဲမှာ သင်္ချာတွက်လို့ ရပါတယ်: {price * quantity}'],
		difficulty: 2,
		orderIndex: 2,
		version: 1
	}
];

export async function seedDatabase(): Promise<void> {
	const existingCount = await db.lessons.count();
	if (existingCount >= lessons.length) return;

	await db.transaction('rw', [db.lessons, db.problems], async () => {
		await db.lessons.bulkPut(lessons);
		await db.problems.bulkPut(problems);
	});
}
