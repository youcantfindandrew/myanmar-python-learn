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
import dicts01 from '$lib/content/lessons/dicts-01.json';
import errors01 from '$lib/content/lessons/errors-01.json';
import modules01 from '$lib/content/lessons/modules-01.json';
import comprehensions01 from '$lib/content/lessons/comprehensions-01.json';
import stringsAdvanced01 from '$lib/content/lessons/strings-advanced-01.json';
import classes01 from '$lib/content/lessons/classes-01.json';
import classes02 from '$lib/content/lessons/classes-02.json';
import recursion01 from '$lib/content/lessons/recursion-01.json';
import projectQuiz01 from '$lib/content/lessons/project-quiz-01.json';
import projectStory01 from '$lib/content/lessons/project-story-01.json';

const SEED_VERSION = 3;

const lessonData = [
	intro01, intro02, variables01, variables02, print01,
	input01, conditions01, conditions02, strings01, math01,
	loops01, loops02, lists01, functions01, functions02,
	dicts01, errors01, modules01, comprehensions01, stringsAdvanced01,
	classes01, classes02, recursion01, projectQuiz01, projectStory01
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
	},
	// ── dicts-01 ──────────────────────────────────────────────
	{
		id: 'dicts-01-p1', lessonId: 'dicts-01', titleEn: 'Student Grades', titleMm: 'ကျောင်းသား ဂုဏ်ထူး',
		descriptionEn: 'Create a dictionary with 3 students: {"Aung": 85, "Mya": 92, "Ko": 78}. Print the grade for "Aung".',
		descriptionMm: 'ကျောင်းသား ၃ ဦး {"Aung": 85, "Mya": 92, "Ko": 78} dictionary ဖောက်ပါ။ "Aung" ၏ ဂုဏ်ထူး print ထုတ်ပါ။',
		starterCode: 'grades = {"Aung": 85, "Mya": 92, "Ko": 78}\nprint(grades["Aung"])\n',
		testCases: [{ input: '', expectedOutput: '85', hidden: false }],
		hintsEn: ['Use grades["Aung"] to look up a value by key'], hintsMm: ['grades["Aung"] ဖြင့် key ဖြင့် value ရှာပါ'],
		difficulty: 7, orderIndex: 1, version: 1
	},
	{
		id: 'dicts-01-p2', lessonId: 'dicts-01', titleEn: 'Sum of Values', titleMm: 'Values ပေါင်းလဒ်',
		descriptionEn: 'Given d = {"a": 1, "b": 2, "c": 3}, print the sum of all values.',
		descriptionMm: 'd = {"a": 1, "b": 2, "c": 3} ပေးထားသည်၊ values အားလုံး ပေါင်းလဒ် print ထုတ်ပါ။',
		starterCode: 'd = {"a": 1, "b": 2, "c": 3}\nprint(sum(d.values()))\n',
		testCases: [{ input: '', expectedOutput: '6', hidden: false }],
		hintsEn: ['Use sum(d.values())'], hintsMm: ['sum(d.values()) သုံးပါ'],
		difficulty: 7, orderIndex: 2, version: 1
	},
	{
		id: 'dicts-01-p3', lessonId: 'dicts-01', titleEn: 'Add to Dict', titleMm: 'Dict ထဲ ထည့်မည်',
		descriptionEn: 'Create a fruit price dictionary with 3 fruits, add "mango" with price 1.5, then print the length.',
		descriptionMm: 'သစ်သီး ၃ မျိုး ဈေးနှုန်း dictionary ဖောက်ပြီး "mango" ကို ဈေးနှုန်း 1.5 ဖြင့် ထည့်ပါ၊ ပြီးရင် length print ထုတ်ပါ။',
		starterCode: 'fruits = {"apple": 1.0, "banana": 0.5, "orange": 0.8}\nfruits["mango"] = 1.5\nprint(len(fruits))\n',
		testCases: [{ input: '', expectedOutput: '4', hidden: false }],
		hintsEn: ['fruits["mango"] = 1.5 adds a new key', 'len(fruits) counts the entries'], hintsMm: ['fruits["mango"] = 1.5 ဖြင့် key အသစ် ထည့်ပါ', 'len(fruits) ဖြင့် entries ရေတွက်ပါ'],
		difficulty: 7, orderIndex: 3, version: 1
	},
	// ── errors-01 ──────────────────────────────────────────────
	{
		id: 'errors-01-p1', lessonId: 'errors-01', titleEn: 'Safe Convert', titleMm: 'ဘေးကင်းသော ပြောင်းလဲခြင်း',
		descriptionEn: 'Use try/except to convert "hello" to int. If it fails, print "Not a number".',
		descriptionMm: 'try/except ဖြင့် "hello" ကို int ပြောင်းပါ။ မအောင်မြင်ရင် "Not a number" print ထုတ်ပါ။',
		starterCode: 'try:\n    print(int("hello"))\nexcept ValueError:\n    print("Not a number")\n',
		testCases: [{ input: '', expectedOutput: 'Not a number', hidden: false }],
		hintsEn: ['int("hello") raises ValueError', 'Catch it with except ValueError:'], hintsMm: ['int("hello") က ValueError ဖြစ်ပါတယ်', 'except ValueError: ဖြင့် ဖမ်းပါ'],
		difficulty: 7, orderIndex: 1, version: 1
	},
	{
		id: 'errors-01-p2', lessonId: 'errors-01', titleEn: 'No Division by Zero', titleMm: 'သုည (0) ဖြင့် မစားရ',
		descriptionEn: 'Use try/except to divide 10 by 0. Catch ZeroDivisionError and print "Cannot divide by zero".',
		descriptionMm: 'try/except ဖြင့် 10 ကို 0 ဖြင့် ပိုင်းပါ။ ZeroDivisionError ဖမ်းပြီး "Cannot divide by zero" print ထုတ်ပါ။',
		starterCode: 'try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\n',
		testCases: [{ input: '', expectedOutput: 'Cannot divide by zero', hidden: false }],
		hintsEn: ['10 / 0 raises ZeroDivisionError'], hintsMm: ['10 / 0 က ZeroDivisionError ဖြစ်ပါတယ်'],
		difficulty: 7, orderIndex: 2, version: 1
	},
	{
		id: 'errors-01-p3', lessonId: 'errors-01', titleEn: 'Missing Key', titleMm: 'မရှိသော Key',
		descriptionEn: 'Try to access key "z" from {"a": 1}. Catch KeyError and print "Key not found".',
		descriptionMm: '{"a": 1} မှ key "z" ကို ယူဖို့ ကြိုးပမ်းပါ။ KeyError ဖမ်းပြီး "Key not found" print ထုတ်ပါ။',
		starterCode: 'try:\n    d = {"a": 1}\n    print(d["z"])\nexcept KeyError:\n    print("Key not found")\n',
		testCases: [{ input: '', expectedOutput: 'Key not found', hidden: false }],
		hintsEn: ['d["z"] raises KeyError when "z" is not a key'], hintsMm: ['"z" key မရှိရင် d["z"] က KeyError ဖြစ်ပါတယ်'],
		difficulty: 7, orderIndex: 3, version: 1
	},
	// ── modules-01 ──────────────────────────────────────────────
	{
		id: 'modules-01-p1', lessonId: 'modules-01', titleEn: 'Floor and Ceil', titleMm: 'Floor နှင့် Ceil',
		descriptionEn: 'Import math. Print math.floor(7.8), then print math.ceil(7.2).',
		descriptionMm: 'math import ပါ။ math.floor(7.8) print ထုတ်ပါ၊ ပြီးရင် math.ceil(7.2) print ထုတ်ပါ။',
		starterCode: 'import math\nprint(math.floor(7.8))\nprint(math.ceil(7.2))\n',
		testCases: [{ input: '', expectedOutput: '7\n8', hidden: false }],
		hintsEn: ['floor rounds down, ceil rounds up'], hintsMm: ['floor က အောက်သို့ ပတ်ဆင်းပြီး ceil က အပေါ်သို့ ပတ်တက်ပါတယ်'],
		difficulty: 7, orderIndex: 1, version: 1
	},
	{
		id: 'modules-01-p2', lessonId: 'modules-01', titleEn: 'Square Root', titleMm: 'နှစ်ထပ်ကိန်းရင်း',
		descriptionEn: 'Import math. Print the square root of 144 as an integer.',
		descriptionMm: 'math import ပါ။ 144 ၏ နှစ်ထပ်ကိန်းရင်းကို integer အဖြစ် print ထုတ်ပါ။',
		starterCode: 'import math\nprint(round(math.sqrt(144)))\n',
		testCases: [{ input: '', expectedOutput: '12', hidden: false }],
		hintsEn: ['math.sqrt(144) gives 12.0', 'round() converts to 12'], hintsMm: ['math.sqrt(144) က 12.0 ပေးပါတယ်', 'round() ဖြင့် 12 ပြောင်းပါ'],
		difficulty: 7, orderIndex: 2, version: 1
	},
	{
		id: 'modules-01-p3', lessonId: 'modules-01', titleEn: 'Pi Rounded', titleMm: 'Pi ပတ်ဆင်းမည်',
		descriptionEn: 'Import math. Print pi rounded to 2 decimal places.',
		descriptionMm: 'math import ပါ။ Pi ကို ဒသမ ၂ ဂဏန်းထိ ပတ်ဆင်းပြီး print ထုတ်ပါ။',
		starterCode: 'import math\nprint(round(math.pi, 2))\n',
		testCases: [{ input: '', expectedOutput: '3.14', hidden: false }],
		hintsEn: ['round(math.pi, 2) rounds to 2 decimal places'], hintsMm: ['round(math.pi, 2) ဒသမ ၂ ဂဏန်းထိ ပတ်ဆင်းပါတယ်'],
		difficulty: 7, orderIndex: 3, version: 1
	},
	// ── comprehensions-01 ──────────────────────────────────────
	{
		id: 'comprehensions-01-p1', lessonId: 'comprehensions-01', titleEn: 'Squares List', titleMm: 'နှစ်ထပ်ကိန်းများ List',
		descriptionEn: 'Use a list comprehension to print a list of squares for numbers 1 to 5.',
		descriptionMm: 'List comprehension ဖြင့် 1 ကနေ 5 ထိ ဂဏန်းများ၏ နှစ်ထပ်ကိန်း list ကို print ထုတ်ပါ။',
		starterCode: 'print([x**2 for x in range(1, 6)])\n',
		testCases: [{ input: '', expectedOutput: '[1, 4, 9, 16, 25]', hidden: false }],
		hintsEn: ['[x**2 for x in range(1, 6)]'], hintsMm: ['[x**2 for x in range(1, 6)]'],
		difficulty: 8, orderIndex: 1, version: 1
	},
	{
		id: 'comprehensions-01-p2', lessonId: 'comprehensions-01', titleEn: 'Multiples of 5', titleMm: '5 ၏ ဆပေါင်းများ',
		descriptionEn: 'Use a list comprehension to print all multiples of 5 from 1 to 20.',
		descriptionMm: 'List comprehension ဖြင့် 1 ကနေ 20 ထိ 5 ၏ ဆပေါင်းများ print ထုတ်ပါ။',
		starterCode: 'print([x for x in range(1, 21) if x % 5 == 0])\n',
		testCases: [{ input: '', expectedOutput: '[5, 10, 15, 20]', hidden: false }],
		hintsEn: ['Add if x % 5 == 0 as a condition'], hintsMm: ['if x % 5 == 0 ကို condition အဖြစ် ထည့်ပါ'],
		difficulty: 8, orderIndex: 2, version: 1
	},
	{
		id: 'comprehensions-01-p3', lessonId: 'comprehensions-01', titleEn: 'Long Words', titleMm: 'ရှည်သော စကားလုံးများ',
		descriptionEn: 'words = ["hi","hello","hey","howdy"]. Use a list comprehension to print words longer than 3 characters.',
		descriptionMm: 'words = ["hi","hello","hey","howdy"] ။ List comprehension ဖြင့် ၃ ထက်ပိုရှည်သော စကားလုံးများ print ထုတ်ပါ။',
		starterCode: 'words = ["hi", "hello", "hey", "howdy"]\nprint([w for w in words if len(w) > 3])\n',
		testCases: [{ input: '', expectedOutput: "['hello', 'howdy']", hidden: false }],
		hintsEn: ['Filter with if len(w) > 3'], hintsMm: ['if len(w) > 3 ဖြင့် စစ်ထုတ်ပါ'],
		difficulty: 8, orderIndex: 3, version: 1
	},
	// ── strings-advanced-01 ──────────────────────────────────────
	{
		id: 'strings-advanced-01-p1', lessonId: 'strings-advanced-01', titleEn: 'Strip Spaces', titleMm: 'Spaces ဖယ်ရှားမည်',
		descriptionEn: 'Print "  Python  " with leading and trailing spaces removed.',
		descriptionMm: '"  Python  " ကို ရှေ့နောက် spaces ဖယ်ပြီး print ထုတ်ပါ။',
		starterCode: 's = "  Python  "\nprint(s.strip())\n',
		testCases: [{ input: '', expectedOutput: 'Python', hidden: false }],
		hintsEn: ['.strip() removes leading and trailing spaces'], hintsMm: ['.strip() က ရှေ့နောက် spaces ဖယ်ပါတယ်'],
		difficulty: 8, orderIndex: 1, version: 1
	},
	{
		id: 'strings-advanced-01-p2', lessonId: 'strings-advanced-01', titleEn: 'Word Count', titleMm: 'စကားလုံး ရေတွက်',
		descriptionEn: 'Split "I love coding" by spaces and print the number of words.',
		descriptionMm: '"I love coding" ကို spaces ဖြင့် ကွဲပြီး စကားလုံးအရေအတွက် print ထုတ်ပါ။',
		starterCode: 'sentence = "I love coding"\nwords = sentence.split(" ")\nprint(len(words))\n',
		testCases: [{ input: '', expectedOutput: '3', hidden: false }],
		hintsEn: ['.split(" ") splits by space', 'len() counts the items'], hintsMm: ['.split(" ") က space ဖြင့် ကွဲပြီး', 'len() ဖြင့် item ရေတွက်ပါ'],
		difficulty: 8, orderIndex: 2, version: 1
	},
	{
		id: 'strings-advanced-01-p3', lessonId: 'strings-advanced-01', titleEn: 'Join Words', titleMm: 'စကားလုံးများ ပေါင်းမည်',
		descriptionEn: 'Join ["Hello", "Myanmar"] with a space between them and print the result.',
		descriptionMm: '["Hello", "Myanmar"] ကို space တစ်ခုဖြင့် ကြားကာ ပေါင်းပြီး ရလဒ် print ထုတ်ပါ။',
		starterCode: 'print(" ".join(["Hello", "Myanmar"]))\n',
		testCases: [{ input: '', expectedOutput: 'Hello Myanmar', hidden: false }],
		hintsEn: ['" ".join(list) joins with a space'], hintsMm: ['" ".join(list) က space ဖြင့် ပေါင်းပါတယ်'],
		difficulty: 8, orderIndex: 3, version: 1
	},
	// ── classes-01 ──────────────────────────────────────────────
	{
		id: 'classes-01-p1', lessonId: 'classes-01', titleEn: 'Dog Class', titleMm: 'ခွေး Class',
		descriptionEn: 'Create a class Dog with __init__(self, name). Create dog = Dog("Rex") and print dog.name.',
		descriptionMm: '__init__(self, name) ပါ Dog class ဖောက်ပါ။ dog = Dog("Rex") ဖောက်ပြီး dog.name print ထုတ်ပါ။',
		starterCode: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n\ndog = Dog("Rex")\nprint(dog.name)\n',
		testCases: [{ input: '', expectedOutput: 'Rex', hidden: false }],
		hintsEn: ['self.name = name stores the name', 'Access it with dog.name'], hintsMm: ['self.name = name ဖြင့် နာမည် သိမ်းပါ', 'dog.name ဖြင့် ဝင်ယူပါ'],
		difficulty: 9, orderIndex: 1, version: 1
	},
	{
		id: 'classes-01-p2', lessonId: 'classes-01', titleEn: 'Circle Class', titleMm: 'စက်ဝိုင်း Class',
		descriptionEn: 'Create a class Circle with __init__(self, radius). Create c = Circle(5) and print c.radius.',
		descriptionMm: '__init__(self, radius) ပါ Circle class ဖောက်ပါ။ c = Circle(5) ဖောက်ပြီး c.radius print ထုတ်ပါ။',
		starterCode: 'class Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\nc = Circle(5)\nprint(c.radius)\n',
		testCases: [{ input: '', expectedOutput: '5', hidden: false }],
		hintsEn: ['self.radius = radius in __init__'], hintsMm: ['__init__ ထဲ self.radius = radius ထည့်ပါ'],
		difficulty: 9, orderIndex: 2, version: 1
	},
	{
		id: 'classes-01-p3', lessonId: 'classes-01', titleEn: 'Student Class', titleMm: 'ကျောင်းသား Class',
		descriptionEn: 'Create a Student class with name and grade attributes. Create s = Student("Aung", 90). Print s.name then s.grade on separate lines.',
		descriptionMm: 'name နှင့် grade attribute ပါ Student class ဖောက်ပါ။ s = Student("Aung", 90) ဖောက်ပါ။ s.name ပြီးရင် s.grade ကို သီးခြားကြောင်းများဖြင့် print ထုတ်ပါ။',
		starterCode: 'class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n\ns = Student("Aung", 90)\nprint(s.name)\nprint(s.grade)\n',
		testCases: [{ input: '', expectedOutput: 'Aung\n90', hidden: false }],
		hintsEn: ['Store both in __init__ with self.name and self.grade'], hintsMm: ['__init__ ထဲ self.name နှင့် self.grade နှစ်ခုလုံး သိမ်းပါ'],
		difficulty: 9, orderIndex: 3, version: 1
	},
	// ── classes-02 ──────────────────────────────────────────────
	{
		id: 'classes-02-p1', lessonId: 'classes-02', titleEn: 'Counter Class', titleMm: 'ရေတွက်ကိရိယာ Class',
		descriptionEn: 'Create a Counter class with count=0 and an increment() method that adds 1. Call increment() twice then print c.count.',
		descriptionMm: 'count=0 နှင့် 1 ပေါင်းသော increment() method ပါ Counter class ဖောက်ပါ။ increment() ကို ၂ ကြိမ် ခေါ်ပြီး c.count print ထုတ်ပါ။',
		starterCode: 'class Counter:\n    def __init__(self):\n        self.count = 0\n    def increment(self):\n        self.count += 1\n\nc = Counter()\nc.increment()\nc.increment()\nprint(c.count)\n',
		testCases: [{ input: '', expectedOutput: '2', hidden: false }],
		hintsEn: ['self.count += 1 in increment()', 'Call c.increment() twice'], hintsMm: ['increment() ထဲ self.count += 1 ထည့်ပါ', 'c.increment() ကို ၂ ကြိမ် ခေါ်ပါ'],
		difficulty: 9, orderIndex: 1, version: 1
	},
	{
		id: 'classes-02-p2', lessonId: 'classes-02', titleEn: 'Rectangle Area', titleMm: 'စတုဂံ ဧရိယာ',
		descriptionEn: 'Create a Rectangle class with width and height, and an area() method. Create r = Rectangle(4, 5) and print r.area().',
		descriptionMm: 'width, height နှင့် area() method ပါ Rectangle class ဖောက်ပါ။ r = Rectangle(4, 5) ဖောက်ပြီး r.area() print ထုတ်ပါ။',
		starterCode: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    def area(self):\n        return self.width * self.height\n\nr = Rectangle(4, 5)\nprint(r.area())\n',
		testCases: [{ input: '', expectedOutput: '20', hidden: false }],
		hintsEn: ['return self.width * self.height in area()'], hintsMm: ['area() ထဲ return self.width * self.height ထည့်ပါ'],
		difficulty: 9, orderIndex: 2, version: 1
	},
	{
		id: 'classes-02-p3', lessonId: 'classes-02', titleEn: 'Greeter Class', titleMm: 'နှုတ်ဆက်ကိရိယာ Class',
		descriptionEn: 'Create a Greeter class with a name attribute and a greet() method that prints "Hello, {name}!". Create g = Greeter("Mya") and call g.greet().',
		descriptionMm: 'name attribute နှင့် "Hello, {name}!" print ထုတ်သော greet() method ပါ Greeter class ဖောက်ပါ။ g = Greeter("Mya") ဖောက်ပြီး g.greet() ခေါ်ပါ။',
		starterCode: 'class Greeter:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        print(f"Hello, {self.name}!")\n\ng = Greeter("Mya")\ng.greet()\n',
		testCases: [{ input: '', expectedOutput: 'Hello, Mya!', hidden: false }],
		hintsEn: ['print(f"Hello, {self.name}!") in greet()'], hintsMm: ['greet() ထဲ print(f"Hello, {self.name}!") ထည့်ပါ'],
		difficulty: 9, orderIndex: 3, version: 1
	},
	// ── recursion-01 ──────────────────────────────────────────────
	{
		id: 'recursion-01-p1', lessonId: 'recursion-01', titleEn: 'Factorial', titleMm: 'ဂဏန်း အဆင့်ထပ်',
		descriptionEn: 'Write a recursive function factorial(n) that returns n! (n factorial). Print factorial(5).',
		descriptionMm: 'n! (n factorial) ပြန်ပေးသော recursive function factorial(n) ရေးပါ။ factorial(5) print ထုတ်ပါ။',
		starterCode: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))\n',
		testCases: [{ input: '', expectedOutput: '120', hidden: false }],
		hintsEn: ['Base case: if n <= 1: return 1', 'Recursive: return n * factorial(n - 1)'], hintsMm: ['Base case: if n <= 1: return 1', 'Recursive: return n * factorial(n - 1)'],
		difficulty: 9, orderIndex: 1, version: 1
	},
	{
		id: 'recursion-01-p2', lessonId: 'recursion-01', titleEn: 'Sum Down', titleMm: 'ဆင်းပေါင်းလဒ်',
		descriptionEn: 'Write a recursive function sum_down(n) that returns the sum of n + (n-1) + ... + 1. Print sum_down(4).',
		descriptionMm: 'n + (n-1) + ... + 1 ပေါင်းလဒ် ပြန်ပေးသော recursive function sum_down(n) ရေးပါ။ sum_down(4) print ထုတ်ပါ။',
		starterCode: 'def sum_down(n):\n    if n == 0:\n        return 0\n    return n + sum_down(n - 1)\n\nprint(sum_down(4))\n',
		testCases: [{ input: '', expectedOutput: '10', hidden: false }],
		hintsEn: ['sum_down(4) = 4 + sum_down(3) = 4+3+2+1+0 = 10'], hintsMm: ['sum_down(4) = 4 + sum_down(3) = 4+3+2+1+0 = 10'],
		difficulty: 9, orderIndex: 2, version: 1
	},
	{
		id: 'recursion-01-p3', lessonId: 'recursion-01', titleEn: 'Recursive Countdown', titleMm: 'Recursive ရေတွက်ဆင်းမည်',
		descriptionEn: 'Write a recursive function countdown(n) that prints numbers from n down to 1, then prints "Go!". Call countdown(4).',
		descriptionMm: 'n ကနေ 1 ထိ ဂဏန်းများ print ထုတ်ပြီး "Go!" print ထုတ်သော recursive function countdown(n) ရေးပါ။ countdown(4) ခေါ်ပါ။',
		starterCode: 'def countdown(n):\n    if n <= 0:\n        print("Go!")\n    else:\n        print(n)\n        countdown(n - 1)\n\ncountdown(4)\n',
		testCases: [{ input: '', expectedOutput: '4\n3\n2\n1\nGo!', hidden: false }],
		hintsEn: ['Print n, then call countdown(n-1)', 'Base case: if n <= 0: print("Go!")'], hintsMm: ['n print ပြီး countdown(n-1) ခေါ်ပါ', 'Base case: if n <= 0: print("Go!")'],
		difficulty: 9, orderIndex: 3, version: 1
	},
	// ── project-quiz-01 ──────────────────────────────────────────
	{
		id: 'project-quiz-01-p1', lessonId: 'project-quiz-01', titleEn: 'Score Counter', titleMm: 'Score ရေတွက်',
		descriptionEn: 'Given answers = ["4", "wrong", "6"], count how many equal "4" or "6". Print the score.',
		descriptionMm: 'answers = ["4", "wrong", "6"] ပေးထားသည်၊ "4" သို့မဟုတ် "6" နှင့် ညီသည် မည်မျှ ရှိသည်ဆိုတာ ရေတွက်ပါ။ Score print ထုတ်ပါ။',
		starterCode: 'answers = ["4", "wrong", "6"]\ncorrect = ["4", "6"]\nscore = 0\nfor a in answers:\n    if a in correct:\n        score += 1\nprint(score)\n',
		testCases: [{ input: '', expectedOutput: '2', hidden: false }],
		hintsEn: ['Loop through answers and check if each is in the correct list'], hintsMm: ['answers ကို loop ဝင်ပြီး correct list ထဲ ရှိမရှိ စစ်ပါ'],
		difficulty: 10, orderIndex: 1, version: 1
	},
	{
		id: 'project-quiz-01-p2', lessonId: 'project-quiz-01', titleEn: 'Print Questions', titleMm: 'မေးခွန်းများ Print ထုတ်မည်',
		descriptionEn: 'Create a list of 3 question dicts with a "q" key. Loop through them and print each question.',
		descriptionMm: '"q" key ပါ question dict ၃ ခု list ဖောက်ပါ။ Loop ဝင်ပြီး question တစ်ခုချင်း print ထုတ်ပါ။',
		starterCode: 'questions = [\n    {"q": "What is 2+2?"},\n    {"q": "What color is grass?"},\n    {"q": "How many days in a week?"}\n]\nfor q in questions:\n    print(q["q"])\n',
		testCases: [{ input: '', expectedOutput: 'What is 2+2?\nWhat color is grass?\nHow many days in a week?', hidden: false }],
		hintsEn: ['Access each question with q["q"]'], hintsMm: ['q["q"] ဖြင့် question တစ်ခုချင်း ဝင်ယူပါ'],
		difficulty: 10, orderIndex: 2, version: 1
	},
	{
		id: 'project-quiz-01-p3', lessonId: 'project-quiz-01', titleEn: 'Full Mini Quiz', titleMm: 'Mini Quiz အပြည့်',
		descriptionEn: 'questions = [{"question":"2+2","answer":"4"},{"question":"3+3","answer":"6"}]. Loop and count correct answers (assume answer always matches). Print final score.',
		descriptionMm: 'questions = [{"question":"2+2","answer":"4"},{"question":"3+3","answer":"6"}]။ Loop ဝင်ပြီး မှန်ကန်သော ဖြေဆိုချက် ရေတွက်ပါ (answer က အမြဲ ကိုက်ညီသည်ဟု ယူဆပါ)။ Final score print ထုတ်ပါ။',
		starterCode: 'questions = [\n    {"question": "2+2", "answer": "4"},\n    {"question": "3+3", "answer": "6"}\n]\nscore = 0\nfor q in questions:\n    # Simulate correct answer\n    given = q["answer"]\n    if given == q["answer"]:\n        score += 1\nprint(score)\n',
		testCases: [{ input: '', expectedOutput: '2', hidden: false }],
		hintsEn: ['Loop through questions, compare given to q["answer"]'], hintsMm: ['questions ကို loop ဝင်ပြီး given ကို q["answer"] နှင့် နှိုင်းပါ'],
		difficulty: 10, orderIndex: 3, version: 1
	},
	// ── project-story-01 ──────────────────────────────────────────
	{
		id: 'project-story-01-p1', lessonId: 'project-story-01', titleEn: 'Scene Function', titleMm: 'Scene Function',
		descriptionEn: 'Write scene(score, choice) that returns score+10 if choice=="1", else returns score. Print scene(0,"1") and scene(0,"2").',
		descriptionMm: 'choice=="1" ရင် score+10 ပြန်ပေးပြီး မဟုတ်ရင် score ပြန်ပေးသော scene(score, choice) ရေးပါ။ scene(0,"1") နှင့် scene(0,"2") print ထုတ်ပါ။',
		starterCode: 'def scene(score, choice):\n    if choice == "1":\n        return score + 10\n    return score\n\nprint(scene(0, "1"))\nprint(scene(0, "2"))\n',
		testCases: [{ input: '', expectedOutput: '10\n0', hidden: false }],
		hintsEn: ['if choice == "1": return score + 10', 'else: return score'], hintsMm: ['if choice == "1": return score + 10', 'မဟုတ်ရင်: return score'],
		difficulty: 10, orderIndex: 1, version: 1
	},
	{
		id: 'project-story-01-p2', lessonId: 'project-story-01', titleEn: 'Battle Damage', titleMm: 'တိုက်ပွဲ ထိခိုက်မှု',
		descriptionEn: 'health=100. Apply attacks=[15,20,10] by looping and subtracting each. Print final health.',
		descriptionMm: 'health=100 ။ attacks=[15,20,10] ကို loop ဝင်ပြီး တစ်ခုချင်း နုတ်ပါ။ Final health print ထုတ်ပါ။',
		starterCode: 'health = 100\nattacks = [15, 20, 10]\nfor a in attacks:\n    health -= a\nprint(health)\n',
		testCases: [{ input: '', expectedOutput: '55', hidden: false }],
		hintsEn: ['health -= a subtracts each attack', '100 - 15 - 20 - 10 = 55'], hintsMm: ['health -= a ဖြင့် တိုက်ခိုက်မှု တစ်ခုချင်း နုတ်ပါ', '100 - 15 - 20 - 10 = 55'],
		difficulty: 10, orderIndex: 2, version: 1
	},
	{
		id: 'project-story-01-p3', lessonId: 'project-story-01', titleEn: 'Game Over Check', titleMm: 'ဂိမ်းပြီးဆုံးမှု စစ်ဆေးမည်',
		descriptionEn: 'Write is_game_over(hp) that returns True if hp <= 0, else False. Print is_game_over(0) and is_game_over(50).',
		descriptionMm: 'hp <= 0 ရင် True ပြန်ပေးပြီး မဟုတ်ရင် False ပြန်ပေးသော is_game_over(hp) ရေးပါ။ is_game_over(0) နှင့် is_game_over(50) print ထုတ်ပါ။',
		starterCode: 'def is_game_over(hp):\n    return hp <= 0\n\nprint(is_game_over(0))\nprint(is_game_over(50))\n',
		testCases: [{ input: '', expectedOutput: 'True\nFalse', hidden: false }],
		hintsEn: ['return hp <= 0 evaluates to True or False directly'], hintsMm: ['return hp <= 0 က True ဒါမှမဟုတ် False ကို တိုက်ရိုက် ထုတ်ပေးပါတယ်'],
		difficulty: 10, orderIndex: 3, version: 1
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
