# GM / MPC Coding Standards (2017/06/28 version)

# Target
- By unifying the coding style, readability will be improved, and productivity and maintainability will be improved.
- Eliminate coding that tends to cause quality problems and improve quality.

# Scope of application
Target all TypeScript source code created in the development project.

# Premise of this agreement
- Targets TypeScript 2.6.
- The target browser type and its version are not particularly limited.
- The class in this agreement refers to the definition created by the TypeScript class statement, and does not refer to the class created by the JavaScript function statement.

# tool
Use tslint as a static analysis tool

## Installation method
- Install tslint globally
  - npm install -g tslint
- Install the extension to use tslint from Visual Studio Code. Set http.proxy in advance
  - code - install-extension eg2.tslint


# Naming convention
Identifiers are named according to the following rules.
Item No. Identifier Rule example
- Namespace - Default value for all lowercase letters wm, wm.internal, samples
- Class(*Note 1) - Noun - Upper camel case(*Note 2) Company, Employee
- Interface - Noun - Upper camel case Collection, List
- Public method - Verb - Camel case(*Note 3) open(), getById(id), getByEnvelope(envelope)
- Protected method - Verb - Camel case open(), onLoad()
- Private method - Verb - Camel case and underscore at the beginning _open(), _onLoad()
- Event listener - on + Upper camel case of event name onLoad(), onClick()
- Variables - Nouns or adjectives(boolean) - Camelcase color, visible, propertyCount
- Dummy argument - Noun or adjective(boolean) - Camelcase color, visible, propertyCount
- Constant name - Noun - All uppercase and concatenate words with underscore MAX_PATH_LENGTH, AC_ADDRESS
- Character constant value - Noun - All lowercase letters and hyphenated words top-left, double-click
- Prohibit the use of global variables
- Properties-Accessors- Nouns or adjectives(boolean) - Camelcase width, height, visible, propertyCount
- Public member variables - Any based on camelcase(only available in the interface for argument options) color, visible, showScaleBar
- Do not use protected member variables. Use accessor
- Private member variable - Noun or adjective(boolean) - Camel case with underscore at the beginning _number, _propertyCount
- Local variables - Arbitrary number based on camel case
- Literal type - Noun - Upper camel case ResolutionType, PresetButtonType
- Enumeration(enum) use prohibited. Use the character constant type
(*Note 1) Scope cannot be specified in TypeScript for classes, interfaces, and enumerations. Always public.
(*Note 2) A method of writing the first letter of each word in capital letters when concatenating English words to write compound words and phrases.
(*Note 3) A method of writing the first letter of each word in lowercase when concatenating English words to write compound words and phrases.

## Common rules
- Use English words so that you can understand the meaning from the name.　　
  Words are not abbreviated with the following exceptions.
  - Abbreviation (word) Example
  - App (Application) AppContext
  - Alt (Altitude) LonLatExpression {lon: 0, lat: 0, alt: 0}
  - Config (Configuration) MapConfig
  - Def (Definition) PropertyDef
  - Lat (Latitude) LonLatLabel
  - Lon (Longitude) LonLatLabel
  - Utils (Utilities) CanvasTextUtils
  - Impl (Implementation) FeatureCollectionImpl <br />
    (Limited to a single implementation of the interface)
  - src (Source) srcPoint
  - dst (Destination) dstPoint
    (src and dst are limited to the case where both are a set)
  - Px (Pixel) meterPerPx <br />

- Do not use negative words for identifiers that handle logical values. <br/>
 // Good example <br />
 ok; <br />
 // Bad example: Use negative words <br />
 not OK; <br />

- When including an abbreviation or acronym in an identifier, use a camel case with uppercase letters only at the beginning. <br/>
// TODO Once as it is, try developing it and reconsider
 // Good example <br />
 getHtml(), HtmlDocument <br />
 // Bad example: mixed notation <br />
 getHtml(), HTMLDocument <br />

## Namespace
- Use all lowercase nouns in the namespace.
- The API is wm, the argument options for the API are wm.options, and the internal processing is wm.internal.
The sample source is samples, and other than the above is not used.

