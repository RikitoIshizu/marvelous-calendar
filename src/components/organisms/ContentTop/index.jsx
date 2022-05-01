import classes from "./index.module.css";

export function ContentTop(props) {
  return (
    <div>
      <h1 className={classes.title}>{props.title}</h1>

      <p className={classes.description}>
        Get started by editing{" "}
        <code className={classes.code}>pages/{props.title}.js</code>
      </p>
    </div>
  );
}
