import { db, type LocalLesson, type LocalProblem } from './schema';

import intro01 from '$lib/content/lessons/intro-01.json';
import intro02 from '$lib/content/lessons/intro-02.json';
import variables01 from '$lib/content/lessons/variables-01.json';
import variables02 from '$lib/content/lessons/variables-02.json';
import print01 from '$lib/content/lessons/print-01.json';
import input01 from '$lib/content/lessons/input-01.json';
import conditions01 from '$lib/content/lessons/conditions-01.json';
import conditions02 from '$lib/content/lessons/conditions-02.json';
import strings01 from '$lib/content/lessons/strings-01.json';
import math01 from '$lib/content/lessons/math-01.json';
import loops01 from '$lib/content/lessons/loops-01.json';
import loops02 from '$lib/content/lessons/loops-02.json';
import lists01 from '$lib/content/lessons/lists-01.json';
import functions01 from '$lib/content/lessons/functions-01.json';
import functions02 from '$lib/content/lessons/functions-02.json';

const SEED_VERSION = 2;

const lessonData = [
	intro01, intro02, variables01, variables02, print01,
	input01, conditions01, conditions02, strings01, math01,
	loops01, loops02, lists01, functions01, functions02
];

const lessons: LocalLesson[] = lessonData.map((l) => ({
	...l,
	version: 1,
	cachedAt: Date.now()
})) as LocalLesson[];