## Argument options
- Prepare argument options when required only in constructor arguments.
- The arguments of methods other than the constructor are inline key - value format, and no argument options are created. (Example) CanvasGraphics.drawCircle()

## Type alias
- In the following cases, consider the definition of Type alias.
    - When limiting the values ​​that can be taken as parameters.

      (Description example)

      export type PresetPointSymbol = "circle" | "square" | "diamond" | "triangle" | "cross" | "diagonal-cross" | "star";
    - If you want to clarify that it is a character string such as StyleId, but it has a specific meaning, consider creating it according to the frequency of use.
        - Example of type alias
            - CSSColor
            - ContainerId
            - EngineContainerId
            - EngineNodeId
            - FeatureId
            - SrsId
        - Example without type alias
            - Leave the style / labeling ID on the GM / Server side as string. (I don't make EngineLabelingStyleID or something)
- If you cannot make a decision, decide on a design review.
- Check other similar types and be careful not to make only some type aliases.

## interface
- The interface is named with a noun using the upper camel case. I is not added at the beginning. <br/>
 // Collection hierarchy interface <br />
 Collection <br />

## Class
- Classes are named by nouns using the upper camel case.
- If the class is an inherited class, name it so that the parent class is easy to understand. <br/>
// Parent class <br />
ButtonEventHandler <br />
// Child class <br />
OKButtonEventHandler <br />

## Properties, accessors, member variables
- Properties and accessors are named with nouns or adjectives using camelcase.
- Global variables are prohibited.
- Public and protected member variables are prohibited, and accessors are exposed as an alternative.
- For private members, write an underscore at the beginning. To avoid duplication with accessors.

The detailed naming convention is shown below.
  - Do not describe "is", "has", "can", and "should" in the prefix of the property that manages logical values.
Basically, verbs are not used, but the attribute names of the interface for argument options can be used exceptionally.
  - Write "count" as a suffix in the property that manages the number of objects. <br/>
// Good example <br />
visible, length, propertyCount; <br />
MapViewOptions.showScaleBar; <br />
// Bad example: <br />
isVisible, doRecursive; <br />

## Method
- Methods are named with verbs using camel case.
- For protected or private, write an underscore at the beginning.

The method naming convention is shown below.
  - The method that returns an array pluralizes the method name.
  - In the method that returns the logical type, describe "is", "has", "can", and "should" in the prefix.
  // TODO Consider a concrete example.
  - Write "get" in the prefix for the get operation, "add" in the prefix for the add operation, "remove" in the prefix for the delete operation, and "removeAll" in the prefix for the batch delete operation.
  - Asynchronous methods are prefixed with "async".
  - When specifying a condition with an argument, "byXXX" indicates the type of argument.
If there are multiple condition types, do not overload with the same name and give each type a different name.
  - In the case of single and multiple, use the same name as the shared type argument.
  - When specifying an index(int type) as an argument, write "At" in the suffix.
  - For methods that are executed at a certain timing, such as events, add "on" to the prefix and give the event name.

## Variable
- Variables are named using camel case.
- Name according to the width of the scope. Generally, the width of the scope is proportional to the length of the variable name.

## Reserved word
There are three types of reserved words in JavaScript, but do not use them as they may cause errors or malfunctions.
- Reserved keywords in the current version
- Keywords to be added in the current version or later
- Words that cannot be used (keywords used as objects or functions, such as String and parseInt)

For reference, the reserved keywords according to "Standard ECMA-262 ECMAScript(R) Language Specification 5.1 Edition"
Describe the keywords to be added.
- Reserved keywords <br />
break
case
catch
continue
debugger
default
delete
do
else else
finally finally
for
function
if
in
instanceof
new
return
switch
this
throw
try
typeof
var
void
while
with
- Keywords to be added
  - strict mode <br />
implements
interface
let
package
private
protected
public
static
yield
  - Other than strict mode <br />
class
const
enum
export
extends
import
super

## Other
- Constants should be capitalized and words should be concatenated with underscores. <br/>
 const MODE_WORD: string = '0'; <br />
 const MODE_WHITESPACE: number = 1; <br />
 const MODE_COMMENT_BEGIN: number = 2; <br />
 const MODE_COMMENT_END: ​​number = 3; <br />

- Do not use enumerations, use literal types <br/>
 type ResolutionType = 1 | 2 | "auto"; <br />
 type PresetButtonType = "zoom-in" | "zoom-out" | "rotate-right" | "rotate-left" | "compass"; <br />

- The loop variable name used in the for statement can be i or j if there is no risk of confusion, but if necessary, give a meaningful variable name. <br/>
for (let rowIndex = 0; rowIndex <10; rowIndex ++) {<br />
    for (let columnIndex = 0; columnIndex <15; columnIndex ++) {<br />
        ... <br />
    } <br />
} <br />

# Program description rules
## TypeScript source file
TypeScript source files (TS files) should be divided for each function (common use, individual screen use, etc.).

## file organization
Describe the source files in the following order.
- File header comment
- Namespace declaration
- Import declaration
- Class and interface definitions (may be more than one)

- File header comment
The description content of the header comment is as follows.

/*
 COPYRIGHT (C) 2017, HITACHI SOLUTIONS, LTD. ALL RIGHTS RESERVED.
 Hitachi Solutions, Ltd. Confidential */

- Classes and interfaces
  - Multiple classes and interfaces may be defined in one file. Describe each class and interface in the following order.
  - List closely related classes in the same file. However, if it becomes bloated, it will be divided.
  - In addition, the following configuration is divided by functional unit (* ○○ acquisition processing, ○○ update processing, etc.) for each scope.
  - List in order from the one with the widest range within the function. (Public → protected → private)

  - Class and interface declaration
  - Declaration of enumeration
  - Constant declaration
  - Declaration of member variables
  - Constructor
  - Accessor
  - Method

## Accessors and methods
### Proper use of accessors and methods
- Getter <br />
Use accessor for value acquisition process that satisfies the following conditions
  - No arguments (no conditions specified) <br />
 // Good example <br />
 geometry = Feature.geometry; <br />
 id = Feature.id; <br />
 features = FeatureCollection.features; <br />
 value = Point.x; <br />
 // Specify the condition with an argument <br />
 value = Feature.getProperty(name); <br />
 // Bad example <br />
 geom = Feature.getGeometry(); <br />
 id = Feature.getID(); <br />
 features = FeatureCollection.getFeatures(); <br />
 value = Point.getX(); <br />

- Setter <br />
Use the accessor to set the value that satisfies the following conditions
  - Only one argument is the target value
  - No return value <br />
 // Good example <br />
 Feature.geometry = geometry; <br />
 FeatureCollection.features = features; <br />
 // Specify the condition with an argument <br />
 Feature.setProperty(name, value); <br />
 // Bad example <br />
 Feature.setGeometry(geometry); <br />
 FeatureCollection.setFeatures(features); <br />


- Method <br />
Other processing uses methods
  - Data conversion
  - Change the internal state of the object
  - Operation with condition specification <br />
 // Good example <br />
 // Change operation <br />
 FeatureCollection.removeAll(); <br />
 FeatureCollection.addFeature(feature); <br />
 // Conversion operation <br />
 Feature.toJSON(); <br />
 // Condition specification <br />
 FeatureCollection.getFeautreById(id); <br />

- Supplement
  - The accessor cannot change the access level with the setter and getter, or hide only one with @hidden, so if you need to hide the setter, use the method instead of the accessor.
  - Since the accessor cannot call the accessor of the parent class, the common processing is grouped in the method.

 // Good example <br />
 get layer(): Layer {<br />
  return layers; <br />
 } <br />
 /** @hidden prohibited */ <br />
 protected setLayers(layer) {<br />
   this._layer = layer; <br />
 } <br />

 get showing(): boolean {<br />
   // Original processing <br />
   ... <br />
   // return super.showing; // Compile error <br />
   return super.isShowing(); <br />
 } <br/>



## Comment description rules
Shows the rules for writing comments in the program.

### General
TypeScript has the following two types of comments.
- Implementation comment <br />
The part enclosed by "/*" to "*/" and the comment from "//" to the end of the line.
Describes the implementation of a particular code.
- Documentation comment <br />
Some of them are surrounded by "/**" to "*/" that can be searched with the typedoc tool, and describe the code specifications.

 In addition, the points to note when writing comments are shown below.
- Write in Japanese
- Considering the TypeDoc output, the verb comment is-Write in a key.
- Use UTF-8 as the character code.
- The line feed code is CRLF.
- Do not use machine-dependent characters.
- Do not describe specifications that are obvious from the code.
- Describe only the explanation of the processing of the target code.
- No comment nesting.
- Use the MarkDown format for bullet points.
- No correction history is attached.

### Writing style
- Implementation comment
  - Block comment

It is a comment that is written over multiple lines. It is used to explain data structures, algorithms, etc.
Describe as follows.

Enclose the comment with "/* ~ */" and add "*" at the beginning of the line that does not contain "/*" or "*/".
Add the same indentation as the target code. <br/>
 /* <br />
  * Until there are no more records <br/>
  * Read the data <br />
  */ <br />
 for (counter = 0; counter < maxLoops; counter ++) {<br />
    rtn = readData(kind, data); <br />
    if (rtn == -1) {<br />
        ... <br />
    } else {<br />
        ... <br />
    } <br />
    ... <br />
 } <br />


  - One-line comment
This is a comment written one line before the target code. Comment out the entire line and explain the code
It is used and is described as follows. <br/>
 // Add the same indentation as the target code. <br/>
 if (condition) {<br />
    /* Get data from XXX */ <br />
    ... <br />
 } else {<br />
    ... <br />
 } <br />
 if (condition) {<br />
    // Get data from XXX <br />
    ... <br />
 } else {<br />
    ... <br />
 } <br />

  - Postscript comment <br />
It is described after the target line, and comments are made after that until the end of the line.
Post-comments are not used because the formatter does not support indentation.


- Documentation comment <br />
Classes, interfaces, enumerations, constants, member variables, constructors, methods
  It is a comment to be written before. It is used to explain the specifications of the class, and is specified separately in the API description policy.

- Override method <br />
For overrides, see "21_API documentation policy" that describes @override instead of @inheritdoc.
  ```ts
          /** Method description */
          // @override DataHolder
          public setData(key: string, value: Object | null): this {
              this._dataMap = internal.DataHolderUtils.setData(this._dataMap, key, value);
              return this;
          }
  `````

## Source format
- Leverage Visual Studio Code auto-formatting
The format at the time of saving is mandatory.

- Semicolon
Be sure to write ";" (semicolon) at the end.

- Blank line
In the following case, insert one blank line.
  - Between the following elements that make up the source file
    - File header comment
    - Namespace declaration
    - import declaration
    - Class / interface definition
  - Between methods
  - Between the method's local variable declaration and the first statement
  - Before block comment and line comment
  - Between logical blocks in a method
  ――The source code is easy to read, and other parts necessary to improve readability.


- Declaration description
  - Clarification of scope
   Be sure to describe the scope of methods and variables defined in the class as follows.
    - Public <br />
 public getShopName(): string {
    ...
 }

    - Protected <br />
protected _getShopName(): string {
    ...
}

    - Private private _shopName: string = '';

 private _getShopName(): string {
    ...
 }


  - Variable declaration
    - Do not declare multiple variables on one line.
    - Specify the type explicitly without using type inference. However, it may be omitted when initializing with a primitive type.
    - let (*private) + "" (*half-width space) + variable name + ":" (*colon + half-width space) + type name format.
    - Do not use var. <br/>
 /* Good example */ <br />
 let level: number = 0; <br />
 let size = 0; <br />
 let name: string = ''; <br />
 let label = ''; <br />
 let total: number = 10; <br />
 let layer: Layer = new ImageTileLayer(); <br />
 /* Bad example */ <br />
 let level: number, size; <br />
 let layer = new ImageTileLayer(); <br />

    - For object literals, specify the object type literal as the type instead of Object. *When Oject is specified, property access such as "shopData.shopId" is not possible (*shopData['shopId'] is possible)
     Also, you will not be able to duplicate types with typeof. <br/>
 /* Good example */ <br />
 let shopData: {shopId: string, shopName: string} = {shopId: '0001', shopName: 'store 0001'}; <br />
 /* Bad example */ <br />
 var shopData = {shopId: '0001', shopName: 'store 0001'}; <br />
 var shopData: Object = {shopId: '0001', shopName: 'Store 0001'}; <br />

  - Unify to use [] when declaring an array. <br/>
 /* Good example */ <br />
 var numAry: number[] = [10, 20, 30]; <br />
 /* Bad example */ <br />
 var numAry: Array<number> = [10, 20, 30]; <br />

  - Prohibition of declaring variables with the same name <br />
Global variables, class variables, method arguments, local variables within methods, etc.
  Do not use the same variable name regardless of the variable scope or declaration location.
 private count: number = 0; <br />
 ... <br />
 public myMethod() {<br />
    ... <br />
    if (bar > 10) {<br />
         // Bad example <br />
        let count: number = 0; <br />
        ... <br />
    } <br />
    ... <br />
 } <br />

  - Method declaration order
    - Methods are described in the order of "public" -> "protected" -> "private" for each function.
   (In order to emphasize the ease of understanding the source code, it is summarized in functional units.)

  - Separation position
  - General
    - Do not write more than one sentence on one line. <br/>
 /* Good example */ <br />
 count = 0; <br />
 flag = 0; <br />
 /* Bad example */ <br />
 count = 0; flag = 0; <br />

      - Add "{", "}" even if the content of the if statement, for statement, while statement, etc. is only one line. <br/>
/* Good example */ <br />
if (condition) {<br />
    value = ''; <br />
} <br />
/* Bad example */ <br />
if (condition) value = ''; <br />

    - Even if there is no statement in the processing block with a for statement, while statement, etc., describe "{" + line feed + "}" and describe a comment. <br/>
for (initialization; condition; update) {<br />
    // Why there is no sentence <br />
}; <br />

  - if statement
    - When using compound conditional statements (such as "&&" and "||"), add parentheses to make them easier to read. <br/>
// Normal if statement <br />
if (...) {<br />
... <br />
} <br />
// branching if statement <br />
if (...) {<br />
... <br />
} else {<br />
... <br />
} <br />
// else if example <br />
if (...) {<br />
    ... <br />
} else if (...) {<br />
    ... <br />
} <br />
// If statement of compound condition <br />
if ((hour1 == hour2) && (minute1 == minute2)) {<br />
... <br />
} <br />

  - for statement <br />
  The for statement follows the following format. <br/>
/* Normal (good example) */ <br />
for (initialization; condition; update) {<br />
    ... <br />
} <br />
/* When the processing block is empty (good example) */ <br/>
for (initialization; condition; update) {<br />
    // Reason for no processing <br />
} <br />


  - while statement <br />
  The while statement follows the following format. <br/>
/* Normal */ <br />
while (condition) {<br />
    ... <br />
} <br />
/* If the processing block is empty */ <br />
while (condition) {<br/>
    // Reason for no processing <br />
}; <br />

  - switch-case statement <br />
    The switch-case statement follows the format: <br/>
    - If you want to perform the same processing for multiple values, insert a line break after "case ○:" and write "case △:" in succession. *The way to write "case ○, △:" can be compiled, but
     Do not write in such a way because the pattern of ○ is not judged correctly.
    - Be careful of omission of "break". If you do not describe it, explain it in the comment in that place.
    - Be sure to write "default:" as well. If not reached, issue an exception. <br/>
switch (condition) {<br />
    case KIND_A: <br />
        ... <br />
        /* Do the processing for KIND_B without breaking */ <br />
    case KIND_B: <br />
        ... <br />
        break; <br />
    case KIND_C: <br />
    case KIND_D: <br />
        ... <br />
        break; <br />
    default: {<br />
        throw new LogicError("Invalid condition:" + condition); <br />
    } <br />
} <br />

- try-catch statement <br />
The try-catch statement follows the format below. <br/>
/* Example 1 */ <br />
try {<br />
    ... <br />
} catch (e) {<br />
    ... <br />
} <br />
/* Example 2 */ <br />
try {<br />
    ... <br />
} catch (e) {<br />
    ... <br/>
} finally {<br />
    ... <br />
} <br />

  - return statement <br />
Do not use parentheses in the return statement. (Exception when writing arithmetic expressions) <br />
/* Good example */ <br />
return 0; <br />
/* Bad example */ <br />
return (0); <br/>
/* When returning the operation result */ <br />
return (count + point); <br />

# Precautions at the coding level
Shows various precautions when coding TypeScript source. The notes in this chapter are recommendations.

## Precautions for quality improvement
- Encapsulation of class variables
Declare a class variable as private, and if you want to access it from outside the class, prepare a method to get and set.

- Usage of counter variables
As a general rule, counter variables should be used in a simple manner with an increment of 1, and those whose logic is difficult to understand, such as jumping and decreasing counters, should be used.
  do not use.
Counter variables should be defined within the scope to be used, and should be coded so that they cannot be used outside the scope.

- Judgment statement
Do not use the negative type as much as possible in the judgment sentence. Do not use more than one negative type.

- do-while statement
The do-while statement is prohibited.
* To reduce the pattern of loop description method and to make the code uniform.

- Character code
The character code is unified in the ts file and the html file, and UTF-8 is basically used.

- eval cannot be used <br />
The eval function cannot statically check the character string code specified in the argument.
Also, do not use it because it cannot be compressed correctly by Microsoft Ajax Minifier. <br/>
Use JSON.parse() to evaluate the JSON string.

- String definition
Use "(double quotes) instead of'(single quotes) when defining strings. <br />
// Good example <br />
var myString: string = "Hitachi, Ltd."; <br />
// Bad example <br />
var myString: string = 'Hitachi, Ltd.'; <br />

- Instance destruction
For instances that occupy a lot of memory, consider setting it to null when the variable is no longer used.
However, at the end of the method, it is not necessary to consider the above for local variables in the method.
* Because the instance of the garbage collector is automatically destroyed when the method ends and the scope of the variable goes out of scope.

- Comparison operator
Use strict operators instead of regular operators for comparison operators.
  - Comparison content Normal operator Strict operator
  - Equivalence Equivalence Operator (==) Strict Equivalence Operator (===)
  - Inequal inequality operator (!=) Strict inequality operator (!==) <br />
// Good example <br />
if ('' === shopName) {<br/>
	... <br />
} else {<br />
... <br />
} <br />
if (0 !== shopCount) {<br />
	... <br />
} else {<br />
... <br />
} <br/>
// Bad example <br />
if ([1,2,3] == [1,2,3]) {<br />
	... <br />
} else {<br />
... <br />
} <br />
if (1 != valid) {<br />
	... <br />
} else {<br />
... <br />
} <br />
<br/>
For the same reason, do not use operator assignment for ||.

// Good example <br />
value = (param !== undefined) ? param : value; <br />
// Bad example <br />
value = param || defaultValue; <br />

If the type to be compared with a normal operator is different, after the type conversion is automatically performed as shown below.
Will be compared. Therefore, the original equivalence and inequality may result in unintended results.
<Automatic type conversion of normal operators>
- When comparing numbers to strings, strings are converted to numbers
- Convert to true⇒1 and false⇒0 for boolean type <br />
// Numbers and Booleans <br />
alert(1 == true); // true <br />
alert(0 == false); // true <br />
alert(1 === true); // false <br />
alert(0 === false); // false <br />
// Numbers and strings <br />
var a = 10; <br />
var b = "10"; <br />
alert(a == b); // true <br />
alert(a === b); // false <br />
// Object <br />
var a = [1,2,3]; <br />
var b = a; <br />
alert(a == b); // true <br />
alert(a == [1,2,3]); // false <br />
// Strings and String objects <br />
var a = "abc"; <br />
var b = new String("abc"); <br />
alert(a == b); // true <br />
alert(a === b); // false <br />
alert(a === b.toString()); // true <br />
<br/>

- Specify the value to be compared in judgment statements such as if statements so that incorrect judgment processing is not performed in unintended automatic type conversion (do not use abbreviations)

    ■ Example 1
    `````
      let myBoolValue = true;

      // OK
      if (myBoolValue === true) {
      }

      // NG
      if (myBoolValue) {
      }
    `````
    ■ Example 2
    `````
      let myNullValue = null;

      // OK
      if (myNullValue !== null) {
      }

      // NG
      if (myNullValue) {
      }
    `````
    ■ Example 3
    `````
      let myUndefinedValue = undefined;

      // OK
      if (myUndefinedValue !== undefined) {
      }

      // NG
      if (myUndefinedValue) {
      }
    `````



  - Comma description after the final element <br />
Write "," (comma) after the final elements such as object literals, array literals, and enumerations. <br/>
// Good example <br />
var Color = {<br />
    RED: 0, <br />
    GREEN: 1, <br />
    BLUE: 2, <br />
}; <br />

  - Try-catch statement carefully selects where to use <br />
Since it becomes difficult to investigate when a Script error occurs, the try-catch statement is a place where post-processing when an error occurs is absolutely necessary.
use.
If you want to catch an error and continue processing, you can check the error information by re-throwing or outputting the error log.
Consider implementation.

  - Prohibition of implicit any type <br />
Implicit any type is prohibited. <br/>
*Describe the source that can be compiled by specifying the compile option "- noImplicitAny".

  - Do not use any type as much as possible <br />
Avoid using any type as much as possible, and use generics and interface extensions.

  - Class-based coding <br />
Code based on class, and do not set prototype in typescript. *To expand the range of static type checking of the compiler.

  - Make it as immutable as possible <br />
If there is no clear need, use the readonly keyword, Object.freeze(), etc. to make it an immutable object.

// TODO


  - Avoid magic numbers (excluded from tslint) <br />
Avoid magic numbers as much as possible and create constants and variables with appropriate names.

  - Do not ignore tslint warnings <br />
Basically all tslint warnings are addressed. Use Disabled to suppress only when it is truly unavoidable.

  - Use Array.isArray() to determine if it is an array

  - Do not mix multiple types of data in an array <br />
  Since the array sorting (sort function) processing may differ depending on the browser, do not mix multiple types of data in one array or implement processing that depends on the sorting result.

## Precautions for improving performance
- Do not uselessly new
Object new is necessary on a daily basis, but it is expensive, so be conscious of reducing the number of times as much as possible.
However, for that reason, avoid reducing maintainability by expanding the scope of variables and reusing them.

## Notes on return value
- Do not return the objects held inside as they are
If a reference type member is returned directly, the member data may change because the caller changes the return value. Therefore, the property acquired from Feature basically creates a copy and returns it. <br/>
If you have to return it directly due to performance problems, specify in the API document that it cannot be changed, and use an immutable interface such as ReadonlyArray if possible. However, in that case, take into account that it can be changed if JavaScript or cast is used.


## Notes on arguments
- Do not change the argument <br />
If you change the contents of the reference type argument directly in each method, the value of the variable given as the argument may change without the caller of the method being aware of it, so basically it is not changed. ..

- Do not store arguments as they are <br />
If the reference type argument is stored as it is, the member data may change due to the caller changing the content of the argument, so if the argument is not an immutable object, the property obtained from Feature will generate a copy. And store it.
If you have to store it directly due to performance issues, specify in the API documentation that it cannot be changed after the call.

- Check the prerequisites for arguments <br />
Check the range and contents of the value.
However, if it is called a huge number of times and it adversely affects performance, the check process can be avoided exceptionally.
// Think about TODO debug options when creating common processes


# Wordbook
Describe words when coding TypeScript source
  - When dealing with numbers, use the singular + Count. Length is length, Size is size
  - Use opacity for transparency according to web standards.
However, the Canvas drawing API uses alpha(transparency) according to the Canvas API.
  - Use Type for the operation method and Style for the display shape.




that's all
