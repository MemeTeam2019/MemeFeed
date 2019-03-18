# MemeFeed Style Guide



## General Guidelines



### Formatting

-   Two space tab
-   Keep lines under 80 chars long
-   Always use semicolons at the end of each each statement
    -   `this.setState({ someState: someValue });`
    -   `this.state = { moreState: anotherVal };`
-   …but not for curly braces denoting scope, like so:
    -   `myFunc = () => { this.doStuff(); }`
-   `NormalCase` for classes (components, screens, etc.)
-   `NormalCase` for files
-   `camelCase` for variables and functions
-   Importing:
    -   Delete unused imports, get a package or VSCode which automatically highlights imports which aren't used
    -   Don't use wildcard imports
-   Curly braces preceded with a space when denoting a scope
    -   `const myFunc = function foo() { doStuff(); }`
-   Install and use `prettier` with the `.prettierrc`


### Comments

-   Use multiline comment block when commenting a component/screen/class
    -   See Examples section
-   Use `//` for inline comments
    -   Add a space between the `//` and the comment (see any example)
    -   Put comment on the line above the subject of the comment
    -   Pad the comment with a newline above unless the comment is the first thing in the scope
-   Denote important comments with double asterisks
    -   `// ** Make sure to pass the props through this.props.navigation! **`



### Variables

-   Use `const` as much as possible
    -   Ensure variables aren't modified accidentally if they were never intended to be modified
-   Use `let` whenever possible instead of `var`
    -   Behaves exactly like variable declaration in other languages
    -   `var` declares a variable in the global scope, prone to bugginess
-   When declaring an object literal, always leave whitespace between curly braces and text
    -   `const myObject = { key1: val1 };`



### Strings

-   Use single quotes when declaring a string
    -   `const greeting = 'Hello, world!';`
-   When building strings, use templates rather than string concatenation:
    -   `const myString = 'Hello ${name}, my name is Jon.';`
-   Use backslash `\` to separate long strings which span multiple lines

```javascript
const longBoi = 'Lorem ipsum some other latin words haha i don\'t remember \
	the rest of the standard latin string which is used as a placeholde lool \
	yeah this string is long enough I\'m tired of typing';
```



## Examples

**Always, always ALWAYS comment what props a certain component is expecting in a block comment for the class**. When commenting a class, use a block-style comment (see below). For inline comments, use `//` on a newline above the subject of the comment and a newline above the comment:

```javascript
/**
 * A very nice component to render some text. This is an example block comment
 *
 * Props
 * -----
 * uid: String
 * username: String
 * items: Array[Objects]
 */
class SomeComponent extends React.Component {
  constructor(props) {
    // No newline above needed here
    super(props);
    
    // Function to do some stuff
    this.doSomeStuff();
    
    // Note the newline before the inline comment
    this.state = {
      uid: this.props.uid,
      username: this.props.username,
      items: this.props.itemsToRender
    };
  }
  
  // Always precede a curly brace with a space!!
  render() {
    return (
      <Text>Some text</Text>
    );
  }
}
```



When exporting stuff, do so at the bottom of the file:

```javascript
class toExport extends React.Component {
	// ...
}
 
export default toExport;
```



When setting more than one key-value pair in an object, separate with a newline:

```javascript
// Good
this.state = { state: val };

// Bad
this.state = {state: val};

// Good
this.setState({
  state1: val1,
  state2: val2,
  state3: val3
});

// Bad
this.setState({ Hello: world, this: is, really: unreadable });
```



Always use parentheses for arrow functions:

```javascript
renderItem = (item, index) => {
  this.doStuff(item);
  console.log(index);
}

// Good
anotherFunction = (item) => {
	this.doSomeOtherStuff(item);
}

// Bad
someOtherFcn = item => {
  this.dontDoThis(item);
}
```
