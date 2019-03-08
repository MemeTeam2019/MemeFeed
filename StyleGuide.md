# MemeFeed Style Guide



## General Guidelines

-   Two space tab
-   Keep lines under 80 chars long
-   `NormalCase` for classes (components, screens, etc.)
-   `NormalCase` for files
-   `camelCase` for variables and functions
-   Use `const` as much as possible
    -   Ensure variables aren't modified accidentally if they were never intended to be modified
-   When declaring an object literal, always leave whitespace between curly braces and text
    -   `const myObject = { key1: val1 };`
-   Always use semicolons at the end of each each statement
    -   `this.setState({ someState: someValue });`
    -   `this.state = { moreState: anotherVal };`
-   …but not for curly braces denoting scope, like so:
    -   `myFunc = () => { this.doStuff(); }`



## Examples

**Always, always ALWAYS comment what props a certain component is expecting in a block comment for the class**. When commenting a class, use a block-style comment (see below). For inline comments, use `//` on a newline above the subject of the comment and a newline above the comment:

```javascript
/**
 * A very nice component to render some text. This is an example block comment
 *
 * Props: uid, username
 */
class SomeComponent extends React.Component {
  constructor(props) {
    super(props);
    
    // Function to do some stuff
    this.doSomeStuff();
    
    // Note the newline above
    this.state = {
      uid: this.props.uid,
      username: this.props.username
    };
  }
  
  // Render some text
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
	...
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
```



Always use parentheses for arrow functions:

```javascript
renderItem = (item, index) => {
  item.doStuff();
  console.log(index);
}

// Good
anotherFunction = (item) => {
	item.doSomeOtherStuff();
}

// Bad
someOtherFcn = item => {
  item.doSomething();
}
```