const problems: LocalProblem[] = [
	// ── intro-01 ──────────────────────────────────────────────
	{
		id: 'intro-01-p1', lessonId: 'intro-01', titleEn: 'Say Hello', titleMm: 'Hello ပြောပါ',
		descriptionEn: 'Use print() to display "Hello, Python!" on the screen.',
		descriptionMm: 'print() ကို သုံးပြီး "Hello, Python!" ကို ဖန်သားပြင်ပေါ်မှာ ပြပါ။',
		starterCode: '# Print "Hello, Python!"\n', testCases: [{ input: '', expectedOutput: 'Hello, Python!', hidden: false }],
		hintsEn: ['Use print() with the text inside quotes'], hintsMm: ['print() ကို quotes ထဲ စာသားနဲ့ သုံးပါ'],
		difficulty: 1, orderIndex: 1, version: 1
	},
	{
		id: 'intro-01-p2', lessonId: 'intro-01', titleEn: 'Three Lines', titleMm: 'စာကြောင်း ၃ ကြောင်း',
		descriptionEn: 'Print three separate lines: "Python", "is", "fun"',
		descriptionMm: 'သီးခြားစာကြောင်း ၃ ကြောင်း print ထုတ်ပါ: "Python", "is", "fun"',
		starterCode: '', testCases: [{ input: '', expectedOutput: 'Python\nis\nfun', hidden: false }],
		hintsEn: ['Use three separate print() calls'], hintsMm: ['print() ကို ၃ ကြိမ် သုံးပါ'],
		difficulty: 1, orderIndex: 2, version: 1
	},
	// ── intro-02 ──────────────────────────────────────────────
	{
		id: 'intro-02-p1', lessonId: 'intro-02', titleEn: 'Python Calculator', titleMm: 'Python ဂဏန်းပေါင်းစက်',
		descriptionEn: 'Print the result of 15 + 27.',
		descriptionMm: '15 + 27 ၏ ရလဒ်ကို print ထုတ်ပါ။',
		starterCode: '', testCases: [{ input: '', expectedOutput: '42', hidden: false }],
		hintsEn: ['print(15 + 27)'], hintsMm: ['print(15 + 27)'],
		difficulty: 1, orderIndex: 1, version: 1
	},
	{
		id: 'intro-02-p2', lessonId: 'intro-02', titleEn: 'Four Operations', titleMm: 'လုပ်ဆောင်ချက် ၄ မျိုး',
		descriptionEn: 'Print 100+50, 100-50, 10*5, 100/4 each on a new line.',
		descriptionMm: '100+50, 100-50, 10*5, 100/4 ကို တစ်ကြောင်းစီ print ထုတ်ပါ။',
		starterCode: '', testCases: [{ input: '', expectedOutput: '150\n50\n50\n25.0', hidden: false }],
		hintsEn: ['Use four print() statements'], hintsMm: ['print() ကို ၄ ကြိမ် သုံးပါ'],
		difficulty: 1, orderIndex: 2, version: 1
	},
	// ── variables-01 ──────────────────────────────────────────
	{
		id: 'variables-01-p1', lessonId: 'variables-01', titleEn: 'Create and Print', titleMm: 'ဖန်တီးပြီး Print ထုတ်',
		descriptionEn: 'Create a variable called `animal` with the value "cat" and print it.',
		descriptionMm: '`animal` variable ကို "cat" value နဲ့ ဖန်တီးပြီး print ထုတ်ပါ။',
		starterCode: '', testCases: [{ input: '', expectedOutput: 'cat', hidden: false }],
		hintsEn: ['animal = "cat"', 'print(animal)'], hintsMm: ['animal = "cat"', 'print(animal)'],
		difficulty: 2, orderIndex: 1, version: 1
	},
	{
		id: 'variables-01-p2', lessonId: 'variables-01', titleEn: 'Change a Variable', titleMm: 'Variable ပြောင်းခြင်း',
		descriptionEn: 'Start with x = 5. Print x, then change x to 20, then print x again.',
		descriptionMm: 'x = 5 ကနေ စပါ။ x print ထုတ်ပြီး x ကို 20 ပြောင်းပါ၊ ပြီးရင် x ထပ် print ထုတ်ပါ။',
		starterCode: 'x = 5\n', testCases: [{ input: '', expectedOutput: '5\n20', hidden: false }],
		hintsEn: ['print(x), then x = 20, then print(x) again'], hintsMm: ['print(x) ပြီး x = 20 ပြီး print(x) ထပ်ရေးပါ'],
		difficulty: 2, orderIndex: 2, version: 1
	},
	{
		id: 'variables-01-p3', lessonId: 'variables-01', titleEn: 'Student Info', titleMm: 'ကျောင်းသားအချက်အလက်',
		descriptionEn: 'Create: name = "Aung", age = 12, grade = 7. Print each on its own line.',
		descriptionMm: 'ဖန်တီးပါ: name = "Aung", age = 12, grade = 7။ တစ်ကြောင်းစီ print ထုတ်ပါ။',
		starterCode: '', testCases: [{ input: '', expectedOutput: 'Aung\n12\n7', hidden: false }],
		hintsEn: ['Create three variables then use three print() calls'], hintsMm: ['Variable ၃ ခု ဖန်တီးပြီး print() ၃ ကြိမ် သုံးပါ'],
		difficulty: 2, orderIndex: 3, version: 1
	},
	// ── variables-02 ──────────────────────────────────────────
	{
		id: 'variables-02-p1', lessonId: 'variables-02', titleEn: 'String Join', titleMm: 'String ဆက်',
		descriptionEn: 'Given first_name = "Aung" and last_name = "Thu", print the full name joined with a space.',
		descriptionMm: 'first_name = "Aung" နဲ့ last_name = "Thu" ပေးထားတယ်, space တစ်ခုနဲ့ ဆက်ပြီး full name print ထုတ်ပါ။',
		starterCode: 'first_name = "Aung"\nlast_name = "Thu"\n', testCases: [{ input: '', expectedOutput: 'Aung Thu', hidden: false }],
		hintsEn: ['Use first_name + " " + last_name'], hintsMm: ['first_name + " " + last_name ကို သုံးပါ'],
		difficulty: 2, orderIndex: 1, version: 1
	},
	{
		id: 'variables-02-p2', lessonId: 'variables-02', titleEn: 'Number to Text', titleMm: 'ဂဏန်းကို စာသားပြောင်း',
		descriptionEn: 'Given score = 95, print "Score: 95" using str() to convert the number.',
		descriptionMm: 'score = 95 ပေးထားတယ်, str() သုံးပြီး "Score: 95" print ထုတ်ပါ။',
		starterCode: 'score = 95\n', testCases: [{ input: '', expectedOutput: 'Score: 95', hidden: false }],
		hintsEn: ['print("Score: " + str(score))'], hintsMm: ['print("Score: " + str(score))'],
		difficulty: 2, orderIndex: 2, version: 1
	},
	// ── print-01 ──────────────────────────────────────────────
	{
		id: 'print-01-p1', lessonId: 'print-01', titleEn: 'F-String Greeting', titleMm: 'F-String နှုတ်ခွန်းဆက်',
		descriptionEn: 'Given name = "Lin" and age = 10, use an f-string to print: "Lin is 10 years old"',
		descriptionMm: 'name = "Lin" နဲ့ age = 10 ပေးထားတယ်, f-string သုံးပြီး "Lin is 10 years old" print ထုတ်ပါ။',
		starterCode: 'name = "Lin"\nage = 10\n', testCases: [{ input: '', expectedOutput: 'Lin is 10 years old', hidden: false }],
		hintsEn: ['print(f"{name} is {age} years old")'], hintsMm: ['print(f"{name} is {age} years old")'],
		difficulty: 2, orderIndex: 1, version: 1
	},
	{
		id: 'print-01-p2', lessonId: 'print-01', titleEn: 'Math in F-Strings', titleMm: 'F-String ထဲ သင်္ချာ',
		descriptionEn: 'Given price = 500 and quantity = 3, use an f-string to print: "Total: 1500 kyat"',
		descriptionMm: 'price = 500 နဲ့ quantity = 3 ပေးထားတယ်, f-string သုံးပြီး "Total: 1500 kyat" print ထုတ်ပါ။',
		starterCode: 'price = 500\nquantity = 3\n', testCases: [{ input: '', expectedOutput: 'Total: 1500 kyat', hidden: false }],
		hintsEn: ['print(f"Total: {price * quantity} kyat")'], hintsMm: ['print(f"Total: {price * quantity} kyat")'],
		difficulty: 2, orderIndex: 2, version: 1
	},
	// ── input-01 ──────────────────────────────────────────────
	{
		id: 'input-01-p1', lessonId: 'input-01', titleEn: 'Double the Input', titleMm: 'Input ၏ နှစ်ဆ',
		descriptionEn: 'Read a number from input and print double that number.',
		descriptionMm: 'input မှ ဂဏန်းတစ်ခု ဖတ်ပြီး ထိုဂဏန်း၏ နှစ်ဆ print ထုတ်ပါ။',
		starterCode: 'n = int(input(""))\nprint(n * 2)\n',
		testCases: [{ input: '5', expectedOutput: '10', hidden: false }, { input: '12', expectedOutput: '24', hidden: true }],
		hintsEn: ['n = int(input())', 'print(n * 2)'], hintsMm: ['n = int(input())', 'print(n * 2)'],
		difficulty: 3, orderIndex: 1, version: 1
	},
	{
		id: 'input-01-p2', lessonId: 'input-01', titleEn: 'Name Greeting', titleMm: 'နာမည်ဖြင့် နှုတ်ခွန်းဆက်',
		descriptionEn: 'Read a name from input and print "Hello, [name]!"',
		descriptionMm: 'input မှ နာမည်တစ်ခု ဖတ်ပြီး "Hello, [name]!" print ထုတ်ပါ။',
		starterCode: 'name = input("")\nprint(f"Hello, {name}!")\n',
		testCases: [{ input: 'Aung', expectedOutput: 'Hello, Aung!', hidden: false }, { input: 'Mya', expectedOutput: 'Hello, Mya!', hidden: true }],
		hintsEn: ['name = input()', 'print(f"Hello, {name}!")'], hintsMm: ['name = input()', 'print(f"Hello, {name}!")'],
		difficulty: 3, orderIndex: 2, version: 1
	},
	{
		id: 'input-01-p3', lessonId: 'input-01', titleEn: 'Sum Two Numbers', titleMm: 'ဂဏန်းနှစ်ခု ပေါင်း',
		descriptionEn: 'Read two numbers from input (one per line) and print their sum.',
		descriptionMm: 'Input မှ ဂဏန်းနှစ်ခု (တစ်ကြောင်းတစ်ခု) ဖတ်ပြီး ပေါင်းကိန်း print ထုတ်ပါ။',
		starterCode: 'a = int(input(""))\nb = int(input(""))\nprint(a + b)\n',
		testCases: [{ input: '3\n7', expectedOutput: '10', hidden: false }, { input: '100\n200', expectedOutput: '300', hidden: true }],
		hintsEn: ['Read two ints with int(input())', 'print(a + b)'], hintsMm: ['int(input()) ဖြင့် integer နှစ်ခု ဖတ်ပါ', 'print(a + b)'],
		difficulty: 3, orderIndex: 3, version: 1
	},
	// ── conditions-01 ─────────────────────────────────────────
	{
		id: 'conditions-01-p1', lessonId: 'conditions-01', titleEn: 'Positive Check', titleMm: 'အပြုတန်ဖိုး စစ်ဆေး',
		descriptionEn: 'Given x = 7, print "Positive" if x > 0.',
		descriptionMm: 'x = 7 ပေးထားတယ်, x > 0 ဆိုရင် "Positive" print ထုတ်ပါ။',
		starterCode: 'x = 7\n', testCases: [{ input: '', expectedOutput: 'Positive', hidden: false }],
		hintsEn: ['if x > 0: print("Positive")'], hintsMm: ['if x > 0: print("Positive")'],
		difficulty: 3, orderIndex: 1, version: 1
	},
	{
		id: 'conditions-01-p2', lessonId: 'conditions-01', titleEn: 'Pass or Fail', titleMm: 'အောင် သို့ ကျ',
		descriptionEn: 'Given score = 55, print "Pass" if score >= 50, print "Fail" if score < 50.',
		descriptionMm: 'score = 55 ပေးထားတယ်, score >= 50 ဆိုရင် "Pass" print ထုတ်ပါ, score < 50 ဆိုရင် "Fail" print ထုတ်ပါ။',
		starterCode: 'score = 55\n', testCases: [{ input: '', expectedOutput: 'Pass', hidden: false }],
		hintsEn: ['Use two if statements or if/else'], hintsMm: ['if statement နှစ်ခု သို့ if/else သုံးပါ'],
		difficulty: 3, orderIndex: 2, version: 1
	},
	{
		id: 'conditions-01-p3', lessonId: 'conditions-01', titleEn: 'Even or Odd', titleMm: 'စုံ သို့ မဂဏန်း',
		descriptionEn: 'Given n = 14, print "Even" if n % 2 == 0, else print "Odd".',
		descriptionMm: 'n = 14 ပေးထားတယ်, n % 2 == 0 ဆိုရင် "Even" print ထုတ်ပါ, မဟုတ်ရင် "Odd" print ထုတ်ပါ။',
		starterCode: 'n = 14\n', testCases: [{ input: '', expectedOutput: 'Even', hidden: false }],
		hintsEn: ['if n % 2 == 0: print("Even")'], hintsMm: ['if n % 2 == 0: print("Even")'],
		difficulty: 3, orderIndex: 3, version: 1
	},
	// ── conditions-02 ─────────────────────────────────────────
	{
		id: 'conditions-02-p1', lessonId: 'conditions-02', titleEn: 'Grade Calculator', titleMm: 'အဆင့် တွက်ချက်ခြင်း',
		descriptionEn: 'Given score = 83, print "A" if >= 90, "B" if >= 80, "C" if >= 70, "D" if >= 60, "F" otherwise.',
		descriptionMm: 'score = 83 ပေးထားတယ်, >= 90 ဆိုရင် "A", >= 80 ဆိုရင် "B", >= 70 ဆိုရင် "C", >= 60 ဆိုရင် "D", မဟုတ်ရင် "F" print ထုတ်ပါ။',
		starterCode: 'score = 83\n', testCases: [{ input: '', expectedOutput: 'B', hidden: false }],
		hintsEn: ['Use if/elif/elif/elif/else'], hintsMm: ['if/elif/elif/elif/else သုံးပါ'],
		difficulty: 4, orderIndex: 1, version: 1
	},
	{
		id: 'conditions-02-p2', lessonId: 'conditions-02', titleEn: 'Temperature Message', titleMm: 'အပူချိန် မက်ဆေ့',
		descriptionEn: 'Given temp = 22, print "Cold" if < 15, "Warm" if 15-30, "Hot" if > 30.',
		descriptionMm: 'temp = 22 ပေးထားတယ်, < 15 ဆိုရင် "Cold", 15-30 ဆိုရင် "Warm", > 30 ဆိုရင် "Hot" print ထုတ်ပါ။',
		starterCode: 'temp = 22\n', testCases: [{ input: '', expectedOutput: 'Warm', hidden: false }],
		hintsEn: ['Use if/elif/else with temp < 15, temp > 30'], hintsMm: ['temp < 15, temp > 30 ဖြင့် if/elif/else သုံးပါ'],
		difficulty: 4, orderIndex: 2, version: 1
	},
	{
		id: 'conditions-02-p3', lessonId: 'conditions-02', titleEn: 'Biggest of Three', titleMm: 'သုံးခုထဲ အကြီးဆုံး',
		descriptionEn: 'Given a=10, b=25, c=18. Print the largest value.',
		descriptionMm: 'a=10, b=25, c=18 ပေးထားတယ်။ အကြီးဆုံး value ကို print ထုတ်ပါ။',
		starterCode: 'a = 10\nb = 25\nc = 18\n', testCases: [{ input: '', expectedOutput: '25', hidden: false }],
		hintsEn: ['Compare a, b, c with if/elif/else', 'Or use max(a, b, c)'], hintsMm: ['if/elif/else ဖြင့် a, b, c နှိုင်းယှဉ်ပါ', 'သို့ max(a, b, c) သုံးပါ'],
		difficulty: 4, orderIndex: 3, version: 1
	},
	// ── strings-01 ────────────────────────────────────────────
	{
		id: 'strings-01-p1', lessonId: 'strings-01', titleEn: 'SHOUT IT', titleMm: 'အော်ပြောပါ',
		descriptionEn: 'Given text = "hello world", print it in ALL CAPS.',
		descriptionMm: 'text = "hello world" ပေးထားတယ်, ကြီးစာလုံးအားလုံးဖြင့် print ထုတ်ပါ။',
		starterCode: 'text = "hello world"\n', testCases: [{ input: '', expectedOutput: 'HELLO WORLD', hidden: false }],
		hintsEn: ['Use text.upper()'], hintsMm: ['text.upper() သုံးပါ'],
		difficulty: 4, orderIndex: 1, version: 1
	},
	{
		id: 'strings-01-p2', lessonId: 'strings-01', titleEn: 'Character Count', titleMm: 'စာလုံးအရေအတွက်',
		descriptionEn: 'Given sentence = "Python is great", print its length.',
		descriptionMm: 'sentence = "Python is great" ပေးထားတယ်, ၎င်း၏ length ကို print ထုတ်ပါ။',
		starterCode: 'sentence = "Python is great"\n', testCases: [{ input: '', expectedOutput: '16', hidden: false }],
		hintsEn: ['Use len(sentence)'], hintsMm: ['len(sentence) သုံးပါ'],
		difficulty: 4, orderIndex: 2, version: 1
	},
	{
		id: 'strings-01-p3', lessonId: 'strings-01', titleEn: 'Replace Word', titleMm: 'စကားလုံး အစားထိုး',
		descriptionEn: 'Given msg = "I love cats", replace "cats" with "dogs" and print.',
		descriptionMm: 'msg = "I love cats" ပေးထားတယ်, "cats" ကို "dogs" ဖြင့် အစားထိုးပြီး print ထုတ်ပါ။',
		starterCode: 'msg = "I love cats"\n', testCases: [{ input: '', expectedOutput: 'I love dogs', hidden: false }],
		hintsEn: ['Use msg.replace("cats", "dogs")'], hintsMm: ['msg.replace("cats", "dogs") သုံးပါ'],
		difficulty: 4, orderIndex: 3, version: 1
	},
	// ── math-01 ───────────────────────────────────────────────
	{
		id: 'math-01-p1', lessonId: 'math-01', titleEn: 'Power of 2', titleMm: '2 ၏ ထပ်ညွှန်း',
		descriptionEn: 'Print 2 to the power of 10.',
		descriptionMm: '2 ၏ 10 ထပ် ကို print ထုတ်ပါ။',
		starterCode: '', testCases: [{ input: '', expectedOutput: '1024', hidden: false }],
		hintsEn: ['print(2 ** 10)'], hintsMm: ['print(2 ** 10)'],
		difficulty: 3, orderIndex: 1, version: 1
	},
	{
		id: 'math-01-p2', lessonId: 'math-01', titleEn: 'Remainder', titleMm: 'အကြွင်း',
		descriptionEn: 'Print the remainder of 47 divided by 6.',
		descriptionMm: '47 ကို 6 ဖြင့် စားသည့် အကြွင်းကို print ထုတ်ပါ။',
		starterCode: '', testCases: [{ input: '', expectedOutput: '5', hidden: false }],
		hintsEn: ['print(47 % 6)'], hintsMm: ['print(47 % 6)'],
		difficulty: 3, orderIndex: 2, version: 1
	},
	{
		id: 'math-01-p3', lessonId: 'math-01', titleEn: 'Odd Numbers 1-20', titleMm: 'မဂဏန်းများ 1-20',
		descriptionEn: 'Print how many odd numbers are between 1 and 20 inclusive.',
		descriptionMm: '1 ကနေ 20 ထိ (20 ပါ) မဂဏန်းဘယ်နှစ်ခု ရှိလဲ print ထုတ်ပါ။',
		starterCode: '', testCases: [{ input: '', expectedOutput: '10', hidden: false }],
		hintsEn: ['Count = 10 (1,3,5,7,9,11,13,15,17,19)', 'Or use a loop with % 2 != 0'], hintsMm: ['Count = 10 (1,3,5,7,9,11,13,15,17,19)', 'Loop နဲ့ % 2 != 0 သုံးနိုင်ပါတယ်'],
		difficulty: 4, orderIndex: 3, version: 1
	},
	// ── loops-01 ──────────────────────────────────────────────
	{
		id: 'loops-01-p1', lessonId: 'loops-01', titleEn: 'Count to 10', titleMm: '10 ထိ ရေပါ',
		descriptionEn: 'Print numbers 1 through 10, one per line.',
		descriptionMm: '1 ကနေ 10 ထိ ဂဏန်းများကို တစ်ကြောင်းတစ်ခု print ထုတ်ပါ။',
		starterCode: 'for i in range(1, 11):\n    print(i)\n',
		testCases: [{ input: '', expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10', hidden: false }],
		hintsEn: ['for i in range(1, 11): print(i)'], hintsMm: ['for i in range(1, 11): print(i)'],
		difficulty: 5, orderIndex: 1, version: 1
	},
	{
		id: 'loops-01-p2', lessonId: 'loops-01', titleEn: 'Sum 1 to 100', titleMm: '1 ကနေ 100 ထိ ပေါင်း',
		descriptionEn: 'Calculate and print the sum of numbers 1 through 100.',
		descriptionMm: '1 ကနေ 100 ထိ ဂဏန်းများ၏ ပေါင်းကိန်းကို တွက်ချက်ပြီး print ထုတ်ပါ။',
		starterCode: 'total = 0\nfor i in range(1, 101):\n    total = total + i\nprint(total)\n',
		testCases: [{ input: '', expectedOutput: '5050', hidden: false }],
		hintsEn: ['Start total=0, loop 1..100, add each i, print total'], hintsMm: ['total=0 ကနေ စပါ, 1..100 loop လုပ်ပါ, i တစ်ခုစီ ပေါင်းပါ, total print ထုတ်ပါ'],
		difficulty: 5, orderIndex: 2, version: 1
	},
	{
		id: 'loops-01-p3', lessonId: 'loops-01', titleEn: 'Times Table', titleMm: 'မြှောက်လဒ်ဇယား',
		descriptionEn: 'Print the 3 times table from 3×1 to 3×10. Each line: "3 x N = result"',
		descriptionMm: '3 ၏ မြှောက်လဒ်ဇယားကို 3×1 ကနေ 3×10 ထိ print ထုတ်ပါ။ တစ်ကြောင်းစီ: "3 x N = result"',
		starterCode: 'for i in range(1, 11):\n    print(f"3 x {i} = {3 * i}")\n',
		testCases: [{ input: '', expectedOutput: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30', hidden: false }],
		hintsEn: ['for i in range(1, 11): print(f"3 x {i} = {3*i}")'], hintsMm: ['for i in range(1, 11): print(f"3 x {i} = {3*i}")'],
		difficulty: 5, orderIndex: 3, version: 1
	},
	// ── loops-02 ──────────────────────────────────────────────
	{
		id: 'loops-02-p1', lessonId: 'loops-02', titleEn: 'Count Down from 10', titleMm: '10 ကနေ ဆင်းရေ',
		descriptionEn: 'Use a while loop to print 10 down to 1.',
		descriptionMm: 'while loop သုံးပြီး 10 ကနေ 1 ထိ ဆင်းပြီး print ထုတ်ပါ။',
		starterCode: 'n = 10\nwhile n >= 1:\n    print(n)\n    n = n - 1\n',
		testCases: [{ input: '', expectedOutput: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1', hidden: false }],
		hintsEn: ['n = 10, while n >= 1: print(n), n -= 1'], hintsMm: ['n = 10, while n >= 1: print(n), n -= 1'],
		difficulty: 5, orderIndex: 1, version: 1
	},
	{
		id: 'loops-02-p2', lessonId: 'loops-02', titleEn: 'Even Numbers', titleMm: 'စုံဂဏန်းများ',
		descriptionEn: 'Use a while loop to print all even numbers from 2 to 20.',
		descriptionMm: 'while loop သုံးပြီး 2 ကနေ 20 ထိ စုံဂဏန်းအားလုံး print ထုတ်ပါ။',
		starterCode: 'n = 2\nwhile n <= 20:\n    print(n)\n    n += 2\n',
		testCases: [{ input: '', expectedOutput: '2\n4\n6\n8\n10\n12\n14\n16\n18\n20', hidden: false }],
		hintsEn: ['n=2, while n<=20: print(n), n+=2'], hintsMm: ['n=2, while n<=20: print(n), n+=2'],
		difficulty: 5, orderIndex: 2, version: 1
	},
	{
		id: 'loops-02-p3', lessonId: 'loops-02', titleEn: 'Power Doubling', titleMm: 'ထပ်ဆင့်နှစ်ဆ',
		descriptionEn: 'Start with n=1. Print n and double it each step while n <= 1000.',
		descriptionMm: 'n=1 ကနေ စပါ။ n <= 1000 ဖြစ်နေစဉ် n ကို print ထုတ်ပြီး တစ်ဆင့်စီ နှစ်ဆ ပြောင်းပါ။',
		starterCode: 'n = 1\nwhile n <= 1000:\n    print(n)\n    n = n * 2\n',
		testCases: [{ input: '', expectedOutput: '1\n2\n4\n8\n16\n32\n64\n128\n256\n512', hidden: false }],
		hintsEn: ['n=1, while n<=1000: print(n), n*=2'], hintsMm: ['n=1, while n<=1000: print(n), n*=2'],
		difficulty: 5, orderIndex: 3, version: 1
	},
	// ── lists-01 ──────────────────────────────────────────────
	{
		id: 'lists-01-p1', lessonId: 'lists-01', titleEn: 'List Stats', titleMm: 'List စာရင်းကိန်းများ',
		descriptionEn: 'Given nums = [4, 17, 3, 22, 9], print the max, min, and sum.',
		descriptionMm: 'nums = [4, 17, 3, 22, 9] ပေးထားတယ်, max, min, sum ကို print ထုတ်ပါ။',
		starterCode: 'nums = [4, 17, 3, 22, 9]\nprint(max(nums))\nprint(min(nums))\nprint(sum(nums))\n',
		testCases: [{ input: '', expectedOutput: '22\n3\n55', hidden: false }],
		hintsEn: ['Use max(), min(), sum()'], hintsMm: ['max(), min(), sum() သုံးပါ'],
		difficulty: 6, orderIndex: 1, version: 1
	},
	{
		id: 'lists-01-p2', lessonId: 'lists-01', titleEn: 'Print Each Item', titleMm: 'Item တစ်ခုစီ Print ထုတ်',
		descriptionEn: 'Given animals = ["cat","dog","fish","bird"], print each on its own line with a "-" prefix.',
		descriptionMm: 'animals = ["cat","dog","fish","bird"] ပေးထားတယ်, တစ်ကြောင်းစီ "-" ရှေ့ကပ်ပြီး print ထုတ်ပါ။',
		starterCode: 'animals = ["cat", "dog", "fish", "bird"]\nfor a in animals:\n    print("-", a)\n',
		testCases: [{ input: '', expectedOutput: '- cat\n- dog\n- fish\n- bird', hidden: false }],
		hintsEn: ['for a in animals: print("-", a)'], hintsMm: ['for a in animals: print("-", a)'],
		difficulty: 6, orderIndex: 2, version: 1
	},
	{
		id: 'lists-01-p3', lessonId: 'lists-01', titleEn: 'Build a List', titleMm: 'List တည်ဆောက်',
		descriptionEn: 'Start with an empty list. Append 10, 20, 30. Then print the list.',
		descriptionMm: 'Empty list တစ်ခုကနေ စပါ။ 10, 20, 30 ကို append လုပ်ပါ။ ပြီးရင် list ကို print ထုတ်ပါ။',
		starterCode: 'items = []\nitems.append(10)\nitems.append(20)\nitems.append(30)\nprint(items)\n',
		testCases: [{ input: '', expectedOutput: '[10, 20, 30]', hidden: false }],
		hintsEn: ['items = [], then .append() three times'], hintsMm: ['items = [], ပြီးရင် .append() ၃ ကြိမ်'],
		difficulty: 6, orderIndex: 3, version: 1
	},
	// ── functions-01 ──────────────────────────────────────────
	{
		id: 'functions-01-p1', lessonId: 'functions-01', titleEn: 'Simple Function', titleMm: 'ရိုးရှင်းသော Function',
		descriptionEn: 'Write a function called `say_bye` that prints "Goodbye!". Call it twice.',
		descriptionMm: '"Goodbye!" print ထုတ်သော `say_bye` function ရေးပါ။ ၂ ကြိမ် ခေါ်ပါ။',
		starterCode: 'def say_bye():\n    print("Goodbye!")\n\nsay_bye()\nsay_bye()\n',
		testCases: [{ input: '', expectedOutput: 'Goodbye!\nGoodbye!', hidden: false }],
		hintsEn: ['def say_bye(): print("Goodbye!")'], hintsMm: ['def say_bye(): print("Goodbye!")'],
		difficulty: 6, orderIndex: 1, version: 1
	},
	{
		id: 'functions-01-p2', lessonId: 'functions-01', titleEn: 'Separator Line', titleMm: 'ကြားခံကြောင်း',
		descriptionEn: 'Write a function `line()` that prints 30 dashes. Call it 3 times.',
		descriptionMm: 'ဒဿ ၃၀ ချောင်း print ထုတ်သော `line()` function ရေးပါ။ ၃ ကြိမ် ခေါ်ပါ။',
		starterCode: 'def line():\n    print("-" * 30)\n\nline()\nline()\nline()\n',
		testCases: [{ input: '', expectedOutput: '------------------------------\n------------------------------\n------------------------------', hidden: false }],
		hintsEn: ['print("-" * 30) inside the function'], hintsMm: ['Function ထဲမှာ print("-" * 30)'],
		difficulty: 6, orderIndex: 2, version: 1
	},
	{
		id: 'functions-01-p3', lessonId: 'functions-01', titleEn: 'Count Function', titleMm: 'ရေတွက် Function',
		descriptionEn: 'Write a function `count_up(n)` that prints numbers 1 through n. Call it with n=5.',
		descriptionMm: '1 ကနေ n ထိ ဂဏန်းများ print ထုတ်သော `count_up(n)` function ရေးပါ။ n=5 ဖြင့် ခေါ်ပါ။',
		starterCode: 'def count_up(n):\n    for i in range(1, n + 1):\n        print(i)\n\ncount_up(5)\n',
		testCases: [{ input: '', expectedOutput: '1\n2\n3\n4\n5', hidden: false }],
		hintsEn: ['for i in range(1, n+1): print(i)'], hintsMm: ['for i in range(1, n+1): print(i)'],
		difficulty: 6, orderIndex: 3, version: 1
	},
	// ── functions-02 ──────────────────────────────────────────
	{
		id: 'functions-02-p1', lessonId: 'functions-02', titleEn: 'Square Function', titleMm: 'နှစ်ထပ်ကိန်း Function',
		descriptionEn: 'Write a function `square(n)` that returns n squared. Print square(8).',
		descriptionMm: 'n ၏ နှစ်ထပ်ကိန်း ပြန်ပေးသော `square(n)` function ရေးပါ။ square(8) ကို print ထုတ်ပါ။',
		starterCode: 'def square(n):\n    return n * n\n\nprint(square(8))\n',
		testCases: [{ input: '', expectedOutput: '64', hidden: false }],
		hintsEn: ['return n * n'], hintsMm: ['return n * n'],
		difficulty: 7, orderIndex: 1, version: 1
	},
	{
		id: 'functions-02-p2', lessonId: 'functions-02', titleEn: 'Max of Two', titleMm: 'နှစ်ခုထဲ အကြီးဆုံး',
		descriptionEn: 'Write a function `bigger(a, b)` that returns the larger of two numbers. Print bigger(14, 9).',
		descriptionMm: 'ဂဏန်းနှစ်ခုထဲ ပိုကြီးတဲ့ဟာ ပြန်ပေးသော `bigger(a, b)` function ရေးပါ။ bigger(14, 9) ကို print ထုတ်ပါ။',
		starterCode: 'def bigger(a, b):\n    if a > b:\n        return a\n    else:\n        return b\n\nprint(bigger(14, 9))\n',
		testCases: [{ input: '', expectedOutput: '14', hidden: false }],
		hintsEn: ['if a > b: return a, else: return b'], hintsMm: ['if a > b: return a, else: return b'],
		difficulty: 7, orderIndex: 2, version: 1
	},
	{
		id: 'functions-02-p3', lessonId: 'functions-02', titleEn: 'Average Function', titleMm: 'ပျမ်းမျှ Function',
		descriptionEn: 'Write a function `average(nums)` that returns the average of a list. Print average([10, 20, 30, 40]).',
		descriptionMm: 'List တစ်ခု၏ ပျမ်းမျှ ပြန်ပေးသော `average(nums)` function ရေးပါ။ average([10, 20, 30, 40]) ကို print ထုတ်ပါ။',
		starterCode: 'def average(nums):\n    return sum(nums) / len(nums)\n\nprint(average([10, 20, 30, 40]))\n',
		testCases: [{ input: '', expectedOutput: '25.0', hidden: false }],
		hintsEn: ['return sum(nums) / len(nums)'], hintsMm: ['return sum(nums) / len(nums)'],
		difficulty: 7, orderIndex: 3, version: 1
	}
];

export async function seedDatabase(): Promise<void> {
	const meta = await db.profiles.where('id').equals('__seed_meta__').first();
	if (meta && (meta as any).version >= SEED_VERSION) return;

	await db.transaction('rw', [db.lessons, db.problems, db.profiles], async () => {
		await db.lessons.bulkPut(lessons);
		await db.problems.bulkPut(problems);
		// Store seed version in a pseudo-profile record
		await db.profiles.put({ id: '__seed_meta__', displayName: '', role: 'student', ageGroup: '', preferredLanguage: 'mm', pinHash: '', currentDifficultyLevel: SEED_VERSION } as any);
	});
}
